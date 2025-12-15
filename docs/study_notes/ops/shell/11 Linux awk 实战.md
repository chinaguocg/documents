## 文本处理 awk

### 一、awk简介

```bash
AWK 是一种强大的文本处理工具和编程语言，由 Alfred Aho、Peter Weinberger 和 Brian Kernighan 于 1977 年开发（名字取自三人姓氏的首字母）。它特别适合处理结构化文本数据（如日志、CSV、表格数据），广泛应用于数据提取、格式转换和统计计算。
```

#### 1、awk语法格式

```bash
awk [options] 'commands' filenames
awk [options] -f awk-script-file filenames
```

```bash
# commands分为三个阶段：
BEGIN{}         {}        	END{}
预处理阶段     主处理阶段  	后处理阶段

BEGIN：在处理数据前执行（如设置变量、分隔符）
/模式/ {动作}：对匹配模式的行执行动作（省略模式则处理所有行）
END：在所有数据处理后执行（如输出统计结果）

awk -F: 'BEGIN{print "--------"} {print $7} END{print "--------"}' passwd.txt 
--------
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
--------

# 准备练习环境
head /etc/passwd > passwd.txt

# awk命令格式：
选项	-F  定义输入字段分隔符，默认的分隔符是空格或制表符(tab)
awk 'pattern' filename					示例：awk -F: '/root/' passwd.txt		
awk '{action}' filename					示例：awk -F: '{print $1}' passwd.txt			
awk 'pattern {action}' filename		    示例：awk -F: '/root/{print $1,$3}' passwd.txt		
										示例：awk 'BEGIN{FS=":"} /root/{print $1,$3}' passwd.txt
										
command |awk 'pattern {action}'      	示例：df -P|grep -v 'tmpfs' |grep  '/' |awk '{print $4}'
										示例：df -P|grep -v 'tmpfs' |grep  '/' |awk '$4 > 25000 {print $4}'
```

#### 2、awk工作原理

```bash
# awk -F: '{print $1,$3}' passwd.txt
- awk使用一行作为输入，并将这一行赋给内部变量$0，每一行也可称为一个记录，以换行符结束；
- 然后，行被:（默认为空格或制表符）分解成多个字段（或域），每个字段存储在已编号的变量中，从$1开始，最多达100个字段；
- awk如何知道用空格来分隔字段的呢？ 因为有一个内部变量FS来确定字段分隔符，初始时，FS赋为空格和制表符；
- awk打印字段时，将以设置的方法使用print函数打印，awk在打印的字段间加上空格，因为$1,$3之间有一个逗号。逗号比较特殊，它映射为另一个内部变量，称为输出字段分隔符OFS，OFS默认为空格；
- awk输出之后，将从文件中获取另一行，并将其存储在$0中，覆盖原来的内容，然后将新的字符串分隔成字段并进行处理。该过程将持续到所有行处理完毕。
```

| 内置变量         | 作用                             | 示例                                                         |
| :--------------- | :------------------------------- | :----------------------------------------------------------- |
| **`$0`**         | 当前行的**完整内容**             | `awk -F: '{print $0}' /etc/passwd`                           |
| **`$1,$2...$n`** | 第**1、2、...n** 字段            | `awk -F: '{print $1，$3}' /etc/passwd`                       |
| **`NF`**         | 当前行的**字段数**               | `awk -F: '{print $0,NF}' /etc/passwd`                        |
| **`NR`**         | **行号**（跨文件累加）           | `awk -F: '{print NR,$0}' /etc/passwd /etc/hosts`             |
| **`FNR`**        | **当前文件行号**（文件单独计）   | `awk -F: '{print FNR,$0}' /etc/passwd /etc/hosts`            |
| **`FS`**         | **输入**字段分隔符，默认空格和\t | `awk -F: '{print $1, $3}' /etc/passwd` <br>`awk -F'[ :\t]' '{print $1,$2,$3}' /etc/passwd` <br>`awk 'BEGIN{FS=":"} {print $1,$2,$3}' /etc/passwd` |
| **`OFS`**        | **输出**字段分隔符，默认为空格   | `awk -F: '/root/{print $1,$2,$3}' /etc/passwd`<br>`awk -F: 'BEGIN{OFS="+++"} /^root/{print $1,$2,$3}' /etc/passwd` |

#### 3、格式化输出

```bash
print函数
# date |awk '{print "月份: " $2 "\n年份: " $NF}'
# awk -F: '{print "用户名: " $1 "\t uid: " $3}' passwd.txt
# awk -F: '{print "\t用户和uid: " $1,$3}' passwd.txt

printf函数
# awk -F: '{printf "%-15s %-10s %-15s\n", $1,$2,$3}'  passwd.txt
# awk -F: '{printf "|%-15s|%-10s|%-15s|\n", $1,$2,$3}' passwd.txt

%s 字符类型
%d 数值类型
%f 浮点类型
占15字符
- 表示左对齐，默认是右对齐
printf默认不会在行尾自动换行，加\n

字符串使用" "，例如'{print "yangge"}'
变量不能使用" "，例如'{print "yangge",$2,NF}'
```

### 二、awk模式和动作

​	任何awk语句都由**模式**和**动作**组成。`模式部分决定动作语句何时触发及触发事件`。处理即对数据进行的操作。如果省略模式部分，动作将时刻保持执行状态。模式可以是任何条件语句或复合语句或正则表达式。模式包括两个特殊字段 BEGIN和END。使用BEGIN语句设置计数和打印头。BEGIN语句使用在任何文本浏览动作之前，之后文本浏览动作依据输入文本开始执行。END语句用来在awk完成文本浏览动作后打印输出文本总数和结尾状态。

#### 1、正则表达式

```bash
匹配记录（整行）：匹配操作符（~ !~）
# awk '/^root/'  /etc/passwd
# awk '$0 ~ /^root/'  /etc/passwd

# awk '!/^root/' passwd
# awk '$0 !~ /^root/'  /etc/passwd

匹配字段：匹配操作符（~ !~）
# awk -F: '$1 ~ /^root/'  /etc/passwd
# awk -F: '$NF !~ /bash$/'  /etc/passwd
```

#### 2、比较表达式

比较表达式采用对文本进行比较，只有当条件为真，才执行指定的动作。比较表达式使用关系运算符，用于比较数字与字符串。

| 关系运算符 | 含义       | 示例 |
| ---------- | ---------- | ---- |
| <          | 小于       | x<y  |
| <=         | 小于或等于 | x<=y |
| ==         | 等于       | x==y |
| !=         | 不等于     | x!=y |
| >=         | 大于等于   | x>=y |
| >          | 大于       | x>y  |

```bash
# awk -F: '$3 == 0' /etc/passwd
# awk -F: '$3 < 10' /etc/passwd
# awk -F: '$NF == "/bin/bash"' /etc/passwd
# awk -F: '$1 == "alice"' /etc/passwd
# awk -F: '$1 ~ /alic/ ' /etc/passwd
# awk -F: '$1 !~ /alic/ ' /etc/passwd
# df -P | grep  '/' |awk '$4 > 25000'
```

#### 3、条件表达式

```bash
# awk -F: '$3>300 {print $1,$3}' /etc/passwd
# awk -F: '{ if($3>300) print $1,$3 }' /etc/passwd
# awk -F: '{ if($3>300) {print $1,$3} }' /etc/passwd
# awk -F: '{ if($3>5){print $1,"UID大于5"} else{print $1,"UID小于5"} }' passwd.txt 
```

#### 4、算术运算

```bash
+ - * / %(模) ^(幂2^3)
可以在模式中执行计算，awk都将按浮点数方式执行算术运算

# awk -F: '$3 * 10 > 500' /etc/passwd
# awk -F: '{ if($3*10>500){print $0} }' /etc/passwd
```

#### 5、逻辑操作符

```bash
&&		逻辑与		a && b
||		逻辑或		a || b
!		逻辑非		!a

# awk -F: '$1 ~ /root/ && $3<=15' /etc/passwd
# awk -F: '$1 ~ /root/ || $3<=15' /etc/passwd
# awk -F: '!($1 ~ /root/ || $3<=15)' /etc/passwd
```

#### 6、注意事项

```bash
以下两种结果为什么不一样？
[root@tianyun ~]# awk '$3==0' /etc/passwd
[root@tianyun ~]# awk -F: '$3==0' /etc/passwd
root:x:0:0:root:/root:/bin/bash

[root@yang ~]# cat b.txt 
yang sheng:is a::good boy!
[root@yang ~]# awk '{print NF}' b.txt 
4
[root@yang ~]# awk -F: '{print NF}' b.txt 
4
[root@yang ~]# awk -F"[ :]" '{print NF}' b.txt 
7

--字符串匹配和正则匹配
$3 == 10
$1 == "alice"
$1 ~ /root/
```

### 三、awk脚本编程【提升】

#### 1、条件判断【掌握】

```bash
if语句：
格式
{ if(表达式)｛语句;语句;...｝}
awk -F: '{ if($3==0) {print $1 " 是管理员"} }' /etc/passwd
awk -F: '{ if($3>0 && $3<1000){count++;} }  END{print "系统用户数: " count }' /etc/passwd	　//统计系统用户数

if...else语句:
格式
{ if(表达式)｛语句;语句;...｝else{语句;语句;...} }
awk -F: '{ if($3==0){print $1 " 是管理员"} else{print $1 "不是管理员"} }' /etc/passwd
awk -F: '{ if($3==0){count++} else{i++} }' /etc/passwd
awk -F: '{ if($3==0){count++} else{i++} }  END{ print "管理员个数: "count; print "系统用户数: "i}' /etc/passwd

if...else if...else语句：
格式
{ if(表达式1)｛语句;语句；...｝else if(表达式2)｛语句;语句；...｝else if(表达式3)｛语句;语句；...｝else｛语句;语句；...｝}
awk -F: '{ if($3==0){i++} else if($3>999){k++} else{j++} } END{print i; print k; print j}' /etc/passwd
awk -F: '{ if($3==0){i++} else if($3>999){k++} else{j++} } END{print "管理员个数: "i; print "普通用个数: "k; print "系统用户: "j}' /etc/passwd 
```

#### 2、循环

```bash
while:
[root@tianyun ~]# awk 'BEGIN{ i=1; while(i<=10){print i; i++}  }'
[root@tianyun ~]# awk -F: '{i=1; while(i<=3) {print $0;  i++}}' /etc/passwd	   //将每行打印3次

[root@tianyun ~]# cat b.txt 
111 222
333 444 555
666 777 888 999
[root@tianyun ~]# awk '{i=1; while(i<=NF){print $i; i++}}' b.txt               //分别打印每行的每列
111
222
333
444
555
666
777
888
999
```

```bash
for:
[root@tianyun ~]# awk 'BEGIN{for(i=1;i<=5;i++){print i} }'                       //C风格for
1
2
3
4
5
[root@tianyun ~]# awk -F: '{ for(i=1;i<=10;i++) {print $0} }' /etc/passwd		 //将每行打印10次
[root@tianyun ~]# awk -F: '{ for(i=1;i<=NF;i++) {print $i} }' passwd             //分别打印每行的每列
root
x
0
0
root
/root
/bin/bash
bin
x
1
1
bin
/bin
/sbin/nologin
```

#### 3、数组【掌握】

```bash
1. 统计/etc/passwd中各种类型shell的数量
[root@tianyun ~]# awk -F: '{shells[$NF]++}' /etc/passwd
[root@tianyun ~]# awk -F: '{shells[$NF]++} END{ for(i in shells){print i,shells[i]} }' /etc/passwd

--赋值的过程
shells[/bin/bash]++					5
shells[/sbin/nologin]++				20
shells[/sbin/halt]++				2

问：for(i in shells)中的i是什么？
索引：
/bin/bash
/sbin/nologin
/sbin/halt
.......

2. 统计Nginx访问日志中各类返回码的次数（200，404，500）
[root@tianyun ~]# 
503 10587
400 138
403 845
200 945
404 9846
405 38
501 2
思路：统计谁，就把谁做为索引。例如统计第9列，就把它作为索引code[$9]++

code[$9]++
code[200]++				1
code[200]++				2
code[404]++				1
code[200]++				3
code[503]++				1
code[200]++				4

问：for(i in code)中的i是什么？
索引：
200
404
503

[root@tianyun ~]# awk '{print $9}' api.mobiletrain.org_access.log |sort |uniq -c
    945 200
    138 400
    845 403
   9846 404
     38 405
      2 501
  10587 503
  
3. 统计服务器当前TCP各种连接状态数量
[root@tianyun ~]# netstat -tna |awk '/^tcp/{ code[$6]++ }  END{ for(i in code){print i,code[i]} }'
LISTEN 11
ESTABLISHED 2
FIN_WAIT2 2

[root@tianyun ~]# netstat -tna |awk '/^tcp/{ code[$6]++ }  END{ print "LISTEN: "code["LISTEN"]}'
LISTEN: 11

[root@tianyun ~]# netstat -tna |awk '/^tcp/{print $6}' |sort |uniq -c
      2 ESTABLISHED
      2 FIN_WAIT2
     11 LISTEN
     
4. 统计网站日志文件中访问的每个IP的数量
185.94.29.10 22232
59.83.208.105 10
59.83.208.106 9
59.83.208.108 8
220.196.160.146 7
59.83.208.103 6
180.101.245.251 6

5.计算总流量（第10个字段通常是字节数，在Nginx中是 $7，Apache 中可能是 $7 或 $10）
awk '{sum += $10} END{print "总流量:", sum/1024/1024, "MB"}' nginx_access.log
awk '{sum = sum+$10} END{print "总流量:", sum/1024/1024, "MB"}'  nginx_access.log
总流量: 5.40285 MB
```

#### 4、函数 

```bash
统计用户名为4个字符的用户：
[root@tianyun ~]# awk -F: '$1~/^....$/{count++; print $1} END{print "4个字母的用户数: " count}' /etc/passwd
root
sync
halt
mail
news
uucp
nscd
vcsa
pcap
sshd
dbus
jack
4个字母的用户数: 12

[root@tianyun ~]#  awk -F: 'length($1)==4{count++; print $1} END{print "4个字母的用户数: "count}' /etc/passwd
root
sync
halt
mail
news
uucp
nscd
vcsa
pcap
sshd
dbus
jack
4个字母的用户数: 12
```

### 四、练习及作业

#### 1、awk练习

```bash
1. 统计/etc/passwd中各种类型shell的数量
[root@tianyun ~]# awk -F: '{shells[$NF]++} END{ for(i in shells){print i,shells[i]} }' /etc/passwd

２. 网站访问状态统计　<当前时实状态 netstat> 
[root@tianyun ~]# netstat -ant |grep :80 |awk '{access_stat[$NF]++} END{for(i in access_stat ){print i,access_stat[i]}}'
TIME_WAIT 1064
ESTABLISHED 1
LISTEN 1
[root@tianyun ~]# netstat -ant |grep :80 |awk '{access_stat[$NF]++} END{for(i in access_stat ){print i,access_stat[i]}}' |sort -k2 -n |head

[root@tianyun ~]# ss -an |grep :80 |awk '{access_stat[$2]++} END{for(i in access_stat){print i,access_stat[i]}}'
LISTEN 1
ESTAB 5
TIME-WAIT 97

[root@tianyun ~]# ss -an |grep :80 |awk '{access_stat[$2]++} END{for(i in access_stat){print i,access_stat[i]}}' |sort -k2 -rn
TIME-WAIT 18
ESTAB 8
LISTEN 1

3. 统计当前访问的每个IP的数量 <当前时实状态 netstat,ss>
[root@tianyun ~]# netstat -ant |grep :80 |awk -F: '{ip_count[$8]++} END{for(i in ip_count){print i,ip_count[i]} }' |sort
172.16.130.16 289
172.16.130.33 254
172.16.130.44 158
172.16.130.99 4

[root@tianyun ~]# ss -an |grep :80 |awk -F":" '!/LISTEN/{ip_count[$(NF-1)]++} END{for(i in ip_count){print i,ip_count[i]}}' |sort -k2 -rn |head
172.16.160.77 59
172.16.160.221 16
172.16.160.17 11
172.16.160.69 8
172.16.160.51 7
172.16.160.49 7
172.16.160.13 7
172.16.160.153 3
172.16.160.79 2
172.16.160.52 2

4. 统计Apache/Nginx日志中某一天的PV量 　<统计日志>
[root@tianyun log]# grep '22/Mar/2017' cd.mobiletrain.org.log |wc -l
1646

5. 统计Apache/Nginx日志中某一天不同IP的访问量　<统计日志>
[root@tianyun nginx_log]# grep '07/Aug/2012' access.log |awk '{ips[$1]++} END{for(i in ips){print i,ips[i]} }' |sort -k2 -rn |head
222.130.129.42 5761
123.126.51.94 988
123.126.68.22 588
123.114.46.141 418
61.135.249.218 368
110.75.173.162 330
110.75.173.163 327
110.75.173.161 321
110.75.173.160 319
110.75.173.164 314

[root@tianyun nginx_log]# grep '07/Aug/2012' access.log |awk '{ips[$1]++} END{for(i in ips){print i,ips[i]} }' |awk '$2>100' |sort -k2 -rn
222.130.129.42 5761
123.126.51.94 988
123.126.68.22 588
123.114.46.141 418
61.135.249.218 368
110.75.173.162 330
110.75.173.163 327
110.75.173.161 321
110.75.173.160 319
110.75.173.164 314
1.202.218.67 313
110.75.173.159 311
203.208.60.80 294
221.221.207.202 266
203.208.60.82 230
203.208.60.81 209
38.111.147.83 206
61.135.249.220 187
183.39.187.86 178
61.156.142.207 129

[root@tianyun log]# awk '/22\/Mar\/2017/{ips[$1]++} END{for(i in ips){print i,ips[i]}}' sz.mobiletrain.org.log |awk '$2>100' |sort -k2 -rn|head180.153.93.44 1327
119.147.33.19 551
119.147.33.26 234
119.147.33.22 216
119.147.33.21 214
101.69.121.35 209
183.214.128.174 193
175.6.26.173 178
27.221.28.174 167
121.29.54.11 161

[root@tianyun log]# awk '/22\/Mar\/2017/{ips[$1]++} END{for(i in ips){if(ips[i]>100){print i,ips[i]}}}' sz.mobiletrain.org.log|sort -k2 -rn|head
180.153.93.44 1327
119.147.33.19 551
119.147.33.26 234
119.147.33.22 216
119.147.33.21 214
101.69.121.35 209
183.214.128.174 193
175.6.26.173 178
27.221.28.174 167
121.29.54.11 161

思路：将需要统计的内容（某一个字段）作为数组的索引 ++
```

#### 2、awk作业

```
1. 取得网卡IP（除ipv6以外的所有IP）
2. 获得内存使用情况
3. 获得磁盘使用情况
4. 清空本机的ARP缓存
5. 打印出/etc/hosts文件的最后一个字段（按空格分隔）
6. 打印指定目录下的目录名
```



