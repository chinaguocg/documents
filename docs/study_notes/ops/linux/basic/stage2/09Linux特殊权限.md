# Linux 特殊权限：SUID、SGID 和 Sticky Bit

:tada: 2025-11-12 :tada:

在 Linux 系统中，除了常见的读(r)、写(w)、执行(x)权限外，还有三种特殊权限：SUID、SGID 和 Sticky Bit。这些权限在系统安全和功能控制方面起着重要作用。

## 一、SUID (Set User ID)

### 1. 基本概念
- **作用**：当用户执行设置了SUID的程序时，程序会以文件所有者（通常为root）的权限运行，而不是执行者的权限
- **表示方法**：在所有者执行权限位上显示为 `s`（如 `-rwsr-xr-x`）
- **数值表示**：4

### 2. 案例1
```bash
[yangge01@tianyun ~]$ cat /etc/shadow			# 没有设置SUID前的cat
cat: /etc/shadow: Permission denied

[yangge01@tianyun ~]$ ls -l /etc/shadow
----------. 1 root root 1214 Jul  2 14:26 /etc/shadow

yangge01   ----------/usr/bin/cat-----------/etc/shadow
未加SUID：   以yangge01的身份运行/usr/bin/cat程序

yangge01   ----------/usr/bin/cat-----------/etc/shadow
						 +SUID
加SUID：     以root的身份运行/usr/bin/cat程序

[root@tianyun ~]# chmod u+s /usr/bin/cat		# 设置SUID，755为原来的基本权限，4为特殊权限suid

[yangge01@tianyun ~]$ cat /etc/shadow			# 成功，因为是以cat文件所有者（root）身份运行
```

### 3. 案例2
```bash
普通用户能够使用useradd创建账号：

[root@tianyun ~]# which useradd
/usr/sbin/useradd
[root@tianyun ~]# ls -l /usr/sbin/useradd
-rwxr-xr-x. 1 root root 137616 Aug  9  2019 /usr/sbin/useradd

[yangge01@tianyun ~]$ useradd newuser				# 失败，因为useradd没有SUID，则有普通用户身份运行useradd
useradd: Permission denied.
useradd: cannot lock /etc/passwd; try again later.

yangge01   ----------/usr/sbin/useradd-----------(/etc/passwd,/etc/shadow)
						  +SUID

# 解读：
加SUID前： 以yangge01的身份运行/usr/sbin/useradd程序
加SUID后： 以root的身份运行/usr/sbin/useradd程序  

[root@tianyun ~]# chmod u+s /usr/sbin/useradd 		# 设置SUID
[root@tianyun ~]# ls -l /usr/sbin/useradd
-rwsr-xr-x. 1 root root 137616 Aug  9  2019 /usr/sbin/useradd

[yangge01@tianyun ~]$ useradd newuser				# 成功，因为是以useradd文件所有者（root）身份运行
```

## 二、SGID (Set Group ID)

### 1. 基本概念
- **作用**：在该目录下创建的新文件会继承目录的 **属组**，针对目录
- **表示方法**：在所 **属组执行权限** 位上显示为 `s`（如 `-rwxr-sr-x`）
- **数值表示**：2

### 2. 没有SGID
```bash
[root@tianyun ~]# mkdir /home/dir1
[root@tianyun ~]# chown :OPS /home/dir1
[root@tianyun ~]# ls -ld /home/dir1
drwxr-xr-x. 2 root OPS 6 Jul  2 14:37 /home/dir1		# 属组OPS

测试：
[root@tianyun ~]# touch /home/dir1/file1
[root@tianyun ~]# ls -l /home/dir1
-rw-r--r--. 1 root root 0 Jul  2 14:40 file1
```

### 3. 设置SGID
```bash
[root@tianyun ~]# mkdir /home/dir2
[root@tianyun ~]# chown :OPS /home/dir1
[root@tianyun ~]# chmod g+s /home/dir2					# 设置SGID
[root@tianyun ~]# ls -ld /home/dir2
drwxr-sr-x. 2 root OPS 6 Jul  2 14:37 /home/dir2		# 属组OPS,SGID

测试：
[root@tianyun ~]# touch /home/dir2/file2
[root@tianyun ~]# ls -l /home/dir2
-rw-r--r--. 1 root OPS 0 Jul  2 14:41 file2				# 新文件的属组继承目录的属组
```

## 三、Sticky Bit (粘滞位)

### 1. 基本概念
- **作用**：设置在目录上，只有文件所有者、目录所有者或root用户才能删除/重命名其中的文件
- **表示方法**：在其他用户执行权限位上显示为 `t`（如 `drwxrwxrwt`）
- **数值表示**：1

### 2. 典型应用
- `/tmp /var/tmp` 目录：所有用户都可以创建文件，但只能删除自己的文件
- 共享可写目录：防止用户删除他人的文件

### 3. 没有Sticky Bit

```bash
[root@tianyun ~]# mkdir /home/dir100
[root@tianyun ~]# chmod 777 /home/dir100

测试：alice /home/dir100下创建文件，测试jack能否删除
[alice@tianyun ~]$ cd /home/dir100
[alice@tianyun dir100]$ touch alice.txt

[jack@tianyun ~]$ cd /home/dir100
[jack@tianyun dir100]$ ls -l
-rw-rw-r--. 1 alice alice 0 Jul  2 14:50 alice.txt
[jack@tianyun dir100]$ rm -rf alice.txt 

结果：其他用户都能删除!!!
```

### 4. 设置Sticky Bit

```bash
[root@tianyun ~]# mkdir /home/dir200
[root@tianyun ~]# chmod 777 /home/dir200
[root@tianyun ~]# chmod o+t /home/dir200
[root@tianyun ~]# ls -ld /home/dir200
drwxrwxrwt. 2 root root 6 Jul  2 14:46 /home/dir200

测试：alice /home/dir200下创建文件，测试jack能否删除
[alice@tianyun ~]$ cd /home/dir200
[alice@tianyun dir200]$ touch alice.txt

[jack@tianyun ~]$ cd /home/dir200
[jack@tianyun dir200]$ ls -l
-rw-rw-r--. 1 alice alice 0 Jul  2 14:54 alice.txt
[jack@tianyun dir200]$ rm -rf alice.txt 
rm: cannot remove ‘alice.txt’: OPSeration not permitted

结果：只有文件的所有者才能删除
```

## 四、三种特殊权限对比

| 权限类型   | 符号表示        | 数字值 | 作用位置 | 主要功能                           |
| ---------- | --------------- | ------ | -------- | ---------------------------------- |
| SUID       | s (所有者x位)   | 4      | 文件     | 以文件所有者身份执行（通常为root） |
| SGID       | s (所属组x位)   | 2      | 目录     | 目录: 继承目录属组                 |
| Sticky Bit | t (其他用户x位) | 1      | 目录     | 仅所有者可删除文件                 |

![](/documents/img/ops/linux/basic/tsqx/01.png)
![](/documents/img/ops/linux/basic/tsqx/02.png)
![](/documents/img/ops/linux/basic/tsqx/03.png)
![](/documents/img/ops/linux/basic/tsqx/04.png)
![](/documents/img/ops/linux/basic/tsqx/05.png)
![](/documents/img/ops/linux/basic/tsqx/06.png)
![](/documents/img/ops/linux/basic/tsqx/07.png)
![](/documents/img/ops/linux/basic/tsqx/08.png)
![](/documents/img/ops/linux/basic/tsqx/09.png)
![](/documents/img/ops/linux/basic/tsqx/10.png)