# CentOS Linux SSH服务配置

## 一、SSH服务简介

SSH（Secure Shell）是一种加密的网络传输协议，用于在不安全的网络中提供安全的远程登录和其他安全网络服务。

### 主要组件：
- **sshd**：SSH服务器守护进程
- **ssh**：SSH客户端程序
- **scp/sftp**：基于SSH的文件传输工具（其它工具rsync）

## 二、基本安装与配置

### 1. 安装OpenSSH服务器
```bash
sudo yum install openssh-server -y
```

### 2. 启动SSH服务并设置开机自启
```bash
sudo systemctl start sshd
sudo systemctl enable sshd

- ubuntu进程为ssh
```

### 3. 检查服务状态
```bash
sudo systemctl status sshd
```

## 三、SSH服务器配置（/etc/ssh/sshd_config）

### 1. 备份原始配置文件
```bash
[root@tianyun ~]# ls -l /etc/ssh/ssh*_config
-rw-r--r--. 1 root root 2276 Aug  9  2019 /etc/ssh/ssh_config			# 客户端配置文件，通过不需要修改
-rw-------. 1 root root 3905 Sep 17 09:51 /etc/ssh/sshd_config			# 服务器配置文件

sudo cp /etc/ssh/sshd_config /etc/ssh/sshd_config.bak
```

### 2. 常用安全配置选项

#### 修改默认端口（避免暴力破解）
```bash
Port 3333   # 改为非标准端口 0 - 65536（需同步修改防火墙）
```

#### 禁用root直接登录
```bash
PermitRootLogin no
- 默认CentosStream9禁用
```

#### 禁用密码认证（推荐使用密钥登录）
```bash
PasswordAuthentication no
```

#### 限制最大尝试次数（避免暴力破解）
```bash
MaxAuthTries 3
-默认为6次
```

#### 禁用DNS解析（解决远程连接慢的问题）

```bash
UseDNS no
- Ubuntu默认为no
```

### 3. 应用配置修改

```bash
- 关闭SELinux
[root@tianyun ~]# vim /etc/sysconfig/selinux			# 开启不启动（对重启后会影响）
SELINUX=disabled
[root@tianyun ~]# setenforce 0							# 当前关闭

[root@yangge ~]# systemctl restart sshd

[root@yangge ~]# netstat -tnlp |grep :3333				# 新端口3333是否已经监听
tcp        0      0 0.0.0.0:3333            0.0.0.0:*               LISTEN      7878/sshd 
tcp6       0      0 :::3333                 :::*                    LISTEN      7878/sshd 
```

### 4. 防火墙配置

```bash
- 启动防火墙firewalld
[root@tianyun ~]# systemctl start firewalld.service
[root@tianyun ~]# systemctl enable firewalld.service

- 开放3333/tcp端口
[root@tianyun ~]# firewall-cmd --permanent --add-port=3333/tcp		# permanent永久
[root@tianyun ~]# firewall-cmd --reload

-限制源IP访问【可选】
sudo firewall-cmd --permanent --add-rich-rule='rule family="ipv4" source address="192.168.92.0/24" port protocol="tcp" port="3333" accept'
sudo firewall-cmd --reload
```

## 四、ssh客户端工具使用

### 1. ssh远程管理

```bash
- Linux/Unix/Mac（直接使用ssh）
[root@tianyun ~]# ssh 10.9.48.177
The authenticity of host '10.9.48.177 (10.9.48.177)' can't be established.
ECDSA key fingerprint is SHA256:vcJit3bEEX9z3f2JermKlVjd5uf364tW6Wihmsr37r4.
ECDSA key fingerprint is MD5:4d:c1:14:da:e7:f3:fa:6f:40:65:53:37:31:74:7e:6a.
Are you sure you want to continue connecting (yes/no)? yes
Warning: Permanently added '10.9.48.177' (ECDSA) to the list of known hosts.

[root@tianyun ~]# ssh 10.9.48.179					# 以当前用户
root@10.9.48.179's password: 

[tom@tianyun ~]$ ssh 10.9.48.179					# 以当前用户
tom@10.9.48.179's password: 

默认以当前用户的身份连接
[tom@tianyun ~]$ ssh root@10.9.48.179				# 指定连接的用户
root@10.9.48.179's password:

[tom@tianyun ~]$ ssh root@10.9.48.186 -p 3333		# -p指定连接的端口

- windows
putty,xshell,Windterm,MobaXterm
```

### 2. scp远程文件拷贝

```bash
[root@tianyun ~]# scp init.sh root@10.9.48.179:/tmp			# 将本地文件复制到远程主机
[root@tianyun ~]# scp root@10.9.48.179:/etc/passwd /home	# 将远程主机的文件复制到本机

[root@tianyun ~]# scp -r /etc root@10.9.48.179:/tmp
```

### 3. sftp远程文件上传下载

```bash
[root@tianyun ~]# sftp root@10.9.48.179					# 登录到远程主机
root@10.9.48.179's password: 
Connected to 10.9.48.179.
sftp> put /etc/passwd 									# put上传
Uploading /etc/passwd to /root/passwd
/etc/passwd                                  100%  838   235.5KB/s   00:00    
sftp> put /etc/passwd /var/tmp/
Uploading /etc/passwd to /var/tmp/passwd
/etc/passwd 
sftp> get /etc/hosts									# get下载
Fetching /etc/hosts to hosts
/etc/hosts  

ls cd pwd		# 远程主机的
lls lcd lpwd	# 本机的操作l（local）
```

### 4. rsync远程文件传输【增量】

```bash
# 第一次拷贝
HOSTA:
yangge@ubuntu-01:~$ mkdir dir1
yangge@ubuntu-01:~$ touch dir1/file{1..100}
yangge@ubuntu-01:~$ rsync -av dir1 root@192.168.92.100:/tmp		
- dir1 	针对dir1目录
- dir1/	针对dir1目录下的文件

HOSTB:
[root@tianyun ~]# ls /tmp/dir1/
file1    file18  file27  file36  file45  file54  file63  file72  file81  file90
file10   file19  file28  file37  file46  file55  file64  file73  file82  file91
file100  file2   file29  file38  file47  file56  file65  file74  file83  file92

# 第二次拷贝
HOSTA:
yangge@ubuntu-01:~$ touch dir1/file1000							# 增加了文件
yangge@ubuntu-01:~$ echo "yangge...." > dir1/file20 			# 修改了文件
yangge@ubuntu-01:~$ rsync -av dir1 root@192.168.92.100:/tmp		# rsync -av
root@192.168.92.100's password: 
sending incremental file list
dir1/
dir1/file1000
dir1/file20

结论：只复制修改的内容
```

```bash
本地文件删除时，同步将远程服务器上的文件删除--delete：
yangge@ubuntu-01:~$ rm -rf dir1/file5									# 删除了本地文件
yangge@ubuntu-01:~$ rsync -av dir1 root@192.168.92.100:/tmp				# 远程主机file5依然存在
root@192.168.92.100's password: 
sending incremental file list
dir1/

yangge@ubuntu-01:~$ rsync -av dir1 root@192.168.92.100:/tmp --delete	# 同步将远程文件删除
root@192.168.92.100's password: 
sending incremental file list
deleting dir1/file5
```

```bash
/注意事项：
yangge@ubuntu-01:~$ rsync -av dir1 root@192.168.92.100:/var/tmp			# 针对dir1目录本身
yangge@ubuntu-01:~$ rsync -av dir1/ root@192.168.92.100:/var/tmp		# 针对dir1目录下的文件

从远程主机拷贝到本机：
yangge@ubuntu-01:~$ rsync -av root@192.168.92.100:/etc .
```

## 五、SSH密钥认证配置

- 安全
- 没有交互

### 1. 客户端生成密钥对
```bash
[root@tianyun ~]# ssh-keygen				# 生成密钥对

[root@tianyun ~]# ls .ssh/
id_rsa  id_rsa.pub  known_hosts				# id_rsa.pub公钥，id_rsa私钥
```

### 2. 将公钥上传到服务器
```bash
[root@tianyun ~]# ssh-copy-id root@10.9.48.189		# 本次需要使用密码验证
/usr/bin/ssh-copy-id: INFO: Source of key(s) to be installed: "/root/.ssh/id_rsa.pub"
/usr/bin/ssh-copy-id: INFO: attempting to log in with the new key(s), to filter out any that are already installed
/usr/bin/ssh-copy-id: INFO: 1 key(s) remain to be installed -- if you are prompted now it is to install the new keys
root@10.9.48.189's password: 

Number of key(s) added: 1

Now try logging into the machine, with:   "ssh 'root@10.9.48.189'"
and check to make sure that only the key(s) you wanted were added.
```

### 3. 服务器端验证公钥
检查`~/.ssh/authorized_keys`文件是否包含客户端公钥

### 4. 测试密钥登录
```bash
[root@tianyun ~]# ssh 10.9.48.189
Last login: Wed Jul  2 10:11:28 2025 from 10.9.48.186

[root@tianyun ~]# scp -r /etc/passwd root@10.9.48.189:/tmp

[root@tianyun ~]# ssh 10.9.48.189 'hostname'
centos7_01
[root@tianyun ~]# ssh 10.9.48.189 'ip a'
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
       valid_lft forever preferred_lft forever
    inet6 ::1/128 scope host 
       valid_lft forever preferred_lft forever
2: ens33: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc pfifo_fast state UP group default qlen 1000
    link/ether 00:0c:29:13:d0:76 brd ff:ff:ff:ff:ff:ff
    inet 10.9.48.189/24 brd 10.9.48.255 scope global noprefixroute dynamic ens33
       valid_lft 81276sec preferred_lft 81276sec
    inet6 fe80::74b2:3bfd:155d:2546/64 scope link noprefixroute 
       valid_lft forever preferred_lft forever
[root@tianyun ~]# ssh 10.9.48.189 'useradd alice'

[root@tianyun ~]# ssh 10.9.48.189 'mkdir /home/yangge; ls /home'
alice
leo
yangge
```

**练习案例 I — 1台（centos-1）到多台服务器的免密连接**

| 服务器     | IP               | 用户名    | 密码     |
| ---------- | ---------------- | --------- | -------- |
| `centos-1` | `192.168.92.159` | `root`    | `123`    |
| `centos-2` | `192.168.92.160` | `root`    | `123`    |
| `ubuntu-1` | `192.168.92.150` | `yangge`  | `123456` |
| `ubuntu-2` | `192.168.92.151` | `yangge`  | `123456` |
| `ubuntu-3` | `192.168.92.152` | `tianyun` | `123456` |

```bash
- centos-1生成密钥，将公钥传给其它服务器
[root@centos-1 ~]# ssh-keygen
[root@centos-1 ~]# ssh-copy-id root@centos-2				
[root@centos-1 ~]# ssh-copy-id yangge@ubuntu-1
[root@centos-1 ~]# ssh-copy-id yangge@ubuntu-2
[root@centos-1 ~]# ssh-copy-id tianyun@ubuntu-3

- centos1 测试
[root@centos-1 ~]# ssh root@centos-2 'hostname; ip a'				
[root@centos-1 ~]# ssh yangge@ubuntu-1 'hostname; ip a'
[root@centos-1 ~]# ssh yangge@ubuntu-2 'hostname; ip a'
[root@centos-1 ~]# ssh tianyun@ubuntu-3 'hostname; ip a'

- 为什么以下连接没有免密？
[root@centos-1 ~]# ssh yangge@centos2 'hostname; ip a'
```



##### 手工秘钥认证：

1、客户端生成密钥对（无需密码，或设置密钥密码更安全）：

```bash
ssh-keygen -t rsa -b 4096  # -t 指定算法（rsa/ed25519），-b 密钥长度（4096 更安全）
```

2、上传公钥到服务器（两种方式）：

```bash
# 方式1：用 ssh-copy-id 自动上传（推荐）
ssh-copy-id root@192.168.1.100
# 方式2：手动追加公钥到服务器的 ~/.ssh/authorized_keys
cat ~/.ssh/id_rsa.pub | ssh root@192.168.1.100 "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys && chmod 700 ~/.ssh"
```



#### 安全配置：

更改默认端口（避免扫描）：

```bash
Port 2222  # 自定义端口（1-65535，避免与其他服务冲突）
```

禁用 root 直接登录（必须先创建普通用户，用普通用户登录后 su 切换）：

```bash
PermitRootLogin no
```

限制登录用户 / IP（精准控制权限）：

```bash
AllowUsers user1 user2@192.168.1.0/24  # 仅允许 user1、192.168.1 网段的 user2 登录
DenyUsers baduser  # 禁止 baduser 登录
```

限制连接频率（防暴力破解）：

```bash
MaxAuthTries 3  # 最多允许 3 次认证失败
MaxSessions 10  # 最大并发会话数
LoginGraceTime 60s  # 登录超时时间（60秒内未登录则断开）
```

禁用无用功能（减少攻击面）：

```bash
GSSAPIAuthentication no  # 禁用 GSSAPI 认证（加速连接，避免延迟）
UseDNS no  # 禁用 DNS 反向解析（加速连接）
X11Forwarding no  # 禁用 X11 图形转发（无需远程图形时关闭）
```

#### 多密钥管理、密钥密码、代理转发：

多密钥切换（不同服务器用不同密钥）：

客户端创建 `~/.ssh/config` 文件，配置不同主机的密钥映射：

```bash
# ~/.ssh/config 内容
Host server1
  HostName 192.168.1.100
  User root
  Port 2222
  IdentityFile ~/.ssh/id_rsa_server1  # 该服务器专属密钥
Host server2
  HostName 192.168.1.101
  User admin
  IdentityFile ~/.ssh/id_rsa_server2
```

之后直接用 `ssh server1` 即可连接，无需输入 IP 和端口。

密钥密码（passphrase）：生成密钥时设置密码，避免私钥泄露后被滥用，配合 `ssh-agent` 免重复输入密码：

```bash
# 启动 ssh-agent
eval $(ssh-agent -s)
# 添加密钥到 agent（输入一次密码后，后续连接免输）
ssh-add ~/.ssh/id_rsa（ssh-add ~/.ssh/id_ed25519）
#验证私钥
ssh-add -l
```



##### ⭐代理转发（Agent Forwarding）：通过跳板机连接内网服务器，无需在内网服务器存放私钥（安全）：

1. 跳板机、内部服务器需要有公钥。

2. 客户端 `~/.ssh/config` 开启代理转发：

   ```bash
   Host jumpServer
     HostName 192.168.247.151
     User root
     ForwardAgent yes
   
   Host innerServer
     HostName 192.168.247.163
     User root
     ProxyJump jumpServer
     
   Host innerServernode2
     HostName 192.168.247.165
     User root
     ProxyJump jumpServer
   ```

2.直接连接内网服务器：`ssh innerServer`（自动通过跳板机转发密钥认证）。



#### 远程执行命令 / 脚本（自动化运维）

```bash
# 单条命令
ssh root@192.168.1.100 "df -h | grep /home"  # 查看服务器 /home 分区使用率

# 多条命令（用 ; 分隔）
ssh root@192.168.1.100 "yum update -y; systemctl restart nginx"

# 本地脚本上传并执行
scp /local/script.sh root@192.168.1.100:/tmp/ && ssh root@192.168.1.100 "chmod +x /tmp/script.sh && /tmp/script.sh"
```

#### 日志分析（关键：排查登录失败、异常连接）

```bash
# 查看最近 10 条 SSH 日志
tail -10 /var/log/secure

# 筛选登录成功的记录
grep "Accepted" /var/log/secure

# 筛选登录失败的记录（防暴力破解）
grep "Failed" /var/log/secure

# 统计暴力破解的 IP（按失败次数排序）
grep "Failed password" /var/log/secure | awk '{print $11}' | sort | uniq -c | sort -nr
```



**练习案例 II —三台服务器之间的互信**

| 服务器     | IP               | 用户名   | 密码     |
| ---------- | ---------------- | -------- | -------- |
| `centos-1` | `192.168.92.159` | `root`   | `123`    |
| `centos-2` | `192.168.92.160` | `root`   | `123`    |
| `ubuntu`   | `192.168.92.150` | `yangge` | `123456` |

```bash
- centos-1
[root@centos-1 ~]# ssh-keygen
[root@centos-1 ~]# ssh-copy-id root@192.168.92.160				# 将公钥传给centos-2
[root@centos-1 ~]# ssh-copy-id yangge@192.168.92.150			# 将公钥传给ubuntu

- centos-2
[root@centos-2 ~]# ssh-keygen
[root@centos-2 ~]# ssh-copy-id root@192.168.92.159				# 将公钥传给centos-1
[root@centos-2 ~]# ssh-copy-id yangge@192.168.92.150			# 将公钥传给ubuntu

- ubuntu
[root@ubuntu ~]# ssh-keygen
[root@ubuntu ~]# ssh-copy-id root@192.168.92.159				# 将公钥传给centos-1
[root@ubuntu ~]# ssh-copy-id root@192.168.92.160				# 将公钥传给centos-2

- 测试
[root@yangge ~]# ssh root@192.168.92.160 'hostname'
centos-2
[root@yangge ~]# ssh yangge@192.168.92.150 'hostname'
ubuntu
```

## 六、日常维护命令

### 1. 查看当前SSH连接
```bash
sudo netstat -tnpa | grep sshd				# l=Listen a=All所有的状态，包括LISTEN
或
sudo ss -tnap | grep sshd
```

### 2. 查看登录失败记录
```bash
sudo grep -i 'Failed password' /var/log/secure

[root@iZ0jlfng70v1gciuhqx48sZ ~]#  grep 'Failed password' /var/log/secure
Aug  7 09:47:36 iZ0jlfng70v1gciuhqx48sZ sshd[14095]: Failed password for root from 123.119.6.15 port 58501 ssh2
Aug  7 09:47:50 iZ0jlfng70v1gciuhqx48sZ sshd[14095]: Failed password for root from 123.119.6.15 port 58501 ssh2
Aug  7 09:47:52 iZ0jlfng70v1gciuhqx48sZ sshd[14095]: Failed password for root from 123.119.6.15 port 58501 ssh2
Aug  7 09:59:17 iZ0jlfng70v1gciuhqx48sZ sshd[14156]: Failed password for root from 123.119.6.15 port 58801 ssh2
Aug  7 10:15:36 iZ0jlfng70v1gciuhqx48sZ sshd[14408]: Failed password for root from 112.112.62.154 port 22122 ssh2
Aug  7 10:26:57 iZ0jlfng70v1gciuhqx48sZ sshd[14555]: Failed password for root from 123.119.6.15 port 4396 ssh2
Aug  7 10:26:58 iZ0jlfng70v1gciuhqx48sZ sshd[14563]: Failed password for root from 123.119.6.16 port 56200 ssh2
Aug  7 10:27:01 iZ0jlfng70v1gciuhqx48sZ sshd[14563]: Failed password for root from 123.119.6.16 port 56200 ssh2
Aug  7 10:27:01 iZ0jlfng70v1gciuhqx48sZ sshd[14555]: Failed password for root from 123.119.6.15 port 4396 ssh2
Aug  7 10:27:02 iZ0jlfng70v1gciuhqx48sZ sshd[14571]: Failed password for root from 123.119.6.16 port 53003 ssh2
Aug  7 10:27:02 iZ0jlfng70v1gciuhqx48sZ sshd[14565]: Failed password for root from 123.119.6.15 port 58402 ssh2
Aug  7 10:27:03 iZ0jlfng70v1gciuhqx48sZ sshd[14553]: Failed password for root from 123.119.6.16 port 5442 ssh2
Aug  7 10:27:03 iZ0jlfng70v1gciuhqx48sZ sshd[14569]: Failed password for root from 192.144.128.84 port 35406 ssh2
Aug  7 10:27:03 iZ0jlfng70v1gciuhqx48sZ sshd[14571]: Failed password for root from 123.119.6.16 port 53003 ssh2
Aug  7 10:27:04 iZ0jlfng70v1gciuhqx48sZ sshd[14563]: Failed password for root from 123.119.6.16 port 56200 ssh2
Aug  7 10:27:05 iZ0jlfng70v1gciuhqx48sZ sshd[14555]: Failed password for root from 123.119.6.15 port 4396 ssh2
Aug  7 10:27:05 iZ0jlfng70v1gciuhqx48sZ sshd[14571]: Failed password for root from 123.119.6.16 port 53003 ssh2
Aug  7 10:27:06 iZ0jlfng70v1gciuhqx48sZ sshd[14581]: Failed password for root from 123.119.6.15 port 59630 ssh2
Aug  7 10:27:06 iZ0jlfng70v1gciuhqx48sZ sshd[14581]: Failed password for root from 123.119.6.15 port 59630 ssh2
Aug  7 10:27:08 iZ0jlfng70v1gciuhqx48sZ sshd[14569]: Failed password for root from 192.144.128.84 port 35406 ssh2
Aug  7 10:27:09 iZ0jlfng70v1gciuhqx48sZ sshd[14553]: Failed password for root from 123.119.6.16 port 5442 ssh2
Aug  7 10:27:11 iZ0jlfng70v1gciuhqx48sZ sshd[14585]: Failed password for invalid user tom from 123.119.6.15 port 61996 ssh2
```

### 3. 查看成功登录记录
```bash
sudo grep -i 'Accepted password' /var/log/secure
```

### 4. 查看最近登录信息
```bash
[root@iZ0jlfng70v1gciuhqx48sZ ~]# last
root     pts/1        123.119.6.15     Thu Aug  7 10:06 - 10:06  (00:00)    
root     pts/0        123.119.6.15     Thu Aug  7 10:05   still logged in   
root     pts/1        123.119.6.15     Thu Aug  7 09:59 - 10:04  (00:05)    
tianyun  pts/0        123.119.6.15     Thu Aug  7 09:48 - 10:04  (00:16)    
root     pts/0        123.119.6.15     Thu Aug  7 09:45 - 09:47  (00:01)    
root     pts/0        123.119.6.15     Thu Aug  7 09:43 - 09:45  (00:01)    
root     pts/1        100.104.209.116  Wed Aug  6 17:41 - 17:41  (00:00)    
root     pts/1        100.104.209.116  Wed Aug  6 17:41 - 17:41  (00:00)    
root     pts/1        123.119.6.15     Wed Aug  6 17:26 - 17:26  (00:00)    
root     pts/1        123.119.6.15     Wed Aug  6 16:59 - 16:59  (00:00)    
root     pts/0        123.119.6.15     Wed Aug  6 16:49 - 09:39  (16:49)    
reboot   system boot  3.10.0-1160.119. Wed Aug  6 09:32 - 10:29 (1+00:57)  
```

### 5. 查看当前登录的用户

```bash
[root@iZ0jlfng70v1gciuhqx48sZ ~]# w
 10:30:42 up 1 day, 58 min,  1 user,  load average: 0.00, 0.01, 0.05
USER     TTY      FROM             LOGIN@   IDLE   JCPU   PCPU WHAT
root     pts/0    123.119.6.15     10:05    2.00s  0.04s  0.00s w
```

## 七、SELinux【扩展】

```bash
生产环境：建议关闭
红帽考试：强制开启

红帽环境【SELinux默认开启】
[root@yangge ~]# getenforce 
Enforcing									# Enforcing 表示为开启状态

[root@tianyun ~]# vim /etc/ssh/sshd_config
# If you want to change the port on a SELinux system, you have to tell
# SELinux about this change.
# semanage port -a -t ssh_port_t -p tcp #PORTNUMBER

[root@yangge ~]# semanage port -a -t ssh_port_t -p tcp 3333		# 将tcp 3333加到规则中
-bash: semanage: command not found

[root@yangge ~]# yum provides *bin/semanage
[root@yangge ~]# yum -y install policycoreutils-python

[root@yangge ~]# semanage port -a -t ssh_port_t -p tcp 3333
[root@yangge ~]# systemctl restart sshd

准备关闭SELinux：
[root@yangge ~]# setenforce 0				# 临时关闭
[root@yangge ~]# vim /etc/selinux/config	# 开机不启动
SELINUX=disabled
```

## 八、初始化脚本v2.0

```bash
[root@yangge ~]# vim init_v2.0.sh				# 创建系统初始化脚本
#!/bin/bash
# by tianyun v2.0
# CentOS7 system init

#删除系统原有的YUM源
rm -rf /etc/yum.repos.d/*
                 
#配置阿里云基础源（base,extras,updates）
curl https://mirrors.aliyun.com/repo/Centos-7.repo -o /etc/yum.repos.d/CentOS-Base.repo
                 
#配置阿里云EPEL源
curl https://mirrors.aliyun.com/repo/epel-7.repo -o /etc/yum.repos.d/epel.repo
                 
# 清理旧缓存并生成新缓存
yum clean all 
yum makecache 

#安装基本的软件包
yum install -y wget curl vim-enhanced git net-tools bash-completion
  
#关闭防火墙
systemctl stop firewalld
systemctl disable firewalld

#SLinux关闭
setenforce 0
sed -i 's/^SELINUX=enforcing/SELINUX=disabled/' /etc/selinux/config
```

