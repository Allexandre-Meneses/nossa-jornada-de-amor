const ALLOWED_CHOICES = [
  'Vamos ser só amigos mesmo.',
  'Podemos tentar.',
  'Até que emfim',
] as const;

function json(body: object, status = 200) {
  return Response.json(body, {
    status,
    headers: { 'Cache-Control': 'no-store' },
  });
}

function formatDate() {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'full',
    timeStyle: 'short',
    timeZone: 'America/Fortaleza',
  }).format(new Date());
}

async function sendTelegramNotification(choice: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    throw new Error('Telegram não configurado');
  }

  const telegramResponse = await fetch(
    `https://api.telegram.org/bot${token}/sendMessage`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: `💌 Ela respondeu no site!\n\nOpção escolhida: ${choice}\n\nQuando: ${formatDate()}`,
      }),
    }
  );

  if (!telegramResponse.ok) {
    throw new Error('Falha no envio pelo Telegram');
  }
}

async function sendEmailNotification(choice: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const recipient = process.env.NOTIFICATION_EMAIL;
  const sender =
    process.env.NOTIFICATION_FROM_EMAIL ||
    'Nossa Jornada <onboarding@resend.dev>';

  if (!apiKey || !recipient) {
    throw new Error('E-mail não configurado');
  }

  const emailResponse = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: sender,
      to: [recipient],
      subject: '💌 Ela respondeu no site!',
      html: `
        <div style="font-family: Arial, sans-serif; color: #1f2937; line-height: 1.6">
          <h1 style="color: #dc2626; font-size: 22px">Ela respondeu!</h1>
          <p><strong>Opção escolhida:</strong> ${choice}</p>
          <p><strong>Quando:</strong> ${formatDate()}</p>
        </div>
      `,
    }),
  });

  if (!emailResponse.ok) {
    throw new Error('Falha no envio do e-mail');
  }
}

export default {
  async fetch(request: Request) {
    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Método não permitido.' }), {
        status: 405,
        headers: {
          Allow: 'POST',
          'Cache-Control': 'no-store',
          'Content-Type': 'application/json; charset=utf-8',
        },
      });
    }

    try {
      const body: unknown = await request.json();
      const choice =
        typeof body === 'object' && body !== null && 'choice' in body
          ? (body as { choice?: unknown }).choice
          : undefined;

      if (
        typeof choice !== 'string' ||
        !ALLOWED_CHOICES.includes(choice as (typeof ALLOWED_CHOICES)[number])
      ) {
        return json({ error: 'Opção inválida.' }, 400);
      }

      const channel = process.env.NOTIFICATION_CHANNEL?.toLowerCase();

      if (channel === 'telegram') {
        await sendTelegramNotification(choice);
      } else if (channel === 'email') {
        await sendEmailNotification(choice);
      } else {
        return json({ error: 'Canal de notificação não configurado.' }, 503);
      }

      return json({ ok: true });
    } catch (error) {
      console.error('Erro ao enviar notificação:', error);
      return json({ error: 'Falha ao enviar notificação.' }, 500);
    }
  },
};
