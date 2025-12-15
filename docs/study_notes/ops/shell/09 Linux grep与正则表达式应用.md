## Linux grep命令与正则表达式应用

`grep` 是 Linux 运维工作中最常用的命令之一，在实际运维场景中 grep 应用广泛，涵盖日志分析、系统监控、故障排查等多个方面。

### 一、基本语法

```bash
grep [选项] 模式 [文件...]
```

### 二、常用选项

| 选项         | 说明                                           |
| ------------ | ---------------------------------------------- |
| `-i`         | 忽略大小写                                     |
| `-v`         | 反向匹配，显示不包含模式的行                   |
| `-n`         | 显示匹配行的行号                               |
| `-c`         | 只显示匹配行的计数（行）                       |
| `-l`         | 只显示包含匹配项的文件名                       |
| `-q`         | 静默输出                                       |
| `-o`         | 仅显示匹配的部分                               |
| `-r` 或 `-R` | 递归搜索目录                                   |
| `-E`         | 使用扩展正则表达式 (等同于egrep)               |
| `-F`         | 不使用正则表达式，按字面意思匹配 (等同于fgrep) |
| `-A num`     | 显示匹配行及其后num行                          |
| `-B num`     | 显示匹配行及其前num行                          |
| `-C num`     | 显示匹配行及其前后各num行                      |

### 三、常用案例

#### 1、查看命令帮助

```bash
# -A -B -C
[root@tianyun ~]# lvcreate --help |grep '-L'			# - 会解析为grep的选项
[root@tianyun ~]# lvcreate --help |grep '\-L'
[root@tianyun ~]# lvcreate --help |grep -A3 '\-L'
[root@tianyun ~]# lvcreate --help |grep -B3 '\-L'
[root@tianyun ~]# lvcreate --help |grep -C3 '\-L'
```

#### 2、检查无效配置

```bash
# 检查Nginx无效配置（注释和空行除外）
[root@tianyun ~]# yum -y install nginx
[root@tianyun ~]# grep -vE "^#|^$" /etc/nginx/nginx.conf
[root@tianyun ~]# grep -vE "^ *#|^$" /etc/nginx/nginx.conf
```

#### 3、检查SSH登录尝试

```bash
# 检查登录失败的IP
[root@tianyun ~]# grep "Invalid user" /var/log/secure
[root@tianyun ~]# grep "Invalid user" /var/log/secure |grep -Eo '([0-9]{1,3}\.){3}[0-9]{1,3}'
[root@tianyun ~]# grep "Invalid user" /var/log/secure |grep -Eo '([0-9]{1,3}\.){3}[0-9]{1,3}' |sort
[root@tianyun ~]# grep "Invalid user" /var/log/secure |grep -Eo '([0-9]{1,3}\.){3}[0-9]{1,3}' |sort |uniq -c

[root@tianyun ~]# grep "Failed password" /var/log/secure
[root@tianyun ~]# grep "Failed password" /var/log/secure*

# 检查登录成功的IP
[root@tianyun ~]# grep -i "Accepted password" /var/log/secure | awk '{print $11}' | sort | uniq
```

#### 4、获取返回值

```bash
# 仅获取返回值 静默输出-q
[root@tianyun ~]# grep "root" /etc/passwd &>/dev/null
[root@tianyun ~]# grep -q "root" /etc/passwd
[root@tianyun ~]# echo $?
```

#### 5、查找文件内容

```bash
# 找到包含内容 'SELINUX=' 的文件
[root@tianyun ~]# grep 'SELINUX=' /etc/*.conf

[root@tianyun ~]# grep 'SELINUX=' /etc					
[root@tianyun ~]# grep -r 'SELINUX=' /etc
[root@tianyun ~]# grep -l -r 'SELINUX=' /etc
```

#### 6、仅显示匹配的部分

```bash
# 搜索/etc/passwd中是否有alice
[root@tianyun ~]# grep -o 'alice' /etc/passwd

# 获得当前主机的所有IP地址
[root@tianyun ~]# ip a |grep 'inet'
[root@tianyun ~]# ip a |grep 'inet\>'
[root@tianyun ~]# ip a |grep 'inet\>' |awk '{print $2}'
[root@tianyun ~]# ip a |grep 'inet\>' |awk '{print $2}' |awk -F/ '{print $1}'
```



