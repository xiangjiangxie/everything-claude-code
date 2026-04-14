---
name: skill-health
description: 显示技能组合健康仪表盘，含图表和分析
command: true
---

# 技能健康仪表盘

显示技能组合的全面健康仪表盘，包含成功率火花线、失败模式聚类、待处理修订和版本历史。

## 实现方式

以仪表盘模式运行技能健康 CLI：

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
/skill-health                    # 完整仪表盘视图
/skill-health --panel failures   # 仅显示失败聚类面板
/skill-health --json             # 机器可读 JSON 输出
```

## 操作流程

1. 运行 skills-health.js 脚本，带 --dashboard 标志
2. 向用户显示输出
3. 如有技能趋势下降，高亮标注并建议运行 /evolve
4. 如有待处理修订，建议审查

## 面板

- **成功率（30天）** — 每个技能每日成功率的火花线图
- **失败模式** — 聚类的失败原因，带水平条形图
- **待处理修订** — 等待审查的修订提议
- **版本历史** — 每个技能的版本快照时间线
