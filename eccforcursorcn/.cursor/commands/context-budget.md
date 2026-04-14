---
description: 分析智能体、技能、MCP 服务器和规则的上下文窗口使用情况，发现优化机会。帮助减少 token 开销并避免性能警告。
---

# 上下文预算优化器

分析 Claude Code 配置的上下文窗口消耗，并生成可操作的建议以减少 token 开销。

## 用法

```
/context-budget [--verbose]
```

- 默认：摘要及首要建议
- `--verbose`：按组件的完整分解

$ARGUMENTS

## 操作流程

运行 **context-budget** 技能（`skills/context-budget/SKILL.md`），使用以下输入：

1. 如 `$ARGUMENTS` 中包含 `--verbose` 标志则传入
2. 假定 200K 上下文窗口（Claude Sonnet 默认），除非用户另行指定
3. 按技能的四个阶段执行：清点 → 分类 → 检测问题 → 报告
4. 将格式化的上下文预算报告输出给用户

该技能处理所有扫描逻辑、token 估算、问题检测和报告格式化。
