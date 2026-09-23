# 《量化人生》开发文档

## 1. 技术栈（MVP）

| 层级 | 选型 |
|------|------|
| 框架 | Expo SDK 56、React Native 0.85、React 19 |
| 语言 | TypeScript（strict） |
| 路由 | expo-router（文件式路由） |
| 本地存储 | **iOS/Android**：expo-sqlite；**Web**：AsyncStorage JSON（`db.web.ts`）；引导标记 AsyncStorage |
| 校验 | zod |
| 决策引擎 | 纯 TypeScript 函数（`src/engine/`） |

**刻意未引入（MVP）**：后端、LLM SDK、Redux、测试框架（可后续加 Vitest）。

---

## 2. 仓库结构

```
app/                    # expo-router 页面
  _layout.tsx           # 根布局、DB 初始化、主题
  index.tsx             # 启动分流 onboarding / tabs
  onboarding/           # 引导流
  (tabs)/               # 主 Tab：今日、轨迹、决策、设置
  decision/job-offer/   # Offer 向导与结果
src/
  components/           # UI 组件
  constants/            # theme、文案
  context/              # AppDataProvider
  engine/               # 决策计算
  lib/                  # db、types、utils
docs/
  product/PRD.md
  design/UI-SPEC.md
```

---

## 3. 本地开发

```bash
npm install
npx tsc --noEmit
CI=1 npx expo start --web --port 8081
```

- 浏览器标签标题应为 **量化人生**。
- Cloud VM 中建议 Metro 跑在 tmux 会话内（见根目录 `AGENTS.md`）。

### 原生

```bash
npm run android
npm run ios   # 需 macOS
```

---

## 4. 数据模型（SQLite）

### `profile`（单行）

| 列 | 说明 |
|----|------|
| id | 固定 `default` |
| north_star | 主线文案 |
| value_risk | 1–10 |
| value_growth | 1–10 |
| value_stability | 1–10 |
| anchor_label | 锚点 A 标签 |
| created_at | ISO |

### `life_stages`

| 列 | 说明 |
|----|------|
| id | UUID |
| title | 阶段名 |
| location | 可选 |
| narrative | 叙述 |
| started_at | ISO date |
| ended_at | nullable |

### `daily_checkins`

| 列 | 说明 |
|----|------|
| id | UUID |
| date | YYYY-MM-DD UNIQUE |
| energy, alignment, mood | 0–10 |

### `decisions`

| 列 | 说明 |
|----|------|
| id | UUID |
| type | `job_offer` |
| payload_json | 输入快照 |
| result_json | 引擎输出 |
| review_at | ISO |
| reviewed | 0/1 |
| created_at | ISO |

初始化见 `src/lib/db.ts`。

---

## 5. 决策引擎

- 入口：`src/engine/job-offer.ts` → `evaluateJobOffer(input)`
- 输入类型：`JobOfferInput`（zod schema 在 `src/lib/schemas/job-offer.ts`）
- 输出：`JobOfferResult`（paths[], assumptions[], reviewAt）
- **单元测试建议（后续）**：对 `evaluateJobOffer` 在 Node 下测边界（降薪 Offer、极长通勤）。

---

## 6. 路由与导航

| 路径 | 说明 |
|------|------|
| `/` | 读 AsyncStorage `onboardingComplete` → replace |
| `/onboarding/*` | 三步引导 |
| `/(tabs)/` | 今日 |
| `/(tabs)/timeline` | 轨迹 |
| `/(tabs)/decisions` | 决策入口与历史 |
| `/(tabs)/settings` | 设置与导出 |
| `/decision/job-offer/` | 向导 |
| `/decision/job-offer/result` | 结果（params 或读临时存储） |

---

## 7. 导出备份

`settings` 页调用 `exportAllData()`：聚合 profile、stages、checkins、decisions 为 JSON，通过 `expo-sharing` / Web download 触发。

---

## 8. 后续：LLM 集成（非 MVP）

1. 新增 `POST /api/decision/summarize`（Edge Function）。
2. 请求体仅含 **已脱敏的结构化结果**，不含叙述原文（或用户 opt-in）。
3. 客户端展示「AI 总结」区块，默认折叠；失败时不影响规则引擎结果。

---

## 9. 发布

- EAS：`eas.json` 保留；改 `app.json` 中 `slug/name/bundleId` 后再做生产构建。
- MVP 内测：`eas build --profile preview`

---

## 10. 与「云衣柜」历史

本分支将应用替换为《量化人生》MVP；原 `App.tsx` 衣柜演示由 expo-router 取代。相机类 plugin 在 MVP 中已移除。
