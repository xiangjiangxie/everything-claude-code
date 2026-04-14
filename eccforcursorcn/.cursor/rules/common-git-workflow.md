---
description: "Git 工作流：Conventional Commits、PR 流程"
alwaysApply: true
---
# Git 工作流

## 提交信息格式
```
<type>: <description>

<optional body>
```

类型：feat, fix, refactor, docs, test, chore, perf, ci

注意：署名功能已通过 ~/.claude/settings.json 全局禁用。

## Pull Request 工作流

创建 PR 时：
1. 分析完整的提交历史（不仅是最新提交）
2. 使用 `git diff [base-branch]...HEAD` 查看所有变更
3. 撰写全面的 PR 摘要
4. 包含测试计划和待办事项
5. 新分支推送时使用 `-u` 标志

> 关于 Git 操作之前的完整开发流程（规划、TDD、代码审查），
> 请参见开发工作流规则。
