# Analytics Proprietario + Dashboard Admin (`/pt/loginadm`)

Este projeto agora possui:

- Coleta de eventos de analytics no front (`click`, `pageview`, `duration`) com batching.
- Backend serverless na Vercel (`/api/*`) para autenticacao e agregacoes.
- Persistencia em Supabase (Postgres) via `service_role` apenas no backend.
- Dashboard protegido por senha em `https://www.comercias.com.br/pt/loginadm`.

## 1) Supabase: criar tabela de eventos

1. Crie um projeto no Supabase.
2. Abra `SQL Editor`.
3. Rode o script `supabase/schema.sql`.

Esse script cria:

- extensao `pgcrypto`
- tabela `events`
- indices por `created_at`, `(type, created_at)` e `(path, created_at)`

## 2) Variaveis de ambiente (Vercel)

Configure no painel da Vercel:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_PASSWORD`
- `JWT_SECRET`
- `ALLOWED_ORIGIN=https://www.comercias.com.br`

Referencias:

- Arquivo de exemplo: `.env.example`
- Caminho no painel: `Project -> Settings -> Environment Variables`

Importante:

- Nao use `REACT_APP_` para secrets.
- `SUPABASE_SERVICE_ROLE_KEY` deve ficar somente no backend (`/api`).

## 3) Endpoints criados (Vercel Functions)

- `POST /api/track`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/auth/logout`
- `GET /api/analytics`

Regras:

- Sessao admin por cookie `HttpOnly` com JWT assinado.
- `/api/analytics` retorna `401` sem cookie valido.
- `rate limit` basico em `/api/auth/login` e `/api/track`.

## 4) Front-end

### Tracking client

Arquivo: `src/analytics/analyticsClient.js`

Implementado:

- `session_id` persistido em `localStorage`
- captura global de clique (`addEventListener('click', ..., true)`)
- ignorar `input`, `textarea`, `contenteditable`
- payload seguro de elemento (`selector`, `tag`, `id`, ate 3 classes, `dataTrack`, `textSnippet` ate 60 chars)
- batching com flush periodico e em `visibilitychange/beforeunload/pagehide`
- pageview e duracao por rota SPA

### Dashboard admin

Rota unica: `/pt/loginadm`

Arquivo: `src/pages/AdminDashboardPage.js`

Fluxo:

1. chama `/api/auth/me`
2. se nao autenticado, mostra login
3. se autenticado, mostra dashboard com:
   - cards de resumo
   - grafico de tendencia (Recharts)
   - tabelas: top paginas, top elementos, tempo medio por pagina

Filtros de tempo:

- preset: `24h`, `7d`, `30d`
- custom: `from/to` (ISO via `datetime-local`)

Layout desktop:

- `height: 100vh`
- sem scroll no body
- scroll apenas dentro dos blocos internos

## 5) Rewrites na Vercel

Arquivo: `vercel.json`

Ordem aplicada:

1. `/api/(.*) -> /api/$1`
2. `/(.*) -> /index.html`

Assim as serverless functions nao sao reescritas para SPA.

## 6) Rodar localmente

1. Instale dependencias:

```bash
npm install
```

2. Crie `.env.local` com as variaveis de `.env.example`.
3. Rode:

```bash
npm start
```

4. Teste:

- Navegue no site e gere cliques/pageviews.
- Acesse `http://localhost:3000/pt/loginadm`.
- Login com `ADMIN_PASSWORD`.
- Verifique dados chegando no dashboard e na tabela `events` do Supabase.

## 7) Deploy e validacao em producao

1. Confirme variaveis no projeto da Vercel.
2. Faça deploy (ou redeploy).
3. Acesse `https://www.comercias.com.br/pt/loginadm`.
4. Criterios esperados:

- eventos `click/pageview/duration` sendo inseridos no Supabase
- `/api/analytics` com `401` sem cookie valido
- login OK com senha correta
- dashboard em uma tela desktop (100vh)
