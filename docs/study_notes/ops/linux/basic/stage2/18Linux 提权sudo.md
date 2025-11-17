# Linux 提权sudo 

## 一、sudo基础概念

sudo（superuser do）是Linux系统中允许特定用户以其他用户身份（通常是root）执行命令的工具，相比直接使用root账户更安全。

**sudo劣势：不能集中管理用户**，所以，用堡垒机、跳板机代替。精细化的设置一般都在堡垒机或者跳板机中设置。

### sudo优势：
- 细粒度的权限控制
- 命令执行记录可审计
- 避免共享root密码
- 可限制特定用户执行特定命令

```bash
- Ubuntu系统安装过程中，创建的普通用户默认为sudo用户。

- CentOS系统安装过程中，创建普通用户时，如果选择了这个小勾，同上。
```

![](/documents/img/ops/linux/basic/sudo/CentOS-Sudo.jpg)
![](/documents/img/ops/linux/basic/sudo/01.png)
![](/documents/img/ops/linux/basic/sudo/02.png)
![](/documents/img/ops/linux/basic/sudo/03.png)
![](/documents/img/ops/linux/basic/sudo/04.png)
![](/documents/img/ops/linux/basic/sudo/05.png)
![](/documents/img/ops/linux/basic/sudo/06.png)
![](/documents/img/ops/linux/basic/sudo/07.png)
![](/documents/img/ops/linux/basic/sudo/08.png)
![](/documents/img/ops/linux/basic/sudo/09.png)
![](/documents/img/ops/linux/basic/sudo/10.png)
![](/documents/img/ops/linux/basic/sudo/11.png)

## 二、最快的方法使用sudo

### 1. 加入到wheel组
```bash
[root@tianyun ~]# useradd zhuzhuxia -G wheel		# 新建用户时，直接加入wheel组
[root@tianyun ~]# usermod zhuzhuxia -G wheel
#修改所属组，修改完后sudo不会及时更新，需要用户注销（退出）后再重新登录才可以
	
[root@tianyun ~]# useradd alice					
[root@tianyun ~]# gpasswd -a alice wheel			# 将老用户加入wheel组
Adding user alice to group wheel
[root@tianyun ~]# id alice
uid=1001(alice) gid=1001(alice) groups=1001(alice),10(wheel)
```

### 2. 测试sudo
```bash
[alice@tianyun ~]$ sudo useradd user1
[sudo] password for alice: 							# alice自己的密码

[alice@tianyun ~]$ sudo passwd user1
Changing password for user user1.
New password: 
BAD PASSWORD: The password is a palindrome
Retype new password: 
passwd: all authentication tokens updated successfully.

[alice@tianyun ~]$ sudo yum -y install vsftpd
```

## 三、sudo配置文件解析

### 主配置文件路径：
```
/etc/sudoers
```

### 推荐编辑方式（避免语法错误）：
```bash
[root@tianyun ~]# visudo

## Allows people in group wheel to run all commands
%wheel  ALL=(ALL)       ALL							# 最后ALL，任何命令

## Same thing without a password
# %wheel        ALL=(ALL)       NOPASSWD: ALL		# 执行sudo命令时，不需要输入自己密码
```

## 四、实战配置案例

### 案例1：允许用户执行所有命令
```bash
[root@tianyun ~]# visudo
yangge ALL=(ALL)       NOPASSWD: ALL

01 ALL: 从任何主机
02 ALL: 以任何用户的身份，包括root
03 ALL: 执行任何命令
NOPASSWD: 不需要自己的密码（防止当前坐在电脑前的不是你）

测试：
[yangge@tianyun ~]$ sudo useradd user40
[yangge@tianyun ~]$ id user40
[yangge@tianyun ~]$ sudo yum -y install ftp

- 以上操作等价于将用户加入到wheel组
```

### 案例2：允许用户组执行所有命令
```bash
[root@alice ~]# groupadd it
[root@alice ~]# useradd it01 -G it
[root@alice ~]# useradd it02 -G it

[root@alice ~]# visudo
%it     ALL=(ALL)       NOPASSWD: ALL

测试：
[root@alice ~]# su - it01
[it01@alice ~]$ useradd user50
useradd: Permission denied.
useradd: cannot lock /etc/passwd; try again later.
[it01@alice ~]$ sudo useradd user50
```

### 案例3：允许执行特定命令
```bash
tom ALL=(ALL) NOPASSWD: /usr/bin/systemctl restart httpd

alice  ALL=(ALL)  NOPASSWD: /bin/cat, /usr/sbin/userdel

测试：
[alice@alice ~]$ cat /etc/shadow						# 以alice自己身份运行cat是看不了shadow文件
cat: /etc/shadow: Permission denied
[alice@alice ~]$ ls -l /etc/shadow
----------. 1 root root 1762 Jul 22 11:05 /etc/shadow

[alice@alice ~]$ sudo cat /etc/shadow					# 以root的身份运行cat

[alice@alice ~]$ sudo useradd user60
[sudo] password for alice: 
Sorry, user alice is not allowed to execute '/sbin/useradd user60' as root on alice.
[alice@alice ~]$ sudo userdel user40
```

### 案例4：定义命令别名
```bash
用户管理员：
/usr/sbin/useradd
/usr/sbin/usermod
/usr/sbin/userdel
/usr/bin/passwd
/usr/sbin/groupadd
/usr/sbin/groupmod
/usr/sbin/groupdel
/usr/bin/gpasswd

要求：将alice、tom、jack都设置为用户管理员

【方法一：传统笨】
alice  ALL=(ALL)  NOPASSWD: /usr/sbin/useradd, /usr/sbin/usermod, /usr/sbin/userdel, /usr/sbin/groupadd, /usr/sbin/groupmod, /usr/sbin/groupdel,/usr/bin/gpasswd, /usr/bin/passwd

tom  ALL=(ALL)  NOPASSWD: /usr/sbin/useradd, /usr/sbin/usermod, /usr/sbin/userdel, /usr/sbin/groupadd, /usr/sbin/groupmod, /usr/sbin/groupdel,/usr/bin/gpasswd, /usr/bin/passwd

jack  ALL=(ALL)  NOPASSWD: /usr/sbin/useradd, /usr/sbin/usermod, /usr/sbin/userdel, /usr/sbin/groupadd, /usr/sbin/groupmod, /usr/sbin/groupdel,/usr/bin/gpasswd, /usr/bin/passwd

【方法二：命令别名】
# User Management
Cmnd_Alias USER_ADMIN = /usr/sbin/useradd, /usr/sbin/usermod, /usr/sbin/userdel, /usr/sbin/groupadd, /usr/sbin/groupmod, /usr/sbin/groupdel, /usr/bin/gpasswd, /usr/bin/passwd

alice  ALL=(ALL)  NOPASSWD: USER_ADMIN
tom    ALL=(ALL)  NOPASSWD: USER_ADMIN
jack   ALL=(ALL)  NOPASSWD: USER_ADMIN

测试：
[alice@alice ~]$ sudo useradd user60
[alice@alice ~]$ sudo usermod -s /sbin/nologin user60
[alice@alice ~]$ sudo passwd user60
[alice@alice ~]$ sudo userdel user60
[alice@alice ~]$ sudo groupadd cloud2503
[alice@alice ~]$ sudo cat /etc/shadow
[sudo] password for alice: 
Sorry, user alice is not allowed to execute '/bin/cat /etc/shadow' as root on alice.

Cmnd_Alias NETWORKING = /sbin/route, /sbin/ifconfig, /bin/ping		# 定义别名NETWROKING
tom ALL=(ALL) NETWORKING
```

```bash
- 系统默认定义好的命令别名：

# Command Aliases
## These are groups of related commands...

## Networking
# Cmnd_Alias NETWORKING = /sbin/route, /sbin/ifconfig, /bin/ping, /sbin/dhclient, /usr/bin/net, /sbin/iptables, /usr/bin/rfcomm, /usr/bin/wvdial, /sbin/iwconfig, /sbin/mii-tool

## Installation and management of software
# Cmnd_Alias SOFTWARE = /bin/rpm, /usr/bin/up2date, /usr/bin/yum

## Services
# Cmnd_Alias SERVICES = /sbin/service, /sbin/chkconfig, /usr/bin/systemctl start, /usr/bin/systemctl stop, /usr/bin/systemctl reload, /usr/bin/systemctl restart, /usr/bin/systemctl status, /usr/bin/systemctl enable, /usr/bin/systemctl disable

## Updating the locate database
# Cmnd_Alias LOCATE = /usr/bin/updatedb

## Storage
# Cmnd_Alias STORAGE = /sbin/fdisk, /sbin/sfdisk, /sbin/parted, /sbin/partprobe, /bin/mount, /bin/umount


alice  ALL=(ALL)	NOPASSWD: SOFTWARE					# SOFTWARE前面定义的命令别名
jack   ALL=(ALL)	NOPASSWD: SERVICES, SOFTWARE
```

```bash
- 建议使用方法：
[root@yangge ~]# groupadd user_admin
[root@yangge ~]# groupadd net_admin
[root@yangge ~]# groupadd storage_admin
[root@yangge ~]# groupadd software_admin
[root@yangge ~]# groupadd service_admin

[root@yangge ~]# visudo
%user_admin  	ALL=(ALL)	NOPASSWD: USER_ADMIN		# USER_ADMIN 事先定义好的命令别名
%net_admin  	ALL=(ALL)	NOPASSWD: NETWORKING		# NETWORKING 事先定义好的命令别名
%storage_admin  ALL=(ALL)	NOPASSWD: STORAGE			# STORAGE 事先定义好的命令别名
%software_admin ALL=(ALL)	NOPASSWD: SOFTWARE			# SOFTWARE 事先定义好的命令别名
%service_admin  ALL=(ALL)	NOPASSWD: SERVICES			# SERVICES 事先定义好的命令别名
```

### 案例5：命令排除

```bash
alice   ALL=(ALL)       NOPASSWD: /usr/bin/passwd, /usr/sbin/useradd

[alice@alice ~]$ passwd tom							# 修改指定用户的密码
passwd: Only root can specify a user name.
[alice@alice ~]$ sudo passwd tom
Changing password for user tom.
New password: 
BAD PASSWORD: The password is a palindrome
Retype new password: 
passwd: all authentication tokens updated successfully.

[alice@alice ~]$ sudo passwd root					# 修改root用户的密码
Changing password for user root.
New password: 
BAD PASSWORD: The password is a palindrome
Retype new password: 
passwd: all authentication tokens updated successfully.


如果不希望修改root密码： 
alice   ALL=(ALL)       NOPASSWD: /usr/bin/passwd, !/usr/bin/passwd root,  /usr/sbin/useradd

测试：
[alice@alice ~]$ sudo passwd root
Sorry, user alice is not allowed to execute '/bin/passwd root' as root on alice.
[alice@alice ~]$ sudo passwd tom
Changing password for user tom.
New password: 
BAD PASSWORD: The password is a palindrome
Retype new password: 
passwd: all authentication tokens updated successfully.
```

## 五、Ubuntu使用sudo

```bash
默认情况下，Ubuntu visudo使用的编辑器是nano
yangge@server01:~$ sudo visudo 
Defaults editor=/usr/bin/vim

# User privilege specification
root    ALL=(ALL:ALL) ALL

# Members of the admin group may gain root privileges
%admin ALL=(ALL) ALL

# Allow members of group sudo to execute any command
%sudo   ALL=(ALL:ALL) ALL

alice  ALL=(ALL) NOPASSWD: /usr/bin/vim /etc/hosts, /usr/bin/vim /etc/httpd/*.conf

01 ALL: 从任何主机
02 ALL: 以任何用户的身份，包括root用户
03 ALL: 以任何组的身份，包括root组
04 ALL: 执行任何命令
NOPASSWD: 不需要自己的密码（防止当前坐在电脑前的不是你）
```

## 六、不同用户的区别

```bash
- root
超级用户：房东

- CentOS: %wheel   ALL=(ALL) ALL
- Ubuntu: %sudo    ALL=(ALL) ALL
万能钥匙授权用户

- alice
普通用户：租客
```

## 七、安装堡垒机

jumpserver堡垒机：社区版不提供Windows server的服务，官网地址：www.jumpserver.org, 文档地址：https://www.jumpserver.com/docs, [开源社区 - FIT2CLOUD 飞致云-操作文档](https://community.fit2cloud.com/#/products/jumpserver/documentation),下载安装地址：[开源社区 - FIT2CLOUD 飞致云](https://community.fit2cloud.com/#/products/jumpserver/getstarted)

仅需两步快速安装 JumpServer：

1. 准备一台 4核8G （最低）且可以访问互联网的 64 位 Linux 主机；
2. 以 root 用户执行如下命令一键安装 JumpServer。

```bash
curl -sSL https://resource.fit2cloud.com/jumpserver/jumpserver/releases/latest/download/quick_start.sh | bash
```

实验环境2核4G

```bash
[root@node3 ~]# lscpu
Architecture:          x86_64
CPU op-mode(s):        32-bit, 64-bit
Byte Order:            Little Endian
CPU(s):                2
On-line CPU(s) list:   0,1
Thread(s) per core:    1
Core(s) per socket:    1
Socket(s):             2
NUMA node(s):          1
Vendor ID:             GenuineIntel
CPU family:            6
Model:                 61
Model name:            Intel(R) Core(TM) i5-5200U CPU @ 2.20GHz
Stepping:              4
CPU MHz:               2194.775
BogoMIPS:              4389.84
Virtualization:        VT-x
Hypervisor vendor:     VMware
Virtualization type:   full
L1d cache:             32K
L1i cache:             32K
L2 cache:              256K
L3 cache:              3072K
NUMA node0 CPU(s):     0,1
Flags:                 fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush mmx fxsr sse sse2 ss syscall nx pdpe1gb rdtscp lm constant_tsc arch_perfmon nopl xtopology tsc_reliable nonstop_tsc eagerfpu pni pclmulqdq vmx ssse3 fma cx16 pcid sse4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand hypervisor lahf_lm abm 3dnowprefetch tpr_shadow vnmi ept vpid fsgsbase tsc_adjust bmi1 avx2 smep bmi2 invpcid rdseed adx smap xsaveopt arat

[root@node3 ~]curl -sSL https://resource.fit2cloud.com/jumpserver/jumpserver/releases/latest/download/quick_start.sh | bash

3. Web access
http://192.168.230.131:80
Default username: admin  Default password: ChangeMe

 More information
Official Website: https://www.jumpserver.com/
Documentation: https://www.jumpserver.com/docs


[+] Running 8/8
 ✔ Container jms_chen        Started                                                                                                                                                                       11.5s 
 ✔ Container jms_postgresql  Running                                                                                                                                                                        0.0s 
 ✔ Container jms_web         Started                                                                                                                                                                       11.7s 
 ✔ Container jms_core        Started                                                                                                                                                                       11.7s 
 ✔ Container jms_redis       Running                                                                                                                                                                        0.0s 
 ✔ Container jms_koko        Started                                                                                                                                                                       11.3s 
 ✔ Container jms_lion        Started                                                                                                                                                                       11.5s 
 ✔ Container jms_celery      Started                                                                                                                                                                       11.3s 
[root@node3 ~]# 

```

