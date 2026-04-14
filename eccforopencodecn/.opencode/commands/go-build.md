---
description: 修复 Go 构建和 vet 错误
agent: go-build-resolver
subtask: true
---

# Go 构建命令

修复 Go 构建、vet 和编译错误：$ARGUMENTS

## 你的任务

1. **运行 go build**：`go build ./...`
2. **运行 go vet**：`go vet ./...`
3. **逐个修复错误**
4. **验证修复** 不引入新错误

## 常见 Go 错误

### 导入错误
```
imported and not used: "package"
```
**修复**：移除未使用的导入或使用 `_` 前缀

### 类型错误
```
cannot use x (type T) as type U
```
**修复**：添加类型转换或修正类型定义

### 未定义错误
```
undefined: identifier
```
**修复**：导入包、定义变量或修正拼写

### Vet 错误
```
printf: call has arguments but no formatting directives
```
**修复**：添加格式化指令或移除参数

## 修复顺序

1. **导入错误** - 修复或移除导入
2. **类型定义** - 确保类型存在
3. **函数签名** - 匹配参数
4. **Vet 警告** - 处理静态分析

## 构建命令

```bash
# 构建所有包
go build ./...

# 带竞态检测器构建
go build -race ./...

# 为特定操作系统/架构构建
GOOS=linux GOARCH=amd64 go build ./...

# 运行 go vet
go vet ./...

# 运行 staticcheck
staticcheck ./...

# 格式化代码
gofmt -w .

# 整理依赖
go mod tidy
```

## 验证

修复后：
```bash
go build ./...    # 应该成功
go vet ./...      # 应该没有警告
go test ./...     # 测试应通过
```

---

**重要**：仅修复错误。不重构，不改进。用最小的变更使构建通过。
