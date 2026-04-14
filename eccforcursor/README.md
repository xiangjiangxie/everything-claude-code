# eccforcursor

**ECC for Cursor** — 从 [Everything Claude Code](https://github.com/affaan-m/everything-claude-code) 中提取的 **Cursor IDE 专用插件**。

提供一套完整的 AI 编码辅助工作流：自动化钩子、编码规则、AI 技能和智能体定义，让你在 Cursor 中获得生产级的开发体验。

## 功能概览

**与 Claude Code 完全对等的功能集：**

| 模块 | 数量 | 说明 |
|------|------|------|
| 自动化钩子 | 16 种事件 | 会话管理、Shell 拦截、文件编辑检查、MCP 审计、安全防护、质量门禁、治理捕获、桌面通知 |
| 编码规则 | 39 条 | 覆盖通用最佳实践 + Go / Kotlin / PHP / Python / Swift / TypeScript |
| AI 技能 | 135 个 | 完整技能库（TDD、安全审查、API设计、前端/后端模式、深度研究等） |
| 智能体 | 30 个 | 全部智能体（规划、架构、审查、TDD、安全、语言专用审查/构建修复等） |
| 命令 | 60 个 | 全部斜杠命令（/tdd、/plan、/e2e、/code-review 等） |
| MCP 配置 | 6 个服务器 | GitHub、Context7、Exa、Memory、Playwright、Sequential Thinking |
| 上下文 | 3 个 | 开发、研究、审查上下文模板 |

## 快速开始

### 方法一：直接复制（推荐）

```bash
# 克隆仓库
git clone https://github.com/affaan-m/everything-claude-code.git
cd everything-claude-code/eccforcursor

# 安装到你的项目
node install.js /path/to/your/project
```

### 方法二：手动复制

将 `eccforcursor/.cursor/` 目录复制到你的项目根目录即可。

### 验证安装

```bash
# 在你的项目目录下运行
node /path/to/eccforcursor/verify.js
```

## 项目结构

```
eccforcursor/
├── .cursor/                     # Cursor IDE 配置（核心）
│   ├── hooks.json               # 钩子事件配置（16 种事件）
│   ├── hooks/                   # 钩子实现脚本
│   │   ├── adapter.js           # Cursor → Claude Code 钩子适配器
│   │   ├── session-start.js     # 会话启动：加载上次会话上下文
│   │   ├── session-end.js       # 会话结束：保存会话状态
│   │   ├── before-shell-execution.js  # Shell 命令拦截
│   │   ├── after-shell-execution.js   # Shell 执行后分析
│   │   ├── after-file-edit.js   # 文件编辑后：自动格式化 + 类型检查
│   │   ├── before-mcp-execution.js    # MCP 调用审计
│   │   ├── after-mcp-execution.js     # MCP 结果记录
│   │   ├── before-read-file.js  # 敏感文件读取警告
│   │   ├── before-submit-prompt.js    # 提示词中的密钥检测
│   │   ├── subagent-start.js    # 子智能体启动日志
│   │   ├── subagent-stop.js     # 子智能体完成日志
│   │   ├── before-tab-file-read.js    # 阻止 Tab 读取敏感文件
│   │   ├── after-tab-file-edit.js     # Tab 编辑后格式化
│   │   ├── pre-compact.js       # 上下文压缩前保存状态
│   │   └── stop.js              # 停止时：console.log 审计 + 会话评估
│   ├── rules/                   # 编码规则（39 个 .md 文件）
│   │   ├── common-*.md          # 通用规则（编码风格、安全、测试等）
│   │   ├── golang-*.md          # Go 语言规则
│   │   ├── kotlin-*.md          # Kotlin 规则
│   │   ├── php-*.md             # PHP 规则
│   │   ├── python-*.md          # Python 规则
│   │   ├── swift-*.md           # Swift 规则
│   │   └── typescript-*.md      # TypeScript 规则
│   └── skills/                  # AI 技能定义
│       ├── article-writing/     # 文章和长文写作
│       ├── bun-runtime/         # Bun 运行时
│       ├── content-engine/      # 多平台内容引擎
│       ├── documentation-lookup/# 文档查询（Context7）
│       ├── frontend-slides/     # HTML 演示文稿制作
│       ├── investor-materials/  # 投资者材料
│       ├── investor-outreach/   # 投资者沟通
│       ├── market-research/     # 市场调研
│       ├── mcp-server-patterns/ # MCP 服务器开发
│       └── nextjs-turbopack/    # Next.js + Turbopack
├── scripts/                     # 运行时依赖脚本
│   ├── hooks/                   # 钩子核心逻辑
│   │   ├── session-start.js     # 会话启动核心（加载历史、检测项目）
│   │   ├── session-end.js       # 会话持久化（提取摘要、保存文件）
│   │   ├── post-edit-format.js  # 自动格式化（Biome/Prettier）
│   │   ├── post-edit-typecheck.js    # TypeScript 类型检查
│   │   ├── post-edit-console-warn.js # console.log 警告
│   │   ├── pre-compact.js       # 上下文压缩前保存
│   │   ├── check-console-log.js # 全局 console.log 检查
│   │   ├── evaluate-session.js  # 会话模式提取
│   │   ├── cost-tracker.js      # 使用成本追踪
│   │   ├── session-end-marker.js# 会话结束标记
│   │   └── check-hook-enabled.js# 钩子启用检查
│   └── lib/                     # 共享工具库
│       ├── utils.js             # 跨平台工具函数
│       ├── package-manager.js   # 包管理器检测
│       ├── project-detect.js    # 项目类型检测
│       ├── session-aliases.js   # 会话别名管理
│       ├── resolve-formatter.js # 格式化工具解析
│       ├── hook-flags.js        # 钩子开关控制
│       └── shell-split.js       # Shell 命令拆分
├── agents/                      # 全部智能体（30 个）
│   ├── planner.md               # 实现规划专家
│   ├── architect.md             # 系统架构师
│   ├── code-reviewer.md         # 代码审查专家
│   ├── tdd-guide.md             # TDD 引导专家
│   ├── security-reviewer.md     # 安全审查专家
│   ├── build-error-resolver.md  # 构建错误修复
│   ├── typescript-reviewer.md   # TypeScript 审查
│   ├── python-reviewer.md       # Python 审查
│   ├── e2e-runner.md            # E2E 测试运行
│   ├── refactor-cleaner.md      # 重构清理
│   ├── doc-updater.md           # 文档更新
│   ├── docs-lookup.md           # 文档查询
│   ├── database-reviewer.md     # 数据库审查
│   ├── go-reviewer.md           # Go 审查
│   ├── rust-reviewer.md         # Rust 审查
│   ├── java-reviewer.md         # Java 审查
│   ├── kotlin-reviewer.md       # Kotlin 审查
│   ├── cpp-reviewer.md          # C++ 审查
│   ├── flutter-reviewer.md      # Flutter 审查
│   ├── healthcare-reviewer.md   # 医疗合规审查
│   ├── *-build-resolver.md      # 各语言构建修复（Go/Rust/Java/Kotlin/C++/PyTorch）
│   ├── loop-operator.md         # 自主循环执行
│   ├── harness-optimizer.md     # Harness 配置优化
│   ├── chief-of-staff.md        # 通讯分发管理
│   └── performance-optimizer.md # 性能优化
├── commands/                    # 全部命令（60 个）
│   ├── tdd.md                   # TDD 工作流
│   ├── plan.md                  # 实现规划
│   ├── e2e.md                   # E2E 测试
│   ├── code-review.md           # 代码审查
│   ├── build-fix.md             # 构建修复
│   ├── learn.md                 # 模式提取
│   ├── skill-create.md          # 技能创建
│   └── ...                      # 更多命令
├── skills/                      # 完整技能库（135 个）
│   ├── tdd-workflow/            # TDD 工作流
│   ├── security-review/         # 安全审查
│   ├── api-design/              # API 设计
│   ├── frontend-patterns/       # 前端模式
│   ├── backend-patterns/        # 后端模式
│   ├── deep-research/           # 深度研究
│   ├── continuous-learning/     # 持续学习
│   └── ...                      # 更多技能
├── contexts/                    # 上下文模板（3 个）
│   ├── dev.md                   # 开发上下文
│   ├── research.md              # 研究上下文
│   └── review.md                # 审查上下文
├── .mcp.json                    # MCP 服务器配置
├── install.js                   # 一键安装脚本
├── verify.js                    # 安装验证脚本
├── package.json                 # 项目元数据
└── README.md                    # 本文件
```

## 钩子详解

### 钩子事件一览

| 事件 | 触发时机 | 功能 |
|------|----------|------|
| `sessionStart` | 会话启动 | 加载上次会话上下文、检测项目类型、报告包管理器 |
| `sessionEnd` | 会话结束 | 保存会话状态 |
| `beforeShellExecution` | Shell 执行前 | dev server 拦截、auto-tmux、tmux 提醒、git push 审查、提交质量检查、治理捕获、安全监控 |
| `afterShellExecution` | Shell 执行后 | PR URL 记录、构建完成通知、治理事件捕获 |
| `afterFileEdit` | 文件编辑后 | 自动格式化、TypeScript 类型检查、console.log 警告、质量门禁、压缩建议、配置保护、治理捕获 |
| `beforeFileWrite` | 文件写入前 | 文档文件警告、压缩建议、配置保护 |
| `beforeMCPExecution` | MCP 调用前 | MCP 调用审计日志 + 服务器健康检查 |
| `afterMCPExecution` | MCP 调用后 | MCP 结果记录 |
| `beforeReadFile` | 读文件前 | 敏感文件（.env / .key / .pem）读取警告 |
| `beforeSubmitPrompt` | 提交提示前 | 检测提示词中的 API 密钥、令牌等 |
| `subagentStart` | 子智能体启动 | 记录智能体启动信息 |
| `subagentStop` | 子智能体结束 | 记录智能体完成信息 |
| `beforeTabFileRead` | Tab 读文件前 | **阻止** Tab 读取敏感文件（exit 2） |
| `afterTabFileEdit` | Tab 编辑后 | 自动格式化 Tab 编辑的文件 |
| `preCompact` | 上下文压缩前 | 保存当前状态，防止压缩丢失信息 |
| `stop` | 响应结束 | console.log 审计、会话保存、模式评估、成本追踪、桌面通知 |

### 钩子配置

通过环境变量控制钩子行为：

```bash
# 设置钩子级别
export ECC_HOOK_PROFILE=standard  # minimal | standard | strict

# 禁用特定钩子
export ECC_DISABLED_HOOKS=pre:bash:dev-server-block,stop:cost-tracker
```

| 级别 | 说明 |
|------|------|
| `minimal` | 仅会话管理（启动/结束） |
| `standard` | 默认，包含格式化、类型检查、安全检查 |
| `strict` | 全部启用，包含 tmux 提醒、git push 审查 |

## 智能体详解（全部 30 个）

### 核心智能体

| 智能体 | 用途 | 自动触发场景 |
|--------|------|-------------|
| **planner** | 复杂功能规划 | 用户请求功能实现、架构变更 |
| **architect** | 系统设计和可扩展性 | 架构决策、系统设计 |
| **code-reviewer** | 代码质量审查 | 代码编写/修改后 |
| **tdd-guide** | 测试驱动开发 | 新功能、Bug 修复 |
| **security-reviewer** | 安全漏洞检测 | 处理用户输入、认证、API 端点 |
| **build-error-resolver** | 构建错误修复 | 构建失败 |
| **e2e-runner** | E2E Playwright 测试 | 关键用户流程 |
| **refactor-cleaner** | 死代码清理 | 代码维护 |
| **doc-updater** | 文档和代码地图更新 | 更新文档 |
| **docs-lookup** | API 文档查询 | 库/API 文档问题 |
| **loop-operator** | 自主循环执行 | 安全运行循环任务 |
| **chief-of-staff** | 通讯分发管理 | 多渠道通讯 |
| **harness-optimizer** | Harness 配置调优 | 可靠性、成本优化 |
| **performance-optimizer** | 性能优化 | 性能瓶颈分析 |

### 语言专用审查智能体

| 智能体 | 用途 |
|--------|------|
| **typescript-reviewer** | TypeScript/JavaScript 代码审查 |
| **python-reviewer** | Python 代码审查 |
| **go-reviewer** | Go 代码审查 |
| **rust-reviewer** | Rust 代码审查 |
| **java-reviewer** | Java/Spring Boot 代码审查 |
| **kotlin-reviewer** | Kotlin/Android/KMP 代码审查 |
| **cpp-reviewer** | C++ 代码审查 |
| **flutter-reviewer** | Flutter/Dart 代码审查 |
| **database-reviewer** | PostgreSQL/Supabase 审查 |
| **healthcare-reviewer** | 医疗合规代码审查 |

### 语言专用构建修复智能体

| 智能体 | 用途 |
|--------|------|
| **go-build-resolver** | Go 构建错误 |
| **rust-build-resolver** | Rust 构建错误 |
| **java-build-resolver** | Java/Maven/Gradle 构建错误 |
| **kotlin-build-resolver** | Kotlin/Gradle 构建错误 |
| **cpp-build-resolver** | C++ 构建错误 |
| **pytorch-build-resolver** | PyTorch/CUDA 运行时错误 |

## 编码规则

### 通用规则（9 条，始终生效）

- **编码风格** — 不可变性优先，小文件、小函数、早返回
- **安全** — 输入验证、密钥管理、注入防护
- **测试** — TDD、80%+ 覆盖率、边界测试
- **Git 工作流** — 约定式提交、PR 规范
- **性能** — 上下文管理、构建优化
- **智能体使用** — 何时委派给哪个智能体
- **开发流程** — 规划→TDD→审查→提交
- **模式** — API 响应格式、仓库模式
- **钩子** — 钩子系统使用指南

### 语言专用规则（按 glob 模式激活）

每种语言包含 3-5 条规则，覆盖编码风格、安全、测试、模式和钩子。

## 命令一览（60 个）

所有斜杠命令位于 `commands/` 目录，可在 Cursor 中通过规则或直接引用使用。

### 核心命令

| 命令 | 功能 |
|------|------|
| `/tdd` | 强制 TDD 工作流（先写测试再实现） |
| `/plan` | 生成实现计划 |
| `/e2e` | 生成并运行端到端测试 |
| `/code-review` | 代码质量审查 |
| `/build-fix` | 修复构建错误 |
| `/learn` | 从会话中提取模式 |
| `/skill-create` | 从 git 历史生成技能 |
| `/verify` | 验证实现完整性 |
| `/refactor-clean` | 重构和清理代码 |
| `/update-docs` | 更新文档 |

### 语言专用命令

| 命令类别 | 包含 |
|---------|------|
| Go | `/go-review`, `/go-build`, `/go-test` |
| Rust | `/rust-review`, `/rust-build`, `/rust-test` |
| Kotlin | `/kotlin-review`, `/kotlin-build`, `/kotlin-test` |
| C++ | `/cpp-review`, `/cpp-build`, `/cpp-test` |
| Python | `/python-review` |

### 工作流命令

| 命令 | 功能 |
|------|------|
| `/sessions` | 会话管理 |
| `/save-session` | 保存当前会话 |
| `/resume-session` | 恢复历史会话 |
| `/orchestrate` | 多工作树编排 |
| `/loop-start` | 启动自主循环 |
| `/loop-status` | 查看循环状态 |
| `/quality-gate` | 质量门禁检查 |
| `/test-coverage` | 测试覆盖率分析 |
| `/harness-audit` | Harness 配置审计 |

## MCP 服务器配置

安装后在 `.cursor/mcp.json` 中配置了 6 个 MCP 服务器：

| 服务器 | 功能 |
|--------|------|
| **github** | GitHub API 交互 |
| **context7** | 最新库/框架文档查询 |
| **exa** | 神经网络驱动的网络搜索 |
| **memory** | 持久化记忆存储 |
| **playwright** | 浏览器自动化测试 |
| **sequential-thinking** | 结构化思维链 |

## 系统要求

- **Node.js** >= 18
- **Cursor IDE**（支持 hooks.json 的版本）

## 注意事项

1. 安装后需要**重启 Cursor** 以加载新的钩子配置
2. 钩子脚本依赖 Node.js 运行时，确保系统 PATH 中有 `node`
3. 部分钩子（如自动格式化）需要项目中安装 Biome 或 Prettier
4. TypeScript 类型检查钩子需要项目中存在 `tsconfig.json`
5. 会话数据存储在 `~/.claude/session-data/` 目录中

## 来源

本项目基于 [Everything Claude Code (ECC)](https://github.com/affaan-m/everything-claude-code) v1.9.0，由社区维护。

## 许可证

MIT
