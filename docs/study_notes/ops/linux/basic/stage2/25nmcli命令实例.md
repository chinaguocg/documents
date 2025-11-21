# nmcli命令实例：

```
nmcli device status  # 缩写：nmcli d status
```

```
nmcli connection show  # 缩写：nmcli c show
```

```
# 按连接名查询（推荐，直观） 
nmcli connection show "work-eth" 
```

```
查看单个连接的详细配置（比如查 IP、网关）
# 按UUID查询（适用于连接名重复场景） 
nmcli connection show a1b2c3d4-1234-5678-90ab-cdef01234567 

# 筛选关键信息（IP、网关、DNS） 
nmcli connection show "ens33" | grep -E"IP4.ADDRESS|IP4.GATEWAY|IP4.DNS"

```

```
查看设备详细信息（MAC 地址、速率等）
nmcli device show ens33  # 查看以太网ens33的详细信息 
nmcli device show wlp2s0  # 查看无线网卡wlp2s0的详细信息
```

```bash
#激活（启用）某个连接
nmcli connection up "static-ens33"
```

```bash
断开（禁用）某个连接
nmcli connection down "work-eth"  # 缩写：nmcli c down "work-eth"
```

```bash
创建以太网静态 IP 连接
nmcli connection add \
  type ethernet \
  con-name "static-eth-100" \
  ifname ens33 \
  ip4 192.168.1.100/24 \
  gw4 192.168.1.1 \
  dns4 223.5.5.5
```

```bash
修改静态 IP 和网关
nmcli connection modify "static-eth-100" ip4 192.168.1.101/24 gw4 192.168.1.2
nmcli c up "static-eth-100"  # 修改后必须重新激活生效
```

```
修改 DNS
# 把"static-eth-100"的DNS改成8.8.8.8（谷歌DNS）和119.29.29.29（腾讯DNS） nmcli connection modify "static-eth-100" dns4 "8.8.8.8,119.29.29.29" nmcli c up "static-eth-100"
```

