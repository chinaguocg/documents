# WEB服务器

## Nginx服务搭建与配置【初识篇】

​	**Nginx是一款轻量级的Web 服务器/反向代理服务器及电子邮件（IMAP/POP3）代理服务器**，由俄罗斯的程序设计师Igor Sysoev所开发，其特点是占有内存少，并发能力强。事实上nginx的并发能力确实在同类型的网页服务器中表现较好。

### 一、Nginx安装

#### 1、安装Nginx

```shell
# 初始化流程
0. 重新初始化
1. 防火墙默认关闭
2. SELinux默认关闭
3. 软件安装源已配置
4. 域名解析已完成【tianyun.pw,yangge.cyou ------> 云服务器的公网IP】

[root@tianyun ~]# yum list nginx
Loaded plugins: fastestmirror
Loading mirror speeds from cached hostfile
Available Packages
nginx.x86_64                     1:1.20.1-10.el7                epel

- 使用Nginx官网提供的源安装【较新】
https://nginx.org/ ----> documentation ----> Installing nginx ----> Installation on Linux( packages) ----> RHEL and derivatives

[root@tianyun ~]# vim /etc/yum.repos.d/nginx.repo
[nginx-stable]
name=nginx stable repo
baseurl=http://nginx.org/packages/centos/$releasever/$basearch/
gpgcheck=1
enabled=1
gpgkey=https://nginx.org/keys/nginx_signing.key
module_hotfixes=true

[nginx-mainline]
name=nginx mainline repo
baseurl=http://nginx.org/packages/mainline/centos/$releasever/$basearch/
gpgcheck=1
enabled=0
gpgkey=https://nginx.org/keys/nginx_signing.key
module_hotfixes=true

[root@tianyun ~]# yum list nginx
Loaded plugins: fastestmirror
Loading mirror speeds from cached hostfile
Available Packages
nginx.x86_64                    1:1.26.1-2.el7.ngx            nginx-stable

[root@tianyun ~]# yum -y install nginx
[root@tianyun ~]# systemctl --now enable nginx
Created symlink from /etc/systemd/system/multi-user.target.wants/nginx.service to /usr/lib/systemd/system/nginx.service.

[root@tianyun ~]# netstat -tnlp
Active Internet connections (only servers)
Proto Recv-Q Send-Q Local Address           Foreign Address         State       PID/Program name    
tcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN      1042/sshd           
tcp        0      0 127.0.0.1:25            0.0.0.0:*               LISTEN      995/master          
tcp        0      0 0.0.0.0:111             0.0.0.0:*               LISTEN      547/rpcbind         
tcp        0      0 0.0.0.0:80              0.0.0.0:*               LISTEN      11790/nginx: master 
tcp6       0      0 :::22                   :::*                    LISTEN      1042/sshd           
tcp6       0      0 ::1:25                  :::*                    LISTEN      995/master          
tcp6       0      0 :::111                  :::*                    LISTEN      547/rpcbind 

从客户端浏览器通过IP或域名访问测试
提示：注意阿里云的安全组是否放行了80/tcp
```

#### 2、Nginx目录介绍

```bash
Nginx的工作目录(基准目录)：
[root@tianyun ~]# ls /etc/nginx/
conf.d  fastcgi_params  mime.types  modules  nginx.conf  scgi_params  uwsgi_params

nginx.conf   	主配置文件
conf.d 			存储配置子文件,配置多个网站
```

#### 3、Nginx配置文件

```shell
以下仅查看：
[root@tianyun ~]# vim /etc/nginx/nginx.conf
user  nginx;
worker_processes  auto;

error_log  /var/log/nginx/error.log notice;
pid        /var/run/nginx.pid;


events {
    worker_connections  1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    access_log  /var/log/nginx/access.log  main;

    sendfile        on;
    #tcp_nopush     on;

    keepalive_timeout  65;

    #gzip  on;

    include /etc/nginx/conf.d/*.conf;				# 包含该目录下*.conf文件
}

[root@tianyun ~]# egrep '^[ ]*#|^$' -v /etc/nginx/conf.d/default.conf 	# [ ]* 零到多个空格式
server {
    listen       80;
    server_name  localhost;
    location / {
        root   /usr/share/nginx/html;				# 网站的默认主目录
        index  index.html index.htm;				# 网站的默认主页
    }
    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
        root   /usr/share/nginx/html;
    }
}
```

### 二、Nginx虚拟主机

```
虚拟主机：一台网站服务器上同时部署多个网站

三种技术：
1. 基于域名（多个域名使用 同1个IP, 同一个端口例如80, 前提需要备案）
2. 基于端口（每个网站使用 同1个IP, 不同的端口例如web1【81】,web2【82】）
3. 基于IP（每个网站使用  不同的IP，同一个端口例如80）

一个虚拟主机，一个独立的配置文件
```

#### 1、基于域名【推荐】

| 网站名     | 域名          | IP              | 端口 | 主目录                 | 配置文件                         |
| ---------- | ------------- | --------------- | ---- | ---------------------- | -------------------------------- |
| `天云`     | `tianyun.pw`  | `8.130.210.133` | `80` | `/webdata/tianyun.pw`  | `/etc/nginx/conf.d/tianyun.conf` |
| `杨哥`     | `yangge.cyou` | `8.130.210.133` | `80` | `/webdata/yangge.cyou` | `/etc/nginx/conf.d/yangge.conf`  |
| `坦克大战` | `tanke.com`   | `8.130.210.133` | `80` | `/webdata/tanke.com`   | `/etc/nginx/conf.d/tanke.conf`   |

`注：使用域名访问，需要已备案`

**第一个网站**

```bash
[root@web-01 ~]# ping www.tianyun.pw
PING www.tianyun.pw (8.130.210.133) 56(84) bytes of data.
64 bytes from 8.130.210.133 (8.130.210.133): icmp_seq=1 ttl=64 time=1.51 ms

[root@web-01 ~]# ping tianyun.pw
PING tianyun.pw (8.130.210.133) 56(84) bytes of data.
64 bytes from 8.130.210.133 (8.130.210.133): icmp_seq=1 ttl=64 time=1.43 ms

# 第一步：准备网站的代码
[root@tianyun ~]# mkdir -p /webdata/tianyun.pw				# 准备网站tianyun的主目录
[root@tianyun ~]# rz										# 替换为真实的网站代码

# 第二步：虚拟主机配置文件
[root@tianyun ~]# cd /etc/nginx/conf.d/
[root@tianyun conf.d]# cp default.conf tianyun.pw.conf		# 创建tianyun.pw网站的配置文件
[root@tianyun conf.d]# vim tianyun.pw.conf
server {
    listen       80;										# 监听的端口
    server_name  www.tianyun.pw tianyun.pw;					# 域名
    access_log  /var/log/nginx/tianyun.pw_access.log  main;	# 访问日志
    
    location / {
        root   /webdata/tianyun.pw;							# 网站主目录
        index  index.html;									# 网站默认主页
    }
}

[root@tianyun ~]# systemctl reload nginx

阿里云防火墙（安全组）：放行80/tcp端口
从客户端测试
```

**第二个网站**

```bash
[root@web-01 ~]# ping yangge.cyou
PING yangge.cyou (8.130.210.133) 56(84) bytes of data.
64 bytes from 8.130.210.133 (8.130.210.133): icmp_seq=1 ttl=64 time=1.50 ms

[root@web-01 ~]# ping www.yangge.cyou
PING www.yangge.cyou (8.130.210.133) 56(84) bytes of data.
64 bytes from 8.130.210.133 (8.130.210.133): icmp_seq=1 ttl=64 time=1.44 ms

# 第一步：准备网站的代码
[root@tianyun ~]# mkdir -p /webdata/yangge.cyou				# 准备每个网站的主目录
[root@tianyun ~]# rz										# 上传网站代码

# 第二步：虚拟主机配置文件
[root@tianyun ~]# cd /etc/nginx/conf.d/
[root@tianyun conf.d]# cp tianyun.pw.conf yangge.cyou.conf	# 创建yangge.cyou网站的配置文件
[root@tianyun conf.d]# vim yangge.cyou.conf
server {
    listen       80;
    server_name  www.yangge.cyou yangge.cyou;
    access_log  /var/log/nginx/yangge.cyou_access.log  main;

    location / {
        root   /webdata/yangge.cyou;						# 网站的主目录
        index  index.html;
    }
}

[root@tianyun ~]# systemctl reload nginx

阿里云防火墙（安全组）：放行80/tcp端口
从客户端测试

- 也可以使用sed非交互式的修改
[root@web-01 conf.d]# sed -i 's/tianyun.pw/yangge.cyou/g' yangge.cyou.conf
```

#### 2、基于端口【不建议】

| 网站名     | 域名          | IP              | 端口 | 主目录             | 配置文件                         |
| ---------- | ------------- | --------------- | ---- | ------------------ | -------------------------------- |
| `天云`     | `tianyun.pw`  | `8.130.210.133` | `81` | `/webdata/tianyun` | `/etc/nginx/conf.d/tianyun.conf` |
| `杨哥`     | `yangge.cyou` | `8.130.210.133` | `82` | `/webdata/yangge`  | `/etc/nginx/conf.d/yangge.conf`  |
| `坦克大战` | `tanke.com`   | `8.130.210.133` | `83` | `/webdata/tanke`   | `/etc/nginx/conf.d/tanke.conf`   |

`注：可以使用 IP:端口 的方式访问；如果没有域名解析也是可以的`

**第一个网站**

```shell
# 第一步：准备网站的代码
[root@tianyun ~]# mkdir -p /webdata/tianyun.pw				# 准备网站tianyun的主目录
[root@tianyun ~]# rz										# 替换为真实的网站代码

# 第二步：虚拟主机配置文件
[root@tianyun ~]# cd /etc/nginx/conf.d/
[root@tianyun conf.d]# cp default.conf tianyun.pw.conf		# 创建tianyun.pw网站的配置文件
[root@tianyun conf.d]# vim tianyun.pw.conf
server {
    listen       81;										# 监听的端口【81】
    server_name  www.tianyun.pw tianyun.pw;					# 域名
    access_log  /var/log/nginx/tianyun.pw_access.log  main;	# 访问日志
    
    location / {
        root   /webdata/tianyun.pw;							# 网站主目录
        index  index.html;									# 网站默认主页
    }
}

[root@tianyun ~]# systemctl reload nginx

阿里云防火墙（安全组）：放行80/tcp端口
从客户端测试

[root@tianyun ~]# systemctl reload nginx
[root@tianyun ~]# netstat -tnlp
Active Internet connections (only servers)
Proto Recv-Q Send-Q Local Address           Foreign Address         State       PID/Program name    
tcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN      1042/sshd           
tcp        0      0 127.0.0.1:25            0.0.0.0:*               LISTEN      995/master          
tcp        0      0 0.0.0.0:111             0.0.0.0:*               LISTEN      547/rpcbind         
tcp        0      0 0.0.0.0:80              0.0.0.0:*               LISTEN      11790/nginx: master 
tcp        0      0 0.0.0.0:81              0.0.0.0:*               LISTEN      11790/nginx: master 
tcp6       0      0 :::22                   :::*                    LISTEN      1042/sshd           
tcp6       0      0 ::1:25                  :::*                    LISTEN      995/master          
tcp6       0      0 :::111                  :::*                    LISTEN      547/rpcbind  

阿里云防火墙（安全组）：放行81/tcp端口
从客户端测试
```

**第二个网站**

```bash
# 第一步：准备网站的代码
[root@tianyun ~]# mkdir -p /webdata/yangge.cyou				# 准备网站的主目录
[root@tianyun ~]# rz										# 上传网站代码

# 第二步：虚拟主机配置文件
[root@tianyun ~]# cd /etc/nginx/conf.d/
[root@tianyun conf.d]# cp tianyun.pw.conf yangge.cyou.conf	# 创建yangge.cyou网站的配置文件
[root@tianyun conf.d]# vim yangge.cyou.conf
server {
    listen       82;										# 监听端口【82】
    server_name  www.yangge.cyou yangge.cyou;
    access_log  /var/log/nginx/yangge.cyou_access.log  main;

    location / {
        root   /webdata/yangge.cyou;						# 网站的主目录
        index  index.html;
    }
}

[root@tianyun ~]# systemctl reload nginx
[root@tianyun ~]# netstat -tnlp
Active Internet connections (only servers)
Proto Recv-Q Send-Q Local Address           Foreign Address         State       PID/Program name    
tcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN      1042/sshd           
tcp        0      0 127.0.0.1:25            0.0.0.0:*               LISTEN      995/master          
tcp        0      0 0.0.0.0:111             0.0.0.0:*               LISTEN      547/rpcbind         
tcp        0      0 0.0.0.0:81              0.0.0.0:*               LISTEN      11790/nginx: master 
tcp        0      0 0.0.0.0:82              0.0.0.0:*               LISTEN      11790/nginx: master 
tcp6       0      0 :::22                   :::*                    LISTEN      1042/sshd           
tcp6       0      0 ::1:25                  :::*                    LISTEN      995/master          
tcp6       0      0 :::111                  :::*                    LISTEN      547/rpcbind 

阿里云防火墙（安全组）：放行82/tcp端口
从客户端测试
```

#### 3、基于IP【不建议】

| 网站名     | 域名          | IP              | 端口 | 主目录                 | 配置文件                         |
| ---------- | ------------- | --------------- | ---- | ---------------------- | -------------------------------- |
| `天云`     | `tianyun.pw`  | `8.130.210.133` | `80` | `/webdata/tianyun.pw`  | `/etc/nginx/conf.d/tianyun.conf` |
| `杨哥`     | `yangge.cyou` | `8.130.210.134` | `80` | `/webdata/yangge.cyou` | `/etc/nginx/conf.d/yangge.conf`  |
| `坦克大战` | `tanke.com`   | `8.130.210.135` | `80` | `/webdata/tanke.com`   | `/etc/nginx/conf.d/tanke.conf`   |

`根据网站的数量，额外购买公有IP`

**第一个网站**

```bash
公网IP 8.130.210.133 ---->  私有IP 172.29.111.173
公网IP 8.130.210.134 ---->  私有IP 172.29.111.174

[root@web-01 conf.d]# ip a
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
       valid_lft forever preferred_lft forever
    inet6 ::1/128 scope host 
       valid_lft forever preferred_lft forever
2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc pfifo_fast state UP group default qlen 1000
    link/ether 00:16:3e:04:1b:98 brd ff:ff:ff:ff:ff:ff
    inet 172.29.111.173/20 brd 172.29.111.255 scope global dynamic eth0
       valid_lft 1892074354sec preferred_lft 1892074354sec
    inet6 fe80::216:3eff:fe04:1b98/64 scope link 
       valid_lft forever preferred_lft forever
```

```shell
[root@tianyun conf.d]# vim tianyun.pw.conf
server {
    listen       172.29.111.173:80;							# 监听的端口
    server_name  www.tianyun.pw tianyun.pw;					# 域名
    access_log  /var/log/nginx/tianyun.pw_access.log  main;	# 访问日志
    
    location / {
        root   /webdata/tianyun.pw;							# 网站主目录
        index  index.html;									# 网站默认主页
    }
}

[root@web-01 ~]# netstat -tnlp
Active Internet connections (only servers)
Proto Recv-Q Send-Q Local Address           Foreign Address         State       PID/Program name    
tcp        0      0 0.0.0.0:111             0.0.0.0:*               LISTEN      541/rpcbind         
tcp        0      0 172.29.111.173:80       0.0.0.0:*               LISTEN      14306/nginx: master 
tcp        0      0 0.0.0.0:82              0.0.0.0:*               LISTEN      14306/nginx: master 
```

**第二个网站**

```bash
[root@tianyun conf.d]# vim yangge.cyou.conf
server {
    listen       172.29.111.174:80;							# 监听端口【80】
    server_name  www.yangge.cyou yangge.cyou;
    access_log  /var/log/nginx/yangge.cyou_access.log  main;

    location / {
        root   /webdata/yangge.cyou;						# 网站的主目录
        index  index.html;
    }
}
```

### 三、生产环境中的实际应用

```bash
网站不仅是静态元素: .html .css .js .img
动态元素（程序代码）: .php .jsp .py

- 组合：web server + 中间件 + 数据库
LNMP (Linux + Nginx + MySQL/Mariadb + PHP)  				# php-fpm进程，这个组合是公司用的最多的组合
LAMP (Linux + Apache + MySQL/Mariadb + PHP) 
Linux + Nginx + MySQL/Mariadb + Tomcat   					# java项目常用的组合
```



### 四、反向代理 vs 正向代理

| 类型     | 核心作用                 | 代理对象       | 典型场景                 |
| -------- | ------------------------ | -------------- | ------------------------ |
| 反向代理 | 隐藏后端服务器，统一入口 | 服务器（后端） | 负载均衡、SSL 终结、跨域 |
| 正向代理 | 隐藏客户端，突破网络限制 | 客户端         | 翻墙、内网访问外网       |



### 代理轮询

Nginx 最核心的功能之一是**反向代理**（正向代理较少用），核心依赖 `ngx_http_proxy_module` 模块（默认编译进 Nginx，无需额外安装）。该模块实现了 Nginx 作为客户端，将用户请求转发到后端服务器（如 Tomcat、Node.js、API 服务等），并将后端响应返回给用户的功能，常用于负载均衡、跨域处理、请求转发、SSL 终结等场景。

##### 1、核心配置指令

所有代理相关指令需配置在 http、server 或 location 块中（优先级：location > server > http），常用指令如下：

1. 核心转发指令

**proxy_pass**（必选）

- 功能：指定后端服务器的地址（目标代理地址），是反向代理的核心指令。
- 语法：proxy_pass URL;
- URL 格式：支持 http://、https://、unix:/（本地 socket），可带端口、路径。
- 关键注意事项：
  - 若 proxy_pass 后**不带路径**，Nginx 会将原始请求的完整路径转发给后端；
  - 若 proxy_pass 后**带路径**，Nginx 会将 location 匹配的路径替换为该路径，再转发给后端

##### 示例（路径匹配差异）

```nginx
# 场景 1：proxy_pass 不带路径（转发完整路径）
server {
    listen 80;
    server_name proxy.example.com;

    location /api/ {  # 匹配 /api/ 开头的请求（如 /api/user/1）
        proxy_pass http://127.0.0.1:3000;  # 不带路径
        # 实际转发到后端：http://127.0.0.1:3000/api/user/1（完整路径保留）
    }
}

# 场景 2：proxy_pass 带路径（替换路径）
server {
    listen 80;
    server_name proxy.example.com;

    location /api/ {  # 匹配 /api/ 开头的请求（如 /api/user/1）
        proxy_pass http://127.0.0.1:3000/v1/;  # 带路径 /v1/
        # 实际转发到后端：http://127.0.0.1:3000/v1/user/1（/api/ 替换为 /v1/）
    }
}
```

##### 2、后端连接相关指令

#### `proxy_connect_timeout`

- 功能：Nginx 与后端服务器建立连接的超时时间（默认 60 秒）。
- 语法：`proxy_connect_timeout time;`（单位：s/ms，如 `10s`、`5000ms`）

#### `proxy_send_timeout`

- 功能：Nginx 向后端服务器发送请求的超时时间（默认 60 秒，仅指两次写操作间隔）。
- 语法：`proxy_send_timeout time;`

#### `proxy_read_timeout`

- 功能：Nginx 等待后端服务器响应的超时时间（默认 60 秒，仅指两次读操作间隔）。
- 语法：`proxy_read_timeout time;`
- 场景：后端处理耗时任务（如文件上传）时，需增大该值（如 `300s`）。

##### 3. 请求头转发指令

#### `proxy_set_header`（常用）（代理添加）

- 功能：修改或添加转发给后端服务器的 HTTP 请求头，解决后端获取客户端真实信息的问题。

- 常用配置：

  ```nginx
  # 传递客户端真实 IP（后端通过 X-Real-IP 或 REMOTE_ADDR 获取）
  proxy_set_header X-Real-IP $remote_addr;
  # 传递客户端真实 IP 及代理链（多个代理时用）
  proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  # 传递原始请求的 Host 头（后端获取真实域名）
  proxy_set_header Host $host;
  # 传递原始请求的协议（http/https，后端判断是否为 HTTPS）
  proxy_set_header X-Forwarded-Proto $scheme;
  # 传递原始请求的端口
  proxy_set_header X-Forwarded-Port $server_port;
  ```

#### `proxy_pass_request_headers`

- 功能：是否转发客户端的原始请求头（默认 `on`，开启）。
- 语法：`proxy_pass_request_headers on | off;`

##### 4. 响应相关指令

#### `proxy_buffer_size`

- 功能：设置 Nginx 读取后端响应的缓冲区大小（默认 `4k` 或 `8k`，取决于系统）。
- 语法：`proxy_buffer_size size;`

#### `proxy_buffers`

- 功能：设置缓冲区的数量和每个缓冲区的大小（默认 `8 4k` 或 `8 8k`）。
- 语法：`proxy_buffers number size;`
- 场景：响应体较大时（如大文件下载），可增大缓冲区（如 `16 8k`）。

#### `proxy_ignore_client_abort`

- 功能：客户端断开连接后，Nginx 是否继续完成与后端的请求（默认 `off`，关闭）。
- 语法：`proxy_ignore_client_abort on | off;`
- 场景：需确保后端任务完成（如支付回调）时，设为 `on`。



#### 5.常见应用场景配置示例

##### 5.1. 基础反向代理（单后端服务）

需求：用户访问 `http://example.com` 时，转发到本地 `3000` 端口的 Node.js 服务。

```nginx
http {
    include mime.types;
    default_type application/octet-stream;

    server {
        listen 80;
        server_name example.com;  # 你的域名

        # 所有请求转发到后端
        location / {
            proxy_pass http://127.0.0.1:3000;  # 后端服务地址
            # 转发真实客户端信息
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header Host $host;
            proxy_set_header X-Forwarded-Proto $scheme;
            # 连接超时配置
            proxy_connect_timeout 10s;
            proxy_read_timeout 30s;
        }
    }
}
```

##### 5.2. 按路径分流代理（多后端服务）

需求：

- `/api/` 路径转发到 Java 服务（`8080` 端口）；

- `/admin/` 路径转发到 Python 服务（`5000` 端口）；

- 其他路径直接返回静态文件（Nginx 本地）。

  ```nginx
  server {
      listen 80;
      server_name example.com;
      root /usr/share/nginx/html;  # 静态文件根目录
      index index.html;
  
      # 静态文件直接访问（优先级最高）
      location ~* \.(html|css|js|png|jpg)$ {
          expires 1d;  # 缓存 1 天
      }
  
      # API 路径转发到 Java 服务
      location /api/ {
          proxy_pass http://127.0.0.1:8080/;  # 注意末尾的 /，替换 /api/ 为 /
          proxy_set_header Host $host;
          proxy_set_header X-Real-IP $remote_addr;
      }
  
      # 管理后台转发到 Python 服务
      location /admin/ {
          proxy_pass http://127.0.0.1:5000/admin/;  # 路径对应
          proxy_set_header Host $host;
          proxy_set_header X-Real-IP $remote_addr;
      }
  }
  ```

##### 5.3. HTTPS 终结（Nginx 处理 SSL，后端走 HTTP）https://freessl.cn

需求：用户访问 `https://example.com`（Nginx 处理 SSL），转发到后端 HTTP 服务（`8080` 端口）。

```nginx
server {
    listen 80;    #http协议用的80端口
    server_name localhost;
    return 301 https://$host$request_uri;
}



server {
    listen       443 ssl;    #https协议用的是443
    server_name localhost;
    ssl_certificate /etc/nginx/ssl/cert.crt;
    ssl_certificate_key /etc/nginx/ssl/privkey.key;
    # SSL 优化配置
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    access_log  /var/log/nginx/web02.test.com/host.access.log  main;

    location / {
        root   /webServer/web02;
        index  index.html index.htm;
    }

    #error_page  404              /404.html;

    # redirect server error pages to the static page /50x.html
    #
    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
        root   /usr/share/nginx/html;
    }
}
```



##### 自签名证书：

##### Nginx 自签 SSL 证书：生成、配置与使用全流程

自签 SSL 证书（Self-Signed Certificate）是通过 OpenSSL 工具本地生成的证书，**无需第三方 CA 机构签发**，适合测试环境、内网服务、开发调试等场景（不被浏览器信任，不建议用于公网生产环境）。以下是「证书生成、Nginx 配置、信任证书」的完整步骤，适配 Linux/macOS 系统。

```bash
openssl version
```

- CentOS/RHEL：`yum install openssl`

##### 方式 1：单命令快速生成（适合测试，无交互）

一行命令生成私钥和证书（有效期 365 天，可修改 `365` 调整时长）：

```bash
# 生成私钥（privkey.key）和证书（cert.crt），有效期 365 天
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /etc/nginx/ssl/privkey.key \
  -out /etc/nginx/ssl/cert.crt \
  -subj "/C=CN/ST=Beijing/L=Beijing/O=TestOrg/OU=TestDept/CN=nginx01.xxx.com"
```

##### 最终生成的文件（核心 2 个）

```bash
# 查看证书目录下的文件
ls /etc/nginx/ssl/
# 输出：privkey.key（私钥）、cert.crt（证书）、cert.csr（请求文件，可删除）
```

私钥文件需严格保密，仅 root 用户可读，否则 Nginx 启动报错：

```bash
chmod 600 /etc/nginx/ssl/privkey.key  # 仅 root 可读可写，其他用户无权限
```

#### 参数说明：

| 参数               | 作用                                                         |
| ------------------ | ------------------------------------------------------------ |
| `-x509`            | 生成自签证书（X.509 标准格式）                               |
| `-nodes`           | 私钥文件不加密（避免每次启动 Nginx 输入密码，测试场景推荐）  |
| `-days 365`        | 证书有效期（单位：天），可改为 730（2 年）、1095（3 年）     |
| `-newkey rsa:2048` | 同时生成新的 RSA 密钥（2048 位，安全强度足够，也可改为 4096 位） |
| `-keyout`          | 私钥文件输出路径（推荐 `/etc/nginx/ssl/`，统一管理）         |
| `-out`             | 证书文件输出路径                                             |
| `-subj`            | 证书主题信息（无需交互输入，直接指定）                       |



#### 5.4. 解决跨域问题（代理转发实现跨域）

报错：Access to fetch at 'http://api.b.com/user' from origin 'http://a.com' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.

跨域问题的本质是 **浏览器的同源策略限制**（协议、域名、端口三者任意不同即为跨域）。

前端项目（`http://localhost:8080`）访问后端 API（`http://api.example.com:3000`）时出现跨域，用 Nginx 代理转发规避：

```nginx
server {
    listen 80;
    server_name localhost;

    # 前端访问 /api 时，转发到后端 API 服务
    location /api/ {
        proxy_pass http://api.example.com:3000/;
        # 允许跨域请求头
        add_header Access-Control-Allow-Origin $http_origin;
        add_header Access-Control-Allow-Methods "GET,POST,PUT,DELETE,OPTIONS";
        add_header Access-Control-Allow-Headers "Content-Type,Authorization";
        add_header Access-Control-Allow-Credentials "true";

        # 处理 OPTIONS 预检请求
        if ($request_method = OPTIONS) {
            return 204;
        }
    }

    # 前端静态文件（本地部署）
    location / {
        root /usr/share/nginx/frontend;
        index index.html;
        try_files $uri $uri/ /index.html;  # 单页应用（SPA）路由兼容
    }
}
```



### 负载均衡（多后端服务分发请求）

结合 `upstream` 模块实现负载均衡（需配合 `proxy_pass` 使用）：

```nginx
http {
    # 定义后端服务器集群（名称：backend_servers）
    upstream backend_servers {
        server 192.168.247.147:80 weight=2;  # 权重 2，接收 2/5 请求
        server 192.168.247.148:80 weight=1;  # 权重 1，接收 1/5 请求
        server 192.168.247.149:3002 backup;    # 备用服务器，仅当主服务器全部下线时启用
    }

    server {
        listen 80;
        server_name example.com;

        location / {
            proxy_pass http://backend_servers;  # 转发到集群
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header Host $host;
            # 负载均衡相关超时
            proxy_connect_timeout 5s;
            proxy_read_timeout 10s;
        }
    }
}
```

- 负载均衡策略：默认 `轮询`，支持 `weight`（权重）、`ip_hash`（基于客户端 IP 绑定）、`fair`（基于响应时间）等。

##### 重点模块：

[ngx_http_upstream_check_module - The Tengine Web Server](https://tengine.taobao.org/document_cn/http_upstream_check_cn.html)

##### nginx.conf配置：

    upstream backend_servers {
        server 192.168.247.148:80 weight=2;  # 权重 2，接收 2/5 请求
        server 192.168.247.148:80 weight=1;  # 权重 1，接收 1/5 请求
        check interval=3000 rise=2 fall=5 timeout=5000 type=http;
        check_http_send "HEAD / HTTP/1.0\r\n\r\n";
        check_http_expect_alive http_2xx http_3xx;
    }

##### server字段配置：

        location /status {
            check_status;
            access_log off;
            allow all;  # 限制访问来源
        }



##### **优化：**

编辑 Nginx/OpenResty 主配置文件 `nginx.conf`（路径参考上面的命令），在 `main` 块（全局配置，与 `http` 块同级）添加以下配置：

#### 配置规则：

- `worker_processes`：设置为逻辑核心数（如 4 核心则设为 4）；
- `worker_cpu_affinity`：每个核心用 `16` 进制表示（1 对应绑定，0 对应不绑定），核心编号从 `0` 开始，顺序与 `worker` 进程一一对应。

```nginx
worker_processes  8;

worker_cpu_affinity 00000001 00000010 00000100 00001000 00010000 00100000 01000000 10000000;
```



```nginx
worker_processes  2;  # 4 个 worker 进程，与 4 核心对应

# 绑定规则：每个 worker 绑定一个独立核心
worker_cpu_affinity 0001 0011;
```

## 调试与问题排查

### 1. 查看 Nginx 代理日志

```nginx
http {
    # 自定义日志格式，包含代理相关信息
    log_format proxy_log '$remote_addr [$time_local] "$request" '
                         '$status $body_bytes_sent "$http_referer" '
                         '"$http_user_agent" "$proxy_add_x_forwarded_for" '
                         '"$upstream_addr" "$upstream_status" "$upstream_response_time"';

    access_log /var/log/nginx/access.log proxy_log;  # 启用自定义日志
}
```

- 关键字段：
  - `$upstream_addr`：后端服务器地址；
  - `$upstream_status`：后端响应状态码；
  - `$upstream_response_time`：后端响应时间。

### 常见问题（面试内容）

#### 问题 1：后端获取不到客户端真实 IP

- 原因：未配置 `proxy_set_header X-Real-IP` 或 `X-Forwarded-For`；
- 解决：添加前文提到的 `proxy_set_header` 配置。

#### 问题 2：后端无法判断请求是否为 HTTPS

- 原因：Nginx 处理 SSL 后，转发给后端的是 HTTP，后端默认认为是 HTTP；
- 解决：添加 `proxy_set_header X-Forwarded-Proto $scheme;`，后端通过该头判断协议。

#### 问题 3：请求路径转发错误（404）

- 原因：`proxy_pass` 路径是否带 `/` 导致的路径替换问题；
- 解决：根据需求调整 `proxy_pass` 末尾是否加 `/`（参考前文示例）。

#### 问题 4：超时错误（504 Gateway Timeout）

- 原因：后端响应超时，或 `proxy_read_timeout` 配置过短；
- 解决：增大 `proxy_read_timeout`（如 `300s`），同时排查后端服务是否卡顿。



#### 正向代理（如客户端翻墙），需配置 `resolver`（DNS 解析）和 `proxy_pass`：

```nginx
server {
    listen 8888;
    resolver 8.8.8.8;  # DNS 服务器（如谷歌 DNS）

    location / {
        proxy_pass http://$http_host$request_uri;  # 正向代理转发
        proxy_set_header Host $http_host;
        proxy_bypass_cache on;
    }
}
```



## 常用监控方案对比

| 方案                 | 核心模块 / 工具                            | 特点                             | 适用场景                     |
| -------------------- | ------------------------------------------ | -------------------------------- | ---------------------------- |
| Nginx 自带状态页     | `ngx_http_stub_status_module`              | 轻量、默认编译、仅基础指标       | 快速排查、简单监控需求       |
| Prometheus + Grafana | `nginx-prometheus-exporter`                | 指标全面、可视化强、支持告警     | 中大型集群、精细化监控       |
| 商业监控工具         | Zabbix、Datadog、New Relic                 | 开箱即用、告警成熟、无需复杂配置 | 企业级监控、多系统统一管理   |
| 日志分析             | ELK Stack（Elasticsearch+Logstash+Kibana） | 基于日志挖掘指标、支持自定义分析 | 需审计日志、复杂请求链路分析 |

## Nginx 自带状态页（`stub_status` 模块）

`ngx_http_stub_status_module` 是 Nginx 官方提供的基础监控模块，**默认编译进 Nginx**（无需额外安装），仅需简单配置即可启用，适合快速查看核心状态。

### 1. 确认模块是否已启用

执行命令检查模块是否存在：

```bash
nginx -V 2>&1 | grep -o 'stub_status'
```

若输出 `stub_status` 则已启用；若未找到，需重新编译 Nginx 并添加 `--with-http_stub_status_module`。

### 2. 配置状态页

在 Nginx 配置文件（`nginx.conf` 或站点配置）中添加状态页路由，建议限制访问来源（避免暴露）：

```nginx
http {
    # 其他配置...

    server {
        listen 80;
        server_name localhost;

        # 配置状态页路由（仅允许内网 IP 访问）
        location /nginx-status {
            stub_status on;          # 启用状态页
            access_log off;          # 关闭状态页访问日志（减少冗余）
            allow 192.168.0.0/24;    # 允许内网网段访问
            allow 127.0.0.1;         # 允许本地访问
            deny all;                # 拒绝其他所有 IP
        }
    }
}
```

### 3. 验证与查看状态

重启 Nginx 使配置生效：

```bash
nginx -t  # 验证配置无错误
nginx -s reload  # 重载配置
```

访问状态页（本地或内网）：

```bash
# 本地访问（或浏览器打开 http://服务器IP/nginx-status）
curl http://127.0.0.1/nginx-status
```

返回结果示例：

```plaintext
Active connections: 2 
server accepts handled requests
 100 100 300 
Reading: 0 Writing: 1 Waiting: 1 
```

| 指标               | 说明                                                         |
| ------------------ | ------------------------------------------------------------ |
| Active connections | 当前活跃连接数（包含正在处理、等待处理的连接）               |
| accepts            | 累计已接受的客户端连接数                                     |
| handled            | 累计已处理的客户端连接数（通常与 accepts 相等，除非资源耗尽拒绝连接） |
| requests           | 累计已处理的 HTTP 请求数（1 个连接可能对应多个请求，如 Keep-Alive） |
| Reading            | Nginx 正在读取客户端请求头的连接数                           |
| Writing            | Nginx 正在向客户端发送响应的连接数                           |
| Waiting            | 处于 Keep-Alive 状态的空闲连接数（等待下一次请求）           |


