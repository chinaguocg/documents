## **Linux Shell `while` 循环**

`while` 是 Shell 脚本中用于 **条件循环** 的控制结构，只要条件为真，就重复执行代码块。特别适合处理 **逐行读取文件、无限循环** 等场景。

### **1. `while` 循环基础语法**
#### **1.1 基本格式**
```bash
while [ 条件 ]
do
    循环体命令
done
```
- `[ 条件 ]` 可以是 **测试语句**、**命令返回值** 或 **算术表达式**。
- `do` 和 `done` 标记循环体的开始和结束。

#### **1.2 三种条件写法**
##### **(1) 测试条件**
```bash
count=1
while [ "$count" -le 5 ]
do
    echo "计数: $count"
    let count++
done
```
##### **(2) 命令返回值**
```bash
# 当 ping 成功时循环
while ping -c1 baidu.com &>/dev/null
do
    echo "网络畅通"
    sleep 5
done
echo "连接失败,请检查网络......"
```

##### **(3) 无限循环【死循环】**
```bash
while true  # 或 `:`
do
    echo "持续运行中..."
    sleep 1
done
```

### **2. 运维实战案例**
#### **案例 1：逐行读取文件**
```bash
[root@tianyun ~]# vim while1.sh
#!/bin/bash
while read line
do
    echo "行内容: $line"
done < /etc/hosts

要求：提取passwd文件中的: 用户名、UID、SHELL
[root@tianyun ~]# head /etc/passwd
root:x:0:0:root:/root:/bin/bash
bin:x:1:1:bin:/bin:/sbin/nologin
daemon:x:2:2:daemon:/sbin:/sbin/nologin
adm:x:3:4:adm:/var/adm:/sbin/nologin
lp:x:4:7:lp:/var/spool/lpd:/sbin/nologin
sync:x:5:0:sync:/sbin:/bin/sync
shutdown:x:6:0:shutdown:/sbin:/sbin/shutdown
halt:x:7:0:halt:/sbin:/sbin/halt
mail:x:8:12:mail:/var/spool/mail:/sbin/nologin
operator:x:11:0:operator:/root:/sbin/nologin

[root@tianyun ~]# head /etc/passwd |awk -F":" '{print $7}'
/bin/bash
/sbin/nologin
/sbin/nologin
/sbin/nologin
/sbin/nologin
/bin/sync
/sbin/shutdown
/sbin/halt
/sbin/nologin
/sbin/nologin


---传统版：
[root@tianyun ~]# vim while2.sh
#!/bin/bash
while read line
do
    echo "用户名: $username, UID: $useruid, SHELL: $usershell"
done < /etc/passwd

---传统版的完整代码
[root@haoha ~]# vim while_etc_passwd.sh
[root@haoha ~]# chmod +x while_etc_passwd.sh 
[root@haoha ~]# ./while_etc_passwd.sh 
username=root,uid=0,usershell=/bin/bash
username=bin,uid=1,usershell=/sbin/nologin
username=daemon,uid=2,usershell=/sbin/nologin
username=adm,uid=3,usershell=/sbin/nologin
username=lp,uid=4,usershell=/sbin/nologin
username=sync,uid=5,usershell=/bin/sync
username=shutdown,uid=6,usershell=/sbin/shutdown
username=halt,uid=7,usershell=/sbin/halt
username=mail,uid=8,usershell=/sbin/nologin
username=operator,uid=11,usershell=/sbin/nologin
username=games,uid=12,usershell=/sbin/nologin
username=ftp,uid=14,usershell=/sbin/nologin
username=nobody,uid=99,usershell=/sbin/nologin
username=systemd-network,uid=192,usershell=/sbin/nologin
username=dbus,uid=81,usershell=/sbin/nologin
username=polkitd,uid=999,usershell=/sbin/nologin
username=postfix,uid=89,usershell=/sbin/nologin
username=sshd,uid=74,usershell=/sbin/nologin
username=chrony,uid=998,usershell=/sbin/nologin
username=zhangsan,uid=1000,usershell=/bin/bash
username=lisi,uid=1001,usershell=/bin/bash
username=wangwu,uid=1002,usershell=/bin/bash
username=xiaoming,uid=1003,usershell=/bin/bash
username=nginx,uid=997,usershell=/sbin/nologin
username=tom,uid=1004,usershell=/bin/bash
username=tom1,uid=1005,usershell=/bin/bash
username=tom2,uid=1006,usershell=/bin/bash
username=tom3,uid=1007,usershell=/bin/bash
username=tom4,uid=1008,usershell=/bin/bash
username=tom5,uid=1009,usershell=/bin/bash
username=tom6,uid=1010,usershell=/bin/bash
username=tom7,uid=1011,usershell=/bin/bash
username=tom8,uid=1012,usershell=/bin/bash
username=tom9,uid=1013,usershell=/bin/bash
username=tom10,uid=1014,usershell=/bin/bash
username=tianyun,uid=1015,usershell=/bin/bash
username=alice,uid=1016,usershell=/bin/bash
username=zhuzhuxia,uid=1017,usershell=/bin/bash
[root@haoha ~]# cat while_etc_passwd.sh 
#!/bin/bash

while read line
do
	username=$(echo $line |awk -F":" '{print $1}')
	userid=$(echo $line |awk -F":" '{print $3}')
	usershell=$(echo $line |awk -F":" '{print $7}')
	#下面这个是对应的下面的优化版
	#IFS=':' read username _ userid _ _ _ usershell <<<$line
	echo "username=$username,uid=$userid,usershell=$usershell"
done < /etc/passwd
[root@haoha ~]# 



---优化版【扩展】：
[root@tianyun ~]# vim while3.sh
#!/bin/bash
while read line
do
    IFS=':' read username _ useruid _ _ _ usershell <<<$line
    echo "用户名: $username, UID: $useruid, SHELL: $usershell"
done < /etc/passwd


作业1：create_users_while.sh
1. 按文件中的用户名:密码:shell创建用户
[root@tianyun ~]# cat users.list 
alice:123:/bin/bash
jack:456:/sbin/nologin
yangge:345:/bin/bash

---代码示例
[root@haoha ~]# ./while_add_user.sh
alice exist!
jack exist!
yangge exist!
[root@haoha ~]# cat while_add_user.sh 
#!/bin/bash

while IFS=':' read username pass usershell
do
	id $username &>/dev/null
	if [ $? -eq 0 ];then
		echo "$username exist!"
		continue
	else
		useradd -m -s  $usershell $username 
		echo "$username:$pass" | chpasswd
		if [ $? -eq 0  ];then
			echo "$username create success!"
		fi
	fi
done < /root/users.list
[root@haoha ~]# 


作业2：ping_hosts_while.sh
1. ping探测hosts.txt中的主机
[root@tianyun ~]# cat hosts.txt 
百度 baidu.com
千锋 qfedu.com
杨哥 yangge.com
2. 输出：网络正常 或 网络不能连接，如 百度：网络正常

---完整代码示例
[root@haoha ~]# ./ping_hosts_while.sh
百度 网络不能连接
千锋 网络正常
杨哥 网络不能连接
[root@haoha ~]# cat ping_hosts_while.sh
#!/bin/bash

while IFS=' ' read hostname hostip
do
	ping -c1 -W1 $hostip &>/dev/null
	if [ $? -eq 0  ];then
		echo "$hostname 网络正常"
	else
		echo "$hostname 网络不能连接"
	fi
done < /root/hosts.txt
[root@haoha ~]# 
```
#### **案例 2：用户输入验证**
```bash
[root@tianyun ~]# vim input_number.sh
脚本要求：当用户输入数字后退出

提示思路：
1. while死循环
2. 当用户输入非数字，提示：请重新输入数字: $num
3. 当用户输入数字，提示：输入有效: $num
4. 当循环结束后，输出：运行其它代码

---完整代码示例
[root@haoha ~]# ./input_number.sh
请输入数字：1
输入有效 1
运行其他代码
[root@haoha ~]# cat input_number.sh
#!/bin/bash
while :
do
	read -p "请输入数字：" num
	if [[ $num =~ ^[0-9]+$  ]];then
		echo "输入有效 $num"
		break
	fi
done

echo "运行其他代码"
[root@haoha ~]# 


[root@tianyun ~]# vim input_yes.sh
脚本要求：当用户输入数字后退出

提示思路：
1. while死循环
2. 提示：是否继续（yes/no）? $choice
3. 如果不是yes,提示：请输入yes或no $choice
4. 当用户输入yes或YES，执行其它代码
5. 输出：运行其它代码

---完整代码示例
[root@haoha ~]# vim input_yes.sh
[root@haoha ~]# ./input_yes.sh 
是否继续（yes/no）oo
是否继续（yes/no）oo
是否继续（yes/no）yes
执行其他代码
运行其他代码
[root@haoha ~]# cat input_yes.sh
#!/bin/bash


while :
do
	read -p "是否继续（yes/no）" choice
	if [[ "$choice" == "yes" || "$choice" == "no"  ]];then
		echo "执行其他代码"
		break
	fi
done

echo "运行其他代码"
[root@haoha ~]# 
```

#### **案例 3：系统工具箱**
```bash
[root@tianyun ~]# vim sys_toolkit_v1.1.sh

运行效果：
1. 检查磁盘空间
2. 检查内存使用
3. 检查网络连接
q. 退出脚本
请选择操作 (1-3, q退出): 

提示思路：
1. 输出一个菜单，让用户选择
2. read读入用户选择赋值给相应的变量 $choice
3. 通过case模式匹配变量choice，实现对应的操作，并提示：按回车键继续......
[root@haoha ~]# read -n1 -p "按任意键继……"
按任意键继……
[root@haoha ~]# 

4. 如果用户输入的不是1-3，提示输出错误
5. 用户可以一直选择，直到按q退出
```

完整代码示例

```bash
[root@haoha ~]# vim sys_toolkit_v1.1.sh
[root@haoha ~]# cat sys_toolkit_v1.1.sh
#!/bin/bash

echo "1. 检查磁盘空间
2. 检查内存使用
3. 检查网络连接
q. 退出脚本"

while :
do
	read -p "请选择操作 (1-3, q退出): " choice
	if [ "$choice" == "1"  ];then
		df -h
	fi
        if [ "$choice" == "2"  ];then
		free -h
        fi
        if [ "$choice" == "3"  ];then
		ping -c1 -W1 www.baidu.com
        fi
        if [ "$choice" == "q"  ];then
		exit
        fi

done

[root@haoha ~]#
```

