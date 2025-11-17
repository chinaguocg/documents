# Linux chattr

:tada: 2025-11-12 :tada:

## 一、chattr命令概述

`chattr`（Change Attributes）是Linux系统中用于修改文件或目录的扩展属性的强大工具，这些属性比常规权限(rwx)`更底层`，能够提供额外的文件保护和控制机制。

## 二、常用属性标志

| 属性 | 说明                            | 适用场景         |
| ---- | ------------------------------- | ---------------- |
| a    | 仅追加（不可删除/修改已有内容） | 日志文件保护     |
| i    | 不可修改（immutable）           | 系统关键文件保护 |
| A    | 不更新访问时间atime             | 减少磁盘I/O      |
| c    | 压缩存储                        | 节省磁盘空间     |

## 三、使用基础案例

### 案例1：保护系统关键文件（不可修改）
```bash
[root@yangge ~]# touch file100.txt
[root@yangge ~]# lsattr file100.txt 				# 查看文件的属性
---------------- file100.txt

[root@yangge ~]# chattr +i file100.txt 				# 增加i属性
[root@yangge ~]# lsattr file100.txt 
----i----------- file100.txt

测试修改：
[root@yangge ~]# echo "111" > file100.txt 			# 修改失败
-bash: file100.txt: Permission denied

测试删除：
[root@yangge ~]# rm -rf file100.txt 				# 删除失败
rm: cannot remove ‘file100.txt’: Operation not permitted

[root@yangge ~]# chattr -i file100.txt				# 解除保护


实际应用：
[root@yangge ~]# chattr +i /etc/passwd /etc/shadow

[root@yangge ~]# useradd zhuzhuxia					# 创建用户失败，因为不能写相应的文件
useradd: cannot open /etc/passwd
```

### 案例2：日志文件保护（仅追加）
```bash
[root@yangge ~]# touch file200.txt
[root@yangge ~]# chattr +a file200.txt 				# 设置a属性，表示内容可以追加
[root@yangge ~]# lsattr file200.txt 
-----a---------- file200.txt

测试修改：
[root@yangge ~]# echo "222" > file200.txt 			# 修改（以覆盖的方式）
-bash: file200.txt: Operation not permitted

测试追加：									
[root@yangge ~]# echo "222" >> file200.txt 			# 追加成功
[root@yangge ~]# echo "333" >> file200.txt 
[root@yangge ~]# cat file200.txt 
222
333

测试删除：
[root@yangge ~]# rm -rf file200.txt 
rm: cannot remove ‘file200.txt’: Operation not permitted


实际应用：
[root@yangge ~]# chattr +a /var/log/secure

[root@yangge ~]# tailf /var/log/secure
Jul 21 10:57:35 yangge passwd:m: couldn't update the login keyring password: no old password was entered
Jul 21 10:57:48 yangge sshd[4593]: reverse mapping checking getaddrinfo for bogon [192.168.92.1] failed - POSSIBLE BREAK-IN ATTEMPT!
Jul 21 10:57:51 yangge sshd[4593]: Accepted password for hr01 from 192.168.92.1 port 64581 ssh2
Jul 21 10:57:51 yangge sshd[4593]: pam_unix(sshd:session): session opened for user hr01 by (uid=0)
Jul 21 10:58:23 yangge sshd[4687]: reverse mapping checking getaddrinfo for bogon [192.168.92.1] failed - POSSIBLE BREAK-IN ATTEMPT!
Jul 21 10:58:26 yangge sshd[4687]: Accepted password for alice from 192.168.92.1 port 64612 ssh2
Jul 21 10:58:26 yangge sshd[4687]: pam_unix(sshd:session): session opened for user alice by (uid=0)
Jul 21 14:50:22 yangge useradd[7818]: new group: name=user01, GID=1007
Jul 21 14:50:22 yangge useradd[7818]: new user: name=user01, UID=1005, GID=1007, home=/home/user01, shell=/bin/bash
Jul 21 16:18:30 yangge useradd[8996]: failed adding user 'zhuzhuxia', exit code: 1


以下为新产生的日志:

Jul 21 16:27:44 yangge gdm-password]: gkr-pam: unlocked login keyring
Jul 21 16:27:51 yangge gdm-password]: pam_unix(gdm-password:session): session closed for user tianyun
```

### 案例3：减少磁盘I/O（禁用atime更新）

```bash
[root@yangge ~]# mkdir /dir1100
[root@yangge ~]# touch /dir1100/file{1..10000}
[root@yangge ~]# chattr -R +A /dir1100/						# -R 递归

[root@yangge ~]# lsattr -d /dir1100							# -d 查看目录本身
-------A-------- /dir1100

[root@yangge ~]# lsattr /dir1100							# 查看目录下的文件
-------A-------- /dir1100/file9260
-------A-------- /dir1100/file9261
-------A-------- /dir1100/file9262
-------A-------- /dir1100/file9263
-------A-------- /dir1100/file9264
-------A-------- /dir1100/file9265
-------A-------- /dir1100/file9266
```



磁盘IO过高原因：文件操作量大、网络堵塞、磁盘损坏等