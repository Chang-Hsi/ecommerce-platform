# Payments（M7 Stripe Done）

更新日期：2026-02-27

## 1. 目標

- Stripe Test Mode 閉環已完成
- Webhook 驗簽已完成
- Webhook idempotency（去重）已完成
- 訂單狀態可由付款事件自動回寫

## 2. 環境變數

```env
STRIPE_SECRET_KEY=sk_test_xxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
APP_BASE_URL=http://localhost:3000
STRIPE_SUCCESS_URL=http://localhost:3000/checkout/success
STRIPE_CANCEL_URL=http://localhost:3000/checkout
```

## 3. 付款模式（Checkout）

### 3.1 站內信用卡（`paymentMethod=card`）

1. 前端呼叫 `POST /api/checkout/place-order`
2. 後端建立 Order + PaymentAttempt（`PENDING_PAYMENT` / `PENDING`）
3. 後端建立 Stripe `PaymentIntent`
4. 回傳 `paymentPreparation.mode=STRIPE_EMBEDDED` + `clientSecret`
5. 前端在 `/checkout` 以 Stripe Elements `confirmCardPayment`
6. Stripe 發送 `payment_intent.succeeded/failed` webhook
7. 後端回寫訂單/付款狀態

### 3.2 Stripe Hosted Checkout（`paymentMethod=paypal`，前台文案為 Stripe）

1. 前端呼叫 `POST /api/checkout/place-order`
2. 後端建立 Order + PaymentAttempt
3. 後端建立 Stripe Checkout Session
4. 回傳 `redirectUrl` + `paymentPreparation.mode=STRIPE_CHECKOUT`
5. 前端跳轉 Stripe Hosted Checkout
6. Stripe 發送 `checkout.session.*` webhook
7. 後端回寫訂單/付款狀態

### 3.3 Google Pay（`paymentMethod=gpay`）

- M7 保留 UI（`M7_PENDING`），不進入實際金流。

## 4. Webhook 事件與狀態機

- 驗簽：`constructEvent(rawBody, stripe-signature, STRIPE_WEBHOOK_SECRET)`
- 去重：`PaymentWebhookEvent.eventId` 唯一約束

處理事件：
- `checkout.session.completed`
- `checkout.session.expired`
- `checkout.session.async_payment_failed`
- `payment_intent.succeeded`
- `payment_intent.payment_failed`

狀態回寫：
- 成功：`Order.status=PAID` + `Order.paymentStatus=CAPTURED`
- 失敗：`Order.status=FAILED` + `Order.paymentStatus=FAILED`

## 5. 本機測試 SOP

1. 啟動開發站：`npm run dev`
2. 啟動 webhook 轉發：

```bash
stripe listen --forward-to http://localhost:3000/api/payments/stripe/webhook
```

3. 用測試卡完成付款（如 `4242 4242 4242 4242`）
4. 驗證資料表：
- `Order.status / paymentStatus`
- `PaymentAttempt.status`
- `PaymentWebhookEvent`（確認同 event 不重複入帳）

## 6. 注意事項

- 請避免同時啟用多個 `stripe listen` 進程。
- 若使用 Stripe CLI 且 listener 重啟，請確認 `STRIPE_WEBHOOK_SECRET` 是否需要更新。
- 基礎設施層變更（`.env` / Prisma / 套件）後需重啟 `next dev`。
