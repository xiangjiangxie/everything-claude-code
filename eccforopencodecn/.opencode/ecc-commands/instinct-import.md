---
name: instinct-import
description: 从文件或 URL 导入本能到项目/全局范围
command: true
---

# 本能导入命令

## 实现

使用插件根路径运行本能 CLI：

```bash
python3 "${CLAUDE_PLUGIN_ROOT}/skills/continuous-learning-v2/scripts/instinct-cli.py" import <file-or-url> [--dry-run] [--force] [--min-confidence 0.7] [--scope project|global]
```

或者如果未设置 `CLAUDE_PLUGIN_ROOT`（手动安装）：

```bash
python3 ~/.claude/skills/continuous-learning-v2/scripts/instinct-cli.py import <file-or-url>
```

从本地文件路径或 HTTP(S) URL 导入本能。

## 用法

```
/instinct-import team-instincts.yaml
/instinct-import https://github.com/org/repo/instincts.yaml
/instinct-import team-instincts.yaml --dry-run
/instinct-import team-instincts.yaml --scope global --force
```

## 操作步骤

1. 获取本能文件（本地路径或 URL）
2. 解析和验证格式
3. 检查与现有本能是否重复
4. 合并或添加新本能
5. 保存到继承的本能目录：
   - 项目范围：`~/.claude/homunculus/projects/<project-id>/instincts/inherited/`
   - 全局范围：`~/.claude/homunculus/instincts/inherited/`

## 导入流程

```
📥 正在从以下位置导入本能：team-instincts.yaml
================================================

找到 12 个待导入的本能。

正在分析冲突...

## 新本能（8 个）
将被添加：
  ✓ use-zod-validation（置信度：0.7）
  ✓ prefer-named-exports（置信度：0.65）
  ✓ test-async-functions（置信度：0.8）
  ...

## 重复本能（3 个）
已有类似的本能：
  ⚠️ prefer-functional-style
     本地：置信度 0.8，12 次观察
     导入：置信度 0.7
     → 保留本地（置信度更高）

  ⚠️ test-first-workflow
     本地：置信度 0.75
     导入：置信度 0.9
     → 更新为导入版本（置信度更高）

导入 8 个新增，更新 1 个？
```

## 合并行为

当导入已有 ID 的本能时：
- 置信度更高的导入成为更新候选
- 置信度相同或更低的导入将被跳过
- 除非使用 `--force`，否则需要用户确认

## 来源追踪

导入的本能会标记为：
```yaml
source: inherited
scope: project
imported_from: "team-instincts.yaml"
project_id: "a1b2c3d4e5f6"
project_name: "my-project"
```

## 标志参数

- `--dry-run`：预览而不导入
- `--force`：跳过确认提示
- `--min-confidence <n>`：仅导入高于阈值的本能
- `--scope <project|global>`：选择目标范围（默认：`project`）

## 输出

导入后：
```
✅ 导入完成！

已添加：8 个本能
已更新：1 个本能
已跳过：3 个本能（已存在相同或更高置信度的版本）

新本能已保存到：~/.claude/homunculus/instincts/inherited/

运行 /instinct-status 查看所有本能。
```
