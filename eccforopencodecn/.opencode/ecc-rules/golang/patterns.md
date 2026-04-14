---
paths:
  - "**/*.go"
  - "**/go.mod"
  - "**/go.sum"
---
# Go 模式

> 本文件以 Go 特定内容扩展了 [common/patterns.md](../common/patterns.md)。

## 函数式选项

```go
type Option func(*Server)

func WithPort(port int) Option {
    return func(s *Server) { s.port = port }
}

func NewServer(opts ...Option) *Server {
    s := &Server{port: 8080}
    for _, opt := range opts {
        opt(s)
    }
    return s
}
```

## 小接口

在使用接口的地方定义接口，而非实现的地方。

## 依赖注入

使用构造函数注入依赖：

```go
func NewUserService(repo UserRepository, logger Logger) *UserService {
    return &UserService{repo: repo, logger: logger}
}
```

## 参考

参阅技能：`golang-patterns` 了解全面的 Go 模式，包括并发、错误处理和包组织。
