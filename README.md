# Ecommerce Platform Demo

Nike 風格電商 Demo 的 Next.js 全棧專案（M4 已完成；M5 API 落地與前台串接進行中，Batch 2 已完成）。

## Tech Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Prisma
- PostgreSQL

## Current Scope (Post-M3)

- Storefront 路由：`/`、`/products`、`/products/[slug]`、`/favorites`、`/cart`、`/checkout`、`/checkout/success`
- 協助路由：`/help`、`/help/topics/[slug]`、`/help/contact`
- Profile 路由：`/profile/account`、`/profile/addresses`、`/profile/preferences`、`/profile/visibility`、`/profile/privacy`
- SNKRS 路由：`/snkrs`
- Auth 路由：`/login`、`/login/verify`（由 `src/app/(auth)/*` 提供）
- Storefront AppLayout（sticky header + Footer）
- AuthLayout（登入/驗證頁專用，不含 storefront Header/Footer）
- Admin 路由：`/admin`
- API 路由（已落地）：`/api/health`、`/api/home`、`/api/help`、`/api/snkrs`、`/api/products*`、`/api/auth*`、`/api/cart*`、`/api/favorites*`、`/api/profile*`、`/api/checkout*`
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
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Auth (JWT + Email OTP)

- Access token：`httpOnly cookie`，短效 JWT
- Refresh token：`httpOnly cookie`，長效 JWT + DB session rotation
- OTP：8 碼驗證碼，後端存 `hash` + `expiresAt`，驗證後建立/登入帳戶
- 首次登入帳號建立：
  - `User` 會自動產生系統隨機密碼並以 `passwordHash` 儲存
  - Profile 初始資料包含 `email + passwordMask + firstName + lastName`（姓名預設空字串，其餘欄位也為空）

### 本機寄送驗證信（Gmail SMTP）

1. Gmail 開啟兩步驟驗證  
2. 建立 App Password（16 碼）  
3. 填入 `.env.local`：

```env
AUTH_ACCESS_SECRET=change-me-access
AUTH_REFRESH_SECRET=change-me-refresh
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your@gmail.com
SMTP_PASS=your-gmail-app-password
SMTP_FROM="SwooshLab <your@gmail.com>"
```

若未設定 SMTP，開發環境會在 `/api/auth/login/request-code` 回傳 `debugCode` 供測試；production 會要求 SMTP 必填。

## Profile API (M5 Batch 2)

- Profile 頁面已改為 API + DB 驅動（非 localStorage mock）：
  - `GET /api/profile`
  - `PUT/DELETE /api/profile/account`
  - `POST /api/profile/addresses`
  - `DELETE /api/profile/addresses/[addressId]`
  - `PUT /api/profile/preferences`
  - `PUT /api/profile/privacy`
  - `PUT /api/profile/visibility`
  - `POST /api/profile/avatar`
- 帳號欄位（`/profile/account`）包含會員層級 `firstName` / `lastName`，DB 對應 `User.firstName` / `User.lastName`。

## Checkout API（M5：非金流）

- 已完成 checkout API + 前台串接（不含 Stripe 扣款）：
  - `GET /api/checkout`
  - `POST /api/checkout/promo`
  - `POST /api/checkout/place-order`
- `place-order` 回傳 `paymentPreparation`（`provider: stripe`, `mode: M7_PENDING`）供 M7 直接接續。

## Avatar Upload (FormData + Sharp + Cloudinary)

- 上傳流程：前端 `FormData` -> 後端 `sharp` 轉 WebP -> Cloudinary -> DB 僅存 URL。
- 環境變數（`.env.local`）：

```env
BACKSTAGE_IMAGE_UPLOAD_ENABLED=true
BACKSTAGE_IMAGE_UPLOAD_MAX_MB=5
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

## App Router `_rsc` 說明（開發測試）

- `?_rsc=...` 是 Next.js App Router 頁面資料流，屬於框架正常行為。
- 驗證後端資料請直接測試 `/api/*`（統一回傳 `code/message/data`）。

## localStorage 策略（M5 現況）

- 目前**可長期保存**的業務資料都已搬到後端（DB）：
  - auth session（JWT + DB refresh session）
  - profile/account/addresses/preferences/privacy/visibility
  - favorites
  - cart
  - checkout/order（不含第三方扣款）
- 目前仍使用 localStorage 的部分屬於「前端快取 / 過渡層」，不是資料真實來源：
  - `swooshlab.mock-auth.session.v1`：前端 Header/UI 快速同步與跨分頁事件鏡像
  - `swooshlab.mock-cart.items.v1`：購物車 optimistic UI 快取（實際仍以 `/api/cart*` 為準）
  - `swooshlab.mock-favorites.items.v1`：收藏 optimistic UI 快取（實際仍以 `/api/favorites*` 為準）
  - `swooshlab.mock-auth.accounts.v1`、`swooshlab.mock-auth.verify.v1`、`swooshlab.mock-profile.settings.v1`：舊 mock 相容資料，非主流程
- 是否能全部改成後端保存：**可以**。  
  後續可在 M5 後半把 cart/favorites/auth 的前端 mock layer 移除，改成 API response + memory state（必要時用 `BroadcastChannel` 做跨分頁同步），即可完全不依賴 localStorage。

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run typecheck
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
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
    api/
      auth/*
      cart/*
      favorites/*
      health/route.ts
      help/route.ts
      home/route.ts
      products/*
      profile/*
      snkrs/route.ts
    layout.tsx
  components/layout/
    AppLayout.tsx
    AuthLayout.tsx
    Header.tsx
    Footer.tsx
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
    profile/useProfileState.ts
    products/useProductsController.ts
  lib/
    api/*
    auth/mock-auth.ts
    products/query-state.ts
    prisma.ts
    server/*
prisma/
  schema.prisma
  seed.js
docs/
  backend/api-overview.md
  backend/database.md
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

Step5（M5）：完成 orders/checkout API，並收斂前台剩餘 mock data 切換到 DB/API。
