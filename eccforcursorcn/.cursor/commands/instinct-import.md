---
name: instinct-import
description: 从文件或 URL 导入直觉规则到项目/全局范围
command: true
---

# 直觉规则导入命令

## 实现方式

使用插件根路径运行直觉规则 CLI：

```bash
python3 "${CLAUDE_PLUGIN_ROOT}/skills/continuous-learning-v2/scripts/instinct-cli.py" import <file-or-url> [--dry-run] [--force] [--min-confidence 0.7] [--scope project|global]
```

或如果 `CLAUDE_PLUGIN_ROOT` 未设置（手动安装）：

```bash
python3 ~/.claude/skills/continuous-learning-v2/scripts/instinct-cli.py import <file-or-url>
```

从本地文件路径或 HTTP(S) URL 导入直觉规则。

## 用法

```
/instinct-import team-instincts.yaml
/instinct-import https://github.com/org/repo/instincts.yaml
/instinct-import team-instincts.yaml --dry-run
/instinct-import team-instincts.yaml --scope global --force
```

## 操作流程

1. 获取直觉规则文件（本地路径或 URL）
2. 解析并验证格式
3. 检查与现有直觉规则的重复项
4. 合并或添加新的直觉规则
5. 保存到继承的直觉规则目录：
   - 项目范围：`~/.claude/homunculus/projects/<project-id>/instincts/inherited/`
   - 全局范围：`~/.claude/homunculus/instincts/inherited/`

## 导入流程

```
📥 正在从以下位置导入直觉规则：team-instincts.yaml
================================================

找到 12 条直觉规则待导入。

正在分析冲突...

## 新直觉规则（8 条）
将被添加：
  ✓ use-zod-validation（置信度：0.7）
  ✓ prefer-named-exports（置信度：0.65）
  ✓ test-async-functions（置信度：0.8）
  ...

## 重复的直觉规则（3 条）
已有相似的直觉规则：
  ⚠️ prefer-functional-style
     本地：0.8 置信度，12 次观察
     导入：0.7 置信度
     → 保留本地（置信度更高）

  ⚠️ test-first-workflow
     本地：0.75 置信度
     导入：0.9 置信度
     → 更新为导入版本（置信度更高）

导入 8 条新规则，更新 1 条？
```

## 合并行为

当导入的直觉规则与现有 ID 冲突时：
- 置信度更高的导入成为更新候选
- 置信度相同或更低的导入将被跳过
- 除非使用 `--force`，否则需用户确认

## 来源追踪

导入的直觉规则会标记：
```yaml
source: inherited
scope: project
imported_from: "team-instincts.yaml"
project_id: "a1b2c3d4e5f6"
project_name: "my-project"
```

## 标志参数

- `--dry-run`：预览但不执行导入
- `--force`：跳过确认提示
- `--min-confidence <n>`：仅导入高于阈值的直觉规则
- `--scope <project|global>`：选择目标范围（默认：`project`）

## 输出

导入完成后：
```
✅ 导入完成！

已添加：8 条直觉规则
已更新：1 条直觉规则
已跳过：3 条直觉规则（已存在相同或更高置信度的规则）

新直觉规则已保存到：~/.claude/homunculus/instincts/inherited/

运行 /instinct-status 查看所有直觉规则。
```
