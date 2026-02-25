# Storefront Routes (M2)

## Primary routes

- `/`: 前台首頁（IA 入口）
- `/products`: 商品列表頁（PLP）
- `/products/[slug]`: 商品詳情頁（PDP）
- `/cart`: 購物車
- `/checkout`: 結帳流程骨架
- `/snkrs`: SNKRS 專區
- `/help`: 協助中心（占位頁）
- `/join`: 加入會員（占位頁）
- `/login`: 登入（占位頁）
- `/favorites`: 收藏頁（占位頁）

## Query conventions (PLP)

- `category`: 商品分類
- `group`: Header 策展群組（如 `new-featured`）
- `gender`: `men | women | kids | unisex`
- `sport`: 運動分類
- `collection`: 系列分類
- `sale`: 是否特惠
- `q`: 搜尋關鍵字
- `size`: 尺寸
- `color`: 顏色
- `sort`: 排序（`newest` / `price_asc` / `price_desc` / `popular`）
- `page`: 分頁頁碼（從 `1` 開始）

## URL examples

- `/products?category=running&sort=newest&page=1`
- `/products?category=lifestyle&color=black&size=10&sort=price_desc&page=2`
- `/products?price=3000-5000&sort=price_asc&page=1`

## Routing notes

- 前台採用 route group：`src/app/(storefront)/*`
- 後台維持獨立：`src/app/admin/*`
- API 仍在：`src/app/api/*`
