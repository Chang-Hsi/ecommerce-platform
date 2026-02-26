# Storefront Checkout Spec (M3 Implemented)

更新日期：2026-02-26

本文件描述目前 `/checkout` 已落地的 M3 規格（UI + 表單驗證 + 互動行為）。

## 0. 已定案限制

1. 僅保留「寄送資訊」流程，不做「結帳取貨」tab。
2. 右側「訂單摘要」為 sticky，左側主流程可滾動。

---

## 1. 目標與範圍

- 目標：完成可操作的結帳流程（寄送資訊 -> 付款 -> 下訂單 -> success）。
- 範圍：M3 前台 mock，不串真實金流。
- 資料來源：cart 來自 mock cart；checkout form 狀態在 client 端管理。

---

## 2. 版面與 IA（已落地）

- Desktop：雙欄
  - 左欄：寄送資訊、運送資訊、付款資訊、下訂單
  - 右欄：訂單摘要（sticky）
- Mobile：單欄
  - 訂單摘要在上
  - 寄送/付款區在下

---

## 3. 表單 UI 與驗證規則（已落地）

## 3.1 寄送資訊 UI

- 欄位：電子郵件、名字、姓氏、地址搜尋、電話號碼。
- `帳單地址同送貨地址` 取消勾選後，直接展開完整帳單欄位：
  - 帳單名字、帳單姓氏、帳單地址、帳單電話。
- 錯誤樣式：
  - 欄位邊框紅色（`border-red-600`）
  - 欄位上方 label 轉紅（`text-red-600`）
  - 下方顯示紅字錯誤訊息（`text-sm text-red-600`）
- 焦點樣式：focus 時為藍色邊框（`focus:border-blue-600` / `focus-within:border-blue-600`）。

## 3.2 寄送資訊驗證規則

- `email`
  - 規則：`^[^\s@]+@[^\s@]+\.[^\s@]+$`
  - 錯誤：`請輸入有效電子郵件`
- `firstName` / `lastName`
  - 必填
  - 字元限制：允許中英文、空白、`'`、`’`、`-`，長度最多 30 字
  - 錯誤：`請輸入名字` / `請輸入姓氏` / `你輸入的字元無效。`
- `addressQuery`
  - 必填
  - 禁止郵政信箱關鍵字：`郵政信箱`、`P.O. Box`、`post office box`
  - 錯誤：`請輸入地址` / `我們無法送貨至郵政信箱`
- `phone`
  - 規則：`^\+?\d[\d\s-]{7,14}$`
  - 錯誤：`請輸入有效電話號碼`
- 帳單欄位（僅在 `billingSameAsShipping=false` 驗證）
  - `billingFirstName` / `billingLastName`：同姓名規則
  - `billingAddress`：同地址規則（含郵政信箱限制）
  - `billingPhone`：同電話格式規則
  - 錯誤：`請輸入帳單名字`、`請輸入帳單姓氏`、`請輸入帳單地址`、`請輸入有效帳單電話號碼`、`你輸入的字元無效。`

## 3.3 付款 UI（M3）

- 促銷碼區：input + `套用`，提示「每筆訂單限用 1 個促銷代碼」。
- 付款方式單選：
  1. 信用卡或金融簽帳卡（預設）
  2. PayPal（僅可選 UI）
  3. Google Pay（僅可選 UI）
- 當付款方式為信用卡時顯示欄位：
  - 信用卡持有人姓名
  - 卡號（含鎖頭 icon）
  - 月份/年份（MM/YY）
  - 安全碼

## 3.4 付款驗證規則

- `cardName`
  - 必填，僅允許英文與空白及 `'`、`’`、`-`，長度 2-40
  - 錯誤：`請輸入持卡人姓名` / `你輸入的字元無效。`
- `cardNumber`
  - 規則：13-19 位數字（會先移除空白）
  - 錯誤：`請輸入有效卡號`
- `cardExpiry`
  - 規則：`MM/YY`
  - 額外檢查：不得早於當前月份
  - 錯誤：`格式為 MM/YY` / `卡片已過期`
- `cardCvc`
  - 規則：3-4 位數字
  - 錯誤：`請輸入有效安全碼`

## 3.5 錯誤觸發時機

- 欄位層級：使用者 `onBlur` 後，該欄位才顯示錯誤。
- 提交層級：按下 `下訂單` 後，全部欄位進入 touched 狀態並顯示所有錯誤。
- 按鈕狀態：只要表單有錯誤或購物車為空，`下訂單` 維持 disabled。

---

## 4. 右欄訂單摘要（已落地）

- 顯示：小計、原價（可刪除線）、運費（M3 固定免費）、總計、節省金額。
- 顯示免運資格提示與進度條。
- 顯示送達日期文案。
- 商品列顯示：縮圖、商品名、數量、尺寸、現價、原價（若有）。

---

## 5. 互動流程（已落地）

1. 使用者輸入寄送資訊與付款資訊。
2. 可輸入促銷碼套用（M3 固定成功碼）。
3. 驗證通過前 `下訂單` 不可按。
4. 驗證通過後按下 `下訂單`，導向 `/checkout/success`。

---

## 6. 響應式規格（已落地）

- `<lg`：單欄，訂單摘要在上，寄送/付款區在下。
- `>=lg`：雙欄，右側摘要 sticky。

---

## 7. 實作檔案對照

- `src/features/checkout/CheckoutPage.tsx`
- `src/features/checkout/CheckoutSuccessPage.tsx`
- `src/components/checkout/CheckoutShippingContactSection.tsx`
- `src/components/checkout/CheckoutShippingInfoSection.tsx`
- `src/components/checkout/CheckoutPaymentSection.tsx`
- `src/components/checkout/CheckoutOrderSummary.tsx`
- `src/hooks/checkout/useCheckoutController.ts`
- `src/lib/checkout/validation.ts`
- `src/lib/checkout/pricing.ts`
- `src/lib/checkout/types.ts`
- `src/content/checkout.ts`

---

## 8. 驗收狀態（M3）

- [x] `/checkout` 雙欄（desktop）/ 單欄（mobile）
- [x] 不出現結帳取貨 tab
- [x] 右欄摘要 sticky
- [x] 寄送資訊驗證
- [x] 付款方式切換與信用卡欄位顯示/隱藏
- [x] 促銷碼 mock 套用成功/失敗
- [x] 下訂單依驗證狀態啟用/停用
- [x] 提交成功導向 `/checkout/success`

---

## 9. 決策定案（2026-02-26）

1. `下訂單` 在 M3 按下後導向 `/checkout/success`。
2. 促銷碼固定成功代碼：`WELCOME10`。
3. PayPal / Google Pay 在 M3 為可選 UI。
4. Mobile 訂單摘要固定展開且在上方。
5. `帳單地址同送貨地址` 取消勾選後直接展開帳單欄位。

---

## 10. M4/M5 遷移方向

1. M4：補齊 order / payment intent / shipping address 資料模型。
2. M5：串接 checkout validate / apply promo / create order API。
3. M7：串接 Stripe test mode + webhook 狀態閉環。
