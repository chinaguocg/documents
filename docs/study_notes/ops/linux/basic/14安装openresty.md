# 安装openresty

:tada: 2025-11-13 :tada:

## 1、访问官网：

http://openresty.org/

## 2、下载安装包

```
wget  https://openresty.org/download/openresty-1.25.3.2.tar.gz
```

## 3、确保YUM可以使用

- 基本源：
```
vi /etc/yum.repos.d/base.repo
```

```
[base]

name=base

baurl=https://mirrors.cloud.tencent.com/centos/7.9.2009/os/x86_64/

enabled=1
```

- EPEL扩展源：
```
vi /etc/yum.repos.d/base.repo
```

```
[base]

name=base

baurl=https://mirrors.cloud.tencent.com/epel/7/x86_64/

enabled=1
```


## 4、安装开发工具
```
yum groupinstall "开发工具" -y
```


## 5、安装依赖关系
```
yum install pcre-devel.x86_64

yum install  openssl-devel.x86_64
```


## 6、定制
```
./configure --prefix=/opt/openresty \ 

--with-luajit \            

--without-http_redis2_module \
```


## 7、编译
```
make -j4              
 
#(j4,使用4个线程编译，速度快！！！，怎么查看最大多少，nproc)
```


## 8、安装
```
make install
```


## 9、启动
```
/opt/openresty/bin/openresty
```

## 10、关闭防火墙（测试环境）
```
systemctl stop firewalld
```

完整示例

```bash
   71  wget  https://openresty.org/download/openresty-1.25.3.2.tar.gz
   72  yum install wget
   73  yum groupinstall "开发工具" -y
   74  ll
   75  mkdir ad-work
   76  cd ad-work/
   77  ll
   78  wget  https://openresty.org/download/openresty-1.25.3.2.tar.gz
   79  ll
   80  tar -xzvf openresty-1.25.3.2.tar.gz
   81  ll
   82  cd openresty-1.25.3.2
   83  ll
   84  ./configure --prefix=/opt/openresty \ 
   85  --with-luajit \            
   86  --without-http_redis2_module \
   87  ./configure --prefix=/opt/openresty             --with-luajit             --without-http_redis2_module 
   88  yum install pcre-devel.x86_64
   89  yum install  openssl-devel.x86_64
   90  ./configure --prefix=/opt/openresty             --with-luajit             --without-http_redis2_module 
   91  make -j4   
   92  make install
   93  /opt/openresty/bin/openresty
   94  firewall-cmd stop
   95  firewall-cmd stauts
   96  firewall status
   97  cd /opt/openresty/bin/
   98  ll
   99  iptables -nL
  100  firewall-cmd  
  101  firewall-cmd  --help
  102  firewall-cmd  --state
  103  systemctl stop firewalld
```

![](/documents/img/ops/linux/basic/openresty/01.png)
![](/documents/img/ops/linux/basic/openresty/02.png)
![](/documents/img/ops/linux/basic/openresty/03.png)
![](/documents/img/ops/linux/basic/openresty/04.png)
![](/documents/img/ops/linux/basic/openresty/05.png)
![](/documents/img/ops/linux/basic/openresty/06.png)
![](/documents/img/ops/linux/basic/openresty/07.png)
![](/documents/img/ops/linux/basic/openresty/08.png)
![](/documents/img/ops/linux/basic/openresty/09.png)
![](/documents/img/ops/linux/basic/openresty/10.png)
![](/documents/img/ops/linux/basic/openresty/11.png)
![](/documents/img/ops/linux/basic/openresty/12.png)
![](/documents/img/ops/linux/basic/openresty/13.png)
![](/documents/img/ops/linux/basic/openresty/14.png)
![](/documents/img/ops/linux/basic/openresty/15.png)
![](/documents/img/ops/linux/basic/openresty/16.png)
![](/documents/img/ops/linux/basic/openresty/17.png)
