---
name: evolve
description: 分析直觉规则并建议或生成演化结构
command: true
---

# 演化命令

## 实现方式

使用插件根路径运行直觉规则 CLI：

```bash
python3 "${CLAUDE_PLUGIN_ROOT}/skills/continuous-learning-v2/scripts/instinct-cli.py" evolve [--generate]
```

或如果 `CLAUDE_PLUGIN_ROOT` 未设置（手动安装）：

```bash
python3 ~/.claude/skills/continuous-learning-v2/scripts/instinct-cli.py evolve [--generate]
```

分析直觉规则并将相关规则聚类为更高级别的结构：
- **命令**：当直觉规则描述用户调用的操作时
- **技能**：当直觉规则描述自动触发的行为时
- **智能体**：当直觉规则描述复杂的多步骤流程时

## 用法

```
/evolve                    # 分析所有直觉规则并建议演化方案
/evolve --generate         # 同时在 evolved/{skills,commands,agents} 下生成文件
```

## 演化规则

### → 命令（用户调用）
当直觉规则描述用户会显式请求的操作时：
- 多条关于"当用户要求..."的直觉规则
- 触发器类似"当创建新 X 时"的直觉规则
- 遵循可重复序列的直觉规则

示例：
- `new-table-step1`："添加数据库表时，创建迁移"
- `new-table-step2`："添加数据库表时，更新 schema"
- `new-table-step3`："添加数据库表时，重新生成类型"

→ 创建：**new-table** 命令

### → 技能（自动触发）
当直觉规则描述应自动发生的行为时：
- 模式匹配触发器
- 错误处理响应
- 代码风格强制

示例：
- `prefer-functional`："编写函数时，优先使用函数式风格"
- `use-immutable`："修改状态时，使用不可变模式"
- `avoid-classes`："设计模块时，避免基于类的设计"

→ 创建：`functional-patterns` 技能

### → 智能体（需要深度/隔离）
当直觉规则描述受益于隔离的复杂多步骤流程时：
- 调试工作流
- 重构序列
- 研究任务

示例：
- `debug-step1`："调试时，先检查日志"
- `debug-step2`："调试时，隔离失败的组件"
- `debug-step3`："调试时，创建最小复现"
- `debug-step4`："调试时，用测试验证修复"

→ 创建：**debugger** 智能体

## 操作流程

1. 检测当前项目上下文
2. 读取项目 + 全局直觉规则（ID 冲突时项目优先）
3. 按触发器/领域模式分组直觉规则
4. 识别：
   - 技能候选（2+ 条直觉规则的触发器集群）
   - 命令候选（高置信度工作流直觉规则）
   - 智能体候选（更大的高置信度集群）
5. 适用时显示提升候选（项目 -> 全局）
6. 如传入 `--generate`，将文件写入：
   - 项目范围：`~/.claude/homunculus/projects/<project-id>/evolved/`
   - 全局回退：`~/.claude/homunculus/evolved/`

## 输出格式

```
============================================================
  EVOLVE ANALYSIS - 12 instincts
  Project: my-app (a1b2c3d4e5f6)
  Project-scoped: 8 | Global: 4
============================================================

High confidence instincts (>=80%): 5

## 技能候选
1. 集群："adding tests"
   直觉规则数：3
   平均置信度：82%
   领域：testing
   范围：project

## 命令候选 (2)
  /adding-tests
    来自：test-first-workflow [project]
    置信度：84%

## 智能体候选 (1)
  adding-tests-agent
    覆盖 3 条直觉规则
    平均置信度：82%
```

## 标志参数

- `--generate`：除分析输出外还生成演化文件

## 生成的文件格式

### 命令
```markdown
---
name: new-table
description: Create a new database table with migration, schema update, and type generation
command: /new-table
evolved_from:
  - new-table-migration
  - update-schema
  - regenerate-types
---

# New Table Command

[基于聚类直觉规则生成的内容]

## Steps
1. ...
2. ...
```

### 技能
```markdown
---
name: functional-patterns
description: Enforce functional programming patterns
evolved_from:
  - prefer-functional
  - use-immutable
  - avoid-classes
---

# Functional Patterns Skill

[基于聚类直觉规则生成的内容]
```

### 智能体
```markdown
---
name: debugger
description: Systematic debugging agent
model: sonnet
evolved_from:
  - debug-check-logs
  - debug-isolate
  - debug-reproduce
---

# Debugger Agent

[基于聚类直觉规则生成的内容]
```
