# Ecommerce Platform Demo

Nike 風格電商 Demo 的 Next.js 全棧專案（目前到 M2：AppLayout + 前台路由 IA）。

## Tech Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Prisma
- PostgreSQL

## Current Scope (M2)

- Storefront 路由：`/`、`/products`、`/products/[slug]`、`/cart`、`/checkout`
- Storefront AppLayout（sticky header + mobile bottom nav）
- Admin 路由：`/admin`
- API 路由：`/api/health`
- Prisma 基礎 schema 與 client 初始化
- 前台 IA 文件與 query convention（`category/price/size/color/sort/page`）

## Architecture Rules

### Storefront rules (already applied)

- Route entry files stay in `src/app/(storefront)/*` and remain thin.
- Route files should only handle route params/search params and render feature pages.
- Page composition/UI lives in `src/features/*`.
- Shared layout UI lives in `src/components/layout/*`.
- Route groups are for organization only and do not appear in URL.

### Admin rules (for next phase)

- Admin routes stay in `src/app/admin/*` (`/admin` URL scope).
- Follow the same pattern: thin route entry + feature page composition.
- Detailed admin conventions are documented in `src/app/admin/README.md`.

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

## Folder Structure (M2)

```txt
src/
  app/
    (storefront)/
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
    Header.tsx
    Footer.tsx
    MobileBottomNav.tsx
  features/
    home/HomePage.tsx
    products/
      ProductsPage.tsx
      ProductDetailPage.tsx
    cart/CartPage.tsx
    checkout/CheckoutPage.tsx
  lib/
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
