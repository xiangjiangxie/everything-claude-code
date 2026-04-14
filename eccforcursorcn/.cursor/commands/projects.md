---
name: projects
description: 列出已知项目及其直觉规则统计
command: true
---

# 项目命令

列出项目注册条目和每个项目的 continuous-learning-v2 直觉规则/观察计数。

## 实现方式

使用插件根路径运行直觉规则 CLI：

```bash
python3 "${CLAUDE_PLUGIN_ROOT}/skills/continuous-learning-v2/scripts/instinct-cli.py" projects
```

或如果 `CLAUDE_PLUGIN_ROOT` 未设置（手动安装）：

```bash
python3 ~/.claude/skills/continuous-learning-v2/scripts/instinct-cli.py projects
```

## 用法

```bash
/projects
```

## 操作流程

1. 读取 `~/.claude/homunculus/projects.json`
2. 对每个项目显示：
   - 项目名称、ID、根路径、远程地址
   - 个人和继承的直觉规则数量
   - 观察事件数量
   - 最后出现时间戳
3. 同时显示全局直觉规则总数
