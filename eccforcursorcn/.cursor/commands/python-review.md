---
description: 全面的 Python 代码审查，涵盖 PEP 8 合规、类型提示、安全性和 Pythonic 惯用法。调用 python-reviewer 智能体。
---

# Python 代码审查

此命令调用 **python-reviewer** 智能体进行全面的 Python 专项代码审查。

## 此命令的功能

1. **识别 Python 变更**：通过 `git diff` 查找修改的 `.py` 文件
2. **运行静态分析**：执行 `ruff`、`mypy`、`pylint`、`black --check`
3. **安全扫描**：检查 SQL 注入、命令注入、不安全的反序列化
4. **类型安全审查**：分析类型提示和 mypy 错误
5. **Pythonic 代码检查**：验证代码是否遵循 PEP 8 和 Python 最佳实践
6. **生成报告**：按严重级别分类问题

## 使用场景

在以下情况使用 `/python-review`：
- 编写或修改 Python 代码之后
- 提交 Python 变更之前
- 审查包含 Python 代码的 Pull Request
- 接手新的 Python 代码库
- 学习 Pythonic 模式和惯用法

## 审查类别

### 严重（必须修复）
- SQL/命令注入漏洞
- 不安全的 eval/exec 使用
- Pickle 不安全反序列化
- 硬编码凭证
- YAML unsafe load
- 裸 except 子句隐藏错误

### 高（应当修复）
- 公共函数缺少类型提示
- 可变默认参数
- 静默吞掉异常
- 资源未使用上下文管理器
- C 风格循环而非推导式
- 使用 type() 而非 isinstance()
- 无锁的竞态条件

### 中（建议改进）
- PEP 8 格式违规
- 公共函数缺少 docstring
- 使用 print 而非 logging
- 低效的字符串操作
- 无命名常量的魔法数字
- 未使用 f-string 格式化
- 不必要的列表创建

## 自动运行的检查

```bash
# 类型检查
mypy .

# Lint 和格式化
ruff check .
black --check .
isort --check-only .

# 安全扫描
bandit -r .

# 依赖审计
pip-audit
safety check

# 测试
pytest --cov=app --cov-report=term-missing
```

## 使用示例

```text
User: /python-review

Agent:
# Python 代码审查报告

## 审查的文件
- app/routes/user.py（已修改）
- app/services/auth.py（已修改）

## 静态分析结果
✓ ruff：无问题
✓ mypy：无错误
⚠️ black：2 个文件需要重新格式化
✓ bandit：无安全问题

## 发现的问题

[严重] SQL 注入漏洞
文件：app/routes/user.py:42
问题：用户输入直接插入 SQL 查询
```python
query = f"SELECT * FROM users WHERE id = {user_id}"  # Bad
```
修复：使用参数化查询
```python
query = "SELECT * FROM users WHERE id = %s"  # Good
cursor.execute(query, (user_id,))
```

[高] 可变默认参数
文件：app/services/auth.py:18
问题：可变默认参数导致共享状态
```python
def process_items(items=[]):  # Bad
    items.append("new")
    return items
```
修复：使用 None 作为默认值
```python
def process_items(items=None):  # Good
    if items is None:
        items = []
    items.append("new")
    return items
```

[中] 缺少类型提示
文件：app/services/auth.py:25
问题：公共函数无类型注解
```python
def get_user(user_id):  # Bad
    return db.find(user_id)
```
修复：添加类型提示
```python
def get_user(user_id: str) -> Optional[User]:  # Good
    return db.find(user_id)
```

[中] 未使用上下文管理器
文件：app/routes/user.py:55
问题：异常时文件未关闭
```python
f = open("config.json")  # Bad
data = f.read()
f.close()
```
修复：使用上下文管理器
```python
with open("config.json") as f:  # Good
    data = f.read()
```

## 总结
- 严重：1
- 高：1
- 中：2

建议：❌ 在严重问题修复前阻止合并

## 需要格式化
运行：`black app/routes/user.py app/services/auth.py`
```

## 审批标准

| 状态 | 条件 |
|--------|-----------|
| ✅ 批准 | 无严重或高级问题 |
| ⚠️ 警告 | 仅有中级问题（谨慎合并） |
| ❌ 阻止 | 发现严重或高级问题 |

## 与其他命令的集成

- 先使用 `/tdd` 确保测试通过
- 对非 Python 特定问题使用 `/code-review`
- 提交前使用 `/python-review`
- 如静态分析工具失败使用 `/build-fix`

## 框架专项审查

### Django 项目
审查器检查：
- N+1 查询问题（使用 `select_related` 和 `prefetch_related`）
- 模型变更缺少迁移
- ORM 可用时使用原始 SQL
- 多步操作缺少 `transaction.atomic()`

### FastAPI 项目
审查器检查：
- CORS 配置错误
- 请求验证的 Pydantic 模型
- 响应模型正确性
- async/await 的正确使用
- 依赖注入模式

### Flask 项目
审查器检查：
- 上下文管理（应用上下文、请求上下文）
- 正确的错误处理
- Blueprint 组织
- 配置管理

## 相关资源

- 智能体：`agents/python-reviewer.md`
- 技能：`skills/python-patterns/`、`skills/python-testing/`

## 常见修复

### 添加类型提示
```python
# Before
def calculate(x, y):
    return x + y

# After
from typing import Union

def calculate(x: Union[int, float], y: Union[int, float]) -> Union[int, float]:
    return x + y
```

### 使用上下文管理器
```python
# Before
f = open("file.txt")
data = f.read()
f.close()

# After
with open("file.txt") as f:
    data = f.read()
```

### 使用列表推导式
```python
# Before
result = []
for item in items:
    if item.active:
        result.append(item.name)

# After
result = [item.name for item in items if item.active]
```

### 修复可变默认值
```python
# Before
def append(value, items=[]):
    items.append(value)
    return items

# After
def append(value, items=None):
    if items is None:
        items = []
    items.append(value)
    return items
```

### 使用 f-string（Python 3.6+）
```python
# Before
name = "Alice"
greeting = "Hello, " + name + "!"
greeting2 = "Hello, {}".format(name)

# After
greeting = f"Hello, {name}!"
```

### 修复循环中的字符串拼接
```python
# Before
result = ""
for item in items:
    result += str(item)

# After
result = "".join(str(item) for item in items)
```

## Python 版本兼容性

审查器会注意使用了较新 Python 版本特性的代码：

| 特性 | 最低 Python 版本 |
|---------|----------------|
| 类型提示 | 3.5+ |
| f-string | 3.6+ |
| 海象运算符（`:=`） | 3.8+ |
| 仅位置参数 | 3.8+ |
| match 语句 | 3.10+ |
| 类型联合（`x | None`） | 3.10+ |

确保项目的 `pyproject.toml` 或 `setup.py` 指定了正确的最低 Python 版本。
