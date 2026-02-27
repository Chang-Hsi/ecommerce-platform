# Storefront Help Spec (M3 Planning)

更新日期：2026-02-26

本文件根據參考圖，定義 `/help` 協助中心在 M3 的頁面企劃，包含：
- 協助首頁（搜尋 + 快速協助 + 聯絡我們）
- 協助內頁（文章內容 + FAQ 摺疊）
- 搜尋結果頁（含無結果狀態）

## 0. 已知前提

1. Header 選單中的 `協助` 會導向此頁。
2. 本階段先做前台與 mock 資料，不串接客服後台系統。

---

## 1. 目標與範圍

- 目標：讓使用者在 `/help` 快速找到常見問題答案，並可在找不到答案時透過聯絡方式繼續處理。
- 範圍：
  - `/help` 首頁
  - `/help/topics/[slug]` 協助文章內頁
  - `/help?q=keyword` 搜尋結果模式
  - `/help/contact` 聯絡說明頁
- 階段：M3 先以靜態/本地 mock 內容落地，M4/M5 再考慮 CMS 或 API 化。

---

## 2. 頁面 IA（依設計圖）

## 2.1 協助首頁

1. 頁首：標題 `取得協助`
2. 搜尋框：`我們能提供你什麼協助？`
3. 快速協助區塊
   - 區塊標題 + 描述
   - 六個分類群組（每組 3 條熱門問題）
4. 聯絡我們區塊
   - 兩個聯絡卡片（文字客服 / 電話）

## 2.2 協助內頁（文章詳情）

1. 文章標題（例：`Nike 的退貨須知說明`）
2. 文章內容段落（政策說明）
3. FAQ 摺疊列表（Accordion）

## 2.3 搜尋結果頁

1. 保留同一個頁首 + 搜尋框
2. 顯示關鍵字文案：`以下關鍵字的搜尋結果：「{q}」`
3. 若有結果：顯示對應文章/問題列表
4. 若無結果：顯示空狀態
   - 標題：`找不到結果`
   - 次要行動：`聯絡我們`

---

## 3. 協助首頁規格

## 3.1 頂部搜尋

- 置中標題 `取得協助`
- 搜尋框包含：
  - 浮動標籤（樣式比照 checkout 表單）
  - 使用者開始輸入後顯示浮動標籤
  - placeholder：`我們能提供你什麼協助？`
  - 右側搜尋 icon
- 不需要表單驗證（不顯示錯誤訊息/錯誤樣式）
- 提交方式：
  - Enter
  - 點搜尋 icon
- 行為：導向 `/help?q=keyword`（同頁模式）

## 3.2 快速協助（分類導覽）

分類（依圖）：
1. 退貨
2. 出貨與寄送
3. 訂單與付款
4. 購物
5. Nike 會員計畫與應用程式
6. 公司資訊

每個分類模組包含：
- 分類標題
- 三條熱門問題（文字連結）

路由：
- 熱門問題 -> `/help/topics/[topicSlug]#[faqId]` 或對應文章頁

## 3.3 聯絡我們

區塊標題：`聯絡我們`

卡片 A（線上對談）：
- 類型：產品與訂單
- 通路：線上對談時段
- 時間：上午 9:00 至下午 6:00
- 星期：週一至週五

卡片 B（電話）：
- 類型：產品與訂單
- 電話：`0800-886-453`
- 時間：上午 9:00 至晚上 6:00
- 星期：週一至週五

---

## 4. 協助內頁規格（文章）

## 4.1 上半部內容

- 文章標題（H1）
- 內文段落（支援重點文字、超連結）
- 關鍵提醒區（例如：退貨免運費）

## 4.2 FAQ Accordion

- 區塊標題：`常見問題`
- 每列一題，右側下拉箭頭
- 點擊後展開答案，再點擊可收合
- 動畫使用 `global.css`：`motion-collapse` / `motion-collapse-open` / `motion-collapse-closed`
- M3 預設單開（同時間只展開一題）

FAQ 範例（依圖文）：
- 如何將 Nike 訂單退貨？
- 我可以退換 Nike 訂單嗎？
- 我可以在 7 天後退貨嗎？
- 如何退回有瑕疵或缺陷的產品？

---

## 5. 搜尋結果規格

## 5.1 有結果

- 顯示關鍵字標題
- 結果列表可混合：
  - 問題項（FAQ）
  - 協助文章（Topic article）
- 點擊後進對應內頁

## 5.2 無結果

- 顯示 `找不到結果`
- 顯示 `聯絡我們` 入口（開啟 `/help/contact` 獨立聯絡說明頁）
- 搜尋框保留使用者輸入字串

## 5.3 搜尋規則（M3）

- 比對欄位：
  - 分類標題、分類關鍵字
  - 問題標題、問題答案、問題關鍵字
  - 文章標題、文章摘要、文章關鍵字
- 比對方式：大小寫不敏感、`trim` 後搜尋
- 排序：依命中分數，再依 `sortOrder`
- 空字串：回到 `/help` 首頁內容

---

## 6. 響應式規格（Mobile-first）

- `<lg`
  - 搜尋框滿寬
  - 快速協助改單欄堆疊
  - 聯絡卡片改單欄
  - FAQ 觸控區加大
- `>=lg`
  - 快速協助為 3 欄 x 2 列
  - 聯絡區兩欄
  - 內頁文案維持較寬留白版心

---

## 7. M3 資料模型建議（可直接遷移後端）

`HelpTopic`：
- `id`（穩定主鍵）
- `slug`
- `title`
- `description`
- `featuredQuestionIds`
- `keywords`
- `sortOrder`

`HelpArticle`：
- `id`（穩定主鍵）
- `slug`
- `title`
- `summary`
- `introParagraphs`
- `highlightParagraphs`
- `faqIds`
- `keywords`
- `sortOrder`
- `updatedAt`

`HelpFaqItem`：
- `id`
- `question`
- `answer`
- `topicSlug`
- `keywords`
- `sortOrder`

另外提供：
- `helpDatasetMeta`：版本/語系/更新時間
- `helpStaticDataset`：可直接作為後端 seed payload 的完整資料集

---

## 8. 分層與檔案建議（對齊現有架構）

- `src/content/help.ts`
  - 協助首頁分類、文章、faq、聯絡資訊文案
  - `helpDatasetMeta`、`helpStaticDataset`
- `src/features/help/HelpPage.tsx`
  - `/help` 首頁 + 搜尋結果模式（由 query 控制）
- `src/features/help/HelpTopicPage.tsx`
  - 協助內頁內容
- `src/components/help/*`
  - `HelpSearchBar.tsx`
  - `HelpQuickLinksGrid.tsx`
  - `HelpContactSection.tsx`
  - `HelpFaqAccordion.tsx`
  - `HelpSearchResults.tsx`
- `src/lib/help/*`
  - `search.ts`（純函式搜尋邏輯）
  - `types.ts`

---

## 9. 驗收標準（M3）

- [ ] Header `協助` 可正確導向 `/help`
- [ ] `/help` 可顯示搜尋框、快速協助、聯絡我們
- [ ] 快速協助問題連結可進入對應內容
- [ ] `/help?q=keyword` 可顯示搜尋結果
- [ ] 搜尋無結果狀態與 `聯絡我們` 引導可用
- [ ] 文章內頁可顯示政策內容 + FAQ Accordion
- [ ] FAQ 展開收合使用 `global.css` 動畫 class
- [ ] 手機/桌機版面不破版

---

## 10. 決策定案（2026-02-26）

1. 協助內頁路由型態：
   - A. `/help/topics/[slug]`
2. `聯絡我們` 在無結果頁點擊行為：
   - B. 開啟獨立聯絡說明頁（`/help/contact`）
3. FAQ 展開策略：
   - A. 單開（一次一題）
4. 快速協助 `查看全部`：
   - 移除（首頁僅保留熱門問題連結）

---

## 11. M4/M5 遷移方向

1. M4：將 `helpStaticDataset` 搬入 API/DB seed，前端改為 fetch。
2. M5：接搜尋 API（支援分詞與排序），替換 M3 前端字串比對。
3. M5：接客服系統（線上對談入口與服務時段後台配置）。
