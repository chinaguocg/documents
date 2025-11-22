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

![](https://mmbiz.qpic.cn/sz_mmbiz_png/15LnGBjmcIH384IDdKdCtVFgtGOHKXsfYxVoRD2ib27QkTklRrfVBgiclics0Xph36oy2jxfAD6Oic142QYdtc4GBA/0?from=appmsg&wxfrom=12&wx_fmt=png&tp=webp&usePicPrefetch=1&watermark=1)
![](https://mmbiz.qpic.cn/sz_mmbiz_png/15LnGBjmcIH384IDdKdCtVFgtGOHKXsfC218ibZrfTCibOmH6hDykGfnyVHxXFXcQlvp7tia6CKV7e499Kia9HGJkA/0?from=appmsg&wxfrom=12&wx_fmt=png&tp=webp&watermark=1)
![](https://mmbiz.qpic.cn/sz_mmbiz_png/15LnGBjmcIH384IDdKdCtVFgtGOHKXsfF2VTTCYceV9cg6u2JJPD3RPvyC1mu9wcCebDSdQvk1yJI7bBxmjN5w/0?from=appmsg&wxfrom=12&wx_fmt=png&tp=webp&watermark=1)
![](https://mmbiz.qpic.cn/sz_mmbiz_png/15LnGBjmcIH384IDdKdCtVFgtGOHKXsfksnKr5S5vcsh4kG7qlem9Se7hHbOurzjLzJfurtXRHF7NVcghbAOGA/0?from=appmsg&wxfrom=12&wx_fmt=png&tp=webp&watermark=1)
![](https://mmbiz.qpic.cn/sz_mmbiz_png/15LnGBjmcIH384IDdKdCtVFgtGOHKXsfCu9nXCDtfhCWFibFB3N9QQ9gQgJ5g516CDkWugndAGSJeXRLkuxayxg/0?from=appmsg&wxfrom=12&wx_fmt=png&tp=webp&watermark=1)
![](https://mmbiz.qpic.cn/sz_mmbiz_png/15LnGBjmcIH384IDdKdCtVFgtGOHKXsfibyzfNPrmw2cTCZbwSDDSEROrqDMLqCvOtQibe3DXYSL4NI4l7TblkIA/0?from=appmsg&wxfrom=12&wx_fmt=png&tp=webp&watermark=1)
![](https://mmbiz.qpic.cn/sz_mmbiz_png/15LnGBjmcIH384IDdKdCtVFgtGOHKXsfw42mbv7bkGX3ibEYB7ibibMwuB1BhOPTokpvd0vwtBv4ibMAAsDFERaMoA/0?from=appmsg&wxfrom=12&wx_fmt=png&tp=webp&watermark=1)
![](https://mmbiz.qpic.cn/sz_mmbiz_png/15LnGBjmcIH384IDdKdCtVFgtGOHKXsfMBHByFEf4Vk7V2ZcaYicPtcMnibotk8y9OSrob4q6xhsttn1j6iaMd6fQ/0?from=appmsg&wxfrom=12&wx_fmt=png&tp=webp&watermark=1)
![](https://mmbiz.qpic.cn/sz_mmbiz_png/15LnGBjmcIH384IDdKdCtVFgtGOHKXsfhibmqLyLwyqgAQDJKoevAfiaZmIZXy8PLegEE0ib1T4GxSjCP52AMpJHg/0?from=appmsg&wxfrom=12&wx_fmt=png&tp=webp&watermark=1)
![](https://mmbiz.qpic.cn/sz_mmbiz_png/15LnGBjmcIH384IDdKdCtVFgtGOHKXsfHmSareIBn95Xe6Uiccj04wBxHYrg6M8K1iaWIqojjR6oTf0TQ1LJ1Xmw/0?from=appmsg&wxfrom=12&wx_fmt=png&tp=webp&watermark=1)
![](https://mmbiz.qpic.cn/sz_mmbiz_png/15LnGBjmcIH384IDdKdCtVFgtGOHKXsfM3I3QPjpSHH4C19a2pL2Be90ZDCVwWxwj1IB6sMMn0pYnT1fW9zPrw/0?from=appmsg&wxfrom=12&wx_fmt=png&tp=webp&watermark=1)
![](https://mmbiz.qpic.cn/sz_mmbiz_png/15LnGBjmcIH384IDdKdCtVFgtGOHKXsfGsj5sGLVSNjkQialKFNNiarHmQhcv7g10CAfjwgjJdNt6sgyMicYAJibibg/0?from=appmsg&wxfrom=12&wx_fmt=png&tp=webp&watermark=1)
![](https://mmbiz.qpic.cn/sz_mmbiz_png/15LnGBjmcIH384IDdKdCtVFgtGOHKXsf5zZRVPyhyFSmFVkjJScgZzsCq8P7kSwm8UcibOpoWFq1pqSiaXIV9QwA/0?from=appmsg&wxfrom=12&wx_fmt=png&tp=webp&watermark=1)
![](https://mmbiz.qpic.cn/sz_mmbiz_png/15LnGBjmcIH384IDdKdCtVFgtGOHKXsf3gRJDGFd8wibeRWFIJx36vLOH1eWTLic5FWojOSGUm9T5ZoiaYEapuIxw/0?from=appmsg&wxfrom=12&wx_fmt=png&tp=webp&watermark=1)
![](https://mmbiz.qpic.cn/sz_mmbiz_png/15LnGBjmcIH384IDdKdCtVFgtGOHKXsfC0gtl0d4CKmTqyjewjPmh3gokRBGhMScrR6KorVSzSRNqticAPt8pNA/0?from=appmsg&wxfrom=12&wx_fmt=png&tp=webp&watermark=1)
![](https://mmbiz.qpic.cn/sz_mmbiz_png/15LnGBjmcIH384IDdKdCtVFgtGOHKXsfWF7Xib9f1SYRab5nPkKqkic7SNiaHdkRx2K1PWvsyIkDvN3HowM1JRFPg/0?from=appmsg&wxfrom=12&wx_fmt=png&tp=webp&watermark=1)
![](https://mmbiz.qpic.cn/sz_mmbiz_png/15LnGBjmcIH384IDdKdCtVFgtGOHKXsflic74DmYXWeTXLOhPBmJm5tHv9pibetDxXMjTKIiaTaGHQoHvSnwDibpTQ/0?from=appmsg&wxfrom=12&wx_fmt=png&tp=webp&watermark=1)
