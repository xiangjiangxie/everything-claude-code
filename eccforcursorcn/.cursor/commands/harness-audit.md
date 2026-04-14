# Harness 审计命令

运行确定性仓库 harness 审计并返回优先级评分卡。

## 用法

`/harness-audit [scope] [--format text|json]`

- `scope`（可选）：`repo`（默认）、`hooks`、`skills`、`commands`、`agents`
- `--format`：输出格式（`text` 为默认，`json` 用于自动化）

## 确定性引擎

始终运行：

```bash
node scripts/harness-audit.js <scope> --format <text|json>
```

此脚本是评分和检查的唯一真实来源。不要自行发明额外的维度或临时评分项。

Rubric 版本：`2026-03-16`。

脚本计算 7 个固定类别（每项归一化为 `0-10`）：

1. 工具覆盖率
2. 上下文效率
3. 质量关卡
4. 记忆持久化
5. 评估覆盖率
6. 安全防护
7. 成本效率

评分基于明确的文件/规则检查，对同一提交可复现。

## 输出约定

返回：

1. `overall_score` / `max_score`（`repo` 满分 70；范围审计满分较小）
2. 类别评分和具体发现
3. 失败检查及确切文件路径
4. 确定性输出中的前 3 项行动建议（`top_actions`）
5. 建议接下来应用的 ECC 技能

## 检查清单

- 直接使用脚本输出；不要手动重新评分。
- 如请求 `--format json`，原样返回脚本 JSON。
- 如请求 text，概述失败检查和首要行动建议。
- 包含来自 `checks[]` 和 `top_actions[]` 的确切文件路径。

## 示例结果

```text
Harness Audit (repo): 66/70
- Tool Coverage: 10/10 (10/10 pts)
- Context Efficiency: 9/10 (9/10 pts)
- Quality Gates: 10/10 (10/10 pts)

Top 3 Actions:
1) [Security Guardrails] Add prompt/tool preflight security guards in hooks/hooks.json. (hooks/hooks.json)
2) [Tool Coverage] Sync commands/harness-audit.md and .opencode/commands/harness-audit.md. (.opencode/commands/harness-audit.md)
3) [Eval Coverage] Increase automated test coverage across scripts/hooks/lib. (tests/)
```

## 参数

$ARGUMENTS:
- `repo|hooks|skills|commands|agents`（可选范围）
- `--format text|json`（可选输出格式）
