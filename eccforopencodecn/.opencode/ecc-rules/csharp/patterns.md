---
paths:
  - "**/*.cs"
  - "**/*.csx"
---
# C# 模式

> 本文件以 C# 特定内容扩展了 [common/patterns.md](../common/patterns.md)。

## API 响应模式

```csharp
public sealed record ApiResponse<T>(
    bool Success,
    T? Data = default,
    string? Error = null,
    object? Meta = null);
```

## 仓库模式

```csharp
public interface IRepository<T>
{
    Task<IReadOnlyList<T>> FindAllAsync(CancellationToken cancellationToken);
    Task<T?> FindByIdAsync(Guid id, CancellationToken cancellationToken);
    Task<T> CreateAsync(T entity, CancellationToken cancellationToken);
    Task<T> UpdateAsync(T entity, CancellationToken cancellationToken);
    Task DeleteAsync(Guid id, CancellationToken cancellationToken);
}
```

## Options 模式

使用强类型 Options 配置，而非在代码库中到处读取原始字符串。

```csharp
public sealed class PaymentsOptions
{
    public const string SectionName = "Payments";
    public required string BaseUrl { get; init; }
    public required string ApiKeySecretName { get; init; }
}
```

## 依赖注入

- 在服务边界依赖接口
- 保持构造函数专注；如果服务需要太多依赖，拆分职责
- 有意识地注册生命周期：单例用于无状态/共享服务，Scoped 用于请求数据，Transient 用于轻量级纯工作器
