const ALLOWED_CHOICES = [
  'Vamos ser só amigos mesmo.',
  'Podemos tentar.',
  'Até que emfim',
] as const;

const RESPONSES_KEY = 'romantic_journey:final_responses:v1';
const MAX_STORED_RESPONSES = 100;

interface ApiRequest {
  method?: string;
  body?: unknown;
  headers: Record<string, string | string[] | undefined>;
}

interface ApiResponse {
  status: (statusCode: number) => ApiResponse;
  setHeader: (name: string, value: string) => void;
  json: (body: object) => void;
}

interface StoredResponse {
  id: string;
  choice: string;
  selectedAt: string;
}

function getRedisConfig() {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    throw new Error('Banco de dados não configurado.');
  }

  return {url: url.replace(/\/$/, ''), token};
}

async function redisCommand<T>(command: Array<string | number>): Promise<T> {
  const {url, token} = getRedisConfig();
  const redisResponse = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(command),
  });

  if (!redisResponse.ok) {
    throw new Error('Falha ao acessar o banco de dados.');
  }

  const payload = (await redisResponse.json()) as {result?: T; error?: string};
  if (payload.error) throw new Error(payload.error);
  return payload.result as T;
}

function getBearerToken(request: ApiRequest) {
  const header = request.headers.authorization;
  const value = Array.isArray(header) ? header[0] : header;
  return value?.startsWith('Bearer ') ? value.slice(7) : '';
}

function getChoice(body: unknown) {
  let parsedBody = body;

  if (typeof body === 'string') {
    try {
      parsedBody = JSON.parse(body);
    } catch {
      return undefined;
    }
  }

  return typeof parsedBody === 'object' && parsedBody !== null && 'choice' in parsedBody
    ? (parsedBody as {choice?: unknown}).choice
    : undefined;
}

function createId() {
  return `${Date.now().toString(36)}-${crypto.randomUUID()}`;
}

async function saveResponse(choice: string) {
  const record: StoredResponse = {
    id: createId(),
    choice,
    selectedAt: new Date().toISOString(),
  };

  await redisCommand<number>(['LPUSH', RESPONSES_KEY, JSON.stringify(record)]);
  await redisCommand<string>(['LTRIM', RESPONSES_KEY, 0, MAX_STORED_RESPONSES - 1]);

  return record;
}

async function listResponses() {
  const stored = await redisCommand<string[]>([
    'LRANGE',
    RESPONSES_KEY,
    0,
    MAX_STORED_RESPONSES - 1,
  ]);

  return (stored ?? []).flatMap((value) => {
    try {
      const record = JSON.parse(value) as StoredResponse;
      return record.id && record.choice && record.selectedAt ? [record] : [];
    } catch {
      return [];
    }
  });
}

export default async function handler(request: ApiRequest, response: ApiResponse) {
  response.setHeader('Cache-Control', 'no-store');

  try {
    if (request.method === 'POST') {
      const choice = getChoice(request.body);

      if (
        typeof choice !== 'string' ||
        !ALLOWED_CHOICES.includes(choice as (typeof ALLOWED_CHOICES)[number])
      ) {
        return response.status(400).json({error: 'Opção inválida.'});
      }

      const record = await saveResponse(choice);
      return response.status(201).json({ok: true, response: record});
    }

    if (request.method === 'GET') {
      const adminPassword = process.env.ADMIN_PASSWORD;

      if (!adminPassword || getBearerToken(request) !== adminPassword) {
        return response.status(401).json({error: 'Acesso não autorizado.'});
      }

      const responses = await listResponses();
      return response.status(200).json({responses});
    }

    response.setHeader('Allow', 'GET, POST');
    return response.status(405).json({error: 'Método não permitido.'});
  } catch (error) {
    console.error('Erro ao processar resposta:', error);
    return response.status(500).json({error: 'Não foi possível processar a resposta.'});
  }
}
