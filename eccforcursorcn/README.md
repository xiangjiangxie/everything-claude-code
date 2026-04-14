# eccforcursorcn

**ECC for Cursor 中文版** — 从 [Everything Claude Code](https://github.com/affaan-m/everything-claude-code) 中提取的 **Cursor IDE 专用中文插件**。

所有规则、智能体、命令、技能均已翻译为中文，专为中文开发者打造。

## 与英文版的区别

| 内容 | 英文版 (eccforcursor) | 中文版 (eccforcursorcn) |
|------|----------------------|------------------------|
| 39 条编码规则 | 英文 | ✅ 中文 |
| 30 个智能体 | 英文 | ✅ 中文 |
| 60 个斜杠命令 | 英文 | ✅ 中文 |
| 10 个精选技能 | 英文 | ✅ 中文 |
| 3 个上下文模板 | 英文 | ✅ 中文 |
| 钩子消息输出 | 英文 | ✅ 中文 |
| hooks.json 描述 | 中文 | ✅ 中文 |
| 135 个完整技能库 | 英文 | 英文（AI 参考用，无需翻译） |
| 运行时脚本 | 不变 | 不变 |

## 功能概览

**与 Claude Code 完全对等的功能集：**

| 模块 | 数量 | 说明 |
|------|------|------|
| 自动化钩子 | 16 种事件 | 会话管理、Shell 拦截、文件编辑检查、MCP 审计、安全防护、质量门禁 |
| 编码规则 | 39 条 | 通用最佳实践 + Go / Kotlin / PHP / Python / Swift / TypeScript |
| AI 技能 | 135 个 | 完整技能库（TDD、安全审查、API设计、前端/后端模式等） |
| 智能体 | 30 个 | 全部智能体（规划、架构、审查、TDD、安全、语言专用等） |
| 命令 | 60 个 | 全部斜杠命令（/tdd、/plan、/e2e、/code-review 等） |
| MCP 配置 | 6 个服务器 | GitHub、Context7、Exa、Memory、Playwright、Sequential Thinking |
| 上下文 | 3 个 | 开发、研究、审查上下文模板 |

## 快速开始

### 方法一：直接复制（推荐，最简单）

```bash
# 克隆仓库
git clone https://github.com/affaan-m/everything-claude-code.git
cd everything-claude-code/eccforcursorcn

# 直接复制到你的项目
cp -r .cursor/ /你的项目路径/.cursor/
```

`.cursor/` 目录完全自包含，包含全部功能，无需外部依赖。

### 方法二：使用安装脚本

```bash
node install.js /你的项目路径
```

### 验证安装

```bash
node verify.js /你的项目路径
```

## 项目结构

```
eccforcursorcn/
├── .cursor/                     # Cursor IDE 配置（完全自包含，全中文）
│   ├── hooks.json               # 钩子事件配置（16 种事件，中文描述）
│   ├── mcp.json                 # MCP 服务器配置（6 个服务器）
│   ├── hooks/                   # 钩子适配脚本（23 个，中文输出）
│   ├── rules/                   # 编码规则（39 条，全中文）
│   ├── skills/                  # 精选技能（10 个，全中文）
│   ├── agents/                  # 全部智能体（30 个，全中文）
│   ├── commands/                # 全部命令（60 个，全中文）
│   ├── contexts/                # 上下文模板（3 个，全中文）
│   ├── ecc-skills/              # 完整技能库（135 个，英文原版）
│   └── ecc-scripts/             # 运行时脚本（钩子核心 + 工具库 + CLI）
├── install.js                   # 一键安装脚本
├── verify.js                    # 安装验证脚本
├── package.json                 # 项目元数据
└── README.md                    # 本文件
```

## 中文规则示例

安装后，Cursor 会自动加载中文编码规则。例如：

### 编码风格（common-coding-style.md）

- **不可变性（关键）**— 始终创建新对象，永不修改现有对象
- **文件组织** — 多个小文件优于少数大文件，200-400 行典型，800 行上限
- **错误处理** — 在每个层级处理错误，不要静默吞掉异常
- **输入验证** — 在系统边界验证所有用户输入

### 安全规则（common-security.md）

- 永远不要硬编码密钥（API Key、密码、令牌）
- 所有用户输入必须验证
- 使用参数化查询防止 SQL 注入
- 启用 CSRF 保护

### Git 工作流（common-git-workflow.md）

- 提交格式：`<类型>: <描述>`
- 类型包括：feat、fix、refactor、docs、test、chore、perf、ci

## 中文智能体示例

| 智能体 | 中文描述 |
|--------|---------|
| planner | 复杂功能和重构的专家规划师 |
| architect | 系统设计和可扩展性的软件架构师 |
| code-reviewer | 代码质量、安全性和可维护性审查专家 |
| tdd-guide | 测试驱动开发专家，确保 80%+ 测试覆盖率 |
| security-reviewer | 安全漏洞检测和修复专家 |
| build-error-resolver | 构建和类型错误解决专家 |

## 钩子中文输出

安装后，钩子系统的所有输出信息均为中文：

```
[ECC] 已阻止: Dev server 必须在 tmux 中运行
[ECC] 警告: 正在读取敏感文件: .env
[ECC] 警告: 检测到提示词中可能包含密钥!
[ECC] 已阻止: Tab 不能读取敏感文件: .env
[ECC] MCP 调用: github/search
[ECC] MCP 结果: github/search - 成功
[ECC] 智能体已启动: planner
[ECC] PR 已创建: https://github.com/...
[ECC] 构建完成
```

## 钩子配置

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
| `strict` | 全部启用，包含 tmux 提醒、git push 审查、提交质量检查 |

## 系统要求

- **Node.js** >= 18
- **Cursor IDE**（支持 hooks.json 的版本）

## 注意事项

1. 安装后需要**重启 Cursor** 以加载新的钩子配置
2. 钩子脚本依赖 Node.js 运行时
3. 部分钩子（如自动格式化）需要项目中安装 Biome 或 Prettier
4. 完整技能库（ecc-skills/）保留英文原版，因为是给 AI 参考的内部知识库
5. 所有面向用户的内容（规则、智能体、命令、技能、钩子输出）均为中文

## 来源

本项目基于 [Everything Claude Code (ECC)](https://github.com/affaan-m/everything-claude-code) v1.9.0，中文翻译由社区贡献。

## 许可证

MIT
