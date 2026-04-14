# 评估命令

管理评估驱动的开发工作流。

## 用法

`/eval [define|check|report|list] [feature-name]`

## 定义评估

`/eval define feature-name`

创建新的评估定义：

1. 创建 `.claude/evals/feature-name.md`，使用以下模板：

```markdown
## EVAL: feature-name
Created: $(date)

### 能力评估
- [ ] [能力 1 的描述]
- [ ] [能力 2 的描述]

### 回归评估
- [ ] [现有行为 1 仍然正常]
- [ ] [现有行为 2 仍然正常]

### 成功标准
- 能力评估的 pass@3 > 90%
- 回归评估的 pass^3 = 100%
```

2. 提示用户填写具体标准

## 检查评估

`/eval check feature-name`

运行某个功能的评估：

1. 从 `.claude/evals/feature-name.md` 读取评估定义
2. 对于每个能力评估：
   - 尝试验证标准
   - 记录通过/失败
   - 将尝试记录到 `.claude/evals/feature-name.log`
3. 对于每个回归评估：
   - 运行相关测试
   - 与基线比较
   - 记录通过/失败
4. 报告当前状态：

```
评估检查：feature-name
========================
能力：X/Y 通过
回归：X/Y 通过
状态：进行中 / 就绪
```

## 评估报告

`/eval report feature-name`

生成综合评估报告：

```
评估报告：feature-name
=========================
生成时间：$(date)

能力评估
----------------
[eval-1]：通过（pass@1）
[eval-2]：通过（pass@2）- 需要重试
[eval-3]：失败 - 查看备注

回归评估
----------------
[test-1]：通过
[test-2]：通过
[test-3]：通过

指标
-------
能力 pass@1：67%
能力 pass@3：100%
回归 pass^3：100%

备注
-----
[任何问题、边界情况或观察]

建议
--------------
[发布 / 需要改进 / 被阻塞]
```

## 列出评估

`/eval list`

显示所有评估定义：

```
评估定义
================
feature-auth      [3/5 通过] 进行中
feature-search    [5/5 通过] 就绪
feature-export    [0/4 通过] 未开始
```

## 参数

$ARGUMENTS:
- `define <name>` - 创建新的评估定义
- `check <name>` - 运行并检查评估
- `report <name>` - 生成完整报告
- `list` - 显示所有评估
- `clean` - 移除旧的评估日志（保留最近 10 次运行）
