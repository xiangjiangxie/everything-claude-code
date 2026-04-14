# 工具链审计命令

运行确定性仓库工具链审计并返回优先级评分卡。

## 用法

`/harness-audit [scope] [--format text|json]`

- `scope`（可选）：`repo`（默认）、`hooks`、`skills`、`commands`、`agents`
- `--format`：输出样式（`text` 为默认，`json` 用于自动化）

## 确定性引擎

始终运行：

```bash
node scripts/harness-audit.js <scope> --format <text|json>
```

此脚本是评分和检查的唯一权威来源。不要自行发明额外的维度或临时评分项。

评分标准版本：`2026-03-16`。

该脚本计算 7 个固定类别（每个归一化为 `0-10`）：

1. 工具覆盖率
2. 上下文效率
3. 质量门控
4. 记忆持久化
5. 评估覆盖率
6. 安全防护
7. 成本效率

分数来源于明确的文件/规则检查，对于同一提交可复现。

## 输出约定

返回：

1. `overall_score` / `max_score`（`repo` 满分为 70；范围审计分数较小）
2. 各类别分数和具体发现
3. 失败检查项及精确文件路径
4. 确定性输出中的前 3 项行动建议（`top_actions`）
5. 建议接下来应用的 ECC 技能

## 清单

- 直接使用脚本输出；不要手动重新评分。
- 如果请求 `--format json`，原样返回脚本 JSON。
- 如果请求文本格式，总结失败的检查项和主要行动。
- 包含 `checks[]` 和 `top_actions[]` 中的精确文件路径。

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

$ARGUMENTS：
- `repo|hooks|skills|commands|agents`（可选范围）
- `--format text|json`（可选输出格式）
