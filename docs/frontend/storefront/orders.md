# Storefront Orders Spec（M7）

更新日期：2026-02-27

## 1. 目標

- 提供會員可查看已完成訂單的頁面 `/orders`
- 版面沿用購物車視覺語言，降低學習成本

## 2. 頁面結構（由上到下）

1. 訂單資訊區塊
- 資料來源：`GET /api/orders`
- 顯示內容：訂單編號、下單日期、付款狀態、配送資訊、訂單商品明細、訂單總計
- 樣式：與購物車商品列表風格一致（圖、品名、規格、價格）

2. 最愛區塊
- 重用購物車頁 `CartFavoritesSection`

3. 你可能也會喜歡
- 重用 `ProductRecommendations`
- 推薦邏輯：優先排除已購買商品 slug，補足前 6 筆

## 3. 路由與元件對照

- Route：`src/app/(storefront)/orders/page.tsx`
- Feature：`src/features/orders/OrdersPage.tsx`
- Hook：`src/hooks/orders/useOrdersController.ts`
- API Client：`src/lib/api/orders.ts`
- Type：`src/lib/orders/types.ts`

## 4. Header 入口

- Header 帳號選單「訂單」行為：導向 `/orders`

## 5. M7 範圍與邊界

- 僅顯示已完成訂單（`PAID` / `REFUNDED` 或 `CAPTURED`）
- 不含：取消訂單、退貨申請、物流追蹤詳情頁
