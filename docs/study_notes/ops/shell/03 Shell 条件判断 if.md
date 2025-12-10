## Shell 条件语句`if` 

`if` 是 Shell 脚本中最常用的条件判断语句，用于根据条件执行不同的代码块。结合 `test`（或 `[ ]`）、文件检查、字符串比较、数值判断等，可以实现复杂的逻辑控制。  

```bash
创建用户脚本：
--- 顺序执行，没有判断
1. 让用户输入新的用户名
2. 使用useradd创建用户
3. passwd设置密码
4. 输出用户创建成功

--- 加上条件判断
1. 是否有创建用户的权限？
2. 用户是否有输入？
3. 要创建的用户是否已存在？
4. 创建不一定成功
```

### **1. `if` 基础语法**
#### **1.1 基本格式**
```bash
if [ 条件1 ]; then
    # 条件1成立时执行的代码
elif [ 条件2 ]; then
    # 条件2成立时执行的代码
else
    # 所有条件均不成立时执行的代码
fi
```
- `[ ]` 是 `test` 命令的简写，**括号内两侧必须有空格**。
- `then` 和 `fi` 是 `if` 语句的开始和结束标志。
- `elif`（`else if` 的缩写）和 `else` 是可选的。

#### **1.2 `if` 的三种写法**
##### **(1) 单行写法**
```bash
if [ 条件 ]; then 命令; fi

if [ -f "/etc/passwd" ]; then echo "文件存在"; fi
```
##### **(2) 多行写法**
```bash
if [ 条件 ]
then
    命令1
    命令2
fi
```

##### **(3) 使用 `[[ ]]`**
```bash
if [[ -f "/etc/passwd" && -r "/etc/passwd"  ]]; then
    echo "条件成立"
fi
```

### **2. 运维实战案例**

**案例：判断是否是数字**

```bash
[root@haoha ~]# cat test_isnum.sh
#!/bin/bash



read -p "请输入数字：" num


while :
do
	if [[ "$num" =~ ^[0-9]+$ ]];then
        	echo "是数字"
		break
	else
        	read -p "不是数字：" num
	fi


done

echo "输入的是：$num"
echo "执行其他"

```



#### **案例 1：Ping测试主机状态**

```bash
版本一：要测试的主机，在脚本中显式定义
[root@tianyun ~]# vim ping_host_check1.sh 
Target_Host="qfedu.com"

版本二：要测试的主机，让用户输入
[root@tianyun ~]# vim ping_host_check2.sh
思路提示：
1. 判断用户是否有输入

版本三：要测试的主机，通过位置变量接收$1
[root@tianyun ~]# vim ping_host_check3.sh 
思路提示：
1. 判断是否有参数（可以通过参数个数$#是否等于0来判断）
2. 如果没有提示用户使用方法："ping_host_check3.sh 主机名或IP"

提示：
[root@tianyun ~]# basename /etc/sysconfig/network-scripts/ifcfg-ens33    # 提取路径中的 文件名
ifcfg-ens33
[root@tianyun ~]# dirname /etc/sysconfig/network-scripts/ifcfg-ens33 	 # 提取路径中的 目录名
/etc/sysconfig/network-scripts
```

完整代码示例

```bash
#!/bin/bash

host=$1

if [ $# -eq 0  ];then
	echo "Please use `basename $0` hostname OR ip"
	exit
fi 

ping -c1 -W1 $host &>/dev/null

if [ $? -eq 0  ];then
	echo "host $host ping pong success"
else
	echo "host $host is down "
fi
```



#### **案例 2：检查服务是否运行**

```bash
[root@tianyun ~]# yum -y install nginx
[root@tianyun ~]# vim check_service_status.sh 
service="nginx"

提示：判断服务是否运行
systemctl is-active -q nginx
```

完整代码示例

```bash
[root@haoha ~]# cat check_service_status.sh
#!/bin/bash
service="nginx"

systemctl is-active -q $service

if [ $? -eq 0  ];then
	echo "$service is run"
else
	echo "$service is stop"
fi
[root@haoha ~]# ./check_service_status.sh 
nginx is run
[root@haoha ~]# 
```

#### **案例 3：根据发行版安装软件**

```bash
[root@tianyun ~]# vim install_nginx.sh
#!/bin/bash
# 安装Nginx软件

思路提示：
1. 检查root权限，如果不是root，提示：请使用root用户或sudo运行此脚本，程序退出
2. 检测操作系统类型，如果是红帽系统系，使用yum安装并启动服务（/etc/redhat-release）
3. 否则如果是Ubuntu，使用apt安装并启动服务（/etc/lsb-release）
4. 否则输出：不支持的Linux发行版，程序退出
5. 检查Nginx是否安装成功（which nginx），如果成功输出
    echo
    echo "Nginx安装成功！"
    echo "Nginx版本信息：$(nginx -v 2>&1 | awk -F"/" '{print $2}')"
    echo "Nginx服务状态："
    systemctl status nginx | grep -E "Active:|Loaded:"
    echo "可以通过浏览器访问服务器IP地址来验证Nginx是否正常运行"
6. 否则输出：Nginx安装失败，请检查错误信息，程序退出


--- CentOS测试
分别使用普通用户和root测试
Nginx安装成功！
Nginx版本信息：1.20.1
Nginx服务状态：
   Loaded: loaded (/usr/lib/systemd/system/nginx.service; enabled; vendor preset: disabled)
   Active: active (running) since Wed 2025-08-13 11:30:51 CST; 9min ago
可以通过浏览器访问服务器IP地址来验证Nginx是否正常运行

--- Ubuntu测试
tianyun@yangge:~$ sudo ./install_inginx.sh
Nginx安装成功！
Nginx版本信息：1.24.0 (Ubuntu)
Nginx服务状态：
     Loaded: loaded (/usr/lib/systemd/system/nginx.service; enabled; preset: enabled)
     Active: active (running) since Wed 2025-08-13 03:32:10 UTC; 9min ago
可以通过浏览器访问服务器IP地址来验证Nginx是否正常运行

```

完整代码示例

```bash
#!/bin/bash

# is root
if [ $UID -ne 0  ];then
	echo "Please use root or sudo"
	exit
fi

# system version
cat /etc/redhat-release
isred=$?
cat /etc/lsb-release
isuban=$?
# OR if [ -e /etc/redhat-release  ] 
if [ $isred -eq 0  ];then
	yum -y install nginx
elif [ $isuban -eq 0  ];then
	apt -y install nginx
else
	echo "Your system version don't no install"
	exit
fi

systemctl start nginx
systemctl enable nginx

# nginx install success fail
if [ $( which nginx)   ];then
	echo
	echo "Nginx安装成功！"
	echo "Nginx版本信息：$(nginx -v 2>&1 | awk -F"/" '{print $2}')"
	echo "Nginx服务状态："
	systemctl status nginx | grep -E "Active:|Loaded:"
	echo "可以通过浏览器访问服务器IP地址来验证Nginx是否正常运行"
else
	echo "Nginx安装失败，请检查错误信息"
	exit
fi
```



#### **案例 4：磁盘空间监控**

```bash
[root@tianyun ~]# yum -y install mailx
[root@tianyun ~]# vim monitor_disk_space.sh

思路提示： 
1. 获得当前根分区的使用率（数字），赋值给变量如disk_root_usage
2. 判断当前根分区的使用率是否超过阈值threshold例如80%
3. 如果超过阈值发邮件给root，正文、主题及发送方式
echo "[$(date "+%F %T")]警告: /分区使用率 ${usage}%，请清理磁盘！" | mail -s "磁盘告警" root
4. 可以使用cron例如每小时执行脚本
```

```bash
[root@haoha ~]# crontab -e
no crontab for root - using an empty one
crontab: installing new crontab
[root@haoha ~]# crontab -l
0 * * * * /root/monitor_disk_space.sh
[root@haoha ~]# /root/monitor_disk_space.sh
[root@haoha ~]# cat /root/monitor_disk_space.sh
#!/bin/bash

#阈值
threshold=80

# 获得当前根分区的使用率（数字）
disk_root_usage=$(df |grep "/$" |awk '{print $5}' |awk -F"%" '{print $1}')

#判断是否超过阈值

if [[ $disk_root_usage -gt $threshold ]];then
	echo "[$(date "+%F %T")]警告: /分区使用率 ${disk_root_usage}%，请清理磁盘！" | mail -s "磁盘告警" root
fi
[root@haoha ~]# 

```



#### **案例 5：备份文件**

```bash
[root@tianyun ~]# backup_files.sh
要求:
1. 每天2:00对例如/etc目录进行备份，存储在/backup目录下
2. 备份的文件名使用：etc.当天日期.tar.gz

思路提示： 
1. 判断备份目录是否存在，不存在则创建
2. 判断当天是否已备份，如果未备份则使用tar备份
3. 备份成功或失败均输出相关的提示信息
```

```bash
[root@haoha ~]# ./backup_files.sh 
[root@haoha ~]# cat backup_files.sh
#!/bin/bash

# 判断备份目录是否存在，不存在则创建
if [ ! -d "/backup"  ];then
	mkdir -p "/backup"
fi

# 判断当天是否已备份，如果未备份则使用tar备份
filename_date=`date '+%Y%m%d'`
filename="etc.${filename_date}.tar.gz"
if [ -f "/backup/${filename}"  ];then
	exit
fi

tar -czf /backup/$filename /etc
if [ $? -eq 0  ];then
	echo "backup success"
else
	echo "backup fail"
fi
[root@haoha ~]# crontab -e
crontab: installing new crontab
[root@haoha ~]# crontab -l
0 * * * * /root/monitor_disk_space.sh
0 2 * * * /root/backup_files.sh
[root@haoha ~]# 

```



#### **案例 6：检查端口是否监听**

```bash
[root@tianyun ~]# check_port_listening.sh
要求：
1. 检查指定服务的端口是否在监听

思路提示： 
1. 用户输出端口，并判断是否是数字
2. 判断端口是否监听
netstat -tnlp | grep -q ":$port"
3. 成功失败均输出相关的提示信息
```

```bash
[root@haoha ~]# vim check_port_listening.sh
[root@haoha ~]# chmod +x check_port_listening.sh
[root@haoha ~]# ./check_port_listening.sh
Please input port(num): ccc
please input num
[root@haoha ~]# ./check_port_listening.sh
Please input port(num): 80
listen 80 success
[root@haoha ~]# ./check_port_listening.sh
Please input port(num): 443
listen 443 fail
[root@haoha ~]# cat check_port_listening.sh
#!/bin/bash
read -p "Please input port(num): " port
if [[ !  "$port" =~ ^[0-9]+$ ]];then
	echo "please input num"
	exit
fi


netstat -tnlp | grep -q ":$port"

if [ $? -eq 0  ];then
	echo "listen $port success"
else
	echo "listen $port fail"
fi

[root@haoha ~]# 
```



#### **案例 7：用户输入验证**

```bash
[root@tianyun ~]# check_user_input.sh
要求：
1. 用户输出一个1-10的数字

思路提示： 
1. 提示用户输出一个1-10的数字
2. 首先判断是否是数字，如果不是数字，提示用户：请输入数字，程序退出。
3. 如果是数字，再进一步判断是否是1-10，如果是1-10输出：有效的数字xxx，否则提示：数字不在 1-10 范围内
```

```bash
[root@haoha ~]# vim check_user_input.sh
[root@haoha ~]# chmod +x check_user_input.sh 
[root@haoha ~]# ./check_user_input.sh 
please input num(1-10): haha
./check_user_input.sh: line 5: [: =~: binary operator expected
num is not 1-10
[root@haoha ~]# vim check_user_input.sh
[root@haoha ~]# ./check_user_input.sh 
please input num(1-10): haha
please input num
[root@haoha ~]# ./check_user_input.sh 
please input num(1-10): 0
num is not 1-10
[root@haoha ~]# ./check_user_input.sh 
please input num(1-10): 1
num is true
[root@haoha ~]# cat check_user_input.sh 
#!/bin/bash

read -p "please input num(1-10): " num

if [[ ! "$num" =~ ^[0-9]+$ ]];then
	echo "please input num"
	exit
fi

if (( $num >=1 && $num <=10   ));then
	echo "num is true"
else
	echo "num is not 1-10"
fi

[root@haoha ~]# 

```



#### **案例 8：成绩等级判断**

```bash
[root@tianyun ~]# vim grade_check.sh
#!/bin/bash

# 提示用户输入成绩
read -p "请输入成绩：" score 
# 检查输入是否为数字，不是数字输出：错误：请输入有效的数字！程序退出
if [[ !  $score =~ ^[0-9]+$  ]];then
	echo "输入的不是数字"
	exit
fi

# 判断成绩等级
if (( score >= 90 && score <= 100 )); then
    echo "成绩等级：A（优秀）"
elif (( score >= 80 && score < 90 )); then
    echo "成绩等级：B（良好）"
elif (( score >= 70 && score < 80 )); then
    echo "成绩等级：C（中等）"
elif (( score >= 60 && score < 70 )); then
    echo "成绩等级：D（及格）"
elif (( score >= 0 && score < 60 )); then
    echo "成绩等级：F（不及格）"
else
    echo "错误：成绩必须在 0-100 之间！"
fi
```

