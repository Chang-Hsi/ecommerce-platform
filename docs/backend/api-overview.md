# API Overview（M5）

更新日期：2026-02-27

## 1. 共通回應格式

所有 `/api/*` 路由使用同一個 envelope：

```json
{
  "code": 0,
  "message": "ok",
  "data": {}
}
```

- `code = 0`：成功
- `code != 0`：失敗（常見為 `1`、`401`、`409`）

## 2. 鑑權規則

- 需登入 API：透過 `httpOnly` cookies（access/refresh token）
- 前端 request 層遇 `401` 會先嘗試 `/api/auth/refresh`，成功後自動重試原請求一次

## 3. API 索引

### 3.1 Core

- `GET /api/health`

### 3.2 Auth

- `POST /api/auth/login/request-code`
- `POST /api/auth/login/verify`
- `GET /api/auth/session`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`

### 3.3 Storefront

- Home：`GET /api/home`
- Products：`GET /api/products`、`GET /api/products/[slug]`
- Favorites：`GET /api/favorites`、`POST /api/favorites`、`DELETE /api/favorites/[slug]`
- Cart：`GET /api/cart`、`POST /api/cart/items`、`PATCH/DELETE /api/cart/items/[itemId]`
- Help：`GET /api/help`
- SNKRS：`GET /api/snkrs`

### 3.4 Profile

- 規格文件：[docs/api/profile.md](../api/profile.md)
- Routes：
  - `GET /api/profile`
  - `PUT/DELETE /api/profile/account`
  - `POST /api/profile/addresses`
  - `DELETE /api/profile/addresses/[addressId]`
  - `PUT /api/profile/preferences`
  - `PUT /api/profile/privacy`
  - `PUT /api/profile/visibility`
  - `POST /api/profile/avatar`

### 3.5 Checkout（M5：非金流）

- 規格文件：[docs/api/checkout.md](../api/checkout.md)
- Routes：
  - `GET /api/checkout`
  - `POST /api/checkout/promo`
  - `POST /api/checkout/place-order`

## 4. 里程碑邊界（Checkout/Payment）

- M5：完成 checkout preview / promo / place-order（建立訂單與 payment attempt，狀態為 pending）
- M7：串接 Stripe test mode、取得 `clientSecret`、支付成功後更新訂單狀態
