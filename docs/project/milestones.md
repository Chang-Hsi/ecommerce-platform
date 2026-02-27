# Ecommerce Milestones (Nike-style, Mobile-first)

專案上下文單一事實來源（Source of Truth）：
- 里程碑與完成定義：`docs/project/milestones.md`
- Jira 對應與操作流程：`docs/project/jira.md`
- 目前進度與下一步交接：`SESSION_HANDOFF.md`

更新規則：
- 你通知「某里程碑完成且測試通過」後，我會把該里程碑狀態改為 `Done`，並記錄完成日期。
- 每個里程碑完成時，必須同步更新對應 Jira issue 狀態為 `完成`。
- 預設狀態：`Todo`。

Jira 對應：
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

## Status Board

| Milestone | Status | Completed Date | Notes |
| --- | --- | --- | --- |
| M0 產品定義與規格凍結 | Todo | - | MVP、流程、狀態機、API 規範 |
| M1 全棧骨架與基礎部署 | Done | 2026-02-25 | Next 全棧、/admin、/api/health、Prisma 基礎、Vercel 部署成功 |
| M2 前台 IA 與路由結構 | Done | 2026-02-25 | AppLayout、Header Mega Menu、路由規劃、query 規範、mobile-first 導覽完成 |
| M3 前台 UI 文件與靜態落地 | Done | 2026-02-27 | 前台核心頁面與 UI 規格文件完成（Home/PLP/PDP/Favorites/Cart/Checkout/Help/SNKRS/Profile） |
| M4 資料庫建模與遷移 | Done | 2026-02-27 | Prisma schema 擴充、migration SQL 產生並套用、seed 成功、索引策略文件化 |
| M5 API 落地與前台串接 | In Progress | - | 已完成 auth/products/cart/favorites/help/snkrs/profile API 與前台串接；orders/checkout 待接續 |
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
- [x] 完成 `AppLayout`（Header/Footer/Mobile Nav）
- [x] 路由定義：`/products`、`/products/[slug]`、`/cart`、`/checkout`
- [x] 篩選 query 規範：`category/priceMin/priceMax/size/color/sort/page`（並含 `gender/group/sport/collection/sale/q`）
- [x] Mobile-first 響應式準則文件化

### 驗收 checklist
- [x] `docs/frontend/routes-storefront.md`
- [x] `docs/frontend/layout-storefront.md`
- [x] 手機/桌機導覽正常
- [x] 篩選可透過 URL 還原狀態

## M3 前台 UI 文件與靜態落地

### Progress Snapshot（2026-02-27）
- [x] 首頁靜態落地
- [x] 產品頁（PLP）靜態落地
- [x] 詳情頁（PDP）靜態落地
- [x] 收藏頁（Favorites）靜態落地
- [x] 購物車頁靜態落地
- [x] 結帳頁（Checkout）靜態落地
- [x] 協助頁（Help）靜態落地
- [x] SNKRS 頁靜態落地
- [x] 帳號設定頁（Profile）靜態落地

### DoD
- [x] 每頁先有 UI 規格 md，再進入實作
- [x] 完成首頁、列表頁(PLP)、詳情頁(PDP)、購物車、結帳頁
- [x] 資料來自 mock data（可集中維護）
- [x] UI 與資料型別對齊（schema first）

### 驗收 checklist
- [x] `docs/frontend/storefront/home.md`
- [x] `docs/frontend/storefront/product.md`
- [x] `docs/frontend/storefront/cart.md`
- [x] `docs/frontend/storefront/favorites.md`
- [x] `docs/frontend/storefront/checkout.md`
- [x] `docs/frontend/storefront/help.md`
- [x] `docs/frontend/storefront/snkrs.md`
- [x] `docs/frontend/storefront/profile.md`
- [x] 主要流程可從首頁一路操作到結帳

## M4 資料庫建模與遷移

### DoD
- [x] Prisma schema 完成核心實體
- [x] migration/seed/rollback 流程可用
- [x] mock data 可 seed 到 PostgreSQL
- [x] 索引策略覆蓋主要篩選與排序

### 驗收 checklist
- [x] `prisma/schema.prisma`
- [x] migration 可重複執行
- [x] seed 成功
- [x] `docs/backend/database.md`

## M5 API 落地與前台串接

### Progress Snapshot（2026-02-27）
- [x] API 契約統一為 `code/message/data`
- [x] `request` 前端 client（同源 `credentials: include`）建立
- [x] Auth API 第一版：`/api/auth/login/request-code`、`/api/auth/login/verify`、`/api/auth/session`、`/api/auth/logout`
- [x] Auth API 第二版（JWT）：新增 `/api/auth/refresh`、access/refresh token rotation
- [x] Email OTP 流程：SMTP 寄信（未配置 SMTP 時 dev fallback `debugCode`）
- [x] Products API 第一版：`/api/products`、`/api/products/[slug]`
- [x] Favorites API 第一版：`/api/favorites`、`/api/favorites/[slug]`
- [x] Cart API 第一版：`/api/cart`、`/api/cart/items`、`/api/cart/items/[itemId]`
- [x] Help/SNKRS API 第一版：`/api/help`、`/api/snkrs`
- [x] 前台首批串接：Home、Login、Login Verify、PLP、PDP、Favorites、Cart（含 mini/favorite panel 同步機制）
- [x] Profile API 第二版：`/api/profile*`（account/addresses/preferences/privacy/visibility/avatar）
- [x] 帳號設定前台串接：`/profile/*` 改由 API + DB 驅動
- [x] 頭像上傳：FormData + Sharp(WebP) + Cloudinary + DB URL
- [x] 首次登入資料策略：僅 email + passwordMask，其他欄位留空
- [ ] Orders/Checkout API

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
