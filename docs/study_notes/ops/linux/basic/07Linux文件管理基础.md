# Linux 文件管理基础

:tada: 2025-11-11 :tada:

### 图片预览 

![](/documents/img/ops/linux/basic/file_manage/01.png)
![](/documents/img/ops/linux/basic/file_manage/02.png)
![](/documents/img/ops/linux/basic/file_manage/03.png)
![](/documents/img/ops/linux/basic/file_manage/04.png)
![](/documents/img/ops/linux/basic/file_manage/05.png)
![](/documents/img/ops/linux/basic/file_manage/06.png)
![](/documents/img/ops/linux/basic/file_manage/07.png)
![](/documents/img/ops/linux/basic/file_manage/08.png)
![](/documents/img/ops/linux/basic/file_manage/09.png)
![](/documents/img/ops/linux/basic/file_manage/10.png)
![](/documents/img/ops/linux/basic/file_manage/11.png)
![](/documents/img/ops/linux/basic/file_manage/12.png)
![](/documents/img/ops/linux/basic/file_manage/13.png)
![](/documents/img/ops/linux/basic/file_manage/14.png)
![](/documents/img/ops/linux/basic/file_manage/15.png)
![](/documents/img/ops/linux/basic/file_manage/16.png)
![](/documents/img/ops/linux/basic/file_manage/17.png)
![](/documents/img/ops/linux/basic/file_manage/18.png)
![](/documents/img/ops/linux/basic/file_manage/22.png)
![](/documents/img/ops/linux/basic/file_manage/19.png)
![](/documents/img/ops/linux/basic/file_manage/20.png)
![](/documents/img/ops/linux/basic/file_manage/21.png)
![](/documents/img/ops/linux/basic/file_manage/23.png)
![](/documents/img/ops/linux/basic/file_manage/24.png)
![](/documents/img/ops/linux/basic/file_manage/25.png)
![](/documents/img/ops/linux/basic/file_manage/26.png)
![](/documents/img/ops/linux/basic/file_manage/27.png)
![](/documents/img/ops/linux/basic/file_manage/28.png)
![](/documents/img/ops/linux/basic/file_manage/29.png)
![](/documents/img/ops/linux/basic/file_manage/30.png)
![](/documents/img/ops/linux/basic/file_manage/31.png)
![](/documents/img/ops/linux/basic/file_manage/32.png)
![](/documents/img/ops/linux/basic/file_manage/33.png)
![](/documents/img/ops/linux/basic/file_manage/34.png)
![](/documents/img/ops/linux/basic/file_manage/35.png)
![](/documents/img/ops/linux/basic/file_manage/36.png)
![](/documents/img/ops/linux/basic/file_manage/37.png)
![](/documents/img/ops/linux/basic/file_manage/38.png)


*   **当前工作目录**：当前在文件系统中所处的位置。
*     路径：
    *   **绝对路径**：从根目录 `/` 开始的完整路径，如 `/etc/passwd`  `/home/dir1/passwd`
    *   **相对路径**：相对于当前工作目录的路径，如 `./yangge.txt` (当前目录) 或 `../home/alice` (上级目录)

![](/documents/img/ops/linux/basic/file_manage/FSH.png)


**一级目录介绍**

- `sbin`: 超级管理员（root）的程序目录

- `bin`：其他用户的程序目录
- `home`：普通用户的家目录
- `root`：超级管理员（root）家目录

- `var`：所有应用和程序的服务日志都存在里面，它的空间可能最大
- `tmp`：临时文件存放的目录，可以设置定期清理

### 一、 导航与查看

#### 1. `pwd` - 打印当前工作目录
**功能**：显示当前所在的目录的绝对路径。
**案例**：

```bash
[root@tianyun ~]# pwd
/root
```

#### 2. `ls` - 列出目录内容
**功能**：列出指定目录下的文件和子目录。
**常用选项**：

*   `-l`：以长格式（详细信息）列出。
*   `-a`：显示所有文件，包括隐藏文件（以 `.` 开头的文件）。
*   `-h`：与 `-l` 一起使用，以人类可读的格式（如 K, M, G）显示文件大小。
*   `-t`：按修改时间排序，最新的在前。-r 排序
*   `-S`：按文件大小排序，最大的在前。-r 排序
*   `-d`：查看目录本身的信息

**案例**：

```bash
# 列出当前目录内容（包括隐藏文件）
[root@tianyun ~]# ls -a
.              .bash_logout   .cache      .lesshst    .msmtprc  .pki              .tcshrc
..             .bash_profile  .cshrc      .mailrc     .muttrc   .pydistutils.cfg  .viminfo
.bash_history  .bashrc        .msmtp.log  .pip        .ssh

# 以详细信息列出当前目录所有内容（包括隐藏文件）
[root@tianyun ~]# ls -al
dr-xr-x---.  6 root root  4096 Sep  5 17:21 .
dr-xr-xr-x. 19 root root  4096 Aug  8 14:47 ..
-rw-------   1 root root 22119 Sep  5 16:19 .bash_history
-rw-r--r--.  1 root root    18 Dec 29  2013 .bash_logout
-rw-r--r--.  1 root root   176 Dec 29  2013 .bash_profile
-rw-r--r--.  1 root root   176 Dec 29  2013 .bashrc
drwx------   3 root root  4096 Jun 28  2024 .cache
...

# 以详细信息且易读的方式列出 /var/log 目录的内容
[root@tianyun ~]# ls -lh /var/log
total 3.0M
drwxr-xr-x. 2 root   root            4.0K Jun 28  2024 anaconda
drwx------. 2 root   root            4.0K Aug 27 08:18 audit
-rw-r--r--  1 root   root             108 Aug 17 09:59 backup_script.log
-rw-------  1 root   root               0 Aug 12 03:37 boot.log
-rw-------  1 root   root             30K Aug  9 03:25 boot.log-20250809
-rw-------  1 root   root             26K Aug 12 03:37 boot.log-20250812
-rw-----
--  1 root   utmp             384 Sep  5 16:59 btmp
-rw-------  1 root   utmp             384 Sep  5 15:59 btmp-20250905
drwxr-xr-x. 2 chrony chrony          4.0K Aug  8  2019 chrony
-rw-r--r--  1 root   root               0 Jun 28  2024 cloudinit-deploy.log
...

# 以详细的方式查看文件 /etc/passwd
[yangge@tianyun ~]$ ls -l /etc/passwd
-rw-r--r--. 1 root root 2310 Sep  9 10:29 /etc/passwd

# 以详细的方式查看目录下的文件 /var
[yangge@tianyun ~]$ ls -l /var/
drwxr-xr-x.  2 root root   19 Sep  9 10:26 account
drwxr-xr-x.  2 root root    6 Apr 11  2018 adm
drwxr-xr-x. 13 root root  159 Sep  9 10:31 cache
drwxr-xr-x.  2 root root    6 Oct  2  2020 crash

# 以详细的方式查看目录本身
[yangge@tianyun ~]$ ls -ld /var/
drwxr-xr-x. 21 root root 4096 Sep  9 10:30 /var/
```

#### 3. `cd` - 切换目录
**功能**：改变当前工作目录。
**特殊符号**：

*   `~` 代表用户的家目录（如 `/root` ` /home/yangge`）
*   `..` 代表上级目录
*   `.` 代表当前目录
*   `-` 切换到上一个工作目录（类似于 "返回" ）

**案例**：

```bash
# 切换到绝对路径 /etc/sysconfig/network-scripts/ 目录
[root@tianyun ~]# cd /etc/sysconfig/network-scripts/
[root@tianyun network-scripts]# pwd
/etc/sysconfig/network-scripts

# 切换到用户家目录 cd ~ 或 直接cd
[root@tianyun network-scripts]# cd ~
[root@tianyun ~]# pwd
/root

# 切换到根目录
[root@tianyun ~]# cd /
[root@tianyun /]# 

# 相对路径切换到 etc目录（当前在/目录）
[root@tianyun /]# cd etc/
[root@tianyun etc]# 

# 切换到上级目录
[root@tianyun etc]# cd ..
[root@tianyun /]# 

# 切换到上一个所在的目录
[root@tianyun ~]# cd /etc/sysconfig/network-scripts/
[root@tianyun network-scripts]# cd
[root@tianyun ~]# cd -
/etc/sysconfig/network-scripts
```

---

### 二、 文件与目录操作

#### 4. `mkdir` - 创建目录
**功能**：创建新的目录
**常用选项**：

*   `-p`：递归创建所有不存在的父目录

**案例**：

```bash
# 在当前目录下创建一个名为 dir1 的目录
$ mkdir dir1

# 在当前目录下创建三个目录 dir2 dir3 backup
$ mkdir dir2 dir3 backup

# 建立目录 /tmp/dir4
$ mkdir /tmp/dir4

# 递归创建目录结构 dir1/docs/images
$ mkdir -p dir1/docs/images
```

#### 5. `touch` - 创建空文件或更新时间戳
**功能**：1. 如果文件不存在，则创建一个新的空文件。2. 如果文件存在，则更新其访问和修改时间戳
**案例**：

```bash
# 创建两个空文件 file1.txt 和 file2.txt
$ touch file1.txt file2.txt

# 更新 file1.txt 的时间戳为当前时间
$ touch file1.txt

# {}的用法，在dir3目录下创建10个文件
$ touch dir3/file{1..10}

# {}的用法，在dir3目录下创建2个文件
$ touch dir3/yangge{1,10}
```

#### 6. `cp` - 复制文件或目录
**功能**：复制文件或目录。
**常用选项**：
*   `-r` 或 `-R`：递归复制目录及其所有内容
*   `-i`：覆盖前提示确认（交互模式）
*   `-v`：显示复制过程的详细信息（冗长模式）
*   `-f`：强制force，不会提示

**案例**：

```bash
# 将 file1.txt 复制到当前目录，并命名为 file1_backup.txt
$ cp file1.txt file1_backup.txt

# 将 file1.txt 复制到 /tmp 目录
$ cp file1.txt /tmp/
$ cp file1.txt /tmp/file1_new.txt

# 递归复制整个 dir1 目录到 /tmp 目录
$ cp -r dir1 /tmp/

- 扩展：
# 将 /etc/passwd 复制到 /tmp
[yangge@tianyun ~]$ cp /etc/passwd /tmp/

# 将 /etc/passwd 复制到 当前目录（.）
[yangge@tianyun ~]$ cp /etc/passwd .

# 将 /etc/hosts /etc/fstab 复制到 当前目录（.）
[yangge@tianyun ~]$ cp /etc/hosts /etc/fstab ./
```

#### 7. `mv` - 移动或重命名文件/目录
**功能**：1. 移动文件或目录。2. 重命名文件或目录。（在 Linux 中，重命名被视为移动）
**常用选项**：

*   `-i`：覆盖前提示确认

**案例**：

```bash
# 将 file1.txt 重命名为 data.txt (在同一目录下移动即为重命名)
$ mv file1.txt data.txt

# 将 data.txt 文件移动到 dir1/docs/ 目录下
$ mv data.txt dir1/docs/

# 将 dir1 目录移动到 /var/tmp/ 目录下
$ mv dir1 /var/tmp/

# 将所有 .txt 文件移动到 /var/tmp/ 目录
$ mv *.txt /var/tmp/
```

#### 8. `rm` - 删除文件或目录
**功能**：删除文件或目录。**⚠️警告：此命令删除的文件通常无法恢复！**
**常用选项**：

*   `-r` 或 `-R`：递归删除目录及其所有内容。
*   `-f`：强制删除，忽略不存在的文件，不提示确认。（**极其危险！**）
*   `-i`：交互模式，删除前逐一确认。

**案例**：
```bash
# 列出 /var/tmp 的文件
$ ls /var/tmp/
dir1
file1_backup.txt
file2.txt

# 列出当前目录下所有文件
$ ls
backup   
dir2
dir3

# 删除 /var/tmp/file2.txt 文件
$ rm /var/tmp/file2.txt

# 交互式地删除 /tmp/ 下所有 .txt 文件
$ rm -i /tmp/*.txt

# 递归删除 /var/tmp/dir1/ 目录及其下的所有内容
$ rm -r /var/tmp/dir1/

# 删除当前目录下 backup dir2 dir3
$ rm -r dir* backup

# 危险命令！强制递归删除所有内容，无提示（如果是root用户）
$ rm -rf /
```

#### 9. `rmdir` - 删除空目录
**功能**：删除空的目录。相比 `rm -r` 更安全，因为它只删除空目录。
**案例**：
```bash
$ mkdir /tmp/dir4

$ ls /tmp/
dir1
dir4
...

# 删除空目录 /tmp/dir4
$ rmdir /tmp/dir4

# 如果目录非空，命令会报错
$ rmdir /tmp/dir1
rmdir: failed to remove ‘/tmp/dir1’: Directory not empty

$ rm -r /tmp/dir1/
```

---

### 三、 查看文件内容

#### 10. `cat` - 查看文件内容
**功能**：一次性显示整个文件内容到终端。适合查看**小文件**。
**案例**：

```bash
# 查看 /etc/hosts 文件的内容
$ cat /etc/hosts

# 查看 /etc/redhat-release 文件的内容  查看系统版本
$ cat /etc/redhat-release 

# 查看 /etc/sysconfig/network-scripts/ifcfg-ens33 文件的内容
$ cat /etc/sysconfig/network-scripts/ifcfg-ens33 

# 将 /etc/hosts 和 /etc/redhat-release 的内容合并后输出
$ cat /etc/hosts /etc/redhat-release
$ cat /etc/hosts /etc/redhat-release > newfile 【借用】

# 查看 /etc/sysconfig/network-scripts/ifcfg-ens33 文件的内容，并显示行号
$ cat -n /etc/sysconfig/network-scripts/ifcfg-ens33 

# 查看 /etc/passwd 文件的内容【由于内容太长，不适合使用cat查看文件内容】
$ cat /etc/passwd 

# 查看 /var/log/messages 文件的内容【由于内容太长，不适合使用cat查看文件内容】
$ cat /var/log/messages
$ su - root
$ cat /var/log/messages
```

#### 11. `less` / `more` - 分页查看文件内容
**功能**：一页一页地查看文件内容，适合查看**大文件**。`less` 比 `more` 功能更强大（支持上下滚动、搜索等），是首选。
**案例**：

```bash
- 使用 less 查看大型日志文件
$ su - root
# less /var/log/messages
```
在 `less` 视图中：
*   按 `空格键` 向下翻一页。
*   按 `b` 向上翻一页。
*   按 `上下箭头` 逐行移动。
*   按 `/` 后输入关键词进行搜索（按 `n` 查找下一个，`N` 查找上一个）。
*   按 `q` 退出。

#### 12. `head` - 显示文件开头部分
**功能**：默认显示文件的前 10 行。
**常用选项**：
*   `-n <行数>`：指定显示的行数。

**案例**：
```bash
- 显示 messages 文件的前 10 行
# head /var/log/messages

- 显示 messages 文件的前 5 行
# head -n 5 /var/log/messages

- 显示 passwd 文件的前 10 行
# head /etc/passwd
```

#### 13. `tail` - 显示文件末尾部分
**功能**：默认显示文件的最后 10 行。常用于**实时查看日志**。
**常用选项**：

*   `-n <行数>`：指定显示的行数。
*   `-f`：实时追踪文件末尾的新内容（**监控日志的神器**）。按 `Ctrl+C` 退出。

**案例**：

```bash
- 显示 passwd 文件的后 10 行
# tail /etc/passwd

- 显示 messages 文件的最后 20 行
# tail -n 20 /var/log/messages

- 实时监控 secure 日志文件的更新
$ tail -f /var/log/secure
```

---

### 四、编辑文件内容

#### 14. `vi` - 强大的文本编辑工具

Vim（**Vi IMproved**）是 Unix 系统上经典编辑器 `vi` 的增强版。

1. **无处不在**：预装在几乎所有的 Linux 和 macOS 系统上，是系统管理和故障排查的终极利器。
2. **高效强大**：完全基于键盘操作，手不用离开 **主键区**，编辑效率极高。
3. **高度可定制**：通过 `.vimrc` 配置文件和各种插件，可以打造专属的 IDE。
4. **模态编辑**：这是 Vim 的核心特色，也是初学者最大的障碍。

![](/documents/img/ops/linux/basic/file_manage/vim4model.png)

```bash
# 准备练习文件
$ ls -al > /tmp/yangge.txt
$ cat /tmp/yangge.txt 
dr-xr-x---.  6 root root  4096 Sep  6 20:48 .
dr-xr-xr-x. 19 root root  4096 Sep  5 18:03 ..
-rw-------   1 root root 26258 Sep  5 20:42 .bash_history
-rw-r--r--.  1 root root    18 Dec 29  2013 .bash_logout
-rw-r--r--.  1 root root   176 Dec 29  2013 .bash_profile
-rw-r--r--.  1 root root   176 Dec 29  2013 .bashrc
drwx------   3 root root  4096 Jun 28  2024 .cache
-rw-r--r--.  1 root root   100 Dec 29  2013 .cshrc
-rw-------   1 root root    43 Aug 19 16:21 .lesshst
-rw-r--r--   1 root root   170 Aug 16 19:49 .mailrc
-rw-r--r--   1 root root  4494 Mar 17  1982 .msmtp.log
-rw-------   1 root root   183 Aug 19 17:20 .msmtprc
-rw-r--r--   1 root root   133 Aug 19 17:28 .muttrc
drwxr-xr-x   2 root root  4096 Jun 28  2024 .pip
drwxr-----   3 root root  4096 Aug  8 14:23 .pki
-rw-r--r--   1 root root   206 Aug  8 11:03 .pydistutils.cfg
drwx------   2 root root  4096 Jun 28  2024 .ssh
-rw-r--r--.  1 root root   129 Dec 29  2013 .tcshrc
-rw-------   1 root root  6068 Sep  6 20:34 .viminfo
```

##### 模式一：命令模式 - **指挥中心**

Vim 的**默认模式**和核心。所有其他操作都从这里开始，并最终回到这里。在这个模式下，键盘不是用来打字的，而是向编辑器**发号施令**。

**核心功能**：移动光标、复制、粘贴、删除、撤销、查找等。

**1. 光标移动 (Navigation):**

*   **基础移动**：`h` (左), `j` (下), `k` (上), `l` (右)
*   **行移动**：`0` (行首), `$` (行尾)
*   **屏幕移动**：`gg` (文件头), `G` (文件尾), `:n` 或 `nG` (跳至第n行)

**2. 删除 (Delete - `d`):**

*   `x` - 删除当前字符
*   `dw` - 删除一个单词
*   `dd` - **删除整行** (最常用)
*   `3dd` - 删除3行 (数字+命令，表示重复执行)
*   `D` - 删除至行尾
*   `dgg` - 删除至文件头
*   `dG` - 删除至文件末尾

**3. 复制 (Yank - `y`) & 粘贴 (Paste - `p`):**

*   `yy` - **复制整行** (最常用)
*   `3yy` - 复制3行 (数字+命令，表示重复执行)
*   `yw` - 复制一个单词
*   `p` - 粘贴到光标所在行**后**
*   `P` - 粘贴到光标所在行**前**

**4. 撤销与重做 (Undo/Redo):**

*   `u` - **撤销**上一次操作
*   `Ctrl + r` - **重做**，即撤销掉刚才的撤销

**5. 查找内容**

*   **正向查找： `/` (斜杠)**：从光标位置开始**向文件末尾**搜索
                定位：按n下一个，按N上一个
*   **反向查找： `?` (问号)**：从光标位置开始**向文件开头**搜索

**6. 进入其他模式:**

*   `i, a, o, s, I, A, O, S` -> **编辑模式**
*   `v, V, Ctrl+v` -> **可视模式**
*   `:` -> **扩展命令模式**

---

##### 模式二：编辑模式 - **写作台**

这是最容易被理解的模式，类似于普通文本编辑器，在这个模式下输入文本。

**进入方式 (从命令模式):**
*   `i` - **i**nsert，在光标前插入【推荐】
*   `a` - **a**ppend，在光标后插入
*   `o` - 在当前行的**下方**插入新行【推荐】
*   `O` - 在当前行的**上方**插入新行
*   `I` - 在行首插入
*   `A` - 在行尾插入

**退出方式：**
*   `Esc`  -> 退回**命令模式**

**技巧**：在编辑模式下，可以使用 `Ctrl + n` / `Ctrl + p` 进行单词补全。

---

##### 模式三：扩展命令模式 - **控制台**

通过在命令模式下按 `:` 进入。光标会移动到窗口底部的命令行，用于执行复杂命令、文件操作、配置设置等。

**进入方式**：在命令模式下按 `:`

**常用命令：**

**1. 文件操作:**

*   `:w` - **w**rite，保存文件
*   `:q` - **q**uit，退出 (如果文件未修改)
*   `:wq` 或 `:x` - 保存并退出
*   `:q!` - 强制退出，**不保存修改！**
*   `:w <path>` - 另存为，例如 `:w /var/tmp/file1.txt`

**2. 搜索与替换:**

*   `:% s/old/new/g` - **全局替换**。将文件中所有的 `old` 替换为 `new`
    *   `%` -  全文，查找范围为1,$
    *   `g` - global，一行内所有匹配项，如果不加`g` ，只替换该行中第一个
    *   `:10,20 s/old/new/g` - 只在第10到20行之间替换

**3. 配置vim工作环境（临时）及其它命令:**

*   `:set nu` - 显示行号 (**set number**)
*   `:set list` - 显示非常规字符，例如换行符$
*   `:set ic` - 搜索时忽略大小写 (**ignore case**)
*   `:set cul` - 高亮显示光标所在的行（**cursorline**）
*   `:set cuc` - 高亮显示光标所在的列（**cursorcolumn**）
*   `:set ai` - 自动缩进（**autoindent**）
*   `:!<command>` - 执行外部 shell 命令 (如 `:!ls`)

**退出方式**：命令执行后自动退回命令模式，或按 `Esc` 取消输入的命令。

---

##### 模式四：可视模式  - **选择工具**

类似于用鼠标选择文本，但更精确、更强大。先选择高亮区域，再对选区执行命令。

**进入方式 (从命令模式):**
*   `v` - **字符可视模式**。以字符为单位选择。
*   `V` - **行可视模式**。以行为单位选择。
*   `Ctrl + v` - **块可视模式** (列模式)。可以选择一个矩形文本块，极其强大。

**操作方式**：进入可视模式后，用移动命令（`h,j,k,l` 等）来扩大或缩小选择范围。

**对选区执行命令 (与命令模式命令通用):**
*   `d` - 删除选区
*   `y` - 复制选区
*   `:` - 对选区**行**执行扩展命令 (如 `:s/old/new/` 只替换选区内内容)
*   `u` - 将选区字母转为小写
*   `U` - 将选区字母转为大写

**退出方式**：按 `Esc` 退回命令模式，或直接执行命令（如按 `d` 删除后）自动退回。

------

##### vi 永久环境定制

**创建 `~/.vimrc` 文件**，这是 Vim 的用户配置文件，可以极大提升使用体验。

```bash
$ vim ~/.vimrc
" 显示行号
set number

" 忽略大小写
set ignorecase

" 高亮光标所在行
set cursorline

" 主亮光标所在列
" set cursorcolumn

" 启用语法和文件类型检测
filetype on

" 启用基于文件类型的缩进规则
filetype indent on

" 启用基础自动缩进（保底方案）
set autoindent
```

```bash
filetype indent on (非常重要)
当前 Vim 缩进的黄金标准。它会根据正在编辑的文件类型（如 python, java, html）自动加载对应的、高度优化的缩进规则。这些规则远比 smartindent 智能。
```

##### vi 学习秘籍心法

1.  **命令模式是家**：无论你在做什么，`Esc` 键都能让你安全回家。任何不确定的时候，狂按 `Esc`。
2.  **模式切换是灵魂**：高效的 Vim 使用就是在这四个模式间流畅地切换：`命令模式 -> (编辑/可视/扩展模式) -> 命令模式`。
3.  **组合威力**：Vim 的命令可以组合，如 `d`(删除) + `w`(单词) = `dw`(删除一个单词)。`数字 + 命令` 表示重复，如 `3dd` 删除3行。
4.  **一个一个学**：不要试图一次性记住所有命令。先掌握生存技能（`i`, `dd`, `yy`, `p`, `u`, `:wq`），再逐步扩展。
5.  **不要灰心**：一开始会觉得别扭，这是正常的。一旦肌肉记忆形成，你的编辑速度将远超鼠标操作。

### 五、文件打包及压缩

**Linux打包压缩工具概览**

| 工具  | 文件扩展名 | 特点                   |
| ----- | ---------- | ---------------------- |
| tar   | .tar       | 仅打包不压缩           |
| gzip  | .gz        | 压缩速度快，压缩率一般 |
| bzip2 | .bz2       | 压缩率高，速度较慢     |
| xz    | .xz        | 高压缩率，速度慢       |
| zip   | .zip       | 跨平台兼容性好         |

Linux中打包和压缩不是一回事，打包是把多个文件打包成一个文件但是不压缩，打包不会改变文件总大小（不减少数据体积），而压缩是是通过算法减小文件体积

#### 15. `tar` - 王者级打包压缩

##### — 打包压缩

```bash
- 仅打包不压缩
[root@tianyun ~]# tar -cvf etc.tar /etc
```

- `-c`：创建归档
- `-v`：显示详细过程
- `-f`：指定归档文件名

```bash
- 打包并使用 gzip 压缩
[root@tianyun ~]# time tar -czf etc.tar.gz /etc
```

- `-z`：使用 gzip 压缩



```bash
打包并使用 bzip2 压缩
[root@tianyun ~]# yum -y install bzip2
[root@tianyun ~]# time tar -cjf etc.tar.bz2 /etc
```

- `-j`：使用 bzip2 压缩



```bash
打包并使用 xz 压缩
[root@tianyun ~]# time tar -cJf etc.tar.xz /etc
```

- `-J`：使用 xz 压缩



```shell
比较：
[root@tianyun ~]# ls -lh etc*
-rw-r--r--. 1 root root  11M Jun 24 11:09 etc.tar.bz2
-rw-r--r--. 1 root root  12M Jun 24 11:07 etc.tar.gz
-rw-r--r--. 1 root root 8.3M Jun 24 11:10 etc.tar.xz

-终级方案：自动压缩-a
[root@tianyun ~]# rm -rf etc*
[root@tianyun ~]# tar -caf etc.tar.bz2 /etc				# -a 根据文件的后缀自动匹配压缩
[root@tianyun ~]# tar -caf etc.tar.xz /etc
[root@tianyun ~]# tar -caf etc.tar.gz /etc
[root@tianyun ~]# file etc*
etc.tar.bz2: bzip2 compressed data, block size = 900k
etc.tar.gz:  gzip compressed data, from Unix, last modified: Tue Jun 24 11:20:37 2025
etc.tar.xz:  XZ compressed data

[root@tianyun ~]# tar --help |grep '\-a'
  -a, --auto-compress        use archive suffix to determine the compression    
  
Ubuntu安装bzip2:
yangge@yangge:~$ sudo apt install bzip2

CentOS安装bzip2:
[yangge@tianyun ~]$ sudo yum -y install bzip2
需要提前配置sudo功能
```

##### — 解包解压

```bash
[root@tianyun ~]# file etc*
etc.tar.bz2: bzip2 compressed data, block size = 900k
etc.tar.gz:  gzip compressed data, from Unix, last modified: Tue Jun 24 11:07:35 2025
etc.tar.xz:  XZ compressed data
```

```bash
[root@tianyun ~]# tar -xf etc.tar.gz
[root@tianyun ~]# tar -xf etc.tar.xz						# 解压到当前目录
[root@tianyun ~]# tar xf etc.tar.bz2 -C /var/tmp/			# 解压到指定目录

如果只是解包：
[root@tianyun ~]# tar -cf etc.tar /etc

- 终级统一方案：
[root@tianyun ~]# tar -xf etc.tar
```

------

### 六、文件查找与定位

#### 16. `find` - 在目录树中查找文件
**功能**：功能极其强大，可以根据名称、大小、修改时间、类型等条件进行搜索。
**基本语法**：`find <路径> <选项> <操作>`

**案例**：

```bash
# 在当前目录及其子目录下查找名为 file1.txt 的文件
sudo find . -name "file1.txt"

# 在/目录及其子目录下查找名为 passwd 的文件
sudo find / -name "passwd"

# 在/etc目录及其子目录下查找名为 passwd 的文件
sudo find /etc -name "passwd"

# 在 /var 目录下查找所有 .log 文件（不区分大小写）
sudo find /var -iname "*.log"

# 查找/etc目录下大于 10MB 的文件
sudo find /etc -size +10M

# 查找 /var/log 目录下 7 天内修改过的文件
sudo find /var/log -mtime -7

# 查找当前目录下的所有目录
sudo find . -type d

# 查找并删除当前目录下所有 etc* 文件（谨慎使用！）
sudo find . -name "etc*" -exec  rm -rf {}   \;
# rm -rf {} 中的 {} 指的是  etc* 文件
# 替换方案 ： 删除180天前的文件 为什么用这个替换，怕根据名称删除错了
find ./var/log -mtime +180 -exec rm -rf  {}   \;


-exec \;  固定的语法格式
{}		  前面找到的内容

待以下知识点学完后，再回来细看find:
1. 文件权限
2. 输入输出重定向
```

#### 17. `locate` - 在数据库中查找文件
**功能**：基于数据库（`updatedb`）快速查找文件，速度比 `find` 快很多，但无法查找新创建的文件（需要先更新数据库）。

`locate`把所有文件记录在一个数据库中，搜索时在数据库（表格）中搜索查询文件，所以块，`find`是一个一个的找

**案例**：

```bash
# 查找所有名为 passwd 的文件
$ locate passwd

# 查找所有名为 ifcfg-ens33 的文件
$ locate ifcfg-ens33

# 更新 locate 数据库（需要 root 权限）
$ sudo updatedb

Ubuntu:
$ locate passwd
Command 'locate' not found, but can be installed with:
sudo apt install plocate

$ sudo apt install plocat
$ sudo updatedb
```

---

### 七、查看命令和文件的类型

#### 18. `type` - 揭示命令的真实身份

`type` 命令的核心作用就是告诉我们，输入的命令**究竟属于以上哪一种类型**，并显示其具体定义或路径。

当在 Shell 中输入一个命令时，它可能是多种东西：
*   **一个外部可执行程序** (如 `/bin/ls`)
*   **一个 Shell 内置命令** (如 `cd`, `echo`)
*   **一个命令别名** (Alias，如 `ll` 通常是 `ls -l` 的别名)
*   **一个 Shell 函数** (Function)
*   **一个关键字** (Keyword，如 `if`, `for`)

```bash
[root@tianyun ~]# type cd
cd is a shell builtin
[root@tianyun ~]# type -a cd			# -a查看所有的cd命令
cd is a shell builtin					# shell内置命令
cd is /bin/cd							# 外部的可执行程序
cd is /usr/bin/cd

[root@tianyun ~]# type -a date
date is /bin/date						# 外部的可执行程序
date is /usr/bin/date

[root@tianyun ~]# type -a ll
ll is aliased to `ls -l --color=auto'	# alias别名命令

[root@tianyun ~]# type -a if
if is a shell keyword
[root@tianyun ~]# type -a for
for is a shell keyword


别名alias扩展：
- 查看当前已有的alias
[root@tianyun ~]# alias 
alias cp='cp -i'
alias egrep='egrep --color=auto'
alias fgrep='fgrep --color=auto'
alias grep='grep --color=auto'
alias l.='ls -d .* --color=auto'
alias ll='ls -l --color=auto'
alias ls='ls --color=auto'
alias mv='mv -i'
alias rm='rm -i'

- 创建新的别名alias【临时】
[root@tianyun ~]# alias yangge='ls /etc/sysconfig/network-scripts/'
```

#### 19. `file` - 揭示文件的真实类型

`file` 命令是 Linux 中用于**查看文件类型**的必备工具。它的核心作用是告诉你一个文件的**真实类型**，而不是依赖容易伪造的文件扩展名（如 `.txt`, `.exe`, `.jpg`）

```bash
[root@tianyun ~]# file /etc
/etc: `directory`													# 目录
[root@tianyun ~]# ls -ld /etc
drwxr-xr-x. 144 root root 8192 Sep 11 10:56 /etc					# 第一个字符 "d"

[root@tianyun ~]# file /etc/hosts
/etc/hosts: ASCII `text`											# 文本文件
[root@tianyun ~]# ls -l /etc/hosts				
-rw-r--r--. 1 root root 158 Jun  7  2013 /etc/hosts					# 第一个字符 "-"

[root@tianyun ~]# file /etc/sysconfig/selinux 
/etc/sysconfig/selinux: `symbolic link` to ../selinux/config'		# 链接文件
[root@tianyun ~]# ls -l /etc/sysconfig/selinux
lrwxrwxrwx. 1 root root 17 Sep  9 10:24 /etc/sysconfig/selinux -> ../selinux/config		# 第一个字符 "l"


[root@tianyun ~]# file /usr/bin/ls									# 可执行文件
/usr/bin/ls: ELF 64-bit LSB `executable`, x86-64, version 1 (SYSV), dynamically linked (uses shared libs), for GNU/Linux 2.6.32, BuildID[sha1]=c8ada1f7095f6b2bb7ddc848e088c2d615c3743e, stripped

[root@tianyun ~]# file /dev/sda
/dev/sda: `block special`											# 块设备文件

[root@tianyun ~]# file /dev/pts/1									# 字符设备文件
/dev/pts/1: `character special`

[root@tianyun ~]# file /usr/share/backgrounds/morning.jpg			
/usr/share/backgrounds/morning.jpg: `JPEG image data`, JFIF standard 1.01								
# 图像文件

[root@tianyun ~]# file /usr/lib/kbd/consolefonts/iso05.08.gz
/usr/lib/kbd/consolefonts/iso05.08.gz: `gzip compressed data`, from Unix, max compression				
# gzip压缩文件

[root@tianyun ~]# file /usr/share/doc/coreutils-8.22/ChangeLog.bz2
/usr/share/doc/coreutils-8.22/ChangeLog.bz2: `bzip2 compressed data`, block size = 900k		
# bzip2压缩文件

[root@tianyun ~]# file /usr/lib/modules/3.10.0-1160.el7.x86_64/kernel/net/sctp/sctp.ko.xz
/usr/lib/modules/3.10.0-1160.el7.x86_64/kernel/net/sctp/sctp.ko.xz: `XZ compressed data`
# XZ压缩文件
```
