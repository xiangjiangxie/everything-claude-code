---
description: 以最小变更修复构建和 TypeScript 错误
agent: build-error-resolver
subtask: true
---

# 构建修复命令

以最小变更修复构建和 TypeScript 错误：$ARGUMENTS

## 你的任务

1. **运行类型检查**：`npx tsc --noEmit`
2. **收集所有错误**
3. **逐个修复错误** 使用最小变更
4. **验证每个修复** 不引入新错误
5. **运行最终检查** 确认所有错误已解决

## 方法

### 应该做的：
- ✅ 用正确的类型修复类型错误
- ✅ 添加缺失的导入
- ✅ 修复语法错误
- ✅ 做最小的变更
- ✅ 保持现有行为
- ✅ 每次变更后运行 `tsc --noEmit`

### 不应该做的：
- ❌ 重构代码
- ❌ 添加新功能
- ❌ 改变架构
- ❌ 使用 `any` 类型（除非绝对必要）
- ❌ 添加 `@ts-ignore` 注释
- ❌ 改变业务逻辑

## 常见错误修复

| 错误 | 修复 |
|-------|-----|
| Type 'X' is not assignable to type 'Y' | 添加正确的类型注解 |
| Property 'X' does not exist | 向接口添加属性或修正属性名 |
| Cannot find module 'X' | 安装包或修正导入路径 |
| Argument of type 'X' is not assignable | 类型转换或修正函数签名 |
| Object is possibly 'undefined' | 添加空值检查或可选链 |

## 验证步骤

修复后：
1. `npx tsc --noEmit` - 应显示 0 个错误
2. `npm run build` - 应成功
3. `npm test` - 测试应仍然通过

---

**重要**：仅专注于修复错误。不重构，不改进，不改变架构。用最小差异使构建通过。
