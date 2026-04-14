# eccforopencodecn

**ECC for OpenCode 中文版** — 从 [Everything Claude Code](https://github.com/affaan-m/everything-claude-code) 中提取的 **OpenCode 专用中文插件**。

所有规则、智能体、命令、技能、提示词均已翻译为中文，专为中文开发者打造。

## 与英文版的区别

| 内容 | 英文版 (eccforopencode) | 中文版 (eccforopencodecn) |
|------|------------------------|--------------------------|
| 77 条编码规则 | 英文 | ✅ 中文 |
| 30 个 ECC 智能体 | 英文 | ✅ 中文 |
| 60 个 ECC 命令 | 英文 | ✅ 中文 |
| 34 个 OpenCode 命令 | 英文 | ✅ 中文 |
| 14 个智能体提示词 | 英文 | ✅ 中文 |
| opencode.json 描述 | 英文 | ✅ 中文 |
| INSTRUCTIONS.md | 英文 | ✅ 中文 |
| README.md / MIGRATION.md | 英文 | ✅ 中文 |
| 3 个上下文模板 | 英文 | ✅ 中文 |
| 135 个完整技能库 | 英文 | 英文（AI 参考用） |
| TypeScript 插件/工具 | 不变 | 不变 |

## 功能概览

**与 Claude Code 完全对等的功能集：**

| 模块 | 数量 | 说明 |
|------|------|------|
| TypeScript 插件钩子 | 1 个 | 文件编辑后格式化/类型检查、会话管理、安全审查 |
| 自定义工具 | 6 个 | 代码格式化、测试运行、lint、安全审计、git 摘要、覆盖率 |
| OpenCode 智能体 | 13 个 | opencode.json 配置（中文描述） |
| OpenCode 命令 | 34 个 | 命令模板（全中文） |
| ECC 完整智能体 | 30 个 | Markdown 定义（全中文） |
| ECC 完整命令 | 60 个 | 斜杠命令（全中文） |
| ECC 完整技能 | 135 个 | 技能库（英文原版，AI 参考用） |
| 编码规则 | 77 条 | 通用 + 多语言（全中文） |
| MCP 配置 | 6 个服务器 | GitHub、Context7、Exa、Memory、Playwright、Sequential Thinking |
| 上下文模板 | 3 个 | 开发、研究、审查（全中文） |

## 快速开始

### 方法一：直接复制（推荐）

```bash
# 克隆仓库
git clone https://github.com/affaan-m/everything-claude-code.git
cd everything-claude-code/eccforopencodecn

# 复制到你的项目
cp -r .opencode/ /你的项目路径/.opencode/

# 安装依赖并编译
cd /你的项目路径/.opencode
npm install
npx tsc
```

### 方法二：使用安装脚本

```bash
node install.js /你的项目路径
cd /你的项目路径/.opencode && npm install && npx tsc
```

### 验证安装

```bash
node verify.js /你的项目路径
```

## 中文内容示例

### opencode.json 智能体描述（中文）

```json
{
  "planner": {
    "description": "复杂功能和重构的专家规划师。用于实现规划、架构变更或复杂重构。"
  },
  "code-reviewer": {
    "description": "专业代码审查专家。审查代码质量、安全性和可维护性。编写或修改代码后立即使用。"
  },
  "security-reviewer": {
    "description": "安全漏洞检测和修复专家。编写涉及用户输入、认证、API 端点或敏感数据的代码后使用。"
  }
}
```

### 编码规则示例（中文）

```markdown
# 编码风格

## 不可变性（关键）
始终创建新对象，绝不修改现有对象。

## 文件组织
多个小文件优于少数大文件。200-400 行典型，800 行上限。
```

### 智能体提示词示例（中文）

```
你是一位专业的规划专家，专注于创建全面、可执行的实施计划。

## 你的角色
- 分析需求并创建详细的实施计划
- 将复杂功能分解为可管理的步骤
- 识别依赖关系和潜在风险
```

## 项目结构

```
eccforopencodecn/
├── .opencode/                        # OpenCode 配置（完全自包含，全中文）
│   ├── opencode.json                 # 主配置（中文描述）
│   ├── package.json                  # NPM 包配置
│   ├── tsconfig.json                 # TypeScript 编译配置
│   ├── mcp.json                      # MCP 服务器配置
│   ├── README.md                     # OpenCode 文档（中文）
│   ├── MIGRATION.md                  # 迁移指南（中文）
│   ├── plugins/                      # TypeScript 插件
│   ├── tools/                        # 自定义工具（6 个）
│   ├── instructions/                 # 指令规则（中文）
│   ├── commands/                     # OpenCode 命令（34 个，中文）
│   ├── prompts/agents/               # 智能体提示词（14 个，中文）
│   ├── ecc-agents/                   # ECC 智能体（30 个，中文）
│   ├── ecc-commands/                 # ECC 命令（60 个，中文）
│   ├── ecc-skills/                   # 完整技能库（135 个，英文原版）
│   ├── ecc-rules/                    # 编码规则（77 条，中文）
│   ├── ecc-scripts/                  # 运行时脚本
│   └── ecc-contexts/                 # 上下文模板（3 个，中文）
├── install.js                        # 安装脚本
├── verify.js                         # 验证脚本
├── package.json                      # 项目元数据
└── README.md                         # 本文件
```

## 系统要求

- **Node.js** >= 18
- **OpenCode** CLI
- **TypeScript**（通过 npx tsc 编译插件）

## 来源

本项目基于 [Everything Claude Code (ECC)](https://github.com/affaan-m/everything-claude-code) v1.9.0，中文翻译由社区贡献。

## 许可证

MIT
