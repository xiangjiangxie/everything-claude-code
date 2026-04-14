---
description: Go TDD 工作流，使用表驱动测试
agent: tdd-guide
subtask: true
---

# Go 测试命令

使用 Go TDD 方法论进行实现：$ARGUMENTS

## 你的任务

运用 Go 惯用方式进行测试驱动开发：

1. **定义类型** - 接口和结构体
2. **编写表驱动测试** - 全面覆盖
3. **实现最小代码** - 通过测试
4. **基准测试** - 验证性能

## Go 的 TDD 循环

### 步骤 1：定义接口
```go
type Calculator interface {
    Calculate(input Input) (Output, error)
}

type Input struct {
    // fields
}

type Output struct {
    // fields
}
```

### 步骤 2：表驱动测试
```go
func TestCalculate(t *testing.T) {
    tests := []struct {
        name    string
        input   Input
        want    Output
        wantErr bool
    }{
        {
            name:  "valid input",
            input: Input{...},
            want:  Output{...},
        },
        {
            name:    "invalid input",
            input:   Input{...},
            wantErr: true,
        },
    }

    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            got, err := Calculate(tt.input)
            if (err != nil) != tt.wantErr {
                t.Errorf("Calculate() error = %v, wantErr %v", err, tt.wantErr)
                return
            }
            if !reflect.DeepEqual(got, tt.want) {
                t.Errorf("Calculate() = %v, want %v", got, tt.want)
            }
        })
    }
}
```

### 步骤 3：运行测试（红色阶段）
```bash
go test -v ./...
```

### 步骤 4：实现（绿色阶段）
```go
func Calculate(input Input) (Output, error) {
    // Minimal implementation
}
```

### 步骤 5：基准测试
```go
func BenchmarkCalculate(b *testing.B) {
    input := Input{...}
    for i := 0; i < b.N; i++ {
        Calculate(input)
    }
}
```

## Go 测试命令

```bash
# 运行所有测试
go test ./...

# 带详细输出运行
go test -v ./...

# 带覆盖率运行
go test -cover ./...

# 带竞态检测器运行
go test -race ./...

# 运行基准测试
go test -bench=. ./...

# 生成覆盖率报告
go test -coverprofile=coverage.out ./...
go tool cover -html=coverage.out
```

## 测试文件组织

```
package/
├── calculator.go       # 实现
├── calculator_test.go  # 测试
├── testdata/           # 测试数据
│   └── input.json
└── mock_test.go        # Mock 实现
```

---

**提示**：使用 `testify/assert` 可以获得更简洁的断言，或者使用标准库保持简洁。
