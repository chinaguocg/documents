## 文件查找

### 一、locate快速查找任何文件

- 查找速度非常快
- 查找任何文件
- 基于updatedb数据库
- 计划任务会系统定期更新数据库，或updatedb手动

##### 1、CentOS

```bash
- 安装 mlocate 软件包
[root@tianyun ~]# yum -y install mlocate

- 数据库存储位置
[root@tianyun ~]# ls /var/lib/mlocate/mlocate.db 
/var/lib/mlocate/mlocate.db 
```

```shell
[root@tianyun ~]# locate passwd
[root@tianyun ~]# locate -i passwd			# 忽略大小写

案例1：查找刚创建的文件
[root@tianyun ~]# touch file3				# 创建file3新文件
[root@tianyun ~]# locate file3				# locate没有找到

案例2：查找删除的文件
[root@tianyun ~]# locate file1
/root/file1
[root@tianyun ~]# rm -rf file1				# 删除file1老文件
[root@tianyun ~]# locate file1				# 依然能找到
/root/file1

案例3：正确使用方式
[root@tianyun ~]# updatedb					# 先手动更新locate数据库
[root@tianyun ~]# locate file3

- 一般用locate找一些系统文件
[root@tianyun ~]# locate ifcfg-ens33		# 可以不更新数据库，比如我们找一个系统文件，只是忘了位置
/etc/sysconfig/network-scripts/ifcfg-ens33
/etc/sysconfig/network-scripts/ifcfg-ens33-bak
/home/etc/sysconfig/network-scripts/ifcfg-ens33
/home/etc1/sysconfig/network-scripts/ifcfg-ens33
/home/etc1/sysconfig/network-scripts/ifcfg-ens33-bak

[root@yangge ~]# locate sshd_config
/etc/ssh/sshd_config

[root@yangge ~]# locate shadow
/etc/gshadow
/etc/gshadow-
/etc/shadow

[root@yangge ~]# locate fstab
/etc/fstab
```

##### 2、Ubuntu

```bash
- 安装 plocate 软件包
yangge@server01:~$ locate passwd
Command 'locate' not found, but can be installed with:
sudo apt install plocate
yangge@server01:~$ sudo apt install plocate

- 数据库存储位置
yangge@server01:~$ sudo updatedb
yangge@server01:~$ ls /var/lib/plocate/plocate.db 
/var/lib/plocate/plocate.db
```

### 二、which查找命令

- 从$PATH环境变量的路径中找

```shell
[root@qfedu.com ~]# which ls
alias ls='ls --color=auto'
        /usr/bin/ls
        
[root@qfedu.com ~]# which cd
/usr/bin/cd

[root@qfedu.com ~]# which rm
alias rm='rm -i'
        /usr/bin/rm
        
[root@tianyun ~]# which passwd
/usr/bin/passwd

[root@tianyun ~]# which useradd
/usr/sbin/useradd

[root@tianyun ~]# echo $PATH
/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/root/bin
```

### 三、find查找任何文件

```shell
例如：需要编写一个脚本，功能是实现找到某个目录下修改时间 `>30天` 的 `文件`，并将其`删除`。
```

```shell
[root@tianyun ~]# find

[root@tianyun ~]# man find
/EXAMPLES
```

##### 1、按文件名找

```shell
[root@tianyun ~]# find / -name "passwd"					# 从/目录查找
[root@tianyun ~]# find /etc -name "passwd"				# 从/etc目录查找
[root@tianyun ~]# find /etc /var -name "passwd"			# 从/etc和/var目录查找
[root@tianyun ~]# find /etc /var -name "PAsswd"
[root@tianyun ~]# find /etc /var -iname "passwd"		# -iname忽略大小写
[root@tianyun ~]# find /etc /var -iname "pass"
[root@tianyun ~]# find /etc /var -iname "pass*"
[root@tianyun ~]# find /etc /var -iname "*.txt"

表达式：expression
-name "filename"
-iname "filename"
```

##### 2、按文件大小

```shell
[root@qfedu.com ~]# find /etc -size +5M					#大于5M
/etc/udev/hwdb.bin
[root@tianyun ~]# ls -lh /etc/udev/hwdb.bin 
-r--r--r--. 1 root root 8.6M Jun  9 11:27 /etc/udev/hwdb.bin

[root@qfedu.com ~]# find /etc -size 5M					#等于5M
[root@qfedu.com ~]# find /etc -size -5M      			#小于5M

[root@qfedu.com ~]# find / -size +3M -a -size -5M  		#查找/下面大于3M 而且 小于5M的文件（-a 可省略  代表and）
[root@qfedu.com ~]# find / -size -1M -o -size +80M 		#查找/下面小于1M 或者 大于80M的文件 （-o代表或者，在脚本中可能去找两个时间段的时候会用到-o【例如月初或月末】）
[root@qfedu.com ~]# find / -size -3M -a -name "*.txt" 	#查找/下面小于3M 而且 名字是.txt的文件

[root@tianyun ~]# find /etc -size +3M 
/etc/udev/hwdb.bin
/etc/selinux/targeted/policy/policy.31
/etc/selinux/targeted/active/policy.kern
/etc/selinux/targeted/active/policy.linked

[root@tianyun ~]# find /etc -size +3M -a -size -5M
/etc/selinux/targeted/policy/policy.31
/etc/selinux/targeted/active/policy.kern
/etc/selinux/targeted/active/policy.linked

[root@tianyun ~]# ls -lh /etc/udev/hwdb.bin
-r--r--r--. 1 root root 8.6M Jun  9 11:27 /etc/udev/hwdb.bin
[root@tianyun ~]# ls -lh /etc/selinux/targeted/active/policy.kern
-rw-------. 1 root root 3.8M Jun  9 11:18 /etc/selinux/targeted/active/policy.kern
```

##### 3、按时间查找

touch 一个文件其实是会修改文件的最后修改时间的

```shell
[root@tianyun ~]# ls -l /etc/passwd
-rw-r--r--. 1 root root 3298 Jun 20 16:43 /etc/passwd		# 最后修改时间mtime

[root@tianyun ~]# stat /etc/passwd							# 查看文件的详细属性
  File: ‘/etc/passwd’
  Size: 3298            Blocks: 8          IO Block: 4096   regular file
Device: fd00h/64768d    Inode: 18144656    Links: 1
Access: (0644/-rw-r--r--)  Uid: (    0/    root)   Gid: (    0/    root)
Context: system_u:object_r:passwd_file_t:s0
Access: 2025-06-22 16:50:01.296784025 +0800					# 最后访问时间atime【针对内容】
Modify: 2025-06-20 16:43:38.292388259 +0800					# 最后修改时间mtime【针对内容】
Change: 2025-06-20 16:43:38.293388259 +0800					# 最后改变时间ctime【属性，例如权限改变】
 Birth: -
```

```shell
[root@qfedu.com ~]# find / -mtime +5		#修改时间5天之前
[root@qfedu.com ~]# find / -mtime +1     	#修改时间1天之前
[root@qfedu.com ~]# find . -mtime -2		#修改时间2天之内

[root@qfedu.com ~]# find / -mmin -2      	#修改时间在2分钟之内
[root@qfedu.com ~]# find . -amin +1         #访问时间在1分钟之前
[root@qfedu.com ~]# find / -amin -4      	#访问时间在4分钟之内


[root@tianyun ~]# find . -mtime +30
./.bash_logout
./.bash_profile
./.bashrc
./.cshrc
./.tcshrc
[root@tianyun ~]# find . -mtime +30 -ls
35546169    4 -rw-r--r--   1 root     root           18 Dec 29  2013 ./.bash_logout
35546170    4 -rw-r--r--   1 root     root          176 Dec 29  2013 ./.bash_profile
35546171    4 -rw-r--r--   1 root     root          176 Dec 29  2013 ./.bashrc
35546172    4 -rw-r--r--   1 root     root          100 Dec 29  2013 ./.cshrc
35546173    4 -rw-r--r--   1 root     root          129 Dec 29  2013 ./.tcshrc
```

##### 4、按文件类型

```shell
-type f  -type d
# 刻意准备一个名为dir10000的目录 和一个名为dir10000的文件
[root@tianyun ~]# mkdir /home/dir10000
[root@tianyun ~]# touch /dir10000
[root@tianyun ~]# ls -dl /home/dir10000/ /dir10000 
-rw-r--r--. 1 root root 0 Jun 23 11:22 /dir10000
drwxr-xr-x. 2 root root 6 Jun 23 11:20 /home/dir10000/

[root@tianyun ~]# find / -name "dir10000"
/home/dir10000
/dir10000
[root@tianyun ~]# find / -type f -name "dir10000" 
/dir10000

[root@tianyun ~]# find / -type f -name "dir10000" 2>/dev/null 
/dir10000
[root@tianyun ~]# find / -type d -name "dir10000" 2>/dev/null 
/home/dir10000

-type l 找链接文件
[root@tianyun ~]# find /etc -type l
[root@tianyun ~]# ls -l /etc/sysconfig/selinux
lrwxrwxrwx. 1 root root 17 Jun  9 11:13 /etc/sysconfig/selinux -> ../selinux/config


# 扩展类型
-type b -type c
[root@tianyun ~]# find / -type b
/dev/dm-1
/dev/dm-0
/dev/sr0						# 光盘设备
/dev/sda2
/dev/sda1						# sda硬盘的第一个分区
/dev/sda						# 硬盘设备，其中sda为第一块硬盘,sdb,sdc
[root@tianyun ~]# ls -l /dev/sda
brw-rw----. 1 root disk 8, 0 Jun 12 10:02 /dev/sda

[root@tianyun ~]# find / -type c
[root@tianyun ~]# ls -l /dev/tty1 /dev/pts/1 /dev/null 
crw-rw-rw-. 1 root root   1, 3 Jun 12 10:02 /dev/null
crw--w----. 1 root tty  136, 1 Jun 23 11:41 /dev/pts/1
crw--w----. 1 root tty    4, 1 Jun 12 10:02 /dev/tty1

-type p
[root@tianyun ~]# find / -type p
[root@tianyun ~]# ls -l /run/systemd/inhibit/75.ref
prw-------. 1 root root 0 Jun 13 14:28 /run/systemd/inhibit/75.ref

表达式：
-type f				# 类型为 常规文件 file
-type d				# 类型为 目录文件 directory
-type l				# 类型为 链接文件 link
-type b				# 类型为 块设备文件 Block Device
-type c				# 类型为 字符设备文件 Character Device
-type p				# 类型为 管道文件 pipe
```

##### 5、按文件所有者

```bash
[root@tianyun ~]# find / -user jack				# 属主是jack的文件
/var/spool/mail/jack
/home/jack
/home/jack/.bash_logout
/home/jack/.bash_profile
/home/jack/.bashrc
/home/jack/.bash_history

[root@tianyun ~]# find / -group OPS				# 属组是OPS组的文件
/home/dir1
/home/dir2
/home/dir2/file2
```

##### 6、按文件权限

| 格式           | 示例         | 说明                           |
| -------------- | ------------ | ------------------------------ |
| **精确匹配**   | `-perm 644`  | 权限 **必须等于** 644          |
| **所有位匹配** | `-perm -644` | 权限 **必须包含** 644 的所有位 |

```shell
-perm 644
[root@tianyun ~]# find . -perm 644 -ls
35546169    4 -rw-r--r--   1 root     root           18 Dec 29  2013 ./.bash_logout
35546170    4 -rw-r--r--   1 root     root          176 Dec 29  2013 ./.bash_profile
35546171    4 -rw-r--r--   1 root     root          176 Dec 29  2013 ./.bashrc
35546172    4 -rw-r--r--   1 root     root          100 Dec 29  2013 ./.cshrc
35546173    4 -rw-r--r--   1 root     root          129 Dec 29  2013 ./.tcshrc

-perm 755
[root@tianyun ~]# find . -perm 755 -ls			# 在当前目录中查找权限等于755的文件（含目录）
[root@tianyun ~]# find . -type f -perm 755 -ls
33802240    4 -rwxr-xr-x   1 root     root            8 Jun 23 14:30 ./y.sh


-perm -644
[root@tianyun ~]# touch file10
[root@tianyun ~]# touch file11
[root@tianyun ~]# chmod 764 file10
[root@tianyun ~]# chmod 770 file11

[root@tianyun ~]# find . -perm -644 -name "file*" -ls 
33575035    0 -rw-r--r--   1 root     root            0 Jun 16 11:08 ./file2
18144650    0 -rw-r--r--   1 alice    hr              0 Jun 20 15:06 ./dir1/file1
18144653    0 -rw-r--r--   1 alice    hr              0 Jun 20 16:48 ./dir1/file10
35801935    0 -rw-r--r--   1 root     root            0 Jun 23 09:16 ./file3
144884    0 -rwxrwxrwx   1 root     root            0 Jun 23 15:18 ./test/file3
33802212    0 -rwxrw-r--   1 root     root            0 Jun 23 15:33 ./file10


-perm -007
[root@tianyun ~]# ls -l file*
-rwxrw-r--. 1 root root 0 Jun 23 15:33 file10
-------rwx. 1 root root 0 Jun 23 15:33 file11
-rw-------. 1 tom  it   0 Jun 20 16:44 file1.txt
-rw-r--r--. 1 root root 0 Jun 16 11:08 file2
-rw-r--r--. 1 root root 0 Jun 23 09:16 file3

[root@tianyun ~]# find . -name "file*" -perm -007 -ls
33802250    0 -------rwx   1 root     root            0 Jun 23 15:33 ./file11
144884    0 -rwxrwxrwx   1 root     root            0 Jun 23 15:18 ./test/file3

查找全局可写的目录
-perm -222 -type d

# 扩展知识：查找还特殊权限的文件
特殊权限suid		s	4
特殊权限sgid		s	2
特殊权限Sticky		t	1

-perm -4000 查找带有suid的文件
[root@tianyun ~]# find / -perm -4000 -ls
[root@tianyun ~]# find / -perm -4000 -ls 2>/dev/null |head -n2
50375310   32 -rwsr-xr-x   1 root     root        32096 Oct 31  2018 /usr/bin/fusermount
50917103   24 -rws--x--x   1 root     root        23968 Oct  1  2020 /usr/bin/chfn

-perm -2000 查找带有sgid的文件
[root@tianyun ~]# find / -perm -2000 -ls
[root@tianyun ~]# find / -perm -2000 -ls 2>/dev/null |head -n2
  9419    0 drwxr-sr-x   3 root  systemd-journal  60 Jun 12 10:02 /run/log/journal
  9420    0 drwxr-s---   2 root  systemd-journal  80 Jun 21 05:58 /run/log/journal/a1840

-perm -1000 查找带有Stick位的文件
[root@tianyun ~]# find / -perm -1000 -ls
[root@tianyun ~]# find / -perm -1000 -ls 2>/dev/null |head -n2
  8678    0 drwxrwxrwt   2 root     root           40 Jun 12 10:02 /dev/mqueue
  8902    0 drwxrwxrwt   2 root     root           40 Jun 12 10:02 /dev/shm

-perm -6000 查找同时带有suid和sgid的文件
[root@tianyun ~]# find / -perm -6000 -ls 2>/dev/null |head -n2
51044638   16 -rwsr-sr-x   1 abrt     abrt        15344 Oct  2  2020 /usr/libexec/abrt-action-install-debuginfo-to-abrt-cache
```

##### 找到后处理的动作 

##### 1、-ls参数

```bash
[root@tianyun ~]# find / -name "passwd" -ls
find: ‘/run/user/1001/gvfs’: Permission denied
67113279    0 dr-xr-xr-x   3 root     root            0 Jun 12 10:02 /sys/fs/selinux/class/passwd
67109855    0 -r--r--r--   1 root     root            0 Jun 12 10:02 /sys/fs/selinux/class/passwd/perms/passwd
34498689    4 -rw-r--r--   1 root     root          188 Apr  1  2020 /etc/pam.d/passwd
18144668    4 -rw-r--r--   1 root     root         3343 Jun 23 11:10 /etc/passwd
52077393    4 -rw-r--r--   1 root     root          188 Jun 10 10:59 /var/tmp/etc/pam.d/passwd
18020004    4 -rw-r--r--   1 root     root         2302 Jun 10 10:59 /var/tmp/etc/passwd
52013125    4 -rw-r--r--   1 root     root          188 Jun 20 09:55 /tmp/etc2/pam.d/passwd
18140072    4 -rw-r--r--   1 root     root         3257 Jun 20 09:55 /tmp/etc2/passwd
50879844   28 -rwsr-xr-x   1 root     root        27856 Apr  1  2020 /usr/bin/passwd
1072986    4 -rw-r--r--   1 root     root          514 Apr  1  2020 /usr/share/bash-completion/completions/passwd
```

##### 2、-exec 参数处理

find [路径] 【条件】 -exec 命令 {} \;

- {}  代表find找到的文件
- \;  表示命令结束符

```shell
[root@tianyun ~]# find / -name "passwd" -exec ls -lh {} \;
## 大括号{}相当于把前面找到的东西给它传参
[root@tianyun ~]# find / -name "passwd" -exec ls -lh {} \; 2>/dev/null
[root@tianyun ~]# find / -name "passwd" -exec cp -r {} /tmp  \; 2>/dev/null

[root@tianyun ~]# find . -name "file*" -type f
[root@tianyun ~]# find . -name "file*" -type f -exec rm {} \;


[root@tianyun ~]# find . -name "*.txt" -type f -exec ls -lh {} \;
[root@tianyun ~]# find . -name "*.txt" -type f -exec ls -lh {} +

+终止符：
将多个文件作为参数一次传递给命令
更高效，减少进程创建

[root@tianyun ~]# time find /etc -exec ls {} \;
real    0m7.304s
user    0m1.435s
sys     0m5.581s

[root@tianyun ~]# time find /etc -exec ls {} +
real    0m0.049s
user    0m0.026s
sys     0m0.017s
```

##### 3、xargs管道处理【扩展】

- -0     处理含空格/特殊字符的文件名
- -I      指定替换字符串

```shell
[root@tianyun ~]# find /var/log/ -name "*.log" |less				# 可用

[root@tianyun ~]# find /var/log/ -name "*.log" |ls -lh				# 不可用，逻辑上错误的命令
total 24M
-rw-------.  1 root root 1.9K Jul 15 10:23 anaconda-ks.cfg
-rwxr-xr-x.  1 root root   57 Jul 25 11:24 create_file.sh
drwxr-xr-x. 85 root root 8.0K Jul 25 17:55 etc
-rw-r--r--.  1 root root  11M Jul 25 15:19 etc.tgz
-rw-r--r--.  1 root root  14M Jul 25 15:23 etc.zip
-rwxrwxrwx.  1 root root    0 Jul 28 09:25 file1

[root@tianyun ~]# ls -lh
total 24M
-rw-------.  1 root root 1.9K Jul 15 10:23 anaconda-ks.cfg
-rwxr-xr-x.  1 root root   57 Jul 25 11:24 create_file.sh
drwxr-xr-x. 85 root root 8.0K Jul 25 17:55 etc
-rw-r--r--.  1 root root  11M Jul 25 15:19 etc.tgz
-rw-r--r--.  1 root root  14M Jul 25 15:23 etc.zip
-rwxrwxrwx.  1 root root    0 Jul 28 09:25 file1

[root@tianyun ~]# find /var/log/ -name "*.log" |rm -rf				# 不可用，逻辑上错误的命令


# 问题分析：
ls rm cp 跟less不一样，不支持管道

[root@tianyun ~]# find /var/log -name "*.log" |xargs ls -lh


# 案例I:
[root@tianyun ~]# mkdir dir1
[root@tianyun ~]# touch dir1/file{1..40}.txt
[root@tianyun ~]# find dir1 -name "file*.txt" |xargs ls -l
[root@tianyun ~]# find dir1 -name "file*.txt" |xargs rm

# 案例II
[root@tianyun ~]# mkdir dir2
[root@tianyun ~]# touch dir2/file{1..40}.txt

[root@tianyun ~]# find dir2 -name "file*.txt" |xargs -I {} cp -rf {} /var/tmp/
[root@tianyun ~]# find dir2 -name "file*.txt" |xargs -I YANGGE cp -rf YANGGE /tmp/

# 案例III
[root@tianyun ~]# rm -rf /var/tmp/file*
[root@tianyun ~]# find dir2 -name "file*.txt"
[root@tianyun ~]# find dir2 -name "file*.txt" -print |xargs -I {} mv {} /var/tmp/

# 案例IV
[root@tianyun ~]# find dir2 -name "file*.txt" -print0 |xargs -0 -I {} mv {} /var/tmp/
```

**注意事项**

```bash
find /tmp -name core -type f -print | xargs /bin/rm -f                                ## 得需要安装xargs
-exec rm -f {} \;                 ## 只能传一个参数
awk '{print "rm -f ",$1}'|bash    ## 灵活，但谨慎注意交给bash前不能有错
在/tmp目录或其下找到名为core的文件并将其删除。请注意，如果有任何文件名包含换行符、单引号或双引号或空格，这将无法正常工作。

find /tmp -name core -type f -print0 | xargs -0 /bin/rm -f
在/tmp目录中或目录下找到名为core的文件并将其删除，以正确处理包含单引号或双引号、空格或换行符的文件名或目录名的方式处理文件名。

-name测试 位于 -type测试之前，以避免对每个文件调用stat（2）
```

## 截图

![](/documents/img/ops/linux/basic/find/01.png)
![](/documents/img/ops/linux/basic/find/02.png)
![](/documents/img/ops/linux/basic/find/03.png)
![](/documents/img/ops/linux/basic/find/04.png)
![](/documents/img/ops/linux/basic/find/05.png)
![](/documents/img/ops/linux/basic/find/06.png)
![](/documents/img/ops/linux/basic/find/07.png)
![](/documents/img/ops/linux/basic/find/08.png)
![](/documents/img/ops/linux/basic/find/09.png)
![](/documents/img/ops/linux/basic/find/10.png)