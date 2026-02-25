# Storefront Home Plan (M3)

此文件定義 M3 階段首頁 UI 企劃，先以靜態資料落地，後續 M4 再接 API。

## 1. 目標與範圍

- 目標：參考 Nike 首頁節奏，建立高視覺、強導購的首頁。
- 範圍：僅前台 `/` 首頁，不含後台。
- 階段：M3 使用靜態資料（`src/features/home/data/*`），M4 才替換 API。

---

## 2. 首頁區塊 IA（由上到下）

1. Hero（100vh）
2. 精選（2x2 四宮格）
3. 依運動項目選購（X 軸滑動）
4. 矚目焦點（標題 + 2 列商品 icon grid）

---

## 3. 區塊企劃細節

## 3.1 Hero（100vh，主視覺）

### 視覺結構

- 背景：使用影片（檔名：`homeBanner.mov`），無法載入時 fallback 到 poster 圖片。
- 影片路徑：`public/media/home/homeBanner.mov`
- Poster 路徑：`public/media/home/homeBanner-poster.jpg`
- 前景文案：置中偏下（約畫面 70-78% 高度）。
- 元素順序：
  1. 主標（如 `AIR MAX 95`）
  2. 副標（簡短敘述）
  3. CTA 兩顆（主次按鈕）

### 行為規範

- Desktop：高度固定 `100vh`。
- Mobile：高度固定 `100dvh`（避免手機瀏覽器動態工具列造成高度跳動）。
- 影片屬性：`autoplay muted loop playsInline`。
- 文字區塊需有對比保護（暗色漸層遮罩）。
- 影片格式說明：`.mov` 可以用，但跨瀏覽器穩定性通常不如 `mp4 (H.264)`；M3 先用 `homeBanner.mov`，M3.1 可再補一份 `homeBanner.mp4` 做兼容。

### CTA 導流

- CTA1：`通知我` -> `/join`
- CTA2：`選購 Air Max` -> `/products?collection=air-max&page=1`

---

## 3.2 精選（2x2 四宮格）

### 視覺結構

- 容器滿寬（跟版心一致），分成 2x2 四塊。
- 每塊為一張圖片卡，左下角顯示：
  - title
  - 按鈕（`選購`）

### 行為規範

- Desktop：2 欄 2 列，gap 固定（12-16px）。
- Tablet：維持 2 欄，但字級下降。
- Mobile：改 1 欄直向堆疊（4 張卡）。
- hover：圖片微放大（`scale 1.03`）+ 底部資訊淡入。

### 導流

- 每張卡導向不同 query（例如 `sport`, `category`, `gender`）。

---

## 3.3 依運動項目選購（橫向捲動卡片）

### 視覺結構

- 區塊標題在左上。
- 右上保留左右箭頭控制。
- 主內容為橫向卡片列（每張大圖 + 下方運動名稱）。

### 行為規範

- Desktop：一次顯示 3 張。
- Tablet：一次顯示 2 張。
- Mobile：一次顯示 1.15 張（讓使用者看到下一張邊緣，暗示可滑動）。
- 支援拖曳/觸控滑動。
- 按鈕控制為「每次捲動 1 張」。

### 導流

- `跑步` -> `/products?sport=running&page=1`
- `足球` -> `/products?sport=football&page=1`
- `籃球` -> `/products?sport=basketball&page=1`

---

## 3.4 矚目焦點（大標 + icon grid）

### 視覺結構

- 上半部：
  - 大標（超大字）
  - 一行副標
- 下半部：
  - 2 列 x N 欄商品 icon（例如 8 x 2）
  - 每個 item：小圖 + 名稱

### 行為規範

- Desktop：每列 8 欄。
- Tablet：每列 4-6 欄。
- Mobile：改為水平滑動 chip 卡列（避免過密）。
- item hover：上浮 2px + 圖片輕微放大。

### 導流

- 點擊 item 導向對應 collection/category。

---

## 4. 元件切分（先規劃，M3 實作）

建議放在 `src/components/home/`：

- `HomeHero.tsx`
- `HomeFeaturedGrid.tsx`
- `HomeSportCarousel.tsx`
- `HomeSpotlightGrid.tsx`

頁面組裝：

- `src/features/home/HomePage.tsx` 只負責 section 排列與資料注入。

資料檔（靜態）：

- `src/features/content/home.ts`
- 所有首頁靜態資料集中於單一檔案（hero/featured/sports/spotlight）

---

## 5. 動畫與互動（沿用共用動畫 class）

- Hero 文案：`zoom-in-title + fade-up-in`
- 四宮格卡片：進場 stagger `fade-up-in`
- 橫向卡片：切換時容器 `slide-left-in / slide-right-in`
- 矚目焦點：grid item `fade-up-in`（延遲遞增）

備註：需尊重 `prefers-reduced-motion`（目前共用 CSS 已有）。

---

## 6. RWD 斷點策略

- Mobile: `< 640`
- Tablet: `640 - 1023`
- Desktop: `>= 1024`

原則：Mobile-first，先保證手機流暢與可讀，再擴展桌機版。

---

## 7. 可用性與效能要求（M3 基準）

- Hero 影片提供 poster fallback。
- 影片建議同時提供 `mov + mp4` 來源，降低播放失敗機率。
- 首屏圖片使用壓縮圖，避免首頁過重。
- 所有圖片都有 `alt`。
- 按鈕有可見 focus 樣式。
- 橫向滑動區可鍵盤操作（左右鍵與按鈕）。

---

## 8. 驗收草案（M3 - Home）

- 4 個區塊都可見且順序正確。
- 手機、平板、桌機版面不破版。
- Hero 有主副標與兩顆 CTA。
- 精選區完成 2x2（手機改直列）。
- 運動區支援水平滑動與箭頭切換。
- 矚目焦點區可點擊導流。
- 無 API 依賴（全部由靜態資料驅動）。

---

## 9. 決策定案（2026-02-25）

1. Hero 使用影片（檔名：`homeBanner.mov`）。
2. Hero 高度固定 `100vh`（手機用 `100dvh`）。
3. 精選 4 格在 mobile 採「直列 4 張」。
4. 運動項目卡片先做 3 張（跑步/足球/籃球）。
5. 矚目焦點先做 16 個 item（8x2）。
6. 首頁語氣定調為「運動潮流」。
