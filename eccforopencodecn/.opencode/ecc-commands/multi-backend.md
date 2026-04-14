# 后端 - 后端专注开发

后端专注工作流（研究 → 构思 → 计划 → 执行 → 优化 → 审查），由 Codex 主导。

## 用法

```bash
/backend <后端任务描述>
```

## 上下文

- 后端任务：$ARGUMENTS
- Codex 主导，Gemini 辅助参考
- 适用于：API 设计、算法实现、数据库优化、业务逻辑

## 你的角色

你是**后端编排器**，协调多模型协作进行服务端任务（研究 → 构思 → 计划 → 执行 → 优化 → 审查）。

**协作模型**：
- **Codex** — 后端逻辑、算法（**后端权威，可信赖**）
- **Gemini** — 前端视角（**后端意见仅供参考**）
- **Claude（自身）** — 编排、规划、执行、交付

---

## 多模型调用规范

**调用语法**：

```
# 新会话调用
Bash({
  command: "~/.claude/bin/codeagent-wrapper {{LITE_MODE_FLAG}}--backend codex - \"$PWD\" <<'EOF'
ROLE_FILE: <角色提示词路径>
<TASK>
Requirement: <增强后的需求（或未增强时的 $ARGUMENTS）>
Context: <项目上下文和前几阶段的分析>
</TASK>
OUTPUT: 预期输出格式
EOF",
  run_in_background: false,
  timeout: 3600000,
  description: "简要描述"
})

# 恢复会话调用
Bash({
  command: "~/.claude/bin/codeagent-wrapper {{LITE_MODE_FLAG}}--backend codex resume <SESSION_ID> - \"$PWD\" <<'EOF'
ROLE_FILE: <角色提示词路径>
<TASK>
Requirement: <增强后的需求（或未增强时的 $ARGUMENTS）>
Context: <项目上下文和前几阶段的分析>
</TASK>
OUTPUT: 预期输出格式
EOF",
  run_in_background: false,
  timeout: 3600000,
  description: "简要描述"
})
```

**角色提示词**：

| 阶段 | Codex |
|------|-------|
| 分析 | `~/.claude/.ccg/prompts/codex/analyzer.md` |
| 规划 | `~/.claude/.ccg/prompts/codex/architect.md` |
| 审查 | `~/.claude/.ccg/prompts/codex/reviewer.md` |

**会话复用**：每次调用返回 `SESSION_ID: xxx`，后续阶段使用 `resume xxx`。在阶段 2 保存 `CODEX_SESSION`，在阶段 3 和 5 使用 `resume`。

---

## 沟通指南

1. 回复以模式标签 `[模式：X]` 开头，初始为 `[模式：研究]`
2. 严格遵循顺序：`研究 → 构思 → 计划 → 执行 → 优化 → 审查`
3. 需要用户交互时使用 `AskUserQuestion` 工具（例如确认/选择/批准）

---

## 核心工作流

### 阶段 0：提示词增强（可选）

`[模式：准备]` - 如果 ace-tool MCP 可用，调用 `mcp__ace-tool__enhance_prompt`，**将原始 $ARGUMENTS 替换为增强后的结果用于后续 Codex 调用**。如不可用，按原样使用 `$ARGUMENTS`。

### 阶段 1：研究

`[模式：研究]` - 理解需求并收集上下文

1. **代码检索**（如果 ace-tool MCP 可用）：调用 `mcp__ace-tool__search_context` 检索现有 API、数据模型、服务架构。如不可用，使用内置工具：`Glob` 发现文件，`Grep` 搜索符号/API，`Read` 收集上下文，`Task`（Explore 代理）进行深入探索。
2. 需求完整度评分（0-10）：>=7 继续，<7 停止并补充

### 阶段 2：构思

`[模式：构思]` - Codex 主导分析

**必须调用 Codex**（遵循上述调用规范）：
- ROLE_FILE：`~/.claude/.ccg/prompts/codex/analyzer.md`
- Requirement：增强后的需求（或未增强时的 $ARGUMENTS）
- Context：阶段 1 的项目上下文
- OUTPUT：技术可行性分析、推荐方案（至少 2 个）、风险评估

**保存 SESSION_ID**（`CODEX_SESSION`）用于后续阶段复用。

输出方案（至少 2 个），等待用户选择。

### 阶段 3：规划

`[模式：计划]` - Codex 主导规划

**必须调用 Codex**（使用 `resume <CODEX_SESSION>` 复用会话）：
- ROLE_FILE：`~/.claude/.ccg/prompts/codex/architect.md`
- Requirement：用户选择的方案
- Context：阶段 2 的分析结果
- OUTPUT：文件结构、函数/类设计、依赖关系

Claude 综合计划，用户批准后保存到 `.claude/plan/task-name.md`。

### 阶段 4：实现

`[模式：执行]` - 代码开发

- 严格遵循批准的计划
- 遵循现有项目代码标准
- 确保错误处理、安全性、性能优化

### 阶段 5：优化

`[模式：优化]` - Codex 主导审查

**必须调用 Codex**（遵循上述调用规范）：
- ROLE_FILE：`~/.claude/.ccg/prompts/codex/reviewer.md`
- Requirement：审查以下后端代码变更
- Context：git diff 或代码内容
- OUTPUT：安全性、性能、错误处理、API 合规性问题列表

整合审查反馈，用户确认后执行优化。

### 阶段 6：质量审查

`[模式：审查]` - 最终评估

- 对照计划检查完成情况
- 运行测试验证功能
- 报告问题和建议

---

## 关键规则

1. **Codex 的后端意见可信赖**
2. **Gemini 的后端意见仅供参考**
3. 外部模型拥有**零文件系统写入权限**
4. Claude 处理所有代码编写和文件操作
