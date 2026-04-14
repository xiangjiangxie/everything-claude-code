---
description: 通过 Claude DevFleet 编排并行 Claude Code 智能体 — 从自然语言规划项目、在隔离的工作树中派遣智能体、监控进度并读取结构化报告。
---

# DevFleet — 多智能体编排

通过 Claude DevFleet 编排并行 Claude Code 智能体。每个智能体在隔离的 git 工作树中运行，拥有完整工具链。

需要 DevFleet MCP 服务器：`claude mcp add devfleet --transport http http://localhost:18801/mcp`

## 流程

```
用户描述项目
  → plan_project(prompt) → 带依赖关系的任务 DAG
  → 展示计划，获取批准
  → dispatch_mission(M1) → 智能体在工作树中启动
  → M1 完成 → 自动合并 → M2 自动派遣（依赖 M1）
  → M2 完成 → 自动合并
  → get_report(M2) → files_changed、what_done、errors、next_steps
  → 向用户汇报摘要
```

## 工作流

1. **根据用户描述规划项目**：

```
mcp__devfleet__plan_project(prompt="<用户描述>")
```

返回包含链式任务的项目。向用户展示：
- 项目名称和 ID
- 每个任务：标题、类型、依赖关系
- 依赖 DAG（哪些任务阻塞哪些）

2. **等待用户批准**后再派遣。清晰展示计划。

3. **派遣第一个任务**（`depends_on` 为空的任务）：

```
mcp__devfleet__dispatch_mission(mission_id="<first_mission_id>")
```

其余任务在依赖完成后自动派遣（因为 `plan_project` 创建时设置了 `auto_dispatch=true`）。使用 `create_mission` 手动创建任务时，必须显式设置 `auto_dispatch=true` 才能启用此行为。

4. **监控进度** — 查看运行状态：

```
mcp__devfleet__get_dashboard()
```

或检查特定任务：

```
mcp__devfleet__get_mission_status(mission_id="<id>")
```

对于长时间运行的任务，优先使用 `get_mission_status` 轮询而非 `wait_for_mission`，以便用户能看到进度更新。

5. **读取每个已完成任务的报告**：

```
mcp__devfleet__get_report(mission_id="<mission_id>")
```

对每个到达终态的任务调用此方法。报告包含：files_changed、what_done、what_open、what_tested、what_untested、next_steps、errors_encountered。

## 所有可用工具

| 工具 | 用途 |
|------|---------|
| `plan_project(prompt)` | AI 将描述拆分为带 `auto_dispatch=true` 的链式任务 |
| `create_project(name, path?, description?)` | 手动创建项目，返回 `project_id` |
| `create_mission(project_id, title, prompt, depends_on?, auto_dispatch?)` | 添加任务。`depends_on` 是任务 ID 字符串列表。 |
| `dispatch_mission(mission_id, model?, max_turns?)` | 启动智能体 |
| `cancel_mission(mission_id)` | 停止运行中的智能体 |
| `wait_for_mission(mission_id, timeout_seconds?)` | 阻塞等待完成（长任务优先使用轮询） |
| `get_mission_status(mission_id)` | 非阻塞检查进度 |
| `get_report(mission_id)` | 读取结构化报告 |
| `get_dashboard()` | 系统概览 |
| `list_projects()` | 浏览项目 |
| `list_missions(project_id, status?)` | 列出任务 |

## 指导原则

- 除非用户说"直接开始"，否则在派遣前始终确认计划
- 汇报状态时包含任务标题和 ID
- 如果任务失败，先读取报告了解错误再重试
- 智能体并发数可配置（默认：3）。超出的任务会排队，在插槽空闲时自动派遣。通过 `get_dashboard()` 查看可用插槽。
- 依赖关系形成 DAG — 绝不创建循环依赖
- 每个智能体完成时自动合并其工作树。如果发生合并冲突，变更将保留在工作树分支上以供手动解决。
