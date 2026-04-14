---
paths:
  - "**/*.pl"
  - "**/*.pm"
  - "**/*.t"
  - "**/*.psgi"
  - "**/*.cgi"
---
# Perl 安全

> 本文件以 Perl 特定内容扩展了 [common/security.md](../common/security.md)。

## 污染模式

- 对所有 CGI/面向 Web 的脚本使用 `-T` 标志
- 在执行任何外部命令前清理 `%ENV`（`$ENV{PATH}`、`$ENV{CDPATH}` 等）

## 输入验证

- 使用白名单正则表达式进行去污染 — 永远不要 `/(.*)/s`
- 使用显式模式验证所有用户输入：

```perl
if ($input =~ /\A([a-zA-Z0-9_-]+)\z/) {
    my $clean = $1;
}
```

## 文件 I/O

- **仅使用三参数 open** — 永远不用两参数 open
- 使用 `Cwd::realpath` 防止路径遍历：

```perl
use Cwd 'realpath';
my $safe_path = realpath($user_path);
die "Path traversal" unless $safe_path =~ m{\A/allowed/directory/};
```

## 进程执行

- 使用**列表形式的 `system()`** — 永远不用单字符串形式
- 使用 **IPC::Run3** 捕获输出
- 永远不要在反引号中使用变量插值

```perl
system('grep', '-r', $pattern, $directory);  # 安全
```

## SQL 注入防护

始终使用 DBI 占位符 — 永远不要在 SQL 中插值：

```perl
my $sth = $dbh->prepare('SELECT * FROM users WHERE email = ?');
$sth->execute($email);
```

## 安全扫描

对安全主题使用 **perlcritic** 严重级别 4+：

```bash
perlcritic --severity 4 --theme security lib/
```

## 参考

参阅技能：`perl-security` 了解全面的 Perl 安全模式、污染模式和安全 I/O。
