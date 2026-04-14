---
description: 从外部来源导入直觉规则
agent: build
---

# 直觉规则导入命令

从文件或 URL 导入直觉规则：$ARGUMENTS

## 你的任务

将直觉规则导入到 continuous-learning-v2 系统中。

## 导入来源

### 文件导入
```
/instinct-import path/to/instincts.json
```

### URL 导入
```
/instinct-import https://example.com/instincts.json
```

### 团队共享导入
```
/instinct-import @teammate/instincts
```

## 导入格式

预期的 JSON 结构：

```json
{
  "instincts": [
    {
      "trigger": "[情境描述]",
      "action": "[建议操作]",
      "confidence": 0.7,
      "category": "coding",
      "source": "imported"
    }
  ],
  "metadata": {
    "version": "1.0",
    "exported": "2025-01-15T10:00:00Z",
    "author": "username"
  }
}
```

## 导入流程

1. **验证格式** - 检查 JSON 结构
2. **去重** - 跳过已存在的直觉规则
3. **调整置信度** - 降低导入规则的置信度（×0.8）
4. **合并** - 添加到本地直觉规则库
5. **报告** - 显示导入摘要

## 导入报告

```
导入摘要
==============
来源：[路径或 URL]
文件中总计：X
已导入：Y
已跳过（重复）：Z
错误：W

已导入的直觉规则：
- [触发条件]（置信度：0.XX）
- [触发条件]（置信度：0.XX）
...
```

## 冲突解决

导入重复项时：
- 保留置信度更高的版本
- 合并应用次数
- 更新时间戳

---

**提示**：导入后使用 `/instinct-status` 查看导入的直觉规则。
