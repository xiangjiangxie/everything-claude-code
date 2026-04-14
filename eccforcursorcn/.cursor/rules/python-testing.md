---
description: "Python 测试，扩展通用规则"
globs: ["**/*.py", "**/*.pyi"]
alwaysApply: false
---
# Python 测试

> 本文件以 Python 特定内容扩展通用测试规则。

## 框架

使用 **pytest** 作为测试框架。

## 覆盖率

```bash
pytest --cov=src --cov-report=term-missing
```

## 测试组织

使用 `pytest.mark` 进行测试分类：

```python
import pytest

@pytest.mark.unit
def test_calculate_total():
    ...

@pytest.mark.integration
def test_database_connection():
    ...
```

## 参考

参见技能：`python-testing` 获取详细的 pytest 模式和测试夹具。
