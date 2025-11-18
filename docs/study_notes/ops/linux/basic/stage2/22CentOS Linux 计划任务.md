# Linux 计划任务

## 一、计划任务概述

在 CentOS 系统中，计划任务（Cron Jobs）是自动化执行重复性任务的核心工具，主要由以下两个服务组成：

1. **cron 服务**：系统级`守护进程`，负责执行预定的任务
2. **anacron 服务**：针对非24小时运行的服务器设计的补充服务

```bash
[root@tianyun ~]# systemctl status crond.service 				# 查看状态status
● crond.service - Command Scheduler
   Loaded: loaded (/usr/lib/systemd/system/crond.service; enabled; vendor preset: enabled)
   Active: active (running) since Thu 2025-06-12 10:02:46 CST; 1 weeks 5 days ago
 Main PID: 1251 (crond)
    Tasks: 1
   CGroup: /system.slice/crond.service
           └─1251 /usr/sbin/crond -n

Jun 12 10:02:46 tianyun systemd[1]: Started Command Scheduler.
Jun 12 10:02:46 tianyun crond[1251]: (CRON) INFO (RANDOM_DELAY will be scaled with factor 29% if used.)
Jun 12 10:02:48 tianyun crond[1251]: (CRON) INFO (running with inotify support)

[root@tianyun ~]# systemctl start crond						# 启动，如果没有启动
[root@tianyun ~]# systemctl enable crond						# 设置为开机自动启动

- Ubuntu:
yangge@server01:~$ ps aux |grep cron
root        1275  0.0  0.1   6824  2816 ?        Ss   Sep19   0:00 /usr/sbin/cron -f -P
yangge     17878  0.0  0.1   6544  2304 pts/0    S+   02:58   0:00 grep --color=auto cron

yangge@server01:~$ systemctl status cron.service
```

## 二、crontab 基础

### 1. crontab 配置文件位置

- 系统级配置文件：`/etc/crontab`
- 用户级配置文件：`/var/spool/cron/username`
- 系统任务目录：`/etc/cron.d/`
- 预设任务目录：
  - `/etc/cron.hourly/`
  - `/etc/cron.daily/`
  - `/etc/cron.weekly/`
  - `/etc/cron.monthly/`

```bash
[root@tianyun ~]# ls /etc/cron.hourly/			# 每小时要执行的计划任务（脚本）
0anacron  mcelog.cron
[root@tianyun ~]# ls /etc/cron.daily/				# 每天要执行的计划任务（脚本）
logrotate  man-db.cron  mlocate
[root@tianyun ~]# cat /etc/cron.daily/mlocate 	# 每天更新mlocate数据库
#!/bin/sh
nodevs=$(awk '$1 == "nodev" && $2 != "rootfs" && $2 != "zfs" { print $2 }' < /proc/filesystems)

renice +19 -p $$ >/dev/null 2>&1
ionice -c2 -n7 -p $$ >/dev/null 2>&1
/usr/bin/updatedb -f "$nodevs"					# 每天更新mlocaate数据库

[root@tianyun ~]# ls /etc/cron.weekly/
[root@tianyun ~]# ls /etc/cron.monthly/

注：如果每天的计划任务中没有mlocate
[root@tianyun ~]# yum -y install mlocate
```

### 2. crontab 命令使用

```bash
# 编辑当前用户的cron任务
crontab -e

# 列出当前用户的cron任务
crontab -l

# 删除当前用户的所有cron任务
crontab -r

# 以其他用户身份管理cron任务（需root权限）
crontab -u alice -e
```

### 3. crontab 时间格式

```
*    *    *    *    *  command_to_execute
┬    ┬    ┬    ┬    ┬
│    │    │    │    │
│    │    │    │    └── 星期几 (0 - 6) (0表示周日)
│    │    │    └─────── 月份 (1 - 12)
│    │    └─────────── 日 (1 - 31)
│    └──────────────── 小时 (0 - 23)
└───────────────────── 分钟 (0 - 59)
分 时 日 月 周
```

特殊符号：
- `*`：所有可能的值
- `,`：值列表分隔符（如"1,3,5"）
- `-`：范围（如"1-5"）
- `/`：步长（如"*/2"表示每两小时）

## 三、实战案例

### 案例1：基本任务设置

**每分钟创建文件：**

```shell
# 第一步：准备创建文件的脚本（计划任务要做的事）
- date +%H-%M
[root@tianyun ~]# date +%H-%M
09-36
[root@tianyun ~]# touch yangge_$(date +%H-%M).txt	# 命令替换 $() 等价于 ``
[root@tianyun ~]# mkdir /tmp/newdir

- 创建相应的脚本
[root@tianyun ~]# vim create_file.sh
#!/bin/bash
touch /tmp/newdir/yangge_$(date +%H-%M).txt			# 目录使用绝对路径，注意

[root@tianyun ~]# chmod +x create_file.sh 
[root@tianyun ~]# ls -l create_file.sh 
-rwxr-xr-x. 1 root root 57 Jun 24 16:21 create_file.sh
[root@tianyun ~]# /root/create_file.sh 				# 提前测试脚本是否正常，如果普通用户注意路径 
[root@tianyun ~]# ls /tmp/newdir
yangge_11-24.txt

# 第二步：创建root的计划任务（让其执行前面的脚本）
[root@tianyun ~]# crontab -e
* * * * * /root/create_file.sh &>/dev/null			# 如果上普通用户，注意脚本的路径 

[root@tianyun ~]# crontab -l
* * * * * /root/create_file.sh &>/dev/null
[root@tianyun ~]# cat /var/spool/cron/root 
* * * * * /root/create_file.sh &>/dev/null

# 第三步：等待验证cron是否正常执行
[root@tianyun ~]# ls /tmp/newdir/
yangge_16-23.txt  yangge_16-24.txt  yangge_16-25.txt  yangge_16-26.txt

[root@tianyun ~]# tailf /var/log/cron				# 查看cron的日志
Jun 24 16:22:33 tianyun crontab[52055]: (root) BEGIN EDIT (root)
Jun 24 16:22:50 tianyun crontab[52055]: (root) REPLACE (root)
Jun 24 16:22:50 tianyun crontab[52055]: (root) END EDIT (root)
Jun 24 16:23:01 tianyun crond[1251]: (root) RELOAD (/var/spool/cron/root)
Jun 24 16:23:01 tianyun CROND[52082]: (root) CMD (/root/create_file.sh &>/dev/null)
Jun 24 16:23:12 tianyun crontab[52111]: (root) LIST (root)
Jun 24 16:24:01 tianyun CROND[52196]: (root) CMD (/root/create_file.sh &>/dev/null)
Jun 24 16:25:01 tianyun CROND[52378]: (root) CMD (/root/create_file.sh &>/dev/null)
Jun 24 16:26:01 tianyun CROND[52688]: (root) CMD (/root/create_file.sh &>/dev/null)
Jun 24 16:27:01 tianyun CROND[52801]: (root) CMD (/root/create_file.sh &>/dev/null)
Jun 24 16:28:01 tianyun CROND[52879]: (root) CMD (/root/create_file.sh &>/dev/null)
```

**每天凌晨3点执行备份脚本**：

```bash
0 3 * * * /root/scripts/backup.sh
```

**每周一上午8:30执行清理任务**：
```bash
30 8 * * 1 /usr/bin/cleanup.sh
```

**每10分钟检查一次服务状态**：
```bash
*/10 * * * * /usr/bin/check_service.sh
```

### 案例2：输出重定向

**将输出重定向到日志文件**：

```bash
0 2 * * * /path/to/script.sh &>/var/log/script.log
```

**丢弃所有输出**：
```bash
*/5 * * * * /path/to/script.sh &>/dev/null
```

### 案例3：系统维护任务

**每天自动更新系统**：
```bash
0 4 * * * yum -y update && yum clean all
```

**每周日凌晨清理/tmp目录**：
```bash
0 0 * * 7 rm -rf /tmp/*
```

### 案例4：复杂时间调度

**工作日(周一到周五)每两小时执行**：
```bash
0 */2 * * 1-5 /path/scrpit.sh

0 2 19 * * /path/scrpit.sh					# 每月19号2点整
0 2 19 * 2 /path/scrpit.sh					# 每月19号2点整 或 每周二2点整
```

**每月1号和15号上午9点执行**：
```bash
0 9 1,15 * * /path/scrpit.sh
```

## 四、anacron 使用【了解】

### 1. anacron 配置文件

主配置文件：`/etc/anacrontab`

```bash
#period in days   delay in minutes  job-identifier  command
1      			  	5       cron.daily              nice run-parts /etc/cron.daily
7       			25      cron.weekly             nice run-parts /etc/cron.weekly
@monthly 			45      cron.monthly            nice run-parts /etc/cron.monthly
```

```bash
[tianyun@yangge ~]$ ls /etc/cron.daily/
logrotate  man-db.cron  mlocate
```

### 2. 实战案例

**每天执行的任务（如果错过，延迟5分钟后执行）**：

```
1       5      cron.daily     /path/to/daily-job.sh
```

**每周执行的任务（如果错过，延迟10分钟后执行）**：
```
7       10     cron.weekly     /path/to/weekly-job.sh
```

## 五、综合实战案例

### 案例：自动化网站备份系统

1. 创建备份脚本 `/root/scripts/website_backup.sh`：
```bash
#!/bin/bash
DATE=$(date +%Y%m%d)
BACKUP_DIR="/backups/website"
LOG_FILE="/var/log/website_backup.log"

echo "[$(date)] Starting backup..." >> $LOG_FILE

# 创建备份目录
mkdir -p $BACKUP_DIR/$DATE

# 备份网站文件
tar -czf $BACKUP_DIR/$DATE/website_files.tar.gz /var/www/html >> $LOG_FILE 2>&1

# 备份数据库
mysqldump -u root -p'password' wordpress > $BACKUP_DIR/$DATE/wordpress.sql 2>> $LOG_FILE
gzip $BACKUP_DIR/$DATE/wordpress.sql

# 保留最近7天备份
find $BACKUP_DIR -type d -mtime +7 -exec rm -rf {} \; >> $LOG_FILE 2>&1

echo "[$(date)] Backup completed" >> $LOG_FILE
```

2. 设置执行权限：
```bash
chmod +x /root/scripts/website_backup.sh
```

3. 添加cron任务（每天凌晨2点执行）：
```bash
0 2 * * * /root/scripts/website_backup.sh
```

## 截图

![](/documents/img/ops/linux/basic/cron/01.png)
![](/documents/img/ops/linux/basic/cron/02.png)
![](/documents/img/ops/linux/basic/cron/03.png)
![](/documents/img/ops/linux/basic/cron/04.png)