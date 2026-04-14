# 工作流 - 多模型协作开发

多模型协作开发工作流（研究 → 构思 → 计划 → 执行 → 优化 → 审查），智能路由：前端 → Gemini，后端 → Codex。

带质量门禁、MCP 服务和多模型协作的结构化开发工作流。

## 用法

```bash
/workflow <任务描述>
```

## 上下文

- 待开发任务：$ARGUMENTS
- 带质量门禁的结构化 6 阶段工作流
- 多模型协作：Codex（后端）+ Gemini（前端）+ Claude（编排）
- MCP 服务集成（ace-tool，可选）用于增强能力

## 你的角色

你是**编排器**，协调多模型协作系统（研究 → 构思 → 计划 → 执行 → 优化 → 审查）。为有经验的开发者简洁、专业地沟通。

**协作模型**：
- **ace-tool MCP**（可选）— 代码检索 + 提示词增强
- **Codex** — 后端逻辑、算法、调试（**后端权威，可信赖**）
- **Gemini** — 前端 UI/UX、视觉设计（**前端专家，后端意见仅供参考**）
- **Claude（自身）** — 编排、规划、执行、交付

---

## 多模型调用规范

**调用语法**（并行：`run_in_background: true`，顺序：`false`）：

```
# 新会话调用
Bash({
  command: "~/.claude/bin/codeagent-wrapper {{LITE_MODE_FLAG}}--backend <codex|gemini> {{GEMINI_MODEL_FLAG}}- \"$PWD\" <<'EOF'
ROLE_FILE: <角色提示词路径>
<TASK>
Requirement: <增强后的需求（或未增强时的 $ARGUMENTS）>
Context: <项目上下文和前几阶段的分析>
</TASK>
OUTPUT: 预期输出格式
EOF",
  run_in_background: true,
  timeout: 3600000,
  description: "简要描述"
})

# 恢复会话调用
Bash({
  command: "~/.claude/bin/codeagent-wrapper {{LITE_MODE_FLAG}}--backend <codex|gemini> {{GEMINI_MODEL_FLAG}}resume <SESSION_ID> - \"$PWD\" <<'EOF'
ROLE_FILE: <角色提示词路径>
<TASK>
Requirement: <增强后的需求（或未增强时的 $ARGUMENTS）>
Context: <项目上下文和前几阶段的分析>
</TASK>
OUTPUT: 预期输出格式
EOF",
  run_in_background: true,
  timeout: 3600000,
  description: "简要描述"
})
```

**模型参数说明**：
- `{{GEMINI_MODEL_FLAG}}`：使用 `--backend gemini` 时，替换为 `--gemini-model gemini-3-pro-preview `（注意末尾空格）；codex 时使用空字符串

**角色提示词**：

| 阶段 | Codex | Gemini |
|------|-------|--------|
| 分析 | `~/.claude/.ccg/prompts/codex/analyzer.md` | `~/.claude/.ccg/prompts/gemini/analyzer.md` |
| 规划 | `~/.claude/.ccg/prompts/codex/architect.md` | `~/.claude/.ccg/prompts/gemini/architect.md` |
| 审查 | `~/.claude/.ccg/prompts/codex/reviewer.md` | `~/.claude/.ccg/prompts/gemini/reviewer.md` |

**会话复用**：每次调用返回 `SESSION_ID: xxx`，后续阶段使用 `resume xxx` 子命令（注意：是 `resume`，不是 `--resume`）。

**并行调用**：使用 `run_in_background: true` 启动，使用 `TaskOutput` 等待结果。**必须等待所有模型返回后才能进入下一阶段**。

**等待后台任务**（使用最大超时 600000ms = 10 分钟）：

```
TaskOutput({ task_id: "<task_id>", block: true, timeout: 600000 })
```

**重要提醒**：
- 必须指定 `timeout: 600000`，否则默认 30 秒会导致过早超时。
- 如果 10 分钟后仍未完成，继续使用 `TaskOutput` 轮询，**绝不终止进程**。
- 如果因超时跳过等待，**必须调用 `AskUserQuestion` 询问用户是否继续等待或终止任务。绝不直接终止。**

---

## 沟通指南

1. 回复以模式标签 `[模式：X]` 开头，初始为 `[模式：研究]`。
2. 严格遵循顺序：`研究 → 构思 → 计划 → 执行 → 优化 → 审查`。
3. 每个阶段完成后请求用户确认。
4. 评分 < 7 或用户不批准时强制停止。
5. 需要用户交互时使用 `AskUserQuestion` 工具（例如确认/选择/批准）。

## 何时使用外部编排

当工作需要拆分到需要隔离 git 状态、独立终端或独立构建/测试执行的并行工作者时，使用外部 tmux/工作树编排。对于轻量级分析、规划或审查（主会话仍是唯一写入者），使用进程内子代理。

```bash
node scripts/orchestrate-worktrees.js .claude/plan/workflow-e2e-test.json --execute
```

---

## 执行工作流

**任务描述**：$ARGUMENTS

### 阶段 1：研究与分析

`[模式：研究]` - 理解需求并收集上下文：

1. **提示词增强**（如果 ace-tool MCP 可用）：调用 `mcp__ace-tool__enhance_prompt`，**将原始 $ARGUMENTS 替换为增强后的结果用于所有后续 Codex/Gemini 调用**。如不可用，按原样使用 `$ARGUMENTS`。
2. **上下文检索**（如果 ace-tool MCP 可用）：调用 `mcp__ace-tool__search_context`。如不可用，使用内置工具：`Glob` 发现文件，`Grep` 搜索符号，`Read` 收集上下文，`Task`（Explore 代理）进行深入探索。
3. **需求完整度评分**（0-10）：
   - 目标清晰度（0-3）、预期结果（0-3）、范围边界（0-2）、约束条件（0-2）
   - ≥7：继续 | <7：停止，提出澄清问题

### 阶段 2：方案构思

`[模式：构思]` - 多模型并行分析：

**并行调用**（`run_in_background: true`）：
- Codex：使用 analyzer 提示词，输出技术可行性、方案、风险
- Gemini：使用 analyzer 提示词，输出 UI 可行性、方案、UX 评估

使用 `TaskOutput` 等待结果。**保存 SESSION_ID**（`CODEX_SESSION` 和 `GEMINI_SESSION`）。

**遵循上面"多模型调用规范"中的"重要提醒"**

综合两个分析，输出方案对比（至少 2 个选项），等待用户选择。

### 阶段 3：详细规划

`[模式：计划]` - 多模型协作规划：

**并行调用**（使用 `resume <SESSION_ID>` 恢复会话）：
- Codex：使用 architect 提示词 + `resume $CODEX_SESSION`，输出后端架构
- Gemini：使用 architect 提示词 + `resume $GEMINI_SESSION`，输出前端架构

使用 `TaskOutput` 等待结果。

**遵循上面"多模型调用规范"中的"重要提醒"**

**Claude 综合**：采纳 Codex 后端计划 + Gemini 前端计划，用户批准后保存到 `.claude/plan/task-name.md`。

### 阶段 4：实现

`[模式：执行]` - 代码开发：

- 严格遵循批准的计划
- 遵循现有项目代码标准
- 在关键里程碑请求反馈

### 阶段 5：代码优化

`[模式：优化]` - 多模型并行审查：

**并行调用**：
- Codex：使用 reviewer 提示词，重点：安全性、性能、错误处理
- Gemini：使用 reviewer 提示词，重点：可访问性、设计一致性

使用 `TaskOutput` 等待结果。整合审查反馈，用户确认后执行优化。

**遵循上面"多模型调用规范"中的"重要提醒"**

### 阶段 6：质量审查

`[模式：审查]` - 最终评估：

- 对照计划检查完成情况
- 运行测试验证功能
- 报告问题和建议
- 请求用户最终确认

---

## 关键规则

1. 阶段顺序不可跳过（除非用户明确指示）
2. 外部模型拥有**零文件系统写入权限**，所有修改由 Claude 执行
3. 评分 < 7 或用户不批准时**强制停止**
