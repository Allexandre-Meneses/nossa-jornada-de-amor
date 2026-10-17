# Nossa Jornada de Amor

Site interativo feito com React, TypeScript e Vite. No último nível, a opção escolhida é salva no servidor e pode ser consultada em uma tela administrativa protegida por senha.

## Rodar localmente

Requisitos: Node.js 20 ou mais recente.

```bash
npm install
npm run dev
```

O site abre em `http://localhost:3000`. A tela administrativa fica em `http://localhost:3000/admin`.

Para testar também as funções da API localmente, use a CLI da Vercel:

```bash
npm install -g vercel
vercel dev
```

## Configurar o painel administrativo

1. Na Vercel, adicione uma integração de Redis da Upstash ao projeto.
2. Confirme que foram criadas as variáveis `KV_REST_API_URL` e `KV_REST_API_TOKEN`. Os nomes `UPSTASH_REDIS_REST_URL` e `UPSTASH_REDIS_REST_TOKEN` também são aceitos.
3. Crie a variável `ADMIN_PASSWORD` com uma senha forte.
4. Faça um novo deploy.
5. Acesse `/admin` no mesmo domínio do site e entre com a senha definida.

A senha permanece apenas na sessão da aba do navegador. As respostas são exibidas da mais recente para a mais antiga, com data e horário de Fortaleza. O painel mantém as 100 respostas mais recentes.

## Deploy na Vercel

1. Importe o repositório em [vercel.com](https://vercel.com).
2. Em **Settings → Environment Variables**, configure as variáveis descritas acima.
3. Faça o deploy. O framework, o build, a rota `/admin` e a função `/api/responses` já estão definidos em `vercel.json`.

Antes de publicar, rode:

```bash
npm run lint
npm run build
```
