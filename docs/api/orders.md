# Orders API 規格（M7）

更新日期：2026-02-27

## 1. 共通規範

- Base：同源 `/api/*`
- Auth：需登入（`httpOnly` cookies）
- 回應 envelope：`code/message/data`

## 2. API 一覽

### 2.1 `GET /api/orders`

- 說明：取得目前登入會員的「已完成」訂單清單
- 完成訂單判定：
  - `status in [PAID, REFUNDED]` 或
  - `paymentStatus = CAPTURED`

成功回應範例：

```json
{
  "code": 0,
  "message": "ok",
  "data": {
    "orders": [
      {
        "id": "cm...",
        "status": "PAID",
        "paymentStatus": "CAPTURED",
        "total": 27540,
        "currency": "TWD",
        "deliveryWindowLabel": "在 3月4日 週三至 3月9日 週一之間送達",
        "placedAt": "2026-02-27T10:30:00.000Z",
        "items": [
          {
            "id": "cmi...",
            "slug": "air-force-1-07",
            "name": "Air Force 1 '07",
            "subtitle": "男鞋",
            "imageSrc": "https://...",
            "colorLabel": "白色",
            "sizeLabel": "28",
            "qty": 1,
            "unitPrice": 3600,
            "lineTotal": 3600,
            "compareAtPrice": 4200
          }
        ]
      }
    ]
  }
}
```
