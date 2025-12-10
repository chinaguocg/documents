## shell 变量

- 什么是shell变量?
- 变量的类型
- 变量的定义方式
- 变量的运算
- 变量"内容"的删除和替换

```bash
shell 变量? 用一个固定的字符串去表示不固定的内容
```

### 一、变量的类型

#### 1、自定义变量

```bash
定义变量：	变量名=变量值 变量名必须以字母或下划线开头，区分大小写   ip1=192.168.2.115 
引用变量：	$变量名 或 ${变量名}
查看变量：	echo $变量名  set(所有变量：包括自定义变量和环境变量)
取消变量：	unset 变量名
作用范围：	仅在当前shell中有效
```

#### 2、环境变量

```bash
定义环境变量：	方法一 export back_dir2=/home/backup 
			 方法二 export back_dir1 将自定义变量转换成环境变量
引用环境变量：	$变量名 或 ${变量名}
查看环境变量：	echo $变量名  env   例如env |grep back_dir2
取消环境变量：	unset 变量名
变量作用范围：	在当前shell和子shell有效

[root@yangge ~]# env

[root@yangge ~]# echo $HOSTNAME
yangge
[root@yangge ~]# echo $USER
root
[root@yangge ~]# echo $PWD
/root
[root@yangge ~]# echo $HOME
/root

示例：将MySQL的命令路径加入到PATH环境变量
没加前 - /usr/local/mysql/bin/mysql -uroot -p'123'

# vim /etc/profile
export PATH=$PATH:/usr/local/mysql/bin
# source /etc/profile
添加后 - mysql -uroot -p'123'
```

#### 3、位置变量

```bash
$1 $2 $3 $4 $5 $6 $7 $8 $9 ${10} ${11}
```

#### 4、预定义变量

```bash
$0  脚本名
$*	所有的参数
$@ 	所有的参数
$# 	参数的个数
$$ 	当前进程的PID
$!  上一个后台进程的PID
$?	上一个命令的返回值 0表示成功	
```

```bash
示例1：位置变量和预定义变量
[root@tianyun ~]# vim test1.sh
echo "第2个位置参数是$2"
echo "第1个位置参数是$1"
echo "第4个位置参数是$4"

echo "所有参数是: $*"
echo "所有参数是: $@"
echo "参数的个数是: $#"
echo "当前进程的PID是: $$"

[root@tianyun ~]# chmod +x test.sh
[root@tianyun ~]# ./test.sh yang tianyun alice jack tom 100
第2个位置参数是tianyun
第1个位置参数是yang
第4个位置参数是jack
所有参数是: yang tianyun alice jack tom 100
所有参数是: yang tianyun alice jack tom 100
参数的个数是: 6
当前进程的PID是: 76416
```

**作业：了解 $* 和 $@ 区别**

```bash
-- 示例2：修改IP和主机名v1.0
[root@yangge ~]# vim modify_ip.sh
hostnamectl set-hostname $4

nmcli connection modify ens33 ipv4.method manual \
ipv4.addresses $1/24 ipv4.gateway $2 ipv4.dns $3 autoconnect yes   

nmcli connection up ens33

[root@yangge ~]# chmod +x modify_ip.sh
[root@yangge ~]# ./modify_ip.sh 192.168.92.101 192.168.92.2 4.4.4.4 web01
[root@yangge ~]# ./modify_ip.sh 192.168.92.102 192.168.92.2 4.4.4.4 web02
[root@yangge ~]# ./modify_ip.sh 192.168.92.103 192.168.92.2 4.4.4.4 web03

-- 示例3：Ping测试主机
[root@tianyun ~]# vim ping.sh
#!/bin/bash
ping -c2 $1 &>/dev/null
if [ $? = 0 ];then
        echo "host $1 is ok"
else
        echo "host $1 is fail"
fi										

[root@tianyun ~]# chmod a+x ping.sh
[root@tianyun ~]# ./ping.sh www.baidu.com
[root@tianyun ~]# ./ping.sh 192.168.92.100

作业：
正确的结果 echo "host $1 is ok" 用绿色显示
失败的结果 echo "host $1 is fail" 用红色显示
```

### 二、变量的赋值方式

#### 1、显式赋值

```bash
变量名=变量值
示例：
ip1="192.168.1.251"
school="BeiJing qfedu"
today1=`date +%F`				# 命令替换
today2=$(date +%F)				# 命令替换

touch yangge_$(date +%F).txt
mkdir -p /backups/$(date +%u)
```

#### 2、read 从键盘读入变量值

```bash
语法：
read 变量名
read -p "提示信息: "  变量名
read -t 5 -p "提示信息: "  变量名
read -n 2 变量名


read ip
read -p "请输入IP地址: " ip
read -t 5 -p "请输入IP地址: " ip
read -n 1 ip
read -n 1 -p "按任意键继续..."

示例3：修改IP和主机名v2.0
[root@tianyun ~]# vim modify_ip_v2.0.sh
#!/bin/bash
read -p "请输入[IP 网关 DNS 主机名]: " ip gateway dns hostname

#修改主机名
hostnamectl set-hostname ${hostname}

#修改IP
nmcli connection modify ens33 \
ipv4.method manual \
ipv4.addresses ${ip}/24 \
ipv4.gateway ${gateway} \
ipv4.dns ${dns} \
autoconnect yes

#激活IP
nmcli connection up ens33


示例4：
[root@tianyun ~]# vim ping2.sh
#!/bin/bash							
read -p "请输入要测试的主机名或IP: " ip                
ping -c2 $ip &>/dev/null                
if [ $? = 0 ];then                                      
        echo "host $ip is ok"       
else                                                                                    
        echo "host $ip is fail"     
fi										
[root@tianyun ~]# chmod a+x ping2.sh
[root@tianyun ~]# ./ping.sh
```

**定义或引用变量时注意事项**

```bash
" "  	弱引用
' ' 	强引用
[root@tianyun ~]# school=1000phone
[root@tianyun ~]# echo "${school} is good"
1000phone is good
[root@tianyun ~]# echo '${school} is good'
${school} is good
	
` `  	命令替换 等价于 $()   反引号中的shell命令会被先执行
[root@tianyun ~]# touch `date +%F`_file1.txt  
[root@tianyun ~]# touch $(date +%F)_file2.txt 
		   
[root@tianyun ~]# disk_free3="df -Ph |grep '/$' |awk '{print $4}'"		# 错误
[root@tianyun ~]# disk_free4=$(df -Ph |grep '/$' |awk '{print $4}')
[root@tianyun ~]# disk_free5=`df -Ph |grep '/$' |awk '{print $4}'`		   
```

### 三、变量的运算 

#### 1、整数运算

```bash
[root@tianyun ~]# num1=2
[root@tianyun ~]# num2=5

方法一：expr
expr 1 + 2
expr $num1 + $num2    		+  -  \*  /  %		

方法二：$(())
echo $(($num1+$num2))      	+  -  *  /   %
echo $((num1+num2))
echo $((5-3*2))	 
echo $(((5-3)*2))
echo $((2**3))
sum=$((1+2)); echo $sum

方法三：$[]
echo $[5+2]					+  -  *  /  %
echo $[5**2]

方法四：let
let sum=2+3; echo $sum
let i++; echo $i


[root@web02 ~]# i=1
[root@web02 ~]# let i=i+1
[root@web02 ~]# echo $i
2

[root@web02 ~]# k=1
[root@web02 ~]# let k++
[root@web02 ~]# echo $k
2
[root@web02 ~]# k++  等价  k=k+1 		
```

#### 2、小数运算

```bash
方法一：bc
echo "2*4" |bc
echo "2^4" |bc
echo "scale=2;6/4" |bc

方法二：awk
awk 'BEGIN{print 1/2}'

方法三：python
echo "print 5.0/2" |python
```

### 四、变量"内容"的删除和替换（扩展了解）

#### 1、变量"内容"的删除

```bash
[root@tianyun ~]# url=www.sina.com.cn
[root@tianyun ~]# echo ${#url}				# 获取变量值的长度
15
[root@tianyun ~]# echo ${url}			    # 标准查看
www.sina.com.cn
[root@tianyun ~]# echo ${url#*.}			# 从前往后，最短匹配（*任意字符，匹配到第一个.）
sina.com.cn
[root@tianyun ~]# echo ${url##*.}			# 从前往后，最长匹配	贪婪匹配
cn

[root@tianyun ~]# url=www.sina.com.cn
[root@tianyun ~]# echo ${url}
www.sina.com.cn
[root@tianyun ~]# echo ${url%.*}			# 从后往前，最短匹配
www.sina.com
[root@tianyun ~]# echo ${url%%.*}			# 从后往前，最长匹配	贪婪匹配
www

[root@tianyun ~]# url=www.sina.com.cn
[root@tianyun ~]# echo ${url#a.}
www.sina.com.cn
[root@tianyun ~]# echo ${url#*sina.}
com.cn

[root@tianyun ~]# hostname tianyun.1000phone.com		# 设置临时主机名
退出shell，重新连接

[root@tianyun ~]# echo $HOSTNAME
tianyun.1000phone.com
[root@tianyun ~]# echo ${HOSTNAME%%.*}
tianyun

索引及切片
[root@tianyun ~]# url=www.sina.com.cn
[root@tianyun ~]# echo ${url:0:5}						# 从第一个（0）字符开始，取5个字符
[root@tianyun ~]# echo ${url:5:5}		
[root@tianyun ~]# echo ${url:5}
```

#### 2、变量"内容"的替换

```bash
[root@tianyun ~]# url=www.sina.com.cn
[root@tianyun ~]# echo ${url/sina/baidu}
www.baidu.com.cn

[root@tianyun ~]# url=www.sina.com.cn
[root@tianyun ~]# echo ${url/n/N}			# /替换第一个
www.siNa.com.cn
[root@tianyun ~]# echo ${url//n/N}			# //替换全部 贪婪匹配
www.siNa.com.cN
```

#### 4、变量的替代【难度】

```bash
准备场景
[root@tianyun ~]# unset var1
[root@tianyun ~]# unset var2
[root@tianyun ~]# unset var3
[root@tianyun ~]# 									# var1没有定义
[root@tianyun ~]# var2=								# var2有定义，但为空值
[root@tianyun ~]# var3=111							# var3有定义，有值

第一种替代 ${变量名-新的变量值}
[root@tianyun ~]# echo ${var1-aaaa}
aaaa
[root@tianyun ~]# echo ${var2-aaaa}

[root@tianyun ~]# echo ${var3-aaaa}
111
变量没有被赋值：会使用“新的变量值“ 替代
变量有被赋值（包括空值）： 不会被替代

第二种替代 ${变量名:-新的变量值}
[root@tianyun ~]# echo ${var1:-aaaa}
aaaa
[root@tianyun ~]# echo ${var2:-aaaa}
aaaa
[root@tianyun ~]# echo ${var3:-aaaa}
111
变量没有被赋值（包括空值）：都会使用“新的变量值“ 替代
变量有被赋值： 不会被替代

结论：${变量名-新的变量值} 和 ${变量名:-新的变量值} 仅对空值变量有影响 var2

[root@tianyun scripts]# vim var1.sh
#!/bin/bash
read -p "输入端口[默认为80]: " port
echo "你输入的端口为: $port"

[root@tianyun scripts]# chmod +x var1.sh 
[root@tianyun scripts]# ./var1.sh 
输入端口[默认为80]: 								# 直接回车，没有输入
你输入的端口为: 

[root@tianyun scripts]# vim var2.sh
#!/bin/bash
read -p "输入端口[默认为80]: " port
echo "你输入的端口为: ${port:-80}"

[root@tianyun scripts]# ./var2.sh 
输入端口[默认为80]: 21
你输入的端口为: 21
[root@tianyun scripts]# ./var2.sh 
输入端口[默认为80]: 
你输入的端口为: 80
```

```bash
其它方式【额外了解】
[root@tianyun ~]# echo ${var3+aaaa}
[root@tianyun ~]# echo ${var3:+aaaa}

[root@tianyun ~]# echo ${var3=aaaa}
[root@tianyun ~]# echo ${var3:=aaaa}

[root@tianyun ~]# echo ${var3?aaaa}
[root@tianyun ~]# echo ${var3:?aaaa}
```

### 五、i++ 和 ++i （扩展了解）

#### 1、对变量的值的影响

```bash
[root@tianyun ~]# i=1
[root@tianyun ~]# let i++
[root@tianyun ~]# echo $i
2
[root@tianyun ~]# j=1
[root@tianyun ~]# let ++j
[root@tianyun ~]# echo $j
2
```

#### 2、对表达式的值的影响

```bash
[root@tianyun ~]# unset i
[root@tianyun ~]# unset j

[root@tianyun ~]# i=1
[root@tianyun ~]# j=1

[root@tianyun ~]# let x=i++         # 先赋值，再运算
[root@tianyun ~]# let y=++j         # 先运算，再赋值

[root@tianyun ~]# echo $i
2
[root@tianyun ~]# echo $j
2
[root@tianyun ~]# 
[root@tianyun ~]# echo $x
1
[root@tianyun ~]# echo $y
2
```