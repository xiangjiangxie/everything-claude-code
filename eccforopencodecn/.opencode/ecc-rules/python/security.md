---
paths:
  - "**/*.py"
  - "**/*.pyi"
---
# Python 安全

> 本文件以 Python 特定内容扩展了 [common/security.md](../common/security.md)。

## 密钥管理

```python
import os
from dotenv import load_dotenv

load_dotenv()

api_key = os.environ["OPENAI_API_KEY"]  # 缺失时抛出 KeyError
```

## 安全扫描

- 使用 **bandit** 进行静态安全分析：
  ```bash
  bandit -r src/
  ```

## 参考

参阅技能：`django-security` 了解 Django 特定的安全指南（如适用）。
