# 初识shell 练习

```
--- 课堂作业1：
判断根分区使用率，如果超过阈值(90%)则报警 disk_use.sh
脚本思路：
1. 获得根分区当前的使用率（数字），将其赋值给一个变量例如 disk_use
df |grep "/$" |awk '{print $5}' |awk -F"%" '{print $1}'
2. 判断当前的使用率是否大于90（数值比较）
3. 如果超过阈值（90%）输出警告消息，否则打印当前使用率（例如45%）

--- 课堂作业2：
安装软件xxx install_package.sh
脚本思路：
1. 判断当前用户有没有安装权限(可以通过UID或用户名来进行判断)
2. 判断网络连接是否正常，如果不正常输出：网络无法连接，YUM源无法使用，程序退出(exit)
3. 如果当前用户不是超级用户，输出：请使用root用户安装，程序退出(exit)
4. 如果是超级用户，安装vsftpd。安装成功后输出：vsftpd安装成功
提示：
获得当前用户的UID： 使用环境变量$UID，或id -u
获得当前用户名：使用环境变量$USER

-- 课堂作业3：
创建用户 create_user.sh
脚本要求：
1. 判断当前用户有没有创建用户的权限，如果没有，提示：请使用root用户，程序退出
2. 提示用户输入要创建的用户名和密码
3. 判断用户输入的用户名是否为空。如果为空，提示：用户名输入错误，程序退出
4. 判断用户输入的密码是否为空。如果为空，提示：密码输入错误，程序退出
5. 检查要创建的用户是否已存在(id xxx)，如果存在，提示：用户xxx已存在，程序退出
6. 创建用户和设置密码，过程中不输出消息到终端
7. 如果用户创建成功，输出：用户xxx创建成功
```

```
[root@haoha home]# cat create_user.sh 
#!/bin/bash

if [ $UID != 0  ];then
        echo "Please use root login and create user";
        exit
else
	read -p "Please input username and passwold:  " username passwold

	if [[ $username == ""  ]];then
		echo "username is kong"
	elif [ -z "$passwold"  ];then
		echo "passwold is kong"
	else
                id $username
                if [ $? = 0 ];then
                        echo "user exit, please update other username and create"
		else
        	        useradd $username;
	                echo "$username:$passwold" | chpasswd
			id $username
			if [ $? = 0 ];then
				echo "create user success"
			else
				echo "create user fail"
			fi
		fi
	fi
fi
	
[root@haoha home]# cat install_package.sh
#!/bin/bash

if [ $UID != 0  ];then
        echo "Please use root login and install";
        exit
else
	echo "keyianzhuang";
	ping -c2 "mirrors.huaweicloud.com"  &>/dev/null                
	if [ $? = 0 ];then                                      
        	echo "wangluotong"
		yum -y install vsftpd
		if [ $? = 0 ];then
			echo "install vsftpd success" 
		else
			echo "install vsftpd fail"
		fi      
	else                                              
		echo "wanglue is fail"     
	fi
fi
[root@haoha home]# cd 
[root@haoha ~]# ll
total 28
-rw-------. 1 root root 1244 Nov 24 01:15 anaconda-ks.cfg
-rwxr-xr-x. 1 root root  239 Dec  8 05:00 disk_use.sh
-rw-r--r--. 1 root root   84 Dec  8 06:13 install_package.sh
-rwxr-xr-x. 1 root root  292 Dec  8 02:17 modify_ip_v2.0.sh
-rwxr-xr-x. 1 root root  350 Dec  8 02:42 ping2.sh
-rwxr-xr-x. 1 root root  109 Dec  8 01:39 pingbaidu.sh
-rwxr-xr-x. 1 root root  174 Dec  7 22:27 test_place.sh
[root@haoha ~]# cat disk_use.sh 
#!/bin/bash

disk_use=$(df |grep "/$" |awk '{print $5}' )

disk_use_num=$(df |grep "/$" |awk '{print $5}' |awk -F"%" '{print $1}')

if [ $disk_use_num -ge 90  ];then
	echo "警告：超过90了"
else
	echo "当前使用率：$disk_use"
fi
[root@haoha ~]# 

```



完整代码

```
[root@haoha ~]# df
Filesystem              1K-blocks    Used Available Use% Mounted on
/dev/mapper/centos-root  17811456 1455524  16355932   9% /
devtmpfs                   488772       0    488772   0% /dev
tmpfs                      499848       0    499848   0% /dev/shm
tmpfs                      499848    6892    492956   2% /run
tmpfs                      499848       0    499848   0% /sys/fs/cgroup
/dev/sda1                 1038336  127496    910840  13% /boot
tmpfs                       99972       0     99972   0% /run/user/0
[root@haoha ~]# df |grep "/$"
/dev/mapper/centos-root  17811456 1455504  16355952   9% /
[root@haoha ~]# df |grep "$/dev/mapper/centos-root"
[root@haoha ~]# df |grep "/$"
/dev/mapper/centos-root  17811456 1455504  16355952   9% /
[root@haoha ~]# df |grep "/$" |awk '{print $5}' 
9%
[root@haoha ~]# df |grep "/$" |awk '{print $5}' |awk -F"%"
Usage: awk [POSIX or GNU style options] -f progfile [--] file ...
Usage: awk [POSIX or GNU style options] [--] 'program' file ...
POSIX options:		GNU long options: (standard)
	-f progfile		--file=progfile
	-F fs			--field-separator=fs
	-v var=val		--assign=var=val
Short options:		GNU long options: (extensions)
	-b			--characters-as-bytes
	-c			--traditional
	-C			--copyright
	-d[file]		--dump-variables[=file]
	-e 'program-text'	--source='program-text'
	-E file			--exec=file
	-g			--gen-pot
	-h			--help
	-L [fatal]		--lint[=fatal]
	-n			--non-decimal-data
	-N			--use-lc-numeric
	-O			--optimize
	-p[file]		--profile[=file]
	-P			--posix
	-r			--re-interval
	-S			--sandbox
	-t			--lint-old
	-V			--version

To report bugs, see node `Bugs' in `gawk.info', which is
section `Reporting Problems and Bugs' in the printed version.

gawk is a pattern scanning and processing language.
By default it reads standard input and writes standard output.

Examples:
	gawk '{ sum += $1 }; END { print sum }' file
	gawk -F: '{ print $1 }' /etc/passwd
[root@haoha ~]# df |grep "/$" |awk '{print $5}' |awk -F"%" '{print $1}'
9
[root@haoha ~]# df |grep "/$" |awk '{print $5}' |awk -F"%" '{print $2}'

[root@haoha ~]# df |grep "/$" |awk '{print $5}' |awk -F"%" '{print $1}'
9
[root@haoha ~]# use_num = $(df |grep "/$" |awk '{print $5}' |awk -F"%" '{print $1}')
-bash: use_num: command not found
[root@haoha ~]# use_num=$(df |grep "/$" |awk '{print $5}' |awk -F"%" '{print $1}')
[root@haoha ~]# echo $use_num
9
[root@haoha ~]# vim disk_use.sh
[root@haoha ~]# vim disk_use.sh
[root@haoha ~]# chmod +x disk_use.sh 
[root@haoha ~]# ./disk_use.sh 
./disk_use.sh: line 10: 9%: command not found
当前使用率：
[root@haoha ~]# vim disk_use.sh
[root@haoha ~]# ./disk_use.sh 
当前使用率：9%
[root@haoha ~]# cat disk_use.sh
#!/bin/bash

disk_use=$(df |grep "/$" |awk '{print $5}' )

disk_use_num=$(df |grep "/$" |awk '{print $5}' |awk -F"%" '{print $1}')

if [ $disk_use_num -ge 90  ];then
	echo "警告：超过90了"
else
	echo "当前使用率：$disk_use"
fi
[root@haoha ~]# uid
-bash: uid: command not found
[root@haoha ~]# UID
-bash: UID: command not found
[root@haoha ~]# vim install_package.sh
[root@haoha ~]# cd /home
[root@haoha home]# ll
total 4
-rw-r--r--. 1 root root 84 Dec  8 06:21 install_package.sh
[root@haoha home]# chmod +x install_package.sh 
[root@haoha home]# ll
total 4
-rwxr-xr-x. 1 root root 84 Dec  8 06:21 install_package.sh
[root@haoha home]# ./install_package.sh 
keyianzhuang
[root@haoha home]# useradd zhangsan
[root@haoha home]# ll
total 4
-rwxr-xr-x. 1 root     root     84 Dec  8 06:21 install_package.sh
drwx------. 2 zhangsan zhangsan 62 Dec  8 06:24 zhangsan
[root@haoha home]# cp install_package.sh
cp: missing destination file operand after ‘install_package.sh’
Try 'cp --help' for more information.
[root@haoha home]# cp install_package.sh zhangsan/install_package.sh 
[root@haoha home]# cd zhangsan
[root@haoha zhangsan]# ll
total 4
-rwxr-xr-x. 1 root root 84 Dec  8 06:29 install_package.sh
[root@haoha zhangsan]# su - zhangsan
/etc/profile
[zhangsan@haoha ~]$ cd /home
[zhangsan@haoha home]$ ll
total 4
-rwxr-xr-x. 1 root     root     84 Dec  8 06:21 install_package.sh
drwx------. 2 zhangsan zhangsan 88 Dec  8 06:29 zhangsan
[zhangsan@haoha home]$ ./install_package.sh 
wuquanxian
[zhangsan@haoha home]$ exit
logout
[root@haoha zhangsan]# cd ..
[root@haoha home]# vim install_package.sh 
[root@haoha home]# ./install_package.sh 
keyianzhuang
[root@haoha home]# su - zhangsan
Last login: Mon Dec  8 06:30:08 EST 2025 on pts/0
/etc/profile
[zhangsan@haoha ~]$ cd home
-bash: cd: home: No such file or directory
[zhangsan@haoha ~]$ cd /home
[zhangsan@haoha home]$ ./install_package.sh 
Please use root login and install
[zhangsan@haoha home]$ exit
logout
[root@haoha home]# ll
total 4
-rwxr-xr-x. 1 root     root     130 Dec  8 06:34 install_package.sh
drwx------. 2 zhangsan zhangsan 109 Dec  8 06:30 zhangsan
[root@haoha home]# vim install_package.sh 
[root@haoha home]# vim install_package.sh 
[root@haoha home]# su - zhangsan
Last login: Mon Dec  8 06:34:34 EST 2025 on pts/0
/etc/profile
[zhangsan@haoha ~]$ cd home
-bash: cd: home: No such file or directory
[zhangsan@haoha ~]$ ll
total 4
-rwxr-xr-x. 1 root root 84 Dec  8 06:29 install_package.sh
[zhangsan@haoha ~]$ ./install_package.sh 
wuquanxian
[zhangsan@haoha ~]$ vim install_package.sh 
[zhangsan@haoha ~]$ exit
logout
[root@haoha home]# cd zhangsan
[root@haoha zhangsan]# ll
total 4
-rwxr-xr-x. 1 root root 84 Dec  8 06:29 install_package.sh
[root@haoha zhangsan]# cd ..
[root@haoha home]# ll
total 4
-rwxr-xr-x. 1 root     root     129 Dec  8 06:35 install_package.sh
drwx------. 2 zhangsan zhangsan 125 Dec  8 06:37 zhangsan
[root@haoha home]# cp install_package.sh /zhangsan/install_package.sh
cp: cannot create regular file ‘/zhangsan/install_package.sh’: No such file or directory
[root@haoha home]# cd zhangsan
[root@haoha zhangsan]# ll
total 4
-rwxr-xr-x. 1 root root 84 Dec  8 06:29 install_package.sh
[root@haoha zhangsan]# rm -f install_package.sh 
[root@haoha zhangsan]# cd ..
[root@haoha home]# su - zhangsan
Last login: Mon Dec  8 06:36:01 EST 2025 on pts/0
/etc/profile
[zhangsan@haoha ~]$ cd /home
[zhangsan@haoha home]$ ll
total 4
-rwxr-xr-x. 1 root     root     129 Dec  8 06:35 install_package.sh
drwx------. 2 zhangsan zhangsan  99 Dec  8 06:38 zhangsan
[zhangsan@haoha home]$ cat install_package.sh 
#!/bin/bash

if [ $UID != 0  ];then
        echo "Please use root login and install";
        exit
else
	echo "keyianzhuang";
fi
[zhangsan@haoha home]$ ./install_package.sh 
Please use root login and install
[zhangsan@haoha home]$ exit
logout
[root@haoha home]# vim install_package.sh 
[root@haoha home]# ./install_package.sh 
keyianzhuang
wangluotong
[root@haoha home]# vim install_package.sh 
[root@haoha home]# ./install_package.sh 
./install_package.sh: line 18: syntax error: unexpected end of file
[root@haoha home]# vim install_package.sh 
[root@haoha home]# vim install_package.sh 
[root@haoha home]# ./install_package.sh 
keyianzhuang
wangluotong
Loaded plugins: fastestmirror
base                                                                   | 3.6 kB  00:00:00     
epel                                                                   | 4.3 kB  00:00:00     
extras                                                                 | 2.9 kB  00:00:00     
updates                                                                | 2.9 kB  00:00:00     
Determining fastest mirrors
Resolving Dependencies
--> Running transaction check
---> Package vsftpd.x86_64 0:3.0.2-29.el7_9 will be installed
--> Finished Dependency Resolution

Dependencies Resolved

==============================================================================================
 Package            Arch               Version                      Repository           Size
==============================================================================================
Installing:
 vsftpd             x86_64             3.0.2-29.el7_9               updates             173 k

Transaction Summary
==============================================================================================
Install  1 Package

Total download size: 173 k
Installed size: 353 k
Is this ok [y/d/N]: y
Downloading packages:
vsftpd-3.0.2-29.el7_9.x86_64.rpm                                       | 173 kB  00:00:00     
Running transaction check
Running transaction test
Transaction test succeeded
Running transaction
  Installing : vsftpd-3.0.2-29.el7_9.x86_64                                               1/1 
  Verifying  : vsftpd-3.0.2-29.el7_9.x86_64                                               1/1 

Installed:
  vsftpd.x86_64 0:3.0.2-29.el7_9                                                              

Complete!
install vsftpd success
[root@haoha home]# vim install_package.sh 
[root@haoha home]# su zhangsan
[zhangsan@haoha home]$ ll
total 4
-rwxr-xr-x. 1 root     root     483 Dec  8 06:54 install_package.sh
drwx------. 2 zhangsan zhangsan  99 Dec  8 06:38 zhangsan
[zhangsan@haoha home]$ cat install_package.sh 
#!/bin/bash

if [ $UID != 0  ];then
        echo "Please use root login and install";
        exit
else
	echo "keyianzhuang";
	ping -c2 "www.baidu.com"  &>/dev/null                
	if [ $? = 0 ];then                                      
        	echo "wangluotong"
		yum -y install vsftpd
		if [ $? = 0 ];then
			echo "install vsftpd success" 
		else
			echo "install vsftpd fail"
		fi      
	else                                              
		echo "wanglue is fail"     
	fi
fi
[zhangsan@haoha home]$ ./install_package.sh
Please use root login and install
[zhangsan@haoha home]$ exit
exit
[root@haoha home]# ./install_package.sh 
keyianzhuang
wangluotong
Loaded plugins: fastestmirror
Loading mirror speeds from cached hostfile
Package vsftpd-3.0.2-29.el7_9.x86_64 already installed and latest version
Nothing to do
install vsftpd success
[root@haoha home]# yum -repolist
Loaded plugins: fastestmirror
Usage: yum [options] COMMAND

List of Commands:

check          Check for problems in the rpmdb
check-update   Check for available package updates
clean          Remove cached data
deplist        List a package's dependencies
distribution-synchronization Synchronize installed packages to the latest available versions
downgrade      downgrade a package
erase          Remove a package or packages from your system
fs             Acts on the filesystem data of the host, mainly for removing docs/lanuages for minimal hosts.
fssnapshot     Creates filesystem snapshots, or lists/deletes current snapshots.
groups         Display, or use, the groups information
help           Display a helpful usage message
history        Display, or use, the transaction history
info           Display details about a package or group of packages
install        Install a package or packages on your system
list           List a package or groups of packages
load-transaction load a saved transaction from filename
makecache      Generate the metadata cache
provides       Find what package provides the given value
reinstall      reinstall a package
repo-pkgs      Treat a repo. as a group of packages, so we can install/remove all of them
repolist       Display the configured software repositories
search         Search package details for the given string
shell          Run an interactive yum shell
swap           Simple way to swap packages, instead of using shell
update         Update a package or packages on your system
update-minimal Works like upgrade, but goes to the 'newest' package match which fixes a problem that affects your system
updateinfo     Acts on repository update information
upgrade        Update packages taking obsoletes into account
version        Display a version for the machine and/or available repos.


Command line error: no such option: -r
[root@haoha home]# yum repollist
Loaded plugins: fastestmirror
No such command: repollist. Please use /usr/bin/yum --help
[root@haoha home]# yum repolist
Loaded plugins: fastestmirror
Loading mirror speeds from cached hostfile
repo id                       repo name                                                 status
base/7/x86_64                 CentOS-7 - Base - mirrors.huaweicloud.com                 10,072
epel/7/x86_64                 EPEL for redhat/centos 7 - x86_64                         13,791
extras/7/x86_64               CentOS-7 - Extras - mirrors.huaweicloud.com                  526
updates/7/x86_64              CentOS-7 - Updates - mirrors.huaweicloud.com               6,173
repolist: 30,562
[root@haoha home]# vim install_package.sh 
[root@haoha home]# ./install_package.sh 
keyianzhuang
wangluotong
Loaded plugins: fastestmirror
Loading mirror speeds from cached hostfile
Package vsftpd-3.0.2-29.el7_9.x86_64 already installed and latest version
Nothing to do
install vsftpd success
[root@haoha home]# cat install_package.sh 
#!/bin/bash

if [ $UID != 0  ];then
        echo "Please use root login and install";
        exit
else
	echo "keyianzhuang";
	ping -c2 "mirrors.huaweicloud.com"  &>/dev/null                
	if [ $? = 0 ];then                                      
        	echo "wangluotong"
		yum -y install vsftpd
		if [ $? = 0 ];then
			echo "install vsftpd success" 
		else
			echo "install vsftpd fail"
		fi      
	else                                              
		echo "wanglue is fail"     
	fi
fi
[root@haoha home]# ll
total 4
-rwxr-xr-x. 1 root     root     493 Dec  8 06:59 install_package.sh
drwx------. 2 zhangsan zhangsan  99 Dec  8 06:38 zhangsan
[root@haoha home]# vim create_user.sh
[root@haoha home]# chmod +x create_user.sh 
[root@haoha home]# ll
total 8
-rwxr-xr-x. 1 root     root     192 Dec  8 07:11 create_user.sh
-rwxr-xr-x. 1 root     root     493 Dec  8 06:59 install_package.sh
drwx------. 2 zhangsan zhangsan  99 Dec  8 06:38 zhangsan
[root@haoha home]# ./create_user.sh 
youquanxianchuangjianyonghu
Please input username and passwold
[root@haoha home]# su -zhangsan
su: invalid option -- 'z'

Usage:
 su [options] [-] [USER [arg]...]

Change the effective user id and group id to that of USER.
A mere - implies -l.   If USER not given, assume root.

Options:
 -m, -p, --preserve-environment  do not reset environment variables
 -g, --group <group>             specify the primary group
 -G, --supp-group <group>        specify a supplemental group

 -, -l, --login                  make the shell a login shell
 -c, --command <command>         pass a single command to the shell with -c
 --session-command <command>     pass a single command to the shell with -c
                                 and do not create a new session
 -f, --fast                      pass -f to the shell (for csh or tcsh)
 -s, --shell <shell>             run shell if /etc/shells allows it

 -h, --help     display this help and exit
 -V, --version  output version information and exit

For more details see su(1).
[root@haoha home]# su - zhangsan
Last login: Mon Dec  8 06:54:29 EST 2025 on pts/0
/etc/profile
[zhangsan@haoha ~]$ cd home
-bash: cd: home: No such file or directory
[zhangsan@haoha ~]$ cd /home
[zhangsan@haoha home]$ ll
total 8
-rwxr-xr-x. 1 root     root     192 Dec  8 07:11 create_user.sh
-rwxr-xr-x. 1 root     root     493 Dec  8 06:59 install_package.sh
drwx------. 2 zhangsan zhangsan  99 Dec  8 06:38 zhangsan
[zhangsan@haoha home]$ ./create_user.sh 
Please use root login and create user
[zhangsan@haoha home]$ exit
logout
[root@haoha home]# ll
total 8
-rwxr-xr-x. 1 root     root     192 Dec  8 07:11 create_user.sh
-rwxr-xr-x. 1 root     root     493 Dec  8 06:59 install_package.sh
drwx------. 2 zhangsan zhangsan  99 Dec  8 06:38 zhangsan
[root@haoha home]# vim create_user.sh
[root@haoha home]# ./create_user.sh 
./create_user.sh: line 18: syntax error: unexpected end of file
[root@haoha home]# vim create_user.sh 
[root@haoha home]# ./create_user.sh 
Please input username and passwold
username is kong
[root@haoha home]# ./create_user.sh 
Please input username and passwoldzhangsansan zhangsan
creater user
[root@haoha home]# vim create_user.sh 
[root@haoha home]# ./create_user.sh 
Please input username and passwoldzhangsan
passwold is kong
[root@haoha home]# vim create_user.sh 
[root@haoha home]# ./create_user.sh 
Please input username and passwold:  zhangsan zhangsan
uid=1000(zhangsan) gid=1000(zhangsan) groups=1000(zhangsan)
user exit, please update other username and create
[root@haoha home]# ./create_user.sh 
Please input username and passwold:  lisi lisi
id: lisi: no such user
uid=1001(lisi) gid=1001(lisi) groups=1001(lisi)
create user success
[root@haoha home]# ll
total 8
-rwxr-xr-x. 1 root     root     666 Dec  8 07:45 create_user.sh
-rwxr-xr-x. 1 root     root     493 Dec  8 06:59 install_package.sh
drwx------. 2 lisi     lisi      62 Dec  8 07:45 lisi
drwx------. 2 zhangsan zhangsan  99 Dec  8 06:38 zhangsan
[root@haoha home]# cd 
[root@haoha ~]# ll
total 28
-rw-------. 1 root root 1244 Nov 24 01:15 anaconda-ks.cfg
-rwxr-xr-x. 1 root root  239 Dec  8 05:00 disk_use.sh
-rw-r--r--. 1 root root   84 Dec  8 06:13 install_package.sh
-rwxr-xr-x. 1 root root  292 Dec  8 02:17 modify_ip_v2.0.sh
-rwxr-xr-x. 1 root root  350 Dec  8 02:42 ping2.sh
-rwxr-xr-x. 1 root root  109 Dec  8 01:39 pingbaidu.sh
-rwxr-xr-x. 1 root root  174 Dec  7 22:27 test_place.sh
[root@haoha ~]# ./disk_use.sh 
当前使用率：9%
[root@haoha ~]# cd /home
[root@haoha home]# ll
total 8
-rwxr-xr-x. 1 root     root     666 Dec  8 07:45 create_user.sh
-rwxr-xr-x. 1 root     root     493 Dec  8 06:59 install_package.sh
drwx------. 2 lisi     lisi      62 Dec  8 07:45 lisi
drwx------. 2 zhangsan zhangsan  99 Dec  8 06:38 zhangsan
[root@haoha home]# ./install_package.sh 
keyianzhuang
wangluotong
Loaded plugins: fastestmirror
Loading mirror speeds from cached hostfile
Package vsftpd-3.0.2-29.el7_9.x86_64 already installed and latest version
Nothing to do
install vsftpd success
[root@haoha home]# ./create_user.sh wangwu wangwu
Please input username and passwold:  wangwu wangwu^C
[root@haoha home]# ./create_user.sh 
Please input username and passwold:  wangwu wangwu
id: wangwu: no such user
uid=1002(wangwu) gid=1002(wangwu) groups=1002(wangwu)
create user success

```

