# 迁移指南：从 Claude Code 到 OpenCode

本指南帮助您在使用 Everything Claude Code (ECC) 配置的同时，从 Claude Code 迁移到 OpenCode。

## 概览

OpenCode 是一个用于 AI 辅助开发的替代 CLI，支持与 Claude Code **所有**相同的功能，但配置格式有所不同。

## 主要差异

| 功能 | Claude Code | OpenCode | 说明 |
|------|-------------|----------|------|
| 配置 | `CLAUDE.md`、`plugin.json` | `opencode.json` | 不同的文件格式 |
| 代理 | Markdown frontmatter | JSON 对象 | 完全一致 |
| 命令 | `commands/*.md` | `command` 对象或 `.md` 文件 | 完全一致 |
| 技能 | `skills/*/SKILL.md` | `instructions` 数组 | 作为上下文加载 |
| **钩子** | `hooks.json`（3 个阶段） | **插件系统（20+ 事件）** | **完全一致且更多！** |
| 规则 | `rules/*.md` | `instructions` 数组 | 合并或分开 |
| MCP | 完全支持 | 完全支持 | 完全一致 |

## 钩子迁移

**OpenCode 通过其插件系统完全支持钩子**，实际上比 Claude Code 更强大，支持 20 多种事件类型。

### 钩子事件映射

| Claude Code 钩子 | OpenCode 插件事件 | 说明 |
|------------------|-------------------|------|
| `PreToolUse` | `tool.execute.before` | 可修改工具输入 |
| `PostToolUse` | `tool.execute.after` | 可修改工具输出 |
| `Stop` | `session.idle` 或 `session.status` | 会话生命周期 |
| `SessionStart` | `session.created` | 会话开始 |
| `SessionEnd` | `session.deleted` | 会话结束 |
| 不适用 | `file.edited` | OpenCode 独有：文件变更 |
| 不适用 | `file.watcher.updated` | OpenCode 独有：文件系统监听 |
| 不适用 | `message.updated` | OpenCode 独有：消息变更 |
| 不适用 | `lsp.client.diagnostics` | OpenCode 独有：LSP 集成 |
| 不适用 | `tui.toast.show` | OpenCode 独有：通知 |

### 将钩子转换为插件

**Claude Code 钩子 (hooks.json)：**
```json
{
  "PostToolUse": [{
    "matcher": "tool == \"Edit\" && tool_input.file_path matches \"\\\\.(ts|tsx|js|jsx)$\"",
    "hooks": [{
      "type": "command",
      "command": "prettier --write \"$file_path\""
    }]
  }]
}
```

**OpenCode 插件 (.opencode/plugins/prettier-hook.ts)：**
```typescript
export const PrettierPlugin = async ({ $ }) => {
  return {
    "file.edited": async (event) => {
      if (event.path.match(/\.(ts|tsx|js|jsx)$/)) {
        await $`prettier --write ${event.path}`
      }
    }
  }
}
```

### ECC 包含的插件钩子

ECC OpenCode 配置包含以下已转换的钩子：

| 钩子 | OpenCode 事件 | 用途 |
|------|---------------|------|
| Prettier 自动格式化 | `file.edited` | 编辑后格式化 JS/TS 文件 |
| TypeScript 检查 | `tool.execute.after` | 编辑 .ts 文件后运行 tsc |
| console.log 警告 | `file.edited` | 警告 console.log 语句 |
| 会话通知 | `session.idle` | 任务完成时通知 |
| 安全检查 | `tool.execute.before` | 提交前检查密钥泄露 |

## 迁移步骤

### 1. 安装 OpenCode

```bash
# 安装 OpenCode CLI
npm install -g opencode
# 或
curl -fsSL https://opencode.ai/install | bash
```

### 2. 使用 ECC OpenCode 配置

本仓库中的 `.opencode/` 目录包含已转换的配置：

```
.opencode/
├── opencode.json              # 主配置
├── plugins/                   # 钩子插件（从 hooks.json 转换）
│   ├── ecc-hooks.ts           # 所有 ECC 钩子作为插件
│   └── index.ts               # 插件导出
├── tools/                     # 自定义工具
│   ├── run-tests.ts           # 运行测试套件
│   ├── check-coverage.ts      # 检查覆盖率
│   └── security-audit.ts      # npm audit 封装
├── commands/                  # 全部 23 个命令（markdown）
│   ├── plan.md
│   ├── tdd.md
│   └── ...（另外 21 个）
├── prompts/
│   └── agents/                # 代理提示文件（12 个）
├── instructions/
│   └── INSTRUCTIONS.md        # 合并的规则
├── package.json               # 用于 npm 发布
├── tsconfig.json              # TypeScript 配置
└── MIGRATION.md               # 本文件
```

### 3. 运行 OpenCode

```bash
# 在仓库根目录
opencode

# 配置将从 .opencode/opencode.json 自动检测
```

## 概念映射

### 代理

**Claude Code：**
```markdown
---
name: planner
description: Expert planning specialist...
tools: ["Read", "Grep", "Glob"]
model: opus
---

You are an expert planning specialist...
```

**OpenCode：**
```json
{
  "agent": {
    "planner": {
      "description": "Expert planning specialist...",
      "mode": "subagent",
      "model": "anthropic/claude-opus-4-5",
      "prompt": "{file:prompts/agents/planner.txt}",
      "tools": { "read": true, "bash": true }
    }
  }
}
```

### 命令

**Claude Code：**
```markdown
---
name: plan
description: Create implementation plan
---

Create a detailed implementation plan for: {input}
```

**OpenCode (JSON)：**
```json
{
  "command": {
    "plan": {
      "description": "Create implementation plan",
      "template": "Create a detailed implementation plan for: $ARGUMENTS",
      "agent": "planner"
    }
  }
}
```

**OpenCode (Markdown - .opencode/commands/plan.md)：**
```markdown
---
description: Create implementation plan
agent: planner
---

Create a detailed implementation plan for: $ARGUMENTS
```

### 技能

**Claude Code：** 技能从 `skills/*/SKILL.md` 文件加载。

**OpenCode：** 技能添加到 `instructions` 数组中：
```json
{
  "instructions": [
    "skills/tdd-workflow/SKILL.md",
    "skills/security-review/SKILL.md",
    "skills/coding-standards/SKILL.md"
  ]
}
```

### 规则

**Claude Code：** 规则在独立的 `rules/*.md` 文件中。

**OpenCode：** 规则可以合并到 `instructions` 中，或保持独立：
```json
{
  "instructions": [
    "instructions/INSTRUCTIONS.md",
    "rules/common/security.md",
    "rules/common/coding-style.md"
  ]
}
```

## 模型映射

| Claude Code | OpenCode |
|-------------|----------|
| `opus` | `anthropic/claude-opus-4-5` |
| `sonnet` | `anthropic/claude-sonnet-4-5` |
| `haiku` | `anthropic/claude-haiku-4-5` |

## 可用命令

迁移后，全部 23 个命令均可使用：

| 命令 | 描述 |
|------|------|
| `/plan` | 创建实现计划 |
| `/tdd` | 执行 TDD 工作流 |
| `/code-review` | 审查代码变更 |
| `/security` | 运行安全审查 |
| `/build-fix` | 修复构建错误 |
| `/e2e` | 生成 E2E 测试 |
| `/refactor-clean` | 移除死代码 |
| `/orchestrate` | 多代理工作流 |
| `/learn` | 会话中提取模式 |
| `/checkpoint` | 保存验证状态 |
| `/verify` | 运行验证循环 |
| `/eval` | 运行评估 |
| `/update-docs` | 更新文档 |
| `/update-codemaps` | 更新代码地图 |
| `/test-coverage` | 检查测试覆盖率 |
| `/setup-pm` | 配置包管理器 |
| `/go-review` | Go 代码审查 |
| `/go-test` | Go TDD 工作流 |
| `/go-build` | 修复 Go 构建错误 |
| `/skill-create` | 从 git 历史生成技能 |
| `/instinct-status` | 查看已学习的直觉模式 |
| `/instinct-import` | 导入直觉模式 |
| `/instinct-export` | 导出直觉模式 |
| `/evolve` | 将直觉模式聚类为技能 |
| `/promote` | 将项目直觉模式提升为全局范围 |
| `/projects` | 列出已知项目和直觉模式统计 |

## 可用代理

| 代理 | 描述 |
|------|------|
| `planner` | 实现规划 |
| `architect` | 系统设计 |
| `code-reviewer` | 代码审查 |
| `security-reviewer` | 安全分析 |
| `tdd-guide` | 测试驱动开发 |
| `build-error-resolver` | 修复构建错误 |
| `e2e-runner` | E2E 测试 |
| `doc-updater` | 文档更新 |
| `refactor-cleaner` | 死代码清理 |
| `go-reviewer` | Go 代码审查 |
| `go-build-resolver` | Go 构建错误 |
| `database-reviewer` | 数据库优化 |

## 插件安装

### 方式一：直接使用 ECC 配置

`.opencode/` 目录包含所有预配置内容。

### 方式二：作为 npm 包安装

```bash
npm install ecc-universal
```

然后在您的 `opencode.json` 中：
```json
{
  "plugin": ["ecc-universal"]
}
```

这仅加载已发布的 ECC OpenCode 插件模块（钩子/事件和导出的插件工具）。
它**不会**自动将 ECC 的完整 `agent`、`command` 或 `instructions` 配置注入到您的项目中。

如果您需要完整的 ECC OpenCode 工作流功能，请使用仓库中附带的 `.opencode/opencode.json` 作为基础配置，或将以下内容复制到您的项目中：
- `.opencode/commands/`
- `.opencode/prompts/`
- `.opencode/instructions/INSTRUCTIONS.md`
- `.opencode/opencode.json` 中的 `agent` 和 `command` 部分

## 故障排查

### 配置未加载

1. 确认仓库根目录中存在 `.opencode/opencode.json`
2. 检查 JSON 语法是否有效：`cat .opencode/opencode.json | jq .`
3. 确保所有引用的提示文件存在

### 插件未加载

1. 确认 `.opencode/plugins/` 中存在插件文件
2. 检查 TypeScript 语法是否有效
3. 确保 `opencode.json` 中的 `plugin` 数组包含正确路径

### 找不到代理

1. 检查代理是否在 `opencode.json` 的 `agent` 对象中定义
2. 确认提示文件路径正确
3. 确保提示文件存在于指定路径

### 命令不工作

1. 确认命令是否在 `opencode.json` 中定义，或作为 `.md` 文件存在于 `.opencode/commands/` 中
2. 检查引用的代理是否存在
3. 确保模板使用 `$ARGUMENTS` 接收用户输入
4. 如果仅安装了 `plugin: ["ecc-universal"]`，请注意 npm 插件安装不会自动将 ECC 命令或代理添加到您的项目配置中

## 最佳实践

1. **全新开始**：不要同时运行 Claude Code 和 OpenCode
2. **检查配置**：确认 `opencode.json` 加载无错误
3. **测试命令**：逐一运行每个命令以验证其是否正常工作
4. **使用插件**：利用插件钩子实现自动化
5. **使用代理**：根据其预设用途使用专业代理

## 回退到 Claude Code

如果需要切换回去：

1. 只需运行 `claude` 而非 `opencode`
2. Claude Code 将使用其自身的配置（`CLAUDE.md`、`plugin.json` 等）
3. `.opencode/` 目录不会干扰 Claude Code

## 功能一致性总结

| 功能 | Claude Code | OpenCode | 状态 |
|------|-------------|----------|------|
| 代理 | ✅ 12 个代理 | ✅ 12 个代理 | **完全一致** |
| 命令 | ✅ 23 个命令 | ✅ 23 个命令 | **完全一致** |
| 技能 | ✅ 16 个技能 | ✅ 16 个技能 | **完全一致** |
| 钩子 | ✅ 3 个阶段 | ✅ 20+ 事件 | **OpenCode 更多** |
| 规则 | ✅ 8 条规则 | ✅ 8 条规则 | **完全一致** |
| MCP 服务器 | ✅ 完全支持 | ✅ 完全支持 | **完全一致** |
| 自定义工具 | ✅ 通过钩子 | ✅ 原生支持 | **OpenCode 更优** |

## 反馈

如有以下方面的问题：
- **OpenCode CLI**：请向 OpenCode 的 issue 跟踪器报告
- **ECC 配置**：请向 [github.com/affaan-m/everything-claude-code](https://github.com/affaan-m/everything-claude-code) 报告
