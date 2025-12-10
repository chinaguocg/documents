## Shell 条件测试

Shell 条件测试用于根据不同的条件执行不同的代码块。常见的条件测试包括文件测试、字符串比较、数值比较和逻辑组合。

### 一、测试命令
在 Shell 中，条件测试可以通过以下两种方式实现：
#### 1、test 命令

```bash
test 条件表达式
```
#### 2、[ ] 或 [[ ]]

```bash
[ 条件表达式 ]       	# 传统 test 命令的简写（注意空格）
[[ 条件表达式 ]]     	# Bash 增强版（支持更多功能，如&&、||、正则匹配）
```
### 二、测试详解

#### 1、文件测试

检查文件或目录的状态：

| 测试条件          | 说明                                  |
| ----------------- | ------------------------------------- |
| `-e file`         | 文件/目录是否存在                     |
| `-f file`         | 是否是普通文件（非目录、设备等）      |
| `-d file`         | 是否是目录                            |
| `-s file`         | 文件是否非空（大小 > 0）              |
| `-r file`         | 当前用户是否有读权限                  |
| `-w file`         | 当前用户是否有写权限                  |
| `-x file`         | 当前用户是否有执行权限                |
| `-L file`         | 是否是符号链接                        |
| `file1 -nt file2` | `file1` 是否比 `file2` 新（修改时间） |
| `file1 -ot file2` | `file1` 是否比 `file2` 旧             |

**示例：**

```bash
[root@tianyun ~]# test -d /home
[root@tianyun ~]# echo $?
0
[root@tianyun ~]# test -d /home11111
[root@tianyun ~]# echo $?
1
[root@tianyun ~]# [ ! -d /ccc ] && mkdir /ccc			# 当前一个命令成功，后一个命令才执行
[root@tianyun ~]# [ -d /ccc ] || mkdir /ccc				# 当前一个命令失败，后一个命令才执行

[root@tianyun ~]# vim test02.sh 
if [[ -f "/etc/passwd" ]]; then
    echo "文件存在"
fi

[root@tianyun ~]# vim test03.sh 
if [ -d "/tmp" ]; then
    echo "/tmp 是目录"
fi
```

#### 2、字符串比较
| 测试条件             | 说明                          |
| -------------------- | ----------------------------- |
| `-z "$str"`          | 字符串是否为空（长度为 0）    |
| `-n "$str"`          | 字符串是否非空（长度 > 0）    |
| `"$str1" = "$str2"`  | 字符串是否相等（`==` 也可用） |
| `"$str1" != "$str2"` | 字符串是否不相等              |

**示例：**

```bash
[root@tianyun ~]# vim test03.sh 
read -p "Input username: " name
if [[ -z "$name" ]]; then
    echo "输入的名字为空"
else
	echo "你输入的名字为 $name"
fi

[root@tianyun ~]# vim /home/test04.sh 				# 找一个普通用户也能读取的位置
if [[ "$USER" == "root" ]]; then					# 字符串比较一定要使用双引号
    echo "你当前是root,有安装权限"
else
	echo "你当前不是root，没有安装权限"
fi
[root@tianyun ~]# /home/test04.sh 					# root用户执行
你当前是root,有安装权限
[tom@tianyun ~]$ /home/test04.sh 					# 普通用户执行
你当前不是root，没有安装权限

[root@tianyun ~]# vim /home/test05.sh 				# 找一个普通用户也能读取的位置
if [[ "$USER" != "root" ]]; then					# 字符串比较一定要使用双引号
    echo "当前不是root，没有安装权限，退出"	
    exit											# exit直接退出整个脚本
fi
echo "开始安装软件........."


再测试字符字符串空和非空
[root@tianyun ~]# var1=111							# var1定义，有值
[root@tianyun ~]# var2=								# var2定义，空值
[root@tianyun ~]# 									# var3未定义

[root@tianyun ~]# echo ${#var1}						# 获得变量值的长度
3
[root@tianyun ~]# echo ${#var2}
0
[root@tianyun ~]# echo ${#var3}
0

[root@tianyun ~]# [ -z "$var1" ];echo $?			# 是否为空
1
[root@tianyun ~]# [ -z "$var2" ];echo $?
0
[root@tianyun ~]# [ -z "$var3" ];echo $?
0
[root@tianyun ~]# [ -n "$var1" ];echo $?
0
[root@tianyun ~]# [ -n "$var2" ];echo $?
1
[root@tianyun ~]# [ -n "$var3" ];echo $?
1

错误的案例：var2变量未被定义
[root@tianyun ~]# [ -z $var2 ];echo $?
0
[root@tianyun ~]# [ -n $var2 ];echo $?
0

正确的案例：var2变量未被定义
[root@tianyun ~]# [ -n "$var2" ];echo $?
1
[root@tianyun ~]# [ -z "$var2" ];echo $?
0

[root@tianyun ~]# [[ -n $var2 ]];echo $?
1
[root@tianyun ~]# [[ -z $var2 ]];echo $?
0
```

- 字符串比较建议用 `[[ ]]`，避免 `[ ]` 中的变量未加引号导致的问题。
- `=` 和 `==` 在 `[[ ]]` 中作用相同，但在 `[ ]` 中 `==` 可能不兼容。

#### 3、数值比较
用于比较整数（不支持浮点数）

| 测试条件          | 说明                             |
| ----------------- | -------------------------------- |
| `$num1 -eq $num2` | 是否相等（equal）                |
| `$num1 -ne $num2` | 是否不相等（not equal）          |
| `$num1 -gt $num2` | 是否大于（greater than）         |
| `$num1 -ge $num2` | 是否大于等于（greater or equal） |
| `$num1 -lt $num2` | 是否小于（less than）            |
| `$num1 -le $num2` | 是否小于等于（less or equal）    |

#### --- 课堂案例

```bash
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

**C语言风格的数值比较**

```bash
[root@tianyun ~]# ((1<2));echo $?
0
[root@tianyun ~]# ((1==2));echo $?
1
[root@tianyun ~]# ((1>2));echo $?
1
[root@tianyun ~]# ((1>=2));echo $?
1
[root@tianyun ~]# ((1<=2));echo $?
0
[root@tianyun ~]# ((1!=2));echo $?
0

[root@tianyun ~]# ((`id -u`>0));echo $?
1
[root@tianyun ~]# (($UID==0));echo $?
0       
```

#### 4、逻辑组合

用于组合多个条件：

| 测试条件         | 说明                         |
| ---------------- | ---------------------------- |
| `! 条件`         | 逻辑非（条件取反）           |
| `条件1 && 条件2` | 逻辑与（条件1 **且** 条件2） |
| `条件1 || 条件2` | 逻辑或（条件1 **或** 条件2） |

**示例**：

```bash
# 使用 [[ ]]（推荐）
[root@tianyun ~]# vim test09.sh 
if [[ -f "/etc/passwd" && -r "/etc/passwd" ]]; then
    echo "文件存在且可读"
fi

[root@tianyun ~]# vim test10.sh 
# 使用 [ ]（需要 -a、-o）
if [ -f "/etc/passwd" -a -r "/etc/passwd" ]; then
    echo "文件存在且可读"
fi
```

- `[[ ]]` 支持 `&&` 和 `||`，更直观
- `[ ]` 必须用 `-a`（and）和 `-o`（or）

#### 5、正则匹配（先了解）
`[[ ]]` 支持 `=~` 进行正则匹配：

```bash
[root@tianyun ~]# vim test11.sh 
#!/bin/bash
#判断用户输入的是否是数字
read -p "请输入一个数值: " num				    
																
if [[ ! "$num" =~ ^[0-9]+$ ]];then		    
	echo "你输入的不是数字，程序退出!!!"	
	exit														
fi																
echo "脚本其它代码....."																


[root@tianyun ~]# vim test12.sh 					# 先复制试用一下
#!/bin/bash                                                               
#判断用户输入的是否是数字                                         
read -p "请输入一个数值: " num                                  
                                                                                   
while :                                                                        
do                                                                               
        if [[ $num =~ ^[0-9]+$ ]];then                        
                break                                                         
        else                                                                    
                read -p "不是数字，请重新输入数值: " num  
        fi                                                                         
done                                                                           
                                                                                   
echo "你输入的数字是: $num"
echo "开始执行其它代码......"
```

#### 6、命令返回值测试
检查上一条命令是否成功：
```bash
[root@tianyun ~]# vim test13.sh 
if id tom &>/dev/null; then
    echo "tom用户存在"
fi

[root@tianyun ~]# vim test14.sh 
id tom &>/dev/null
if [[ $? -eq 0 ]]; then
    echo "tom用户存在"
fi
```

### 三、注意事项

```bash
1、优先使用 [[ ]]，功能更强大且不易出错
2、变量引用加双引号（如 "$var"），避免空变量或空格导致的问题
3、数值比较用 -eq、-lt，字符串比较用 ==、!=
```

### 四、有意思的

```bash
()   		子shell中执行 (cd /home;pwd)
(())  		数值比较，运算  C语言
$()  		命令替换
$(())		整数运算

[]			传统的条件测试，同test
[[]]		升级版的条件测试，支持正则 =~
$[]			整数运算

{}			生成组合touch file{1,2}.txt，生成序列touch file{a..f}.txt
${}			变量引用
```

