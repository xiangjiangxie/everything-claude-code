# eccforopencode

**ECC for OpenCode** — 从 [Everything Claude Code](https://github.com/affaan-m/everything-claude-code) 中提取的 **OpenCode 专用插件**。

提供一套完整的 AI 编码辅助工作流：TypeScript 插件钩子、智能体、命令、技能、编码规则和自定义工具，让你在 OpenCode 中获得与 Claude Code 对等的开发体验。

## 功能概览

**与 Claude Code 完全对等的功能集：**

| 模块 | 数量 | 说明 |
|------|------|------|
| TypeScript 插件钩子 | 1 个插件 | 文件编辑后格式化/类型检查、会话管理、安全审查等 |
| 自定义工具 | 6 个 | 代码格式化、测试运行、lint、安全审计、git 摘要、覆盖率 |
| OpenCode 智能体 | 13 个 | 在 opencode.json 中配置，含构建、规划、审查、TDD 等 |
| OpenCode 命令 | 34 个 | 在 opencode.json 和 commands/ 中定义 |
| ECC 完整智能体 | 30 个 | Markdown 定义，覆盖全部语言和领域 |
| ECC 完整命令 | 60 个 | 全部斜杠命令 |
| ECC 完整技能 | 135 个 | TDD、安全审查、API 设计、深度研究等 |
| 编码规则 | 77 条 | 通用 + 多语言（按目录分类） |
| MCP 配置 | 6 个服务器 | GitHub、Context7、Exa、Memory、Playwright、Sequential Thinking |
| 上下文模板 | 3 个 | 开发、研究、审查 |

## 快速开始

### 方法一：直接复制（推荐，最简单）

```bash
# 克隆仓库
git clone https://github.com/affaan-m/everything-claude-code.git
cd everything-claude-code/eccforopencode

# 直接复制到你的项目（.opencode/ 完全自包含）
cp -r .opencode/ /path/to/your/project/.opencode/

# 安装依赖并编译插件
cd /path/to/your/project/.opencode
npm install
npx tsc
```

### 方法二：使用安装脚本

```bash
node install.js /path/to/your/project
cd /path/to/your/project/.opencode && npm install && npx tsc
```

### 验证安装

```bash
node verify.js /path/to/your/project
```

## 项目结构

```
eccforopencode/
├── .opencode/                        # OpenCode 配置（完全自包含）
│   ├── opencode.json                 # 主配置：智能体、命令、模型、指令
│   ├── package.json                  # NPM 包配置（@opencode-ai/plugin 依赖）
│   ├── tsconfig.json                 # TypeScript 编译配置
│   ├── index.ts                      # 包入口
│   ├── mcp.json                      # MCP 服务器配置
│   ├── README.md                     # OpenCode 原始文档
│   ├── MIGRATION.md                  # Claude Code → OpenCode 迁移指南
│   │
│   ├── plugins/                      # TypeScript 插件（钩子系统）
│   │   ├── index.ts                  # 插件导出
│   │   └── ecc-hooks.ts             # ECC 钩子实现（文件编辑、会话管理等）
│   │
│   ├── tools/                        # 自定义工具
│   │   ├── index.ts                  # 工具导出
│   │   ├── format-code.ts           # 代码格式化（Biome/Prettier）
│   │   ├── run-tests.ts             # 测试运行
│   │   ├── lint-check.ts            # Lint 检查
│   │   ├── security-audit.ts        # 安全审计
│   │   ├── check-coverage.ts        # 覆盖率检查
│   │   └── git-summary.ts           # Git 变更摘要
│   │
│   ├── instructions/                 # 指令/规则
│   │   └── INSTRUCTIONS.md          # 综合编码规则
│   │
│   ├── commands/                     # OpenCode 原生命令（34 个）
│   │   ├── plan.md, tdd.md, ...
│   │   └── ...
│   │
│   ├── prompts/agents/               # 智能体提示词（14 个）
│   │   ├── planner.txt, code-reviewer.txt, ...
│   │   └── ...
│   │
│   ├── ecc-agents/                   # ECC 完整智能体（30 个）
│   ├── ecc-commands/                 # ECC 完整命令（60 个）
│   ├── ecc-skills/                   # ECC 完整技能库（135 个）
│   ├── ecc-rules/                    # ECC 编码规则（77 条）
│   ├── ecc-scripts/                  # 运行时脚本（钩子核心 + 工具库 + CLI）
│   └── ecc-contexts/                 # 上下文模板（3 个）
│
├── install.js                        # 一键安装脚本
├── verify.js                         # 安装验证脚本
├── package.json                      # 项目元数据
└── README.md                         # 本文件
```

## 钩子系统（TypeScript 插件）

OpenCode 使用 `@opencode-ai/plugin` API 实现钩子，而非 hooks.json。
钩子实现在 `.opencode/plugins/ecc-hooks.ts` 中。

### 支持的事件

| 事件 | 功能 |
|------|------|
| `file.edited` | 自动格式化（Biome/Prettier）、TypeScript 类型检查 |
| `session.created` | 加载上次会话上下文、检测项目类型 |
| `session.idle` | 会话空闲时保存状态 |
| `session.deleted` | 会话结束标记 |
| `tool.execute.before` | 工具执行前安全检查 |
| `tool.execute.after` | 工具执行后分析 |
| `shell.env` | 注入环境变量 |
| `permission.ask` | 权限请求审计 |
| `experimental.session.compacting` | 上下文压缩前保存状态 |

### 钩子配置

```bash
# 设置钩子级别
export ECC_HOOK_PROFILE=standard  # minimal | standard | strict

# 禁用特定钩子
export ECC_DISABLED_HOOKS=cost-tracker,desktop-notify
```

## 智能体详解

### OpenCode 原生智能体（opencode.json 配置）

| 智能体 | 模式 | 用途 |
|--------|------|------|
| **build** | primary | 主要编码智能体 |
| **planner** | subagent | 复杂功能规划 |
| **architect** | subagent | 系统架构设计 |
| **code-reviewer** | subagent | 代码质量审查 |
| **security-reviewer** | subagent | 安全漏洞检测 |
| **tdd-guide** | subagent | 测试驱动开发 |
| **build-error-resolver** | subagent | 构建错误修复 |
| **e2e-runner** | subagent | E2E 测试运行 |
| **doc-updater** | subagent | 文档更新 |
| **refactor-cleaner** | subagent | 代码重构清理 |
| **go-reviewer** | subagent | Go 代码审查 |
| **go-build-resolver** | subagent | Go 构建修复 |
| **database-reviewer** | subagent | 数据库审查 |

### ECC 完整智能体（30 个 Markdown 定义）

包含 OpenCode 原生的 13 个之外的所有语言专用审查器和构建修复器：
TypeScript、Python、Rust、Java、Kotlin、C++、Flutter、PyTorch 等。

## 自定义工具

| 工具 | 功能 |
|------|------|
| `format-code` | 自动检测并运行 Biome 或 Prettier |
| `run-tests` | 自动检测并运行项目测试框架 |
| `lint-check` | 运行 ESLint/Biome lint 检查 |
| `security-audit` | 运行 npm audit / yarn audit |
| `check-coverage` | 检查测试覆盖率 |
| `git-summary` | 生成 git 变更摘要 |

## 与 Claude Code 的对应关系

| Claude Code | OpenCode |
|-------------|----------|
| `hooks/hooks.json` | `plugins/ecc-hooks.ts`（TypeScript 插件） |
| `agents/*.md` | `opencode.json` 中的 `agent` + `prompts/agents/*.txt` |
| `commands/*.md` | `opencode.json` 中的 `command` + `commands/*.md` |
| `skills/*/SKILL.md` | `instructions[]` 引用 + `ecc-skills/` 完整库 |
| `rules/**/*.md` | `instructions/INSTRUCTIONS.md` + `ecc-rules/` |
| `.mcp.json` | `mcp.json` |
| `ECC_HOOK_PROFILE` | 相同环境变量 |
| `ECC_DISABLED_HOOKS` | 相同环境变量 |

## 系统要求

- **Node.js** >= 18
- **OpenCode** CLI
- **TypeScript** (通过 npx tsc 编译插件)

## 安装后步骤

```bash
# 1. 进入 .opencode 目录
cd /your/project/.opencode

# 2. 安装依赖
npm install

# 3. 编译 TypeScript 插件
npx tsc

# 4. 启动 OpenCode
opencode
```

## 来源

本项目基于 [Everything Claude Code (ECC)](https://github.com/affaan-m/everything-claude-code) v1.9.0，由社区维护。

## 许可证

MIT
