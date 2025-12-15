## **Linux Expect及Shell结合**

Expect 是一个强大的自动化交互工具，特别适合处理需要用户交互的命令行程序。

### 一、Expect 核心详解

#### 1. Expect 基本流程

- **spawn**：启动目标程序
- **expect**：等待特定模式出现
- **send**：发送响应内容
- **interact**（可选）：将控制权交还用户

#### 2. Expect常用命令

**spawn**

```tcl
spawn ssh user@host  	# 启动ssh连接
spawn ftp $ftp_host		# 启动FTP连接
```

**expect**

```tcl
expect {
    "password:" {send "mypass\r"}  			# 匹配password:
    "yes/no" {send "yes\r"; exp_continue}  	# 继续等待
    timeout {exit 1}  						# 超时处理
    eof {exit}  							# 程序结束
}
```

**send**

```tcl
send "ls -l\r"  			# 发送命令
send "exit\r"				# 发送命令
```

### 二、Expect脚本案例

#### 案例1：自动SSH登录

```bash
#!/usr/bin/expect
set ip 10.9.48.121
set user root
set password 123

spawn ssh $user@$ip

expect {
	"yes/no" { send "yes\r"; exp_continue }
	"password:" { send "$password\r" }
}

interact
```

#### 案例2：自动远程复制文件

```bash
#!/usr/bin/expect
set ip 10.9.48.121
set user root
set password 123

spawn scp -r /etc/hosts $user@$ip:/tmp
expect {
	"yes/no" { send "yes\r"; exp_continue }
	"password:" { send "$password\r" };
}
expect eof
```

### 三、Expect 与 Shell 结合

#### 案例1：自动化批量SSH执行命令
```bash
[root@tianyun ~]# cat hosts_list.txt 
node1 192.168.92.201 root 123
node2 192.168.92.202 root 456
node3 192.168.92.203 root 789

[root@tianyun ~]# vim remote_task.sh
#!/bin/bash
while read 
do
	host=
	ip=
	user=
	password=
	
    /usr/bin/expect <<EOF
    spawn ssh $user@$ip
    expect {
        "yes/no" {send "yes\r"; exp_continue}
        "password:" {send "$password\r"}
    }
    expect "# " {send "hostname\r"}
    expect "# " {send "exit\r"}
    expect eof
EOF    
done < hosts_list.txt 
```

```bash
[root@node1 test]# ./remote_task.sh
spawn ssh root@192.168.230.130
Last login: Thu Dec 11 06:19:21 2025 from 192.168.230.132
[root@bogon ~]# hostname
bogon
[root@bogon ~]# exit
logout
Connection to 192.168.230.130 closed.
spawn ssh root@192.168.230.131
Last login: Thu Dec 11 06:19:30 2025 from 192.168.230.132
[root@bogon ~]# hostname
bogon
[root@bogon ~]# exit
logout
Connection to 192.168.230.131 closed.
[root@node1 test]# cat remote_task.sh
#!/bin/bash
while read host ip user password 
do
	
    /usr/bin/expect <<EOF
    spawn ssh $user@$ip
    expect {
        "yes/no" {send "yes\r"; exp_continue}
        "password:" {send "$password\r"}
    }
    expect "# " {send "hostname\r"}
    expect "# " {send "exit\r"}
    expect eof
EOF
    
done < hosts_list.txt 
```



#### 案例2：自动化批量SCP文件复制

```bash
[root@tianyun ~]# vim hosts_list.txt 
node1 192.168.92.201 root 123
node2 192.168.92.202 root 456
node3 192.168.92.203 root 789

[root@tianyun ~]# vim remote_task.sh
#!/bin/bash
while  read host ip user pass
do
        /usr/bin/expect <<EOF
        spawn scp /etc/hosts $user@$ip:/var/tmp
        expect {
                "yes/no" {send "yes\r"; exp_continue}
                "password:" {send "$pass\r"}
        }
        expect eof      
EOF
        echo "$host 文件复制完成"
done <hosts_list.txt
```

```bash
[root@node1 test]# ./remote_task2.sh
spawn scp /etc/hosts root@192.168.230.130:/var/tmp
hosts                                                       100%  225   126.9KB/s   00:00    
expect: spawn id exp6 not open
    while executing
"expect eof      "
node2 文件复制完成
spawn scp /etc/hosts root@192.168.230.131:/var/tmp
hosts                                                       100%  225   132.4KB/s   00:00    
expect: spawn id exp6 not open
    while executing
"expect eof      "
node3 文件复制完成
[root@node1 test]# cat remote_task2.sh
#!/bin/bash
while read host ip user password 
do
	
        /usr/bin/expect <<EOF
        spawn scp /etc/hosts $user@$ip:/var/tmp
        expect {
                "yes/no" {send "yes\r"; exp_continue}
                "password:" {send "$password\r"}
        }
        expect eof      
EOF
        echo "$host 文件复制完成"   
 
done < hosts_list.txt 

```



#### 案例3：自动化批量公钥推送

```bash
[root@tianyun ~]# vim hosts_list.txt 
node1 192.168.92.201 root 123
node2 192.168.92.202 root 456
node3 192.168.92.203 root 789

[root@tianyun ~]# cat push_publickey.sh
#!/bin/bash
if [ ! -f ~/.ssh/id_rsa ];then
        ssh-keygen -P "" -f ~/.ssh/id_rsa &>/dev/null
        echo "创建密钥对"
fi

while read host ip user pass
do
		# 判断目标主机是否在线
		...
		...
		
		# expect推送公钥
        /usr/bin/expect <<EOF
        spawn ssh-copy-id $user@$ip
        expect {
                "yes/no" {send "yes\r"; exp_continue}
                "password:" {send "$pass\r"}
        }
        expect eof
EOF
		#判断是否可以免密登录
		#ssh $user@$ip "hostname"
        echo "$host 公钥推送完成"
        
done <hosts_list.txt


并发执行...
while read line
do
	{
	循环体
	} &
done
wait
echo "执行完成"
```



```bash
[root@node1 test]# ./push_publickey.sh
node3 192.168.230.131 root
node2 192.168.230.130 root
spawn ssh-copy-id root@192.168.230.131
spawn ssh-copy-id root@192.168.230.130
/usr/bin/ssh-copy-id: INFO: Source of key(s) to be installed: "/root/.ssh/id_rsa.pub"
/usr/bin/ssh-copy-id: INFO: Source of key(s) to be installed: "/root/.ssh/id_rsa.pub"
/usr/bin/ssh-copy-id: INFO: attempting to log in with the new key(s), to filter out any that are already installed
/usr/bin/ssh-copy-id: INFO: attempting to log in with the new key(s), to filter out any that are already installed

/usr/bin/ssh-copy-id: WARNING: All keys were skipped because they already exist on the remote system.
		(if you think this is a mistake, you may want to use -f option)

expect: spawn id exp6 not open
    while executing
"expect eof"

/usr/bin/ssh-copy-id: WARNING: All keys were skipped because they already exist on the remote system.
		(if you think this is a mistake, you may want to use -f option)

expect: spawn id exp6 not open
    while executing
"expect eof"
bogon
bogon
执行完成
[root@node1 test]# cat push_publickey.sh
#!/bin/bash
if [ ! -f ~/.ssh/id_rsa ];then
        ssh-keygen -P "" -f ~/.ssh/id_rsa &>/dev/null
        echo "创建密钥对"
fi

while read host ip user password
do
	{

		echo "$host $ip $user"
		# 判断目标主机是否在线
		ping -c1 -W1 $ip &>/dev/null 
		if [ $? -ne 0  ];then
			echo "$host $ip ping不通， 请检查！！！" >> push_publickey.log
			continue
		fi
		
		# expect推送公钥
		/usr/bin/expect <<EOF
		spawn ssh-copy-id $user@$ip
		expect {
			"yes/no" {send "yes\r"; exp_continue}
			"password:" {send "$password\r"}
		}
		expect eof
EOF
		
		#判断是否可以免密登录
		ssh -n $user@$ip "hostname" 2>&1 | tee -a "push_pk_ssh.txt"
		if [ $? -eq 0  ];then
        		echo "$host 公钥推送完成 免密登录已实现" >> push_publickey.log
		else
			echo "$host 免密登录失败 请检查！！！" >> push_publickey.log
        	fi


	} &

done <hosts_list.txt

wait

echo "执行完成"


```

