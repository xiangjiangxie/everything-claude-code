# OpenCode ECC 插件

> ⚠️ 本 README 专用于 OpenCode 使用场景。  
> 如果您通过 npm 安装了 ECC（例如 `npm install opencode-ecc`），请参阅根目录的 README。

Everything Claude Code (ECC) 的 OpenCode 插件——代理、命令、钩子和技能。

## 安装

## 安装概览

使用 Everything Claude Code (ECC) 有两种方式：

1. **npm 包（推荐大多数用户使用）**  
   通过 npm/bun/yarn 安装，并使用 `ecc-install` CLI 来设置规则和代理。

2. **直接克隆 / 插件模式**  
   克隆仓库并直接在其中运行 OpenCode。

请根据您的工作流选择以下对应方式。

### 方式一：npm 包

```bash
npm install ecc-universal
```

添加到您的 `opencode.json`：

```json
{
  "plugin": ["ecc-universal"]
}
```

这将从 npm 加载 ECC OpenCode 插件模块：
- 钩子/事件集成
- 插件导出的自定义工具包

这**不会**自动在您的项目配置中注册完整的 ECC 命令/代理/指令目录。如需完整的 OpenCode 配置，请选择以下方式：
- 在本仓库内运行 OpenCode，或
- 将相关的 `.opencode/commands/`、`.opencode/prompts/`、`.opencode/instructions/` 以及 `instructions`、`agent` 和 `command` 配置项复制到您自己的项目中

安装后，`ecc-install` CLI 也可使用：

```bash
npx ecc-install typescript
```

### 方式二：直接使用

克隆仓库并运行 OpenCode：

```bash
git clone https://github.com/affaan-m/everything-claude-code
cd everything-claude-code
opencode
```

## 功能

### 代理（12 个）

| 代理 | 描述 |
|------|------|
| planner | 实现规划 |
| architect | 系统设计 |
| code-reviewer | 代码审查 |
| security-reviewer | 安全分析 |
| tdd-guide | 测试驱动开发 |
| build-error-resolver | 构建错误修复 |
| e2e-runner | E2E 测试 |
| doc-updater | 文档更新 |
| refactor-cleaner | 死代码清理 |
| go-reviewer | Go 代码审查 |
| go-build-resolver | Go 构建错误 |
| database-reviewer | 数据库优化 |

### 命令（31 个）

| 命令 | 描述 |
|------|------|
| `/plan` | 创建实现计划 |
| `/tdd` | TDD 工作流 |
| `/code-review` | 审查代码变更 |
| `/security` | 安全审查 |
| `/build-fix` | 修复构建错误 |
| `/e2e` | E2E 测试 |
| `/refactor-clean` | 移除死代码 |
| `/orchestrate` | 多代理工作流 |
| `/learn` | 提取模式 |
| `/checkpoint` | 保存进度 |
| `/verify` | 验证循环 |
| `/eval` | 评估 |
| `/update-docs` | 更新文档 |
| `/update-codemaps` | 更新代码地图 |
| `/test-coverage` | 覆盖率分析 |
| `/setup-pm` | 包管理器 |
| `/go-review` | Go 代码审查 |
| `/go-test` | Go TDD |
| `/go-build` | Go 构建修复 |
| `/skill-create` | 生成技能 |
| `/instinct-status` | 查看直觉模式 |
| `/instinct-import` | 导入直觉模式 |
| `/instinct-export` | 导出直觉模式 |
| `/evolve` | 聚类直觉模式 |
| `/promote` | 提升项目直觉模式 |
| `/projects` | 列出已知项目 |
| `/harness-audit` | 审计 harness 可靠性和 eval 就绪状态 |
| `/loop-start` | 启动受控的代理循环 |
| `/loop-status` | 检查循环状态和检查点 |
| `/quality-gate` | 对文件/仓库范围运行质量门禁 |
| `/model-route` | 按模型和预算路由任务 |

### 插件钩子

| 钩子 | 事件 | 用途 |
|------|------|------|
| Prettier | `file.edited` | 自动格式化 JS/TS |
| TypeScript | `tool.execute.after` | 检查类型错误 |
| console.log | `file.edited` | 警告调试语句 |
| Notification | `session.idle` | 桌面通知 |
| Security | `tool.execute.before` | 检查密钥泄露 |

### 自定义工具

| 工具 | 描述 |
|------|------|
| run-tests | 带选项运行测试套件 |
| check-coverage | 分析测试覆盖率 |
| security-audit | 安全漏洞扫描 |

## 钩子事件映射

OpenCode 的插件系统与 Claude Code 钩子的映射关系：

| Claude Code | OpenCode |
|-------------|----------|
| PreToolUse | `tool.execute.before` |
| PostToolUse | `tool.execute.after` |
| Stop | `session.idle` |
| SessionStart | `session.created` |
| SessionEnd | `session.deleted` |

OpenCode 拥有 20 多个 Claude Code 中不可用的额外事件。

### 钩子运行时控制

OpenCode 插件钩子支持与 Claude Code/Cursor 相同的运行时控制：

```bash
export ECC_HOOK_PROFILE=standard
export ECC_DISABLED_HOOKS="pre:bash:tmux-reminder,post:edit:typecheck"
```

- `ECC_HOOK_PROFILE`：`minimal`、`standard`（默认）、`strict`
- `ECC_DISABLED_HOOKS`：以逗号分隔的要禁用的钩子 ID

## 技能

默认的 OpenCode 配置通过 `instructions` 数组加载 11 个精选的 ECC 技能：

- coding-standards
- backend-patterns
- frontend-patterns
- frontend-slides
- security-review
- tdd-workflow
- strategic-compact
- eval-harness
- verification-loop
- api-design
- e2e-testing

`skills/` 中还附带了额外的专业技能，但默认不加载，以保持 OpenCode 会话的精简：

- article-writing
- content-engine
- market-research
- investor-materials
- investor-outreach

## 配置

完整配置在 `opencode.json` 中：

```json
{
  "$schema": "https://opencode.ai/config.json",
  "model": "anthropic/claude-sonnet-4-5",
  "small_model": "anthropic/claude-haiku-4-5",
  "plugin": ["./plugins"],
  "instructions": [
    "skills/tdd-workflow/SKILL.md",
    "skills/security-review/SKILL.md"
  ],
  "agent": { /* 12 个代理 */ },
  "command": { /* 24 个命令 */ }
}
```

## 许可证

MIT
