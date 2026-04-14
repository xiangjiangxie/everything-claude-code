---
description: 使用 Playwright 生成并运行 E2E 测试
agent: e2e-runner
subtask: true
---

# E2E 命令

使用 Playwright 生成并运行端到端测试：$ARGUMENTS

## 你的任务

1. **分析用户流程** 进行测试
2. **创建测试旅程** 使用 Playwright
3. **运行测试** 并捕获产出物
4. **报告结果** 附带截图/视频

## 测试结构

```typescript
import { test, expect } from '@playwright/test'

test.describe('Feature: [Name]', () => {
  test.beforeEach(async ({ page }) => {
    // Setup: Navigate, authenticate, prepare state
  })

  test('should [expected behavior]', async ({ page }) => {
    // Arrange: Set up test data

    // Act: Perform user actions
    await page.click('[data-testid="button"]')
    await page.fill('[data-testid="input"]', 'value')

    // Assert: Verify results
    await expect(page.locator('[data-testid="result"]')).toBeVisible()
  })

  test.afterEach(async ({ page }, testInfo) => {
    // Capture screenshot on failure
    if (testInfo.status !== 'passed') {
      await page.screenshot({ path: `test-results/${testInfo.title}.png` })
    }
  })
})
```

## 最佳实践

### 选择器
- 优先使用 `data-testid` 属性
- 避免 CSS 类名（会变化）
- 使用语义化选择器（角色、标签）

### 等待
- 使用 Playwright 的自动等待
- 避免 `page.waitForTimeout()`
- 使用 `expect().toBeVisible()` 进行断言

### 测试隔离
- 每个测试应独立
- 之后清理测试数据
- 不依赖测试顺序

## 需要捕获的产出物

- 失败时的截图
- 用于调试的视频
- 用于详细分析的 trace 文件
- 相关时的网络日志

## 测试类别

1. **关键用户流程**
   - 身份验证（登录、登出、注册）
   - 核心功能的正常路径
   - 支付/结账流程

2. **边界情况**
   - 网络故障
   - 无效输入
   - 会话过期

3. **跨浏览器**
   - Chrome、Firefox、Safari
   - 移动端视口

## 报告格式

```
E2E 测试结果
================
✅ 通过：X
❌ 失败：Y
⏭️ 跳过：Z

失败的测试：
- test-name：错误信息
  截图：path/to/screenshot.png
  视频：path/to/video.webm
```

---

**提示**：使用 `--headed` 标志调试：`npx playwright test --headed`
