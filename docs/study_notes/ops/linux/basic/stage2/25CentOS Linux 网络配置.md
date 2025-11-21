# CentOS Linux 网络配置

> 零、基本概念：

> 协议？

> IP：网络层，负责解决不同网段直接通信。

> MAC：负责解决同网段之间通信。

> 网关：?

> 网段：?




 **(IP)192.168.10.1/24(掩码netmask)**

-----------------------

A类IP  1-126开头        掩码：8         掩码全写：255.0.0.0           
10开头私有地址。

-----------------------

B类IP   128-191开头   掩码：16       掩码全写：255.255.0.0        
127回环，代表。

172.16-172.31开头私有地址。172.68.0.0

-------------------------

C类IP   192-227开头 掩码：24       掩码全写：255.255.255.0      
192.168开头，私有地址

192.168.40.0（1-254）C类地址可用IP  254个

------------------------------

私有地址：小名

192.168.10.1

255.255.255.0
192.168.10.0 网段

IP:       192.168.10.2/24                          192.168.50.15/24             

网段：192.168.10.0                                192.168.50.0



IP：10.9.41.5

netmask：24 

gateway：10.9.42.1 

DNS：202.106.196.115

![](https://mmbiz.qpic.cn/sz_mmbiz_png/15LnGBjmcIEQ1q1PYRDwc11jHibkyJ7KbnQOYJjpHN3hgJT8VU6PSics41DVnFNxjRS0rpHYzbwGMZZ7UVzIrvRQ/0?wx_fmt=png&from=appmsg&watermark=1&wxfrom=3)

![](https://mmbiz.qpic.cn/sz_mmbiz_png/15LnGBjmcIEQ1q1PYRDwc11jHibkyJ7KbSOzrFVcZRCfnpe1RDPXgWNeLQClgOmMXHuYdgL6iawEXqEZntliaNspQ/0?wx_fmt=png&from=appmsg&watermark=1&wxfrom=3)

## 一、NetworkManager 简介

NetworkManager 是 CentOS/RHEL 系统中默认的网络管理服务，提供以下功能：
- 管理有线、无线、VPN 等各种网络连接
- 自动检测和配置网络
- 提供命令行(nmcli)和图形界面(TUI/GUI)管理工具
- 支持动态网络配置更改

## 二、NetworkManager 服务管理

### 1. 查看服务状态
```bash
systemctl status NetworkManager
```

### 2. 启动/停止/重启服务
```bash
systemctl start NetworkManager    # 启动
systemctl stop NetworkManager     # 停止
systemctl restart NetworkManager  # 重启
```

### 3. 设置开机自启
```bash
systemctl enable NetworkManager   # 启用自启
systemctl disable NetworkManager  # 禁用自启
```

```bash
systemctl --now enable NetworkManager

等价于：
systemctl start NetworkManager
systemctl enable NetworkManager
```

## 三、nmcli 命令行工具

```bash
Network Manager Command Line
```

### 1. 查看网络`设备`状态

```bash
[root@yangge ~]# nmcli device status 
DEVICE  TYPE      STATE      CONNECTION 
ens33   ethernet  connected  ens33      
lo      loopback  unmanaged  --  

[root@yangge ~]# nmcli device show ens33
GENERAL.DEVICE:                         ens33
GENERAL.TYPE:                           ethernet
GENERAL.HWADDR:                         00:0C:29:93:92:66
GENERAL.MTU:                            1500
GENERAL.STATE:                          100 (connected)
GENERAL.CONNECTION:                     ens33
GENERAL.CON-PATH:                       /org/freedesktop/NetworkManager/ActiveConnection/1
WIRED-PROPERTIES.CARRIER:               on
IP4.ADDRESS[1]:                         192.168.92.131/24
IP4.GATEWAY:                            192.168.92.2
IP4.ROUTE[1]:                           dst = 0.0.0.0/0, nh = 192.168.92.2, mt = 100
IP4.ROUTE[2]:                           dst = 192.168.92.0/24, nh = 0.0.0.0, mt = 100
IP4.DNS[1]:                             192.168.92.2
IP4.DOMAIN[1]:                          localdomain
IP6.ADDRESS[1]:                         fe80::b57:b45:9e22:fe47/64
IP6.GATEWAY:                            --
IP6.ROUTE[1]:                           dst = fe80::/64, nh = ::, mt = 100
IP6.ROUTE[2]:                           dst = ff00::/8, nh = ::, mt = 256, table=255
```

### 2. 查看所有`连接`配置
```bash
[root@yangge ~]# nmcli connection show 
NAME   UUID                                  TYPE      DEVICE 
ens33  3dc71aa4-c4c3-4411-b5b9-18cc45569826  ethernet  ens33 

[root@yangge ~]# nmcli connection show ens33

[root@yangge ~]# ls /etc/sysconfig/network-scripts/
ifcfg-ens33  ifdown-ippp  ifdown-routes    ifup  ifup-ipv6   ifup-ppp       ifup-tunnel
ifcfg-lo ifdown-ipv6  ifdown-sit  ifup-aliases  ifup-isdn   ifup-routes    ifup-wireless
ifdown   ifdown-isdn  ifdown-Team      ifup-bnep     ifup-plip   ifup-sit       

[root@yangge ~]# cat /etc/sysconfig/network-scripts/ifcfg-ens33  # ens33连接对应的配置文件
TYPE="Ethernet"
PROXY_METHOD="none"
BROWSER_ONLY="no"
BOOTPROTO="dhcp"							# 动态IP，从DHCP服务器获取
DEFROUTE="yes"
IPV4_FAILURE_FATAL="no"
IPV6INIT="yes"
IPV6_AUTOCONF="yes"
IPV6_DEFROUTE="yes"
IPV6_FAILURE_FATAL="no"
IPV6_ADDR_GEN_MODE="stable-privacy"
NAME="ens33"								# 连接名
UUID="3dc71aa4-c4c3-4411-b5b9-18cc45569826"
DEVICE="ens33"								# 该连接对应的设备
ONBOOT="yes"								# 开机自动激活该连接
```

### 3. 查看详细网络信息
```bash
nmcli connection show <连接名称>

[root@yangge ~]# nmcli connection show ens33 		# 查看连接的详细信息
connection.id:                          ens33
connection.uuid:                        3dc71aa4-c4c3-4411-b5b9-18cc45569826
connection.stable-id:                   --
connection.type:                        802-3-ethernet
connection.interface-name:              ens33
connection.autoconnect:                 yes
ipv4.method:                            manual
ipv4.dns:                               114.114.114.114
ipv4.dns-search:                        --
ipv4.dns-options:                       ""
ipv4.dns-priority:                      0
ipv4.addresses:                         192.168.92.200/24
ipv4.gateway:                           192.168.92.2
```

## 四、常见网络配置实战

### 案例1：查看当前网络信息

 **IP**、**子网掩码**、**网关**、**DNS**、**主机名**

```bash
1. 查IP地址的获取方法
[root@yangge ~]# nmcli connection show ens33 |grep ipv4.method	
ipv4.method:           		 auto	  	# auto或dhcp表示自动获取

2. IP地址/子网掩码:
[root@yangge ~]# ip addr				# 192.168.92.132/24(255.255.255.0)
2: ens33: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc pfifo_fast state UP group default qlen 1000
    link/ether 00:0c:29:a7:7d:eb brd ff:ff:ff:ff:ff:ff
    inet 192.168.92.132/24 brd 192.168.92.255 scope global noprefixroute dynamic ens33

3. 默认网关（默认路由）: 
[root@yangge ~]# ip route 				# 默认网关为192.168.92.2
default via 192.168.92.2 dev ens33 proto dhcp metric 100 
192.168.92.0/24 dev ens33 proto kernel scope link src 192.168.92.132 metric 100 

4. DNS服务器:							  # 当前DNS服务器为192.168.92.2
[root@yangge ~]# cat /etc/resolv.conf 
# Generated by NetworkManager
search localdomain
nameserver 192.168.92.2

5. 主机名：								 # 当前主机名为yangge
[root@yangge ~]# hostname
yangge
[root@yangge ~]# cat /etc/hostname 		# 方法二查看
yangge

- 网卡ens33、lo
lo网卡： 本地回环接口，虚拟接口，IP 127.0.0.1，它表示是自己
[root@yangge ~]# ping 127.0.0.1
PING 127.0.0.1 (127.0.0.1) 56(84) bytes of data.
64 bytes from 127.0.0.1: icmp_seq=1 ttl=64 time=0.047 ms
64 bytes from 127.0.0.1: icmp_seq=2 ttl=64 time=0.051 ms
64 bytes from 127.0.0.1: icmp_seq=3 ttl=64 time=0.039 ms

ens33网卡：物理网卡，对外通信
[root@yangge ~]# ping www.qfedu.com				# 测试和目标主机的连通信
PING evrwoxqc.slt.sched.tdnsv8.com (60.220.213.75) 56(84) bytes of data.
64 bytes from 75.213.220.60.adsl-pool.sx.cn (60.220.213.75): icmp_seq=1 ttl=128 time=34.9 ms
64 bytes from 75.213.220.60.adsl-pool.sx.cn (60.220.213.75): icmp_seq=2 ttl=128 time=18.7 ms

[root@yangge ~]# ping -c2 www.qfedu.com
PING evrwoxqc.slt.sched.tdnsv8.com (60.220.213.75) 56(84) bytes of data.
64 bytes from 75.213.220.60.adsl-pool.sx.cn (60.220.213.75): icmp_seq=1 ttl=128 time=18.6 ms
64 bytes from 75.213.220.60.adsl-pool.sx.cn (60.220.213.75): icmp_seq=2 ttl=128 time=18.1 ms

DNS: 域名解析服务   www.qfedu.com ---DNS Server---> 75.213.220.60
```

### 案例2：静态配置-nmcli【重点】

- **固定IP地址**：手动指定，不会自动改变
- **稳定性高**：适合服务器、网络设备等需要固定地址的场景
- **需手动配置**：需要管理员设置 **IP**、**子网掩码**、**网关**、**DNS**等信息

**案例I: 根据要求配置静态网络【全部网络信息修改】**

| 配置项        | 修改值                   | 注意事项                         |
| ------------- | ------------------------ | -------------------------------- |
| `IP 获取方法` | `Manual`                 | 静态/手动                        |
| `IP 地址`     | `192.168.92.200`         | x.x.x.200（x.x.x为原有网段）     |
| `子网掩码`    | `255.255.255.0` 或 `/24` | -                                |
| `默认网关`    | `192.168.92.2`           | 保持本机原有网关（ip route查看） |
| `DNS服务器`   | `114.114.114.114`        | 新的DNS服务器                    |

```bash
[root@yangge ~]# nmcli connection show 			# 查看当前的连接
NAME   UUID                                  TYPE      DEVICE 
ens33  3dc71aa4-c4c3-4411-b5b9-18cc45569826  ethernet  ens33 

# 修改以太网静态IP连接
[root@yangge ~]# nmcli connection modify ens33 \
ipv4.method manual \
ipv4.addresses 192.168.92.200/24 \
ipv4.gateway 192.168.92.2 \
ipv4.dns 114.114.114.114 \						# "8.8.8.8,4.4.4.4,114.114.114.114"
autoconnect yes 								# 当初安装系统时，没有勾选网卡自动连接

# 激活连接
[root@yangge ~]# nmcli connection up ens33


# 查看修改后的网络信息
[root@yangge ~]# ip a
2: ens33: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc pfifo_fast state UP group default qlen 1000
    link/ether 00:0c:29:a7:7d:eb brd ff:ff:ff:ff:ff:ff
    inet 192.168.92.200/24 brd 192.168.92.255 scope global noprefixroute ens33
       valid_lft forever preferred_lft forever
    inet6 fe80::2e01:8a2b:153c:d9a6/64 scope link noprefixroute 
       valid_lft forever preferred_lft forever

[root@yangge ~]# ip route 
default via 192.168.92.2 dev ens33 proto static metric 100 
192.168.92.0/24 dev ens33 proto kernel scope link src 192.168.92.200 metric 100 

[root@yangge ~]# cat /etc/resolv.conf 
# Generated by NetworkManager
nameserver 114.114.114.114

[root@yangge ~]# nmcli connection show ens33 |grep meth
ipv4.method:                            manual

其实还可以这么查：
[root@yangge ~]# cat /etc/sysconfig/network-scripts/ifcfg-ens33
TYPE=Ethernet
PROXY_METHOD=none
BROWSER_ONLY=no
BOOTPROTO=none					# none表示静态，dhcp表示动态
DEFROUTE=yes
IPV4_FAILURE_FATAL=no
IPV6INIT=yes
IPV6_AUTOCONF=yes
IPV6_DEFROUTE=yes
IPV6_FAILURE_FATAL=no
IPV6_ADDR_GEN_MODE=stable-privacy
NAME=ens33						# 连接名
UUID=3dc71aa4-c4c3-4411-b5b9-18cc45569826
DEVICE=ens33					# 设备名【网卡名】
ONBOOT=yes						# 自动连接  autoconnect yes 
IPADDR=192.168.92.200			# IP地址
PREFIX=24						# 子网掩码
GATEWAY=192.168.92.2			# 默认网关
DNS1=114.114.114.114			# DNS服务器


扩展：当初安装系统时，没有勾选网卡自动连接
[root@yangge ~]# nmcli connection modify ens33 autoconnect yes	
[root@yangge ~]# nmcli connection up ens33
```

**案例II: 根据要求配置静态网络【仅修改部分网络信息】**

| 配置项       | 修改值                      | 注意事项   |
| ------------ | --------------------------- | ---------- |
| `IP获取方法` | `不修改`                    | -          |
| `IP 地址`    | `不修改`                    | -          |
| `子网掩码`   | `不修改`                    | -          |
| `默认网关`   | `不修改`                    | -          |
| `DNS服务器`  | `114.114.114.114` `8.8.8.8` | 修改或增加 |

```bash
[root@yangge ~]# cat /etc/resolv.conf 			# 查看原有的DNS服务器，就1个
# Generated by NetworkManager
nameserver 114.114.114.114
nameserver 202.106.0.20
nameserver 8.8.8.8
修改直接生效

网卡配置文件（最简化版本）：
TYPE=Ethernet
BOOTPROTO=dhcp|static（静态地址）            #（dhcp动态IP地址-网络工程师负责）
NAME=ens33
UUID=95d937ac-f36d-4342-8259-b7e0d1afead0
DEVICE=ens33
ONBOOT=yes
IPADDR=IP地址
NETMASK=掩码（255.255.255.0）
PREFIX=24
GATEWAY=网关
DNS1=dns地址
DNS2=dns地址


- 增加8.8.8.8 方法一：
[root@yangge ~]# nmcli connection modify ens33 +ipv4.dns 8.8.8.8	# +表示增加
[root@yangge ~]# nmcli conn up ens33 			# 凡是修改某个连接，必须重新UP该连接
[root@yangge ~]# cat /etc/resolv.conf 
# Generated by NetworkManager
nameserver 114.114.114.114
nameserver 8.8.8.8

- 增加8.8.8.8 方法二：
[root@yangge ~]# nmcli connection modify ens33 ipv4.dns "8.8.8.8,114.114.114.114,202.106.0.20"
[root@yangge ~]# nmcli connection up ens33 
[root@yangge ~]# cat /etc/resolv.conf 
# Generated by NetworkManager
nameserver 8.8.8.8
nameserver 114.114.114.114
nameserver 202.106.0.20

- 修改为202.106.0.20：
[root@yangge ~]# nmcli connection modify ens33 ipv4.dns 202.106.0.20
[root@yangge ~]# nmcli connection up ens33 
[root@yangge ~]# cat /etc/resolv.conf 
# Generated by NetworkManager
nameserver 202.106.0.20
```

### 案例3：静态配置-修改文件【次重点】

| 配置项        | 修改值                           | 注意事项                         |
| ------------- | -------------------------------- | -------------------------------- |
| `IP 获取方法` | `none`                           | 静态/手动                        |
| `IP 地址`     | `192.168.92.100`                 | x.x.x.100（x.x.x为原有网段）     |
| `子网掩码`    | `255.255.255.0` 或 `/24`         | -                                |
| `默认网关`    | `192.168.92.2`                   | 保持本机原有网关（ip route查看） |
| `DNS服务器`   | `114.114.114.114` `202.106.0.20` | 修改DNS服务器                    |

```bash
[root@yangge ~]# nmcli connection show 				# 查看连接名
NAME   UUID                                  TYPE      DEVICE 
ens33  dc8d563f-635e-4f39-a93f-fd1febea5c92  ethernet  ens33  

[root@yangge ~]# vim /etc/sysconfig/network-scripts/ifcfg-ens33
TYPE=Ethernet
PROXY_METHOD=none
BROWSER_ONLY=no
BOOTPROTO=none										# none为静态
DEFROUTE=yes
IPV4_FAILURE_FATAL=no
IPV6INIT=yes
IPV6_AUTOCONF=yes
IPV6_DEFROUTE=yes
IPV6_FAILURE_FATAL=no
IPV6_ADDR_GEN_MODE=stable-privacy
NAME=ens33
UUID=dc8d563f-635e-4f39-a93f-fd1febea5c92
DEVICE=ens33
ONBOOT=yes											# 自动激活
IPADDR=192.168.92.100								# IP地址
PREFIX=24											# 子网掩码
GATEWAY=192.168.92.2								# 默认网关
DNS1=114.114.114.114								# DNS1
DNS2=202.106.0.20									# DNS2

[root@yangge ~]# nmcli connection reload 			# 手动修改文件，必须reload
[root@yangge ~]# nmcli connection up ens33			# 激活连接
```

### 案例4：修改主机名

```bash
- 方法一【推荐】
[root@yangge ~]# hostnamectl set-hostname tianyun.qfedu.com	（既修改配置文件，又当前生效）
[root@yangge ~]# cat /etc/hostname 					# 主机名配置文件，可以直接修改该文件
tianyun.qfedu.com
[root@yangge ~]# hostname
tianyun.qfedu.com

- 方法二
[root@yangge ~]# vim /etc/hostname					# 下次重启才会读取配置文件，生效
new.qfedu.com	
[root@yangge ~]# hostname new.qfedu.com				# 临时修改，仅本次有效

远程重新连接查看
[root@tianyun ~]#									# 提示符主机名显示为tianyun


- 主机名解析 /etc/hosts【强烈要求实现】					# 如果主机名不能解析，会导致如Apache启动慢
[root@tianyun ~]# vim /etc/hosts
192.168.92.152  tianyun.qfedu.com tianyun
[root@tianyun ~]# ping -c1 tianyun.qfedu.com
[root@tianyun ~]# ping -c1 tianyun
```

### 案例5：动态配置【不推荐】

- **自动获取IP**：从DHCP服务器动态获取IP配置
- **管理方便**：适合客户端设备，减少手动配置工作
- **地址可能变化**：租约到期后可能获取不同IP

```bash
[root@yangge ~]# nmcli connection show 				# 查看连接名
NAME   UUID                                  TYPE      DEVICE 
ens33  dc8d563f-635e-4f39-a93f-fd1febea5c92  ethernet  ens33  

[root@yangge ~]# vim /etc/sysconfig/network-scripts/ifcfg-ens33
TYPE=Ethernet
PROXY_METHOD=none
BROWSER_ONLY=no
BOOTPROTO=auto										# 动态auto或dhcp
DEFROUTE=yes
IPV4_FAILURE_FATAL=no
IPV6INIT=yes
IPV6_AUTOCONF=yes
IPV6_DEFROUTE=yes
IPV6_FAILURE_FATAL=no
IPV6_ADDR_GEN_MODE=stable-privacy
NAME=ens33
UUID=dc8d563f-635e-4f39-a93f-fd1febea5c92
DEVICE=ens33
ONBOOT=yes

[root@yangge ~]# nmcli connection reload 			# 手动修改文件，必须reload
[root@yangge ~]# nmcli connection up ens33			# 激活连接

- 扩展知识（DHCP客户端手动释放release和获取的方法）
[root@yangge ~]# dhclient -r ens33					# release释放

[root@yangge ~]# dhclient -v ens33
Internet Systems Consortium DHCP Client 4.2.5
Copyright 2004-2013 Internet Systems Consortium.
All rights reserved.
For info, please visit https://www.isc.org/software/dhcp/

Listening on LPF/ens33/00:0c:29:93:92:66
Sending on   LPF/ens33/00:0c:29:93:92:66
Sending on   Socket/fallback
DHCPDISCOVER on ens33 to 255.255.255.255 port 67 interval 4 (xid=0x30333a1d)		1. 谁可以提供给我IP
DHCPREQUEST on ens33 to 255.255.255.255 port 67 (xid=0x30333a1d)					3. 请求租用IP
DHCPOFFER from 192.168.92.254														2. DHCP服务器响应
DHCPACK from 192.168.92.254 (xid=0x30333a1d)										4. DHCP服务器确认
bound to 192.168.92.130 -- renewal in 788 seconds.
```

### 案例6：添加/删除连接【可选】

```bash
- 添加新的连接（配置）
[root@yangge ~]# nmcli connection add \		# 增加一个连接（配置）
> type ethernet \							# 网络的类型，以太网
> ifname ens33 \							# if(interface),接口（设备）的名称
> con-name zhuzhuxia \						# 新建连接（配置）的名称
> ipv4.method manual \
> ipv4.addresses 1.1.1.10/8 \
> ipv4.gateway 1.1.1.1 \
> ipv4.dns 1.1.1.1

[root@yangge ~]# nmcli connection show 
NAME       UUID                                  TYPE      DEVICE 
ens33      3dc71aa4-c4c3-4411-b5b9-18cc45569826  ethernet  ens33  
zhuzhuxia  eca4bd98-a2f7-45f4-9ba4-3cabc823dd25  ethernet  --     

[root@yangge ~]# cat /etc/sysconfig/network-scripts/ifcfg-zhuzhuxia 
TYPE=Ethernet
PROXY_METHOD=none
BROWSER_ONLY=no
BOOTPROTO=none
IPADDR=1.1.1.10
PREFIX=8
GATEWAY=1.1.1.1
DNS1=1.1.1.1
DEFROUTE=yes
IPV4_FAILURE_FATAL=no
IPV6INIT=yes
IPV6_AUTOCONF=yes
IPV6_DEFROUTE=yes
IPV6_FAILURE_FATAL=no
IPV6_ADDR_GEN_MODE=stable-privacy
NAME=zhuzhuxia
UUID=eca4bd98-a2f7-45f4-9ba4-3cabc823dd25
DEVICE=ens33
ONBOOT=yes

[root@yangge ~]# nmcli connection up zhuzhuxia		# 激活连接zhuzhuxia

- 删除连接
[root@yangge ~]# nmcli connection delete zhuzhuxia 
Connection 'zhuzhuxia' (eca4bd98-a2f7-45f4-9ba4-3cabc823dd25) successfully deleted.
[root@yangge ~]# 
[root@yangge ~]# nmcli connection show 
NAME   UUID                                  TYPE      DEVICE 
ens33  3dc71aa4-c4c3-4411-b5b9-18cc45569826  ethernet  ens33  

[root@yangge ~]# ls /etc/sysconfig/network-scripts/
ifcfg-ens33  ifdown-ippp  ifdown-routes    ifup    ifup-ipv6   ifup-ppp       ifup-tunnel
ifcfg-lo  ifdown-ipv6  ifdown-sit  ifup-aliases  ifup-isdn   ifup-routes    ifup-wireless
```

### 案例7：配置网络-tui【不推荐】

```
[root@yangge ~]# nmtui
```

![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/15LnGBjmcIEQ1q1PYRDwc11jHibkyJ7Kbk53LFWIQmjUlHFhrxA6MmIqydsw3IuZ8nMUHuGEqQrZ1E3CprSNl6Q/0?from=appmsg&wxfrom=12&wx_fmt=jpg&tp=webp&usePicPrefetch=1&watermark=1)

![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/15LnGBjmcIEQ1q1PYRDwc11jHibkyJ7Kb0185l9Wbiab5lEm7bX5FyK4Cic40abGvmqwSMACpIpGrHM2jraCvKeNA/0?from=appmsg&wxfrom=12&wx_fmt=jpg&tp=webp&watermark=1)

## 五、注意事项

1. NetworkManager会覆盖手动修改的`/etc/sysconfig/network-scripts/`下的配置文件
2. 对于服务器，建议使用NetworkManager的文本模式(nmcli/nmtui)
3. 可能的报错及解决方案

```bash
[root@localhost wxh]# nmcli connection up ens36
Error: Connection activation failed: No suitable device found for this connection (device lo not available because device is strictly unmanaged).

问题：设备没有被NetworkManager接管

解决方案：
systemctl stop NetworkManager
rm -rf /var/lib/NetworkManager/NetworkManager.state
systemctl start NetworkManager
```

## 六、本节作业

```bash
1. 早期eth0 和 当前ens33 有什么区别？ （挂载设备使用的两方法：/dev/sdb1  UUID）

2. 了解网卡命令的规则

3. device 和 connection 的关系
[root@yangge ~]# nmcli device status 
DEVICE  TYPE      STATE      CONNECTION 
ens33   ethernet  connected  ens33      
lo      loopback  unmanaged  --         

[root@yangge ~]# nmcli connection show 
NAME   UUID                                  TYPE      DEVICE 
ens33  dc8d563f-635e-4f39-a93f-fd1febea5c92  ethernet  ens33  

[root@yangge ~]# device(物理网络设备): ens33  -------> connection1: 1.1.1.1
[root@yangge ~]#                            -------> connection2: 2.2.2.2
[root@yangge ~]#                            -------> connection3: 3.3.3.3 (active)
[root@yangge ~]#                            -------> connection4: DHCP获取

[root@yangge ~]# connection(连接)  ----------- configuration(配置) 网卡的配置文件

4. 了解DHCP客户端获取IP的4个过程
DHCPDISCOVER on ens33 to 255.255.255.255 port 67 interval 4 (xid=0x30333a1d)		1. 谁可以提供给我IP
DHCPOFFER from 192.168.92.254														2. DHCP服务器响应
DHCPREQUEST on ens33 to 255.255.255.255 port 67 (xid=0x30333a1d)					3. 请求租用IP
DHCPACK from 192.168.92.254 (xid=0x30333a1d)										4. DHCP服务器确认

5. 准备3台CentOS服务器，按如下要求配置
- 最小化安装
- 配置如下表

- 防火墙开机不启动
[root@tianyun ~]# systemctl disable firewalld

- SELinux开机不启动
[root@tianyun ~]# vim /etc/sysconfig/selinux 
SELINUX=disabled

- VM做好快照: 0 or clear（关机状态）
```

| 主机名      | IP (静态)   | YUM源         | SSH配置     | yange passwd（sudo） | root passwd |
| ----------- | ----------- | ------------- | ----------- | -------------------- | ----------- |
| `server-01` | `x.x.x.101` | `base`+`EPEL` | `UseDNS no` | `456`                | `123`       |
| `server-02` | `x.x.x.102` | `base`+`EPEL` | `UseDNS no` | `456`                | `123`       |
| `server-03` | `x.x.x.103` | `base`+`EPEL` | `UseDNS no` | `456`                | `123`       |
|             |             |               |             |                      |             |
|             |             |               |             |                      |             |
|             |             |               |             |                      |             |

```bash
6. Windows hosts文件解析 C:\Windows\System32\drivers\etc\hosts
x.x.x.101		server-01
x.x.x.102		server-02
x.x.x.103		server-03
```
