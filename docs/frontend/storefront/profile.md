# Storefront Profile Spec (M3 Planning)

更新日期：2026-02-26

本文件根據參考圖與既有企劃文字，定義前台「設定 / 個人資料中心」在 M3 的頁面規格。

## 0. 已知前提（本次定案）

1. Header 下拉選單中的 `帳號`、`個人檔案`、`體驗` 移除。
2. Header 下拉選單中的 `訂單` 點擊後改導向 `/cart`。
3. 設定頁文案字級上限為 `text-lg`（不可超過 `text-lg`）。
4. M3 不做：`付款方式`、`已連結的帳號`。

---

## 1. 目標與範圍

- 目標：完成可操作的會員設定中心，涵蓋帳號資料、地址、偏好、隱私、能見度。
- 範圍（M3）：
  - 帳號詳細資訊
  - 寄送地址
  - 購物偏好
  - 個人檔案能見度
  - 隱私權
- 非範圍（M3 排除）：
  - 付款方式
  - 已連結的帳號
  - 第三方帳號實際綁定/解綁 API

---

## 2. IA 與導覽結構

## 2.1 頁面骨架

- 頁面主標題：`設定`
- 版面：左側導覽 + 右側內容
  - 左側：設定項目導覽（icon + label）
  - 右側：目前選取項目的表單或資訊區

## 2.2 左側導覽（M3）

顯示項目（依順序）：
1. 帳號詳細資訊
2. 寄送地址
3. 購物偏好
4. 個人檔案能見度
5. 隱私權

不顯示項目（M3）：
- 付款方式
- 已連結的帳號

## 2.3 導覽模式

- Desktop：左側固定欄位，右側內容切換。
- Mobile：導覽改為頂部可橫向捲動 tab（或下拉選單二選一，建議 tab）。

---

## 3. 分頁規格（依圖片）

## 3.1 帳號詳細資訊

欄位與區塊：
1. 電子郵件（必填）
2. 密碼（遮罩顯示）+ `編輯`
3. 出生日期（date input / date picker）
4. 地點
   - 國家/地區（select）
   - 鄉鎮市區（text）
   - 縣市（select）
   - 郵遞區號（text）
5. `刪除帳號` 區塊 + 右側 `刪除` 按鈕
6. 右下角 `儲存` 按鈕（預設 disabled，欄位有變更且通過驗證才啟用）

互動：
- 密碼 `編輯`：開啟更新密碼彈窗（舊密碼/新密碼/確認新密碼）。
- 刪除帳號：二次確認（modal）後才執行。

驗證建議（M3 前端）：
- email：基本 email regex。
- birthday：不得晚於今天。
- country/city/district/postalCode：有輸入地址資訊時需完整。

## 3.2 寄送地址

空狀態（依圖）：
- 標題：`已儲存的寄送地址`
- 文案：尚未儲存任何寄送地址的提示
- 右側主按鈕：`新增地址`

互動：
- 點 `新增地址` 開啟地址表單（modal）。
- 地址欄位可與 checkout 的寄送欄位重用。

資料狀態：
- 空狀態
- 有資料狀態（地址卡列表 + 設為預設 + 編輯 + 刪除）

## 3.3 購物偏好

欄位與群組：
1. 鞋款尺寸（select）
2. 購物偏好設定（radio）
   - 女款
   - 男款
3. 其他偏好（checkbox）
   - 女童款
   - 男童款
   - 女款
   - 男款
4. 測量單位（radio）
   - 公制
   - 英制
5. 右下角 `儲存` 按鈕

互動：
- 單選群組一次僅可選一個。
- checkbox 可多選。
- 儲存按鈕同樣採 dirty + valid 啟用策略。

## 3.4 隱私權

內容結構：
1. 介紹文案（隱私權使用說明）
2. 外部連結：`Nike 隱私權政策`
3. 權限開關（checkbox）
   - 根據使用資料提供的個人化廣告
   - 根據個人檔案提供的個人化廣告
   - 使用健身資料

互動：
- 勾選切換更新本地 state。
- M3 與其他頁一致採 `儲存` 按鈕（非即時儲存）。

## 3.5 個人檔案能見度

內容結構：
1. 個人頭像預覽 + 名稱 + `編輯`
2. 產品評價能見度（radio）
   - 私人
   - 社群
   - 公開
3. 位置分享（radio）
   - 僅與朋友分享我的位置資訊
   - 不要分享我的位置資訊
4. 右下角 `儲存` 按鈕

互動：
- 頭像 `編輯` 開啟上傳/裁切流程（M3 可先 mock 預覽）。
- 能見度與位置分享變更後需手動 `儲存`。

---

## 4. 通用表單與 UI 規則

1. 字級限制：只使用 Tailwind 預設尺寸，且最大 `text-lg`。
2. 表單樣式：延續 checkout 規格（邊框、聚焦、錯誤文案樣式一致）。
3. Label：輸入欄位使用浮動標籤樣式。
4. `儲存` 按鈕狀態：
   - disabled：灰底、不可點
   - enabled：深色底、可點
5. 版面間距：依圖片維持大面積留白與分隔線。
6. 動畫：M3 不強制新增動畫；如需共用動畫，統一放在 `global.css`。

---

## 5. 路由與狀態（已定案）

路由：
- 採 `分段 path`：`/profile/account`、`/profile/addresses`、`/profile/preferences`、`/profile/visibility`、`/profile/privacy`

狀態管理：
- M3：client state + local mock（登入後讀取一筆使用者資料）
- M4：改為 profile API（GET/PUT）與 addresses API（CRUD）

---

## 6. 資料模型建議（可直接搬後端）

`ProfileAccount`
- `userId`
- `email`
- `birthday`
- `country`
- `district`
- `city`
- `postalCode`
- `updatedAt`

`ProfileAddress`
- `id`
- `userId`
- `recipientName`
- `phone`
- `country`
- `city`
- `district`
- `addressLine1`
- `postalCode`
- `isDefault`
- `createdAt`
- `updatedAt`

`ProfilePreferences`
- `userId`
- `shoeSize`
- `primaryPreference`
- `otherPreferences[]`
- `measurementUnit`
- `updatedAt`

`ProfileVisibility`
- `userId`
- `displayName`
- `avatarUrl`
- `reviewVisibility` (`private|community|public`)
- `locationSharing` (`friends|none`)
- `updatedAt`

`ProfilePrivacy`
- `userId`
- `adsByUsageData`
- `adsByProfileData`
- `useFitnessData`
- `updatedAt`

---

## 7. 分層與檔案建議（對齊現有架構）

- `src/app/(storefront)/profile/layout.tsx`
- `src/app/(storefront)/profile/page.tsx`
- `src/app/(storefront)/profile/account/page.tsx`
- `src/app/(storefront)/profile/addresses/page.tsx`
- `src/app/(storefront)/profile/preferences/page.tsx`
- `src/app/(storefront)/profile/visibility/page.tsx`
- `src/app/(storefront)/profile/privacy/page.tsx`
- `src/features/profile/ProfileLayout.tsx`
- `src/features/profile/ProfileAccountSection.tsx`
- `src/features/profile/ProfileAddressesSection.tsx`
- `src/features/profile/ProfilePreferencesSection.tsx`
- `src/features/profile/ProfileVisibilitySection.tsx`
- `src/features/profile/ProfilePrivacySection.tsx`
- `src/components/profile/ProfileSidebar.tsx`
- `src/components/profile/ProfileGuard.tsx`
- `src/components/profile/ProfileFormControls.tsx`
- `src/hooks/profile/useProfileState.ts`
- `src/lib/profile/types.ts`
- `src/lib/profile/mock-profile.ts`
- `src/content/profile.ts`

---

## 8. 驗收標準（M3）

- [ ] Header 下拉選單已移除 `帳號`、`個人檔案`、`體驗`
- [ ] Header 下拉 `訂單` 導向 `/cart`
- [ ] 設定頁左側導覽與右側內容切換正常
- [ ] 可完成帳號詳細資訊編輯與儲存
- [ ] 寄送地址頁可顯示空狀態並可點 `新增地址`
- [ ] 購物偏好可編輯並儲存
- [ ] 個人檔案能見度可編輯並儲存
- [ ] 隱私權選項可編輯並儲存
- [ ] 全頁文案字級無超過 `text-lg`

---

## 9. 決策定案（2026-02-26）

1. 路由採 `分段 path`（B）。
2. 隱私權頁與其他頁一致按 `儲存`。
3. 寄送地址 `新增地址` 使用 modal。
4. 通訊偏好設定自 M3 移除。



規劃跨境網站或全球化（I18N）系統的地址功能時，「多樣性」確實是最令人頭痛的問題。有些國家先寫郵遞區號，有些國家甚至沒有郵遞區號；有些是從大範圍寫到小範圍（如台灣），有些則是從小單位開始（如美國）。

要處理這種複雜度，業界通常採用以下幾種策略：

---

## 10. 帳號詳細資訊的地點（v1）

## 1. 資料結構設計：彈性是核心

不要試圖為每個國家建立特定的資料表欄位（如 `taiwan_district`, `us_state`）。相反，應使用**通用標籤**來對應不同的行政層級。

| 欄位名稱 (Field) | 說明 |
| --- | --- |
| `country_code` | 使用 ISO 3166-1 alpha-2 標準（如 TW, US, JP）。 |
| `administrative_area` | 第一級行政區（如：省、州、直轄市）。 |
| `locality` | 第二級行政區（如：城市、縣）。 |
| `dependent_locality` | 第三級行政區（如：區、鄉、里）。 |
| `postal_code` | 郵遞區號（格式驗證需隨國家切換）。 |
| `address_line1` | 主要街道、門牌。 |
| `address_line2` | 樓層、公寓編號等補充資訊。 |

---

## 2. 表單介面（Frontend）的處理方式

前端表單不應該是死板的。最常見的做法是**「國家觸發變動」**：

* **動態標籤變換：** 當使用者選擇「美國」，原本的「城市」欄位標籤可能變成「City」，「行政區」變成「State」；選擇「台灣」則顯示「城市」與「鄉鎮市區」。
* **欄位排序調整：** 根據國家調整顯示順序。
* **西式格式：** [姓名] -> [街道] -> [城市] -> [州] -> [郵編]
* **中日韓格式：** [郵編] -> [省/市] -> [區] -> [街道] -> [姓名]


* **自動完成（Autocomplete）：** 整合 **Google Places API** 或 **Mapbox**。使用者輸入關鍵字，系統直接回傳結構化地址，這能大幅減少輸入錯誤。

---

## 3. 資料來源與驗證工具

開發者通常不會從零開始寫全世界的地址邏輯，而是依賴成熟的解決方案：

* **Google `libaddressinput`：** 這是 Google 用於 Chrome 和 Android 的開源庫，包含了全球絕大多數國家的地址格式需求。
* **CLDR (Unicode Common Locale Data Repository)：** 提供了豐富的區域格式化數據。
* **專業 API 服務：**
* **Loqate (GBG)：** 全球地址校對與格式化的龍頭。
* **Smarty (SmartyStreets)：** 專精於美國與國際地址驗證。



---

## 4. 儲存與顯示的建議

* **儲存：** 建議在資料庫中儲存「結構化數據」（各欄位分開）以及一個「格式化後的字串」（已根據該國格式串接好），方便不同情境調用。
* **顯示：** 顯示地址時，利用該國家的 **Template** 進行渲染。例如：
* TW Template: `{{postal_code}} {{administrative_area}}{{locality}}{{address_line1}}...`
* US Template: `{{address_line1}}, {{locality}}, {{administrative_area}} {{postal_code}}`



---

### 💡 我的建議

如果你正在從零開始，最簡單且最保險的方法是採用 **Google Places API** 作為輸入前端，並參考 **ISO 3166** 標準來設計你的國家選單。

