# 模型路由命令

根据复杂度和预算为当前任务推荐最佳模型层级。

## 用法

`/model-route [task-description] [--budget low|med|high]`

## 路由启发式

- `haiku`：确定性的、低风险的机械性变更
- `sonnet`：实现和重构的默认选择
- `opus`：架构设计、深度审查、模糊需求

## 必需输出

- 推荐模型
- 置信度水平
- 为什么此模型适合
- 第一次尝试失败时的回退模型

## 参数

$ARGUMENTS:
- `[task-description]` 可选自由文本
- `--budget low|med|high` 可选
