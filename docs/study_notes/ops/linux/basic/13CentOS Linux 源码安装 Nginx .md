# CentOS 源码安装 Nginx

:tada: 2025-11-13 :tada:

### 一、准备工作

#### 1. 准备相对干净环境

```shell
建议恢复到干净的系统，并使用脚本完成初始化
- 配置yum源，包括EPEL
- 停止并禁用防火墙
- 安装基础软件包

[tianyun@yangge ~]$ rz
[tianyun@yangge ~]$ chmod +x init.sh 
[tianyun@yangge ~]$ sudo ./init.sh 
```

#### 2. 安装基础编译工具

```bash
[tianyun@yangge ~]$ yum grouplist								#查看系统提供的软件包组
Loaded plugins: fastestmirror, langpacks
There is no installed groups file.
Maybe run: yum groups mark convert (see man yum)
Loading mirror speeds from cached hostfile
 * base: mirrors.aliyun.com
 * extras: mirrors.aliyun.com
 * updates: mirrors.aliyun.com
Available Environment Groups:									# 可用的环境组【都未安装】			
   Minimal Install
   Virtualization Host
   Server with GUI
   GNOME Desktop

Available Groups:												# 可用的组【都未安装】
   Cinnamon
   Compatibility Libraries
   Console Internet Tools
   Development Tools											# 开发工具组（库文件，编译工具）
   Educational Software

[tianyun@yangge ~]$ sudo yum install -y "@Development Tools"	#@表示后面是一个软件包组，开发工具组

# 安装Development Tools组之后：
[tianyun@yangge ~]$ yum grouplist
Loaded plugins: fastestmirror, langpacks
Loading mirror speeds from cached hostfile
 * base: mirrors.aliyun.com
 * extras: mirrors.aliyun.com
 * updates: mirrors.aliyun.com
Available Environment Groups:
   Minimal Install
   MATE Desktop
   Basic Web Server
Installed Groups:					#Installed Groups表示已安装的组
   Development Tools
Available Groups:
   Cinnamon
   Compatibility Libraries
```

#### 3. 安装Nginx依赖库

```bash
[tianyun@yangge ~]$ sudo yum install -y pcre-devel zlib-devel openssl-devel
```

### 二、下载Nginx源代码

#### 1. Nginx官网获取最新链接

```bash
https://nginx.org/
```

#### 2. 下载并解压源代码

```bash
[tianyun@yangge ~]$ wget https://nginx.org/download/nginx-1.28.0.tar.gz		#下载软件包
[tianyun@yangge ~]$ tar -xf nginx-1.28.0.tar.gz								#解压软件包
[tianyun@yangge ~]$ cd nginx-1.28.0/

[tianyun@yangge nginx-1.28.0] ls
auto     CHANGES.ru          conf       contrib          html     man        SECURITY.md
CHANGES  CODE_OF_CONDUCT.md  configure  CONTRIBUTING.md  LICENSE  README.md  src
```

### 三、编译及安装

#### 1. 配置

```bash
[tianyun@yangge ~]$ sudo ./configure \
 --prefix=/usr/local/nginx \
 --user=nginx \
 --sbin-path=/usr/local/nginx/sbin/nginx \
 --conf-path=/etc/nginx/nginx.conf \
 --error-log-path=/var/log/nginx/error.log \
 --with-http_stub_status_module \
 --with-http_ssl_module \
 --with-http_gzip_static_module \
 --with-pcre \
 --with-http_realip_module \
 --with-stream 
 
 Configuration summary
  + using system PCRE library
  + using system OpenSSL library
  + using system zlib library

  nginx path prefix: "/usr/local/nginx"
  nginx binary file: "/usr/local/nginx/sbin/nginx"
  nginx modules path: "/usr/local/nginx/modules"
  nginx configuration prefix: "/etc/nginx"
  nginx configuration file: "/etc/nginx/nginx.conf"
  nginx pid file: "/usr/local/nginx/logs/nginx.pid"
  nginx error log file: "/var/log/nginx/error.log"
  nginx http access log file: "/usr/local/nginx/logs/access.log"
  nginx http client request body temporary files: "client_body_temp"
  nginx http proxy temporary files: "proxy_temp"
  nginx http fastcgi temporary files: "fastcgi_temp"
  nginx http uwsgi temporary files: "uwsgi_temp"
  nginx http scgi temporary files: "scgi_temp"
```

#### 2. 编译

```bash
[tianyun@yangge nginx-1.28.0]$ sudo make
```

#### 3. 安装

```bash
[tianyun@yangge nginx-1.28.0]$ sudo make install
[tianyun@yangge nginx-1.28.0]$ cd
```

### 四、启动Nginx

#### 1. 创建Nginx用户

```bash
[tianyun@yangge ~]$ sudo useradd -r -s /sbin/nologin nginx		# -r 系统用户，UID默认为小于1000
```

#### 2. 启动Nginx服务

```bash
[tianyun@yangge ~]$ sudo /usr/local/nginx/sbin/nginx
```

#### 3. 从浏览器访问Nginx

<div style="background: #f0f0f0; padding: 10px;">
<h1>Welcome to nginx!</h1>
<p>If you see this page, the nginx web server is successfully installed and working. Further configuration is required.</p>
<p>For online documentation and support please refer to<a href="http://nginx.org/">nginx.org</a>.<br/>
Commercial support is available at<a href="http://nginx.com/">nginx.com</a>.</p>
<p><em>Thank you for using nginx.</em></p>
</div>
#### 4. 停止Nginx服务

```bash
[tianyun@yangge ~]$ sudo /usr/local/nginx/sbin/nginx -s stop
```

### 五、配置系统服务【扩展】

#### 1. 创建systemd服务文件

```bash
[tianyun@yangge ~]$ sudo vim /etc/systemd/system/nginx.service
```

```ini
[Unit]
Description=nginx
After=network.target
 
[Service]
Type=forking
ExecStart=/usr/local/nginx/sbin/nginx -c /etc/nginx/nginx.conf
ExecReload=/usr/local/nginx/sbin/nginx -s reload
ExecStop=/usr/local/nginx/sbin/nginx -s  stop 
PrivateTmp=true
                                                                             
[Install]
WantedBy=multi-user.target
```

#### 2. 重新加载systemd配置

```bash
[tianyun@yangge ~]$ sudo systemctl daemon-reload
```

#### 3. 启动-重启-停止

```bash
[tianyun@yangge ~]$ sudo systemctl start nginx				# 启动nginx
[tianyun@yangge ~]$ sudo systemctl enable nginx				# 设置为开机自动启动

[tianyun@yangge ~]$ sudo systemctl reload nginx				# 重新加载（非重启）
[tianyun@yangge ~]$ sudo systemctl stop nginx				# 停止nginx

[tianyun@yangge ~]$ systemctl status nginx					# 查看nginx服务状态
● nginx.service - nginx
   Loaded: loaded (/etc/systemd/system/nginx.service; disabled; vendor preset: disabled)
   Active: active (running) since Wed 2025-07-23 16:40:50 CST; 1min 25s ago
  Process: 18396 ExecStart=/usr/local/nginx/sbin/nginx -c /etc/nginx/nginx.conf (code=exited, status=0/SUCCESS)
 Main PID: 18398 (nginx)
    Tasks: 2
   CGroup: /system.slice/nginx.service
           ├─18398 nginx: master process /usr/local/nginx/sbin/nginx -c /etc/nginx/nginx.conf
           └─18399 nginx: worker process

Jul 23 16:40:50 yangge systemd[1]: Starting nginx...
Jul 23 16:40:50 yangge systemd[1]: Started nginx.
```

###  六、一键安装Nginx【预览】

#### 1. 编写脚本

```bash
[root@yangge ~]# vim nginx_install.sh
#!/bin/bash

# 安装开发工具软件包组
yum install -y "@Development Tools"

# 安装Nginx依赖库
yum install -y pcre-devel zlib-devel openssl-devel

# 下载Nginx软件包
wget https://nginx.org/download/nginx-1.28.0.tar.gz
tar -xf nginx-1.28.0.tar.gz	
cd nginx-1.28.0/

# 安装Nginx
./configure \
 --prefix=/usr/local/nginx \
 --user=nginx \
 --sbin-path=/usr/local/nginx/sbin/nginx \
 --conf-path=/etc/nginx/nginx.conf \
 --error-log-path=/var/log/nginx/error.log \
 --with-http_stub_status_module \
 --with-http_ssl_module \
 --with-http_gzip_static_module \
 --with-pcre --with-http_realip_module \
 --with-stream

make
make install

# 创建Nginx用户
useradd -r -s /sbin/nologin nginx

cat >/etc/systemd/system/nginx.service <<EOF
[Unit]
Description=nginx
After=network.target
 
[Service]
Type=forking
ExecStart=/usr/local/nginx/sbin/nginx -c /etc/nginx/nginx.conf
ExecReload=/usr/local/nginx/sbin/nginx -s reload
ExecStop=/usr/local/nginx/sbin/nginx -s  stop 
PrivateTmp=true
                                                                             
[Install]
WantedBy=multi-user.target
EOF

# 重新加载systemd配置
systemctl daemon-reload

# Nginx启动&开机自动启动
systemctl start nginx				
systemctl enable nginx

echo "Nginx install finish......."
```

#### 2. 新环境运行脚本

```bash
以root用户运行：
[root@yangge ~]# ls -l *.sh
-rwxrwxrwx. 1 root root  575 Jul 23 14:54 init.sh
-rwxrwxrwx. 1 root root 1289 Jul 23 17:11 nginx_install.sh

[root@yangge ~]# ./init.sh
[root@yangge ~]# ./nginx_install.sh
```

