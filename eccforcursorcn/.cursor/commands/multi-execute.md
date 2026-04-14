# 执行 - 多模型协作执行

多模型协作执行 - 从计划获取原型 → Claude 重构并实现 → 多模型审计和交付。

$ARGUMENTS

---

## 核心协议

- **语言协议**：与工具/模型交互时使用 **英语**，与用户使用其语言沟通
- **代码主权**：外部模型 **零文件系统写入权限**，所有修改由 Claude 执行
- **脏原型重构**：将 Codex/Gemini Unified Diff 视为"脏原型"，必须重构为生产级代码
- **止损机制**：当前阶段输出未经验证前不进入下一阶段
- **前提条件**：仅在用户明确回复"Y"确认 `/ccg:plan` 输出后执行（如缺失，必须先确认）

---

## 多模型调用规范

**调用语法**（并行时使用 `run_in_background: true`）：

```
# 恢复会话调用（推荐）- 实现原型
Bash({
  command: "~/.claude/bin/codeagent-wrapper {{LITE_MODE_FLAG}}--backend <codex|gemini> {{GEMINI_MODEL_FLAG}}resume <SESSION_ID> - \"$PWD\" <<'EOF'
ROLE_FILE: <角色提示词路径>
<TASK>
Requirement: <任务描述>
Context: <计划内容 + 目标文件>
</TASK>
OUTPUT: Unified Diff Patch ONLY. Strictly prohibit any actual modifications.
EOF",
  run_in_background: true,
  timeout: 3600000,
  description: "简要描述"
})

# 新会话调用 - 实现原型
Bash({
  command: "~/.claude/bin/codeagent-wrapper {{LITE_MODE_FLAG}}--backend <codex|gemini> {{GEMINI_MODEL_FLAG}}- \"$PWD\" <<'EOF'
ROLE_FILE: <角色提示词路径>
<TASK>
Requirement: <任务描述>
Context: <计划内容 + 目标文件>
</TASK>
OUTPUT: Unified Diff Patch ONLY. Strictly prohibit any actual modifications.
EOF",
  run_in_background: true,
  timeout: 3600000,
  description: "简要描述"
})
```

**审计调用语法**（代码审查 / 审计）：

```
Bash({
  command: "~/.claude/bin/codeagent-wrapper {{LITE_MODE_FLAG}}--backend <codex|gemini> {{GEMINI_MODEL_FLAG}}resume <SESSION_ID> - \"$PWD\" <<'EOF'
ROLE_FILE: <角色提示词路径>
<TASK>
Scope: Audit the final code changes.
Inputs:
- The applied patch (git diff / final unified diff)
- The touched files (relevant excerpts if needed)
Constraints:
- Do NOT modify any files.
- Do NOT output tool commands that assume filesystem access.
</TASK>
OUTPUT:
1) A prioritized list of issues (severity, file, rationale)
2) Concrete fixes; if code changes are needed, include a Unified Diff Patch in a fenced code block.
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
|-------|-------|--------|
| 实现 | `~/.claude/.ccg/prompts/codex/architect.md` | `~/.claude/.ccg/prompts/gemini/frontend.md` |
| 审查 | `~/.claude/.ccg/prompts/codex/reviewer.md` | `~/.claude/.ccg/prompts/gemini/reviewer.md` |

**会话复用**：如果 `/ccg:plan` 提供了 SESSION_ID，使用 `resume <SESSION_ID>` 复用上下文。

**等待后台任务**（最大超时 600000ms = 10 分钟）：

```
TaskOutput({ task_id: "<task_id>", block: true, timeout: 600000 })
```

**重要**：
- 必须指定 `timeout: 600000`，否则默认 30 秒会导致过早超时
- 10 分钟后仍未完成，继续轮询 `TaskOutput`，**绝不终止进程**
- 如因超时跳过等待，**必须调用 `AskUserQuestion` 询问用户是否继续等待或终止任务**

---

## 执行工作流

**执行任务**：$ARGUMENTS

### 阶段 0：读取计划

`[Mode: Prepare]`

1. **识别输入类型**：
   - 计划文件路径（例如 `.claude/plan/xxx.md`）
   - 直接任务描述

2. **读取计划内容**：
   - 如提供计划文件路径，读取并解析
   - 提取：任务类型、实现步骤、关键文件、SESSION_ID

3. **执行前确认**：
   - 如输入是"直接任务描述"或计划缺少 `SESSION_ID` / 关键文件：先与用户确认
   - 如无法确认用户对计划回复了"Y"：必须再次确认后再继续

4. **任务类型路由**：

   | 任务类型 | 检测 | 路由 |
   |-----------|-----------|-------|
   | **前端** | 页面、组件、UI、样式、布局 | Gemini |
   | **后端** | API、接口、数据库、逻辑、算法 | Codex |
   | **全栈** | 同时包含前端和后端 | Codex ∥ Gemini 并行 |

---

### 阶段 1：快速上下文检索

`[Mode: Retrieval]`

**如果 ace-tool MCP 可用**，用它进行快速上下文检索：

基于计划中的"关键文件"列表，调用 `mcp__ace-tool__search_context`：

```
mcp__ace-tool__search_context({
  query: "<基于计划内容的语义查询，包含关键文件、模块、函数名>",
  project_root_path: "$PWD"
})
```

**检索策略**：
- 从计划的"关键文件"表中提取目标路径
- 构建覆盖以下内容的语义查询：入口文件、依赖模块、相关类型定义
- 如结果不足，添加 1-2 次递归检索

**如果 ace-tool MCP 不可用**，使用 Claude Code 内置工具作为回退：
1. **Glob**：从计划的"关键文件"表中查找目标文件（例如 `Glob("src/components/**/*.tsx")`）
2. **Grep**：在代码库中搜索关键符号、函数名、类型定义
3. **Read**：读取发现的文件以收集完整上下文
4. **Task（Explore agent）**：用于更广泛的探索，使用 `Task` 配合 `subagent_type: "Explore"`

**检索后**：
- 组织检索到的代码片段
- 确认实现所需的完整上下文
- 进入阶段 3

---

### 阶段 3：原型获取

`[Mode: Prototype]`

**根据任务类型路由**：

#### 路线 A：前端/UI/样式 → Gemini

**限制**：上下文 < 32k token

1. 调用 Gemini（使用 `~/.claude/.ccg/prompts/gemini/frontend.md`）
2. 输入：计划内容 + 检索到的上下文 + 目标文件
3. OUTPUT：`Unified Diff Patch ONLY. Strictly prohibit any actual modifications.`
4. **Gemini 是前端设计权威，其 CSS/React/Vue 原型是最终视觉基线**
5. **警告**：忽略 Gemini 的后端逻辑建议
6. 如计划包含 `GEMINI_SESSION`：优先使用 `resume <GEMINI_SESSION>`

#### 路线 B：后端/逻辑/算法 → Codex

1. 调用 Codex（使用 `~/.claude/.ccg/prompts/codex/architect.md`）
2. 输入：计划内容 + 检索到的上下文 + 目标文件
3. OUTPUT：`Unified Diff Patch ONLY. Strictly prohibit any actual modifications.`
4. **Codex 是后端逻辑权威，利用其逻辑推理和调试能力**
5. 如计划包含 `CODEX_SESSION`：优先使用 `resume <CODEX_SESSION>`

#### 路线 C：全栈 → 并行调用

1. **并行调用**（`run_in_background: true`）：
   - Gemini：处理前端部分
   - Codex：处理后端部分
2. 使用 `TaskOutput` 等待两个模型的完整结果
3. 各自使用计划中对应的 `SESSION_ID` 进行 `resume`（缺失则创建新会话）

**遵循上方 `多模型调用规范` 中的 `重要` 说明**

---

### 阶段 4：代码实现

`[Mode: Implement]`

**Claude 作为代码主权者执行以下步骤**：

1. **读取 Diff**：解析 Codex/Gemini 返回的 Unified Diff Patch

2. **心理沙盒**：
   - 模拟将 Diff 应用到目标文件
   - 检查逻辑一致性
   - 识别潜在冲突或副作用

3. **重构和清理**：
   - 将"脏原型"重构为 **高可读性、高可维护性、企业级代码**
   - 移除冗余代码
   - 确保符合项目现有代码标准
   - **非必要不生成注释/文档**，代码应自文档化

4. **最小范围**：
   - 变更仅限于需求范围
   - **强制审查** 副作用
   - 进行针对性修正

5. **应用变更**：
   - 使用 Edit/Write 工具执行实际修改
   - **仅修改必要代码**，绝不影响用户其他现有功能

6. **自我验证**（强烈推荐）：
   - 运行项目现有的 lint / typecheck / tests（优先最小相关范围）
   - 如失败：先修复回归，再进入阶段 5

---

### 阶段 5：审计和交付

`[Mode: Audit]`

#### 5.1 自动审计

**变更生效后，必须立即并行调用** Codex 和 Gemini 进行代码审查：

1. **Codex 审查**（`run_in_background: true`）：
   - ROLE_FILE：`~/.claude/.ccg/prompts/codex/reviewer.md`
   - 输入：变更 Diff + 目标文件
   - 重点：安全性、性能、错误处理、逻辑正确性

2. **Gemini 审查**（`run_in_background: true`）：
   - ROLE_FILE：`~/.claude/.ccg/prompts/gemini/reviewer.md`
   - 输入：变更 Diff + 目标文件
   - 重点：可访问性、设计一致性、用户体验

使用 `TaskOutput` 等待两个模型的完整审查结果。优先复用阶段 3 的会话（`resume <SESSION_ID>`）以保持上下文一致。

#### 5.2 整合和修复

1. 综合 Codex + Gemini 审查反馈
2. 按信任规则权衡：后端遵循 Codex，前端遵循 Gemini
3. 执行必要修复
4. 根据需要重复阶段 5.1（直到风险可接受）

#### 5.3 交付确认

审计通过后，向用户报告：

```markdown
## 执行完成

### 变更摘要
| 文件 | 操作 | 描述 |
|------|-----------|-------------|
| path/to/file.ts | 已修改 | 描述 |

### 审计结果
- Codex：<通过/发现 N 个问题>
- Gemini：<通过/发现 N 个问题>

### 建议
1. [ ] <建议的测试步骤>
2. [ ] <建议的验证步骤>
```

---

## 关键规则

1. **代码主权** — 所有文件修改由 Claude 执行，外部模型零写入权限
2. **脏原型重构** — Codex/Gemini 输出视为草稿，必须重构
3. **信任规则** — 后端遵循 Codex，前端遵循 Gemini
4. **最小变更** — 仅修改必要代码，无副作用
5. **强制审计** — 变更后必须执行多模型代码审查

---

## 用法

```bash
# 执行计划文件
/ccg:execute .claude/plan/feature-name.md

# 直接执行任务（用于已在上下文中讨论的计划）
/ccg:execute implement user authentication based on previous plan
```

---

## 与 /ccg:plan 的关系

1. `/ccg:plan` 生成计划 + SESSION_ID
2. 用户确认"Y"
3. `/ccg:execute` 读取计划，复用 SESSION_ID，执行实现
