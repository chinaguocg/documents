## Linux 正则表达式

正则表达式（Regular Expression）在 Linux 系统中广泛应用于文本处理工具如 `grep`, `sed`, `awk` 等。Linux 主要支持两种正则表达式风格：**基本正则表达式(BRE)** 和 **扩展正则表达式(ERE)**。

### 一、基本正则表达式(BRE)

BRE 是 Linux 中许多工具默认使用的正则表达式语法（如 `grep` 不加 `-E` 选项时）。

```bash
[root@tianyun ~]# grep 'root|tianyun' /etc/passwd				# |不是基本正则表达式元字符

[root@tianyun ~]# grep 'root\|tianyun' /etc/passwd				# 基本正则表达式元字符\|
root:x:0:0:root:/root:/bin/bash
operator:x:11:0:operator:/root:/sbin/nologin
tianyun:x:1000:1000:tianyun:/home/tianyun:/bin/bash

[root@tianyun ~]# grep -E 'root|tianyun' /etc/passwd			# 扩展正则表达式元字符|
root:x:0:0:root:/root:/bin/bash
operator:x:11:0:operator:/root:/sbin/nologin
tianyun:x:1000:1000:tianyun:/home/tianyun:/bin/bash
```

#### 1. 基本元字符

- **`.`** - 匹配任意单个字符（除换行符）
- **`^`** - 匹配行首
- **`$`** - 匹配行尾
- **`*`** - 前导字符出现 `零` 次或多次
- **`[]`** - 字符集合
- **`[^]`** - 否定字符集合
- **`\`** - 转义特殊字符

```bash
[root@tianyun ~]# grep 'r..t' /etc/passwd
[root@tianyun ~]# grep '^root' /etc/passwd
[root@tianyun ~]# grep 'bash$' /etc/passwd
[root@tianyun ~]# grep '^$' /etc/passwd

[root@tianyun ~]# grep 'ro*' /etc/passwd				# 前导符o出现零次或多次
root:x:0:0:root:/root:/bin/bash
adm:x:3:4:adm:/var/adm:/sbin/nologin
[root@tianyun ~]# grep 'r[ocd]t' /etc/passwd
[root@tianyun ~]# grep 'ro[^ocd]t' /etc/passwd
```

#### 2. 特殊转义序列

- **`\d`** - 数字字符（某些工具不支持，建议用 `[0-9]`）
- **`\w`** - 单词字符（字母、数字、下划线），等同于 `[a-zA-Z0-9_]`
- **`\s`** - 空白字符（空格、制表符等），等同于 `[ \t]`
- **`\b`** - 单词边界
- **`\<`** 和 **`\>`** - 单词开始和结束（Linux 特有）

```bash
[root@tianyun ~]# useradd root111
[root@tianyun ~]# grep 'root' /etc/passwd
root:x:0:0:root:/root:/bin/bash
operator:x:11:0:operator:/root:/sbin/nologin
root111:x:1006:1006::/home/root111:/bin/bash
[root@tianyun ~]# grep 'root\>' /etc/passwd
root:x:0:0:root:/root:/bin/bash
operator:x:11:0:operator:/root:/sbin/nologin
```

#### 3. 量词（需要转义）

- **`\{n\}`** - 精确匹配前导字符 n 次
- **`\{n,\}`** - 至少匹配前导字符 n 次
- **`\{n,m\}`** - 匹配前导字符 n 到 m 次

```bash
[root@tianyun ~]# useradd rooot
[root@tianyun ~]# useradd roooot
[root@tianyun ~]# grep 'ro\{2,3\}' /etc/passwd
[root@tianyun ~]# grep 'ro\{4\}' /etc/passwd
```

### 二、扩展正则表达式(ERE)

使用 `grep -E` 或 `egrep` 时启用 ERE 语法，支持更多元字符而不需要转义。

#### 1. 扩展元字符

- **`+`** - 前导字符出现 `一` 次或多次
- **`?`** - 前导字符出现零次或一次
- **`|`** - 或操作
- **`()`** - 分组
- **`{}`** - 量词（不需要转义）

```bash
[root@tianyun ~]# grep 'ro*' /etc/passwd					# 匹配前导符 'o' 出现零次到多次
root:x:0:0:root:/root:/bin/bash
adm:x:3:4:adm:/var/adm:/sbin/nologin

[root@tianyun ~]# grep -E 'ro+' /etc/passwd					# 匹配前导符 'o' 出现一次到多次
root:x:0:0:root:/root:/bin/bash
operator:x:11:0:operator:/root:/sbin/nologin

[root@tianyun ~]# grep -E 'roo?' /etc/passwd				# 匹配前导符 'o' 出现零次到一次
root:x:0:0:root:/root:/bin/bash
operator:x:11:0:operator:/root:/sbin/nologin
chrony:x:998:996::/var/lib/chrony:/sbin/nologin

[root@tianyun ~]# grep -E 'ro{2}' /etc/passwd				# 匹配前导符 'o' 出现两次
[root@tianyun ~]# grep -E 'ro{2,}' /etc/passwd

[root@tianyun ~]# useradd rooooot
[root@tianyun ~]# grep -E 'r(oo)+' /etc/passwd				# 匹配前导符 'oo' 出现一次到多次
root:x:0:0:root:/root:/bin/bash								# ()后可以接*、+、?、{}
operator:x:11:0:operator:/root:/sbin/nologin
rooot:x:1007:1007::/home/rooot:/bin/bash
roooot:x:1008:1008::/home/roooot:/bin/bash
rooooot:x:1009:1009::/home/rooooot:/bin/bash
```

#### 2. ERE 示例

```bash
# 条件测试中精确匹配数字
[[ "$number" =~ ^[0-9]+$ ]]

# 匹配 "jpg" 或 "zip" 文件
[root@tianyun ~]# ls |grep -E '.jpg|.zip'				
[root@tianyun ~]# ls |grep -E '\.jpg|\.zip'			# '.' 匹配单个任意字符，要原来的. 则需要转义\
```

### 三、Linux 工具中的正则表达式差异

| 工具/命令     | 默认正则类型      | 启用 ERE 的选项 |
| ------------- | ----------------- | --------------- |
| grep          | BRE（基本元字符） | -E              |
| sed           | BRE（基本元字符） | -r              |
| awk           | ERE（扩展元字符） | 默认            |
| bash [[ =~ ]] | ERE（扩展元字符） | 默认            |

### 四、常用正则表达式示例

#### 1. 文件操作

```bash
# 查找当前目录下所有 .txt 和 .zip 文件
[root@tianyun ~]# ls |grep -E '\.txt$|\.zip$'
etc.zip
[root@tianyun ~]# ls |grep -E '\.(txt|zip)$'
etc.zip

# 查找所有以数字开头的文件
[root@tianyun ~]# ls |grep ^[0-9]
9file.txt
```

#### 2. 日志分析

```bash
# 过滤本机 IP 地址
[root@tianyun ~]# ip a |grep -E '\b([0-9]{1,3}\.){3}[0-9]{1,3}\b'
    inet 127.0.0.1/8 scope host lo
    inet 10.9.48.215/24 brd 10.9.48.255 scope global dynamic ens33
[root@tianyun ~]# ip a |grep -E '([0-9]{1,3}\.){3}[0-9]{1,3}'
    inet 127.0.0.1/8 scope host lo
    inet 10.9.48.215/24 brd 10.9.48.255 scope global dynamic ens33
[root@tianyun ~]# ip a |grep -E '\<([0-9]{1,3}\.){3}[0-9]{1,3}\>'
    inet 127.0.0.1/8 scope host lo
    inet 10.9.48.215/24 brd 10.9.48.255 scope global dynamic ens33
```

#### 3. 文本处理

```bash
# 删除空白行
sed '/^$/d' file.txt

# 删除注释行
sed '/^#/d' file.txt
```
