# Linux文件权限管理

:tada: 2025-11-12 :tada:

```bash
[root@yangge ~]# ls -l file1.txt 
-rwxr-xr-- 1 root DEV  4096  Sep  9 19:29 file1.txt
```

### 一、核心概念

#### 1. 用户和用户组
*   **用户 (User)**：系统资源的直接使用者。每个文件都有一个所有者，称为 **属主 (Owner)**。
*   **用户组 (Group)**：用户的集合。每个文件都属于一个特定的组，称为 **属组 (Group)**。组用于简化对多个用户的权限分配。
*   **其他人 (Others)**：不属于文件属主，也不在文件属组中的任何其他用户。

![](/documents/img/ops/linux/basic/file_manage/39.png)

#### 2. 权限类型 
权限作用于三类实体：**属主 (u)**、**属组 (g)**、**其他人 (o)**

| 权限符号   | 数字表示 | 对文件的含义               | 对目录的含义                      |
| :--------- | :------- | :------------------------- | :-------------------------------- |
| `r` (读)   | 4        | 可读取文件内容             | 可列出目录中的内容 (如 `ls` 命令) |
| `w` (写)   | 2        | 可修改文件内容             | 可在目录中创建、删除、重命名文件  |
| `x` (执行) | 1        | 可执行该文件（程序或脚本） | 可进入该目录 (如 `cd` 命令)       |

#### 3. 权限表示法
*   **字符表示法**：`rwxr-xr--`
    *   前三位 `rwx`：属主权限
    *   中三位 `r-x`：属组权限
    *   后三位 `r--`：其他人权限
    *   `-` 表示没有对应权限。
*   **数字（八进制）表示法**：`754`
    *   将每组 `rwx` 看成二进制（有权限为1，无则为0），再转换为十进制。
    *   `rwx` = `111` = 7
    *   `r-x` = `101` = 5
    *   `r--` = `100` = 4
    *   因此 `rwxr-xr--` = `754`

---

### 二、基本命令详解

#### 1. `chown`- 修改文件属主和属组
* **命令**：`chown` (change owner)

  ```bash
  [root@tianyun ~]# touch file1.txt
  [root@tianyun ~]# mkdir dir1
  [root@tianyun ~]# touch dir1/file{1..10}
  
  [root@yangge ~]# chown yangge file1.txt 				# 仅修改属主为 yangge
  [root@yangge ~]# chown :DEV file1.txt 					# 仅修改属组为 DEV
  [root@yangge ~]# chown zhuzhuxia:IT file1.txt		 	# 同时修改属主为 zhuzhuxia，属组为 IT
  [root@yangge ~]# chown -R alice:QA dir1					# 递归修改 dir1 目录下所有内容的属主和属组
  ```

![](/documents/img/ops/linux/basic/file_manage/40.png)
![](/documents/img/ops/linux/basic/file_manage/41.png)
![](/documents/img/ops/linux/basic/file_manage/42.png)
![](/documents/img/ops/linux/basic/file_manage/43.png)

#### 2. `chgrp`-  修改文件属组

- **命令**：`chgrp` (Change Group)

  ```bash
  [root@yangge ~]# chgrp IT file1.txt 					# 仅修改属组为 DEV
  ```

#### 3. `chmod` - 修改文件权限
**A. 字符模式**

* **操作对象**：`u`(属主), `g`(属组), `o`(其他人), `a`(所有人)

* **操作符**：`+`(添加), `-`(移除), `=`(精确设置)

* **权限**：`r`, `w`, `x`

  ```bash
  [root@yangge ~]# chmod u+x file1.txt 					# 给属主添加执行权限
  [root@yangge ~]# chmod g-w file1.txt 					# 从属组移除写权限
  [root@yangge ~]# chmod o=r file1.txt 					# 为其他人设置权限为只读
  [root@yangge ~]# chmod a=rwx file1.txt 					# 为所有人设置权限为读、写、执行
  [root@yangge ~]# chmod ug=rw,o=r file1.txt				# 为属主属组设置权限读写，其他人读
  ```

**B. 数字模式**

* 直接使用三位八进制数字设置权限

* `rwx`：421

  ```bash
  [root@yangge ~]# chmod 755 file1.txt 					# u=rwx (7), g=rx (5), o=rx (5)
  [root@yangge ~]# chmod 644 file1.txt 					# u=rw- (6), g=r-- (4), o=r-- (4)
  [root@yangge ~]# chmod 770 file1.txt 					# u=rwx (7), g=rwx (7), o=--- (0)
  [root@yangge ~]# chmod 600 file1.txt 					# u=rw- (6), g=--- (0), o=--- (0)
  ```

---

![](/documents/img/ops/linux/basic/file_manage/44.png)
![](/documents/img/ops/linux/basic/file_manage/45.png)
![](/documents/img/ops/linux/basic/file_manage/46.png)
![](/documents/img/ops/linux/basic/file_manage/47.png)
![](/documents/img/ops/linux/basic/file_manage/48.png)
![](/documents/img/ops/linux/basic/file_manage/49.png)

### 三、案例实战

**前提准备：创建用户和组**
在进行以下实战前，请先确保用户和组已创建并分配好。

```bash
# 创建用户组
groupadd DEV
groupadd QA
groupadd OPS
groupadd IT

# 创建用户并设置主要组，同时添加到附加组
useradd -G DEV,OPS yangge 									# 附加组OPS
useradd -G OPS tianyun       								# 附加组OPS
useradd -G QA alice          								# 附加组QA
useradd -G IT zhuzhuxia      								# 附加组IT

# 为用户设置密码
echo "123" | passwd --stdin yangge
echo "123" | passwd --stdin tianyun
echo "123" | passwd --stdin alice
echo "123" | passwd --stdin zhuzhuxia
```

---

#### 实战案例 1：项目目录权限设置

**需求**：创建项目目录 `/opt/projet`

*   **属主**：`yangge` (所有者)
*   **属组**：`DEV` (开发部)
*   **权限**：`DEV` 组成员可读、写、执行；其他人没有权限

**步骤**：
1.  **创建目录并修改属主属组**
    ```bash
    mkdir -p /opt/project
    chown yangge:DEV /opt/project
    ```
    
2.  **设置基础权限**：给 `DEV` 组完整权限，并禁止其他人访问。
    
    ```bash
    chmod 770 /opt/project 						# u=rwx (7), g=rwx (7), o=--- (0)
    ```
    
4.  **验证权限**
    ```bash
    ls -ld /opt/project
    
    - `DEV` 组成员可以自由创建、删除文件
    - `其他用户` 无法访问
    ```

---

#### 实战案例 2：敏感配置文件保护

**需求**：系统配置文件 `/etc/test.cfg` 包含密码信息。

*   **属主**：`root`
*   **属组**：`IT`
*   **权限**：只有 `root` 可以**读写**；`IT` 组成员只能**读取**；其他任何人**不能访问**。

**步骤**：
1.  **修改属主和属组**
    ```bash
    chown root:IT /etc/test.cfg
    ```
2.  **修改权限**
    *   **分析**：
        *   属主 `root` 需要 `rw-` (6)：读、写。
        *   属组 `IT` 需要 `r--` (4)：只读。
        *   其他人需要 `---` (0)：无权限。
    *   **设置 (数字方式)**：
    ```bash
    sudo chmod 640 /etc/test.cfg
    # u=rw- (6), g=r-- (4), o=--- (0)
    ```
    *   **字符方式实现**：
    ```bash
    sudo chmod u=rw,g=r,o= /etc/test.cfg
    ```

---

