---
description: 管理 Claude Code 会话历史、别名和会话元数据。
---

# 会话命令

管理 Claude Code 会话历史 - 列出、加载、设置别名和编辑存储在 `~/.claude/session-data/` 中的会话，兼容从 `~/.claude/sessions/` 读取旧版数据。

## 用法

`/sessions [list|load|alias|info|help] [options]`

## 操作

### 列出会话

显示所有会话及其元数据，支持过滤和分页。

当你需要为集群提供操作面上下文时，使用 `/sessions info`：分支、工作树路径和会话新近度。

```bash
/sessions                              # 列出所有会话（默认）
/sessions list                         # 同上
/sessions list --limit 10              # 显示 10 个会话
/sessions list --date 2026-02-01       # 按日期过滤
/sessions list --search abc            # 按会话 ID 搜索
```

**脚本：**
```bash
node -e "
const sm = require((()=>{var e=process.env.CLAUDE_PLUGIN_ROOT;if(e&&e.trim())return e.trim();var p=require('path'),f=require('fs'),h=require('os').homedir(),d=p.join(h,'.claude'),q=p.join('scripts','lib','utils.js');if(f.existsSync(p.join(d,q)))return d;try{var b=p.join(d,'plugins','cache','everything-claude-code');for(var o of f.readdirSync(b))for(var v of f.readdirSync(p.join(b,o))){var c=p.join(b,o,v);if(f.existsSync(p.join(c,q)))return c}}catch(x){}return d})()+'/scripts/lib/session-manager');
const aa = require((()=>{var e=process.env.CLAUDE_PLUGIN_ROOT;if(e&&e.trim())return e.trim();var p=require('path'),f=require('fs'),h=require('os').homedir(),d=p.join(h,'.claude'),q=p.join('scripts','lib','utils.js');if(f.existsSync(p.join(d,q)))return d;try{var b=p.join(d,'plugins','cache','everything-claude-code');for(var o of f.readdirSync(b))for(var v of f.readdirSync(p.join(b,o))){var c=p.join(b,o,v);if(f.existsSync(p.join(c,q)))return c}}catch(x){}return d})()+'/scripts/lib/session-aliases');
const path = require('path');

const result = sm.getAllSessions({ limit: 20 });
const aliases = aa.listAliases();
const aliasMap = {};
for (const a of aliases) aliasMap[a.sessionPath] = a.name;

console.log('Sessions (showing ' + result.sessions.length + ' of ' + result.total + '):');
console.log('');
console.log('ID        Date        Time     Branch       Worktree           Alias');
console.log('────────────────────────────────────────────────────────────────────');

for (const s of result.sessions) {
  const alias = aliasMap[s.filename] || '';
  const metadata = sm.parseSessionMetadata(sm.getSessionContent(s.sessionPath));
  const id = s.shortId === 'no-id' ? '(none)' : s.shortId.slice(0, 8);
  const time = s.modifiedTime.toTimeString().slice(0, 5);
  const branch = (metadata.branch || '-').slice(0, 12);
  const worktree = metadata.worktree ? path.basename(metadata.worktree).slice(0, 18) : '-';

  console.log(id.padEnd(8) + ' ' + s.date + '  ' + time + '   ' + branch.padEnd(12) + ' ' + worktree.padEnd(18) + ' ' + alias);
}
"
```

### 加载会话

加载并显示会话内容（通过 ID 或别名）。

```bash
/sessions load <id|alias>             # 加载会话
/sessions load 2026-02-01             # 按日期（用于无 ID 的会话）
/sessions load a1b2c3d4               # 按 short ID
/sessions load my-alias               # 按别名
```

**脚本：**
```bash
node -e "
const sm = require((()=>{var e=process.env.CLAUDE_PLUGIN_ROOT;if(e&&e.trim())return e.trim();var p=require('path'),f=require('fs'),h=require('os').homedir(),d=p.join(h,'.claude'),q=p.join('scripts','lib','utils.js');if(f.existsSync(p.join(d,q)))return d;try{var b=p.join(d,'plugins','cache','everything-claude-code');for(var o of f.readdirSync(b))for(var v of f.readdirSync(p.join(b,o))){var c=p.join(b,o,v);if(f.existsSync(p.join(c,q)))return c}}catch(x){}return d})()+'/scripts/lib/session-manager');
const aa = require((()=>{var e=process.env.CLAUDE_PLUGIN_ROOT;if(e&&e.trim())return e.trim();var p=require('path'),f=require('fs'),h=require('os').homedir(),d=p.join(h,'.claude'),q=p.join('scripts','lib','utils.js');if(f.existsSync(p.join(d,q)))return d;try{var b=p.join(d,'plugins','cache','everything-claude-code');for(var o of f.readdirSync(b))for(var v of f.readdirSync(p.join(b,o))){var c=p.join(b,o,v);if(f.existsSync(p.join(c,q)))return c}}catch(x){}return d})()+'/scripts/lib/session-aliases');
const id = process.argv[1];

// 首先尝试解析为别名
const resolved = aa.resolveAlias(id);
const sessionId = resolved ? resolved.sessionPath : id;

const session = sm.getSessionById(sessionId, true);
if (!session) {
  console.log('未找到会话：' + id);
  process.exit(1);
}

const stats = sm.getSessionStats(session.sessionPath);
const size = sm.getSessionSize(session.sessionPath);
const aliases = aa.getAliasesForSession(session.filename);

console.log('会话：' + session.filename);
console.log('路径：' + session.sessionPath);
console.log('');
console.log('统计：');
console.log('  行数：' + stats.lineCount);
console.log('  总项目：' + stats.totalItems);
console.log('  已完成：' + stats.completedItems);
console.log('  进行中：' + stats.inProgressItems);
console.log('  大小：' + size);
console.log('');

if (aliases.length > 0) {
  console.log('别名：' + aliases.map(a => a.name).join(', '));
  console.log('');
}

if (session.metadata.title) {
  console.log('标题：' + session.metadata.title);
  console.log('');
}

if (session.metadata.started) {
  console.log('开始时间：' + session.metadata.started);
}

if (session.metadata.lastUpdated) {
  console.log('最后更新：' + session.metadata.lastUpdated);
}

if (session.metadata.project) {
  console.log('项目：' + session.metadata.project);
}

if (session.metadata.branch) {
  console.log('分支：' + session.metadata.branch);
}

if (session.metadata.worktree) {
  console.log('工作树：' + session.metadata.worktree);
}
" "$ARGUMENTS"
```

### 创建别名

为会话创建一个易记的别名。

```bash
/sessions alias <id> <name>           # 创建别名
/sessions alias 2026-02-01 today-work # 创建名为 "today-work" 的别名
```

**脚本：**
```bash
node -e "
const sm = require((()=>{var e=process.env.CLAUDE_PLUGIN_ROOT;if(e&&e.trim())return e.trim();var p=require('path'),f=require('fs'),h=require('os').homedir(),d=p.join(h,'.claude'),q=p.join('scripts','lib','utils.js');if(f.existsSync(p.join(d,q)))return d;try{var b=p.join(d,'plugins','cache','everything-claude-code');for(var o of f.readdirSync(b))for(var v of f.readdirSync(p.join(b,o))){var c=p.join(b,o,v);if(f.existsSync(p.join(c,q)))return c}}catch(x){}return d})()+'/scripts/lib/session-manager');
const aa = require((()=>{var e=process.env.CLAUDE_PLUGIN_ROOT;if(e&&e.trim())return e.trim();var p=require('path'),f=require('fs'),h=require('os').homedir(),d=p.join(h,'.claude'),q=p.join('scripts','lib','utils.js');if(f.existsSync(p.join(d,q)))return d;try{var b=p.join(d,'plugins','cache','everything-claude-code');for(var o of f.readdirSync(b))for(var v of f.readdirSync(p.join(b,o))){var c=p.join(b,o,v);if(f.existsSync(p.join(c,q)))return c}}catch(x){}return d})()+'/scripts/lib/session-aliases');

const sessionId = process.argv[1];
const aliasName = process.argv[2];

if (!sessionId || !aliasName) {
  console.log('用法：/sessions alias <id> <name>');
  process.exit(1);
}

// 获取会话文件名
const session = sm.getSessionById(sessionId);
if (!session) {
  console.log('未找到会话：' + sessionId);
  process.exit(1);
}

const result = aa.setAlias(aliasName, session.filename);
if (result.success) {
  console.log('✓ 别名已创建：' + aliasName + ' → ' + session.filename);
} else {
  console.log('✗ 错误：' + result.error);
  process.exit(1);
}
" "$ARGUMENTS"
```

### 移除别名

删除现有别名。

```bash
/sessions alias --remove <name>        # 移除别名
/sessions unalias <name>               # 同上
```

**脚本：**
```bash
node -e "
const aa = require((()=>{var e=process.env.CLAUDE_PLUGIN_ROOT;if(e&&e.trim())return e.trim();var p=require('path'),f=require('fs'),h=require('os').homedir(),d=p.join(h,'.claude'),q=p.join('scripts','lib','utils.js');if(f.existsSync(p.join(d,q)))return d;try{var b=p.join(d,'plugins','cache','everything-claude-code');for(var o of f.readdirSync(b))for(var v of f.readdirSync(p.join(b,o))){var c=p.join(b,o,v);if(f.existsSync(p.join(c,q)))return c}}catch(x){}return d})()+'/scripts/lib/session-aliases');

const aliasName = process.argv[1];
if (!aliasName) {
  console.log('用法：/sessions alias --remove <name>');
  process.exit(1);
}

const result = aa.deleteAlias(aliasName);
if (result.success) {
  console.log('✓ 别名已移除：' + aliasName);
} else {
  console.log('✗ 错误：' + result.error);
  process.exit(1);
}
" "$ARGUMENTS"
```

### 会话信息

显示会话的详细信息。

```bash
/sessions info <id|alias>              # 显示会话详情
```

**脚本：**
```bash
node -e "
const sm = require((()=>{var e=process.env.CLAUDE_PLUGIN_ROOT;if(e&&e.trim())return e.trim();var p=require('path'),f=require('fs'),h=require('os').homedir(),d=p.join(h,'.claude'),q=p.join('scripts','lib','utils.js');if(f.existsSync(p.join(d,q)))return d;try{var b=p.join(d,'plugins','cache','everything-claude-code');for(var o of f.readdirSync(b))for(var v of f.readdirSync(p.join(b,o))){var c=p.join(b,o,v);if(f.existsSync(p.join(c,q)))return c}}catch(x){}return d})()+'/scripts/lib/session-manager');
const aa = require((()=>{var e=process.env.CLAUDE_PLUGIN_ROOT;if(e&&e.trim())return e.trim();var p=require('path'),f=require('fs'),h=require('os').homedir(),d=p.join(h,'.claude'),q=p.join('scripts','lib','utils.js');if(f.existsSync(p.join(d,q)))return d;try{var b=p.join(d,'plugins','cache','everything-claude-code');for(var o of f.readdirSync(b))for(var v of f.readdirSync(p.join(b,o))){var c=p.join(b,o,v);if(f.existsSync(p.join(c,q)))return c}}catch(x){}return d})()+'/scripts/lib/session-aliases');

const id = process.argv[1];
const resolved = aa.resolveAlias(id);
const sessionId = resolved ? resolved.sessionPath : id;

const session = sm.getSessionById(sessionId, true);
if (!session) {
  console.log('未找到会话：' + id);
  process.exit(1);
}

const stats = sm.getSessionStats(session.sessionPath);
const size = sm.getSessionSize(session.sessionPath);
const aliases = aa.getAliasesForSession(session.filename);

console.log('会话信息');
console.log('════════════════════');
console.log('ID:          ' + (session.shortId === 'no-id' ? '(none)' : session.shortId));
console.log('文件名:      ' + session.filename);
console.log('日期:        ' + session.date);
console.log('修改时间:    ' + session.modifiedTime.toISOString().slice(0, 19).replace('T', ' '));
console.log('项目:        ' + (session.metadata.project || '-'));
console.log('分支:        ' + (session.metadata.branch || '-'));
console.log('工作树:      ' + (session.metadata.worktree || '-'));
console.log('');
console.log('内容:');
console.log('  行数:          ' + stats.lineCount);
console.log('  总项目:        ' + stats.totalItems);
console.log('  已完成:        ' + stats.completedItems);
console.log('  进行中:        ' + stats.inProgressItems);
console.log('  大小:          ' + size);
if (aliases.length > 0) {
  console.log('别名:        ' + aliases.map(a => a.name).join(', '));
}
" "$ARGUMENTS"
```

### 列出别名

显示所有会话别名。

```bash
/sessions aliases                      # 列出所有别名
```

**脚本：**
```bash
node -e "
const aa = require((()=>{var e=process.env.CLAUDE_PLUGIN_ROOT;if(e&&e.trim())return e.trim();var p=require('path'),f=require('fs'),h=require('os').homedir(),d=p.join(h,'.claude'),q=p.join('scripts','lib','utils.js');if(f.existsSync(p.join(d,q)))return d;try{var b=p.join(d,'plugins','cache','everything-claude-code');for(var o of f.readdirSync(b))for(var v of f.readdirSync(p.join(b,o))){var c=p.join(b,o,v);if(f.existsSync(p.join(c,q)))return c}}catch(x){}return d})()+'/scripts/lib/session-aliases');

const aliases = aa.listAliases();
console.log('会话别名（' + aliases.length + '）：');
console.log('');

if (aliases.length === 0) {
  console.log('未找到别名。');
} else {
  console.log('名称          会话文件                        标题');
  console.log('─────────────────────────────────────────────────────────────');
  for (const a of aliases) {
    const name = a.name.padEnd(12);
    const file = (a.sessionPath.length > 30 ? a.sessionPath.slice(0, 27) + '...' : a.sessionPath).padEnd(30);
    const title = a.title || '';
    console.log(name + ' ' + file + ' ' + title);
  }
}
"
```

## 操作员注意事项

- 会话文件在头部持久化 `Project`、`Branch` 和 `Worktree`，因此 `/sessions info` 可以区分并行的 tmux/工作树运行。
- 对于指挥中心式监控，结合 `/sessions info`、`git diff --stat` 和 `scripts/hooks/cost-tracker.js` 发出的成本指标。

## 参数

$ARGUMENTS:
- `list [options]` - 列出会话
  - `--limit <n>` - 最大显示会话数（默认：50）
  - `--date <YYYY-MM-DD>` - 按日期过滤
  - `--search <pattern>` - 在会话 ID 中搜索
- `load <id|alias>` - 加载会话内容
- `alias <id> <name>` - 为会话创建别名
- `alias --remove <name>` - 移除别名
- `unalias <name>` - 同 `--remove`
- `info <id|alias>` - 显示会话统计
- `aliases` - 列出所有别名
- `help` - 显示帮助

## 示例

```bash
# 列出所有会话
/sessions list

# 为今天的会话创建别名
/sessions alias 2026-02-01 today

# 通过别名加载会话
/sessions load today

# 显示会话信息
/sessions info today

# 移除别名
/sessions alias --remove today

# 列出所有别名
/sessions aliases
```

## 注意事项

- 会话以 markdown 文件存储在 `~/.claude/session-data/` 中，兼容从 `~/.claude/sessions/` 读取旧版数据
- 别名存储在 `~/.claude/session-aliases.json` 中
- 会话 ID 可以缩写（前 4-8 个字符通常足够唯一）
- 对经常引用的会话使用别名
