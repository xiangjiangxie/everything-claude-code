# 测试覆盖率

分析测试覆盖率，识别缺口，并生成缺失的测试以达到 80%+ 覆盖率。

## 第 1 步：检测测试框架

| 指标 | 覆盖率命令 |
|-----------|-----------------|
| `jest.config.*` 或 `package.json` jest | `npx jest --coverage --coverageReporters=json-summary` |
| `vitest.config.*` | `npx vitest run --coverage` |
| `pytest.ini` / `pyproject.toml` pytest | `pytest --cov=src --cov-report=json` |
| `Cargo.toml` | `cargo llvm-cov --json` |
| `pom.xml` 含 JaCoCo | `mvn test jacoco:report` |
| `go.mod` | `go test -coverprofile=coverage.out ./...` |

## 第 2 步：分析覆盖率报告

1. 运行覆盖率命令
2. 解析输出（JSON 摘要或终端输出）
3. 列出 **低于 80% 覆盖率** 的文件，按最差排序
4. 对每个覆盖不足的文件，识别：
   - 未测试的函数或方法
   - 缺失的分支覆盖（if/else、switch、错误路径）
   - 膨胀分母的死代码

## 第 3 步：生成缺失的测试

按以下优先级为每个覆盖不足的文件生成测试：

1. **正常路径** — 有效输入的核心功能
2. **错误处理** — 无效输入、缺失数据、网络故障
3. **边界情况** — 空数组、null/undefined、边界值（0、-1、MAX_INT）
4. **分支覆盖** — 每个 if/else、switch case、三元表达式

### 测试生成规则

- 将测试放在源文件旁边：`foo.ts` → `foo.test.ts`（或遵循项目约定）
- 使用项目中现有的测试模式（导入风格、断言库、mock 方式）
- mock 外部依赖（数据库、API、文件系统）
- 每个测试应独立 — 测试间无共享可变状态
- 描述性命名测试：`test_create_user_with_duplicate_email_returns_409`

## 第 4 步：验证

1. 运行完整测试套件 — 所有测试必须通过
2. 重新运行覆盖率 — 验证改善情况
3. 如仍低于 80%，对剩余缺口重复第 3 步

## 第 5 步：报告

显示前后对比：

```
覆盖率报告
──────────────────────────────
文件                    之前    之后
src/services/auth.ts   45%     88%
src/utils/validation.ts 32%    82%
──────────────────────────────
总体：                  67%     84%  ✅
```

## 重点关注领域

- 复杂分支的函数（高圈复杂度）
- 错误处理器和 catch 块
- 跨代码库使用的工具函数
- API 端点处理器（请求 → 响应流）
- 边界情况：null、undefined、空字符串、空数组、零、负数
