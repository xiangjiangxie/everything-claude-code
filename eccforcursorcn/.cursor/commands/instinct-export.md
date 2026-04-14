---
name: instinct-export
description: 将直觉规则从项目/全局范围导出到文件
command: /instinct-export
---

# 直觉规则导出命令

将直觉规则导出为可共享的格式。适用于：
- 与团队成员共享
- 迁移到新机器
- 贡献项目约定

## 用法

```
/instinct-export                           # 导出所有个人直觉规则
/instinct-export --domain testing          # 仅导出测试相关的直觉规则
/instinct-export --min-confidence 0.7      # 仅导出高置信度的直觉规则
/instinct-export --output team-instincts.yaml
/instinct-export --scope project --output project-instincts.yaml
```

## 操作流程

1. 检测当前项目上下文
2. 按选定范围加载直觉规则：
   - `project`：仅当前项目
   - `global`：仅全局
   - `all`：项目 + 全局合并（默认）
3. 应用过滤器（`--domain`、`--min-confidence`）
4. 将 YAML 格式导出写入文件（未提供输出路径时输出到 stdout）

## 输出格式

创建 YAML 文件：

```yaml
# Instincts Export
# Generated: 2025-01-22
# Source: personal
# Count: 12 instincts

---
id: prefer-functional-style
trigger: "when writing new functions"
confidence: 0.8
domain: code-style
source: session-observation
scope: project
project_id: a1b2c3d4e5f6
project_name: my-app
---

# Prefer Functional Style

## Action
Use functional patterns over classes.
```

## 标志参数

- `--domain <name>`：仅导出指定领域
- `--min-confidence <n>`：最低置信度阈值
- `--output <file>`：输出文件路径（省略时输出到 stdout）
- `--scope <project|global|all>`：导出范围（默认：`all`）
