---
name: prune
description: 删除超过 30 天且从未被提升的待处理直觉规则
command: true
---

# 清理待处理直觉规则

移除已过期的待处理直觉规则 — 这些规则是自动生成但从未被审查或提升的。

## 实现方式

使用插件根路径运行直觉规则 CLI：

```bash
python3 "${CLAUDE_PLUGIN_ROOT}/skills/continuous-learning-v2/scripts/instinct-cli.py" prune
```

或如果 `CLAUDE_PLUGIN_ROOT` 未设置（手动安装）：

```bash
python3 ~/.claude/skills/continuous-learning-v2/scripts/instinct-cli.py prune
```

## 用法

```
/prune                    # 删除超过 30 天的直觉规则
/prune --max-age 60      # 自定义年龄阈值（天）
/prune --dry-run         # 预览但不删除
```
