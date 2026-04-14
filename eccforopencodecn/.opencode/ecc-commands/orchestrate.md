---
description: 用于多代理工作流的顺序和 tmux/工作树编排指导。
---

# 编排命令

用于复杂任务的顺序代理工作流。

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
安全的重构工作流：
```
architect -> code-reviewer -> tdd-guide
```

### security
安全专项审查：
```
security-reviewer -> code-reviewer -> architect
```

## 执行模式

对于工作流中的每个代理：

1. **调用代理**，提供上一个代理的上下文
2. **收集输出**作为结构化交接文档
3. **传递给下一个代理**
4. **聚合结果**为最终报告

## 交接文档格式

代理之间创建交接文档：

```markdown
## 交接：[上一个代理] -> [下一个代理]

### 上下文
[已完成工作的摘要]

### 发现
[关键发现或决策]

### 修改的文件
[涉及的文件列表]

### 未解决的问题
[下一个代理需要处理的事项]

### 建议
[建议的后续步骤]
```

## 示例：功能工作流

```
/orchestrate feature "添加用户认证"
```

执行：

1. **规划代理**
   - 分析需求
   - 创建实现计划
   - 识别依赖
   - 输出：`交接：planner -> tdd-guide`

2. **TDD 指导代理**
   - 读取规划交接
   - 先编写测试
   - 实现以通过测试
   - 输出：`交接：tdd-guide -> code-reviewer`

3. **代码审查代理**
   - 审查实现
   - 检查问题
   - 建议改进
   - 输出：`交接：code-reviewer -> security-reviewer`

4. **安全审查代理**
   - 安全审计
   - 漏洞检查
   - 最终批准
   - 输出：最终报告

## 最终报告格式

```
编排报告
====================
工作流：feature
任务：添加用户认证
代理：planner -> tdd-guide -> code-reviewer -> security-reviewer

摘要
-------
[一段摘要]

代理输出
-------------
规划：[摘要]
TDD 指导：[摘要]
代码审查：[摘要]
安全审查：[摘要]

变更的文件
-------------
[所有修改文件列表]

测试结果
------------
[测试通过/失败摘要]

安全状态
---------------
[安全发现]

建议
--------------
[发布 / 需要改进 / 被阻塞]
```

## 并行执行

对于独立的检查，可并行运行代理：

```markdown
### 并行阶段
同时运行：
- code-reviewer（质量）
- security-reviewer（安全）
- architect（设计）

### 合并结果
将输出合并为单一报告
```

对于需要独立 git 工作树的外部 tmux 面板工作者，使用 `node scripts/orchestrate-worktrees.js plan.json --execute`。内置编排模式保持在进程内；辅助工具用于长时间运行或跨工具链的会话。

当工作者需要看到主检出中的脏文件或未跟踪的本地文件时，在计划文件中添加 `seedPaths`。ECC 仅在 `git worktree add` 后将那些选定的路径覆盖到每个工作者工作树中，既保持分支隔离又暴露进行中的本地脚本、计划或文档。

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

要为活跃的 tmux/工作树会话导出控制面快照，运行：

```bash
node scripts/orchestration-status.js .claude/plan/workflow-visual-proof.json
```

快照包含以 JSON 形式呈现的会话活动、tmux 面板元数据、工作者状态、目标、种子覆盖和最近的交接摘要。

## 操作员指挥中心交接

当工作流跨越多个会话、工作树或 tmux 面板时，在最终交接中追加控制面板块：

```markdown
控制面
-------------
会话：
- 活跃的会话 ID 或别名
- 每个活跃工作者的分支 + 工作树路径
- 适用时的 tmux 面板或分离的会话名称

差异：
- git status 摘要
- 涉及文件的 git diff --stat
- 合并/冲突风险说明

审批：
- 待处理的用户审批
- 等待确认的被阻塞步骤

遥测：
- 最后活动时间戳或空闲信号
- 预估的 token 或成本偏差
- hooks 或审查器引发的策略事件
```

这使规划者、实施者、审查者和循环工作者从操作面上保持可读。

## 参数

$ARGUMENTS:
- `feature <description>` - 完整功能工作流
- `bugfix <description>` - Bug 修复工作流
- `refactor <description>` - 重构工作流
- `security <description>` - 安全审查工作流
- `custom <agents> <description>` - 自定义代理序列

## 自定义工作流示例

```
/orchestrate custom "architect,tdd-guide,code-reviewer" "重新设计缓存层"
```

## 提示

1. **复杂功能从 planner 开始**
2. **合并前始终包含 code-reviewer**
3. **对认证/支付/PII 使用 security-reviewer**
4. **保持交接简洁** — 关注下一个代理需要什么
5. **如需要，在代理之间运行验证**
