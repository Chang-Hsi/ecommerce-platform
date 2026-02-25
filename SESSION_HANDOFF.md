# Session Handoff

更新時間：2026-02-25

## 1. 當前專案狀態

- 專案：`/Users/chanshiti/ecommerce-platform`
- 目前階段：M3（前台 UI 文件與靜態落地）
- 已完成里程碑：M1、M2
- 里程碑看板：`docs/project/milestones.md`
- Jira 對應規則：`docs/project/jira.md`

## 2. 已定案架構規則（前台）

- `src/content/*`：靜態資料與內容 schema
- `src/features/*`：頁面級拼接（保持精簡）
- `src/components/*`：可重用 UI 組件
- `src/hooks/*`：狀態控制與行為 orchestration
- `src/lib/*`：純邏輯工具（query mapping、helper）

## 3. 最近完成重點

- `src/features/content/*` 已搬遷到 `src/content/*`
- `header-menu-data.ts` 已搬到 `src/content/header-menu.ts`
- products 狀態與 query 映射已分層：
  - `src/hooks/products/useProductsController.ts`
  - `src/lib/products/query-state.ts`
- `README.md` 與 `docs/frontend/storefront/product.md` 已更新為目前落地規範

## 4. 下一步建議（可直接接續）

1. products 其餘 checkbox 篩選同步到 URL query（目前 colors/category/sort 已接）
2. M3 其餘頁面（PDP/Cart/Checkout）依同模式完成文件與靜態落地
3. 通知里程碑完成後，同步更新：
   - `docs/project/milestones.md`
   - Jira 對應 issue 狀態

## 5. 開新對話時的標準指令

請先讀以下文件再開始：

- `README.md`
- `docs/project/milestones.md`
- `docs/project/jira.md`
- `SESSION_HANDOFF.md`

並以 `/Users/chanshiti/ecommerce-platform` 作為工作目錄。

