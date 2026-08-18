# Plano de Restruuturação — editor_html

**Data:** 2026-08-18
**Status:** Em andamento

---

## Decisões

- Execução: Fase por fase com deploy entre cada uma
- Estrutura: `lib/`, `components/`, `hooks/` na raiz do projeto
- Rate limiting: Upstash Redis
- Delete: Rota API + botão no editor
- Design: Neutro/profissional

---

## Fase 1 — Limpeza e Correções Críticas

**Commit:** `chore: cleanup dead files, fix CSS bugs, rename middleware`

### Remover arquivos mortos:
- `app/components/custom-link.tsx`
- `app/loading.tsx`
- `tips.txt`
- `public/file.svg`
- `public/globe.svg`
- `public/next.svg`
- `public/vercel.svg`
- `public/window.svg`

### Renomear:
- `proxy.ts` → `middleware.ts`

### Corrigir `app/globals.css`:
- Adicionar `.animate-fade-in`
- Corrigir dark mode (background escuro)
- Remover `overflow: hidden` global
- Remover `.animate-float`, `.glass-effect`
- Iniciar transição para tema neutro

### Corrigir `package.json`:
- `"name": "editor-html"`
- Adicionar `"db:generate": "drizzle-kit generate"`

---

## Fase 2 — Estrutura de Diretórios

**Commit:** `refactor: reorganize project structure`

### Nova árvore:
```
app/
  api/
    auth/[...nextauth]/route.ts
    pages/
      create/route.ts
      edit/route.ts
      [nanoid]/route.ts
    cron/
      cleanup/route.ts
  p/
    [nanoid]/page.tsx
    create/page.tsx
    edit/[nanoid]/page.tsx
  error.tsx
  not-found.tsx
  layout.tsx
  page.tsx
  providers.tsx
  globals.css
lib/
  auth.ts
  db.ts
  schema.ts
  types.ts
  constants.ts
  pages.ts
  validators.ts
  sanitize.ts
components/
  editor/
    index.tsx
    preview.tsx
    toolbar.tsx
  create-form.tsx
  header.tsx
hooks/
  use-media-query.ts
  use-debounce.ts
types/
  next-auth.d.ts
middleware.ts
```

---

## Fase 3 — Refatoração de Código

**Commit:** `refactor: extract shared logic, add types, simplify components`

### 3.1 Helper de acesso (`lib/page-access.ts`)
- `getPageOrNotFound(nanoid)`
- `getSessionUser()`
- `isPageOwner(page, userId)`
- `canViewPage(page, userId)`
- `canEditPage(page, userId)`

### 3.2 Tipos (`lib/types.ts`)
- `Page`, `CreatePageInput`, `EditPageInput`

### 3.3 Type augmentation (`types/next-auth.d.ts`)
- `session.user.id`

### 3.4 Hooks
- `use-media-query.ts`
- `use-debounce.ts`

### 3.5 Componentes do editor
- `editor/preview.tsx`
- `editor/toolbar.tsx`

### 3.6 Unificar imports
- Todos via `@/` alias

### 3.7 Sanitização (`lib/sanitize.ts`)

### 3.8 Schema defaults
- `private.notNull().default(false)`

---

## Fase 4 — Segurança e Funcionalidades

**Commit:** `feat: add rate limiting, delete endpoint, CSRF protection`

### 4.1 Rate limiting (Upstash)
- `@upstash/ratelimit` + `@upstash/redis`
- Edit: 30 req/min por IP
- Create: 10 req/min por IP
- Env: `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`

### 4.2 DELETE endpoint (`api/pages/[nanoid]/route.ts`)
- Auth + ownership check
- Delete from DB

### 4.3 Botão delete no editor
- Confirmação dupla
- Redirect home após delete

### 4.4 CSRF
- Verificar `Origin` header

### 4.5 Atualizar `vercel.json`
- Cron path: `/api/cron/cleanup`

---

## Fase 5 — Design Neutro/Profissional

**Commit:** `style: redesign with neutral professional theme`

### Paleta
| Uso | Proposto |
|-----|----------|
| Background | `#ffffff` |
| Foreground | `#1a1a1a` |
| Primary | `slate-900` |
| Accent | `blue-600` |
| Borders | `gray-200` |

### Componentes
- Header minimalista
- Create form clean
- Editor com borda sutil
- Home hero tipografia forte
- Loading skeleton

### CSS
- Remover `pink-*`
- Simplificar `globals.css`

---

## Execução

| Fase | Deploy | Risco |
|------|--------|-------|
| 1 | `vercel --prod` | Baixo |
| 2 | `vercel --prod` | Médio |
| 3 | `vercel --prod` | Médio |
| 4 | `vercel --prod` | Médio |
| 5 | `vercel --prod` | Baixo |
