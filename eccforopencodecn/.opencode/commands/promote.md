---
description: 将项目直觉规则提升到全局范围
agent: build
---

# 提升命令

在 continuous-learning-v2 中提升直觉规则：$ARGUMENTS

## 你的任务

运行：

```bash
python3 "${CLAUDE_PLUGIN_ROOT}/skills/continuous-learning-v2/scripts/instinct-cli.py" promote $ARGUMENTS
```

如果 `CLAUDE_PLUGIN_ROOT` 不可用，则使用：

```bash
python3 ~/.claude/skills/continuous-learning-v2/scripts/instinct-cli.py promote $ARGUMENTS
```
