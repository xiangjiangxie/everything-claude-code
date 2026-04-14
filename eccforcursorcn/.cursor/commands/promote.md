---
name: promote
description: 将项目范围的直觉规则提升到全局范围
command: true
---

# 提升命令

在 continuous-learning-v2 中将直觉规则从项目范围提升到全局范围。

## 实现方式

使用插件根路径运行直觉规则 CLI：

```bash
python3 "${CLAUDE_PLUGIN_ROOT}/skills/continuous-learning-v2/scripts/instinct-cli.py" promote [instinct-id] [--force] [--dry-run]
```

或如果 `CLAUDE_PLUGIN_ROOT` 未设置（手动安装）：

```bash
python3 ~/.claude/skills/continuous-learning-v2/scripts/instinct-cli.py promote [instinct-id] [--force] [--dry-run]
```

## 用法

```bash
/promote                      # 自动检测提升候选
/promote --dry-run            # 预览自动提升候选
/promote --force              # 提升所有符合条件的候选而无需提示
/promote grep-before-edit     # 从当前项目提升一条特定的直觉规则
```

## 操作流程

1. 检测当前项目
2. 如果提供了 `instinct-id`，仅提升该直觉规则（如存在于当前项目中）
3. 否则，查找跨项目候选：
   - 出现在至少 2 个项目中
   - 达到置信度阈值
4. 将提升的直觉规则写入 `~/.claude/homunculus/instincts/personal/`，设置 `scope: global`
