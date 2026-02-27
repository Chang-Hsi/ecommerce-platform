# Session Handoff

更新時間：2026-02-27

## 1. 當前專案狀態

- 專案：`/Users/chanshiti/ecommerce-platform`
- 目前階段：M8 準備階段（M7 已完成）
- 已完成里程碑：M1、M2、M3、M4、M5、M6、M7
- 里程碑看板：`docs/project/milestones.md`
- Jira 對應規則：`docs/project/jira.md`

## 2. 本輪關鍵完成項目

### 2.1 M7 Stripe 測試金流閉環（Done）

- Checkout 雙模式已落地：
  - `paymentMethod=card`：站內 Stripe Elements（PaymentIntent + `confirmCardPayment`）
  - `paymentMethod=paypal`（前台文案 `Stripe`）：Stripe Hosted Checkout（Session redirect）
  - `paymentMethod=gpay`：M7 保留 UI（`M7_PENDING`）
- Webhook：`/api/payments/stripe/webhook`
  - 已完成簽章驗證（`stripe-signature` + `STRIPE_WEBHOOK_SECRET`）
  - 已完成 idempotency（`PaymentWebhookEvent.eventId` 去重）
  - 已完成訂單狀態回寫（成功 -> `PAID/CAPTURED`；失敗 -> `FAILED/FAILED`）
- 本機 webhook 轉發：
  - 已提供 `launchd` 方案
  - 檔案：`scripts/stripe-webhook-listen.sh`、`~/Library/LaunchAgents/com.swooshlab.stripe-webhook.plist`

### 2.2 Orders 頁面（前後端）

- Header「訂單」入口已改為 `/orders`
- 新增前台頁面：`/orders`
  - 區塊順序：
    1. 訂單資訊區塊（已完成訂單）
    2. 購物車最愛區塊（重用）
    3. 你可能也會喜歡（重用）
- 新增後端 API：`GET /api/orders`
  - 只回傳已完成訂單（`status in [PAID, REFUNDED]` 或 `paymentStatus=CAPTURED`）

### 2.3 PDP Gallery 測試資料補齊

- 已直接在 DB 為每個商品補上多張 `ProductImage`
- 目前每個商品至少 4 張圖
- `/api/products/[slug] -> detail.media` 已可回傳多圖供 `ProductMediaGallery` 測試

## 3. 重要注意事項

- 請避免同時啟動多個 `stripe listen`（會造成 webhook 重複轉發）。
- 使用 Stripe CLI 轉發時，若 listener 重建，請確認 `STRIPE_WEBHOOK_SECRET` 是否需更新。
- 基礎設施層變更（Prisma schema/migration、`.env`、套件）後，需重啟 `next dev`（必要時清 `.next`）。

## 4. 下一步建議（M8）

1. 後台管理站資訊架構與路由骨架（AdminLayout + Navigation）
2. 商品/庫存/訂單管理 CRUD API 與頁面
3. RBAC（UI + API）一致化
4. 管理端操作審計（必要欄位/事件）

## 5. 開新對話標準指令

請先讀以下文件再開始：

- `README.md`
- `docs/project/milestones.md`
- `docs/project/jira.md`
- `SESSION_HANDOFF.md`

並以 `/Users/chanshiti/ecommerce-platform` 作為工作目錄。
