---
description: "Python 模式，扩展通用规则"
globs: ["**/*.py", "**/*.pyi"]
alwaysApply: false
---
# Python 模式

> 本文件以 Python 特定内容扩展通用模式规则。

## 协议（鸭子类型）

```python
from typing import Protocol

class Repository(Protocol):
    def find_by_id(self, id: str) -> dict | None: ...
    def save(self, entity: dict) -> dict: ...
```

## 数据类作为 DTO

```python
from dataclasses import dataclass

@dataclass
class CreateUserRequest:
    name: str
    email: str
    age: int | None = None
```

## 上下文管理器与生成器

- 使用上下文管理器（`with` 语句）进行资源管理
- 使用生成器实现惰性求值和内存高效的迭代

## 参考

参见技能：`python-patterns` 获取完整的模式，包括装饰器、并发和包组织。
