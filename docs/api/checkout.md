# Checkout API 規格（M5）

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

## 2. 資料模型

```ts
type CheckoutPreview = {
  form: CheckoutFormState;
  items: CheckoutOrderItem[];
  summary: CheckoutSummary;
  appliedPromo: { code: string; discountAmount: number } | null;
  deliveryWindowLabel: string;
};
```

## 3. API 一覽

### 3.1 `GET /api/checkout`

- 說明：讀取結帳頁初始化資料（表單預設值、商品、摘要、已套用促銷碼）
- 成功回應：

```json
{
  "code": 0,
  "message": "ok",
  "data": {
    "checkout": {
      "form": {
        "email": "user@example.com",
        "firstName": "",
        "lastName": "",
        "addressQuery": "",
        "phone": "",
        "billingSameAsShipping": true,
        "billingFirstName": "",
        "billingLastName": "",
        "billingAddress": "",
        "billingPhone": "",
        "cardName": "",
        "cardNumber": "",
        "cardExpiry": "",
        "cardCvc": "",
        "saveCardForFuture": false,
        "setAsDefaultCard": false
      },
      "items": [],
      "summary": {
        "subtotal": 0,
        "originalSubtotal": 0,
        "shippingFee": 0,
        "promoDiscount": 0,
        "total": 0,
        "savings": 0
      },
      "appliedPromo": null,
      "deliveryWindowLabel": "在 3月4日 週三至 3月9日 週一之間送達"
    }
  }
}
```

### 3.2 `POST /api/checkout/promo`

- 說明：套用或清除促銷碼（傳空字串代表清除）
- body：

```json
{
  "code": "WELCOME10"
}
```

- 成功：回傳最新 `checkout`
- 失敗：
  - `400`：促銷碼格式錯誤或促銷碼無效

### 3.3 `POST /api/checkout/place-order`

- 說明：建立訂單（M5 不做實際扣款）
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
    "cardNumber": "4242424242424242",
    "cardExpiry": "12/30",
    "cardCvc": "123",
    "saveCardForFuture": false,
    "setAsDefaultCard": false
  },
  "paymentMethod": "card"
}
```

- 成功回應（重點）：

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

- 失敗：
  - `400`：表單格式錯誤、購物車為空、欄位驗證失敗

## 4. M5 / M7 邊界

- M5：完成訂單建立與付款前狀態落庫（`PENDING_PAYMENT` / `PENDING`）
- M7：Stripe test mode（建立 PaymentIntent、`clientSecret`、Webhook 回寫訂單狀態）
