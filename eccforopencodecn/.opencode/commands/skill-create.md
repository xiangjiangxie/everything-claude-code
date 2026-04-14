---
description: 从 Git 历史分析生成技能
agent: build
---

# 技能创建命令

分析 Git 历史以生成 Claude Code 技能：$ARGUMENTS

## 你的任务

1. **分析提交** - 从历史中进行模式识别
2. **提取模式** - 常见实践和惯例
3. **生成 SKILL.md** - 结构化的技能文档
4. **创建直觉规则** - 用于 continuous-learning-v2

## 分析流程

### 步骤 1：收集提交数据
```bash
# 最近的提交
git log --oneline -100

# 按文件类型统计提交
git log --name-only --pretty=format: | sort | uniq -c | sort -rn

# 变更最频繁的文件
git log --pretty=format: --name-only | sort | uniq -c | sort -rn | head -20
```

### 步骤 2：识别模式

**提交信息模式**：
- 常见前缀（feat、fix、refactor）
- 命名惯例
- 联合作者模式

**代码模式**：
- 文件结构惯例
- 导入组织方式
- 错误处理方法

**审查模式**：
- 常见的审查反馈
- 重复出现的修复类型
- 质量门控

### 步骤 3：生成 SKILL.md

```markdown
# [技能名称]

## 概述
[此技能教什么]

## 模式

### 模式 1：[名称]
- 何时使用
- 实现方式
- 示例

### 模式 2：[名称]
- 何时使用
- 实现方式
- 示例

## 最佳实践

1. [实践 1]
2. [实践 2]
3. [实践 3]

## 常见错误

1. [错误 1] - 如何避免
2. [错误 2] - 如何避免

## 示例

### 好的示例
```[language]
// Code example
```

### 反模式
```[language]
// What not to do
```
```

### 步骤 4：生成直觉规则

用于 continuous-learning-v2：

```json
{
  "instincts": [
    {
      "trigger": "[情境]",
      "action": "[响应]",
      "confidence": 0.8,
      "source": "git-history-analysis"
    }
  ]
}
```

## 输出

创建：
- `skills/[name]/SKILL.md` - 技能文档
- `skills/[name]/instincts.json` - 直觉规则集合

---

**提示**：运行 `/skill-create --instincts` 可同时为持续学习生成直觉规则。
