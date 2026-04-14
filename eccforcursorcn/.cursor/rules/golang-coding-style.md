---
description: "Go 编码风格，扩展通用规则"
globs: ["**/*.go", "**/go.mod", "**/go.sum"]
alwaysApply: false
---
# Go 编码风格

> 本文件以 Go 特定内容扩展通用编码风格规则。

## 格式化

- **gofmt** 和 **goimports** 是必须的——不接受风格争论

## 设计原则

- 接受接口，返回结构体
- 保持接口精简（1-3 个方法）

## 错误处理

始终为错误添加上下文信息：

```go
if err != nil {
    return fmt.Errorf("failed to create user: %w", err)
}
```

## 参考

参见技能：`golang-patterns` 获取完整的 Go 惯用法和模式。
