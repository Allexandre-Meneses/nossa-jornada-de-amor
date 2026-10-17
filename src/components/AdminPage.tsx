import {FormEvent, useCallback, useEffect, useState} from 'react';
import {
  Clock3,
  Heart,
  LoaderCircle,
  LockKeyhole,
  LogOut,
  RefreshCw,
} from 'lucide-react';

interface ChoiceRecord {
  id: string;
  choice: string;
  selectedAt: string;
}

const ADMIN_SESSION_KEY = 'romantic_journey_admin_password_v1';

function formatChoiceDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return 'Horário indisponível';

  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'long',
    timeStyle: 'short',
    timeZone: 'America/Fortaleza',
  }).format(date);
}

export function AdminPage() {
  const [password, setPassword] = useState(
    () => sessionStorage.getItem(ADMIN_SESSION_KEY) ?? ''
  );
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [responses, setResponses] = useState<ChoiceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const loadResponses = useCallback(async (adminPassword: string) => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/responses', {
        headers: {
          Authorization: `Bearer ${adminPassword}`,
        },
        cache: 'no-store',
      });

      if (response.status === 401) {
        sessionStorage.removeItem(ADMIN_SESSION_KEY);
        setIsAuthenticated(false);
        throw new Error('Senha incorreta. Tente novamente.');
      }

      if (!response.ok) {
        throw new Error('Não foi possível carregar as respostas agora.');
      }

      const data = (await response.json()) as {responses?: ChoiceRecord[]};
      setResponses(Array.isArray(data.responses) ? data.responses : []);
      setIsAuthenticated(true);
      sessionStorage.setItem(ADMIN_SESSION_KEY, adminPassword);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : 'Não foi possível carregar as respostas agora.'
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const savedPassword = sessionStorage.getItem(ADMIN_SESSION_KEY);
    if (savedPassword) void loadResponses(savedPassword);
  }, [loadResponses]);

  const handleLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (password.trim()) void loadResponses(password);
  };

  const handleLogout = () => {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    setPassword('');
    setResponses([]);
    setError('');
    setIsAuthenticated(false);
  };

  return (
    <div className="min-h-screen min-h-[100dvh] bg-[#fffafa] text-[#1f2937]">
      <div className="ribbon-top" />
      <div className="ribbon-top-subtle" />

      <main className="mx-auto w-full max-w-3xl px-5 py-10 sm:px-8 sm:py-14">
        <header className="mb-8 flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-100 text-[#dc2626]">
            <Heart className="h-6 w-6" fill="currentColor" aria-hidden="true" />
          </div>
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#dc2626]">
              Nossa Jornada
            </p>
            <h1 className="font-romantic text-3xl font-bold text-[#1f2937] sm:text-4xl">
              Painel administrativo
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              Consulte a opção escolhida e o horário em que a resposta foi registrada.
            </p>
          </div>
        </header>

        {!isAuthenticated ? (
          <section className="rounded-3xl border border-red-100 bg-white p-6 shadow-romantic-md sm:p-8">
            <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 text-gray-700">
              <LockKeyhole className="h-5 w-5" aria-hidden="true" />
            </div>
            <h2 className="font-romantic text-xl font-bold">Acesso restrito</h2>
            <p className="mt-1 text-sm text-gray-600">
              Digite a senha de administrador para visualizar as respostas.
            </p>

            <form onSubmit={handleLogin} className="mt-6 space-y-4">
              <div>
                <label htmlFor="admin-password" className="mb-2 block text-sm font-semibold text-gray-700">
                  Senha
                </label>
                <input
                  id="admin-password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="current-password"
                  required
                  className="min-h-[48px] w-full rounded-xl border border-gray-200 bg-white px-4 text-sm outline-none transition focus:border-[#dc2626] focus:ring-4 focus:ring-red-100"
                  placeholder="Digite sua senha"
                />
              </div>

              {error && (
                <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={isLoading || !password.trim()}
                className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-[#dc2626] px-5 text-sm font-semibold text-white shadow-md shadow-red-500/20 transition hover:bg-[#b91c1c] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading && <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />}
                {isLoading ? 'Entrando...' : 'Entrar no painel'}
              </button>
            </form>
          </section>
        ) : (
          <section>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-gray-800">
                  {responses.length === 1
                    ? '1 resposta registrada'
                    : `${responses.length} respostas registradas`}
                </p>
                <p className="mt-0.5 text-xs text-gray-500">Horário de Fortaleza</p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => void loadResponses(password)}
                  disabled={isLoading}
                  className="inline-flex min-h-[42px] items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 text-xs font-semibold text-gray-700 transition hover:border-red-200 hover:text-[#dc2626] disabled:opacity-50"
                >
                  <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} aria-hidden="true" />
                  Atualizar
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex min-h-[42px] items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 text-xs font-semibold text-gray-700 transition hover:border-red-200 hover:text-[#dc2626]"
                >
                  <LogOut className="h-4 w-4" aria-hidden="true" />
                  Sair
                </button>
              </div>
            </div>

            {error && (
              <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
                {error}
              </p>
            )}

            {responses.length === 0 && !isLoading ? (
              <div className="rounded-3xl border border-dashed border-red-200 bg-white px-6 py-14 text-center">
                <Heart className="mx-auto h-7 w-7 text-red-300" aria-hidden="true" />
                <h2 className="mt-4 font-romantic text-xl font-bold">Nenhuma resposta ainda</h2>
                <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-gray-500">
                  Quando uma opção for escolhida no último nível, ela aparecerá aqui.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {responses.map((record, index) => (
                  <article
                    key={record.id}
                    className="rounded-2xl border border-red-100 bg-white p-5 shadow-romantic-sm sm:flex sm:items-center sm:justify-between sm:gap-5"
                  >
                    <div className="min-w-0">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#dc2626]">
                        {index === 0 ? 'Resposta mais recente' : `Resposta ${responses.length - index}`}
                      </p>
                      <p className="mt-1.5 font-romantic text-lg font-bold text-gray-900">
                        {record.choice}
                      </p>
                    </div>
                    <div className="mt-3 flex shrink-0 items-center gap-2 text-xs text-gray-500 sm:mt-0 sm:max-w-[250px] sm:text-right">
                      <Clock3 className="h-4 w-4 shrink-0 text-red-400" aria-hidden="true" />
                      <time dateTime={record.selectedAt}>{formatChoiceDate(record.selectedAt)}</time>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
