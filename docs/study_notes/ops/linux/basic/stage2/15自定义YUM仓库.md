# 自定义YUM仓库

:tada: 2025-11-13 :tada:

## 1、准备所有用到RPM安装。

例如 openresty.gz

## 2、创建存放包的目录

```
mkdir  /opt/rpms
```

## 3、解压

```
tar xf openresty.gz -C /opt/rpms 
```

```
[root@node1 rpms]# ls
cups-filters-1.0.35-29.el7_9.x86_64.rpm            libXpm-3.5.12-2.el7_9.x86_64.rpm               openresty-pcre2-10.46-1.el7.x86_64.rpm
device-mapper-event-1.02.170-6.el7_9.5.x86_64.rpm  mesa-dri-drivers-18.3.4-12.el7_9.x86_64.rpm    openresty-zlib-1.3.1-1.el7.x86_64.rpm
firefox-115.12.0-1.el7.centos.x86_64.rpm           NetworkManager-adsl-1.18.8-2.el7_9.x86_64.rpm  sos-3.9-5.el7.centos.12.noarch.rpm
gnome-initial-setup-3.28.0-2.el7_9.1.x86_64.rpm    openresty-1.27.1.2-1.el7.x86_64.rpm
gvfs-archive-1.36.2-7.el7_9.x86_64.rpm             openresty-openssl3-3.5.0-1.el7.x86_64.rpm
```

## 4、创建 repo

```
createrepo  -v   /opt/rpms
```

![](https://mmbiz.qpic.cn/sz_mmbiz_png/15LnGBjmcIH384IDdKdCtVFgtGOHKXsfsRKzIzwO9esnvDqrArTpgWCUhEe3uY3dTxAyiceROKJcO2HH94OXPng/0?from=appmsg&wxfrom=12&wx_fmt=png&tp=webp&usePicPrefetch=1&watermark=1)
![](https://mmbiz.qpic.cn/sz_mmbiz_png/15LnGBjmcIH384IDdKdCtVFgtGOHKXsfq5Q7U4nAIZL2WU4icicbJr6B0KaMzOZxFgicCbbcicCO6KfSCEndKkicvicw/0?from=appmsg&wxfrom=12&wx_fmt=png&tp=webp&watermark=1)
![](https://mmbiz.qpic.cn/sz_mmbiz_png/15LnGBjmcIH384IDdKdCtVFgtGOHKXsfKCoVxic3kqLjxbUicmy0ibuWVaDuXNycEdMepTfaHomyCDVwaianZtKfRg/0?from=appmsg&wxfrom=12&wx_fmt=png&tp=webp&watermark=1)
![](https://mmbiz.qpic.cn/sz_mmbiz_png/15LnGBjmcIH384IDdKdCtVFgtGOHKXsfy9e541Y8Gauz4nWIn9RrenaJ8QJmUsj93a5x9mKWyxgSL5RjLkXpGg/0?from=appmsg&wxfrom=12&wx_fmt=png&tp=webp&watermark=1)
![](https://mmbiz.qpic.cn/sz_mmbiz_png/15LnGBjmcIH384IDdKdCtVFgtGOHKXsfpQPu9nDqdfIiakaAwUVtNLGnDXV8gdsXlcjk8evjnD93cBBW79jvR6w/0?from=appmsg&wxfrom=12&wx_fmt=png&tp=webp&watermark=1)
![](https://mmbiz.qpic.cn/sz_mmbiz_png/15LnGBjmcIH384IDdKdCtVFgtGOHKXsfg4YY6ciagaE0WbPBmPqNQUwcfPWibEO2Cy1jN0icq0PhIEfobbp82Jt0w/0?from=appmsg&wxfrom=12&wx_fmt=png&tp=webp&watermark=1)
![](https://mmbiz.qpic.cn/sz_mmbiz_png/15LnGBjmcIH384IDdKdCtVFgtGOHKXsfVWXyZTqFyughm7cBhzWZyg8SXEKZ3KvnE9k45pJ2mmUQYMnkUW2GKA/0?from=appmsg&wxfrom=12&wx_fmt=png&tp=webp&watermark=1)
![](https://mmbiz.qpic.cn/sz_mmbiz_png/15LnGBjmcIH384IDdKdCtVFgtGOHKXsfgTicliaIQMJaDw0lGelwbQcgggsP46gHCv9IyLoSy44yicSGMzauw3OCw/0?from=appmsg&wxfrom=12&wx_fmt=png&tp=webp&watermark=1)
![](https://mmbiz.qpic.cn/sz_mmbiz_png/15LnGBjmcIH384IDdKdCtVFgtGOHKXsfHF7txltKlr22XtSOA91NauEVGODxeWf0DnYOjkwKHm8mfBGwQibia33Q/0?from=appmsg&wxfrom=12&wx_fmt=png&tp=webp&watermark=1)