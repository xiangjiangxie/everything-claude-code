# 更新代码地图

分析代码库结构并生成 token 精简的架构文档。

## 第 1 步：扫描项目结构

1. 识别项目类型（monorepo、单应用、库、微服务）
2. 查找所有源码目录（src/、lib/、app/、packages/）
3. 映射入口点（main.ts、index.ts、app.py、main.go 等）

## 第 2 步：生成代码地图

在 `docs/CODEMAPS/`（或 `.reports/codemaps/`）中创建或更新代码地图：

| 文件 | 内容 |
|------|----------|
| `architecture.md` | 高级系统图、服务边界、数据流 |
| `backend.md` | API 路由、中间件链、service → repository 映射 |
| `frontend.md` | 页面树、组件层级、状态管理流 |
| `data.md` | 数据库表、关系、迁移历史 |
| `dependencies.md` | 外部服务、第三方集成、共享库 |

### 代码地图格式

每个代码地图应该是 token 精简的 — 针对 AI 上下文消费优化：

```markdown
# Backend Architecture

## Routes
POST /api/users → UserController.create → UserService.create → UserRepo.insert
GET  /api/users/:id → UserController.get → UserService.findById → UserRepo.findById

## Key Files
src/services/user.ts (business logic, 120 lines)
src/repos/user.ts (database access, 80 lines)

## Dependencies
- PostgreSQL (primary data store)
- Redis (session cache, rate limiting)
- Stripe (payment processing)
```

## 第 3 步：差异检测

1. 如果已有代码地图，计算差异百分比
2. 如果变更 > 30%，展示差异并请求用户确认后再覆盖
3. 如果变更 <= 30%，就地更新

## 第 4 步：添加元数据

为每个代码地图添加新鲜度头：

```markdown
<!-- Generated: 2026-02-11 | Files scanned: 142 | Token estimate: ~800 -->
```

## 第 5 步：保存分析报告

将摘要写入 `.reports/codemap-diff.txt`：
- 自上次扫描以来新增/删除/修改的文件
- 检测到的新依赖
- 架构变更（新路由、新服务等）
- 90+ 天未更新的文档过时警告

## 提示

- 聚焦于 **高级结构**，而非实现细节
- 优先使用 **文件路径和函数签名** 而非完整代码块
- 每个代码地图保持在 **1000 token** 以下，以便高效加载上下文
- 使用 ASCII 图表表示数据流，替代冗长描述
- 在主要功能添加或重构会话后运行
