# Nossa Jornada de Amor

Site interativo feito com React, TypeScript e Vite. No último nível, a opção escolhida é enviada por uma função serverless, sem expor credenciais no navegador.

## Rodar localmente

Requisitos: Node.js 20 ou mais recente.

```bash
npm install
npm run dev
```

O site abre em `http://localhost:3000`. Para testar também a função de notificação localmente, use a CLI da Vercel:

```bash
npm install -g vercel
vercel dev
```

## Configurar a notificação

Copie `.env.example` para `.env.local` e escolha um canal em `NOTIFICATION_CHANNEL`.

### E-mail com Resend

1. Crie uma conta em [resend.com](https://resend.com) e gere uma API key.
2. Configure `NOTIFICATION_CHANNEL=email`.
3. Preencha `RESEND_API_KEY` e `NOTIFICATION_EMAIL`.
4. Para produção, valide seu domínio no Resend e ajuste `NOTIFICATION_FROM_EMAIL`. O remetente de teste `onboarding@resend.dev` só entrega para o e-mail da própria conta Resend.

### Telegram

1. Crie um bot com o `@BotFather` e envie uma mensagem para esse bot.
2. Configure `NOTIFICATION_CHANNEL=telegram`.
3. Preencha `TELEGRAM_BOT_TOKEN` e `TELEGRAM_CHAT_ID`.

## Deploy na Vercel

1. Importe o repositório em [vercel.com](https://vercel.com).
2. Em **Settings → Environment Variables**, cadastre as mesmas variáveis do canal escolhido.
3. Faça o deploy. O framework, o build e a função `/api/notify` já estão definidos em `vercel.json`.

Antes de publicar, rode:

```bash
npm run lint
npm run build
```
