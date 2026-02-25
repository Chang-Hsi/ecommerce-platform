# Jira 操作手冊（長期維護）

此文件定義本專案如何與 Jira 對齊，避免只靠聊天記憶。

## 1. 環境變數

請放在 `.env.local`（不要提交到 Git）：

```env
JIRA_BASE_URL=https://watasiwa8531.atlassian.net
JIRA_EMAIL=你的Atlassian帳號Email
JIRA_API_TOKEN=你的Atlassian API Token
JIRA_PROJECT_KEY=EP
```

## 2. 欄位來源

- `JIRA_BASE_URL`
  - 來源：Jira 網址主機（例如 `https://watasiwa8531.atlassian.net`）
- `JIRA_API_TOKEN`
  - 來源：Atlassian API token（id.atlassian.com 建立）
- `JIRA_PROJECT_KEY`
  - 來源：Jira 專案 key（本專案為 `EP`）

## 3. 里程碑對應

- `M0 -> EP-2`
- `M1 -> EP-3`
- `M2 -> EP-4`
- `M3 -> EP-5`
- `M4 -> EP-6`
- `M5 -> EP-7`
- `M6 -> EP-8`
- `M7 -> EP-9`
- `M8 -> EP-10`
- `M9 -> EP-11`

## 4. 驗證連線

```bash
cd /Users/chanshiti/ecommerce-platform
set -a && source .env.local && set +a

curl -sS -u "$JIRA_EMAIL:$JIRA_API_TOKEN" \
  "$JIRA_BASE_URL/rest/api/3/myself"

curl -sS -u "$JIRA_EMAIL:$JIRA_API_TOKEN" \
  "$JIRA_BASE_URL/rest/api/3/project/$JIRA_PROJECT_KEY"
```

## 5. 里程碑完成同步規則（強制）

當你確認某里程碑「完成且測試通過」時，必須做兩件事：

1. 更新 `docs/project/milestones.md` 對應里程碑狀態為 `Done`（含完成日期）
2. 更新 Jira 對應 issue 狀態為 `完成`

## 6. Jira 狀態轉換流程

先查可用 transition id（避免 workflow 變更導致固定 id 失效）：

```bash
set -a && source .env.local && set +a
ISSUE_KEY="EP-5"

curl -sS -u "$JIRA_EMAIL:$JIRA_API_TOKEN" \
  "$JIRA_BASE_URL/rest/api/3/issue/$ISSUE_KEY/transitions"
```

再用查到的 `完成` transition id 更新：

```bash
set -a && source .env.local && set +a
ISSUE_KEY="EP-5"
TRANSITION_ID="41"

curl -sS -u "$JIRA_EMAIL:$JIRA_API_TOKEN" \
  -H "Content-Type: application/json" \
  -X POST "$JIRA_BASE_URL/rest/api/3/issue/$ISSUE_KEY/transitions" \
  -d "{\"transition\":{\"id\":\"$TRANSITION_ID\"}}"
```

建議同步補一則 comment（測試證據、commit、preview URL）。

