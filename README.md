# Analytics + Dashboard Admin + Compliance (LGPD / GDPR / ePrivacy)

Este projeto possui:

- Tracking proprio de `click`, `pageview` e `duration` em SPA React.
- Backend serverless em Vercel (`/api/*`) com Supabase (service role apenas no backend).
- Dashboard admin protegido por cookie `HttpOnly` em `/pt/loginadm`.
- Camada de consentimento e privacidade por padrao (analytics opcional e desativado ate opt-in).

## 1) Arquitetura

### Endpoints Vercel

- `POST /api/track`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/auth/logout`
- `GET /api/analytics`

### Banco Supabase

- Schema principal: `supabase/schema.sql`
- Retencao: `supabase/retention.sql`

## 2) Setup Supabase

1. Crie o projeto no Supabase.
2. No SQL Editor, rode:
   - `supabase/schema.sql`
3. (Opcional) Configure retencao automatica com:
   - `supabase/retention.sql`

## 3) Variaveis de ambiente (Vercel)

Configure em `Project -> Settings -> Environment Variables`:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_PASSWORD`
- `JWT_SECRET`
- `ALLOWED_ORIGIN=https://www.comercias.com.br`
- `ANALYTICS_ENABLED=true`

Opcional no front:

- `REACT_APP_DISABLE_ANALYTICS=false`

Referencia:

- `.env.example`

Importante:

- Nao use prefixo `REACT_APP_` para segredos.
- `SUPABASE_SERVICE_ROLE_KEY` deve existir somente no backend.

## 4) Compliance implementado

### Politicas de transparencia

Paginas criadas:

- `/:lang/privacy` (`src/pages/PrivacyPolicyPage.js`)
- `/:lang/cookies` (`src/pages/CookiesPolicyPage.js`)

Conteudo coberto:

- dados coletados (cliques, path, duracao, user-agent, session_id e ip_hash)
- finalidade (medicao de audiencia e melhoria do site)
- base legal (LGPD + consentimento para analytics opcional)
- retencao (90 dias padrao)
- canal para solicitacoes do titular

Links para politicas e preferencia de cookies:

- adicionados no rodape (`src/components/Footer.js`)

### Consentimento / opt-out (modo seguro)

Implementado em:

- `src/context/ConsentContext.js`
- `src/consent/consentStorage.js`
- `src/components/CookieConsentManager.js`

Regras:

- categoria `Necessarios` sempre ativa
- categoria `Medicao/Analytics` desativada por padrao
- analytics so inicia apos consentimento explicito
- recusa nao bloqueia o uso do site
- revogacao simples via link `Configurar cookies` no rodape
- estado de consentimento armazenado em localStorage + cookie de 1a parte, com timestamp da decisao
- DNT (`Do Not Track`) respeitado por padrao (analytics inicia desativado)

### Minimizacao de dados

- sem coleta de conteudo digitado
- sem IP puro (somente `ip_hash` com sal no backend)
- path enviado sem querystring/hash
- `data-track` priorizado para elementos; fallback curto seguro
- `textSnippet` removido para reduzir risco de capturar dado contextual sensivel

### Dashboard sem dados pessoais diretos

- `GET /api/analytics` retorna apenas agregados:
  - serie temporal de cliques
  - top paginas
  - media de duracao por pagina
  - top elementos

## 5) Retencao (90 dias)

Script:

- `supabase/retention.sql`

Opcao manual:

```sql
DELETE FROM public.events
WHERE created_at < now() - interval '90 days';
```

Opcao agendada:

- usar `pg_cron` (quando habilitado) conforme exemplo no arquivo `supabase/retention.sql`

## 6) Desativar analytics globalmente (emergencial)

Backend:

- `ANALYTICS_ENABLED=false`
- efeito: `/api/track` responde `ok`, mas nao persiste eventos

Frontend:

- `REACT_APP_DISABLE_ANALYTICS=true`
- efeito: tracking client nao inicializa

## 7) Teste local

1. Instale deps:

```bash
npm install
```

2. Preencha `.env.local` com base em `.env.example`.
3. Rode:

```bash
npm start
```

4. Valide:

- banner de cookies aparece no primeiro acesso
- recusando analytics, o site continua normal e sem envio de tracking
- aceitando analytics, eventos entram no Supabase
- `GET /api/analytics` retorna `401` sem sessao admin
- `/pt/loginadm` autentica e mostra dashboard

## 8) Deploy / producao

1. Configure env vars na Vercel.
2. Rode deploy/redeploy.
3. Acesse:
   - `https://www.comercias.com.br/pt/loginadm`
   - `https://www.comercias.com.br/pt/privacy`
   - `https://www.comercias.com.br/pt/cookies`
