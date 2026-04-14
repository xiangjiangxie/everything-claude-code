---
description: "Python 安全，扩展通用规则"
globs: ["**/*.py", "**/*.pyi"]
alwaysApply: false
---
# Python 安全

> 本文件以 Python 特定内容扩展通用安全规则。

## 密钥管理

```python
import os
from dotenv import load_dotenv

load_dotenv()

api_key = os.environ["OPENAI_API_KEY"]  # Raises KeyError if missing
```

## 安全扫描

- 使用 **bandit** 进行静态安全分析：
  ```bash
  bandit -r src/
  ```

## 参考

参见技能：`django-security` 获取 Django 特定的安全指南（如适用）。
