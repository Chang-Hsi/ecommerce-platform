# Storefront Routes (M2)

## Primary routes

- `/`: 前台首頁（IA 入口）
- `/products`: 商品列表頁（PLP）
- `/products/[slug]`: 商品詳情頁（PDP）
- `/cart`: 購物車
- `/checkout`: 結帳流程骨架

## Query conventions (PLP)

- `category`: 商品分類
- `price`: 價格區間代碼（M3/M5 再定義實際 mapping）
- `size`: 尺寸
- `color`: 顏色
- `sort`: 排序（`newest` / `price_asc` / `price_desc`）
- `page`: 分頁頁碼（從 `1` 開始）

## URL examples

- `/products?category=running&sort=newest&page=1`
- `/products?category=lifestyle&color=black&size=10&sort=price_desc&page=2`
- `/products?price=3000-5000&sort=price_asc&page=1`

## Routing notes

- 前台採用 route group：`src/app/(storefront)/*`
- 後台維持獨立：`src/app/admin/*`
- API 仍在：`src/app/api/*`
