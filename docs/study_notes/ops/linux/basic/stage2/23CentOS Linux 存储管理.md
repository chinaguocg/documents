# 存储管理一传统分区

### 一 、存储基础

#### 1、初识硬盘

```bash
HDD（机械硬盘）： 像一张不断旋转的黑胶唱片，用唱臂（磁头）来读写数据。技术成熟、容量大、价格便宜，但速度慢、怕震动。
SSD（固态硬盘）： 像一个超大号的 U 盘，使用闪存芯片来存储数据。速度快、抗震、安静、轻便，但价格较贵，寿命有理论限制。
```
![](/documents/img/ops/linux/basic/disk/机械03.jpg)

![](/documents/img/ops/linux/basic/disk/机械02.jpg)

![](/documents/img/ops/linux/basic/disk/固态01.jpg)

**硬盘设备命名**

```shell
物理硬盘：		/dev/sd[a-z]
KVM虚拟化：		 /dev/vd[a-z]（半虚拟化驱动）
			 	/dev/sd[a-z]（全虚拟化驱动）
			 	
虚拟化产品（云主机）			 	
- `VMware Workstation`(个人) / `ESXI` + VMware vSphere (企业级虚拟化平台) /dev/s[a-z]
- `KVM` (开源) / KVM + OpenStack (企业级的虚拟化平台) /dev/vd[a-z]
```

**从存储连接方式**（注意：后期还会学到不同的存储方式）

```shell
- 本地存储 例如 IBM Power S1122 本地磁盘
- 外部存储 附加存储 scsi线 sata线 sas线
- 网络存储 以太网络(iscsi, glusterFS, ceph) 分布式

作业：了解 DAS、NAS、SAN 三种技术
```

#### 2、分区方案

GPT 新一代系统使用                            128分区

MBR 支持小于2T（严格来说是<2.1T）的硬盘    最多4个主分区

两种分区方案互转：危险！！！从MBR转GPT并不是无损的（要看具体分区方案），从GPT转传统MBR不能向下兼容，肯定丢失数据！

![](/documents/img/ops/linux/basic/disk/01.png)
![](/documents/img/ops/linux/basic/disk/02.png)
![](/documents/img/ops/linux/basic/disk/03.png)
![](/documents/img/ops/linux/basic/disk/04.png)
![](/documents/img/ops/linux/basic/disk/05.png)
![](/documents/img/ops/linux/basic/disk/06.png)
![](/documents/img/ops/linux/basic/disk/07.png)
![](/documents/img/ops/linux/basic/disk/08.png)

GPT（GUID Partition Table，全局唯一标识分区表）是一种现代的分区表格式，相比传统的MBR（主引导记录）分区方案有许多优势。

| 特性         | GPT                    | MBR                                           |
| ------------ | ---------------------- | --------------------------------------------- |
| 最大磁盘容量 | 9.4ZB (zettabytes)     | 2TB                                           |
| 最大分区数量 | 128个主分区            | 4个主分区(或3主+1扩展+逻辑分区)，最多14个分区 |
| 分区表位置   | 磁盘开头和结尾(有备份) | 仅磁盘开头                                    |
| 兼容性       | 需要UEFI支持           | 所有BIOS都支持                                |
| 安全性       | 有CRC校验和备份        | 无校验机制                                    |

**存储容量单位扫盲**

网络传输最小单位是比特

存储最小单位是字节

| 单位名称               | 缩写               | **常用二进制解释（进率1024）** | **国际单位制SI（进率1000）** | 大约容量（二进制）与场景             |
| :--------------------- | :----------------- | :----------------------------- | :--------------------------- | :----------------------------------- |
| 字节                   | Byte (B)           | 基本单位                       | 基本单位                     | 一个英文字符                         |
| 千字节                 | Kilobyte (KB)      | **1 KB = 1024 B**              | 1 KB = 1000 B                | 一段简短的文本                       |
| 兆字节                 | Megabyte (MB)      | **1 MB = 1024 KB**             | 1 MB = 1000 KB               | 一张高清图片，一首MP3                |
| 千兆字节（吉字节）     | Gigabyte (GB)      | **1 GB = 1024 MB**             | 1 GB = 1000 MB               | 一部标准画质电影                     |
| 太字节                 | Terabyte (TB)      | **1 TB = 1024 GB**             | 1 TB = 1000 GB               | 个人电脑硬盘，约250部高清电影        |
| 拍字节                 | Petabyte (PB)      | **1 PB = 1024 TB**             | 1 PB = 1000 TB               | 大型数据中心的存储量，大规模数据处理 |
| 艾字节                 | Exabyte (EB)       | **1 EB = 1024 PB**             | 1 EB = 1000 PB               | 全球互联网**月度**流量级别           |
| **泽字节（泽它字节）** | **Zettabyte (ZB)** | **1 ZB = 1024 EB**             | **1 ZB = 1000 EB**           | **全球数据总量级别**                 |
| 尧字节（佑它字节）     | Yottabyte (YB)     | **1 YB = 1024 ZB**             | 1 YB = 1000 ZB               | 未来超大规模数据计量单位             |

### 二、基本分区

#### 1、添加新硬盘

```shell
[root@qfedu.com ~]# ls -l /dev/sd*
brw-rw----. 1 root disk 8,  0 Nov  7 23:15 /dev/sda
brw-rw----. 1 root disk 8,  1 Nov  7 23:15 /dev/sda1
brw-rw----. 1 root disk 8,  2 Nov  7 23:15 /dev/sda2
brw-rw----. 1 root disk 8, 16 Nov  7 23:15 /dev/sdb
brw-rw----. 1 root disk 8, 32 Nov  7 23:15 /dev/sdc
[root@qfedu.com ~]# lsblk  		#查看磁盘设备
NAME            MAJ:MIN RM  SIZE RO TYPE MOUNTPOINT
sda               8:0    0   20G  0 disk 
├─sda1            8:1    0    1G  0 part /boot
└─sda2            8:2    0   19G  0 part 
  ├─centos-root 253:0    0   17G  0 lvm  /
  └─centos-swap 253:1    0    2G  0 lvm  [SWAP]
sdb               8:16   0   10G  0 disk 
sdc               8:32   0    8G  0 disk 
```

#### 2、gdisk（GPT）

1. 创建分区

```shell
[root@tianyun ~]# yum -y install gdisk  		# 安装分区工具
[root@tianyun ~]# gdisk -l /dev/sdb				# -l列出磁盘当前的分区信息
[root@tianyun ~]# gdisk /dev/sdb

# 创建第一分区
[root@tianyun ~]# gdisk /dev/sdb
GPT fdisk (gdisk) version 0.8.10

Partition table scan:							# 新硬盘，暂没有任何分区表	
  MBR: not present
  BSD: not present
  APM: not present
  GPT: not present

Creating new GPT entries.						# 由于没有分区，自动创建 GPT分区表

Command (? for help): n							# n,new建分区
Partition number (1-128, default 1):  			# 回车接受默认分区编号
First sector (34-41943006, default = 2048) or {+-}size{KMGTP}: 				# 首扇区回车默认
Last sector (2048-41943006, default = 41943006) or {+-}size{KMGTP}: +2G   	# 结束扇区不建议，+size
Current type is 'Linux filesystem'
Hex code or GUID (L to show codes, Enter = 8300): 							# 文件系统类型回车默认
Changed type of partition to 'Linux filesystem'
Command (? for help): w														# 保存

Final checks complete. About to write GPT data. THIS WILL OVERWRITE EXISTING
PARTITIONS!!

Do you want to proceed? (Y/N): y										
OK; writing new GUID partition table (GPT) to /dev/sdb.
The operation has completed successfully.

# 创建第二个分区
[root@tianyun ~]# gdisk /dev/sdb
GPT fdisk (gdisk) version 0.8.10

Partition table scan:
  MBR: protective
  BSD: not present
  APM: not present
  GPT: present

Found valid GPT with protective MBR; using GPT.

Command (? for help): p									# p, print打印分区表
Disk /dev/sdb: 41943040 sectors, 20.0 GiB
Logical sector size: 512 bytes
Disk identifier (GUID): C8C58096-5100-4AA7-B508-F3E60124E374
Partition table holds up to 128 entries
First usable sector is 34, last usable sector is 41943006
Partitions will be aligned on 2048-sector boundaries
Total free space is 37748669 sectors (18.0 GiB)

Number  Start (sector)    End (sector)  Size       Code  Name
   1            2048         4196351   2.0 GiB     8300  Linux filesystem

Command (? for help): n
Partition number (2-128, default 2): 
First sector (34-41943006, default = 4196352) or {+-}size{KMGTP}: 
Last sector (4196352-41943006, default = 41943006) or {+-}size{KMGTP}: +1G
Current type is 'Linux filesystem'
Hex code or GUID (L to show codes, Enter = 8300): 
Changed type of partition to 'Linux filesystem'

Command (? for help): w

Final checks complete. About to write GPT data. THIS WILL OVERWRITE EXISTING
PARTITIONS!!

Do you want to proceed? (Y/N): y
OK; writing new GUID partition table (GPT) to /dev/sdb.
The operation has completed successfully.
```

2. 创建文件系统（格式化）

```shell
[root@tianyun ~]# lsblk /dev/sdb
NAME   MAJ:MIN RM SIZE RO TYPE MOUNTPOINT
sdb      8:16   0  20G  0 disk 
├─sdb1   8:17   0   2G  0 part 
└─sdb2   8:18   0   1G  0 part 

[root@tianyun ~]# ls -l /dev/sdb*
brw-rw----. 1 root disk 8, 16 Jul 30 10:14 /dev/sdb
brw-rw----. 1 root disk 8, 17 Jul 30 10:14 /dev/sdb1
brw-rw----. 1 root disk 8, 18 Jul 30 10:14 /dev/sdb2

[root@tianyun ~]# mkfs.ext4 /dev/sdb1   	# 格式化成ext4文件系统
[root@tianyun ~]# mkfs.xfs /dev/sdc1   		# 格式化成xfs文件系统

- 了解Windows和Linux常用的文件系统
- 了解EXT4和XFS文件系统的区别
```

3. 挂载分区（临时）

```shell
[root@qfedu.com ~]# mkdir /mnt/disk1  		 # 创建挂载目录，生产环境看实际需求
[root@qfedu.com ~]# mkdir /mnt/disk2  		 # 创建挂载目录，生产环境看实际需求

[root@tianyun ~]# mount /dev/sdb1 /mnt/disk1		# 手动临时挂载
[root@tianyun ~]# mount /dev/sdb2 /mnt/disk2		# 手动临时挂载

[root@tianyun ~]# df -Th							# 查看文件系统挂载
Filesystem                      Type      Size  Used Avail Use% Mounted on
devtmpfs                        devtmpfs  475M     0  475M   0% /dev
tmpfs                           tmpfs     487M     0  487M   0% /dev/shm
tmpfs                           tmpfs     487M  7.7M  479M   2% /run
tmpfs                           tmpfs     487M     0  487M   0% /sys/fs/cgroup
/dev/mapper/centos_tianyun-root xfs       7.0G  1.3G  5.7G  19% /
/dev/sda1                       xfs      1014M  138M  877M  14% /boot
/dev/mapper/centos_tianyun-home xfs       5.0G   33M  5.0G   1% /home
/dev/mapper/centos_tianyun-var  xfs       5.0G  363M  4.7G   8% /var
tmpfs                           tmpfs      98M     0   98M   0% /run/user/0
/dev/sdb1                       ext4      2.0G  6.0M  1.8G   1% /mnt/disk1
/dev/sdb2                       xfs      1014M   33M  982M   4% /mnt/disk2
```

4. 开机自动挂载（永久）

```shell
为了演示效果，先卸载分区
[root@tianyun ~]# umount /dev/sdb1					# 使用设备名
[root@tianyun ~]# umount /mnt/disk2					# 使用挂载点

[root@tianyun ~]# vim /etc/fstab 					# File System table
/dev/sdb1                       /mnt/disk1              auto    defaults        0 0 
/dev/sdb2                       /mnt/disk2              xfs     defaults        0 0

[root@tianyun ~]# mount -a 							# 全部挂载（/etc/fstab）
[root@tianyun ~]# df -Th
Filesystem                      Type      Size  Used Avail Use% Mounted on
devtmpfs                        devtmpfs  475M     0  475M   0% /dev
tmpfs                           tmpfs     487M     0  487M   0% /dev/shm
tmpfs                           tmpfs     487M  7.7M  479M   2% /run
tmpfs                           tmpfs     487M     0  487M   0% /sys/fs/cgroup
/dev/mapper/centos_tianyun-root xfs       7.0G  1.3G  5.7G  19% /
/dev/sda1                       xfs      1014M  138M  877M  14% /boot
/dev/mapper/centos_tianyun-home xfs       5.0G   33M  5.0G   1% /home
/dev/mapper/centos_tianyun-var  xfs       5.0G  363M  4.7G   8% /var
tmpfs                           tmpfs      98M     0   98M   0% /run/user/0
/dev/sdb1                       ext4      2.0G  6.0M  1.8G   1% /mnt/disk1
/dev/sdb2                       xfs      1014M   33M  982M   4% /mnt/disk2

- 参数解释：
第1列:	挂载设备
		 (1) 设备名/dev/sda5	`警告：设备名可能会变`
		 (2) 设备UUID			`【强烈建议】`
第2列:	挂载点
第3列:	文件系统类型（ext4,xfs,nfs,auto）
第4列:	挂载选项（rw,ro,noexec），defaults（rw, suid, dev, exec, auto, nouser, and async） 
第5列:	是否对文件系统进行磁带备份：0 不备份
第6列:	是否开机检查文件系统：0 不检查

- 建议使用UUID挂载：
[root@tianyun ~]# umount /dev/sdb1					# 使用设备名
[root@tianyun ~]# umount /mnt/disk2					# 使用挂载点

- 获得相应分区的UUID
[root@tianyun ~]# blkid 
/dev/sda1: UUID="e63cc001-227e-4a4c-8821-3ec36d91e409" TYPE="xfs" 
/dev/sda2: UUID="IEsNd5-31TE-XoWm-bzNR-6OJP-nqJk-yodTR2" TYPE="LVM2_member" 
/dev/sdb1: UUID="738dc166-4f05-41ab-82d2-85337b16c3e7" TYPE="ext4" PARTLABEL="Linux filesystem" PARTUUID="39afff9c-1bb3-4927-a564-48860beaed13" 
/dev/sdb2: UUID="0162e937-493b-4c52-9881-e885cdb20974" TYPE="xfs" PARTLABEL="Linux filesystem" PARTUUID="b49874ca-849d-4246-b8c7-61c9bbd4b963" 
/dev/sr0: UUID="2020-11-02-15-15-23-00" LABEL="CentOS 7 x86_64" TYPE="iso9660" PTTYPE="dos" 
/dev/mapper/centos_tianyun-root: UUID="8b4938ef-8a21-4893-9050-5d595f761150" TYPE="xfs" 
/dev/mapper/centos_tianyun-swap: UUID="4a85401b-a6e2-42d9-8e57-7ebe85ecc7f9" TYPE="swap" 
/dev/mapper/centos_tianyun-home: UUID="35820681-6143-42d2-8313-ae4f8e8aeda1" TYPE="xfs" 
/dev/mapper/centos_tianyun-var: UUID="07109210-4715-4dff-8e83-b056d660804b" TYPE="xfs" 

- 获得相应分区的UUID
[root@tianyun ~]# lsblk -f
NAME                    FSTYPE      LABEL           UUID                                   MOUNTPOINT
sda                                                                                        
├─sda1                  xfs                         e63cc001-227e-4a4c-8821-3ec36d91e409   /boot
└─sda2                  LVM2_member                 IEsNd5-31TE-XoWm-bzNR-6OJP-nqJk-yodTR2 
  ├─centos_tianyun-root xfs                         8b4938ef-8a21-4893-9050-5d595f761150   /
  ├─centos_tianyun-swap swap                        4a85401b-a6e2-42d9-8e57-7ebe85ecc7f9   [SWAP]
  ├─centos_tianyun-home xfs                         35820681-6143-42d2-8313-ae4f8e8aeda1   /home
  └─centos_tianyun-var  xfs                         07109210-4715-4dff-8e83-b056d660804b   /var
sdb                                                                                        
├─sdb1                  ext4                        738dc166-4f05-41ab-82d2-85337b16c3e7   
└─sdb2                  xfs                         0162e937-493b-4c52-9881-e885cdb20974   
sdc                                                                                        
sdd                                                                                        
sr0                     iso9660     CentOS 7 x86_64 2020-11-02-15-15-23-00  

- 获得相应分区的UUID
[root@tianyun ~]# lsblk -f /dev/sdb
NAME   FSTYPE LABEL UUID                                 MOUNTPOINT
sdb                                                      
├─sdb1 ext4         738dc166-4f05-41ab-82d2-85337b16c3e7 
└─sdb2 xfs          0162e937-493b-4c52-9881-e885cdb20974 

- 将 fstab 文件中设备名替换为 UUID
[root@tianyun ~]# vim /etc/fstab
UUID="738dc166-4f05-41ab-82d2-85337b16c3e7"     /mnt/disk1      auto    defaults        0 0 
UUID="0162e937-493b-4c52-9881-e885cdb20974"     /mnt/disk2      xfs     defaults        0 0  

- mount -a 将会读取 fstab文件
[root@tianyun ~]# mount -a
[root@tianyun ~]# df
Filesystem                      1K-blocks    Used Available Use% Mounted on
devtmpfs                           485840       0    485840   0% /dev
tmpfs                              497848       0    497848   0% /dev/shm
tmpfs                              497848    7876    489972   2% /run
tmpfs                              497848       0    497848   0% /sys/fs/cgroup
/dev/mapper/centos_tianyun-root   7321600 1350124   5971476  19% /
/dev/sda1                         1038336  140316    898020  14% /boot
/dev/mapper/centos_tianyun-home   5232640   33016   5199624   1% /home
/dev/mapper/centos_tianyun-var    5232640  371280   4861360   8% /var
tmpfs                               99572       0     99572   0% /run/user/0
/dev/sdb1                         1998672    6144   1871288   1% /mnt/disk1
/dev/sdb2                         1038336   32992   1005344   4% /mnt/disk2
```

#### 3、fdisk（MBR）

1. 分区操作

```bash
MBR   14个分区（4个主分区，扩展分区，逻辑分区）

建议方案：
- 3主 + 1扩展（逻辑分区） > 4个分区
- 扩展分区使用剩余的全部空间，扩展分区实际也是主分区
- 扩展分区不能格式格式化使用，本质上讲是为了扩充分区的数量

[root@tianyun ~]# fdisk -l /dev/sdc 			# 查看磁盘分区信息
[root@tianyun ~]# fdisk /dev/sdc				# 磁盘分区
Welcome to fdisk (util-linux 2.23.2).

Changes will remain in memory only, until you decide to write them.
Be careful before using the write command.

Device does not contain a recognized partition table
Building a new DOS disklabel with disk identifier 0xffbbb3f8.		# 由于没有分区表，自动创建DOS分区表（MBR）
Command (m for help): n							# n新建分区
Partition type:
   p   primary (0 primary, 0 extended, 4 free)	
   e   extended
Select (default p): 							# 可选primary主分区 或 extended扩展分区
Using default response p
Partition number (1-4, default 1): 				# 接受自动分区编号
First sector (2048-41943039, default 2048): 	# 首扇区，默认
Using default value 2048
Last sector, +sectors or +size{K,M,G} (2048-41943039, default 41943039): +2G	# 结束扇区使用+2G
Partition 1 of type Linux and of size 2 GiB is set
```

```bash
接着又创建了3个主分区，均为1G（过程略）

Command (m for help): p							# print打印分区表

Disk /dev/sdc: 21.5 GB, 21474836480 bytes, 41943040 sectors
Units = sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes
Disk label type: dos
Disk identifier: 0xcd1f5c7f

   Device Boot      Start         End      Blocks   Id  System
/dev/sdc1            2048     4196351     2097152   83  Linux
/dev/sdc2         4196352     6293503     1048576   83  Linux
/dev/sdc3         6293504     8390655     1048576   83  Linux
/dev/sdc4         8390656    10487807     1048576   83  Linux

Command (m for help): n							# 创建新分区，失败!!!	
If you want to create more than four partitions, you must replace a
primary partition with an extended partition first.

# 由于已创建了4个主分区（MBR最大支持4个主分区），虽然硬盘空间没有用完剩15G，但无法再使用。

官方建议3主分区 + 1扩展分区（逻辑分区）

# 解决方案: 删除一个主分区，再分扩展（剩下的全部空间），然后在扩展分区中创建逻辑分区
Command (m for help): d							# delete删除分区
Partition number (1-4, default 4): 				# 默认为4
Partition 4 is deleted

Command (m for help): n							# n新建分区
Partition type:
   p   primary (3 primary, 0 extended, 1 free)
   e   extended
Select (default e): 							# 默认或选择extended扩展分区
Using default response e
Selected partition 4							# 1-4编号为主分区，扩展分为特殊的主分区				
First sector (8390656-41943039, default 8390656): 
Using default value 8390656
Last sector, +sectors or +size{K,M,G} (8390656-41943039, default 41943039): 	# 默认，即全部空间给扩展分区
Using default value 41943039
Partition 4 of type Extended and of size 16 GiB is set

Command (m for help): p

Disk /dev/sdc: 21.5 GB, 21474836480 bytes, 41943040 sectors
Units = sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes
Disk label type: dos
Disk identifier: 0xcd1f5c7f

   Device Boot      Start         End      Blocks   Id  System
/dev/sdc1            2048     4196351     2097152   83  Linux
/dev/sdc2         4196352     6293503     1048576   83  Linux
/dev/sdc3         6293504     8390655     1048576   83  Linux
/dev/sdc4         8390656    41943039    16776192    5  Extended				# 扩展分区不可以直接使用

Command (m for help): n
All primary partitions are in use
Adding logical partition 5						# 默认为logical逻辑分区
First sector (8392704-41943039, default 8392704): 
Using default value 8392704
Last sector, +sectors or +size{K,M,G} (8392704-41943039, default 41943039): +1G
Partition 5 of type Linux and of size 1 GiB is set

Command (m for help): n							# 创建第二个逻辑分区
All primary partitions are in use
Adding logical partition 6
First sector (10491904-41943039, default 10491904): 
Using default value 10491904
Last sector, +sectors or +size{K,M,G} (10491904-41943039, default 41943039): +1G
Partition 6 of type Linux and of size 1 GiB is set

Command (m for help): p

Disk /dev/sdc: 21.5 GB, 21474836480 bytes, 41943040 sectors
Units = sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes
Disk label type: dos
Disk identifier: 0xcd1f5c7f

   Device Boot      Start         End      Blocks   Id  System
/dev/sdc1            2048     4196351     2097152   83  Linux
/dev/sdc2         4196352     6293503     1048576   83  Linux
/dev/sdc3         6293504     8390655     1048576   83  Linux
/dev/sdc4         8390656    41943039    16776192    5  Extended
/dev/sdc5         8392704    10489855     1048576   83  Linux
/dev/sdc6        10491904    12589055     1048576   83  Linux
Command (m for help): w						# 保存退出

注：扩展分不可以格式化使用，它只是为扩展分区的数量（逻辑分区）
```

2. 格式化（创建文件系统）同上
3. 手动挂载及开机自动挂载 同上

#### 4、作业

```bash
如何判断一块硬盘已经分区完了？
比如一块硬盘为1T,当前分了6分区，想知道还有没有空间可分

# 方法一：
整个硬盘的大小  -  6个分区的容量相加

# 方法二：
[root@tianyun ~]# fdisk -l /dev/sda
Disk /dev/sda: `21.5 GB`, 21474836480 bytes, `41943040 sectors`	# 总大小21.5GB，总扇区 41943040 sectors
Units = sectors of 1 * 512 = 512 
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes
Disk label type: dos
Disk identifier: 0x000d1a9d

   Device Boot      Start         End      Blocks   Id  System
/dev/sda1   *        2048     2099199     1048576   83  Linux
/dev/sda2         2099200    `41943039`   19921920 	8e  Linux LVM	# 最后一个分的结束的扇区数 41943039

[root@tianyun ~]# fdisk -l /dev/sdb									# 该硬盘暂未有分区
Disk /dev/sdb: 21.5 GB, 21474836480 bytes, 41943040 sectors
Units = sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes


[root@tianyun ~]# fdisk -l /dev/sdc									# sdc虽然显示未被使用，但它是逻辑卷的成员PV
Disk /dev/sdc: 21.5 GB, 21474836480 bytes, 41943040 sectors
Units = sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes
[root@tianyun ~]# pvs
  PV         VG             Fmt  Attr PSize   PFree
  /dev/sda2  centos_tianyun lvm2 a--  <19.00g 4.00m
  /dev/sdc   vg1            lvm2 a--  <20.00g    0 					# sdc是PV，属于卷组vg1
  /dev/sdd   vg1            lvm2 a--  <20.00g    0 
  /dev/sde   vg1            lvm2 a--  <20.00g 9.98g
  /dev/sdg   vg1            lvm2 a--  <20.00g    0 
```

#### 5. Ubuntu

```bash
yangge@qfedu-01:~$ sudo mount -a
mount: (hint) your fstab has been modified, but systemd still uses
       the old version; use 'systemctl daemon-reload' to reload.

yangge@qfedu-01:~$ sudo systemctl daemon-reload 
yangge@qfedu-01:~$ sudo mount -a
```



## 存储管理一逻辑卷LVM

```shell
LVM（Logical Volume Manager，逻辑卷管理）是Linux环境下对磁盘分区进行管理的一种高级机制，它提供了比传统分区方式更灵活的磁盘管理能力。
```

### 一、LVM基本概念

#### 1、核心组件

- **物理卷（PV, Physical Volume）**：实际的物理磁盘或分区
- **卷组（VG, Volume Group）**：由多个PV组成的存储池
- **逻辑卷（LV, Logical Volume）**：从VG中划分出的逻辑存储单元
- **物理扩展（PE, Physical Extent）**：LVM管理的最小存储单元（默认4MB）

![](/documents/img/ops/linux/basic/disk/lvm.png)

#### 2、与传统分区的对比

| 特性     | LVM               | 传统分区            |
| -------- | ----------------- | ------------------- |
| 空间管理 | 可动态调整        | 固定大小            |
| 扩展性   | 可在线扩展 online | 需要离线操作offline |
| 跨磁盘   | 支持              | 不支持              |
| 快照     | 支持              | 不支持              |
| 条带化   | 支持              | 不支持              |

```shell
- 传统分区		
1. 分区 (gdisk-GPT,fdisk-MBR) 
2. 格式化（创建文件系统ext4,xfs）
3. 挂载（临时或永久挂载）

- 逻辑卷LVM	
1. 创建逻辑卷 (PV,VG,LV) 
2. 格式化 (创建文件系统ext4,xfs)
3. 挂载 (临时或永久挂载)
```

### 二、创建逻辑卷

#### 1、添加新硬盘

```shell
[root@tianyun ~]# lsblk 
NAME                    MAJ:MIN RM  SIZE RO TYPE MOUNTPOINT
sda                       8:0    0   20G  0 disk 
├─sda1                    8:1    0    1G  0 part /boot
└─sda2                    8:2    0   19G  0 part 
  ├─centos_tianyun-root 253:0    0    7G  0 lvm  /
  ├─centos_tianyun-swap 253:1    0    2G  0 lvm  [SWAP]
  ├─centos_tianyun-home 253:2    0    5G  0 lvm  /home
  └─centos_tianyun-var  253:3    0    5G  0 lvm  /var
sdb                       8:16   0   20G  0 disk 
sdc                       8:32   0   20G  0 disk 
sdd                       8:48   0   20G  0 disk 
sde                       8:64   0   20G  0 disk 
```

```shell
[root@tianyun ~]# ls -l /dev/sd*
brw-rw----. 1 root disk 8,  0 Jul 30 14:25 /dev/sda
brw-rw----. 1 root disk 8,  1 Jul 30 14:25 /dev/sda1
brw-rw----. 1 root disk 8,  2 Jul 30 14:25 /dev/sda2
brw-rw----. 1 root disk 8, 16 Jul 30 14:25 /dev/sdb
brw-rw----. 1 root disk 8, 32 Jul 30 14:25 /dev/sdc
brw-rw----. 1 root disk 8, 48 Jul 30 14:25 /dev/sdd
brw-rw----. 1 root disk 8, 64 Jul 30 14:25 /dev/sde
```

#### 2、创建物理卷PV

```bash
--- Physical volume ---
准备使用/dev/sdb,/dev/sdc,/dev/sdd

[root@tianyun ~]# pvcreate /dev/sd{b..d}					# 创建
  Physical volume "/dev/sdb" successfully created.
  Physical volume "/dev/sdc" successfully created.
  Physical volume "/dev/sdd" successfully created.
  
[root@tianyun ~]# pvscan 									# 查看【简单】
  PV /dev/sda2   VG centos_tianyun   lvm2 [<19.00 GiB / 4.00 MiB free]
  PV /dev/sdd                        lvm2 [20.00 GiB]		# 刚创建的PV
  PV /dev/sdc                        lvm2 [20.00 GiB]		# 刚创建的PV
  PV /dev/sdb                        lvm2 [20.00 GiB]		# 刚创建的PV
  Total: 4 [<79.00 GiB] / in use: 1 [<19.00 GiB] / in no VG: 3 [60.00 GiB]
  
[root@tianyun ~]# pvs										# 查看【简单】
  PV         VG             Fmt  Attr PSize   PFree  
  /dev/sda2  centos_tianyun lvm2 a--  <19.00g   4.00m
  /dev/sdb   vg1            lvm2 a--  <20.00g <20.00g
  /dev/sdc   vg1            lvm2 a--  <20.00g <20.00g
  /dev/sdd   vg1            lvm2 a--  <20.00g <20.00g
  
[root@tianyun ~]# pvdisplay 								# 查看【详细】
  "/dev/sdd" is a new physical volume of "20.00 GiB"
  --- NEW Physical volume ---
  PV Name               /dev/sdd
  VG Name               
  PV Size               20.00 GiB
  Allocatable           NO
  PE Size               0   
  Total PE              0
  Free PE               0
  Allocated PE          0
  PV UUID               7yIdWP-proX-p13C-qIBo-TPPd-uRqc-Vb6Cft
  
# 说明：PV可以是整个空硬盘，也可以是分区
/dev/sda5   	5G
/dev/sdb   		20G
/dev/sdc   		20G
/dev/sdd   		20G
```

#### 3、创建卷组VG

```shell
--- Volume Group --- 

[root@tianyun ~]# vgcreate vg1 /dev/sd{b..d}				# 创建，跟PV成员
  Volume group "vg1" successfully created
  
[root@tianyun ~]# vgscan 
  Reading volume groups from cache.
  Found volume group "centos_tianyun" using metadata type lvm2
  Found volume group "vg1" using metadata type lvm2

[root@tianyun ~]# vgs
  VG             #PV #LV #SN Attr   VSize   VFree  
  centos_tianyun   1   4   0 wz--n- <19.00g   4.00m			
  vg1              3   0   0 wz--n- <59.99g <59.99g			# VFree，空闲

[root@tianyun ~]# vgdisplay    
  --- Volume group ---
  VG Name               vg1
  System ID             
  Format                lvm2
  Metadata Areas        3
  Metadata Sequence No  1
  VG Access             read/write
  VG Status             resizable
  MAX LV                0
  Cur LV                0
  Open LV               0
  Max PV                0
  Cur PV                3
  Act PV                3
  VG Size               <59.99 GiB
  PE Size               4.00 MiB
  Total PE              15357
  Alloc PE / Size       0 / 0   
  Free  PE / Size       15357 / <59.99 GiB
  VG UUID               rWtZS7-vNrY-1Nxt-Vgkp-HfYj-4ElL-U3rt6F
  
[root@tianyun ~]# vgdisplay vg1
```

#### 4、创建逻辑卷LV

```shell
--- Logical volume ---

[root@tianyun ~]# lvcreate -n lv1 -L 30G vg1
  Logical volume "lv1" created.
    
参数解释：
-L lv大小
-n lv名字
-l 20指定PE 

[root@tianyun ~]# lvs
  LV   VG             Attr       LSize  Pool Origin Data%  Meta%  Move Log Cpy%Sync Convert
  home centos_tianyun -wi-ao----  5.00g                                                    
  root centos_tianyun -wi-ao----  6.99g                                                    
  swap centos_tianyun -wi-ao----  2.00g                                                    
  var  centos_tianyun -wi-ao----  5.00g                                                    
  lv1  vg1            -wi-a----- 30.00g 

[root@tianyun ~]# lvscan 
  ACTIVE            '/dev/centos_tianyun/home' [5.00 GiB] inherit
  ACTIVE            '/dev/centos_tianyun/var' [5.00 GiB] inherit
  ACTIVE            '/dev/centos_tianyun/swap' [2.00 GiB] inherit
  ACTIVE            '/dev/centos_tianyun/root' [6.99 GiB] inherit
  ACTIVE            '/dev/vg1/lv1' [30.00 GiB] inherit
  
[root@tianyun ~]# lvdisplay /dev/vg1/lv1 
  --- Logical volume ---
  LV Path                /dev/vg1/lv1
  LV Name                lv1
  VG Name                vg1
  LV UUID                z13YFm-IQDE-wHgW-p5P3-VNXs-hMA6-dnZ6ry
  LV Write Access        read/write
  LV Creation host, time tianyun, 2025-07-30 14:43:39 +0800
  LV Status              available
  # open                 0
  LV Size                30.00 GiB
  Current LE             7680
  Segments               2
  Allocation             inherit
  Read ahead sectors     auto
  - currently set to     8192
  Block device           253:4
```

#### 5、格式化（创建Filesystem）

```shell
[root@tianyun ~]# mkfs.xfs /dev/vg1/lv1 
```

#### 6、挂载

```bash
[root@tianyun ~]# mkdir /mnt/lv1

手动临时挂载：
[root@tianyun ~]# mount /dev/vg1/lv1 /mnt/lv1
[root@tianyun ~]# df
Filesystem                      1K-blocks    Used Available Use% Mounted on
devtmpfs                           485840       0    485840   0% /dev
tmpfs                              497848       0    497848   0% /dev/shm
tmpfs                              497848    7864    489984   2% /run
tmpfs                              497848       0    497848   0% /sys/fs/cgroup
/dev/mapper/centos_tianyun-root   7321600 1232476   6089124  17% /
/dev/sda1                         1038336  140316    898020  14% /boot
/dev/mapper/centos_tianyun-var    5232640   96088   5136552   2% /var
/dev/mapper/centos_tianyun-home   5232640   33004   5199636   1% /home
tmpfs                               99572       0     99572   0% /run/user/0
/dev/mapper/vg1-lv1              31441920   32992  31408928   1% /mnt/lv1

开机自动挂载：
[root@tianyun ~]# umount /mnt/lv1/

[root@tianyun ~]# vim /etc/fstab 
/dev/vg1/lv1    /mnt/lv1                xfs     defaults        0 0

[root@tianyun ~]# mount -a
[root@tianyun ~]# df

注：逻辑卷挂载不需要使用UUID
```

#### 7、再查看PV-VG-LV

```bash
[root@tianyun ~]# pvs
  PV         VG             Fmt  Attr PSize   PFree  
  /dev/sda2  centos_tianyun lvm2 a--  <19.00g   4.00m
  /dev/sdb   vg1            lvm2 a--  <20.00g      0 
  /dev/sdc   vg1            lvm2 a--  <20.00g   9.99g
  /dev/sdd   vg1            lvm2 a--  <20.00g <20.00g
  
[root@tianyun ~]# vgs
  VG             #PV #LV #SN Attr   VSize   VFree  
  centos_tianyun   1   4   0 wz--n- <19.00g   4.00m
  vg1              3   1   0 wz--n- <59.99g <29.99g

[root@tianyun ~]# lvs
  LV   VG             Attr       LSize  Pool Origin Data%  Meta%  Move Log Cpy%Sync Convert
  home centos_tianyun -wi-ao----  5.00g                                                    
  root centos_tianyun -wi-ao----  6.99g                                                    
  swap centos_tianyun -wi-ao----  2.00g                                                    
  var  centos_tianyun -wi-ao----  5.00g                                                    
  lv1  vg1            -wi-ao---- 30.00g 
```

### 三、逻辑卷扩容(online)

#### 1、VG有空间

要求：将`VG1`下的`lv1`扩大到`40G`

```bash
[root@yangge ~]# lvs											# 原来大小30G
  LV   VG            Attr       LSize   Pool Origin Data%  Meta%  Move Log Cpy%Sync Convert
  root centos_yangge -wi-ao---- <17.00g                                                    
  swap centos_yangge -wi-ao----   2.00g                                                    
  lv1  vg1           -wi-ao----  30.00g  

分析：lv1属于卷组vg1，需扩大10G，则需要vg1有至少10G的 Free

[root@tianyun ~]# vgs
  VG             #PV #LV #SN Attr   VSize   VFree  
  centos_tianyun   1   4   0 wz--n- <19.00g   4.00m
  vg1              3   1   0 wz--n- <59.99g <29.99g				# vg1还有30G Free

# 第一步：扩大逻辑卷
[root@tianyun ~]# lvextend -L 40G /dev/vg1/lv1 					# VG有空间，直接扩
  Size of logical volume vg1/lv1 changed from 30.00 GiB (7680 extents) to 40.00 GiB (10240 extents).
  Logical volume vg1/lv1 successfully resized.
[root@tianyun ~]# lvscan 
  ACTIVE            '/dev/vg1/lv1' [40.00 GiB] inherit

# 第二步：扩大文件系统
[root@tianyun ~]# df -Th
Filesystem                      Type      Size  Used Avail Use% Mounted on
/dev/mapper/vg1-lv1             xfs        30G   33M   30G   1% /mnt/lv1		# 文件系统仍是30G

[root@tianyun ~]# xfs_growfs /dev/vg1/lv1 						# 文件系统是XFS

[root@tianyun ~]# df -Th
Filesystem                      Type      Size  Used Avail Use% Mounted on
/dev/mapper/vg1-lv1             xfs        40G   33M   40G   1% /mnt/lv1
```

#### 2、VG没有空间

要求：将`VG1`下的`lv1`扩大`30G`

1. 查看VG是否有空间

```shell
[root@tianyun ~]# vgs
  VG             #PV #LV #SN Attr   VSize   VFree  
  centos_tianyun   1   4   0 wz--n- <19.00g   4.00m
  vg1              3   1   0 wz--n- <59.99g <19.99g

结果：需要30G，目前Free仅20G，需要先扩容VG
```

2. 先扩容VG

```shell
分析：要扩容VG，必须有新的PV加入

[root@tianyun ~]# pvcreate /dev/sde						# 创建新的PV
  Physical volume "/dev/sde" successfully created.
  
[root@tianyun ~]# vgextend vg1 /dev/sde					# 扩容VG
  Volume group "vg1" successfully extended

[root@tianyun ~]# vgs
  VG             #PV #LV #SN Attr   VSize   VFree 
  centos_tianyun   1   4   0 wz--n- <19.00g  4.00m
  vg1              4   1   0 wz--n-  79.98g 39.98g

结果：目前VG有至少30G可用
```

3. 扩容LV和文件系统

```shell
[root@tianyun ~]# lvextend -L +30G /dev/vg1/lv1			# 扩容逻辑卷
  Size of logical volume vg1/lv1 changed from 40.00 GiB (10240 extents) to 70.00 GiB (17920 extents).
  Logical volume vg1/lv1 successfully resized.
[root@tianyun ~]# lvscan 
  ACTIVE            '/dev/vg1/lv1' [70.00 GiB] inherit

[root@tianyun ~]# xfs_growfs /dev/vg1/lv1				# 扩容文件系统

注：扩容文件系统
xfs:		`xfs_growfs`
ext:		`resize2fs`
```

### 四、从VG 中删除PV

#### 1、PV未被使用

要求：从vg1中移出/dev/sdd

```bash
[root@yangge ~]# pvs
  PV         VG     Fmt  Attr PSize   PFree  
  /dev/sdb   vg1    lvm2 a--  <19.97g  <7.97g		# 整体20G, Free 8G，表示已使用
  /dev/sdc   vg1    lvm2 a--  <19.97g <19.97g
  /dev/sdd   vg1    lvm2 a--  <19.97g <19.97g		# 整体20G, Free 20G，表示完全未使用
  
[root@yangge ~]# vgs								# 查看vg1原来的大小，60G
  VG     #PV #LV #SN Attr   VSize   VFree  
  centos   2   2   0 wz--n-  38.99g <10.00g
  vg1      3   1   0 wz--n- <59.91g <47.91g
 
[root@yangge ~]# vgreduce vg1 /dev/sdd				# 从vg1中移出PV /dev/sdd
  Removed "/dev/sdd" from volume group "vg1"
  
[root@yangge ~]# pvremove /dev/sdd					# 删除PV
  Labels on physical volume "/dev/sdd" successfully wiped.
  
[root@yangge ~]# pvs
  PV         VG     Fmt  Attr PSize   PFree  
  /dev/sdb   vg1    lvm2 a--  <19.97g  <7.97g
  /dev/sdc   vg1    lvm2 a--  <19.97g <19.97g
  /dev/sdd          lvm2 ---   20.00g  20.00g		# sdd已不属于任何VG

[root@yangge ~]# vgs								# 再次查看vg1，40G（/dev/sdd已移除）
  VG     #PV #LV #SN Attr   VSize   VFree  
  vg1      2   1   0 wz--n- <39.94g <27.94g
```

#### 2、PV已使用需要迁移

要求：从vg1中移出/dev/sdb:

```bash
#模拟往逻辑中写入一些数据：
[root@tianyun ~]# cp -rf /etc /mnt/lv1/
[root@tianyun ~]# cp -rf /etc /mnt/lv1/etc2
[root@tianyun ~]# cp -rf /etc /mnt/lv1/etc3
[root@tianyun ~]# cp -rf /etc /mnt/lv1/etc4

[root@yangge ~]# pvs
  PV         VG     Fmt  Attr PSize   PFree  
  /dev/sdb   vg1    lvm2 a--  <19.97g  <7.97g		# 整体20G, Free 8G，表示已使用，甚至有数据
  /dev/sdc   vg1    lvm2 a--  <19.97g <19.97g


[root@yangge ~]# pvmove /dev/sdb /dev/sdc 			# 将PV sdb的数据迁移到VG中的其它pV
  /dev/sdb: Moved: 0.52%
  /dev/sdb: Moved: 100.00%
目标PV /dev/sdc可以省略，可以自动分配到目标PV,例如pvmove /dev/sdb

[root@yangge ~]# pvs
  PV         VG     Fmt  Attr PSize   PFree  
  /dev/sdb   vg1    lvm2 a--  <19.97g <19.97g
  /dev/sdc   vg1    lvm2 a--  <19.97g  <7.97g

[root@yangge ~]# vgreduce vg1 /dev/sdb
  Removed "/dev/sdb" from volume group "vg1"

[root@yangge ~]# pvs
  PV         VG     Fmt  Attr PSize   PFree  
  /dev/sdb          lvm2 ---   20.00g  20.00g
  /dev/sdc   vg1    lvm2 a--  <19.97g  <7.97g
  
[root@yangge ~]# pvremove /dev/sdb
  Labels on physical volume "/dev/sdb" successfully wiped.
```

## 存储管理—交换分区

### 一、交换分区基础

#### 1、Swap的作用

交换分区管理 Swap —— 也叫虚拟内存

作用： `提升` 内存的容量，防止OOM（Out Of Memory）

```shell
OOM: 现象是当内存不够的时候内核会随机杀死进程，它认为占用内存多的进程。（内核会先杀死占用内存多的进程）.

如何制作交换分区？
#我们可以将硬盘空间拿来当作内存来用
什么时候用到交换分区？
#当物理内存不够用的时候使用swap分区，防止物理内存耗尽
```

```shell
内存：16-32GB		4-8GB swap
内存：32-128GB		8-16GB swap
内存：128GB+		16-32GB swap
```

#### 2、查看Swap

```shell
[root@tianyun ~]# free -h							# 总swap大小
              total        used        free      shared  buff/cache   available
Mem:           972M        204M        647M        7.7M        120M        634M
Swap:          2.0G          0B        2.0G

[root@tianyun ~]# swapon -s							# 详细分布
Filename                                Type            Size    Used    Priority
/dev/dm-1                               partition       2097148 0       -2

[root@tianyun ~]# ls -l /dev/centos_tianyun/swap 	# 逻辑卷swap链接到/dev/dm-1
lrwxrwxrwx. 1 root root 7 Jul 30 16:32 /dev/centos_tianyun/swap -> ../dm-1
[root@tianyun ~]# ls -l /dev/dm-1
brw-rw----. 1 root disk 253, 1 Jul 30 16:32 /dev/dm-1

[root@tianyun ~]# top
top - 09:37:54 up 17:05,  2 users,  load average: 0.00, 0.01, 0.05
Tasks: 155 total,   1 running, 154 sleeping,   0 stopped,   0 zombie
%Cpu(s):  0.0 us,  0.0 sy,  0.0 ni,100.0 id,  0.0 wa,  0.0 hi,  0.0 si,  0.0 st
KiB Mem :   995700 total,   661588 free,   210364 used,   123748 buff/cache
KiB Swap:  2097148 total,  2097148 free,        0 used.   648140 avail Mem 		# Swap
```

### 二、创建交换分区实战

#### 1、创建Swap—传统分区

```shell
1. 创建分区
[root@tianyun ~]# fdisk /dev/sdb
[root@tianyun ~]# ls -l /dev/sdb1
brw-rw----. 1 root disk 8, 17 Jul 31 09:43 /dev/sdb1

2. 格式化（初始化）
[root@tianyun ~]# mkswap /dev/sdb1
mkswap: /dev/sdb1: warning: wiping old swap signature.
Setting up swapspace version 1, size = 1048572 KiB
no label, UUID=6e7d5c01-4584-4421-a9b0-b3d73ea7acb1

3. 激活（挂载）
[root@tianyun ~]# swapon /dev/sdb1			# 手动，重启后不会自动激活
[root@tianyun ~]# swapon -s
Filename                                Type            Size    Used    Priority
/dev/dm-1                               partition       2097148 0       -2
/dev/sdb1                               partition       1048572 0       -3

[root@tianyun ~]# swapoff /dev/sdb1
[root@tianyun ~]# blkid /dev/sdb1
/dev/sdb1: UUID="6e7d5c01-4584-4421-a9b0-b3d73ea7acb1" TYPE="swap" 
[root@tianyun ~]# vim /etc/fstab
UUID="6e7d5c01-4584-4421-a9b0-b3d73ea7acb1"     swap    swap    defaults 0 0

[root@tianyun ~]# swapon -a					# 挂载所有交换分区(/etc/fstab)，类似mount -a
[root@tianyun ~]# swapon -s
Filename                                Type            Size    Used    Priority
/dev/dm-1                               partition       2097148 0       -2
/dev/sdb1                               partition       1048572 0       -3
```

#### 2、创建Swap—基于LV【推荐】

```bash
1. 创建逻辑卷LV
[root@tianyun ~]# vgs
  VG             #PV #LV #SN Attr   VSize   VFree
  centos_tianyun   1   4   0 wz--n- <19.00g 4.00m
  vg1              4   1   0 wz--n-  79.98g 9.98g					# 就它有空间
[root@tianyun ~]# lvcreate -L 1G -n swap1 vg1
  Logical volume "swap1" created.  

2. 格式化（初始化）
[root@tianyun ~]# mkswap /dev/vg1/swap1 
Setting up swapspace version 1, size = 1048572 KiB
no label, UUID=c8814849-2ec7-42e3-91d7-4d3eebe485b7

3. 激活（挂载）
[root@tianyun ~]# vim /etc/fstab
/dev/vg1/swap1  swap    swap    defaults 0 0

[root@tianyun ~]# swapon -a					# 挂载所有交换分区(/etc/fstab)，类似mount -a
[root@tianyun ~]# swapon -s
Filename                                Type            Size    Used    Priority
/dev/dm-1                               partition       2097148 0       -2
/dev/sdb1                               partition       1048572 0       -3
/dev/dm-5                               partition       1048572 0       -4
```

#### 3、创建Swap—基于文件

```shell
1. 创建特殊文件
[root@tianyun ~]# dd if=/dev/zero of=/home/swap2 bs=1G count=1
1+0 records in
1+0 records out
1073741824 bytes (1.1 GB) copied, 9.8503 s, 109 MB/s
[root@tianyun ~]# ls -lh /home/swap2 
-rw-r--r--. 1 root root 1.0G Jul 31 10:00 /home/swap2

2. 格式化（初始化）
[root@tianyun ~]# mkswap /home/swap2 
Setting up swapspace version 1, size = 1048572 KiB
no label, UUID=73417d34-b4d4-4f66-9b5f-4aad16ded399

3. 激活（挂载）
[root@tianyun ~]# vim /etc/fstab
/home/swap2     swap    swap    defaults 0 0

[root@tianyun ~]# swapon -a
swapon: /home/swap2: insecure permissions 0644, 0600 suggested.		# 使用安全权限0600
[root@tianyun ~]# chmod 0600 /home/swap2 
[root@tianyun ~]# swapon -a
[root@tianyun ~]# swapon -s
Filename                                Type            Size    Used    Priority
/dev/dm-1                               partition       2097148 74240   -2
/dev/sdb1                               partition       1048572 0       -3
/dev/dm-5                               partition       1048572 0       -4
/home/swap2                             file    		1048572 0       -5
```

## 挂载选项详解【扩展】

#### 1、常见的挂载选项

```shell
-o         挂载选项

rw	       读写 
ro	       只读 
noexec	   不允许执行二进制文件
exec	   允许执行二进制文件 
auto	   mount -a 开机自动挂载 
remount	   在线重新挂载 

[root@tianyun ~]# lvcreate -L 1G -n lv_data vg1
[root@tianyun ~]# mkfs.xfs /dev/vg1/lv_data 

[root@tianyun ~]# mkdir /mnt/data
[root@tianyun ~]# mount /dev/vg1/lv_data /mnt/data/
[root@tianyun ~]# umount /dev/vg1/lv_data

之前挂载无论是分区，还是逻辑卷时，默认未加任何选项。
真的就没有加选项吗？ defaults
[root@tianyun ~]# man mount
defaults	Use default options: `rw, suid, dev, exec, auto, nouser, and async`.
```

#### 2、案例1：新分区挂载加选项

```bash
[root@tianyun ~]# mount -o ro,noexec /dev/vg1/lv_data /mnt/data/

[root@tianyun ~]# touch /mnt/data/file1
touch: cannot touch ‘/mnt/data/file1’: Read-only file system

- 查看设备的挂载选项
[root@yangge ~]# mount |grep lv_data
/dev/mapper/vg1-lv_data on /mnt/data type xfs (ro,noexec,relatime,seclabel,attr2,inode64,noquota)
```

#### 3、案例2：已挂载分区ro/rw

```bash
[root@yangge ~]# df -Th
Filesystem              Type      Size  Used Avail Use% Mounted on
devtmpfs                devtmpfs  2.1G     0  2.1G   0% /dev
tmpfs                   tmpfs     2.1G     0  2.1G   0% /dev/shm
tmpfs                   tmpfs     2.1G   12M  2.1G   1% /run
tmpfs                   tmpfs     2.1G     0  2.1G   0% /sys/fs/cgroup
/dev/mapper/centos-root xfs        17G  1.3G   16G   8% /
/dev/sda1               xfs      1014M  138M  877M  14% /boot
tmpfs                   tmpfs     422M     0  422M   0% /run/user/0
/dev/mapper/vg1-lv1     xfs       2.0G   33M  2.0G   2% /mnt/lv1-data

[root@yangge ~]# mount -o rw /dev/vg1/lv_data /mnt/data/
mount: /dev/mapper/vg1-lv_data is already mounted or /mnt/data busy
       /dev/mapper/vg1-lv_data is already mounted on /mnt/data

[root@yangge ~]# mount -o rw,remount /dev/vg1/lv_data		# 以只读的方式重新挂载
[root@yangge ~]# touch /mnt/data/file2

也可以不使用remount, 先卸载，再挂载时加选项
/分区能卸载吗？
[root@yangge ~]# umount /
umount: /: target is busy.
        (In some cases useful info about processes that use
         the device is found by lsof(8) or fuser(1))
[root@yangge ~]# mount -o noexec,remount /					# 给/一个新的选项noexec
[root@yangge ~]# date
-bash: /usr/bin/date: Permission denied
[root@yangge ~]# mount -o exec,remount /
-bash: /usr/bin/mount: Permission denied

重启系统
```

#### 4、案例3：已挂载分区exec/noexec

```shell
[root@yangge ~]# mount /dev/vg1/lv_data /mnt/data/
[root@yangge ~]# cp -rf /usr/bin/date /mnt/data/			# 复制date命令
[root@yangge ~]# /mnt/data/date 							# 成功执行
Fri Sep 26 16:32:31 CST 2025

[root@yangge ~]# mount -o noexec /mnt/data/					# busy
mount: /dev/mapper/vg1-lv_data is already mounted or /mnt/data busy
       /dev/mapper/vg1-lv_data is already mounted on /mnt/data
[root@yangge ~]# mount -o noexec,remount /mnt/data/			# remount

[root@yangge ~]# /mnt/data/date
-bash: /mnt/data/date: Permission denied      
```

#### 5、开机自动挂载加选项

```bash
[root@yangge ~]# vi /etc/fstab
/dev/vg1/lv_data        /mnt/data                      xfs      ro,noexec       0 0                         

- 测试
[root@yangge ~]# umount /mnt/data 
[root@yangge ~]# mount -a
[root@yangge ~]# mount |grep lv_data
/dev/mapper/vg1-lv_data on /mnt/data type xfs (ro,noexec,relatime,seclabel,attr2,inode64,noquota)
```



## RAID—磁盘阵列【了解】

### 一、什么是RAID？

RAID的中文全称是 **独立磁盘冗余阵列**，通常简称为 **磁盘阵列**。

它的核心思想是：**将多个独立的物理硬盘通过特定的方式组合起来，形成一个更大的、逻辑上的虚拟硬盘。**

这个逻辑硬盘能提供比单个硬盘更高的**性能**、**容量**和/或**数据可靠性**。

### 二、为什么需要RAID？

使用RAID主要为了实现以下三个目标中的一个或多个：

1. **提高性能：** 通过将数据分散到多个硬盘上同时进行读写操作，可以显著提升数据传输速度。这类似于多条车道并行通车，比单车道快得多。
2. **增加容量：** 将多个小容量硬盘组合成一个大的逻辑盘，方便管理和存储大文件。
3. **提供容错/数据冗余：** 这是RAID最关键的功能之一。通过存储额外的校验信息或数据副本，当阵列中的某个硬盘发生故障时，不会导致数据丢失，系统仍能继续运行，并允许管理员更换故障盘后重建数据。

### 三、常见的RAID级别

| RAID级别    | 中文名称               | 最低硬盘数 |           容错能力            |     可用容量     |  读性能  | 写性能 | 主要特点与适用场景                                           |
| :---------- | :--------------------- | :--------: | :---------------------------: | :--------------: | :------: | :----: | :----------------------------------------------------------- |
| **RAID 0**  | 条带集 / 带区卷        |     2      |            **无**             |       100%       |    高    |   高   | **极致性能**。速度最快，但无任何数据保护，一块硬盘损坏即导致全部数据丢失。适用于临时数据或非关键性高速缓存。 |
| **RAID 1**  | 镜像集 / 镜像卷        |     2      |            **高**             |       50%        |   中等   |  中等  | **极致安全**。数据完全镜像，安全性最高，但容量利用率最低。适用于操作系统盘、重要数据库日志等。 |
| **RAID 5**  | 带分布式校验的条带集   |     3      |            **1块**            | (N-1) * 单盘容量 |    高    |  中等  | **平衡之选**。在性能、容量和安全性之间取得良好平衡，性价比高。广泛应用于文件服务器、应用服务器。 |
| **RAID 6**  | 带双分布式校验的条带集 |     4      |            **2块**            | (N-2) * 单盘容量 |    高    |  较低  | **更高容错**。相比RAID 5，提供双重校验，可同时容忍两块硬盘故障，数据更安全。适用于大容量、对数据安全要求极高的场景。 |
| **RAID 10** | 镜像条带集（先镜后带） |     4      | **至少1块**（取决于故障位置） |       50%        | **很高** |   高   | **性能与安全的结合**。兼具RAID 0的高性能和RAID 1的高安全性，是性能和可靠性要求均高的场景（如核心数据库）的首选。 |



![](/documents/img/ops/linux/basic/disk/raid-0.jpg)

![](/documents/img/ops/linux/basic/disk/raid-1.jpg)

![](/documents/img/ops/linux/basic/disk/raid-5.jpg)
![](/documents/img/ops/linux/basic/disk/raid-6.jpg)

![](/documents/img/ops/linux/basic/disk/raid-10.jpg)

```bash
`物理服务器安装系统步骤`
- 硬盘先做RAID
- 安装操作系统

`RAID作业`
- 了解DELL服务器RAID创建方法
- 了解IBM服务器RAID创建方法

`热备盘 HotSpare`

`硬RAID vs 软RAID`

6块硬盘做RAID 5，单盘为8T，最终RAID的容量为多少？
- （6-1）* 8T = 40T
- （5-1）* 8T + 1热备盘 = 32T
```

