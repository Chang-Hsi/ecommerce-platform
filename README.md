# Ecommerce Platform Demo

Nike 風格電商 Demo 的 Next.js 全棧專案（目前進入 M3：前台 UI 靜態落地）。

## Tech Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Prisma
- PostgreSQL

## Current Scope (M3)

- Storefront 路由：`/`、`/products`、`/products/[slug]`、`/cart`、`/checkout`
- Auth 路由：`/login`、`/login/verify`（由 `src/app/(auth)/*` 提供）
- Storefront AppLayout（sticky header + mobile bottom nav）
- AuthLayout（登入/驗證頁專用，不含 storefront Header/Footer）
- Admin 路由：`/admin`
- API 路由：`/api/health`
- Prisma 基礎 schema 與 client 初始化
- 前台 IA 文件與 products 外頁（PLP）靜態落地
- 前台分層策略已定案（`content / features / components / hooks / lib`）

## Frontend Layering Strategy

前台之後所有頁面都必須遵守相同分層，不再把不同職責混放在同一層。

- `src/content/*`
  - 負責靜態內容與假資料（mock data / schema-like shape）
  - 例如：`home.ts`、`products.ts`
  - 目標：未來設計 DB / API 時可直接對照資料結構
- `src/features/*`
  - 負責頁面等級的拼接（Page Composition）
  - 只做區塊組合、流程編排，不放共用 UI 元件細節
- `src/components/*`
  - 負責可重用 UI 元件與區塊元件
  - 包含 layout、home、products、common 等
- `src/hooks/*`
  - 負責前端行為控制與狀態 orchestration（例如頁面 controller hooks）
  - 可讀取 `searchParams`、管理 UI state、輸出給 `components/features`
- `src/lib/*`
  - 負責純邏輯工具、query 映射、跨頁可共用 helper（不含畫面）

## Context Bootstrap (for new chat/session)

每次開新對話，先讓助手讀完以下文件再動工：

- `README.md`
- `docs/project/milestones.md`
- `docs/project/jira.md`
- `SESSION_HANDOFF.md`

## Storefront Routing Rules

- Route entry files stay in `src/app/(storefront)/*` and remain thin.
- Route files only parse route/search params and render feature pages.
- Route groups are for organization only and do not appear in URL.
- Auth pages (`/login`, `/login/verify`) stay in `src/app/(auth)/*` and use dedicated `AuthLayout`.
- Storefront conventions are documented in `src/app/(storefront)/README.md`.

### Admin rules (for next phase)

- Admin routes stay in `src/app/admin/*` (`/admin` URL scope).
- Follow the same pattern: thin route entry + feature page composition.
- Detailed admin conventions are documented in `src/app/admin/README.md`.

## Jira Integration (SOP)

### 1) Local auth configuration

Put Jira credentials in `.env.local` (never commit real secrets):

```env
JIRA_BASE_URL=https://watasiwa8531.atlassian.net
JIRA_EMAIL=your-atlassian-email
JIRA_API_TOKEN=your-api-token
JIRA_PROJECT_KEY=EP
```

### 2) Verify connection

```bash
cd /Users/chanshiti/ecommerce-platform
set -a && source .env.local && set +a

curl -sS -u "$JIRA_EMAIL:$JIRA_API_TOKEN" \
  "$JIRA_BASE_URL/rest/api/3/myself" | jq '{displayName,accountId,active}'

curl -sS -u "$JIRA_EMAIL:$JIRA_API_TOKEN" \
  "$JIRA_BASE_URL/rest/api/3/project/$JIRA_PROJECT_KEY" | jq '{key,name,id}'
```

### 3) Current roadmap issues

- Epic/Workflow: `EP-1` `[Roadmap] Ecommerce Platform Milestones`
- Milestones:
  - `M0 -> EP-2`
  - `M1 -> EP-3`
  - `M2 -> EP-4`
  - `M3 -> EP-5`
  - `M4 -> EP-6`
  - `M5 -> EP-7`
  - `M6 -> EP-8`
  - `M7 -> EP-9`
  - `M8 -> EP-10`
  - `M9 -> EP-11`

### 4) Milestone completion sync rule (required)

When a milestone is completed, **both** updates are required:

1. Update local milestone doc status to `Done`:
   - `docs/project/milestones.md`
2. Update corresponding Jira issue status to `完成` (Done transition id: `41`).

Example status transition:

```bash
set -a && source .env.local && set +a

ISSUE_KEY="EP-4" # replace with milestone issue
curl -sS -u "$JIRA_EMAIL:$JIRA_API_TOKEN" \
  -H "Content-Type: application/json" \
  -X POST "$JIRA_BASE_URL/rest/api/3/issue/$ISSUE_KEY/transitions" \
  -d '{"transition":{"id":"41"}}'
```

Recommended follow-up: add a Jira comment with test evidence/PR/commit link for traceability.

## Local Development

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run typecheck
npm run prisma:generate
npm run prisma:migrate
npm run db:push
npm run db:studio
```

## Folder Structure (Current)

```txt
src/
  content/
    home.ts
    products.ts
  app/
    (auth)/
      layout.tsx
      login/
        page.tsx
        verify/page.tsx
    (storefront)/
      README.md
      layout.tsx
      page.tsx
      products/
        page.tsx
        [slug]/page.tsx
      cart/page.tsx
      checkout/page.tsx
    admin/
      README.md
      layout.tsx
      page.tsx
    api/health/route.ts
    layout.tsx
  components/layout/
    AppLayout.tsx
    AuthLayout.tsx
    Header.tsx
    Footer.tsx
    MobileBottomNav.tsx
  features/
    auth/
      LoginPage.tsx
      LoginVerifyPage.tsx
    home/HomePage.tsx
    products/
      ProductsPage.tsx
      ProductDetailPage.tsx
    cart/CartPage.tsx
    checkout/CheckoutPage.tsx
  hooks/
    auth/useMockAuthSession.ts
    products/useProductsController.ts
  lib/
    auth/mock-auth.ts
    products/query-state.ts
    prisma.ts
prisma/
  schema.prisma
docs/
  backend/api-overview.md
  frontend/routes-admin.md
  frontend/layout-storefront.md
  frontend/routes-storefront.md
```

## Deployment Readiness

M1 已具備部署到 Vercel 的基本條件。實際部署請先完成：

1. 註冊 Vercel 並連結此專案
2. 設定環境變數（至少 `DATABASE_URL`）
3. 執行首次部署

## Next Milestone

Step3: 先完成各頁 UI 規格文件，再以靜態資料逐頁落地（Home/PLP/PDP/Cart/Checkout）。
