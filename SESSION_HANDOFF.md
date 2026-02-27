# Session Handoff

更新時間：2026-02-27

## 1. 當前專案狀態

- 專案：`/Users/chanshiti/ecommerce-platform`
- 目前階段：M5（API 落地與前台串接）進行中（Batch 3 Checkout 已落地）
- 已完成里程碑：M1、M2、M3、M4
- M4 狀態：Done（資料庫建模與遷移已完成）
- 里程碑看板：`docs/project/milestones.md`
- Jira 對應規則：`docs/project/jira.md`

## 2. 已定案架構規則（前台）

- `src/content/*`：靜態資料與內容 schema
- `src/features/*`：頁面級拼接（保持精簡）
- `src/components/*`：可重用 UI 組件
- `src/hooks/*`：狀態控制與行為 orchestration
- `src/lib/*`：純邏輯工具（query mapping、helper）

## 3. 最近完成重點

- M5 Batch 1 已落地（2026-02-27）：
  - 統一 API envelope：`code/message/data`
  - 新增 API routes：
    - Auth：`/api/auth/login/request-code`、`/api/auth/login/verify`、`/api/auth/session`、`/api/auth/logout`
    - Home：`/api/home`
    - Products：`/api/products`、`/api/products/[slug]`
    - Favorites：`/api/favorites`、`/api/favorites/[slug]`
    - Cart：`/api/cart`、`/api/cart/items`、`/api/cart/items/[itemId]`
  - 前端 API client 已建立：`src/lib/api/*`
  - 前台首批串接完成：
    - Home（改由 `/api/home`）
    - Login / Login Verify（改由 auth API + cookie session）
    - PLP / PDP（改由 products API；保留 fallback）
    - Favorites / Cart / Checkout data sync（本地快取 + API 同步）
  - Auth Session Guard 改良：
    - `useMockAuthSession` 新增 `isReady`
    - 避免 cookie session 首次同步前誤判未登入導向
- M5 Batch 1.5（Auth 強化）已落地（2026-02-27）：
  - JWT auth 改造：
    - Access token（短效）+ Refresh token（長效）皆為 `httpOnly cookie`
    - Refresh rotation + DB session revoke
    - 新增 `POST /api/auth/refresh`
    - 前端 request 層遇 401 自動 refresh 一次再重試
  - Email OTP：
    - `request-code` 會透過 SMTP 寄送信件
    - 未配置 SMTP 時（開發環境）回傳 `debugCode`
  - 新增 JSON API：
    - `GET /api/help`
    - `GET /api/snkrs`
- M5 Batch 2（Profile + Upload）已落地（2026-02-27）：
  - 新增 Profile API：
    - `GET /api/profile`
    - `PUT/DELETE /api/profile/account`
    - `POST /api/profile/addresses`、`DELETE /api/profile/addresses/[addressId]`
    - `PUT /api/profile/preferences`
    - `PUT /api/profile/privacy`
    - `PUT /api/profile/visibility`
    - `POST /api/profile/avatar`
  - 帳號設定頁資料來源切換：
    - `useProfileState` 改為 API + DB（移除 localStorage profile mock）
  - 首次登入帳號策略：
    - 首次驗證成功時，建立 `User.passwordHash`（系統隨機密碼 hash）
    - Profile 初始資料僅 `email + passwordMask`，其餘欄位留空
  - 頭像上傳流程：
    - 前端 `FormData`
    - 後端 `sharp` 轉 WebP
    - Cloudinary 儲存
    - DB 僅存 `UserProfile.avatarUrl`
  - 已清洗測試帳號：
    - `watasiwa8531@gmail.com` 已從 DB 移除（可重新註冊）
- M5 Batch 3（Checkout API）已落地（2026-02-27）：
  - 新增 Checkout API：
    - `GET /api/checkout`
    - `POST /api/checkout/promo`
    - `POST /api/checkout/place-order`
  - 前台 `/checkout` 已改為 API 驅動：
    - 初始化資料改由 `GET /api/checkout`
    - 促銷碼改由 `/api/checkout/promo`
    - 下訂單改由 `/api/checkout/place-order`，成功後導向 `redirectUrl`
  - `place-order` 已預留 M7 Stripe 接點資料：
    - `paymentPreparation.provider = stripe`
    - `paymentPreparation.mode = M7_PENDING`
    - `paymentPreparation.clientSecret = null`
- M3 前台頁面已完成靜態落地：
  - 首頁 `/`
  - 產品列表 `/products`
  - 產品詳情 `/products/[slug]`
  - 收藏 `/favorites`
  - 購物車 `/cart`
  - 結帳 `/checkout`、完成頁 `/checkout/success`
  - 協助 `/help`、`/help/topics/[slug]`、`/help/contact`
  - SNKRS `/snkrs`
  - 帳號設定 `/profile/*`
- M3 對應文件已完成：
  - `docs/frontend/storefront/home.md`
  - `docs/frontend/storefront/product.md`
  - `docs/frontend/storefront/cart.md`
  - `docs/frontend/storefront/favorites.md`
  - `docs/frontend/storefront/checkout.md`
  - `docs/frontend/storefront/help.md`
  - `docs/frontend/storefront/snkrs.md`
  - `docs/frontend/storefront/profile.md`
  - `docs/frontend/storefront/layout.md`
- Layout 最終調整：
  - Mobile Bottom Tabbar 已移除
  - Footer 擴充版（三欄導覽 + 地區）已落地
  - Header 促銷條改為 3 組文案輪播（每 5 秒切換）
- 驗收結果（2026-02-27）：
  - `npm run lint` 通過
  - `npm run typecheck` 通過
  - `npm run build` 通過
  - API smoke test 通過（auth/products/favorites/cart/help/snkrs/profile/checkout）
- M4 DB 落地結果：
  - Prisma migration：`20260227020000_m4_core_schema` 已套用
  - Seed 已完成（users=2, products=10, variants=10, favorites=3, carts=1, orders=1）
  - `docs/backend/database.md` 已補齊模型與索引策略
  - 前端 `src/content/*` 靜態資料依決議保留，待 M5 API 串接完成後再移除

## 4. 下一步建議（可直接接續）

1. 收斂 remaining mock data（cart/favorites/auth 名稱與 localStorage fallback 清理）
2. 補 API 文件：`docs/api/products.md`、`docs/api/cart.md`、`docs/api/orders.md`（checkout/profile 已落地）
3. 規劃 checkout success 頁讀 DB 訂單明細（依 `orderId`）
4. 進入 M6 文件補齊與 M7 Stripe test mode 規劃（PaymentIntent + webhook）

## 5. 開新對話時的標準指令

請先讀以下文件再開始：

- `README.md`
- `docs/project/milestones.md`
- `docs/project/jira.md`
- `SESSION_HANDOFF.md`

並以 `/Users/chanshiti/ecommerce-platform` 作為工作目錄。
