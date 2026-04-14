---
description: 更新代码地图以辅助代码库导航
agent: doc-updater
subtask: true
---

# 更新代码地图命令

更新代码地图以反映当前代码库结构：$ARGUMENTS

## 你的任务

在 `docs/CODEMAPS/` 目录中生成或更新代码地图：

1. **分析代码库结构**
2. **生成组件地图**
3. **记录关系**
4. **更新导航指南**

## 代码地图类型

### 架构地图
```
docs/CODEMAPS/ARCHITECTURE.md
```
- 高层系统概览
- 组件关系
- 数据流图

### 模块地图
```
docs/CODEMAPS/MODULES.md
```
- 模块描述
- 公共 API
- 依赖关系

### 文件地图
```
docs/CODEMAPS/FILES.md
```
- 目录结构
- 文件用途
- 关键文件

## 代码地图格式

### [模块名称]

**用途**：[简要描述]

**位置**：`src/[path]/`

**关键文件**：
- `file1.ts` - [用途]
- `file2.ts` - [用途]

**依赖**：
- [模块 A]
- [模块 B]

**导出**：
- `functionName()` - [描述]
- `ClassName` - [描述]

**使用示例**：
```typescript
import { functionName } from '@/module'
```

## 生成流程

1. 扫描目录结构
2. 解析导入/导出
3. 构建依赖图
4. 生成 Markdown 地图
5. 验证链接

---

**提示**：在添加新模块或进行重大重构时保持代码地图更新。
