---
description: "开发工作流：规划、TDD、审查、提交流水线"
alwaysApply: true
---
# 开发工作流

> 本规则在 Git 工作流规则的基础上，扩展了 Git 操作之前的完整功能开发流程。

功能实现工作流描述了开发流水线：规划、TDD、代码审查，然后提交到 Git。

## 功能实现工作流

1. **先做规划**
   - 使用 **planner** agent 制定实现方案
   - 识别依赖和风险
   - 分解为多个阶段

2. **TDD 方法**
   - 使用 **tdd-guide** agent
   - 先写测试（RED）
   - 实现代码使测试通过（GREEN）
   - 重构优化（IMPROVE）
   - 验证覆盖率达到 80% 以上

3. **代码审查**
   - 代码编写后立即使用 **code-reviewer** agent
   - 解决 CRITICAL 和 HIGH 级别问题
   - 尽可能修复 MEDIUM 级别问题

4. **提交与推送**
   - 编写详细的提交信息
   - 遵循 Conventional Commits 格式
   - 提交信息格式和 PR 流程参见 Git 工作流规则
