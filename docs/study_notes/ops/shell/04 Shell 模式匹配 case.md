## **Shell `case` 语句**

`case` 是 Shell 脚本中用于 **多条件分支匹配** 的控制结构，比 `if-elif-elif-else` 更简洁，适用于模式匹配（如字符串、数字、通配符等）。  

---

### **1. `case` 基本语法**
```bash
case "$变量" in
    模式1)
        命令1
        ;;
    模式2)
        命令2
        ;;
    *)
        命令N
        ;;
esac
```
```bash
[root@tianyun ~]# vim grade_check_case.sh
#!/bin/bash

# 提示用户输入成绩

# 检查输入是否为数字

# 使用 case 判断成绩等级
case $score in
    9[0-9]|100)   # 90-100
        echo "成绩等级：A（优秀）"
        ;;
    8[0-9])       # 80-89
        echo "成绩等级：B（良好）"
        ;;
    7[0-9])       # 70-79
        echo "成绩等级：C（中等）"
        ;;
    6[0-9])       # 60-69
        echo "成绩等级：D（及格）"
        ;;
    [0-9]|[1-5][0-9])  # 0-59
        echo "成绩等级：F（不及格）"
        ;;
    *)            # 无效输入
        echo "错误：成绩必须在 0-100 之间！"
        ;;
esac
```

### **2. 模式匹配规则**
| 模式    | 说明                          |
| ------- | ----------------------------- |
| `abc`   | 精确匹配字符串 `abc`          |
| `yes|y` | 匹配 `yes` 或 `y`（`|` 分隔） |
| `[0-9]` | 匹配单个数字                  |
| `*`     | 匹配任意字符                  |

### **3. 运维实战案例**
#### **案例 1：根据服务名管理服务**
```bash
[root@tianyun ~]# vim manage_services.sh

思路提示：
1. 要管理的服务名，通过位置变量$1传给脚本中的service变量
2. 服务名如果是sshd，提示：管理SSH服务: $service，查看服务的状态
3. 服务名如果是nginx或httpd，提示：管理Web服务: $service，查看服务的状态
4. 服务名如果是mysqld或mariadb，提示：管理数据库服务: $service，查看服务的状态
5. 其它服务，提示：未知服务: $service

运行方法：
[root@tianyun ~]# ./manage_services.sh nginx   # 管理Web服务
[root@tianyun ~]# ./manage_services.sh mysqld  # 管理数据库服务
```
```
[root@haoha ~]# cat manage_services.sh 
#!/bin/bash

service=$1
case $service in
	sshd)
		echo "manager ssh $service"
		systemctl status $service;;
	nginx|httpd)
		echo "manager web $service"
		systemctl status $service;;
	*)
		echo "i don't know $service";;
esac
[root@haoha ~]# 

```



#### **案例 2：系统工具箱（交互式菜单）**

```bash
[root@tianyun ~]# vim sys_toolkit.sh

运行效果：
1. 检查磁盘空间
2. 检查内存使用
3. 检查网络连接
请选择操作 (1-3): 

提示思路：
1. 输出一个菜单，让用户选择
2. read读入用户选择赋值给相应的变量choice
3. 通过case模式匹配变量choice，实现对应的操作
4. 如果用户输入的不是1-3，提示输出错误
```

```bash
[root@haoha ~]# cat sys_toolkit.sh
#!/bin/bash

echo "1. 检查磁盘空间
2. 检查内存使用
3. 检查网络连接"

read -p "请选择操作 (1-3): " choice

case $choice in
	1)
	df -h;;
	2)
	free -h;;
	3)
	ping -c1 -W1 www.baidu.com;;
	*)
	echo "error!";;
esac
[root@haoha ~]# 
```



#### **案例 3：根据操作系统类型安装软件**

```bash
[root@tianyun ~]# vim install_nginx_case.sh
#!/bin/bash
# 脚本名称: install_nginx_case.sh
# 功能: 自动检测系统类型并安装Nginx
# 使用方法: sudo ./install_nginx_case.sh

提示思路：
1. 检查安装权限，提示使用root或sudo运行
2. 检测系统类型，将类型赋值给OS_TYPE变量（centos,ubuntu,other）
3. 使用case语句，根据OS_TYPE变量的值选择安装方式
4. 不支持的操作系统给出错误提示
5. 验证安装结果[可选]
if which nginx &>/dev/null; then
    echo
    echo "Nginx安装成功！"
    echo "Nginx版本信息：$(nginx -v 2>&1 | awk -F"/" '{print $2}')"
    echo "服务状态:"
    systemctl status nginx | grep -E "Active:|Loaded:"
    echo "请通过浏览器访问服务器IP验证Nginx是否正常运行"
else
    echo "Nginx安装失败"
fi
```



```bash
[root@haoha ~]# cat install_nginx_case.sh
#!/bin/bash

# is root
if [ $UID -ne 0  ];then
	echo "Please use root or sudo"
fi


# system version
OS_TYPE=""
cat /etc/redhat-release &>/dev/null;
isred=$?
cat /etc/lsb-release &>/dev/null;
isuban=$?
if [ $isred -eq 0  ];then
	OS_TYPE="centos"
elif [ $isuban -eq 0  ];then
	OS_TYPE="ubuntu"
else
	OS_TYPE="other"
fi

# install nginx by system
case $OS_TYPE in
	centos)
		yum install nginx;;
	ubuntu)
		apt install nginx;;
	*)
		echo "Your system version don't no install"
		exit;;
esac

# nginx install success fail
if which nginx &>/dev/null; then
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

[root@haoha ~]# ./install_nginx_case.sh
Loaded plugins: fastestmirror
Loading mirror speeds from cached hostfile
Package 1:nginx-1.20.1-10.el7.x86_64 already installed and latest version
Nothing to do

Nginx安装成功！
Nginx版本信息：1.20.1
Nginx服务状态：
   Loaded: loaded (/usr/lib/systemd/system/nginx.service; enabled; vendor preset: disabled)
   Active: active (running) since Tue 2025-12-09 02:50:45 EST; 6h ago
可以通过浏览器访问服务器IP地址来验证Nginx是否正常运行
[root@haoha ~]# 

```

