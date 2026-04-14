---
description: 强制执行测试驱动开发工作流。先搭建接口，先生成测试，再实现最少代码使其通过。确保 80%+ 覆盖率。
---

# TDD 命令

此命令调用 **tdd-guide** 智能体来强制执行测试驱动开发方法论。

## 此命令的功能

1. **搭建接口** - 先定义类型/接口
2. **先生成测试** - 编写失败的测试（RED）
3. **实现最少代码** - 仅编写足够通过测试的代码（GREEN）
4. **重构** - 保持测试通过的同时改进代码（REFACTOR）
5. **验证覆盖率** - 确保 80%+ 测试覆盖率

## 使用场景

在以下情况使用 `/tdd`：
- 实现新功能
- 添加新函数/组件
- 修复 bug（先编写复现 bug 的测试）
- 重构已有代码
- 构建关键业务逻辑

## 工作原理

tdd-guide 智能体将：

1. **定义接口**，确定输入/输出
2. **编写将会失败的测试**（因为代码还不存在）
3. **运行测试**并验证它们因正确原因失败
4. **编写最少实现**使测试通过
5. **运行测试**并验证通过
6. **重构**代码，同时保持测试通过
7. **检查覆盖率**，如低于 80% 则添加更多测试

## TDD 循环

```
RED → GREEN → REFACTOR → REPEAT

RED:      编写失败的测试
GREEN:    编写最少代码使其通过
REFACTOR: 改进代码，保持测试通过
REPEAT:   下一个功能/场景
```

## 使用示例

```
User: /tdd I need a function to calculate market liquidity score

Agent (tdd-guide):
# TDD 会话：市场流动性评分计算器

## 第 1 步：定义接口（搭建）

```typescript
// lib/liquidity.ts
export interface MarketData {
  totalVolume: number
  bidAskSpread: number
  activeTraders: number
  lastTradeTime: Date
}

export function calculateLiquidityScore(market: MarketData): number {
  // TODO: Implementation
  throw new Error('Not implemented')
}
```

## 第 2 步：编写失败测试（RED）

```typescript
// lib/liquidity.test.ts
import { calculateLiquidityScore } from './liquidity'

describe('calculateLiquidityScore', () => {
  it('should return high score for liquid market', () => {
    const market = {
      totalVolume: 100000,
      bidAskSpread: 0.01,
      activeTraders: 500,
      lastTradeTime: new Date()
    }

    const score = calculateLiquidityScore(market)

    expect(score).toBeGreaterThan(80)
    expect(score).toBeLessThanOrEqual(100)
  })

  it('should return low score for illiquid market', () => {
    const market = {
      totalVolume: 100,
      bidAskSpread: 0.5,
      activeTraders: 2,
      lastTradeTime: new Date(Date.now() - 86400000) // 1 day ago
    }

    const score = calculateLiquidityScore(market)

    expect(score).toBeLessThan(30)
    expect(score).toBeGreaterThanOrEqual(0)
  })

  it('should handle edge case: zero volume', () => {
    const market = {
      totalVolume: 0,
      bidAskSpread: 0,
      activeTraders: 0,
      lastTradeTime: new Date()
    }

    const score = calculateLiquidityScore(market)

    expect(score).toBe(0)
  })
})
```

## 第 3 步：运行测试 - 验证失败

```bash
npm test lib/liquidity.test.ts

FAIL lib/liquidity.test.ts
  ✕ should return high score for liquid market (2 ms)
    Error: Not implemented

1 test failed, 0 passed
```

✅ 测试按预期失败。准备实现。

## 第 4 步：实现最少代码（GREEN）

```typescript
// lib/liquidity.ts
export function calculateLiquidityScore(market: MarketData): number {
  if (market.totalVolume === 0) {
    return 0
  }

  const volumeScore = Math.min(market.totalVolume / 1000, 100)
  const spreadScore = Math.max(100 - (market.bidAskSpread * 1000), 0)
  const traderScore = Math.min(market.activeTraders / 10, 100)

  const hoursSinceLastTrade = (Date.now() - market.lastTradeTime.getTime()) / (1000 * 60 * 60)
  const recencyScore = Math.max(100 - (hoursSinceLastTrade * 10), 0)

  const score = (
    volumeScore * 0.4 +
    spreadScore * 0.3 +
    traderScore * 0.2 +
    recencyScore * 0.1
  )

  return Math.min(Math.max(score, 0), 100)
}
```

## 第 5 步：运行测试 - 验证通过

```bash
npm test lib/liquidity.test.ts

PASS lib/liquidity.test.ts
  ✓ should return high score for liquid market (3 ms)
  ✓ should return low score for illiquid market (2 ms)
  ✓ should handle edge case: zero volume (1 ms)

3 tests passed
```

✅ 所有测试通过！

## 第 6 步：重构（改进）

```typescript
// lib/liquidity.ts - 使用常量重构，提高可读性
const WEIGHTS = {
  VOLUME: 0.4,
  SPREAD: 0.3,
  TRADERS: 0.2,
  RECENCY: 0.1,
} as const

const SCALE_FACTORS = {
  VOLUME: 1000,
  SPREAD: 1000,
  TRADERS: 10,
  RECENCY_PENALTY: 10,
} as const

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

export function calculateLiquidityScore(market: MarketData): number {
  if (market.totalVolume === 0) return 0

  const volumeScore = Math.min(market.totalVolume / SCALE_FACTORS.VOLUME, 100)
  const spreadScore = clamp(100 - (market.bidAskSpread * SCALE_FACTORS.SPREAD), 0, 100)
  const traderScore = Math.min(market.activeTraders / SCALE_FACTORS.TRADERS, 100)

  const hoursSinceLastTrade = (Date.now() - market.lastTradeTime.getTime()) / (1000 * 60 * 60)
  const recencyScore = clamp(100 - (hoursSinceLastTrade * SCALE_FACTORS.RECENCY_PENALTY), 0, 100)

  const weightedScore =
    volumeScore * WEIGHTS.VOLUME +
    spreadScore * WEIGHTS.SPREAD +
    traderScore * WEIGHTS.TRADERS +
    recencyScore * WEIGHTS.RECENCY

  return clamp(weightedScore, 0, 100)
}
```

## 第 7 步：验证测试仍然通过

```bash
npm test lib/liquidity.test.ts

PASS lib/liquidity.test.ts
  ✓ should return high score for liquid market (3 ms)
  ✓ should return low score for illiquid market (2 ms)
  ✓ should handle edge case: zero volume (1 ms)

3 tests passed
```

✅ 重构完成，测试仍然通过！

## 第 8 步：检查覆盖率

```bash
npm test -- --coverage lib/liquidity.test.ts

File           | % Stmts | % Branch | % Funcs | % Lines
---------------|---------|----------|---------|--------
liquidity.ts   |   100   |   100    |   100   |   100

Coverage: 100% ✅ (Target: 80%)
```

✅ TDD 会话完成！
```

## TDD 最佳实践

**应该做的：**
- ✅ 在任何实现之前先编写测试
- ✅ 运行测试并验证在实现前它们会失败
- ✅ 编写最少代码使测试通过
- ✅ 仅在测试通过后重构
- ✅ 添加边界情况和错误场景
- ✅ 关键代码目标 80%+ 覆盖率（100%）

**不应该做的：**
- ❌ 在测试之前编写实现
- ❌ 每次更改后跳过运行测试
- ❌ 一次编写过多代码
- ❌ 忽略失败的测试
- ❌ 测试实现细节（应测试行为）
- ❌ mock 所有东西（优先使用集成测试）

## 应包含的测试类型

**单元测试**（函数级别）：
- 正常路径场景
- 边界情况（空值、null、最大值）
- 错误条件
- 边界值

**集成测试**（组件级别）：
- API 端点
- 数据库操作
- 外部服务调用
- 带 hooks 的 React 组件

**E2E 测试**（使用 `/e2e` 命令）：
- 关键用户流
- 多步骤流程
- 全栈集成

## 覆盖率要求

- 所有代码 **最低 80%**
- 以下代码 **要求 100%**：
  - 金融计算
  - 认证逻辑
  - 安全关键代码
  - 核心业务逻辑

## 重要说明

**强制要求**：测试必须在实现之前编写。TDD 循环是：

1. **RED** - 编写失败测试
2. **GREEN** - 实现使其通过
3. **REFACTOR** - 改进代码

绝不跳过 RED 阶段。绝不在测试之前编写代码。

## 与其他命令的集成

- 先使用 `/plan` 了解需要构建什么
- 使用 `/tdd` 进行带测试的实现
- 如有构建错误使用 `/build-fix`
- 使用 `/code-review` 审查实现
- 使用 `/test-coverage` 验证覆盖率

## 相关智能体

此命令调用 ECC 提供的 `tdd-guide` 智能体。

相关的 `tdd-workflow` 技能也包含在 ECC 中。

对于手动安装，源文件位于：
- `agents/tdd-guide.md`
- `skills/tdd-workflow/SKILL.md`
