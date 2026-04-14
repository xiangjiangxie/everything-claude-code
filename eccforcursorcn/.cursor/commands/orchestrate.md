---
description: 复杂任务的顺序和 tmux/工作树编排指导，用于多智能体工作流。
---

# 编排命令

用于复杂任务的顺序智能体工作流。

## 用法

`/orchestrate [workflow-type] [task-description]`

## 工作流类型

### feature
完整的功能实现工作流：
```
planner -> tdd-guide -> code-reviewer -> security-reviewer
```

### bugfix
Bug 调查和修复工作流：
```
planner -> tdd-guide -> code-reviewer
```

### refactor
安全重构工作流：
```
architect -> code-reviewer -> tdd-guide
```

### security
安全聚焦审查：
```
security-reviewer -> code-reviewer -> architect
```

## 执行模式

对工作流中的每个智能体：

1. **调用智能体**，传入前一个智能体的上下文
2. **收集输出**作为结构化交接文档
3. **传递给下一个智能体**
4. **汇总结果**为最终报告

## 交接文档格式

智能体之间创建交接文档：

```markdown
## HANDOFF: [前一个智能体] -> [下一个智能体]

### Context
[完成了什么的摘要]

### Findings
[关键发现或决策]

### Files Modified
[涉及的文件列表]

### Open Questions
[留给下一个智能体的未解决项]

### Recommendations
[建议的后续步骤]
```

## 示例：功能工作流

```
/orchestrate feature "Add user authentication"
```

执行：

1. **Planner 智能体**
   - 分析需求
   - 创建实施计划
   - 识别依赖关系
   - 输出：`HANDOFF: planner -> tdd-guide`

2. **TDD Guide 智能体**
   - 读取 planner 的交接
   - 先编写测试
   - 实现使测试通过
   - 输出：`HANDOFF: tdd-guide -> code-reviewer`

3. **Code Reviewer 智能体**
   - 审查实现
   - 检查问题
   - 提出改进建议
   - 输出：`HANDOFF: code-reviewer -> security-reviewer`

4. **Security Reviewer 智能体**
   - 安全审计
   - 漏洞检查
   - 最终审批
   - 输出：最终报告

## 最终报告格式

```
ORCHESTRATION REPORT
====================
Workflow: feature
Task: Add user authentication
Agents: planner -> tdd-guide -> code-reviewer -> security-reviewer

SUMMARY
-------
[一段话摘要]

AGENT OUTPUTS
-------------
Planner: [摘要]
TDD Guide: [摘要]
Code Reviewer: [摘要]
Security Reviewer: [摘要]

FILES CHANGED
-------------
[所有修改文件列表]

TEST RESULTS
------------
[测试通过/失败摘要]

SECURITY STATUS
---------------
[安全发现]

RECOMMENDATION
--------------
[SHIP / NEEDS WORK / BLOCKED]
```

## 并行执行

对于独立的检查，并行运行智能体：

```markdown
### 并行阶段
同时运行：
- code-reviewer（质量）
- security-reviewer（安全）
- architect（设计）

### 合并结果
将输出合并为单一报告
```

对于使用独立 git 工作树的外部 tmux 面板工作者，使用 `node scripts/orchestrate-worktrees.js plan.json --execute`。内置编排模式在进程内运行；辅助工具用于长时间运行或跨 harness 的会话。

当工作者需要看到主检出中的脏文件或未跟踪的本地文件时，在计划文件中添加 `seedPaths`。ECC 在 `git worktree add` 之后仅将那些选定路径覆盖到每个工作者的工作树中，保持分支隔离同时暴露正在进行的本地脚本、计划或文档。

```json
{
  "sessionName": "workflow-e2e",
  "seedPaths": [
    "scripts/orchestrate-worktrees.js",
    "scripts/lib/tmux-worktree-orchestrator.js",
    ".claude/plan/workflow-e2e-test.json"
  ],
  "workers": [
    { "name": "docs", "task": "Update orchestration docs." }
  ]
}
```

要导出活跃 tmux/工作树会话的控制面板快照，运行：

```bash
node scripts/orchestration-status.js .claude/plan/workflow-visual-proof.json
```

快照包含会话活动、tmux 面板元数据、工作者状态、目标、种子覆盖和最近的交接摘要，以 JSON 形式呈现。

## 操作员命令中心交接

当工作流跨越多个会话、工作树或 tmux 面板时，在最终交接中附加控制面板块：

```markdown
CONTROL PLANE
-------------
Sessions:
- 活跃会话 ID 或别名
- 每个活跃工作者的分支 + 工作树路径
- 适用时的 tmux 面板或分离会话名

Diffs:
- git status 摘要
- 涉及文件的 git diff --stat
- 合并/冲突风险说明

Approvals:
- 待用户审批
- 等待确认的阻塞步骤

Telemetry:
- 最后活动时间戳或空闲信号
- 预估的 token 或成本偏差
- hooks 或审查者触发的策略事件
```

这使得 planner、implementer、reviewer 和 loop worker 在操作员视角下保持可读性。

## 参数

$ARGUMENTS:
- `feature <description>` - 完整功能工作流
- `bugfix <description>` - Bug 修复工作流
- `refactor <description>` - 重构工作流
- `security <description>` - 安全审查工作流
- `custom <agents> <description>` - 自定义智能体序列

## 自定义工作流示例

```
/orchestrate custom "architect,tdd-guide,code-reviewer" "Redesign caching layer"
```

## 提示

1. **复杂功能从 planner 开始**
2. **合并前始终包含 code-reviewer**
3. **涉及认证/支付/PII 时使用 security-reviewer**
4. **保持交接简洁** — 聚焦于下一个智能体需要的内容
5. **必要时在智能体之间运行验证**
