# CentOS 软件包管理DNF/YUM

:tada: 2025-11-12 :tada:

---

## **一、配置阿里云 YUM 源**

### **1. 删除原有 YUM 源**
```bash
[root@yangge ~]# rm -rf /etc/yum.repos.d/*

[root@yangge ~]# yum repolist
Loaded plugins: fastestmirror, langpacks
Determining fastest mirrors
repolist: 0										# 当前没有任何YUM源（仓库），软件包的数量为0
```

### **2. 配置阿里云基本源**
```bash
[root@yangge ~]# curl https://mirrors.aliyun.com/repo/Centos-7.repo -o /etc/yum.repos.d/CentOS-Base.repo 
[root@yangge ~]# ls /etc/yum.repos.d/
CentOS-Base.repo

-o 将下载文件输出到指定文件
```
### **3. 清理并重建 YUM 缓存**
```bash
yum clean all     # 清理旧缓存【可选】
yum makecache     # 生成新缓存【可选】
```

### **4. 验证是否生效**
```bash
[root@yangge ~]# yum repolist					# 查看当前所有的YUM源
Loaded plugins: fastestmirror, langpacks
Loading mirror speeds from cached hostfile
 * base: mirrors.aliyun.com
 * extras: mirrors.aliyun.com
 * updates: mirrors.aliyun.com
repo id                           repo name                                                status
base/7/x86_64                     CentOS-7 - Base - mirrors.aliyun.com                     10,072
extras/7/x86_64                   CentOS-7 - Extras - mirrors.aliyun.com                      526
updates/7/x86_64                  CentOS-7 - Updates - mirrors.aliyun.com                   6,173
repolist: 16,771
```
### **5. 增加阿里云EPEL源**

```shell
[root@yangge ~]# curl https://mirrors.aliyun.com/repo/epel-7.repo -o /etc/yum.repos.d/epel.repo
[root@yangge ~]# ls /etc/yum.repos.d/
CentOS-Base.repo  epel.repo

[root@yangge ~]# yum repolist
Loaded plugins: fastestmirror, langpacks
Loading mirror speeds from cached hostfile
 * base: mirrors.aliyun.com
 * extras: mirrors.aliyun.com
 * updates: mirrors.aliyun.com
repo id                       repo name                                                    status
base/7/x86_64                 CentOS-7 - Base - mirrors.aliyun.com                         10,072
epel/x86_64                   Extra Packages for Enterprise Linux 7 - x86_64               13,791
extras/7/x86_64               CentOS-7 - Extras - mirrors.aliyun.com                          526
updates/7/x86_64              CentOS-7 - Updates - mirrors.aliyun.com                       6,173
repolist: 30,562
```

![](/documents/img/ops/linux/basic/yum/01.png)
![](/documents/img/ops/linux/basic/yum/02.png)

## **二、实战安装示例**

### **1. 安装常用工具**
```bash
[root@yangge ~]# yum -y install sl
[root@yangge ~]# sl

[root@yangge ~]# yum -y install wget curl vim-enhanced git net-tools bash-completion
- vim-enhanced: vi的增强版vim
- bash-completion: bash shell提供一些额外的补全

使用方法详解：
[root@yangge ~]# rpm -qa |grep vim-en
vim-enhanced-7.4.629-8.el7_9.x86_64
- rpm -qa 只列出已安装的软件包

[root@yangge ~]# yum list |grep vim-en
vim-enhanced.x86_64                      2:7.4.629-8.el7_9             @updates 
- yum list: 列出所有的YUM仓库软件包，包括已经安装的和未安装
- grep vim-en: 从所有的软件包中过滤，名字带有vim-en的包

[root@yangge ~]# yum list |grep bash-com
bash-completion.noarch                   1:2.1-8.el7                   @anaconda
bash-completion-extras.noarch            1:2.1-11.el7                  epel     
cekit-bash-completion.noarch             4.12.0-1.el7                  epel     
coccinelle-bash-completion.noarch        1.0.7-4.el7                   epel     
drbd-bash-completion.x86_64              9.17.0-1.el7                  epel     
libguestfs-bash-completion.noarch        1:1.40.2-10.el7               base     
libvirt-bash-completion.x86_64           4.5.0-36.el7_9.5              updates  
python-django-bash-completion.noarch     1.11.27-1.el7                 epel     
python-django16-bash-completion.noarch   1.6.11.7-5.el7                epel 

# 思考I
[root@yangge ~]# yum list installed |grep vsftpd
[root@yangge ~]# yum list |grep vsftpd
vsftpd.x86_64                            3.0.2-29.el7_9                updates  
vsftpd-sysvinit.x86_64    

yum list 查看所有软件包，包括已安装和未安装（软件包仓库中）
yum list installed 只查询已安装的所有软件包，相当于rpm -qa

# 思考II
[root@yangge ~]# yum list vsftpd
Loaded plugins: fastestmirror, langpacks
Loading mirror speeds from cached hostfile
 * base: mirrors.aliyun.com
 * extras: mirrors.aliyun.com
 * updates: mirrors.aliyun.com
Available Packages
vsftpd.x86_64                               3.0.2-29.el7_9                                updates 

[root@yangge ~]# yum list installed vsftpd
Loaded plugins: fastestmirror, langpacks
Loading mirror speeds from cached hostfile
 * base: mirrors.aliyun.com
 * extras: mirrors.aliyun.com
 * updates: mirrors.aliyun.com
Error: No matching Packages to list
相当于rpm -q 软件包名
```

### **2. 安装 Apache（Web 服务器）**
```bash
[root@yangge ~]# yum -y install httpd

[root@yangge ~]# systemctl start httpd					# 启动
[root@yangge ~]# systemctl enable httpd			 		# 开机自启

[root@yangge ~]# systemctl stop firewalld.service 		# 停止防火墙
[root@yangge ~]# systemctl disable firewalld.service 	# 设置开机不自启
```
访问 `http://<你的服务器IP>` 测试是否成功。

### **4. 卸载软件包**

```bash
- 卸载 vsftpd
[root@yangge ~]# yum -y install vsftpd
[root@yangge ~]# yum -y remove vsftpd

- 卸载 httpd
[root@yangge ~]# systemctl stop httpd.service 
[root@yangge ~]# yum -y remove httpd
```

### **5. 查询某个文件属于哪个包**

**案例一：没有netstat命令**

```bash
[root@yangge ~]# yum -y remove net-tools	# 卸载相应的软件包，模拟该场景
[root@yangge ~]# netstat
bash: netstat: command not found...	

# 正确的解决思路：
1. 先了解命令文件存储的位置
[root@yangge ~]# which useradd 
/usr/s`bin/useradd`
[root@yangge ~]# which date 
/`bin/date`
由以上两条命令存放的位置得知，*`bin/xxx`

2. 查询netstat命令是由哪个软件包提供的
[root@yangge ~]# yum provides "*bin/netstat"	
Loaded plugins: fastestmirror, langpacks
Loading mirror speeds from cached hostfile
 * base: mirrors.aliyun.com
 * extras: mirrors.aliyun.com
 * updates: mirrors.aliyun.com
net-tools-2.0-0.25.20131004git.el7.x86_64 : Basic networking tools
Repo        : base
Matched from:
Filename    : /bin/netstat

3. 安装相当的软件包
[root@yangge ~]# yum -y install net-tools		
[root@yangge ~]# netstat							#再次运行netstat命令，成功
```

**案例二：没有vim命令**

```bash
[root@yangge ~]# yum -y remove vim-enh*				# 卸载相应的软件包，模拟该场景	
[root@yangge ~]# vim file1
bash: vim: command not found...

1. 查询vim命令是由哪个软件包提供的
[root@yangge ~]# yum provides "*bin/vim"		
Loaded plugins: fastestmirror, langpacks
Loading mirror speeds from cached hostfile
 * base: mirrors.aliyun.com
 * extras: mirrors.aliyun.com
 * updates: mirrors.aliyun.com
2:vim-enhanced-7.4.629-7.el7.x86_64 : A version of the VIM editor which includes recent
                                    : enhancements
Repo        : base
Matched from:
Filename    : /usr/bin/vim

2. #安装软件包vim-enhanced
[root@yangge ~]# yum -y install vim-enhanced
[root@yangge ~]# vim file1
```

**案例三：没有rz/sz**

```bash
[root@tianyun ~]# yum -y remove lrzsz
[root@tianyun ~]# rz
bash: rz: command not found...

[root@tianyun ~]# yum provides *bin/rz
Loaded plugins: fastestmirror, langpacks
Loading mirror speeds from cached hostfile
 * base: mirrors.aliyun.com
 * extras: mirrors.aliyun.com
 * updates: mirrors.aliyun.com
lrzsz-0.12.20-36.el7.x86_64 : The lrz and lsz modem communications programs
Repo        : base
Matched from:
Filename    : /usr/bin/rz

[root@tianyun ~]# yum -y install lrzsz
```

**案例四：没有 vsftpd.conf 文件**

```bash
[root@yangge ~]# ls /etc/vsftpd/vsftpd.conf
ls: cannot access /etc/vsftpd/vsftpd.conf: No such file or directory

[root@yangge ~]# yum provides "*/vsftpd.conf"
Loaded plugins: fastestmirror, langpacks
Loading mirror speeds from cached hostfile
 * base: mirrors.aliyun.com
 * extras: mirrors.aliyun.com
 * updates: mirrors.aliyun.com
fail2ban-server-0.11.2-3.el7.noarch : Core server component for Fail2Ban
Repo        : epel
Matched from:
Filename    : /etc/fail2ban/filter.d/vsftpd.conf		#明确不是它

vsftpd-3.0.2-28.el7.x86_64 : Very Secure Ftp Daemon
Repo        : base
Matched from:
Filename    : /usr/share/doc/vsftpd-3.0.2/EXAMPLE/INTERNET_SITE_NOINETD/vsftpd.conf
Filename    : /etc/vsftpd/vsftpd.conf					#就是它
Filename    : /usr/share/doc/vsftpd-3.0.2/EXAMPLE/VIRTUAL_USERS/vsftpd.conf
Filename    : /usr/share/doc/vsftpd-3.0.2/EXAMPLE/INTERNET_SITE/vsftpd.conf

[root@yangge ~]# yum -y install vsftpd					#安装找到软件包
[root@yangge ~]# ls /etc/vsftpd/vsftpd.conf
/etc/vsftpd/vsftpd.conf
```

**查询文件属于某个包—总结**

```bash
找的是某个`命令文件`   yum provides "*bin/vim"
					yum provides "*bin/netstat"
					yum provides "*bin/rz"
					
找的是某个`普通文件`   yum provides "*/vsftpd.conf"
					yum provides "/etc/vsftpd/vsftpd.conf"
```

## **三、YUM 基础入门（常用命令）**

| 命令           | 作用               | 示例                               |
| -------------- | ------------------ | ---------------------------------- |
| `yum install`  | 安装软件           | `yum install nginx`                |
| `yum remove`   | 卸载软件           | `yum remove nginx`                 |
| `yum update`   | 更新所有软件       | `yum update`                       |
| `yum search`   | 搜索软件包         | `yum search python3`               |
| `yum list`     | 列出可用软件       | `yum list installed`（已安装的包） |
| `yum info`     | 查看软件信息       | `yum info nginx`                   |
| `yum provides` | 查找文件属于哪个包 | `yum provides /usr/bin/python3`    |

```bash
[root@yangge ~]# yum search vsftpd
Loaded plugins: fastestmirror, langpacks
Loading mirror speeds from cached hostfile
 * base: mirrors.aliyun.com
 * extras: mirrors.aliyun.com
 * updates: mirrors.aliyun.com
====================================== N/S matched: vsftpd ======================================
vsftpd-sysvinit.x86_64 : SysV initscript for vsftpd daemon
vsftpd.x86_64 : Very Secure Ftp Daemon

  Name and summary matches only, use "search all" for everything.
  
[root@yangge ~]# yum info vsftpd
Loaded plugins: fastestmirror, langpacks
Loading mirror speeds from cached hostfile
 * base: mirrors.aliyun.com
 * extras: mirrors.aliyun.com
 * updates: mirrors.aliyun.com
Installed Packages
Name        : vsftpd
Arch        : x86_64
Version     : 3.0.2
Release     : 29.el7_9
Size        : 353 k
Repo        : installed
From repo   : updates
Summary     : Very Secure Ftp Daemon
URL         : https://security.appspot.com/vsftpd.html
License     : GPLv2 with exceptions
Description : vsftpd is a Very Secure FTP daemon. It was written completely from
            : scratch.  

# 查看yum执行的历史条目
[root@yangge ~]# yum history 
Loaded plugins: fastestmirror, langpacks
ID     | Login user               | Date and time    | Action(s)      | Altered
-------------------------------------------------------------------------------
    12 | root <root>              | 2025-07-23 14:39 | Install        |    1   
    11 | root <root>              | 2025-07-23 14:33 | Install        |    1   
    10 | root <root>              | 2025-07-23 14:29 | Erase          |    1   
     9 | root <root>              | 2025-07-23 14:26 | Install        |    1   
     8 | root <root>              | 2025-07-23 14:13 | Erase          |    1   
     7 | root <root>              | 2025-07-23 11:50 | Erase          |    1   
     6 | root <root>              | 2025-07-23 11:48 | Erase          |    1   
     5 | root <root>              | 2025-07-23 11:48 | Install        |    1   
     4 | root <root>              | 2025-07-23 11:45 | Install        |    5   
     3 | root <root>              | 2025-07-23 11:38 | I, U           |    8   
     2 | root <root>              | 2025-07-23 11:37 | Install        |    1   
     1 | System <unset>           | 2025-07-14 17:14 | Install        | 1407  

[root@yangge ~]# yum history list 10
Loaded plugins: fastestmirror, langpacks
ID     | Command line             | Date and time    | Action(s)      | Altered
-------------------------------------------------------------------------------
    10 | -y remove vim-enh*       | 2025-07-23 14:29 | Erase          |    1   
    
[root@yangge ~]# yum history list 11
Loaded plugins: fastestmirror, langpacks
ID     | Command line             | Date and time    | Action(s)      | Altered
-------------------------------------------------------------------------------
    11 | -y install vim-enhanced  | 2025-07-23 14:33 | Install        |    1  
    
[root@yangge ~]# yum history undo 11
```

## **四、扩展-创建系统初始化脚本**

### 1. 创建系统初始化脚本

**[root@yangge ~]# vim init.sh**			

```shell
#!/bin/bash
# by tianyun v1.0
# 2025.7.23

#删除系统原有的YUM源
rm -rf /etc/yum.repos.d/*
                 
#配置阿里云基础源（base,extras,updates）
curl https://mirrors.aliyun.com/repo/Centos-7.repo -o /etc/yum.repos.d/CentOS-Base.repo
                 
#配置阿里云EPEL源
curl https://mirrors.aliyun.com/repo/epel-7.repo -o /etc/yum.repos.d/epel.repo
               
#安装基本的软件包
yum install -y wget curl vim-enhanced git net-tools bash-completion lrzsz
  
#关闭防火墙
systemctl stop firewalld.service
systemctl disable firewalld.service
```

### 2. 增加执行权限并测试

```bash
[root@yangge ~]# chmod +x init.sh 
[root@yangge ~]# ./init.sh
```

### 3. 将init.sh传到windows

```bash
[root@yangge ~]# yum -y install lrzsz
[root@yangge ~]# sz init.sh
```

### 4. 将init.sh传到新安装的Linux

```bash
[root@yangge ~]# rz
- 如果没有rz命令，可以使用其它方法上传文件
```

![](/documents/img/ops/linux/basic/yum/03/01.png)
![](/documents/img/ops/linux/basic/yum/03/02.png)
![](/documents/img/ops/linux/basic/yum/03/03.png)
![](/documents/img/ops/linux/basic/yum/03/04.png)
![](/documents/img/ops/linux/basic/yum/03/05.png)
![](/documents/img/ops/linux/basic/yum/03/06.png)
![](/documents/img/ops/linux/basic/yum/03/07.png)
![](/documents/img/ops/linux/basic/yum/03/08.png)
![](/documents/img/ops/linux/basic/yum/03/09.png)
![](/documents/img/ops/linux/basic/yum/03/10.png)