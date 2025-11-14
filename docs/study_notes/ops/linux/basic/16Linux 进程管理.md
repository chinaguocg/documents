# Linux 进程管理

算法只考虑解决问题的方法，通过计算机语言诠释，就是程序，程序运行起来就是进程，就去完成特定的功能。

### 一、进程基本概念

```shell
在Linux系统中：
- 进程是程序的运行实例
- 每个进程有唯一的进程ID（PID）
- 进程有父进程（PPID）
- 进程有运行状态（运行R、睡眠SD、停止T、僵尸Z等）
```

#### 1、进程的生命周期

![](/documents/img/ops/linux/basic/jincheng/01.jpg.png)

​	

```bash
- 父进程复制自己的地址空间（fork）创建一个新的（子）进程结构。每个新进程分配一个唯一的进程 ID （PID），满足跟踪安全性之需。PID 和 父进程 ID （PPID）是子进程环境的元素，任何进程都可以创建子进程，所有进程都是第一个系统进程（systemd）的后代。

- 子进程继承父进程的安全性身份、过去和当前的文件描述符、端口和资源特权、环境变量，以及程序代码。随后，子进程可能exec自己的程序代码。通常，父进程在子进程运行期间处于睡眠（sleeping）状态。当子进程完成时发出（exit）信号请求，在退出时，子进程已经关闭或丢弃了其资源环境，剩余的部分称之为僵停（僵尸Zombie）。父进程在子进程退出时收到信号而被唤醒，清理剩余的结构，然后继续执行其自己的程序码。
```

#### 2、进程的状态

![](/documents/img/ops/linux/basic/jincheng/02.jpg.png)

​                                  所有程序在排队时排的是内核的使用权

CPU: 

特权（内核态）：调用所有的硬件的操作

非特权（用户态）：硬件以外的操作。systemd是用户态的第一个进程

由于站的角度不同，对于内核来说是线程，一个进程运行起来可能同时运行（处理）多个线程（任务），所以扔给内核处理时会显示超过CPU Core（核心数）的线程数

```bash
- 在多任务处理操作系统中，每个CPU（或核心）在一个时间点上只能处理一个进程。在进程运行时，它对CPU 时间和资源分配的要求会不断变化，从而为进程分配一个状态，它随着环境要求而改变。
```

| 状态 (STAT)      | 字母  | 含义                              | 是否占用 CPU                                         | 是否可被强制杀死               |
| :--------------- | :---- | :-------------------------------- | :--------------------------------------------------- | :----------------------------- |
| **运行/可运行**  | **R** | 进程正在CPU执行或在队列中等待执行 | **是** (Running)<br/>**否** (Runnable，但占运行队列) | **是**                         |
| **可中断睡眠**   | **S** | 等待某个事件完成，睡眠可被中断    | **否**                                               | **是**                         |
| **不可中断睡眠** | **D** | 等待硬件I/O，睡眠**不可**被中断   | **否**                                               | **否** (即使是`kill -9`也无效) |
| **已停止**       | **T** | 进程执行被暂停（挂起）            | **否**                                               | **是** (但需先恢复)            |
| **僵尸进程**     | **Z** | 进程已终止，但未被父进程“收尸”    | **否**                                               | **否** (已死亡，无法杀死)      |

### 二、查看进程【静态】

####  1、ps - 进程快照

看到的进程有两种：静态、动态

```bash
[root@tianyun ~]# ps aux 
USER: 			`运行进程的用户`
PID:			`进程ID`
%CPU:  			`CPU占用率`
%MEM: 			`内存占用率`
VSZ:			`占用虚拟内存，虚拟内存用的是硬盘空间，有可能会卡顿延迟的现象`
RSS:  			`占用实际内存(驻留内存)``
TTY:			`进程运行的终端`

STAT:			`进程状态`		
  R 			`运行`
  S 			`可中断睡眠`
  D				`不可中断睡眠`
  T 			`停止的进程`
  Z 			`僵尸进程`
  X    			`死掉的进程`
      
	Ss  		`s进程的领导者，父进程`
	S< 			`<优先级较高的进程`
	SN  		`N优先级较低的进程`
	R+			`+表示是前台的进程组`
	Sl			`以线程的方式运行`
  
START:			`进程的启动时间`
TIME:			`进程占用CPU的总时间`
COMMAND			`进程文件`
```

```shell
- 进程管理学习环境准备
[root@tianyun ~]# systemctl stop nginx
[root@tianyun ~]# systemctl disable nginx

[root@tianyun ~]# yum install -y httpd  	# 安装Apache
[root@tianyun ~]# systemctl start httpd 	# 启动Apache
```

**ps命令必备技巧一：ps aux**

```shell
[root@tianyun ~]# ps aux
[root@tianyun ~]# ps aux --sort=-%cpu |head 		# 按CPU占比排序, -表示降序
[root@tianyun ~]# ps aux --sort=-%mem |head			# 按内存占比排序

[root@tianyun ~]# ps aux |grep httpd
root      78277  0.0  0.2 228316  2236 ?        Ss   15:19   0:00 /usr/sbin/httpd -DFOREGROUND
apache    78278  0.0  0.1 230400  1892 ?        S    15:19   0:00 /usr/sbin/httpd -DFOREGROUND
apache    78279  0.0  0.1 230400  1892 ?        S    15:19   0:00 /usr/sbin/httpd -DFOREGROUND
apache    78280  0.0  0.1 230400  1892 ?        S    15:19   0:00 /usr/sbin/httpd -DFOREGROUND
apache    78281  0.0  0.1 230400  1892 ?        S    15:19   0:00 /usr/sbin/httpd -DFOREGROUND
apache    78282  0.0  0.1 230400  1892 ?        S    15:19   0:00 /usr/sbin/httpd -DFOREGROUND
root      78862  0.0  0.0 112816   980 pts/1    S+   16:02   0:00 grep --color=auto httpd

[root@tianyun ~]# ps aux |grep sshd
root       2845  0.0  0.1 112900  1092 ?        Ss   10:15   0:00 /usr/sbin/sshd -D
root       2860  0.0  0.1 156776  1676 ?        Ss   10:16   0:01 sshd: root@pts/1
root      78872  0.0  0.0 112816   980 pts/1    S+   16:02   0:00 grep --color=auto sshd
```

**ps命令必备技巧二：ps -eo 显示自定义字段**

```shell
[root@tianyun ~]# ps -eo cmd,pid,ppid,user,%cpu,%mem,stat,start_time |head 
CMD                            PID   PPID USER     %CPU %MEM STAT START
/usr/lib/systemd/systemd --      1      0 root      0.0  0.3 Ss   Jun18
[kthreadd]                       2      0 root      0.0  0.0 S    Jun18
[kworker/0:0H]                   4      2 root      0.0  0.0 S<   Jun18
[ksoftirqd/0]                    6      2 root      0.0  0.0 S    Jun18
[migration/0]                    7      2 root      0.0  0.0 S    Jun18
[rcu_bh]                         8      2 root      0.0  0.0 S    Jun18
[rcu_sched]                      9      2 root      0.0  0.0 R    Jun18
[lru-add-drain]                 10      2 root      0.0  0.0 S<   Jun18
[watchdog/0]                    11      2 root      0.0  0.0 S    Jun1	

`cmd		进程名`
`pid		进程ID`
`ppid		父进程ID`
`user		运行用户`
`%cpu		CPU使用率`
`%mem		内存使用率`
`stat		进程状态status`
`start_time	进程启动时间`

[root@tianyun ~]# ps -eo cmd,pid,%cpu |head 
CMD                            PID %CPU
/usr/lib/systemd/systemd --      1  0.0
[kthreadd]                       2  0.0
[kworker/0:0H]                   4  0.0
[ksoftirqd/0]                    6  0.0
[migration/0]                    7  0.0
[rcu_bh]                         8  0.0
[rcu_sched]                      9  0.0
[lru-add-drain]                 10  0.0
[watchdog/0]                    11  0.0

[root@tianyun ~]# ps -eo cmd,pid,%cpu --sort=-%cpu |head
CMD                            PID %CPU
/usr/bin/vmtoolsd              754  0.1
/usr/bin/gnome-shell         19907  0.1
/usr/lib/systemd/systemd --      1  0.0
[kthreadd]                       2  0.0
[kworker/0:0H]                   4  0.0
[ksoftirqd/0]                    6  0.0
[migration/0]                    7  0.0
[rcu_bh]                         8  0.0
[rcu_sched]                      9  0.0

[root@tianyun ~]# ps -eo cmd,pid,%cpu,%mem --sort=-%mem |head
CMD                            PID %CPU %MEM
/usr/bin/gnome-shell         19907  0.1  7.7
/usr/bin/gnome-software --g  20230  0.0  5.3
/usr/bin/X :0 -background n  19412  0.0  2.2
/usr/libexec/gnome-terminal  22279  0.0  1.0
/usr/bin/python2 -Es /usr/s   1233  0.0  0.9
nautilus-desktop --force     20199  0.0  0.8
/usr/sbin/libvirtd            1243  0.0  0.7
/usr/libexec/tracker-store   20319  0.0  0.7
/usr/libexec/gsd-xsettings   20091  0.0  0.6
```

#### **2、pstree - 进程树**

```bash
[root@tianyun ~]# pstree
systemd─┬─NetworkManager─┬─dhclient
        │                └─2*[{NetworkManager}]
        ├─VGAuthService
        ├─auditd───{auditd}
        ├─chronyd
        ├─crond
        ├─dbus-daemon───{dbus-daemon}
        ├─httpd───5*[httpd]
        ├─irqbalance
        ├─login───bash
        ├─lvmetad
        ├─master─┬─pickup
        │        └─qmgr
        ├─polkitd───6*[{polkitd}]
        ├─rsyslogd───2*[{rsyslogd}]
        ├─sshd───sshd───bash───pstree
        ├─systemd-journal
        ├─systemd-logind
        ├─systemd-udevd
        ├─tuned───4*[{tuned}]
        └─vmtoolsd───2*[{vmtoolsd}]

[root@tianyun ~]# pstree |grep httpd					# 过滤 httpd 进程
        |-httpd---5*[httpd]								# 5*表示5个此名进程
		
[root@tianyun ~]# pstree -p |grep httpd					# 显示带有PID的进程树
           |-httpd(1704)-+-httpd(1706)
           |             |-httpd(1707)
           |             |-httpd(1708)
           |             |-httpd(1709)
           |             `-httpd(1710)
           					

- 知识点扩展
[root@tianyun ~]# pstree -u tianyun						# 查看tianyun用的进程
No processes found.
           					
[root@tianyun ~]# pstree -ps 1708						# 查看某个进程（PID）的完整父子关系
systemd(1)───httpd(1704)───httpd(1708)
 
[root@tianyun ~]# pstree -ps 1704
systemd(1)───httpd(1704)─┬─httpd(1706)
                         ├─httpd(1707)
                         ├─httpd(1708)
                         ├─httpd(1709)
                         └─httpd(1710)
```

#### 3、**lsof - 查看端口占用 **

```bash
[root@tianyun ~]# yum -y install lsof

[root@tianyun ~]# lsof -i :80				# 查看 80 端口当前被哪个进程占用
COMMAND  PID   USER   FD   TYPE DEVICE SIZE/OFF NODE NAME
httpd   1704   root    4u  IPv6  24895      0t0  TCP *:http (LISTEN)
httpd   1706 apache    4u  IPv6  24895      0t0  TCP *:http (LISTEN)
httpd   1707 apache    4u  IPv6  24895      0t0  TCP *:http (LISTEN)
httpd   1708 apache    4u  IPv6  24895      0t0  TCP *:http (LISTEN)
httpd   1709 apache    4u  IPv6  24895      0t0  TCP *:http (LISTEN)
httpd   1710 apache    4u  IPv6  24895      0t0  TCP *:http (LISTEN)

[root@tianyun ~]# lsof -i :22				# 查看 22 端口当前被哪个进程占用
COMMAND  PID USER   FD   TYPE DEVICE SIZE/OFF NODE NAME
sshd    1136 root    3u  IPv4  21683      0t0  TCP *:ssh (LISTEN)
sshd    1136 root    4u  IPv6  21685      0t0  TCP *:ssh (LISTEN)
sshd    1620 root    3u  IPv4  25724      0t0  TCP tianyun:ssh->tianyun:57956 (ESTABLISHED)

# 案例
[root@tianyun ~]# yum -y install nginx
[root@tianyun ~]# systemctl start nginx
Job for nginx.service failed because the control process exited with error code. See "systemctl status nginx.service" and "journalctl -xe" for details.

Nginx服务启动失败！！！ 提醒查看日志 journalctl -xe

[root@tianyun ~]# journalctl -xe
Jul 24 11:43:11 tianyun nginx[1843]: nginx: [emerg] bind() to 0.0.0.0:80 failed (98: Address alread
Jul 24 11:43:11 tianyun nginx[1843]: nginx: [emerg] bind() to [::]:80 failed (98: Address already i
Jul 24 11:43:11 tianyun nginx[1843]: nginx: [emerg] bind() to 0.0.0.0:80 failed (98: Address alread

通过日志发现，80端口被占用。需要找到是哪个进程占用了80端口

[root@tianyun ~]# lsof -i :80
COMMAND  PID   USER   FD   TYPE DEVICE SIZE/OFF NODE NAME
httpd   1704   root    4u  IPv6  24895      0t0  TCP *:http (LISTEN)
httpd   1706 apache    4u  IPv6  24895      0t0  TCP *:http (LISTEN)
httpd   1707 apache    4u  IPv6  24895      0t0  TCP *:http (LISTEN)
httpd   1708 apache    4u  IPv6  24895      0t0  TCP *:http (LISTEN)
httpd   1709 apache    4u  IPv6  24895      0t0  TCP *:http (LISTEN)
httpd   1710 apache    4u  IPv6  24895      0t0  TCP *:http (LISTEN)

[root@tianyun ~]# systemctl stop httpd				# 停止Apache服务
[root@tianyun ~]# systemctl disable httpd			# 设置开机不自动运行

[root@tianyun ~]# lsof -i :80						# 再次查看80端口是否被占用，目前未占用
[root@tianyun ~]# systemctl start nginx				# 再次启动Nginx服务，正常

作业： 学习lsof命令，例如查看某个打开的文件是被 某个进程使用
[root@tianyun ~]# lsof /etc/hosts
```

#### 4、netstat - 查看监听端口

```shell
client -----> 192.168.92.148 ???					# 不知道要访问什么服务

client (ssh://) -----> 	192.168.92.148:22			# sshd远程连接服务
client (http://) ----> 	192.168.92.148:80			# Web服务（Nginx,Apache）
client (mysql) 	-----> 	192.168.92.148:3306			# MySQL数据库服务
client (ftp://) -----> 	192.168.92.148:21			# FTP服务

# 查看网络进程 和 正在监听（LISTEN）的端口
[root@tianyun ~]# netstat -tnlp    (该命令对应的包名：net-tools)
参数详解：
-u  udp传输协议（飞机运输）
-t  tcp传输协议（火车运输）
-p  显示进程的名称和pid
-l 	只显示正在被监听(LISTEN)端口的状态 
-a 	显示端口的所有状态(LISTEN,ESTABLISHED,CLOSED...)
-n  不解析don't resolve names，例如别将80解析为http

# -anlp 常用# -anlp 常用# -anlp 常用
# -anlp 常用# -anlp 常用# -anlp 常用

# 显示所有监听的端口LISTEN
[root@tianyun ~]# netstat -tnlp
Active Internet connections (only servers)
Proto Recv-Q Send-Q Local Address           Foreign Address         State       PID/Program name    
tcp        0      0 0.0.0.0:80              0.0.0.0:*               LISTEN      1920/nginx: master  
tcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN      1136/sshd           
tcp        0      0 127.0.0.1:25            0.0.0.0:*               LISTEN      1309/master         
tcp6       0      0 :::80                   :::*                    LISTEN      1920/nginx: master  
tcp6       0      0 :::22                   :::*                    LISTEN      1136/sshd           
tcp6       0      0 ::1:25                  :::*                    LISTEN      1309/master  

# 显示所有监听的端口LISTEN（未加p，不显示PID和进程名）
[root@tianyun ~]# netstat -tnl
Active Internet connections (only servers)
Proto Recv-Q Send-Q Local Address           Foreign Address         State      
tcp        0      0 0.0.0.0:80              0.0.0.0:*               LISTEN     
tcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN     
tcp        0      0 127.0.0.1:25            0.0.0.0:*               LISTEN     
tcp6       0      0 :::80                   :::*                    LISTEN     
tcp6       0      0 :::22                   :::*                    LISTEN     
tcp6       0      0 ::1:25                  :::*                    LISTEN 

# 显示所有监听的端口LISTEN（未加n，不解析don't resolve names，例如不要将80解析为http）
[root@tianyun ~]# netstat -tlp
Active Internet connections (only servers)
Proto Recv-Q Send-Q Local Address           Foreign Address         State       PID/Program name    
tcp        0      0 0.0.0.0:http            0.0.0.0:*               LISTEN      1920/nginx: master  
tcp        0      0 0.0.0.0:ssh             0.0.0.0:*               LISTEN      1136/sshd           
tcp        0      0 localhost:smtp          0.0.0.0:*               LISTEN      1309/master         
tcp6       0      0 [::]:http               [::]:*                  LISTEN      1920/nginx: master  
tcp6       0      0 [::]:ssh                [::]:*                  LISTEN      1136/sshd           
tcp6       0      0 localhost:smtp          [::]:*                  LISTEN      1309/master  

# 显示端口的所有状态（-a）
[root@tianyun ~]# netstat -tnap
Active Internet connections (servers and established)
Proto Recv-Q Send-Q Local Address           Foreign Address         State       PID/Program name    
tcp        0      0 0.0.0.0:80              0.0.0.0:*               LISTEN      1920/nginx: master  
tcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN      1136/sshd           
tcp        0      0 127.0.0.1:25            0.0.0.0:*               LISTEN      1309/master         
tcp        0     36 192.168.92.148:22       192.168.92.1:57956      ESTABLISHED 1620/sshd: root@pts 
tcp6       0      0 :::80                   :::*                    LISTEN      1920/nginx: master  
tcp6       0      0 :::22                   :::*                    LISTEN      1136/sshd           
tcp6       0      0 ::1:25                  :::*                    LISTEN      1309/master  

- 实用案例：

# 查看22号端口是否在监听（LISTEN）
[root@tianyun ~]# netstat -tnlp |grep :22
tcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN      1136/sshd           
tcp6       0      0 :::22                   :::*                    LISTEN      1136/sshd

# 查看22号端口的所有状态（LISTEN,ESTABLISHED.....）
[root@tianyun ~]# netstat -tnap |grep :22
tcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN      1136/sshd           
tcp        0     36 192.168.92.148:22       192.168.92.1:57956      ESTABLISHED 1620/sshd: root@pts 
tcp6       0      0 :::22                   :::*                    LISTEN      1136/sshd  

# 查看80号端口是否在监听（LISTEN）
[root@tianyun ~]# netstat -tnlp |grep :80
tcp        0      0 0.0.0.0:80              0.0.0.0:*               LISTEN      1920/nginx: master  
tcp6       0      0 :::80                   :::*                    LISTEN      1920/nginx: master      

# 查看80号端口的所有状态（LISTEN,ESTABLISHED.....）
[root@tianyun ~]# netstat -tnap |grep :80
tcp        0      0 0.0.0.0:80              0.0.0.0:*               LISTEN      1920/nginx: master  
tcp        0      0 192.168.92.148:80       192.168.92.1:56015      ESTABLISHED 1921/nginx: worker  
tcp        0      0 192.168.92.148:80       192.168.92.1:56011      ESTABLISHED 1921/nginx: worker  
tcp        0      0 192.168.92.148:80       192.168.92.1:56013      ESTABLISHED 1924/nginx: worker  
tcp6       0      0 :::80                   :::*                    LISTEN      1920/nginx: master

- 核心需要记住用法：
[root@tianyun ~]# netstat -tnlp
[root@tianyun ~]# netstat -tnlp |grep :22

[root@tianyun ~]# netstat -tnlp |grep :80
[root@tianyun ~]# netstat -tnap |grep :22

- ss命令功能和netstat等价
```

#### 5、ss - 查看监听端口

```bash
[root@tianyun ~]# ss -tnlp

[root@tianyun ~]# ss -tnlp |grep :22
LISTEN     0      128          *:22       *:*                   users:(("sshd",pid=2845,fd=3))
LISTEN     0      128       [::]:22      [::]:*                 users:(("sshd",pid=2845,fd=4))
```

### 三、查看进程【动态】

#### 1、**top** - 实时系统监控       

`top` 界面分为 **顶部汇总信息** 和 **进程列表** 两部分：

**顶部汇总信息**

```
top - 14:30:45 up 10 days,  3:45,  2 users,  load average: 2.94, 4.48, 5.20
Tasks: 120 total,   2 running, 118 sleeping,   0 stopped,   0 zombie
%Cpu(s):  5.3 us,  1.2 sy,  0.0 ni, 93.5 id,  0.0 wa,  0.0 hi,  0.0 si,  0.0 st
MiB Mem :   7845.2 total,   1024.5 free,   4096.3 used,   2724.4 buff/cache
MiB Swap:   2048.0 total,   2048.0 free,      0.0 used.   3200.2 avail Mem
```

- **第 1 行**（系统运行状态）：

  - `14:30:45`：当前时间
  - `up 10 days, 3:45`：系统已运行时间
  - `2 users`:  当前系统登录的用户数
  - `load average: 2.94, 4.48, 5.20`：系统 **1 分钟、5 分钟、15 分钟** 的平均负载（`≤ CPU 核心数` 表示正常）

  ![](/documents/img/ops/linux/basic/jincheng/03.jpg.png)

- **第 2 行**（任务状态）：

  - `Tasks: 120 total`：总进程数
  - `2 running`：正在运行的进程数
  - `118 sleeping`：休眠的进程数
  - `0 stopped`：停止的进程数
  - `0 zombie`：僵尸进程数（若不为 0，需检查）

- **第 3 行**（CPU 使用情况）：

  - `5.3 us`：用户空间占用 CPU 百分比
  - `1.2 sy`：内核空间占用 CPU 百分比
  - `0.0 ni`:  修改过优先级进程占用 CPU 百分比
  - `93.5 id`：**空闲 CPU 百分比**
  - `0.0 wa`：**I/O 等待占用 CPU 百分比（若高，可能磁盘瓶颈）**
  - `0.0 st`：虚拟机偷取时间（仅虚拟化环境）

- **第 4 行**（内存使用情况）：

  - `7845.2 total`：总内存
  - `1024.5 free`：空闲内存
  - `4096.3 used`：已用内存
  - `2724.4 buff/cache`：缓存/缓冲区内存（可释放）

- **第 5 行**（交换分区 Swap）：

  - `2048.0 total`：Swap 总大小
  - `2048.0 free`：空闲 Swap
  - `0.0 used`：已用 Swap（若高，可能内存不足）

**进程列表**

```
  PID USER      PR  NI    VIRT    RES    SHR S  %CPU %MEM     TIME+ COMMAND
 1234 root      20   0  123456  78912   3456 R   6.2  1.0   5:30.45 firefox
 5678 mysql     20   0  456789 123456  67890 S   3.1  1.5  10:15.30 mysqld
```

| 列名        | 说明                                                       |
| ----------- | ---------------------------------------------------------- |
| **PID**     | 进程 ID                                                    |
| **USER**    | 进程所属用户                                               |
| **PR**      | 进程优先级（值越小优先级越高）                             |
| **NI**      | Nice 值（-20 最高优先级，19 最低）                         |
| **VIRT**    | 进程使用的虚拟内存（KB）                                   |
| **RES**     | 进程使用的物理内存（KB）                                   |
| **SHR**     | 共享内存大小（KB）                                         |
| **S**       | 进程状态（`R`=运行, `S`=休眠, `Z`=僵尸, `D`=不可中断休眠） |
| **%CPU**    | 进程占用 CPU 百分比                                        |
| **%MEM**    | 进程占用内存百分比                                         |
| **TIME+**   | 进程占用 CPU 时间（格式 `分:秒.毫秒`）                     |
| **COMMAND** | 进程命令名                                                 |

**`top` 交互命令**

在 `top` 运行时，可以按以下快捷键操作：

| 快捷键          | 功能                                                 |
| --------------- | ---------------------------------------------------- |
| **`q`**         | 退出 `top`                                           |
| **`k`**         | 杀死进程（输入 PID，再输入信号，默认 `15`）          |
| **`r`**         | 调整进程优先级（输入 PID，再输入 `Nice` 值）         |
| **`P`**         | 按 **CPU 使用率** 排序                               |
| **`M`**         | 按 **内存使用率** 排序                               |
| **`T`**         | 按 **CPU 时间** 排序                                 |
| **`1`**         | 显示 **所有 CPU 核心** 的单独使用情况                |
| **`h`**         | 显示帮助菜单                                         |
| **`Shift + >`** | 向右滚动进程列表（查看完整命令）                     |
| **`Shift + <`** | 向左滚动进程列表                                     |
| **`z`**         | 切换颜色显示                                         |
| **`W`**         | 保存当前 `top` 配置到 `~/.toprc`（下次启动自动加载） |

---

**`top` 命令行参数**

```bash
[root@tianyun ~]# top -d 5           					# 设置刷新间隔为 5 秒
[root@tianyun ~]# top -p 1234,5678   					# 仅监控 PID 1234 和 5678
[root@tianyun ~]# top -u apache       					# 仅显示 apache 用户的进程
[root@tianyun ~]# top -b -n 3							# 以批处理模式运行 3 次
[root@tianyun ~]# top -b -n 3 > top.log  				# 以批处理模式运行 3 次，输出到文件
[root@tianyun ~]# top -u apache -b -n 3 > top.txt		# 批处理模式查看apache用户的进程3次，输出文件
```

#### 2、**htop** - 实时系统监控

```shell
[root@tianyun ~]# yum list htop
Loaded plugins: fastestmirror, langpacks
Loading mirror speeds from cached hostfile
 * base: mirrors.aliyun.com
 * extras: mirrors.aliyun.com
 * updates: mirrors.aliyun.com
Available Packages
htop.x86_64            2.2.0-3.el7                       epel

[root@tianyun ~]# yum -y install htop
[root@tianyun ~]# htop

注：htop软件包由EPEL源提供
```

### 四、进程控制 - kill

```shell
[root@tianyun ~]# kill -l   #查看所有信号
 1) SIGHUP       2) SIGINT       3) SIGQUIT      4) SIGILL       5) SIGTRAP
 6) SIGABRT      7) SIGBUS       8) SIGFPE       9) SIGKILL     10) SIGUSR1
11) SIGSEGV     12) SIGUSR2     13) SIGPIPE     14) SIGALRM     15) SIGTERM
16) SIGSTKFLT   17) SIGCHLD     18) SIGCONT     19) SIGSTOP     20) SIGTSTP
21) SIGTTIN     22) SIGTTOU     23) SIGURG      24) SIGXCPU     25) SIGXFSZ
26) SIGVTALRM   27) SIGPROF     28) SIGWINCH    29) SIGIO       30) SIGPWR
31) SIGSYS      34) SIGRTMIN    35) SIGRTMIN+1  36) SIGRTMIN+2  37) SIGRTMIN+3
38) SIGRTMIN+4  39) SIGRTMIN+5  40) SIGRTMIN+6  41) SIGRTMIN+7  42) SIGRTMIN+8
43) SIGRTMIN+9  44) SIGRTMIN+10 45) SIGRTMIN+11 46) SIGRTMIN+12 47) SIGRTMIN+13
48) SIGRTMIN+14 49) SIGRTMIN+15 50) SIGRTMAX-14 51) SIGRTMAX-13 52) SIGRTMAX-12
53) SIGRTMAX-11 54) SIGRTMAX-10 55) SIGRTMAX-9  56) SIGRTMAX-8  57) SIGRTMAX-7
58) SIGRTMAX-6  59) SIGRTMAX-5  60) SIGRTMAX-4  61) SIGRTMAX-3  62) SIGRTMAX-2
63) SIGRTMAX-1  64) SIGRTMAX

-1   HUP  重新加载reload进程或者重新加载配置文件，PID不变
-9   KILL 强制杀死
-15  TERM 正常终止(这个信号可以默认不写)

-18  CONT 激活进程
-19  STOP 挂起（暂停）进程
```

#### **kill案例一**

```shell
以Apache为实验场景，把Nginx关闭

[root@tianyun ~]# systemctl stop httpd			# 停止Apache（httpd）服务 相当于信号15
[root@tianyun ~]# systemctl restart httpd		# 重启Apache（httpd）服务
```

```shell
[root@tianyun ~]# ps aux |grep httpd			# 查看当前是否启动
root      38466  0.1  0.2 230444  5232 ?        Ss   11:06   0:00 /usr/sbin/httpd -DFOREGROUND
apache    38471  0.0  0.1 232528  3152 ?        S    11:06   0:00 /usr/sbin/httpd -DFOREGROUND
apache    38472  0.0  0.1 232528  3152 ?        S    11:06   0:00 /usr/sbin/httpd -DFOREGROUND
apache    38473  0.0  0.1 232528  3152 ?        S    11:06   0:00 /usr/sbin/httpd -DFOREGROUND
apache    38474  0.0  0.1 232528  3152 ?        S    11:06   0:00 /usr/sbin/httpd -DFOREGROUND
apache    38475  0.0  0.1 232528  3152 ?        S    11:06   0:00 /usr/sbin/httpd -DFOREGROUND

[root@tianyun ~]# kill -15 38466				# 发送正常的停止信号
[root@tianyun ~]# ps aux |grep httpd
root      38535  0.0  0.0 112808   968 pts/1    S+   11:10   0:00 grep --color=auto httpd


[root@tianyun ~]# systemctl start httpd
[root@tianyun ~]# ps aux |grep httpd
root      38551  1.0  0.2 230444  5228 ?        Ss   11:11   0:00 /usr/sbin/httpd -DFOREGROUND
apache    38555  0.0  0.1 232528  3148 ?        S    11:11   0:00 /usr/sbin/httpd -DFOREGROUND
apache    38556  0.0  0.1 232528  3148 ?        S    11:11   0:00 /usr/sbin/httpd -DFOREGROUND
apache    38557  0.0  0.1 232528  3148 ?        S    11:11   0:00 /usr/sbin/httpd -DFOREGROUND
apache    38558  0.0  0.1 232528  3148 ?        S    11:11   0:00 /usr/sbin/httpd -DFOREGROUND
apache    38559  0.0  0.1 232528  3148 ?        S    11:11   0:00 /usr/sbin/httpd -DFOREGROUND

[root@tianyun ~]# killall httpd					# killall跟进程名，信号15为默认信号
[root@tianyun ~]# ps aux |grep httpd
root      38589  0.0  0.0 112808   968 pts/1    R+   11:12   0:00 grep --color=auto httpd
```

#### **kill案例二**

```shell
信号TERM 15（正常终止）
[root@tianyun ~]# vim /etc/hosts			 	# 打开着，等待接收信号
[root@tianyun ~]# ps aux |grep vim
root      38654  0.0  0.2 149300  5040 pts/0    S+   11:15   0:00 vim /etc/hosts
[root@tianyun ~]# kill -15 38654				
发送信号后，观察vim变化

信号KILL 9（强制终止）
[root@tianyun ~]# vim /etc/hosts			 	# 重新打开，等待接收信号
[root@tianyun ~]# ps aux |grep vim
root      38732  0.0  0.2 149300  5060 pts/0    S+   11:20   0:00 vim /etc/hosts
[root@tianyun ~]# kill -9 38732
发送信号后，观察vim变化
Found a awap file by the name "/etc/.hosts.swp"	 # 产生了交换文件
```

### 五、其它命令

#### **1. 查看当前CPU负载**  

```shell
[root@tianyun ~]# uptime 
 17:35:01 up 16:02,  3 users,  load average: 0.00, 0.02, 0.05
```

#### **2. 查看内存使用**

```shell
[root@tianyun ~]# free -m
              total        used        free      shared  buff/cache   available
Mem:           1819         858         156          21         804         768
Swap:          2047          16        2031

[root@tianyun ~]# free -h
              total        used        free      shared  buff/cache   available
Mem:           1.8G        858M        156M         21M        804M        768M
Swap:          2.0G         16M        2.0G
```

#### **3. 查看系统的版本和内核**

```shell
[root@tianyun ~]# cat /etc/redhat-release  	#查看操作系统版本
CentOS Linux release 7.4.1708 (Core)

[root@tianyun ~]# uname -r  				#查看内核版本
3.10.0-1160.el7.x86_64
```

#### **4. 查看CPU相关信息**

```bash
[root@tianyun ~]# lscpu 					# 查看cpu相关信息
Architecture:          x86_64
CPU op-mode(s):        32-bit, 64-bit
Byte Order:            Little Endian
CPU(s):                32					# CPU总的数量
On-line CPU(s) list:   0-31
Thread(s) per core:    2					# 每个核心的线程数
Core(s) per socket:    8					# 每个物理CPU的核数
Socket(s):             2					# 物理CPU的数量

[root@tianyun ~]# nproc						# 统计CPU的数量
32
```

```shell
查看服务器CPU架构
[root@tianyun ~]# lscpu
Architecture:          x86_64

[root@tianyun ~]# uname -m
x86_64

# 输出示例：
x86_64    # 表示x86_64架构
aarch64   # 表示ARM64架构
ppc64le   # 表示POWER架构

https://www.centos.org		
CentOS-Stream-9-latest-x86_64-dvd1.iso			# X86_64架构镜像
CentOS-Stream-9-latest-aarch64-dvd1.iso			# ARM架构镜像

https://ubuntu.com

注：CPU架构影响到系统镜像ISO文件的选择，以及软件包的选择
```

### 六、作业管理 - job

```bash
# 案例I
[root@tianyun ~]# vim /etc/hosts 					# ^Z将其暂停到后台

[1]+  Stopped                 vim top.txt
[root@tianyun ~]# ps aux |grep vim					# T状态表示STOP
root      41099  0.0  0.2 149316  5068 pts/1    T    14:43   0:00 vim top.txt
root      41101  0.0  0.0 112808   964 pts/1    S+   14:43   0:00 grep --color=auto vim

[root@tianyun ~]# date								# 模拟做了一些其它的工作
[root@tianyun ~]# fg								# 将其调回到前台

# 案例II
[root@tianyun ~]# vim yangge.txt					# ^Z将其暂停到后台
[root@tianyun ~]# top								# ^Z将其暂停到后台

[root@tianyun ~]# jobs 								# 查看后台作业
[1]-  Stopped                 vim yang
[2]+  Stopped                 top

[root@tianyun ~]# fg								# 将最新的一个作业调回到前台(top)
[root@tianyun ~]# fg 1								# 将作业号1的进程调回到前台(vim)，也可以fg %1

# 案例III
[root@tianyun ~]# sleep 5000						# 默认为前台运行，^Z将其暂停到后台
^Z
[1]+  Stopped                 sleep 5000		
[root@tianyun ~]# ps aux |grep sleep				# sleep进程在后台目前为停止状态 T
root      16161  0.0  0.0 108052   352 pts/0    T    09:38   0:00 sleep 5000
root      16165  0.0  0.0 112808   964 pts/0    S+   09:39   0:00 grep --color=auto sleep

[root@tianyun ~]# bg 1								# 让作业号为1的进程，在后台运行
[1]+ sleep 5000 &
[root@tianyun ~]# jobs 			
[1]+  Running                 sleep 5000 &
[root@tianyun ~]# ps aux |grep sleep
root      16161  0.0  0.0 108052   352 pts/0    S    09:38   0:00 sleep 5000
root      16167  0.0  0.0 112808   964 pts/0    S+   09:40   0:00 grep --color=auto sleep

# 案例IV
[root@tianyun ~]# sleep 6000 &						# 一启动，就注定在后台运行
[1] 16168											# 1为作业号，16168为PID

[root@tianyun ~]# jobs
[1]+  Running                 sleep 6000 &


- 其它扩展
[root@tianyun ~]# kill 16168						# 使用PID杀（发信号）
[root@tianyun ~]# kill %1							# 使用作业号杀（发信号），kill 1表示PID为1的进程
[root@tianyun ~]# jobs
[1]+  Terminated              sleep 6000
```

### **七、扩展知识-常用协议及对应端口**

---

```bash
/etc/services
0-1023: 知名端口
```

#### **1. 基础网络协议【重点关注】**

| 协议      | 端口  | 说明                      | 典型应用       |
| --------- | ----- | ------------------------- | -------------- |
| **HTTP**  | 80    | 超文本传输协议            | 网页浏览       |
| **HTTPS** | 443   | 加密的HTTP                | 安全网页/API   |
| **FTP**   | 20/21 | 文件传输协议（数据/控制） | 文件上传下载   |
| **SSH**   | 22    | 安全Shell协议             | 远程管理服务器 |

#### **2. 邮件协议**

| 协议      | 端口 | 说明                     |
| --------- | ---- | ------------------------ |
| **SMTP**  | 25   | 邮件发送协议（明文）     |
| **SMTPS** | 465  | 加密的SMTP               |
| **POP3**  | 110  | 邮件接收协议（明文）     |
| **POP3S** | 995  | 加密的POP3               |
| **IMAP**  | 143  | 高级邮件接收协议（明文） |
| **IMAPS** | 993  | 加密的IMAP               |

#### 3. 数据库协议【MySQL-Redis】
| 协议           | 端口  | 对应数据库                               |
| -------------- | ----- | ---------------------------------------- |
| **MySQL**      | 3306  | MySQL/MariaDB                            |
| **PostgreSQL** | 5432  | PostgreSQL                               |
| **Redis**      | 6379  | Redis                                    |
| **MongoDB**    | 27017 | MongoDB                                  |
| **Oracle**     | 1521  | Oracle Database【IBM公司付费产品】       |
| **SQL Server** | 1433  | Microsoft SQL Server【微软公司付费产品】 |

---

#### **4. 远程访问协议**
| 协议               | 端口  | 安全级别                      |
| ------------------ | ----- | ----------------------------- |
| **RDP**            | 3389  | Windows远程桌面（建议改端口） |
| **VNC**            | 5900+ | 图形化远程控制（通常加密）    |
| **TeamViewer**     | 5938  | 第三方远程工具                |
| **向日葵远程控制** |       |                               |

#### 5. 文件共享协议【了解】
| 协议      | 端口 | 说明            |
| --------- | ---- | --------------- |
| **SMB**   | 445  | Windows文件共享 |
| **NFS**   | 2049 | Linux文件共享   |
| **Rsync** | 873  | 增量文件同步    |

---

#### 6. 网络安全协议
| 协议          | 端口     | 用途                  |
| ------------- | -------- | --------------------- |
| **IPSec**     | 500/4500 | VPN加密通道           |
| **OpenVPN**   | 1194     | 开源VPN（建议改端口） |
| **WireGuard** | 51820    | 现代轻量VPN           |

---

#### 7. 监控与管理协议
| 协议           | 端口    | 工具         |
| -------------- | ------- | ------------ |
| **SNMP**       | 161/162 | 网络设备监控 |
| **Prometheus** | 9090    | 指标采集     |
| **Grafana**    | 3000    | 数据可视化   |


![](/documents/img/ops/linux/basic/jincheng/01.png)
![](/documents/img/ops/linux/basic/jincheng/02.png)
![](/documents/img/ops/linux/basic/jincheng/03.png)
![](/documents/img/ops/linux/basic/jincheng/04.png)
![](/documents/img/ops/linux/basic/jincheng/05.png)
![](/documents/img/ops/linux/basic/jincheng/06.png)
![](/documents/img/ops/linux/basic/jincheng/07.png)
![](/documents/img/ops/linux/basic/jincheng/08.png)
![](/documents/img/ops/linux/basic/jincheng/09.png)
![](/documents/img/ops/linux/basic/jincheng/10.png)
![](/documents/img/ops/linux/basic/jincheng/11.png)
![](/documents/img/ops/linux/basic/jincheng/12.png)
![](/documents/img/ops/linux/basic/jincheng/13.png)
![](/documents/img/ops/linux/basic/jincheng/14.png)
![](/documents/img/ops/linux/basic/jincheng/15.png)
![](/documents/img/ops/linux/basic/jincheng/16.png)
![](/documents/img/ops/linux/basic/jincheng/17.png)
![](/documents/img/ops/linux/basic/jincheng/18.png)
![](/documents/img/ops/linux/basic/jincheng/19.png)
![](/documents/img/ops/linux/basic/jincheng/20.png)
![](/documents/img/ops/linux/basic/jincheng/21.png)
![](/documents/img/ops/linux/basic/jincheng/22.png)
![](/documents/img/ops/linux/basic/jincheng/23.png)
![](/documents/img/ops/linux/basic/jincheng/24.png)
![](/documents/img/ops/linux/basic/jincheng/26.png)



