---
description: 显示已学习的直觉规则（项目级和全局级）及其置信度
agent: build
---

# 直觉规则状态命令

显示 continuous-learning-v2 的直觉规则状态：$ARGUMENTS

## 你的任务

运行：

```bash
python3 "${CLAUDE_PLUGIN_ROOT}/skills/continuous-learning-v2/scripts/instinct-cli.py" status
```

如果 `CLAUDE_PLUGIN_ROOT` 不可用，则使用：

```bash
python3 ~/.claude/skills/continuous-learning-v2/scripts/instinct-cli.py status
```

## 行为说明

- 输出包含项目级和全局直觉规则。
- 当 ID 冲突时，项目级直觉规则覆盖全局直觉规则。
- 输出按领域分组，带有置信度条形图。
- 此命令在 v2.1 中不支持额外过滤器。
