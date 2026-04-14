---
description: 全面的 Go 代码审查，涵盖惯用模式、并发安全、错误处理和安全性。调用 go-reviewer 智能体。
---

# Go 代码审查

此命令调用 **go-reviewer** 智能体进行全面的 Go 专项代码审查。

## 此命令的功能

1. **识别 Go 变更**：通过 `git diff` 查找修改的 `.go` 文件
2. **运行静态分析**：执行 `go vet`、`staticcheck` 和 `golangci-lint`
3. **安全扫描**：检查 SQL 注入、命令注入、竞态条件
4. **并发审查**：分析 goroutine 安全性、channel 使用、mutex 模式
5. **惯用 Go 检查**：验证代码是否遵循 Go 规范和最佳实践
6. **生成报告**：按严重级别分类问题

## 使用场景

在以下情况使用 `/go-review`：
- 编写或修改 Go 代码之后
- 提交 Go 变更之前
- 审查包含 Go 代码的 Pull Request
- 接手新的 Go 代码库
- 学习惯用 Go 模式

## 审查类别

### 严重（必须修复）
- SQL/命令注入漏洞
- 无同步的竞态条件
- Goroutine 泄漏
- 硬编码凭证
- 不安全的指针使用
- 关键路径上忽略错误

### 高（应当修复）
- 缺少带上下文的错误包装
- 使用 panic 而非错误返回
- Context 未传播
- 无缓冲 channel 导致死锁
- 接口未满足错误
- 缺少 mutex 保护

### 中（建议改进）
- 非惯用代码模式
- 导出标识符缺少 godoc 注释
- 低效的字符串拼接
- 切片未预分配
- 未使用表驱动测试

## 自动运行的检查

```bash
# 静态分析
go vet ./...

# 高级检查（如已安装）
staticcheck ./...
golangci-lint run

# 竞态检测
go build -race ./...

# 安全漏洞
govulncheck ./...
```

## 使用示例

```text
User: /go-review

Agent:
# Go 代码审查报告

## 审查的文件
- internal/handler/user.go（已修改）
- internal/service/auth.go（已修改）

## 静态分析结果
✓ go vet：无问题
✓ staticcheck：无问题

## 发现的问题

[严重] 竞态条件
文件：internal/service/auth.go:45
问题：共享 map 无同步访问
```go
var cache = map[string]*Session{}  // Concurrent access!

func GetSession(id string) *Session {
    return cache[id]  // Race condition
}
```
修复：使用 sync.RWMutex 或 sync.Map
```go
var (
    cache   = map[string]*Session{}
    cacheMu sync.RWMutex
)

func GetSession(id string) *Session {
    cacheMu.RLock()
    defer cacheMu.RUnlock()
    return cache[id]
}
```

[高] 缺少错误上下文
文件：internal/handler/user.go:28
问题：返回错误时未附加上下文
```go
return err  // No context
```
修复：包装上下文信息
```go
return fmt.Errorf("get user %s: %w", userID, err)
```

## 总结
- 严重：1
- 高：1
- 中：0

建议：❌ 在严重问题修复前阻止合并
```

## 审批标准

| 状态 | 条件 |
|--------|-----------|
| ✅ 批准 | 无严重或高级问题 |
| ⚠️ 警告 | 仅有中级问题（谨慎合并） |
| ❌ 阻止 | 发现严重或高级问题 |

## 与其他命令的集成

- 先使用 `/go-test` 确保测试通过
- 如有构建错误使用 `/go-build`
- 提交前使用 `/go-review`
- 对非 Go 特定问题使用 `/code-review`

## 相关资源

- 智能体：`agents/go-reviewer.md`
- 技能：`skills/golang-patterns/`、`skills/golang-testing/`
