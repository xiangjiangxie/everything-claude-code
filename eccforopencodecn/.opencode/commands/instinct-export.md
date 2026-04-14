---
description: 导出直觉规则用于共享
agent: build
---

# 直觉规则导出命令

导出直觉规则以与他人共享：$ARGUMENTS

## 你的任务

从 continuous-learning-v2 系统导出直觉规则。

## 导出选项

### 导出全部
```
/instinct-export
```

### 仅导出高置信度
```
/instinct-export --min-confidence 0.8
```

### 按类别导出
```
/instinct-export --category coding
```

### 导出到指定路径
```
/instinct-export --output ./my-instincts.json
```

## 导出格式

```json
{
  "instincts": [
    {
      "id": "instinct-123",
      "trigger": "[情境描述]",
      "action": "[建议操作]",
      "confidence": 0.85,
      "category": "coding",
      "applications": 10,
      "successes": 9,
      "source": "session-observation"
    }
  ],
  "metadata": {
    "version": "1.0",
    "exported": "2025-01-15T10:00:00Z",
    "author": "username",
    "total": 25,
    "filter": "confidence >= 0.8"
  }
}
```

## 导出报告

```
导出摘要
==============
输出：./instincts-export.json
直觉规则总数：X
已过滤：Y
已导出：Z

类别：
- coding：N
- testing：N
- security：N
- git：N

置信度最高的直觉规则：
1. [触发条件]（0.XX）
2. [触发条件]（0.XX）
3. [触发条件]（0.XX）
```

## 共享

导出后：
- 直接共享 JSON 文件
- 上传到团队仓库
- 发布到直觉规则注册表

---

**提示**：导出高置信度的直觉规则（>0.8）以获得更好的共享质量。
