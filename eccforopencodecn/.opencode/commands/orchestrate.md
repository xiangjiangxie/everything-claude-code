---
description: 编排多个代理以完成复杂任务
agent: planner
subtask: true
---

# 编排命令

为此复杂任务编排多个专业代理：$ARGUMENTS

## 你的任务

1. **分析任务复杂度** 并分解为子任务
2. **确定最佳代理** 负责每个子任务
3. **创建执行计划** 包含依赖关系
4. **协调执行** - 尽可能并行
5. **整合结果** 为统一输出

## 可用代理

| 代理 | 专长 | 用途 |
|-------|-----------|---------|
| planner | 实现规划 | 复杂功能设计 |
| architect | 系统设计 | 架构决策 |
| code-reviewer | 代码质量 | 审查变更 |
| security-reviewer | 安全分析 | 漏洞检测 |
| tdd-guide | 测试驱动开发 | 功能实现 |
| build-error-resolver | 构建修复 | TypeScript/构建错误 |
| e2e-runner | E2E 测试 | 用户流程测试 |
| doc-updater | 文档 | 更新文档 |
| refactor-cleaner | 代码清理 | 死代码移除 |
| go-reviewer | Go 代码 | Go 专项审查 |
| go-build-resolver | Go 构建 | Go 构建错误 |
| database-reviewer | 数据库 | 查询优化 |

## 编排模式

### 顺序执行
```
planner → tdd-guide → code-reviewer → security-reviewer
```
适用场景：后续任务依赖前面的结果

### 并行执行
```
┌→ security-reviewer
planner →├→ code-reviewer
└→ architect
```
适用场景：任务之间相互独立

### 扇出/扇入
```
         ┌→ agent-1 ─┐
planner →├→ agent-2 ─┼→ 汇总器
         └→ agent-3 ─┘
```
适用场景：需要多角度视角

## 执行计划格式

### 阶段 1：[名称]
- 代理：[agent-name]
- 任务：[具体任务]
- 依赖：[无或前一阶段]

### 阶段 2：[名称]（并行）
- 代理 A：[agent-name]
  - 任务：[具体任务]
- 代理 B：[agent-name]
  - 任务：[具体任务]
- 依赖：阶段 1

### 阶段 3：整合
- 合并阶段 2 的结果
- 生成统一输出

## 协调规则

1. **先计划后执行** - 先创建完整的执行计划
2. **最小化交接** - 减少上下文切换
3. **尽可能并行化** - 独立任务并行执行
4. **明确边界** - 每个代理有具体的职责范围
5. **唯一数据源** - 每个产出物由一个代理负责

---

**注意**：复杂任务受益于多代理编排。简单任务应直接使用单个代理。
