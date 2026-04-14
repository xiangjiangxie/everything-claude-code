---
paths:
  - "**/*.cs"
  - "**/*.csx"
  - "**/*.csproj"
---
# C# 测试

> 本文件以 C# 特定内容扩展了 [common/testing.md](../common/testing.md)。

## 测试框架

- 单元和集成测试优先使用 **xUnit**
- 使用 **FluentAssertions** 编写可读的断言
- 使用 **Moq** 或 **NSubstitute** mock 依赖
- 集成测试需要真实基础设施时使用 **Testcontainers**

## 测试组织

- 在 `tests/` 下镜像 `src/` 结构
- 清晰分离单元、集成和端到端测试
- 按行为而非实现细节命名测试

```csharp
public sealed class OrderServiceTests
{
    [Fact]
    public async Task FindByIdAsync_ReturnsOrder_WhenOrderExists()
    {
        // Arrange
        // Act
        // Assert
    }
}
```

## ASP.NET Core 集成测试

- 使用 `WebApplicationFactory<TEntryPoint>` 进行 API 集成测试
- 通过 HTTP 测试认证、验证和序列化，而非绕过中间件

## 覆盖率

- 目标 80%+ 行覆盖率
- 覆盖率聚焦于领域逻辑、验证、认证和失败路径
- 在 CI 中运行 `dotnet test` 并启用覆盖率收集
