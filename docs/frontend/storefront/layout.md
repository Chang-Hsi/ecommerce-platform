# Storefront Layout Plan (M2)

此文件用於規劃前台 `AppLayout`，先完成資訊架構與互動規則，之後再進入 UI 落地。

## 1. 目標

- 參考 Nike 的桌機導覽模式：`Header + Hover Mega Menu + 搜尋 + 收藏/購物袋`。
- 全站顯示語言採用繁體中文。
- Header 同時承擔：
  - 導覽入口（主選單）
  - 分類入口（Mega Menu）
  - 搜尋入口（熱門關鍵字）
- 透過 Header 反推路由規劃與 query 規範，確保後續 API/DB 串接一致。

## 2. Header 結構規劃

### 2.1 區塊

1. Top Utility Bar（右上）
- 協助
- 加入
- 登入

2. Main Header（主列）
- 左側：品牌 Logo
- 中央主選單：
  - 新品和精選
  - 男款
  - 女款
  - 兒童款
  - 特惠商品
  - SNKRS
- 右側：
  - 搜尋輸入框
  - 收藏
  - 購物袋

3. Mega Menu（展開面板）
- 桌機：滑鼠 hover 展開
- 行動：點擊進入抽屜式子選單

### 2.2 Mega Menu 資訊架構（第一版）

每個主選單有自己的欄位群組（與你提供圖片一致）。

- `新品和精選`
  - 欄位示例：新品發售、熱門、經典、依運動項目選購
- `男款` / `女款`
  - 欄位示例：精選、鞋款、服飾、依運動項目選購、配件與裝備
- `兒童款`
  - 欄位示例：精選、鞋款、服飾、依照年齡分類、依運動項目選購、配件與裝備
- `特惠商品`
  - 欄位示例：全站特惠、男款特惠、女款特惠、兒童特惠、依運動項目選購
- `SNKRS`
  - 欄位示例：活動標語 + 導購入口

## 3. 互動規則

### 3.1 Desktop (>=1024)

- `hover` 主選單項目後 `120-180ms` 展開 mega menu。
- 游標離開 header + menu 區域 `150-220ms` 收合。
- 切換主選單時，直接切換內容，不先收合。
- 滑入已開啟項目可維持展開狀態。
- 點擊主選單標題可導向對應 PLP（保留 query 預設）。

### 3.2 Tablet/Mobile (<1024)

- 不採 hover，改為點擊。
- Header 左側加 `menu` icon，開啟全屏 drawer。
- Drawer 內主選單採 accordion：
  - 點主分類展開次層
  - 點次層項目導向對應路由
- 底部固定導覽（Home/Shop/Cart/Pay）持續保留。

### 3.3 搜尋

- 點擊搜尋框進入搜尋模式（桌機可下拉層，手機全屏覆蓋層）。
- 顯示熱門搜尋詞（chip）。
- 提交搜尋導向：`/products?q=關鍵字&page=1`。

## 4. 路由規劃（Header 驅動）

## 4.1 Route map

- `/`：首頁
- `/products`：商品列表頁（PLP，所有分類最終匯流）
- `/products/[slug]`：商品詳情頁（PDP）
- `/cart`：購物車
- `/checkout`：結帳
- `/snkrs`：SNKRS 專區（獨立路由）

## 4.2 Header 入口到路由映射（第一版）

- 新品和精選 -> `/products?group=new-featured&page=1`
- 男款 -> `/products?gender=men&page=1`
- 女款 -> `/products?gender=women&page=1`
- 兒童款 -> `/products?gender=kids&page=1`
- 特惠商品 -> `/products?sale=true&page=1`
- SNKRS -> `/snkrs`

## 5. 篩選 Query 規範

說明：URL 保留英文 key（技術穩定），UI 顯示中文 label。

### 5.1 Query keys

- `group`: 首頁策展群組（如 `new-featured`）
- `gender`: `men | women | kids | unisex`
- `category`: `shoes | tops | bottoms | accessories`
- `sport`: `running | basketball | football | training | yoga | skateboarding`
- `collection`: `jordan | air-force-1 | dunk | pegasus | vomero | snkrs`
- `sale`: `true | false`
- `q`: 搜尋關鍵字
- `sort`: `newest | price_asc | price_desc | popular`
- `page`: 頁碼，從 `1` 開始
- `priceMin`: 最低價
- `priceMax`: 最高價
- `size`: 可多值（`size=8&size=9`）
- `color`: 可多值（`color=black&color=white`）

### 5.2 規範

- 所有 Header 導流連結都需帶 `page=1`。
- 變更任一 filter 時，`page` 重置為 `1`。
- 清除全部篩選時，保留能代表入口情境的最小 query（例如 `gender=men&page=1`）。
- 不在 URL 放中文 key，避免編碼與後端 mapping 成本增加。
- 在 M2 凍結 query key 命名，M3/M4 不再改 key（僅擴充值域）。

### 5.3 範例

- 男款跑鞋新品：
  - `/products?gender=men&sport=running&category=shoes&sort=newest&page=1`
- 女款特惠服飾：
  - `/products?gender=women&sale=true&category=tops&sort=popular&page=1`
- 搜尋 `air force 1`：
  - `/products?q=air%20force%201&sort=newest&page=1`

## 6. 中文化規則

- UI 文案統一繁體中文。
- URL key 維持英文。
- 避免英中混搭命名（例如 UI 顯示 `新品和精選`，但 route/query 用 `group=new-featured`）。

## 7. M2 本階段交付（文件面）

- `layout.md`（本文件）完成後，下一步可拆成：
  - `header-spec.md`：互動與狀態詳規
  - `routes-spec.md`：路由與導流映射
  - `query-spec.md`：query schema 與驗證規則

## 8. 決策定案（已確認）

1. `SNKRS` 採獨立路由：`/snkrs`。
   - Nike 參考：Header 的 SNKRS 入口導向獨立頁面（`/tw/launch`），不是產品列表 query。
2. `兒童款` 先用 `gender=kids`（優先方便製作）。
   - 理由：目前 query 已有 `gender=men|women`，加入 `kids` 最少改動、最一致。
3. 搜尋先全部匯流到 `/products?q=`（不另開 `/search`）。
   - Nike 參考：搜尋熱門詞導向產品列表型頁面（`/tw/w?q=...`，有時帶 `vst`）。
4. Query key 在 M2 凍結，不在 M3/M4 改名。

## 9. Nike 調查紀錄（2026-02-25）

- SNKRS 獨立路徑：
  - `https://www.nike.com/tw/launch`
- 導覽 mega menu 參考頁（可見 Header 分類與 SNKRS 入口）：
  - `https://www.nike.com/tw/w/new-3n82y`
- 兒童主分類路徑：
  - `https://www.nike.com/tw/kids`
- 搜尋導向產品列表（q 參數）：
  - `https://www.nike.com/tw/w?q=%E7%90%83%E5%A0%B4%E9%80%A0%E5%9E%8B&vst=%E7%90%83%E5%A0%B4%E9%80%A0%E5%9E%8B`
