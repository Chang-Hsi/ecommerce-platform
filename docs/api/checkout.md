# Checkout API 規格（M7 Done）

更新日期：2026-02-27

## 1. 共通規範

- Base：同源 `/api/*`
- Auth：皆需登入（`httpOnly` cookies：access/refresh token）
- 回應 envelope：

```json
{
  "code": 0,
  "message": "ok",
  "data": {}
}
```

## 2. API 一覽

- `GET /api/checkout`
- `POST /api/checkout/promo`
- `POST /api/checkout/place-order`
- `POST /api/payments/stripe/webhook`

## 3. Checkout

### 3.1 `GET /api/checkout`

- 說明：讀取結帳初始化資料（form/items/summary/appliedPromo/deliveryWindow）
- 成功：`data.checkout`（含完整 `CheckoutFormState`）

### 3.2 `POST /api/checkout/promo`

- 說明：套用或清除促銷碼（傳空字串代表清除）
- body：

```json
{
  "code": "WELCOME10"
}
```

### 3.3 `POST /api/checkout/place-order`

- 說明：建立訂單與付款前置資料
- body：

```json
{
  "form": {
    "email": "user@example.com",
    "firstName": "王",
    "lastName": "小美",
    "addressQuery": "桃園市桃園區中寧街50巷10號",
    "phone": "0912000111",
    "billingSameAsShipping": true,
    "billingFirstName": "",
    "billingLastName": "",
    "billingAddress": "",
    "billingPhone": "",
    "cardName": "WANG HSIAO MEI",
    "cardNumber": "",
    "cardExpiry": "",
    "cardCvc": "",
    "saveCardForFuture": false,
    "setAsDefaultCard": false
  },
  "paymentMethod": "card"
}
```

- `paymentMethod` 對應：
  - `card`：站內 Stripe Elements（PaymentIntent）
  - `paypal`：前端文案為 `Stripe`，走 Stripe Hosted Checkout
  - `gpay`：M7 保留 UI（`M7_PENDING`）

- 成功回應範例 A（`card` 站內付款）：

```json
{
  "code": 0,
  "message": "ok",
  "data": {
    "order": {
      "id": "cm...",
      "status": "PENDING_PAYMENT",
      "paymentStatus": "PENDING",
      "total": 27540,
      "currency": "TWD"
    },
    "redirectUrl": "",
    "paymentPreparation": {
      "provider": "stripe",
      "mode": "STRIPE_EMBEDDED",
      "clientSecret": "pi_..._secret_..."
    }
  }
}
```

- 成功回應範例 B（`paypal` -> Stripe Checkout）：

```json
{
  "code": 0,
  "message": "ok",
  "data": {
    "order": {
      "id": "cm...",
      "status": "PENDING_PAYMENT",
      "paymentStatus": "PENDING",
      "total": 27540,
      "currency": "TWD"
    },
    "redirectUrl": "https://checkout.stripe.com/c/pay/cs_test_...",
    "paymentPreparation": {
      "provider": "stripe",
      "mode": "STRIPE_CHECKOUT",
      "clientSecret": null
    }
  }
}
```

- 成功回應範例 C（`gpay` UI 預留）：

```json
{
  "code": 0,
  "message": "ok",
  "data": {
    "order": {
      "id": "cm...",
      "status": "PENDING_PAYMENT",
      "paymentStatus": "PENDING",
      "total": 27540,
      "currency": "TWD"
    },
    "redirectUrl": "/checkout/success?orderId=cm...",
    "paymentPreparation": {
      "provider": "stripe",
      "mode": "M7_PENDING",
      "clientSecret": null
    }
  }
}
```

## 4. Webhook（Stripe）

### 4.1 `POST /api/payments/stripe/webhook`

- 驗簽：`stripe-signature` + `STRIPE_WEBHOOK_SECRET`
- 去重：`PaymentWebhookEvent.eventId` 唯一鍵
- 狀態回寫：
  - 成功事件 -> `Order.status=PAID`、`Order.paymentStatus=CAPTURED`
  - 失敗事件 -> `Order.status=FAILED`、`Order.paymentStatus=FAILED`

### 4.2 目前處理事件

- `checkout.session.completed`
- `checkout.session.expired`
- `checkout.session.async_payment_failed`
- `payment_intent.succeeded`
- `payment_intent.payment_failed`

## 5. 注意事項

- `place-order` 會先建立訂單，再進入 Stripe 付款流程；前端需正確處理 `paymentPreparation.mode`。
- 不要同時開多個 `stripe listen` 轉發，避免同一事件重複送達。
- 本機 Stripe CLI 重啟後，若 `whsec` 改變，需同步更新 `.env.local` 的 `STRIPE_WEBHOOK_SECRET`。
