# Storefront Favorites Spec (M3 Planning)

更新日期：2026-02-26

本文件根據你提供的兩張參考圖，定義收藏功能的前台企劃，包含：
- PDP 點擊「最愛」後的右上提示浮層（favorite confirm panel）
- `/favorites` 收藏頁（最愛清單）

## 1. 目標與範圍

- 目標：建立從 PDP 收藏動作到最愛頁瀏覽的閉環流程。
- 範圍：前台 `ProductDetailPage`、`Header` 最愛入口、`/favorites` 頁。
- 階段：M3 先用 mock state 與本地資料；M4/M5 再切換正式資料模型與 API。

## 2. 前置流程（PDP -> 收藏提示 -> Favorites）

在產品內頁 `ProductDetailPage.tsx`，使用者點擊「最愛」後流程如下：

1. 切換收藏狀態（未收藏 -> 已收藏）。
2. 右上顯示「已加入最愛」浮層（版型參考第一張圖，與 mini cart 體驗一致）。
3. 浮層內提供 `檢視最愛` CTA，點擊後跳轉 `/favorites`。
4. Header 右上愛心 icon 與帳號下拉選單 `最愛` 也可跳轉 `/favorites`。

## 3. 收藏提示浮層（Favorite Confirm Panel）

### 3.1 顯示時機

- 觸發：PDP 點擊「最愛」且狀態變為已收藏。
- 若已收藏再點一次取消收藏：不顯示成功浮層（避免訊息干擾）。

### 3.2 版面結構（對齊參考圖）

- 定位：桌機固定於右上（不隨內容卷動）。
- 區塊：
  1. Header：綠色勾勾 + `已加入最愛` + 關閉按鈕 `X`
  2. 商品摘要：縮圖、名稱、副標、價格
  3. CTA：`檢視最愛`（黑底主按鈕）

### 3.3 互動行為

- 可由以下方式關閉：
  - 點 `X`
  - 點遮罩
  - 按 `Esc`
- 浮層開啟時鎖定 `body scroll`，關閉時恢復。
- 點 `檢視最愛` 進入 `/favorites`，並關閉浮層。

### 3.4 動畫建議

- 開啟：淡入 + 由右上輕微位移（與 mini cart 一致）。
- 關閉：淡出 + 位移回收。
- 遮罩：opacity 過渡。

## 4. `/favorites` 頁面規格

### 4.1 版面架構

- 標題：`最愛`
- 清單區：商品卡片 Grid（參考第二張圖）
- 頁面容器：與 storefront 既有版心一致，維持 `mobile-first`。

Desktop 建議：
- `lg:grid-cols-2` 起跳（先對齊你提供參考圖的一排兩張）
- `xl` 可擴展為 `3` 欄（保留後續擴充）

### 4.2 卡片資訊層級

每張最愛卡片包含：

1. 商品圖（大面積，右上有愛心移除按鈕）
2. 名稱 + 價格（同列）
3. 副標（品類）
4. CTA 區：
   - 狀態 A：`加入購物車`（白底框線）
   - 狀態 B：`已加入`（含綠色勾勾，代表該品項已在購物車）

### 4.3 卡片互動

- 點卡片主體：導向 `/products/[slug]`
- 點右上愛心：取消收藏並從清單移除
- 點 `加入購物車`：
  - 若該商品需要尺寸且未指定尺寸，導向 PDP 讓使用者選尺寸
  - 若可直接加入（已有預設尺寸或規格），直接加入並切換為 `已加入`

## 5. 空狀態規格

當收藏清單為空時：

- 顯示標題：`你的最愛目前沒有商品`
- 輔助文案：引導回產品列表
- CTA：`前往選購` -> `/products?page=1`

## 6. 登入與權限（M3 mock）

- 未登入點 PDP「最愛」：
  - 導向 `/login?redirect=/products/[slug]`
- 未登入直接進 `/favorites`：
  - 導向 `/login?redirect=/favorites`
- 登入後回跳原頁，維持流程連續性。

## 7. 響應式規格（Mobile-first）

- `<lg`
  - 單欄卡片列表
  - 商品圖比例維持一致，避免高度跳動
  - 按鈕全寬，方便單手操作
- `>=lg`
  - 雙欄（或三欄）Grid
  - 卡片資訊區保留固定節奏，避免對齊混亂

## 8. M3 資料欄位（建議）

`FavoriteItem`：
- `id`
- `slug`
- `name`
- `subtitle`
- `imageSrc`
- `price`
- `compareAtPrice?`
- `isInCart`
- `defaultSize?`
- `requiresSizeSelection`
- `addedAt`

`FavoritePanelPayload`：
- `itemId`
- `name`
- `subtitle`
- `imageSrc`
- `price`

## 9. 分層與檔案建議（對齊現有架構）

- `src/content/favorites.ts`
  - favorites mock data / 空狀態文案
- `src/features/favorites/FavoritesPage.tsx`
  - 頁面拼接（標題 + grid + empty state）
- `src/components/favorites/*`
  - `FavoriteItemCard.tsx`
  - `FavoritesGrid.tsx`
  - `FavoriteConfirmPanel.tsx`
- `src/hooks/favorites/*`
  - `useFavoritesController.ts`（移除收藏、加入購物車、空狀態）
  - `useFavoritePanelController.ts`（浮層開關與事件）
- `src/lib/favorites/*`
  - `mock-favorites.ts`（localStorage + events）
  - `types.ts`

## 10. 與現有模組銜接

- 與 `ProductDetailView`：
  - 既有 `onToggleFavorite` 擴充為「寫入 favorites store + 觸發提示浮層」
- 與 `Header`：
  - 保留右上愛心入口與帳號選單 `favorites` 導向 `/favorites`
- 與 `cart`：
  - 收藏卡 CTA 點擊可呼叫 `addCartItem`，並用 `isInCart` 顯示 `已加入`

## 11. 驗收標準（M3）

- [ ] PDP 點「最愛」可成功切換收藏狀態
- [ ] 收藏成功後會顯示右上提示浮層（含 `檢視最愛`）
- [ ] 點 Header 愛心或帳號選單 `最愛` 可進入 `/favorites`
- [ ] `/favorites` 完成卡片列表（圖、標題、副標、價格、愛心、CTA）
- [ ] 收藏頁空狀態可正常顯示與導流
- [ ] 手機與桌機版面皆可操作且不破版

## 12. M4/M5 遷移方向

1. M4：資料模型
   - 建立 `wishlist` / `wishlist_item`（對 user 關聯）
2. M5：API
   - `GET /api/favorites`
   - `POST /api/favorites/items`
   - `DELETE /api/favorites/items/:id`
3. 前端替換
   - `mock-favorites.ts` 換成 API client
   - 收藏提示浮層改讀 API 回傳資料
