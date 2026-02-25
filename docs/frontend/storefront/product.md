# Storefront Products Spec (M3 Implemented)

此文件已從「企劃版」更新為「目前落地實作版」。
更新日期：2026-02-25

## 1. 路由與頁面責任

- 路由：`/products`
- route 入口：`src/app/(storefront)/products/page.tsx`
- feature 拼接：`src/features/products/ProductsPage.tsx`
- 實際畫面組裝：`src/components/products/ProductsView.tsx`

`ProductsPage.tsx` 保持精簡，只負責把 `searchParams` 傳入 View，不放細節邏輯。

## 2. 分層策略（本頁已套用）

- `src/content/products.ts`
  - products 靜態資料
  - sort options / quick category links / filter options / color options
  - 商品資料欄位已包含未來 API / DB 需要的 filterAttributes
- `src/components/products/*`
  - Header、FilterGroup、FiltersPanel、Grid 等 UI 元件
- `src/hooks/products/useProductsController.ts`
  - 集中管理此頁 UI state 與 query 同步行為
- `src/lib/products/query-state.ts`
  - query parse/normalize/build 與 API params mapping

## 3. Header 與 Sticky 行為（已落地）

### 3.1 ProductsHeader

- 元件：`src/components/products/ProductsHeader.tsx`
- `id="products-sticky-header"`
- 使用 `sticky top-[var(--storefront-header-offset,0px)]`
- Desktop 支援 compact 與 normal 兩種高度，轉場 `duration-500`
- Desktop 右側有：
  - 顯示/隱藏篩選條件按鈕
  - 排序下拉（`DropdownSelect`）

### 3.2 進入 compact 的門檻

- 在 `useProductsController` 內由 scroll 控制：
  - 進入 compact：`scrollY > 200`
  - compact 狀態維持門檻：`scrollY > 140`
- 目的：避免頂部附近頻繁閃爍

## 4. Desktop 版面（已落地）

- 左側 Sidebar：
  - `fixed` + 獨立 `overflow-y-auto`
  - top 位置動態量測 `products-sticky-header` 的 `rect.bottom + 12`
  - 確保 Header 高度變化後 Sidebar 不被蓋住
  - 支援顯示/隱藏滑入滑出（translate + opacity）
- 右側 Main：
  - Sidebar 顯示時 `lg:pl-[292px]`
  - Sidebar 隱藏時 `lg:pl-0`
  - 商品卡片 2 欄（mobile）/3 欄（xl）

## 5. Sidebar 篩選（已落地）

篩選群組：
- 性別
- 兒童款
- 依價格選購
- 顏色
- 品牌
- 運動
- 適合
- 特點
- 技術

互動細節：
- `FilterGroup` 預設收合（defaultOpen = false）
- 可展開/收合動畫（max-height + opacity）
- 品牌支援 `+ 更多 / - 精簡` 切換（含展開動畫）
- 顏色使用圓形色票，點擊即選取；選取時圈圈內顯示勾勾（無額外 checkbox）

## 6. Mobile 行為（已落地）

- Header 下方有橫向分類列（可左右滑）
- 結果列顯示「結果數 + 篩選按鈕」
- 點「篩選」後開啟全螢幕 Sheet（由下往上）
- Sheet 內含：
  - 排序 radio
  - 同一套 FiltersPanel
- 有 backdrop，點背景或右上關閉按鈕可關閉
- 開啟 Sheet 時鎖 body scroll，`Esc` 可關閉

## 7. Query 契約（目前）

目前解析的 query keys：
- `category`
- `sort`
- `page`
- `q`
- `gender`
- `kids`
- `price`
- `brand`
- `sport`
- `fit`
- `feature`
- `tech`
- `colors`

格式：
- 多值欄位使用逗號分隔（例：`colors=黑色,白色`）
- `buildQueryString` 預設會把 `page` 重置為 `1`

目前已接 URL 同步：
- category（快速分類）
- sort（排序）
- colors（顏色色票）
- gender（性別 checkbox）
- kids（兒童款 checkbox）
- price（價格區間 checkbox）
- brand（品牌 checkbox）
- sport（運動 checkbox）
- fit（適合 checkbox）
- feature（特點 checkbox）
- tech（技術 checkbox）

## 8. 商品資料結構（目前）

`src/content/products.ts` 中每個商品含：
- 基本欄位：`slug/name/subtitle/badge/price/imageSrc/imageRatio`
- `filterAttributes`：
  - `category`
  - `gender`
  - `audience`
  - `kidsSegments`
  - `priceRange`
  - `colors`
  - `brand`
  - `sports`
  - `fit`
  - `features`
  - `tech`

此結構已可直接作為 M4 DB schema / API payload 的對照基礎。

## 9. 後續頁面一致性規範（強制）

之後新頁面都要遵循同一模式：

1. `src/content/*` 放靜態資料
2. `src/features/*` 只做頁面拼接
3. `src/components/*` 放可重用區塊元件
4. `src/hooks/*` 放頁面 controller / 狀態邏輯
5. `src/lib/*` 放純邏輯映射與工具函式

不把不同職責混在同一層，確保後續串 API / 拆分模組時可平滑遷移。

## 10. 產品內頁（PDP）UI 企劃（待實作）

本章節依你提供的參考圖，定義 PDP 的第一版 UI 規格與實作邊界。

### 10.1 圖片分析（Desktop）

從參考圖可拆成三個主要區塊：

1. 左側媒體區（約佔 60%）
   - 左欄為垂直縮圖清單（可滾動）
   - 中間為主圖舞台（大圖，淺灰背景）
   - 主圖右下有上一張/下一張圓形按鈕
2. 右側購買資訊區（約佔 40%）
   - 商品名稱、副標、價格、原價、折扣
   - 尺寸選擇（2 欄格狀按鈕，含 disabled）
   - CTA：加入購物車（黑底）/ 最愛（白底框線）
   - 商品描述與規格條列
   - Accordion：免運退貨、評價
3. 下方推薦商品區
   - 區塊標題：你可能也會喜歡
   - 3 欄商品卡（圖 + 名稱 + 副標 + 價格）
   - 右上角左右箭頭（carousel 控制）

### 10.2 版面與資訊階層規格

- 頁面外層：`max-w-7xl`，左右留白一致
- 主區塊：`lg:grid lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-8`
- 右欄在 desktop 建議 sticky（`top` 對齊 header offset），行動版改正常流
- 資訊順序（由上到下）：
  1. `title` / `subtitle`
  2. `price` / `compareAtPrice` / `discountLabel`
  3. 尺寸區 + 尺寸指南入口
  4. CTA 區
  5. 描述段落
  6. 規格條列（顏色、款式、產地）
  7. Accordion 區塊（運送與評價）
  8. 推薦商品區（頁面下半段）

### 10.3 元件切分（符合現有分層）

- `src/content/products.ts`
  - 擴充 PDP 靜態資料：多圖、尺寸庫存、描述、specs、推薦商品
- `src/features/products/ProductDetailPage.tsx`
  - 保持 page composition，串接 PDP 區塊
- `src/components/products/*`（建議新增）
  - `ProductMediaGallery.tsx`：縮圖 + 主圖 + 上下張控制
  - `ProductPurchasePanel.tsx`：標題/價格/尺寸/CTA
  - `SizeGrid.tsx`：尺寸選擇與 disabled 狀態
  - `ProductSpecs.tsx`：描述 + specs
  - `ProductAccordion.tsx`：運送、評價可展開區塊
  - `ProductRecommendations.tsx`：推薦商品 carousel
- `src/hooks/products/*`（建議新增）
  - `useProductDetailController.ts`：處理主圖 index、尺寸選擇、CTA 狀態
- `src/lib/products/*`（建議新增）
  - `detail-mapper.ts`：由 slug 映射 detail data（M3 mock；M5 改 API）

### 10.4 互動規格

1. 圖庫互動
   - 點縮圖：主圖切換
   - 點左右箭頭：主圖 index 前進/後退
   - 到邊界時按鈕 disabled（或循環播放，擇一；M3 先用 disabled）
2. 尺寸互動
   - 可選尺寸：可點擊，選中後有明顯 active 樣式
   - 無庫存尺寸：`disabled` + 降低對比
   - 未選尺寸前按「加入購物車」顯示提示（例如「請先選擇尺寸」）
3. CTA
   - `加入購物車`：M3 先做前端 mock（可先導至 cart 並附帶選擇結果）
   - `最愛`：切換收藏狀態（M3 可僅做 UI state）
4. Accordion
   - 支援單一展開或多展開（M3 建議單一展開）
   - 預設收合，保留標題與摘要（如評價星數）
5. 推薦商品
   - desktop 顯示 3 張
   - 左右按鈕切換下一組
   - 點卡片導向對應 `/products/[slug]`

### 10.5 響應式規格（Mobile-first）

- `<lg`
  - 主圖先顯示，縮圖改為橫向列表
  - 右欄資訊改為主圖下方直向堆疊
  - CTA 按鈕維持全寬
  - 推薦商品改為橫向可滑動卡片
- `>=lg`
  - 還原參考圖兩欄布局
  - 右欄 sticky，提升選尺碼與 CTA 可用性

### 10.6 M3 資料欄位（建議）

建議在 `ProductCatalogItem` 之外補一份 detail 型別（或擴充現有型別）：

- `media`: `{ id, imageSrc, alt }[]`
- `pricing`: `{ price, compareAtPrice?, discountPercent? }`
- `sizes`: `{ label, value, inStock, isDefault? }[]`
- `description`: `string`
- `specs`: `{ color, styleCode, origin }`
- `accordions`: `{ key, title, content, ratingSummary? }[]`
- `recommendations`: `slug[]`

目的：讓 M4 DB 與 M5 API 可直接對齊，不必大改 UI 結構。

### 10.7 驗收標準（PDP 第一版）

- [ ] `/products/[slug]` 可依 slug 讀取對應 PDP mock data
- [ ] 圖庫縮圖與主圖切換可用
- [ ] 尺寸選擇 + disabled 狀態可用
- [ ] 加入購物車需有尺寸前置檢查
- [ ] 描述/specs/accordion 呈現完成
- [ ] 推薦商品區塊與導頁可用
- [ ] 手機與桌機版面皆可正常操作

### 10.8 與登入流程銜接（下一步）

由於登入流程已完成前端 mock，可直接在 PDP CTA 加上：

- 未登入點「加入購物車」時，導向 `/login?redirect=/products/[slug]`
- 登入回跳後保留 PDP 頁面，讓使用者繼續選尺寸與購買

此段先文件化，實作可在 PDP 開發時一起完成。
