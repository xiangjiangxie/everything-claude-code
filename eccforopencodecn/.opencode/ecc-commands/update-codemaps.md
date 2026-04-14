# 更新代码地图

分析代码库结构并生成低 token 消耗的架构文档。

## 步骤 1：扫描项目结构

1. 识别项目类型（monorepo、单应用、库、微服务）
2. 查找所有源代码目录（src/、lib/、app/、packages/）
3. 映射入口点（main.ts、index.ts、app.py、main.go 等）

## 步骤 2：生成代码地图

在 `docs/CODEMAPS/`（或 `.reports/codemaps/`）中创建或更新代码地图：

| 文件 | 内容 |
|------|------|
| `architecture.md` | 高层系统图、服务边界、数据流 |
| `backend.md` | API 路由、中间件链、service → repository 映射 |
| `frontend.md` | 页面树、组件层次结构、状态管理流 |
| `data.md` | 数据库表、关系、迁移历史 |
| `dependencies.md` | 外部服务、第三方集成、共享库 |

### 代码地图格式

每个代码地图应该是低 token 消耗的 — 为 AI 上下文使用而优化：

```markdown
# 后端架构

## 路由
POST /api/users → UserController.create → UserService.create → UserRepo.insert
GET  /api/users/:id → UserController.get → UserService.findById → UserRepo.findById

## 关键文件
src/services/user.ts（业务逻辑，120 行）
src/repos/user.ts（数据库访问，80 行）

## 依赖
- PostgreSQL（主数据存储）
- Redis（会话缓存、速率限制）
- Stripe（支付处理）
```

## 步骤 3：差异检测

1. 如果存在之前的代码地图，计算差异百分比
2. 如果变更 > 30%，展示差异并请求用户批准后再覆盖
3. 如果变更 <= 30%，就地更新

## 步骤 4：添加元数据

为每个代码地图添加新鲜度头：

```markdown
<!-- Generated: 2026-02-11 | Files scanned: 142 | Token estimate: ~800 -->
```

## 步骤 5：保存分析报告

将摘要写入 `.reports/codemap-diff.txt`：
- 自上次扫描以来添加/移除/修改的文件
- 检测到的新依赖
- 架构变更（新路由、新服务等）
- 90 天以上未更新的文档的过期警告

## 提示

- 关注**高层结构**，而非实现细节
- 优先使用**文件路径和函数签名**而非完整代码块
- 每个代码地图保持在 **1000 token** 以下，以实现高效的上下文加载
- 使用 ASCII 图表表示数据流，而非冗长的描述
- 在主要功能添加或重构会话后运行
