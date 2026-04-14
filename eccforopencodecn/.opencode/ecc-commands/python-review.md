---
description: 全面的 Python 代码审查，涵盖 PEP 8 合规性、类型提示、安全性和 Pythonic 惯用法。调用 python-reviewer 代理。
---

# Python 代码审查

此命令调用 **python-reviewer** 代理进行全面的 Python 专项代码审查。

## 此命令的功能

1. **识别 Python 变更**：通过 `git diff` 查找修改的 `.py` 文件
2. **运行静态分析**：执行 `ruff`、`mypy`、`pylint`、`black --check`
3. **安全扫描**：检查 SQL 注入、命令注入、不安全的反序列化
4. **类型安全审查**：分析类型提示和 mypy 错误
5. **Pythonic 代码检查**：验证代码是否遵循 PEP 8 和 Python 最佳实践
6. **生成报告**：按严重程度分类问题

## 何时使用

在以下情况使用 `/python-review`：
- 编写或修改 Python 代码后
- 提交 Python 变更前
- 审查包含 Python 代码的 Pull Request
- 接手新的 Python 代码库时
- 学习 Pythonic 模式和惯用法时

## 审查类别

### 严重（必须修复）
- SQL/命令注入漏洞
- 不安全的 eval/exec 使用
- Pickle 不安全反序列化
- 硬编码凭证
- YAML 不安全加载
- 裸 except 子句隐藏错误

### 高（应该修复）
- 公共函数缺少类型提示
- 可变默认参数
- 静默吞噬异常
- 资源未使用上下文管理器
- C 风格循环替代列表推导
- 使用 type() 替代 isinstance()
- 无锁的竞态条件

### 中（建议修复）
- PEP 8 格式违规
- 公共函数缺少文档字符串
- 使用 print 语句而非 logging
- 低效的字符串操作
- 没有命名常量的魔法数字
- 未使用 f-string 进行格式化
- 不必要的列表创建

## 运行的自动检查

```bash
# 类型检查
mypy .

# 检查和格式化
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
用户：/python-review

代理：
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
问题：用户输入直接插入到 SQL 查询中
```python
query = f"SELECT * FROM users WHERE id = {user_id}"  # 不好
```
修复：使用参数化查询
```python
query = "SELECT * FROM users WHERE id = %s"  # 好
cursor.execute(query, (user_id,))
```

[高] 可变默认参数
文件：app/services/auth.py:18
问题：可变默认参数导致共享状态
```python
def process_items(items=[]):  # 不好
    items.append("new")
    return items
```
修复：使用 None 作为默认值
```python
def process_items(items=None):  # 好
    if items is None:
        items = []
    items.append("new")
    return items
```

[中] 缺少类型提示
文件：app/services/auth.py:25
问题：公共函数没有类型注解
```python
def get_user(user_id):  # 不好
    return db.find(user_id)
```
修复：添加类型提示
```python
def get_user(user_id: str) -> Optional[User]:  # 好
    return db.find(user_id)
```

[中] 未使用上下文管理器
文件：app/routes/user.py:55
问题：文件在异常时不会被关闭
```python
f = open("config.json")  # 不好
data = f.read()
f.close()
```
修复：使用上下文管理器
```python
with open("config.json") as f:  # 好
    data = f.read()
```

## 摘要
- 严重：1
- 高：1
- 中：2

建议：❌ 阻止合并，直到严重问题修复

## 需要格式化
运行：`black app/routes/user.py app/services/auth.py`
```

## 审批标准

| 状态 | 条件 |
|------|------|
| ✅ 批准 | 无严重或高级问题 |
| ⚠️ 警告 | 仅有中级问题（谨慎合并） |
| ❌ 阻止 | 发现严重或高级问题 |

## 与其他命令的集成

- 先使用 `/tdd` 确保测试通过
- 对于非 Python 专项的问题，使用 `/code-review`
- 提交前使用 `/python-review`
- 如果静态分析工具失败，使用 `/build-fix`

## 框架专项审查

### Django 项目
审查器检查：
- N+1 查询问题（使用 `select_related` 和 `prefetch_related`）
- 模型更改缺少迁移
- ORM 可用时使用原始 SQL
- 多步操作缺少 `transaction.atomic()`

### FastAPI 项目
审查器检查：
- CORS 配置错误
- 请求验证的 Pydantic 模型
- 响应模型正确性
- 正确的 async/await 使用
- 依赖注入模式

### Flask 项目
审查器检查：
- 上下文管理（应用上下文、请求上下文）
- 正确的错误处理
- Blueprint 组织
- 配置管理

## 相关资源

- 代理：`agents/python-reviewer.md`
- 技能：`skills/python-patterns/`、`skills/python-testing/`

## 常见修复

### 添加类型提示
```python
# 修改前
def calculate(x, y):
    return x + y

# 修改后
from typing import Union

def calculate(x: Union[int, float], y: Union[int, float]) -> Union[int, float]:
    return x + y
```

### 使用上下文管理器
```python
# 修改前
f = open("file.txt")
data = f.read()
f.close()

# 修改后
with open("file.txt") as f:
    data = f.read()
```

### 使用列表推导
```python
# 修改前
result = []
for item in items:
    if item.active:
        result.append(item.name)

# 修改后
result = [item.name for item in items if item.active]
```

### 修复可变默认值
```python
# 修改前
def append(value, items=[]):
    items.append(value)
    return items

# 修改后
def append(value, items=None):
    if items is None:
        items = []
    items.append(value)
    return items
```

### 使用 f-string（Python 3.6+）
```python
# 修改前
name = "Alice"
greeting = "Hello, " + name + "!"
greeting2 = "Hello, {}".format(name)

# 修改后
greeting = f"Hello, {name}!"
```

### 修复循环中的字符串拼接
```python
# 修改前
result = ""
for item in items:
    result += str(item)

# 修改后
result = "".join(str(item) for item in items)
```

## Python 版本兼容性

审查器会在代码使用较新 Python 版本特性时做出提示：

| 特性 | 最低 Python 版本 |
|------|-----------------|
| 类型提示 | 3.5+ |
| f-string | 3.6+ |
| 海象运算符 (`:=`) | 3.8+ |
| 仅位置参数 | 3.8+ |
| match 语句 | 3.10+ |
| 类型联合 (`x | None`) | 3.10+ |

确保你项目的 `pyproject.toml` 或 `setup.py` 指定了正确的最低 Python 版本。
