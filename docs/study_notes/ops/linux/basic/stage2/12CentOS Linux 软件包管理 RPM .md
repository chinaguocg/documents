# CentOS 软件包管理 RPM 

:tada: 2025-11-13 :tada:

## 一、RPM 基础概念

RPM (Red Hat Package Manager) 是 CentOS/RHEL 系统的核心软件包管理工具，用于安装、查询、验证、更新和卸载软件包。

### 1. RPM 包命名规则
```bash
包名-版本号-发布号.系统架构.rpm

示例：
nginx-1.20.1-1.el7.x86_64.rpm
nginx-1.20.1-1.el7.ppc64le.rpm

python3-3.9.19-8.el9.x86_64.rpm
python3-3.9.19-8.el9.aarch64.rpm
python3-3.9.19-8.el9.ppc64le.rpm
```

### 2. 安装前需要知道的

```bash
# 查看当前系统版本
[tianyun@yangge ~]$ cat /etc/redhat-release
CentOS Linux release 7.9.2009 (Core)

# 查看当前系统架构（CPU）
[tianyun@yangge ~]$ uname -m
x86_64

# 获取RPM软件包，例如从安装光盘 CentOS-7-x86_64-Everything-2009.iso
先把ISO镜像文件放入光驱
[tianyun@yangge ~]$ sudo mount /dev/cdrom /mnt/				# 将光盘临时挂载到/mnt目录
mount: /dev/sr0 is write-protected, mounting read-only
[tianyun@yangge ~]$ ls /mnt/Packages/						# 此处为rpm包存放位置
vsftpd-3.0.2-28.el7.x86_64.rpm								# FTP服务器的软件包
httpd-2.4.6-95.el7.centos.x86_64.rpm						# Web服务器Apache的软件包
```

## 二、RPM 基本操作

### 1. 安装软件包
```bash
[tianyun@yangge ~]$ rpm -q vsftpd							# -q查询是否安装
package vsftpd is not installed
[tianyun@yangge ~]$ sudo rpm -ivh /mnt/Packages/vsftpd-3.0.2-28.el7.x86_64.rpm 
warning: /mnt/Packages/vsftpd-3.0.2-28.el7.x86_64.rpm: Header V3 RSA/SHA256 Signature, key ID f4a80eb5: NOKEY
Preparing...                          ################################# [100%]
Updating / installing...
   1:vsftpd-3.0.2-28.el7              ################################# [100%]
```
选项说明：
- `-i`：安装install
- `-v`：显示详细信息
- `-h`：显示进度条（hash线#）

### 2. 卸载软件包
```bash
[tianyun@yangge ~]$ sudo rpm -e vsftpd
```

## 三、查询操作

### 1. 查询已安装的包
```bash
# 查看所有已安装的包
[tianyun@yangge ~]$ rpm -qa
[tianyun@yangge ~]$ rpm -qa |grep vsftpd
[tianyun@yangge ~]$ rpm -qa |grep vim-en
vim-enhanced-7.4.629-7.el7.x86_64				# 该包为vi增强包，如果不安装，vi没有颜色【最小化系统安装，未装】
[tianyun@yangge ~]$ rpm -qa |grep bash
bash-completion-2.1-8.el7.noarch				# 该包能支持命令更多的自动补全【最小化系统安装，未装】
bash-4.2.46-34.el7.x86_64

# 查询特定包是否安装
[tianyun@yangge ~]$ rpm -q vsftpd
package vsftpd is not installed
[tianyun@yangge ~]$ rpm -q vim-enhanced
vim-enhanced-7.4.629-7.el7.x86_64

- 以下内容仅供了
# 查询文件属于哪个包
[tianyun@yangge ~]$ rpm -qf /etc/passwd
setup-2.8.71-11.el7.noarch
[tianyun@yangge ~]$ rpm -qf /usr/bin/netstat 
net-tools-2.0-0.25.20131004git.el7.x86_64

注意事项：
[tianyun@yangge ~]$ rpm -qf /etc/vsftpd/vsftpd.conf			
error: file /etc/vsftpd/vsftpd.conf: No such file or directory		# 没有安装提供该文件的软件包
[tianyun@yangge ~]$ sudo rpm -ivh /mnt/Packages/vsftpd-3.0.2-28.el7.x86_64.rpm 
warning: /mnt/Packages/vsftpd-3.0.2-28.el7.x86_64.rpm: Header V3 RSA/SHA256 Signature, key ID f4a80eb5: NOKEY
Preparing...                          ################################# [100%]
Updating / installing...
   1:vsftpd-3.0.2-28.el7              ################################# [100%]
[tianyun@yangge ~]$ rpm -qf /etc/vsftpd/vsftpd.conf 
vsftpd-3.0.2-28.el7.x86_64

# 显示包的详细信息
[tianyun@yangge ~]$ rpm -qi vsftpd
Name        : vsftpd
Version     : 3.0.2
Release     : 28.el7
Architecture: x86_64
Install Date: Wed 23 Jul 2025 10:12:21 AM CST
Group       : System Environment/Daemons
Size        : 361231
License     : GPLv2 with exceptions
Signature   : RSA/SHA256, Thu 15 Oct 2020 03:02:43 AM CST, Key ID 24c6a8a7f4a80eb5
Source RPM  : vsftpd-3.0.2-28.el7.src.rpm
Build Date  : Wed 14 Oct 2020 12:10:57 AM CST
Build Host  : x86-01.bsys.centos.org
Relocations : (not relocatable)
Packager    : CentOS BuildSystem <http://bugs.centos.org>
Vendor      : CentOS
URL         : https://security.appspot.com/vsftpd.html
Summary     : Very Secure Ftp Daemon
Description :
vsftpd is a Very Secure FTP daemon. It was written completely from
scratch.

# 列出包安装的文件【所有文件】
[tianyun@yangge ~]$ rpm -ql vsftpd
/etc/logrotate.d/vsftpd
/etc/pam.d/vsftpd
/etc/vsftpd
/etc/vsftpd/ftpusers
/etc/vsftpd/user_list
/etc/vsftpd/vsftpd.conf
/etc/vsftpd/vsftpd_conf_migrate.sh
/usr/lib/systemd/system-generators/vsftpd-generator
/usr/lib/systemd/system/vsftpd.service
/usr/lib/systemd/system/vsftpd.target
/usr/lib/systemd/system/vsftpd@.service
/usr/sbin/vsftpd
......

# 列出包安装的配置文件
[tianyun@yangge ~]$ rpm -qc vsftpd
/etc/logrotate.d/vsftpd
/etc/pam.d/vsftpd
/etc/vsftpd/ftpusers
/etc/vsftpd/user_list
/etc/vsftpd/vsftpd.conf
```

### 2. 查询未安装的 RPM 文件
```bash
[tianyun@yangge ~]$ rpm -q httpd
package httpd is not installed
[tianyun@yangge ~]$ rpm -qi httpd
package httpd is not installed

# 查看 RPM 文件信息
[tianyun@yangge ~]$ rpm -qpi /mnt/Packages/httpd-2.4.6-95.el7.centos.x86_64.rpm
warning: /mnt/Packages/httpd-2.4.6-95.el7.centos.x86_64.rpm: Header V3 RSA/SHA256 Signature, key ID f4a80eb5: NOKEY
Name        : httpd
Version     : 2.4.6
Release     : 95.el7.centos
Architecture: x86_64
Install Date: (not installed)
Group       : System Environment/Daemons
Size        : 9821056
License     : ASL 2.0
......

# 列出 RPM 文件包含的文件【所有文件】
[tianyun@yangge ~]$ rpm -qpl /mnt/Packages/httpd-2.4.6-95.el7.centos.x86_64.rpm 
warning: /mnt/Packages/httpd-2.4.6-95.el7.centos.x86_64.rpm: Header V3 RSA/SHA256 Signature, key ID f4a80eb5: NOKEY
/etc/httpd
/etc/httpd/conf
/etc/httpd/conf.d
/etc/httpd/conf.d/README
/etc/httpd/conf.d/autoindex.conf
/etc/httpd/conf.d/userdir.conf
/etc/httpd/conf.d/welcome.conf
/etc/httpd/conf.modules.d

# 列出包安装的配置文件
[tianyun@yangge ~]$ rpm -qpc /mnt/Packages/httpd-2.4.6-95.el7.centos.x86_64.rpm 
warning: /mnt/Packages/httpd-2.4.6-95.el7.centos.x86_64.rpm: Header V3 RSA/SHA256 Signature, key ID f4a80eb5: NOKEY
/etc/httpd/conf.d/autoindex.conf
/etc/httpd/conf.d/userdir.conf
/etc/httpd/conf.d/welcome.conf
/etc/httpd/conf.modules.d/00-base.conf
/etc/httpd/conf.modules.d/00-dav.conf
/etc/httpd/conf.modules.d/00-lua.conf
/etc/httpd/conf.modules.d/00-mpm.conf
/etc/httpd/conf.modules.d/00-proxy.conf
/etc/httpd/conf.modules.d/00-systemd.conf
/etc/httpd/conf.modules.d/01-cgi.conf
/etc/httpd/conf/httpd.conf
/etc/httpd/conf/magic
/etc/logrotate.d/httpd
/etc/sysconfig/htcacheclean
/etc/sysconfig/httpd
```

## 四、痛苦的安装经历

```bash
[tianyun@yangge ~]$ sudo rpm -ivh /mnt/Packages/httpd-2.4.6-95.el7.centos.x86_64.rpm 
warning: /mnt/Packages/httpd-2.4.6-95.el7.centos.x86_64.rpm: Header V3 RSA/SHA256 Signature, key ID f4a80eb5: NOKEY
error: Failed dependencies:
        /etc/mime.types is needed by httpd-2.4.6-95.el7.centos.x86_64
        httpd-tools = 2.4.6-95.el7.centos is needed by httpd-2.4.6-95.el7.centos.x86_64
        libapr-1.so.0()(64bit) is needed by httpd-2.4.6-95.el7.centos.x86_64
        libaprutil-1.so.0()(64bit) is needed by httpd-2.4.6-95.el7.centos.x86_64
 
尝试去解决：
[tianyun@yangge ~]$ cd /mnt/Packages/
[tianyun@yangge Packages]$ sudo rpm -ivh httpd-2.4.6-95.el7.centos.x86_64.rpm httpd-tools-2.4.6-95.el7.centos.x86_64.rpm apr-1.4.8-7.el7.x86_64.rpm apr-util-1.5.2-6.el7.x86_64.rpm mailcap-2.1.41-2.el7.noarch.rpm 
warning: httpd-2.4.6-95.el7.centos.x86_64.rpm: Header V3 RSA/SHA256 Signature, key ID f4a80eb5: NOKEY
Preparing...                          ################################# [100%]
Updating / installing...
   1:apr-1.4.8-7.el7                  ################################# [ 20%]
   2:apr-util-1.5.2-6.el7             ################################# [ 40%]
   3:httpd-tools-2.4.6-95.el7.centos  ################################# [ 60%]
   4:mailcap-2.1.41-2.el7             ################################# [ 80%]
   5:httpd-2.4.6-95.el7.centos        ################################# [100%]

过程集猜测、经验、百度一系列手段，才得以解决
结论：赶快学习YUM或DNF，因为它们会自动解决包的依赖关系
```


![](/documents/img/ops/linux/basic/rpm/01.png)
![](/documents/img/ops/linux/basic/rpm/02.png)
![](/documents/img/ops/linux/basic/rpm/03.png)