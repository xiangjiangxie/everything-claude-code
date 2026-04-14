---
description: "Go 模式，扩展通用规则"
globs: ["**/*.go", "**/go.mod", "**/go.sum"]
alwaysApply: false
---
# Go 模式

> 本文件以 Go 特定内容扩展通用模式规则。

## 函数选项模式

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

在使用接口的地方定义接口，而不是在实现接口的地方。

## 依赖注入

使用构造函数注入依赖：

```go
func NewUserService(repo UserRepository, logger Logger) *UserService {
    return &UserService{repo: repo, logger: logger}
}
```

## 参考

参见技能：`golang-patterns` 获取完整的 Go 模式，包括并发、错误处理和包组织。
