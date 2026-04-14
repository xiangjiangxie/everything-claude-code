---
name: instinct-status
description: 显示已学习的直觉规则（项目 + 全局）及置信度
command: true
---

# 直觉规则状态命令

显示当前项目的已学习直觉规则和全局直觉规则，按领域分组。

## 实现方式

使用插件根路径运行直觉规则 CLI：

```bash
python3 "${CLAUDE_PLUGIN_ROOT}/skills/continuous-learning-v2/scripts/instinct-cli.py" status
```

或如果 `CLAUDE_PLUGIN_ROOT` 未设置（手动安装），使用：

```bash
python3 ~/.claude/skills/continuous-learning-v2/scripts/instinct-cli.py status
```

## 用法

```
/instinct-status
```

## 操作流程

1. 检测当前项目上下文（git remote/路径哈希）
2. 从 `~/.claude/homunculus/projects/<project-id>/instincts/` 读取项目直觉规则
3. 从 `~/.claude/homunculus/instincts/` 读取全局直觉规则
4. 按优先级规则合并（ID 冲突时项目覆盖全局）
5. 按领域分组显示，包含置信度条和观察统计

## 输出格式

```
============================================================
  INSTINCT STATUS - 共 12 条
============================================================

  项目：my-app (a1b2c3d4e5f6)
  项目直觉规则：8
  全局直觉规则：4

## 项目范围 (my-app)
  ### WORKFLOW (3)
    ███████░░░  70%  grep-before-edit [project]
              触发器：when modifying code

## 全局（适用于所有项目）
  ### SECURITY (2)
    █████████░  85%  validate-user-input [global]
              触发器：when handling user input
```
