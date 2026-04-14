---
name: skill-health
description: 显示技能组合健康仪表板，包含图表和分析
command: true
---

# 技能健康仪表板

显示技能组合的综合健康仪表板，包含成功率折线图、失败模式聚类、待处理修订和版本历史。

## 实现

以仪表板模式运行技能健康 CLI：

```bash
ECC_ROOT="${CLAUDE_PLUGIN_ROOT:-$(node -e "var p=require('path'),f=require('fs'),h=require('os').homedir(),d=p.join(h,'.claude'),q=p.join('scripts','lib','utils.js');if(!f.existsSync(p.join(d,q))){try{var b=p.join(d,'plugins','cache','everything-claude-code');for(var o of f.readdirSync(b))for(var v of f.readdirSync(p.join(b,o))){var c=p.join(b,o,v);if(f.existsSync(p.join(c,q))){d=c;break}}}catch(x){}}console.log(d)")}"
node "$ECC_ROOT/scripts/skills-health.js" --dashboard
```

仅查看特定面板：

```bash
ECC_ROOT="${CLAUDE_PLUGIN_ROOT:-$(node -e "var p=require('path'),f=require('fs'),h=require('os').homedir(),d=p.join(h,'.claude'),q=p.join('scripts','lib','utils.js');if(!f.existsSync(p.join(d,q))){try{var b=p.join(d,'plugins','cache','everything-claude-code');for(var o of f.readdirSync(b))for(var v of f.readdirSync(p.join(b,o))){var c=p.join(b,o,v);if(f.existsSync(p.join(c,q))){d=c;break}}}catch(x){}}console.log(d)")}"
node "$ECC_ROOT/scripts/skills-health.js" --dashboard --panel failures
```

机器可读输出：

```bash
ECC_ROOT="${CLAUDE_PLUGIN_ROOT:-$(node -e "var p=require('path'),f=require('fs'),h=require('os').homedir(),d=p.join(h,'.claude'),q=p.join('scripts','lib','utils.js');if(!f.existsSync(p.join(d,q))){try{var b=p.join(d,'plugins','cache','everything-claude-code');for(var o of f.readdirSync(b))for(var v of f.readdirSync(p.join(b,o))){var c=p.join(b,o,v);if(f.existsSync(p.join(c,q))){d=c;break}}}catch(x){}}console.log(d)")}"
node "$ECC_ROOT/scripts/skills-health.js" --dashboard --json
```

## 用法

```
/skill-health                    # 完整仪表板视图
/skill-health --panel failures   # 仅失败聚类面板
/skill-health --json             # 机器可读的 JSON 输出
```

## 操作步骤

1. 使用 --dashboard 标志运行 skills-health.js 脚本
2. 向用户展示输出
3. 如果有任何技能在下降，高亮显示并建议运行 /evolve
4. 如果有待处理的修订，建议审查它们

## 面板

- **成功率（30 天）** — 每个技能的每日成功率折线图
- **失败模式** — 聚类的失败原因及水平条形图
- **待处理修订** — 等待审查的修订提案
- **版本历史** — 每个技能的版本快照时间线
