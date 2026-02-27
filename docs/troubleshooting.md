# Troubleshooting（開發排錯）

更新日期：2026-02-27

## 1. 基礎設施層變更後 API 出現舊欄位錯誤

常見症狀：
- API 500
- 錯誤訊息提到「資料庫欄位不存在」，但你已經做過 migration
- 例如：`The column UserAddress.recipientName does not exist`

根因：
- `next dev` 進程仍使用舊的 Prisma client / Turbopack 快取，沒有吃到最新 schema 與 migration 結果。

適用情境（任一發生都建議重啟）：
- `prisma/schema.prisma` 改動
- 執行 `prisma migrate` / `prisma generate` 後
- `.env` / `.env.local` 改動
- 套件安裝或移除
- Next/TS/build 設定改動

標準處理流程：

```bash
pkill -f "next-server"
rm -rf .next
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

補充：
- 一般 UI 或 Route Handler 純程式碼修改，通常 HMR 足夠，不需要每次重啟。
- 只有牽涉「基礎設施層變更」才需要按上述流程重啟。
