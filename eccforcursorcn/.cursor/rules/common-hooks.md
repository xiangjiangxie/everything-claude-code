---
description: "Hooks 系统：类型、自动接受权限、TodoWrite 最佳实践"
alwaysApply: true
---
# Hooks 系统

## Hook 类型

- **PreToolUse**：工具执行前（验证、参数修改）
- **PostToolUse**：工具执行后（自动格式化、检查）
- **Stop**：会话结束时（最终验证）

## 自动接受权限

谨慎使用：
- 仅对可信且明确的计划启用
- 探索性工作时禁用
- 绝不使用 dangerously-skip-permissions 标志
- 改为在 `~/.claude.json` 中配置 `allowedTools`

## TodoWrite 最佳实践

使用 TodoWrite 工具可以：
- 跟踪多步骤任务的进度
- 验证对指令的理解
- 实现实时调整
- 展示细粒度的实现步骤

待办清单可暴露：
- 步骤顺序错误
- 遗漏的项目
- 多余的不必要项目
- 粒度不当
- 需求理解偏差
