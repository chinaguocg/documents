## **Linux Shell `for` 循环**

`for` 循环是 Shell 脚本中最常用的循环结构之一，用于 **遍历列表、处理文件、批量操作** 等场景。

### **1. `for` 循环基础语法**
#### **1.1 基本格式**
```bash
for 变量 in 列表
do
    循环体命令
done
```
**示例**：

```bash
#序列1：
for i in 1 2 3
do
    echo "数字: $i"
done

#序列2：
for i in {1..10}
do
   echo "数字: $i"
done

#序列3：
for i in $(seq 10)
do
   echo "数字: $i"
done
```
#### **1.2 列表生成方式**
| 方法           | 示例                        | 说明              |
| -------------- | --------------------------- | ----------------- |
| **直接列举**   | `for i in a b c`            | 遍历固定值        |
| **大括号扩展** | `for i in {1..5}`           | 生成数字/字符序列 |
| **seq**        | `for i in $(seq 100)`       | 生成数字序列      |
| **命令替换**   | `for file in $(ls)`         | 遍历命令输出      |
| **通配符匹配** | `for file in *.txt`         | 遍历匹配的文件    |
| **数组遍历**   | `for item in "${array[@]}"` | 遍历数组元素      |

### **2. 运维实战案例**
#### **案例 1：批量创建用户**

```bash
[root@haoha ~]# cat create_user_for.sh
#!/bin/bash

#创建用户
name=tom
pass=123

#创建10个tom
for i in $(seq 10)
do

	user=$name$i
	id $user &>/dev/null

	if [ $? -eq 0  ];then
		echo "username $user exist"
	else
		useradd $user
		echo "$user:$pass" | chpasswd
		if [ $? -eq 0  ];then
			echo "username $user create success"
		fi

	fi

done

echo "all user create success!"
[root@haoha ~]#
```



```bash
[root@tianyun ~]# vim create_users_for.sh
脚本要求：
1. 用户：tianyun alice tom zhuzhuxia
2. 密码：123
```

```bash
[root@haoha ~]# cat create_user_for_guding.sh 
#!/bin/bash
users=(tianyun alice tom zhuzhuxia)
pass=123
for username in ${users[@]}
do
	id $username &>/dev/null
	if [ $? -ne 0  ];then
		useradd $username
		echo "$username:$pass" |sudo chpasswd
		if [ $? -eq 0  ];then
			echo "$username create success"
		else
			echo "$username cerate fail"
		fi
	else
		echo "$username is exist"
	fi

done

echo "all user create success"
[root@haoha ~]# 

```

#### **案例 2：批量 Ping 检测主机**

```bash
--- 版本一：
[root@tianyun ~]# vim ping_hosts_check_for1.sh
脚本要求：
1. ping 探测某网段 1-254的所有主机，如39.156.70.1 - 39.156.70.254
2. 如果能ping通，输出：主机x.x.x.x在线，反之输出：主机x.x.x.x在线

--- 版本二：
[root@tianyun ~]# vim ping_hosts_check_for2.sh
脚本要求：
1. ping 探测某网段 1-254的所有主机，如39.156.70.1 - 39.156.70.254
2. 如果能ping通，输出：主机x.x.x.x在线，反之输出：主机x.x.x.x在线
3. 以并发的方式执行脚本 { 循环体 } &  wait
4. 将在线的主机输出到终端的同时（tee），写入到/tmp/up.txt文件中
```

完整代码示例

```bash
[root@haoha ~]# cat ping_hosts_check_for1.sh
#!/bin/bash

#color
RED='\033[31m'
GREEN='\033[32m'
NC='\033[0m'

#IP地址前缀数字
ip_num=39.156.70.
#保存文件
save_file=/tmp/ip_ping_test_success.txt
#有则清空文件，没有则创建文件
>$save_file

#{ 代码块 }& 代码块放在后台运行
for i in $(seq 30)
do
	{
	ip=$ip_num$i
	ping -c1 -W1 $ip &>/dev/null
	if [ $? -eq 0  ];then
		echo -e  "${GREEN}$ip ping pong success ${NC} " |tee -a $save_file
	else
		echo -e  "${RED}$ip ping fail${NC}"
	fi
	}&
done

wait

echo "all ping finish"

[root@haoha ~]# ./ping_hosts_check_for1.sh
39.156.70.8 ping pong success  
39.156.70.30 ping pong success  
39.156.70.15 ping pong success  
39.156.70.3 ping pong success  
39.156.70.18 ping pong success  
39.156.70.11 ping pong success  
39.156.70.26 ping pong success  
39.156.70.12 ping pong success  
39.156.70.17 ping fail
39.156.70.22 ping fail
39.156.70.6 ping fail
39.156.70.29 ping fail
39.156.70.5 ping fail
39.156.70.14 ping fail
39.156.70.16 ping fail
39.156.70.19 ping fail
39.156.70.25 ping fail
39.156.70.24 ping fail
39.156.70.7 ping fail
39.156.70.27 ping fail
39.156.70.4 ping fail
39.156.70.9 ping fail
39.156.70.10 ping fail
39.156.70.13 ping fail
39.156.70.20 ping fail
39.156.70.23 ping fail
39.156.70.28 ping fail
39.156.70.1 ping fail
39.156.70.2 ping fail
39.156.70.21 ping fail
all ping finish


[root@haoha ~]# cat /tmp/ip_ping_test_success.txt
39.156.70.8 ping pong success  
39.156.70.30 ping pong success  
39.156.70.15 ping pong success  
39.156.70.3 ping pong success  
39.156.70.18 ping pong success  
39.156.70.11 ping pong success  
39.156.70.26 ping pong success  
39.156.70.12 ping pong success  
[root@haoha ~]# 


```



#### **案例 3：批量 Ping 检测主机（C风格）**

```bash
#!/bin/bash
# 初始值i=1; 条件判断i<=10; 步长i++
for ((i=1; i<=10; i++))				
do
	循环体
done
```
### **3. 高级用法**
#### **3.1 嵌套循环**

`在50台服务器上，分别创建10个用户`

```bash
for i in {1..3}
do
    for j in A B
    do
        echo "组合: $i$j"
    done
done
echo "结束......."

案例：create_dir_file.sh
1. 在/tmp下创建目录 dir1 - dir20
2. 在每个目录下创建文件 file1.txt - file10.txt
```
```bash
[root@haoha ~]# cat create_dir_file.sh 
#!/bin/bash

#目录前缀
dir_prefix=mydir

#文件前缀
file_prefix=file

for i in {1..20}
do
    dirname="/tmp/$dir_prefix$i"
    mkdir $dirname
    
    for j in {1..10}
    do
	touch $dirname/$file_prefix$j.txt
    done
done

echo "结束......."
```



#### **3.2 跳过某次循环（`continue`）**

```bash
for i in {1..10}
do
    if [ "$i" -eq 5 ]; then
        continue  # 跳过本次循环
    fi
    echo "当前值: $i"
done
echo "结束......."
```
#### **3.3 提前终止循环（`break`）**
```bash
for i in {1..10}
do
    if [ "$i" -eq 5 ]; then
        break # 跳出循环（默认为一层）
    fi
    echo "当前值: $i"
done
echo "结束......."
```
