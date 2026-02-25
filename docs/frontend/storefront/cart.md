# Storefront Cart Spec (M3 Planning)

更新日期：2026-02-26

本文件根據你提供的兩張參考圖，定義購物車相關的 UI 企劃，包含：
- PDP 點擊「加入購物車」後的右上浮層（mini cart）
- `/cart` 購物車主頁（清單 + 摘要）

## 1. 前置流程（PDP -> Cart）

產品內頁點擊加入購物車後，流程如下：

1. 需要先選擇尺寸
   - 若未選尺寸就按「加入購物車」：顯示紅字錯誤（例如：`請先選擇尺寸`）
2. 已選尺寸後按「加入購物車」
   - 將商品資料寫入 cart store（M3 mock）
   - 開啟右上 mini cart 浮層
   - 畫面其餘區域加遮罩（dim backdrop）
3. mini cart 內有兩顆主按鈕
   - `查看購物車 (n)` -> 跳轉 `/cart`
   - `結帳` -> 跳轉 `/checkout`（M3 可先到 placeholder）

## 2. Mini Cart（右上浮層）規格

### 2.1 顯示時機

- 觸發：PDP 成功加入購物車
- 可重複觸發：連續加入不同商品時，浮層更新內容與數量

### 2.2 版面結構（依參考圖）

- 定位：桌機在視窗右上（不跟內容捲動）
- 區塊：
  1. Header：綠色勾勾 + `已加入購物車` + 右上關閉 `X`
  2. 商品摘要：縮圖、名稱、副標、尺寸、價格、劃線原價
  3. Footer CTA：
     - 左：`查看購物車 (n)`（白底框線）
     - 右：`結帳`（黑底）

### 2.3 互動行為

- 可由以下方式關閉：
  - 點 `X`
  - 點遮罩
  - 按 `Esc`
- 浮層開啟時：
  - 背景可維持不可操作（推薦）
  - 焦點應進入浮層，關閉後回到觸發按鈕（A11y）

### 2.4 動畫建議

- 開啟：淡入 + 由右上輕微位移
- 關閉：淡出 + 回彈位移
- 遮罩：opacity 過渡

## 3. `/cart` 頁面規格

本頁不做 sticky（依你的要求）。

### 3.1 版面架構（Desktop）

- 左區塊：購物車清單（約 2/3）
- 右區塊：摘要（約 1/3）
- Grid 建議：`lg:grid lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-10`

### 3.2 左區塊：購物車清單

每個商品列包含：

1. 商品區
   - 商品圖
   - 名稱（可連回 PDP）
   - 副標（品類）
   - 配色文字（例如 `Metallic Red Bronze/Metallic Rose Gold`）
   - 尺寸（例如 `尺寸 28`）
   - 價格：
     - 有折扣時顯示劃線原價 + 現價
     - 無折扣時只顯示現價
2. 操作列
   - 刪除（垃圾桶 icon）
   - 數量控制（`- / qty / +`）
   - 收藏（愛心）
3. 庫存提醒（橘色）
   - `所剩庫存不多，欲購從速。`
4. 商品分隔線

### 3.3 右區塊：摘要

內容：

- 標題：`摘要`
- `小計`
- `預估運費與手續費`（圖中為免費）
- `總計`
- CTA：
  - `會員結帳`（黑底主按鈕）
  - `PayPal`（次按鈕）

備註：
- 金額顯示以 `NT$` + 千分位格式
- 右欄與左欄不做 sticky（遵循本企劃）

### 3.4 最愛區塊（頁尾）

- 區塊標題：`最愛`
- 空狀態文案：`你的最愛中未儲存任何品項。`
- 後續可擴充為收藏商品列表

## 4. 響應式規格（Mobile-first）

- `<lg`
  - 清單與摘要改為單欄堆疊
  - 摘要在清單下方
  - 按鈕維持全寬
  - 商品列資訊採上下排列，避免擁擠
- `>=lg`
  - 還原左右雙欄

## 5. 資料欄位（M3 mock 建議）

`CartItem`：
- `id`
- `slug`
- `name`
- `subtitle`
- `imageSrc`
- `colorLabel`
- `sizeLabel`
- `unitPrice`
- `compareAtPrice?`
- `qty`
- `lowStock?`

`CartSummary`：
- `subtotal`
- `shippingFee`
- `serviceFee`
- `total`

`MiniCartState`：
- `isOpen`
- `lastAddedItem`
- `itemCount`

## 6. 分層與檔案建議

- `src/content/cart.ts`
  - cart mock data / empty state / payment method label
- `src/features/cart/CartPage.tsx`
  - 頁面拼接（清單 + 摘要 + 最愛區塊）
- `src/components/cart/*`
  - `MiniCartPanel.tsx`
  - `CartItemRow.tsx`
  - `QuantityStepper.tsx`
  - `CartSummaryPanel.tsx`
- `src/hooks/cart/*`
  - `useCartController.ts`（數量、刪除、摘要計算）
  - `useMiniCartController.ts`（開關、最後加入商品）
- `src/lib/cart/*`
  - mock store / formatter / mapper

## 7. 驗收標準（M3）

- [ ] PDP 未選尺寸不可加入購物車，會顯示錯誤提示
- [ ] PDP 成功加入後會開啟 mini cart + 遮罩
- [ ] mini cart 內可跳轉 `/cart` 與 `/checkout`
- [ ] `/cart` 完成左清單右摘要（desktop）
- [ ] cart 頁不使用 sticky
- [ ] 數量增減、刪除、收藏 UI 可操作（M3 可先 mock state）
- [ ] 手機與桌機都可正常瀏覽與操作

## 8. M4/M5 轉正式實作方向

目前仍為前端 mock，後續將逐步替換為真實資料：

1. M4：資料模型與 migration
   - 建立 `cart` / `cart_item` 資料表
2. M5：API 串接
   - `GET /api/cart`
   - `POST /api/cart/items`
   - `PATCH /api/cart/items/:id`
   - `DELETE /api/cart/items/:id`
3. 前端替換
   - `useCartController` 從 local mock 改讀 API
   - mini cart 改讀 API 回應中的最新 cart summary
