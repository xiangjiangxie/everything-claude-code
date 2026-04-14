---
paths:
  - "**/*.java"
---
# Java 编码风格

> 本文件以 Java 特定内容扩展了 [common/coding-style.md](../common/coding-style.md)。

## 格式化

- 使用 **google-java-format** 或 **Checkstyle**（Google 或 Sun 风格）强制执行
- 每个文件一个公共顶级类型
- 一致的缩进：2 或 4 个空格（与项目标准一致）
- 成员顺序：常量、字段、构造函数、公共方法、受保护方法、私有方法

## 不可变性

- 值类型优先使用 `record`（Java 16+）
- 字段默认标记为 `final` — 仅在必要时使用可变状态
- 从公共 API 返回防御性副本：`List.copyOf()`、`Map.copyOf()`、`Set.copyOf()`
- 写时复制：返回新实例而非修改现有实例

```java
// 好 — 不可变值类型
public record OrderSummary(Long id, String customerName, BigDecimal total) {}

// 好 — final 字段，无 setter
public class Order {
    private final Long id;
    private final List<LineItem> items;

    public List<LineItem> getItems() {
        return List.copyOf(items);
    }
}
```

## 命名

遵循标准 Java 约定：
- `PascalCase` 用于类、接口、record、枚举
- `camelCase` 用于方法、字段、参数、局部变量
- `SCREAMING_SNAKE_CASE` 用于 `static final` 常量
- 包名：全小写，反向域名（`com.example.app.service`）

## 现代 Java 特性

在提高清晰度时使用现代语言特性：
- **Record** 用于 DTO 和值类型（Java 16+）
- **密封类** 用于封闭类型层次结构（Java 17+）
- **模式匹配** 配合 `instanceof` — 无需显式转换（Java 16+）
- **文本块** 用于多行字符串 — SQL、JSON 模板（Java 15+）
- **Switch 表达式** 使用箭头语法（Java 14+）
- **Switch 中的模式匹配** — 穷举密封类型处理（Java 21+）

```java
// 模式匹配 instanceof
if (shape instanceof Circle c) {
    return Math.PI * c.radius() * c.radius();
}

// 密封类型层次结构
public sealed interface PaymentMethod permits CreditCard, BankTransfer, Wallet {}

// Switch 表达式
String label = switch (status) {
    case ACTIVE -> "Active";
    case SUSPENDED -> "Suspended";
    case CLOSED -> "Closed";
};
```

## Optional 用法

- 从可能无结果的查找方法返回 `Optional<T>`
- 使用 `map()`、`flatMap()`、`orElseThrow()` — 永远不要在没有 `isPresent()` 的情况下调用 `get()`
- 永远不要将 `Optional` 用作字段类型或方法参数

```java
// 好
return repository.findById(id)
    .map(ResponseDto::from)
    .orElseThrow(() -> new OrderNotFoundException(id));

// 坏 — Optional 作为参数
public void process(Optional<String> name) {}
```

## 错误处理

- 领域错误优先使用非检查异常
- 创建继承 `RuntimeException` 的领域特定异常
- 除非在顶级处理器中，否则避免宽泛的 `catch (Exception e)`
- 在异常消息中包含上下文信息

```java
public class OrderNotFoundException extends RuntimeException {
    public OrderNotFoundException(Long id) {
        super("Order not found: id=" + id);
    }
}
```

## Stream

- 使用 Stream 进行转换；保持流水线简短（最多 3-4 个操作）
- 可读时优先使用方法引用：`.map(Order::getTotal)`
- 避免在 Stream 操作中产生副作用
- 对于复杂逻辑，优先使用循环而非复杂的 Stream 流水线

## 参考

参阅技能：`java-coding-standards` 了解完整的编码标准和示例。
参阅技能：`jpa-patterns` 了解 JPA/Hibernate 实体设计模式。
