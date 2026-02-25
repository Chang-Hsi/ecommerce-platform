# API Overview (M1)

- Runtime: Next.js Route Handlers (`src/app/api/*`)
- Health Check: `GET /api/health`
- Response sample:

```json
{
  "status": "ok",
  "service": "ecommerce-platform",
  "timestamp": "2026-02-25T00:00:00.000Z"
}
```

> Step5 會新增 products/cart/orders/auth 等實際 API。
