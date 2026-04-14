# 工具链审计命令

运行确定性的仓库工具链审计并返回优先级评分卡。

## 用法

`/harness-audit [scope] [--format text|json]`

- `scope`（可选）：`repo`（默认）、`hooks`、`skills`、`commands`、`agents`
- `--format`：输出样式（默认 `text`，`json` 用于自动化）

## 确定性引擎

始终运行：

```bash
node scripts/harness-audit.js <scope> --format <text|json>
```

此脚本是评分和检查的唯一标准。不要发明额外的维度或临时分数。

评分规则版本：`2026-03-16`。

脚本计算 7 个固定类别（每个 `0-10` 归一化）：

1. 工具覆盖率
2. 上下文效率
3. 质量门禁
4. 记忆持久性
5. 评估覆盖率
6. 安全护栏
7. 成本效率

分数基于显式的文件/规则检查得出，对于相同的提交是可复现的。

## 输出约定

返回：

1. `overall_score` / `max_score`（`repo` 为 70；范围审计较小）
2. 类别分数和具体发现
3. 失败检查及确切文件路径
4. 来自确定性输出的前 3 项操作（`top_actions`）
5. 建议下一步应用的 ECC 技能

## 检查清单

- 直接使用脚本输出；不要手动重新评分。
- 如果请求 `--format json`，原样返回脚本 JSON。
- 如果请求文本，总结失败的检查和前几项操作。
- 包含来自 `checks[]` 和 `top_actions[]` 的确切文件路径。

## 示例结果

```text
工具链审计（repo）：66/70
- 工具覆盖率：10/10（10/10 分）
- 上下文效率：9/10（9/10 分）
- 质量门禁：10/10（10/10 分）

前 3 项操作：
1) [安全护栏] 在 hooks/hooks.json 中添加提示/工具预检安全守卫。(hooks/hooks.json)
2) [工具覆盖率] 同步 commands/harness-audit.md 和 .opencode/commands/harness-audit.md。(.opencode/commands/harness-audit.md)
3) [评估覆盖率] 增加 scripts/hooks/lib 的自动化测试覆盖率。(tests/)
```

## 参数

$ARGUMENTS:
- `repo|hooks|skills|commands|agents`（可选范围）
- `--format text|json`（可选输出格式）
