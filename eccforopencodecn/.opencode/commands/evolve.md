---
description: 分析直觉规则并建议或生成演化结构
agent: build
---

# 演化命令

分析并演化 continuous-learning-v2 中的直觉规则：$ARGUMENTS

## 你的任务

运行：

```bash
python3 "${CLAUDE_PLUGIN_ROOT}/skills/continuous-learning-v2/scripts/instinct-cli.py" evolve $ARGUMENTS
```

如果 `CLAUDE_PLUGIN_ROOT` 不可用，则使用：

```bash
python3 ~/.claude/skills/continuous-learning-v2/scripts/instinct-cli.py evolve $ARGUMENTS
```

## 支持的参数（v2.1）

- 无参数：仅分析
- `--generate`：同时在 `evolved/{skills,commands,agents}` 下生成文件

## 行为说明

- 使用项目级和全局直觉规则进行分析。
- 从触发条件和领域聚类中显示技能/命令/代理候选项。
- 显示项目级到全局级的提升候选项。
- 使用 `--generate` 时，输出路径为：
  - 项目上下文：`~/.claude/homunculus/projects/<project-id>/evolved/`
  - 全局兜底：`~/.claude/homunculus/evolved/`
