# CentOS Linux 路由器功能实现

![](https://i1.hdslb.com/bfs/new_dyn/334a4a9c6aa4380e97824f80f0fb50191739461868.png@1192w.avif)

- 准备工作
- 新建四台虚拟机，命名分别为：路由器、r1、h1、h2，系统均安装CentOS Linux 7（可以装好一台之后再克隆三台）
- 路由器需要添加网卡
  ![](https://i1.hdslb.com/bfs/new_dyn/348ee83a76113e7a9741090d4375e4d61739461868.png@1192w.avif)
- 路由器配置三块网卡，ens33连接外网，ens37连接r1，ens38连接h1和h2
- 路由器配置步骤
```bash
[root@bogon ~]# ip a
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN qlen 1
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
       valid_lft forever preferred_lft forever
    inet6 ::1/128 scope host 
       valid_lft forever preferred_lft forever
2: ens33: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc pfifo_fast state UP qlen 1000
    link/ether 00:0c:29:f9:99:d6 brd ff:ff:ff:ff:ff:ff
    inet 192.168.230.136/24 brd 192.168.230.255 scope global dynamic ens33
       valid_lft 1720sec preferred_lft 1720sec
    inet6 fe80::274b:2658:8df0:7958/64 scope link tentative dadfailed 
       valid_lft forever preferred_lft forever
    inet6 fe80::c39b:370b:756c:d6cf/64 scope link tentative dadfailed 
       valid_lft forever preferred_lft forever
    inet6 fe80::569a:d1da:14ff:ac0d/64 scope link tentative dadfailed 
       valid_lft forever preferred_lft forever
[root@bogon ~]# shutdown -h now

Connection closed by foreign host.

Disconnected from remote host(路由器) at 15:25:25.

Type `help' to learn how to use Xshell prompt.
[c:\~]$ 

Connecting to 192.168.230.136:22...
Connection established.
To escape to local shell, press 'Ctrl+Alt+]'.

WARNING! The remote SSH server rejected X11 forwarding request.
Last login: Fri Nov 21 02:27:22 2025
[root@bogon ~]# ip a
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN qlen 1
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
       valid_lft forever preferred_lft forever
    inet6 ::1/128 scope host 
       valid_lft forever preferred_lft forever
2: ens33: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc pfifo_fast state UP qlen 1000
    link/ether 00:0c:29:f9:99:d6 brd ff:ff:ff:ff:ff:ff
    inet 192.168.230.136/24 brd 192.168.230.255 scope global dynamic ens33
       valid_lft 1741sec preferred_lft 1741sec
    inet6 fe80::274b:2658:8df0:7958/64 scope link tentative dadfailed 
       valid_lft forever preferred_lft forever
    inet6 fe80::c39b:370b:756c:d6cf/64 scope link tentative dadfailed 
       valid_lft forever preferred_lft forever
    inet6 fe80::569a:d1da:14ff:ac0d/64 scope link tentative dadfailed 
       valid_lft forever preferred_lft forever
3: ens37: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc pfifo_fast state UP qlen 1000
    link/ether 00:0c:29:f9:99:e0 brd ff:ff:ff:ff:ff:ff
    inet 192.168.230.137/24 brd 192.168.230.255 scope global dynamic ens37
       valid_lft 1742sec preferred_lft 1742sec
    inet6 fe80::5c55:3bdd:3bd7:545b/64 scope link 
       valid_lft forever preferred_lft forever
4: ens38: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc pfifo_fast state UP qlen 1000
    link/ether 00:0c:29:f9:99:ea brd ff:ff:ff:ff:ff:ff
    inet 192.168.230.138/24 brd 192.168.230.255 scope global dynamic ens38
       valid_lft 1741sec preferred_lft 1741sec
    inet6 fe80::ee37:6014:518d:847b/64 scope link 
       valid_lft forever preferred_lft forever
[root@bogon ~]# vim /etc/sysconfig/network-scripts/ifcfg-ens33 
[root@bogon ~]# cat /etc/sysconfig/network-scripts/ifcfg-ens33 
TYPE="Ethernet"
BOOTPROTO="dhcp"
NAME="ens33"
DEVICE="ens33"
ONBOOT="yes"
[root@bogon ~]# cd /etc/sysconfig/network-scripts/
[root@bogon network-scripts]# ll
total 224
-rw-r--r--. 1 root root    74 Nov 21 02:33 ifcfg-ens33
-rw-r--r--. 1 root root   254 May  3  2017 ifcfg-lo
lrwxrwxrwx. 1 root root    24 Nov 20 22:35 ifdown -> ../../../usr/sbin/ifdown
-rwxr-xr-x. 1 root root   654 May  3  2017 ifdown-bnep
-rwxr-xr-x. 1 root root  6571 May  3  2017 ifdown-eth
-rwxr-xr-x. 1 root root   781 May  3  2017 ifdown-ippp
-rwxr-xr-x. 1 root root  4540 May  3  2017 ifdown-ipv6
lrwxrwxrwx. 1 root root    11 Nov 20 22:35 ifdown-isdn -> ifdown-ippp
-rwxr-xr-x. 1 root root  1768 May  3  2017 ifdown-post
-rwxr-xr-x. 1 root root  1068 May  3  2017 ifdown-ppp
-rwxr-xr-x. 1 root root   870 May  3  2017 ifdown-routes
-rwxr-xr-x. 1 root root  1456 May  3  2017 ifdown-sit
-rwxr-xr-x. 1 root root  1621 Aug  3  2017 ifdown-Team
-rwxr-xr-x. 1 root root  1556 Apr 15  2016 ifdown-TeamPort
-rwxr-xr-x. 1 root root  1462 May  3  2017 ifdown-tunnel
lrwxrwxrwx. 1 root root    22 Nov 20 22:35 ifup -> ../../../usr/sbin/ifup
-rwxr-xr-x. 1 root root 12312 May  3  2017 ifup-aliases
-rwxr-xr-x. 1 root root   910 May  3  2017 ifup-bnep
-rwxr-xr-x. 1 root root 12680 May  3  2017 ifup-eth
-rwxr-xr-x. 1 root root 12075 May  3  2017 ifup-ippp
-rwxr-xr-x. 1 root root 11893 May  3  2017 ifup-ipv6
lrwxrwxrwx. 1 root root     9 Nov 20 22:35 ifup-isdn -> ifup-ippp
-rwxr-xr-x. 1 root root   650 May  3  2017 ifup-plip
-rwxr-xr-x. 1 root root  1064 May  3  2017 ifup-plusb
-rwxr-xr-x. 1 root root  3433 May  3  2017 ifup-post
-rwxr-xr-x. 1 root root  4154 May  3  2017 ifup-ppp
-rwxr-xr-x. 1 root root  2001 May  3  2017 ifup-routes
-rwxr-xr-x. 1 root root  3303 May  3  2017 ifup-sit
-rwxr-xr-x. 1 root root  1755 Apr 15  2016 ifup-Team
-rwxr-xr-x. 1 root root  1876 Apr 15  2016 ifup-TeamPort
-rwxr-xr-x. 1 root root  2711 May  3  2017 ifup-tunnel
-rwxr-xr-x. 1 root root  1836 May  3  2017 ifup-wireless
-rwxr-xr-x. 1 root root  5419 May  3  2017 init.ipv6-global
-rw-r--r--. 1 root root 18919 May  3  2017 network-functions
-rw-r--r--. 1 root root 31027 May  3  2017 network-functions-ipv6
[root@bogon network-scripts]# systemctl restart network
[root@bogon network-scripts]# 
[root@bogon network-scripts]# 
[root@bogon network-scripts]# ping www.baidu.com
PING www.a.shifen.com (110.242.70.57) 56(84) bytes of data.
64 bytes from 110.242.70.57 (110.242.70.57): icmp_seq=1 ttl=128 time=14.6 ms
64 bytes from 110.242.70.57 (110.242.70.57): icmp_seq=2 ttl=128 time=13.5 ms
64 bytes from 110.242.70.57 (110.242.70.57): icmp_seq=3 ttl=128 time=13.1 ms
64 bytes from 110.242.70.57 (110.242.70.57): icmp_seq=4 ttl=128 time=12.6 ms
^C
--- www.a.shifen.com ping statistics ---
4 packets transmitted, 4 received, 0% packet loss, time 3006ms
rtt min/avg/max/mdev = 12.638/13.486/14.692/0.774 ms
[root@bogon network-scripts]# if a
> ^C
[root@bogon network-scripts]# ip a
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN qlen 1
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
       valid_lft forever preferred_lft forever
    inet6 ::1/128 scope host 
       valid_lft forever preferred_lft forever
2: ens33: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc pfifo_fast state UP qlen 1000
    link/ether 00:0c:29:f9:99:d6 brd ff:ff:ff:ff:ff:ff
    inet 192.168.230.136/24 brd 192.168.230.255 scope global dynamic ens33
       valid_lft 1776sec preferred_lft 1776sec
    inet6 fe80::20c:29ff:fef9:99d6/64 scope link 
       valid_lft forever preferred_lft forever
3: ens37: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc pfifo_fast state UP qlen 1000
    link/ether 00:0c:29:f9:99:e0 brd ff:ff:ff:ff:ff:ff
    inet 192.168.230.137/24 brd 192.168.230.255 scope global dynamic ens37
       valid_lft 1665sec preferred_lft 1665sec
    inet6 fe80::5c55:3bdd:3bd7:545b/64 scope link 
       valid_lft forever preferred_lft forever
4: ens38: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc pfifo_fast state UP qlen 1000
    link/ether 00:0c:29:f9:99:ea brd ff:ff:ff:ff:ff:ff
    inet 192.168.230.138/24 brd 192.168.230.255 scope global dynamic ens38
       valid_lft 1645sec preferred_lft 1645sec
    inet6 fe80::ee37:6014:518d:847b/64 scope link 
       valid_lft forever preferred_lft forever
[root@bogon network-scripts]# cp -rf ifcfg-ens33 ifcfg-ens37
[root@bogon network-scripts]# cp -rf ifcfg-ens33 ifcfg-ens38
[root@bogon network-scripts]# ll
total 232
-rw-r--r--. 1 root root    74 Nov 21 02:33 ifcfg-ens33
-rw-r--r--. 1 root root    74 Nov 21 02:42 ifcfg-ens37
-rw-r--r--. 1 root root    74 Nov 21 02:43 ifcfg-ens38
-rw-r--r--. 1 root root   254 May  3  2017 ifcfg-lo
lrwxrwxrwx. 1 root root    24 Nov 20 22:35 ifdown -> ../../../usr/sbin/ifdown
-rwxr-xr-x. 1 root root   654 May  3  2017 ifdown-bnep
-rwxr-xr-x. 1 root root  6571 May  3  2017 ifdown-eth
-rwxr-xr-x. 1 root root   781 May  3  2017 ifdown-ippp
-rwxr-xr-x. 1 root root  4540 May  3  2017 ifdown-ipv6
lrwxrwxrwx. 1 root root    11 Nov 20 22:35 ifdown-isdn -> ifdown-ippp
-rwxr-xr-x. 1 root root  1768 May  3  2017 ifdown-post
-rwxr-xr-x. 1 root root  1068 May  3  2017 ifdown-ppp
-rwxr-xr-x. 1 root root   870 May  3  2017 ifdown-routes
-rwxr-xr-x. 1 root root  1456 May  3  2017 ifdown-sit
-rwxr-xr-x. 1 root root  1621 Aug  3  2017 ifdown-Team
-rwxr-xr-x. 1 root root  1556 Apr 15  2016 ifdown-TeamPort
-rwxr-xr-x. 1 root root  1462 May  3  2017 ifdown-tunnel
lrwxrwxrwx. 1 root root    22 Nov 20 22:35 ifup -> ../../../usr/sbin/ifup
-rwxr-xr-x. 1 root root 12312 May  3  2017 ifup-aliases
-rwxr-xr-x. 1 root root   910 May  3  2017 ifup-bnep
-rwxr-xr-x. 1 root root 12680 May  3  2017 ifup-eth
-rwxr-xr-x. 1 root root 12075 May  3  2017 ifup-ippp
-rwxr-xr-x. 1 root root 11893 May  3  2017 ifup-ipv6
lrwxrwxrwx. 1 root root     9 Nov 20 22:35 ifup-isdn -> ifup-ippp
-rwxr-xr-x. 1 root root   650 May  3  2017 ifup-plip
-rwxr-xr-x. 1 root root  1064 May  3  2017 ifup-plusb
-rwxr-xr-x. 1 root root  3433 May  3  2017 ifup-post
-rwxr-xr-x. 1 root root  4154 May  3  2017 ifup-ppp
-rwxr-xr-x. 1 root root  2001 May  3  2017 ifup-routes
-rwxr-xr-x. 1 root root  3303 May  3  2017 ifup-sit
-rwxr-xr-x. 1 root root  1755 Apr 15  2016 ifup-Team
-rwxr-xr-x. 1 root root  1876 Apr 15  2016 ifup-TeamPort
-rwxr-xr-x. 1 root root  2711 May  3  2017 ifup-tunnel
-rwxr-xr-x. 1 root root  1836 May  3  2017 ifup-wireless
-rwxr-xr-x. 1 root root  5419 May  3  2017 init.ipv6-global
-rw-r--r--. 1 root root 18919 May  3  2017 network-functions
-rw-r--r--. 1 root root 31027 May  3  2017 network-functions-ipv6
[root@bogon network-scripts]# vim ifcfg-ens37
[root@bogon network-scripts]# ping 10.0.100.1
PING 10.0.100.1 (10.0.100.1) 56(84) bytes of data.
^C
--- 10.0.100.1 ping statistics ---
11 packets transmitted, 0 received, 100% packet loss, time 10000ms

[root@bogon network-scripts]# cat ifcfg-ens37 > ifcfg-ens38
[root@bogon network-scripts]# vim ifcfg-ens38
[root@bogon network-scripts]# cat ifcfg-ens38
TYPE="Ethernet"
BOOTPROTO="static"
NAME="ens38"
DEVICE="ens38"
ONBOOT="yes"
IPADDR=10.0.200.1
PREFIX=24
DNS1=114.114.114.114
[root@bogon network-scripts]# cat ifcfg-ens37
TYPE="Ethernet"
BOOTPROTO="static"
NAME="ens37"
DEVICE="ens37"
ONBOOT="yes"
IPADDR=10.0.100.1
PREFIX=24
DNS1=114.114.114.114
[root@bogon network-scripts]# echo 1 > /proc/sys/net/ipv4/ip_forward
[root@bogon network-scripts]# systemctl restart network
[root@bogon network-scripts]# ifconfig
ens33: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 192.168.230.136  netmask 255.255.255.0  broadcast 192.168.230.255
        inet6 fe80::20c:29ff:fef9:99d6  prefixlen 64  scopeid 0x20<link>
        ether 00:0c:29:f9:99:d6  txqueuelen 1000  (Ethernet)
        RX packets 983  bytes 81887 (79.9 KiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 607  bytes 77813 (75.9 KiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

ens37: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 10.0.100.1  netmask 255.255.255.0  broadcast 10.0.100.255
        inet6 fe80::20c:29ff:fef9:99e0  prefixlen 64  scopeid 0x20<link>
        ether 00:0c:29:f9:99:e0  txqueuelen 1000  (Ethernet)
        RX packets 351  bytes 24615 (24.0 KiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 37  bytes 3730 (3.6 KiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

ens38: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 10.0.200.1  netmask 255.255.255.0  broadcast 10.0.200.255
        inet6 fe80::20c:29ff:fef9:99ea  prefixlen 64  scopeid 0x20<link>
        ether 00:0c:29:f9:99:ea  txqueuelen 1000  (Ethernet)
        RX packets 1099  bytes 86923 (84.8 KiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 510  bytes 82535 (80.6 KiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536
        inet 127.0.0.1  netmask 255.0.0.0
        inet6 ::1  prefixlen 128  scopeid 0x10<host>
        loop  txqueuelen 1  (Local Loopback)
        RX packets 68  bytes 5920 (5.7 KiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 68  bytes 5920 (5.7 KiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

[root@bogon network-scripts]# ip a
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN qlen 1
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
       valid_lft forever preferred_lft forever
    inet6 ::1/128 scope host 
       valid_lft forever preferred_lft forever
2: ens33: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc pfifo_fast state UP qlen 1000
    link/ether 00:0c:29:f9:99:d6 brd ff:ff:ff:ff:ff:ff
    inet 192.168.230.136/24 brd 192.168.230.255 scope global dynamic ens33
       valid_lft 1783sec preferred_lft 1783sec
    inet6 fe80::20c:29ff:fef9:99d6/64 scope link 
       valid_lft forever preferred_lft forever
3: ens37: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc pfifo_fast state UP qlen 1000
    link/ether 00:0c:29:f9:99:e0 brd ff:ff:ff:ff:ff:ff
    inet 10.0.100.1/24 brd 10.0.100.255 scope global ens37
       valid_lft forever preferred_lft forever
    inet6 fe80::20c:29ff:fef9:99e0/64 scope link 
       valid_lft forever preferred_lft forever
4: ens38: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc pfifo_fast state UP qlen 1000
    link/ether 00:0c:29:f9:99:ea brd ff:ff:ff:ff:ff:ff
    inet 10.0.200.1/24 brd 10.0.200.255 scope global ens38
       valid_lft forever preferred_lft forever
    inet6 fe80::20c:29ff:fef9:99ea/64 scope link 
       valid_lft forever preferred_lft forever
[root@bogon network-scripts]# ping www.baidu.com
PING www.a.shifen.com (110.242.70.57) 56(84) bytes of data.
64 bytes from 110.242.70.57 (110.242.70.57): icmp_seq=1 ttl=128 time=12.5 ms
64 bytes from 110.242.70.57 (110.242.70.57): icmp_seq=2 ttl=128 time=12.8 ms
64 bytes from 110.242.70.57 (110.242.70.57): icmp_seq=3 ttl=128 time=12.5 ms
64 bytes from 110.242.70.57 (110.242.70.57): icmp_seq=4 ttl=128 time=12.8 ms
64 bytes from 110.242.70.57 (110.242.70.57): icmp_seq=5 ttl=128 time=12.7 ms
^C
--- www.a.shifen.com ping statistics ---
5 packets transmitted, 5 received, 0% packet loss, time 4007ms
rtt min/avg/max/mdev = 12.505/12.700/12.876/0.209 ms
[root@bogon network-scripts]# cat ifcfg-ens37
TYPE="Ethernet"
BOOTPROTO="static"
NAME="ens37"
DEVICE="ens37"
ONBOOT="yes"
IPADDR=10.0.100.1
PREFIX=24
DNS1=114.114.114.114
[root@bogon network-scripts]# cat ifcfg-ens38
TYPE="Ethernet"
BOOTPROTO="static"
NAME="ens38"
DEVICE="ens38"
ONBOOT="yes"
IPADDR=10.0.200.1
PREFIX=24
DNS1=114.114.114.114
[root@bogon network-scripts]# ifconfig
ens33: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 192.168.230.136  netmask 255.255.255.0  broadcast 192.168.230.255
        inet6 fe80::20c:29ff:fef9:99d6  prefixlen 64  scopeid 0x20<link>
        ether 00:0c:29:f9:99:d6  txqueuelen 1000  (Ethernet)
        RX packets 2252  bytes 173938 (169.8 KiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 967  bytes 113514 (110.8 KiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

ens37: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 10.0.100.1  netmask 255.255.255.0  broadcast 10.0.100.255
        inet6 fe80::20c:29ff:fef9:99e0  prefixlen 64  scopeid 0x20<link>
        ether 00:0c:29:f9:99:e0  txqueuelen 1000  (Ethernet)
        RX packets 1026  bytes 66465 (64.9 KiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 70  bytes 6166 (6.0 KiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

ens38: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 10.0.200.1  netmask 255.255.255.0  broadcast 10.0.200.255
        inet6 fe80::20c:29ff:fef9:99ea  prefixlen 64  scopeid 0x20<link>
        ether 00:0c:29:f9:99:ea  txqueuelen 1000  (Ethernet)
        RX packets 1774  bytes 129421 (126.3 KiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 521  bytes 83423 (81.4 KiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536
        inet 127.0.0.1  netmask 255.0.0.0
        inet6 ::1  prefixlen 128  scopeid 0x10<host>
        loop  txqueuelen 1  (Local Loopback)
        RX packets 68  bytes 5920 (5.7 KiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 68  bytes 5920 (5.7 KiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

[root@bogon network-scripts]# ping www.baidu.com
PING www.a.shifen.com (110.242.70.57) 56(84) bytes of data.
64 bytes from 110.242.70.57 (110.242.70.57): icmp_seq=1 ttl=128 time=11.6 ms
64 bytes from 110.242.70.57 (110.242.70.57): icmp_seq=2 ttl=128 time=13.3 ms
64 bytes from 110.242.70.57 (110.242.70.57): icmp_seq=3 ttl=128 time=12.8 ms
64 bytes from 110.242.70.57 (110.242.70.57): icmp_seq=4 ttl=128 time=12.4 ms
^C
--- www.a.shifen.com ping statistics ---
5 packets transmitted, 4 received, 20% packet loss, time 4008ms
rtt min/avg/max/mdev = 11.632/12.580/13.394/0.645 ms
[root@bogon network-scripts]# vim ifcfg-ens38
[root@bogon network-scripts]# vim ifcfg-ens37
[root@bogon network-scripts]# vim ifcfg-ens33
[root@bogon network-scripts]# systemctl restart network
[root@bogon network-scripts]# ping www.baidu.com
PING www.a.shifen.com (110.242.69.21) 56(84) bytes of data.
64 bytes from 110.242.69.21 (110.242.69.21): icmp_seq=1 ttl=128 time=11.0 ms
64 bytes from 110.242.69.21 (110.242.69.21): icmp_seq=2 ttl=128 time=11.0 ms
64 bytes from 110.242.69.21 (110.242.69.21): icmp_seq=3 ttl=128 time=10.3 ms
^C
--- www.a.shifen.com ping statistics ---
3 packets transmitted, 3 received, 0% packet loss, time 2003ms
rtt min/avg/max/mdev = 10.330/10.820/11.088/0.357 ms
[root@bogon network-scripts]# echo 1 > /proc/sys/net/ipv4/ip_forward
[root@bogon network-scripts]# ping www.baidu.com
PING www.a.shifen.com (110.242.70.57) 56(84) bytes of data.
64 bytes from 110.242.70.57 (110.242.70.57): icmp_seq=1 ttl=128 time=13.1 ms
64 bytes from 110.242.70.57 (110.242.70.57): icmp_seq=2 ttl=128 time=12.3 ms
64 bytes from 110.242.70.57 (110.242.70.57): icmp_seq=3 ttl=128 time=11.5 ms
64 bytes from 110.242.70.57 (110.242.70.57): icmp_seq=4 ttl=128 time=11.9 ms
64 bytes from 110.242.70.57 (110.242.70.57): icmp_seq=5 ttl=128 time=12.1 ms
64 bytes from 110.242.70.57 (110.242.70.57): icmp_seq=6 ttl=128 time=11.5 ms
^C
--- www.a.shifen.com ping statistics ---
6 packets transmitted, 6 received, 0% packet loss, time 5008ms
rtt min/avg/max/mdev = 11.513/12.105/13.133/0.567 ms
[root@bogon network-scripts]# ping 10.0.100.15
PING 10.0.100.15 (10.0.100.15) 56(84) bytes of data.
64 bytes from 10.0.100.15: icmp_seq=1 ttl=64 time=0.476 ms
64 bytes from 10.0.100.15: icmp_seq=2 ttl=64 time=0.412 ms
64 bytes from 10.0.100.15: icmp_seq=3 ttl=64 time=0.681 ms
^C
--- 10.0.100.15 ping statistics ---
3 packets transmitted, 3 received, 0% packet loss, time 2000ms
rtt min/avg/max/mdev = 0.412/0.523/0.681/0.114 ms
[root@bogon network-scripts]# ping 10.0.100.16
PING 10.0.100.16 (10.0.100.16) 56(84) bytes of data.
64 bytes from 10.0.100.16: icmp_seq=1 ttl=64 time=0.962 ms
64 bytes from 10.0.100.16: icmp_seq=2 ttl=64 time=0.696 ms
64 bytes from 10.0.100.16: icmp_seq=3 ttl=64 time=0.882 ms
64 bytes from 10.0.100.16: icmp_seq=4 ttl=64 time=0.918 ms
^C
--- 10.0.100.16 ping statistics ---
4 packets transmitted, 4 received, 0% packet loss, time 3003ms
rtt min/avg/max/mdev = 0.696/0.864/0.962/0.105 ms
[root@bogon network-scripts]# ping 10.0.200.15
PING 10.0.200.15 (10.0.200.15) 56(84) bytes of data.
64 bytes from 10.0.200.15: icmp_seq=1 ttl=64 time=0.941 ms
64 bytes from 10.0.200.15: icmp_seq=2 ttl=64 time=0.713 ms
64 bytes from 10.0.200.15: icmp_seq=3 ttl=64 time=0.785 ms
64 bytes from 10.0.200.15: icmp_seq=4 ttl=64 time=0.929 ms
^C
--- 10.0.200.15 ping statistics ---
4 packets transmitted, 4 received, 0% packet loss, time 3003ms
rtt min/avg/max/mdev = 0.713/0.842/0.941/0.096 ms
[root@bogon network-scripts]# vim ifcfg-ens33
[root@bogon network-scripts]# ip r
default via 192.168.230.2 dev ens33 proto static metric 100 
10.0.100.0/24 dev ens37 proto kernel scope link src 10.0.100.1 metric 100 
10.0.200.0/24 dev ens38 proto kernel scope link src 10.0.200.1 metric 100 
192.168.230.0/24 dev ens33 proto kernel scope link src 192.168.230.136 metric 100 
[root@bogon network-scripts]# 
```

- 修改其他三台机器的默认路由为 bogon 的 ens37 和 ens38 对应的 IP 地址即可。

- node6
```bash
[root@bogon ~]# ip a
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN qlen 1
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
       valid_lft forever preferred_lft forever
    inet6 ::1/128 scope host 
       valid_lft forever preferred_lft forever
2: ens33: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc pfifo_fast state UP qlen 1000
    link/ether 00:0c:29:34:99:41 brd ff:ff:ff:ff:ff:ff
    inet 192.168.230.134/24 brd 192.168.230.255 scope global dynamic ens33
       valid_lft 1619sec preferred_lft 1619sec
    inet6 fe80::c39b:370b:756c:d6cf/64 scope link 
       valid_lft forever preferred_lft forever
    inet6 fe80::569a:d1da:14ff:ac0d/64 scope link tentative dadfailed 
       valid_lft forever preferred_lft forever
[root@bogon ~]# vim /etc/sysconfig/network-scripts/ifcfg-ens33
[root@bogon ~]# cat /etc/sysconfig/network-scripts/ifcfg-ens33
TYPE="Ethernet"
BOOTPROTO="static"
NAME="ens33"
DEVICE="ens33"
ONBOOT="yes"
IPADDR=10.0.100.16
PREFIX=24
GATEWAY=10.0.100.1
DNS1=114.114.114.114
[root@bogon ~]# systemctl restart network

```

- node5
```bash
[root@bogon ~]# ip a
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN qlen 1
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
       valid_lft forever preferred_lft forever
    inet6 ::1/128 scope host 
       valid_lft forever preferred_lft forever
2: ens33: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc pfifo_fast state UP qlen 1000
    link/ether 00:0c:29:28:dc:fe brd ff:ff:ff:ff:ff:ff
    inet 192.168.230.133/24 brd 192.168.230.255 scope global dynamic ens33
       valid_lft 1760sec preferred_lft 1760sec
    inet6 fe80::569a:d1da:14ff:ac0d/64 scope link 
       valid_lft forever preferred_lft forever
[root@bogon ~]# vim /etc/sysconfig/network-scripts/ifcfg-ens33
[root@bogon ~]# systemctl restart network

```

- node7
```bash
[root@bogon ~]# vim /etc/sysconfig/network-scripts/ifcfg-ens33
[root@bogon ~]# systemctl restart network

```

- 测试各主机间的连通性。
- 至此，双网卡静态路由配置完成。