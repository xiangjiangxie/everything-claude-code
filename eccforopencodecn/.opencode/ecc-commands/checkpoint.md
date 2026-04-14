# 检查点命令

在工作流中创建或验证检查点。

## 用法

`/checkpoint [create|verify|list] [name]`

## 创建检查点

创建检查点时：

1. 运行 `/verify quick` 确保当前状态是干净的
2. 使用检查点名称创建 git stash 或 commit
3. 将检查点记录到 `.claude/checkpoints.log`：

```bash
echo "$(date +%Y-%m-%d-%H:%M) | $CHECKPOINT_NAME | $(git rev-parse --short HEAD)" >> .claude/checkpoints.log
```

4. 报告检查点已创建

## 验证检查点

验证某个检查点时：

1. 从日志中读取检查点
2. 将当前状态与检查点进行比较：
   - 自检查点以来添加的文件
   - 自检查点以来修改的文件
   - 现在与当时的测试通过率
   - 现在与当时的覆盖率

3. 报告：
```
检查点比较：$NAME
============================
变更的文件：X
测试：+Y 通过 / -Z 失败
覆盖率：+X% / -Y%
构建：[通过/失败]
```

## 列出检查点

显示所有检查点，包括：
- 名称
- 时间戳
- Git SHA
- 状态（当前、落后、领先）

## 工作流

典型的检查点流程：

```
[开始] --> /checkpoint create "feature-start"
   |
[实现] --> /checkpoint create "core-done"
   |
[测试] --> /checkpoint verify "core-done"
   |
[重构] --> /checkpoint create "refactor-done"
   |
[PR] --> /checkpoint verify "feature-start"
```

## 参数

$ARGUMENTS:
- `create <name>` - 创建命名检查点
- `verify <name>` - 验证命名检查点
- `list` - 显示所有检查点
- `clear` - 移除旧检查点（保留最近 5 个）
