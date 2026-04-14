---
description: 通过 Claude DevFleet 编排并行 Claude Code 代理 — 从自然语言规划项目，在隔离的工作树中分发代理，监控进度，并读取结构化报告。
---

# DevFleet — 多代理编排

通过 Claude DevFleet 编排并行 Claude Code 代理。每个代理在隔离的 git 工作树中运行，拥有完整的工具链。

需要 DevFleet MCP 服务器：`claude mcp add devfleet --transport http http://localhost:18801/mcp`

## 流程

```
用户描述项目
  → plan_project(prompt) → 带依赖关系的任务 DAG
  → 展示计划，获取批准
  → dispatch_mission(M1) → 代理在工作树中启动
  → M1 完成 → 自动合并 → M2 自动分发（依赖 M1）
  → M2 完成 → 自动合并
  → get_report(M2) → files_changed、what_done、errors、next_steps
  → 向用户报告摘要
```

## 工作流

1. **根据用户描述规划项目**：

```
mcp__devfleet__plan_project(prompt="<用户的描述>")
```

这将返回一个包含链式任务的项目。向用户展示：
- 项目名称和 ID
- 每个任务：标题、类型、依赖关系
- 依赖关系 DAG（哪些任务阻塞哪些任务）

2. **在分发前等待用户批准**。清楚地展示计划。

3. **分发第一个任务**（`depends_on` 为空的那个）：

```
mcp__devfleet__dispatch_mission(mission_id="<first_mission_id>")
```

剩余任务会在其依赖完成时自动分发（因为 `plan_project` 创建它们时设置了 `auto_dispatch=true`）。使用 `create_mission` 手动创建任务时，必须显式设置 `auto_dispatch=true` 才能实现此行为。

4. **监控进度** — 查看运行状态：

```
mcp__devfleet__get_dashboard()
```

或检查特定任务：

```
mcp__devfleet__get_mission_status(mission_id="<id>")
```

对于长时间运行的任务，优先使用 `get_mission_status` 轮询而非 `wait_for_mission`，这样用户可以看到进度更新。

5. **读取每个已完成任务的报告**：

```
mcp__devfleet__get_report(mission_id="<mission_id>")
```

对每个到达终态的任务调用此方法。报告包含：files_changed、what_done、what_open、what_tested、what_untested、next_steps、errors_encountered。

## 所有可用工具

| 工具 | 用途 |
|------|------|
| `plan_project(prompt)` | AI 将描述拆分为设置了 `auto_dispatch=true` 的链式任务 |
| `create_project(name, path?, description?)` | 手动创建项目，返回 `project_id` |
| `create_mission(project_id, title, prompt, depends_on?, auto_dispatch?)` | 添加任务。`depends_on` 是任务 ID 字符串列表。 |
| `dispatch_mission(mission_id, model?, max_turns?)` | 启动代理 |
| `cancel_mission(mission_id)` | 停止运行中的代理 |
| `wait_for_mission(mission_id, timeout_seconds?)` | 阻塞直到完成（长任务优先使用轮询） |
| `get_mission_status(mission_id)` | 非阻塞检查进度 |
| `get_report(mission_id)` | 读取结构化报告 |
| `get_dashboard()` | 系统概览 |
| `list_projects()` | 浏览项目 |
| `list_missions(project_id, status?)` | 列出任务 |

## 指南

- 除非用户说"继续执行"，否则在分发前始终确认计划
- 报告状态时包含任务标题和 ID
- 如果任务失败，在重试前先读取其报告以了解错误
- 代理并发数可配置（默认：3）。超出的任务会排队，并在有空闲槽位时自动分发。使用 `get_dashboard()` 查看槽位可用性。
- 依赖关系形成 DAG — 绝不创建循环依赖
- 每个代理完成时会自动合并其工作树。如果发生合并冲突，更改将保留在工作树分支上供手动解决。
