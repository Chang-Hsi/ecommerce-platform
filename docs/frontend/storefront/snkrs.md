# Storefront SNKRS Spec (M3 Planning)

更新日期：2026-02-26

本文件根據你提供的 SNKRS 參考圖，定義 `/snkrs` 在 M3 的前台企劃，涵蓋：
- `現貨` 商品清單
- `即將推出` 商品清單
- `地圖`（附近據點探索）

## 0. 已定案限制（本次必須遵守）

1. 頂部 tab 僅保留：`現貨`、`即將推出`、`地圖`（不做 `動態` tab）。
2. `現貨` / `即將推出` 都是商品卡片清單，主要差異為 CTA 文案與可點擊狀態。
3. 清單採「手動載入更多」分頁，使用者主動點擊才加載下一頁。
4. 若無下一頁，`載入更多` 按鈕需隱藏。
5. `地圖` M3 不串真實定位，使用 mock 座標與 mock 地址資料。

---

## 1. 目標與範圍

- 目標：完成可操作的 SNKRS 專區主流程（切 tab、看卡片、載入更多、地圖探索）。
- 範圍：前台 `/snkrs` 單一路由內切換三個 tab。
- 階段：M3 使用 mock 資料；M4/M5 再接正式發售與門店 API。

---

## 2. 資訊架構（IA）

`/snkrs` 頁面結構：

1. 頂部 SNKRS 導覽條
   - 左側：SNKRS logo
   - 中央：tab（`現貨`、`即將推出`、`地圖`）
   - Active tab 底線高亮
2. 內容區（依 tab 切換）
   - `現貨`：可購買商品卡片 grid
   - `即將推出`：發售日商品卡片 grid
   - `地圖`：左側據點清單 + 右側地圖

URL 建議：
- 使用 query 來保存 tab 狀態：`/snkrs?tab=in-stock|upcoming|map`
- 重新整理後保留當前 tab。

---

## 3. `現貨` Tab 企劃

## 3.1 卡片版型

每張卡片包含：
- 大圖區（淺灰底）
- 副標（品類/系列）
- 主標（色名或主題名）
- CTA：黑底圓角膠囊 `購買`

視覺節奏參考圖：
- 圖片區高度大於文字區，主視覺優先
- CTA 置於文字區右側
- 卡片間距固定，保留乾淨留白

## 3.2 互動行為

- 點商品圖或文字區：導向商品內頁 `/products/[slug]`
- 點 `購買`：同樣導向商品內頁（M3 先不做直購）
- 支援 `載入更多`：
  - 每次 append 下一頁資料
  - 沒有下一頁時隱藏按鈕

## 3.3 清單規則

- 預設排序：新品優先（可用 mock `publishedAt desc`）
- M3 不做 filter/sort 面板

---

## 4. `即將推出` Tab 企劃

## 4.1 卡片版型

延續現貨卡片，但加上發售日期資訊：
- 圖片左上角顯示 `月` + `日`（如 `2月 27日`）
- CTA：灰底膠囊 `即將推出`（預設 disabled 樣式）
- 副標、主標與現貨一致

## 4.2 互動行為

- 點卡片主體：可進商品內頁（查看詳情/提醒）
- `即將推出` 按鈕：M3 僅作狀態呈現，不觸發購買流程
- `載入更多` 行為同現貨

## 4.3 清單規則

- 預設排序：`releaseDate asc`（最近發售在前）
- M3 不處理抽籤狀態（例如已登記、已截止）

---

## 5. `地圖` Tab 企劃

## 5.1 版面結構（Desktop）

- 左側固定欄（約 320-360px）
  - 標題：`探索你的周邊地區`
  - 次文案：附近地點數量（如 `你附近有 15 個地點`）
  - 據點清單（logo + 店名 + 城市 + 距離）
- 右側地圖區（滿版）
  - 地圖底圖 + marker
  - 可顯示資訊卡（店鋪詳情）

## 5.2 狀態定義

1. `無附近據點` 狀態
   - 左欄數量為 0
   - 地圖上顯示空狀態卡：`附近目前沒有新鮮事`
   - 提供 CTA（例：`探索紐約市`）
2. `有附近據點` 狀態
   - 左欄列表可捲動
   - 地圖顯示多個 marker
3. `選取據點` 狀態
   - 對應 marker 高亮
   - 地圖顯示店鋪資訊卡（店名、城市、距離、地址、詳情連結）

## 5.3 互動行為

- 點左欄店鋪：
  - 地圖中心移動到店鋪位置
  - 打開該店資訊卡
- 點 marker：
  - 同步高亮左欄對應店鋪
  - 打開資訊卡
- 點資訊卡 `X`：關閉資訊卡（保留選取狀態可選）

## 5.4 技術可行性（M3）

純前端可落地，建議：
- 地圖渲染：Leaflet + OpenStreetMap tile（或現有團隊偏好方案）
- 座標/門店：使用 mock JSON
- 定位：先不請求 `navigator.geolocation`，改用固定預設中心點（例如台灣北部）

---

## 6. 響應式規格（Mobile-first）

- `<lg`
  - 頂部 tab 保持可點，底線顯示 active
  - `現貨/即將推出`：1 欄卡片列表
  - `地圖`：改為上下堆疊
    - 上：地圖（固定高度）
    - 下：據點列表（可捲動）
- `>=lg`
  - `現貨/即將推出`：4 欄 grid（依容器可降為 3 欄）
  - `地圖`：左右分欄

---

## 7. M3 資料模型（建議）

`SnkrsProductCard`：
- `id`
- `slug`
- `name`
- `subtitle`
- `imageSrc`
- `tab` (`inStock` | `upcoming`)
- `releaseDate?`（upcoming 使用）
- `badgeLabel?`（例如購買/即將推出）

`SnkrsStoreLocation`：
- `id`
- `name`
- `city`
- `distanceKm`
- `logoSrc`
- `lat`
- `lng`
- `address`
- `detailUrl`

`SnkrsMapState`：
- `center`
- `zoom`
- `selectedStoreId?`
- `hasNearbyStores`

---

## 8. 分層與檔案建議（對齊現有架構）

- `src/content/snkrs.ts`
  - tab 文案、空狀態文案、load-more 文案
- `src/features/snkrs/SnkrsPage.tsx`
  - 頁面拼接與 tab 切換
- `src/components/snkrs/*`
  - `SnkrsTabs.tsx`
  - `SnkrsProductGrid.tsx`
  - `SnkrsProductCard.tsx`
  - `SnkrsLoadMoreButton.tsx`
  - `SnkrsMapPanel.tsx`
  - `SnkrsStoreList.tsx`
  - `SnkrsStoreInfoCard.tsx`
- `src/hooks/snkrs/*`
  - `useSnkrsTabState.ts`
  - `useSnkrsFeedController.ts`
  - `useSnkrsMapController.ts`
- `src/lib/snkrs/*`
  - `types.ts`
  - `mock-snkrs-products.ts`
  - `mock-snkrs-stores.ts`

---

## 9. 驗收標準（M3）

- [ ] `/snkrs` 有三個 tab：現貨 / 即將推出 / 地圖（無動態）
- [ ] 切 tab 時 active 底線正確
- [ ] 現貨卡片顯示與 `購買` CTA 正常
- [ ] 即將推出卡片顯示發售日與灰色 `即將推出` CTA
- [ ] 兩個商品 tab 皆支援 `載入更多`，無下一頁時按鈕隱藏
- [ ] 地圖 tab 可顯示 `無據點` 與 `有據點` 兩種狀態
- [ ] 點店鋪列表可同步地圖 marker 與資訊卡
- [ ] 手機/桌機版面不破版

---

## 10. 決策定案（2026-02-26）

1. `購買` 的 M3 行為：
   - A. 一律導向商品內頁 `/products/[slug]`
2. `即將推出` 按鈕：
   - B. 可點並導向詳情頁（按鈕文案仍為即將推出）
3. `載入更多` 每次加載筆數：
   - B. 每次 8 筆（減少點擊次數）
4. 地圖實作方案（M3）：
   - A. Leaflet + OSM（純前端、無金鑰）
5. 地圖預設城市/座標：
   - A. 固定台灣北部（示意）
6. 地圖空狀態 CTA 文案：
   - A. `探索其他城市`

---

## 11. M4/M5 遷移方向

1. M4：建立 SNKRS 發售模型（release / drop calendar / store event）。
2. M5：串接 feed API + store locator API。
3. M5：地圖改為真實定位與距離計算（可切換城市）。
