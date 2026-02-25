# Ecommerce Milestones (Nike-style, Mobile-first)

更新規則：
- 你通知「某里程碑完成且測試通過」後，我會把該里程碑狀態改為 `Done`，並記錄完成日期。
- 預設狀態：`Todo`。

## Status Board

| Milestone | Status | Completed Date | Notes |
| --- | --- | --- | --- |
| M0 產品定義與規格凍結 | Todo | - | MVP、流程、狀態機、API 規範 |
| M1 全棧骨架與基礎部署 | Done | 2026-02-25 | Next 全棧、/admin、/api/health、Prisma 基礎、Vercel 部署成功 |
| M2 前台 IA 與路由結構 | Todo | - | AppLayout、Nike 風格篩選路由規劃 |
| M3 前台 UI 文件與靜態落地 | Todo | - | 先 docs 再實作、mock data |
| M4 資料庫建模與遷移 | Todo | - | Prisma schema/migration/seed |
| M5 API 落地與前台串接 | Todo | - | products/cart/orders + Auth/RBAC 基礎 |
| M6 前台文件收斂 | Todo | - | README/API docs/排錯文件 |
| M7 Stripe 測試金流閉環 | Todo | - | checkout + webhook + idempotency |
| M8 後台管理站落地 | Todo | - | AdminLayout + CRUD + 權限 |
| M9 測試、效能、上線驗收 | Todo | - | CI 綠燈、Vercel prod、最終驗收 |

---

## M0 產品定義與規格凍結

### DoD
- [ ] 決定第一版只做一個主軸（電商）
- [ ] MVP 功能列表（Must/Should/Could）
- [ ] 使用者流程圖（瀏覽 -> 篩選 -> 詳情 -> 購物車 -> 結帳）
- [ ] 訂單狀態機定義（pending/paid/failed/canceled/refunded）
- [ ] API 回應與錯誤格式規範

### 驗收 checklist
- [ ] `docs/product/mvp.md`
- [ ] `docs/product/user-flow.md`
- [ ] `docs/product/state-machine.md`
- [ ] `docs/architecture/api-conventions.md`

## M1 全棧骨架與基礎部署

### DoD
- [x] Next.js + TypeScript + Tailwind 初始化
- [x] 路由骨架存在：`/`、`/admin`、`/api/health`
- [x] Prisma 初始化與 client 生成可用
- [x] `.env.example` 完整
- [x] 首次 Vercel Preview 成功

### 驗收 checklist
- [x] `npm run dev` 可啟動
- [x] `npm run lint` 通過
- [x] `npm run typecheck` 通過
- [x] `GET /api/health` 回傳 200
- [x] 有可開啟的 Vercel Preview URL（https://ecommerce-platform-mjlsd98zk-chang-hsis-projects.vercel.app，受 Vercel Authentication 保護）

## M2 前台 IA 與路由結構

### DoD
- [ ] 完成 `AppLayout`（Header/Footer/Mobile Nav）
- [ ] 路由定義：`/products`、`/products/[slug]`、`/cart`、`/checkout`
- [ ] 篩選 query 規範：`category/price/size/color/sort/page`
- [ ] Mobile-first 響應式準則文件化

### 驗收 checklist
- [ ] `docs/frontend/routes-storefront.md`
- [ ] `docs/frontend/layout-storefront.md`
- [ ] 手機/桌機導覽正常
- [ ] 篩選可透過 URL 還原狀態

## M3 前台 UI 文件與靜態落地

### DoD
- [ ] 每頁先有 UI 規格 md，再進入實作
- [ ] 完成首頁、列表頁(PLP)、詳情頁(PDP)、購物車、結帳頁
- [ ] 資料來自 mock data（可集中維護）
- [ ] UI 與資料型別對齊（schema first）

### 驗收 checklist
- [ ] `docs/ui/storefront/home.md`
- [ ] `docs/ui/storefront/plp.md`
- [ ] `docs/ui/storefront/pdp.md`
- [ ] `docs/ui/storefront/cart-checkout.md`
- [ ] 主要流程可從首頁一路操作到結帳

## M4 資料庫建模與遷移

### DoD
- [ ] Prisma schema 完成核心實體
- [ ] migration/seed/rollback 流程可用
- [ ] mock data 可 seed 到 PostgreSQL
- [ ] 索引策略覆蓋主要篩選與排序

### 驗收 checklist
- [ ] `prisma/schema.prisma`
- [ ] migration 可重複執行
- [ ] seed 成功
- [ ] `docs/backend/database.md`

## M5 API 落地與前台串接

### DoD
- [ ] 完成 products/cart/orders API
- [ ] API 支援 filter/sort/pagination
- [ ] 前台逐頁由 mock 切到 API
- [ ] Auth（JWT/OAuth）與 RBAC 最小可用

### 驗收 checklist
- [ ] `docs/api/products.md`
- [ ] `docs/api/cart.md`
- [ ] `docs/api/orders.md`
- [ ] API integration tests 通過
- [ ] `/admin` 僅授權角色可訪問

## M6 前台文件收斂

### DoD
- [ ] README 補齊啟動、架構、資料流
- [ ] API 使用方式與錯誤排查文件化
- [ ] `.env.example` 與實作一致

### 驗收 checklist
- [ ] `README.md` 更新完成
- [ ] `docs/troubleshooting.md`
- [ ] 新成員可依文件獨立啟動

## M7 Stripe 測試金流閉環

### DoD
- [ ] Stripe Test Mode 串接完成
- [ ] Webhook 驗簽與重送去重完成
- [ ] 訂單狀態可隨付款事件更新

### 驗收 checklist
- [ ] 測試卡流程可完成支付
- [ ] webhook 重複事件不重複入帳
- [ ] `docs/backend/payments.md`

## M8 後台管理站落地

### DoD
- [ ] AdminLayout 與管理導航完成
- [ ] 商品、庫存、訂單管理頁完成
- [ ] RBAC 在 UI + API 同步生效

### 驗收 checklist
- [ ] `docs/frontend/routes-admin.md`
- [ ] `docs/ui/admin/*.md`
- [ ] 核心 CRUD 可用
- [ ] 審計欄位或日誌可追蹤操作

## M9 測試、效能、上線驗收

### DoD
- [ ] 測試金字塔齊全（lint/typecheck/unit/integration/e2e）
- [ ] 圖片、查詢、快取優化達標
- [ ] Vercel production 上線成功
- [ ] 最終 README 與 demo script 完成

### 驗收 checklist
- [ ] CI 全綠
- [ ] 線上流程 smoke test 全通過
- [ ] `docs/release/checklist.md`
- [ ] 專案最終驗收完成
