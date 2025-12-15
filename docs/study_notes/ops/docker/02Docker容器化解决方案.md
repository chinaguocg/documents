# Docker容器化解决方案-2025-08-04

# 一、容器简介

## 1.1 什么是`Linux`容器

  容器其实是一种沙盒技术。沙盒像一个集装箱一样把你的应用“**装**”起来的技术。这样应用与应用之间就因为有了边界而不至于相互干扰；而被装进了集装箱的应用，也可以被方便地搬来搬去。
`Linux`容器是与系统其他部分隔离开的一系列进程，从另一个镜像运行，并由该镜像提供支持进程所需的全部文件。容器提供的镜像包含了应用的所有依赖项，因而在从开发到测试再到生产的整个过程中，具有可移植性和一致性。

  容器是一种虚拟化技术，用于封装应用程序及其所有依赖项和配置，以便能够在不同的计算机环境中运行。软件容器提供了一种轻量级、一致性的运行环境，使得应用程序在开发、测试和部署时更加可移植和可靠。

`Sandbox`（沙箱）是指一种技术，在这种技术中，软件运行在操作系统受限制的环境中。由于该软件在受限制的环境中运行，即使一个闯入该软件的入侵者也不能无限制访问操作系统提供设施；获得该软件控制权的黑客造成的损失也是有限的。

![img](https://hjmimage.oss-cn-zhangjiakou.aliyuncs.com/202502102113022.png)			



## 1.2 容器的基本概念

- 跨平台性： 容器可以在不同的操作系统和云平台上运行，确保应用程序在各种环境中的一致性。这种跨平台性使得应用程序更易于移植和部署。
- 一致性和可重复性： 容器封装了应用程序及其所有依赖项和配置，确保了开发、测试和生产环境的一致性。通过使用容器，可以避免由于环境差异而引起的问题，实现可重复的构建和部署过程。
- 资源隔离： 容器提供了一定程度的隔离，使得多个容器可以在同一主机上并行运行而互不干扰。这种隔离性能够确保应用程序的稳定性和安全性。
- 快速部署和启动： 容器可以在几秒钟内启动，相比于传统的虚拟机来说，启动时间更短。这使得应用程序的部署和扩展更加迅速和灵活。
- 高可伸缩性： 容器架构支持自动化的横向扩展，可以根据需求动态地增加或减少容器实例。这种高可伸缩性使得应用程序能够更好地应对流量和负载的变化。
- 环境隔离： 容器提供了独立的运行环境，每个容器都有自己的文件系统、网络和进程空间。这种环境隔离有助于防止应用程序之间的相互影响，提高了系统的稳定性和安全性。
- 资源效率： 容器共享主机操作系统的内核，相比虚拟机，容器更加轻量级，更加节省系统资源。
- 持续集成和持续部署（CI/CD）： 容器与持续集成和持续部署工具集成紧密，使得开发团队能够更容易地实现自动化构建、测试和部署流程。

## 1.3 容器的核心技术实现

### 1.3.1 `Namespaces`命名空间

​	提供进程、网络、文件系统等资源的隔离，确保每个容器内的进程只能看到并操作属于该容器的资源。比如：命名空间可以提供一个进程相互隔离的独立网络空间，不同的容器间进程`PID`可以相同，进程并不冲突影响，但可以共享底层的计算和存储资源。

​	`Namespace`是`Linux`系统的底层概念，在内核层实现，即有一些不同类型的命名空间被部署在核内，各个`docker`容器运行在同一个`docker`主进程并且共用同一个宿主机系统内核，各`docker`容器运行在宿主机的用户空间，每个容器都要有类似于虚拟机一样的相互隔离的运行空间，但是容器技术是在一个进程内实现运行指定服务的运行环境，并且还可以保护宿主机内核不受其他进程的干扰和影响，如文件系统空间、网络空间、进程空间等，通过以下技术实现容器运行空间的相互隔离。

![img](https://hjmimage.oss-cn-zhangjiakou.aliyuncs.com/202502122041706.png)

#### 1.3.1.1 `MNT Namespace`

​	每个容器都要有独立的根文件系统有独立的用户空间，以实现在容器里面启动服务并且使用容器的运行环境，即一个宿主机是`ubuntu`的服务器，可以在里面启动一个`centos`运行环境的容器并且在容器里面启动一个`Nginx`服务，此`Nginx`运行时使用的运行环境就是`centos`系统目录的运行环境，但是在容器里面是不能访问宿主机的资源，宿主机是使用了`chroot`技术把容器锁定到一个指定的运行目录里面。

![img](https://hjmimage.oss-cn-zhangjiakou.aliyuncs.com/202502122044716.png)

#### 1.3.1.2 `UTS Namespace`

​	包含了运行内核的名称、版本、底层体系结构类型等信息，用于系统标识。其中包含了：主机名`hostname`、内核名称等；它使得一个容器拥有属于自己主机名标识，这个主机名标识独立于宿主机系统和其上的其他容器。



#### 1.3.1.3 `PID Namespace`

​	`Linux`系统中，有一个`PID`为`1`的进程(`init/systemd`)是其他所有进程的父进程，那么在每个容器内也要有一个父进程来管理其下属的子进程，那么多个容器的进程通过`PID namespace`进程隔离比如：`PID`编号重复、容器内的主进程生成、回收子进程。

![img](https://hjmimage.oss-cn-zhangjiakou.aliyuncs.com/202502122047953.png)

#### 1.3.1.4 `NET Namespace`

​	每一个容器都类似于虚拟机一样有自己的网卡、监听端口、`TCP/IP`协议栈等，`Docker`使用`network namespace`启动一个`vethX`接口，这样你的容器将拥有它自己的桥接`ip`地址，通常是`docker0`，而`docker0`实质就是Linux的虚拟网桥，网桥是在`OSI`七层模型的数据链路层的网络设备，通过`mac`地址对网络进行划分，并且在不同网络直接传递数据。

![img](https://hjmimage.oss-cn-zhangjiakou.aliyuncs.com/202502122048119.png)

#### 1.3.1.5 `User Namespace`

​	`User Namespace`允许在各个宿主机的各个容器空间内创建相同的用户名以及相同的用户`UID`和`GID`，只是会把用户的作用范围限制在每个容器内，即`A`容器和`B`容器可以有相同的用户名称和`ID`的账户，但是此用户的有效范围仅是当前容器内，不能访问另外一个容器内的文件系统，即相互隔离、互不影响、永不相见。

![img](https://hjmimage.oss-cn-zhangjiakou.aliyuncs.com/202502122049181.png)

### 1.3.2 `Cgroups`

Control Groups（cgroups）是 Linux 内核的一个功能，用于限制、账户和隔离进程组（包括它们的任务和资源）。cgroups提供了对系统资源（如CPU、内存、磁盘 I/O等）的精细控制，允许系统管理员将资源分配和限制应用到一组进程上，是google在2007年提出的，在2008年的时候合并到2.6的linux内核中。管理和限制容器使用的资源（如 `CPU`、内存、磁盘` I/O` 等），确保容器不会超出分配的资源。比如给容器`A`分配`4`颗`CPU`，`8G` 内存，那这个容器最多用这么多的资源。如果内存超过`8G` ，会启动`swap`，效率降低，也可能会被调度系统给`KILL`掉。如果不对一个容器做任何资源限制，则宿主机会允许其占用无限大的内存空间，有时候会因为代码`bug`程序会一直申请内存，直到把宿主机内存占完，为了避免此类的问题出现，宿主机有必要对容器进行资源分配限制，比如`CPU`、`内存`等`Cgroups`最主要的作用，就是限制一个进程组能够使用的资源上限，包括`CPU`、内存、磁盘、网络带宽等等。此外，还能够对进程进行优先级设置，资源的计量以及资源的控制（比如：将进程挂起和恢复等操作）。

![img](https://hjmimage.oss-cn-zhangjiakou.aliyuncs.com/202502122052419.png)

白话文：`Namespace`的作用是“隔离”，他让应用进程只能“看到”该`Namespace`内的“世界”；而`Cgroups`的作用是“限制”，它给这个“世界”围了一圈看不见的“墙”。如此一来，进程就真的被“装”在了一个与世隔绝的“房间”里。这就是所谓的沙盒！

## 1.4 容器和虚拟机的区别？

![null](https://hjmimage.oss-cn-zhangjiakou.aliyuncs.com/202406081419839.png#id=HgJ3t&originHeight=589&originWidth=1658&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

### 1.4.1 传统虚拟化技术

​	虚拟机（`virtual machine`）就是带环境安装的一种解决方案。它可以在一种操作系统里面运行另一种操作系统，比如在`Windows`系统里面运行`Linux`系统。应用程序对此毫无感知，因为虚拟机看上去跟真实系统一模一样，而对于底层系统来说，虚拟机就是一个普通文件，不需要了就删掉，对其他部分毫无影响。这类虚拟机完美的运行了另一套系统，能够使应用程序，操作系统和硬件三者之间的逻辑不变。

​	虚拟机的缺点：资源占用多  冗余步骤多  启动速度慢

### 1.4.2 容器技术

​	`Linux`容器不是模拟一个完整的操作系统，而是对进程进行隔离。有了容器，就可以将软件运行所需的所有资源打包到一个隔离的容器中。容器与虚拟机不同，不需要捆绑一整套操作系统，只需要软件工作所需的库资源和设置。系统因此而变得高效轻量并保证部署在任何环境中的软件都能始终如一地运行。

### 1.4.3 `Docker`容器技术和传统虚拟化方式的不同之处

​	传统虚拟机技术是虚拟出一套硬件后，在其上运行一个完整操作系统，在该系统上再运行所需应用进程；而容器内的应用进程直接运行于宿主的内核，容器内没有自己的内核，而且也没有进行硬件虚拟。因此容器要比传统虚拟机更为轻便。每个容器之间互相隔离，每个容器有自己的文件系统 ，容器之间进程不会相互影响，能区分计算资源。

​	简单来说，虚拟机是一个完整的操作系统，拥有自己的内核、硬件驱动程序、程序和应用程序。启动虚拟机只是为了隔离单个应用程序，这会带来很大的开销。容器只是一个独立的进程，其中包含运行所需的所有文件。如果您运行多个容器，它们都共享同一个内核，这样您就可以在更少的基础设施上运行更多的应用程序。

![null](https://hjmimage.oss-cn-zhangjiakou.aliyuncs.com/202502122055363.png)

# 二、`Docker`简介

## 2.1 `Docker`是什么

  官网：https://www.docker.com/

  官方文档：https://docs.docker.com/ 

  `Docker`是一组平台即服务（`PaaS`）的产品。基于操作系统层级的虚拟化技术，将软件与其依赖项打包为容器镜像。托管容器的软件称为`Docker`引擎。`Docker`能够帮助开发者在轻量级容器中自动部署应用程序，并使得不同容器中的应用程序彼此隔离，高效工作。开发人员通过`Docker`将他们的想法变为现实将软件打包为标准化单元，用于开发、装运和部署容器是一个标准的软件单元，它封装代码及其所有依赖项，以便应用程序从一个计算环境快速可靠地运行到另一个环境。`2013年`，`Docker`推出了**集装箱**行业标准。容器是一个标准化的软件单元，允许开发人员将应用程序与其环境隔离，解决“它在我的机器上工作”的难题。对于开发人员来说，`Docker`是构建和共享容器化应用程序的事实标准——从桌面到云。 

  `Docker`容器镜像是一个轻量级、独立的可执行软件包，包括运行应用程序所需的一切：代码、运行时、系统工具、系统库和设置。容器镜像在运行时会变成容器，在`Docker`容器的情况下，镜像在`Docker`引擎上运行时会成为容器。

## 2.2 `Docker`的目标

`Docker`的主要目标是"`Build,Ship and Run any App,Angwhere`"。构建，运输，处处运行！

- 构建：做一个`docker`镜像

- 运输：`docker pull or push`

- 运行：启动一个容器

每一个容器，他都有自己的文件系统`rootfs`根文件系统。

# 三、`Docker`熟识

## 3.1 `Docker`部署及配置

```bash
# Step 1：查看系统架构
$ cat /etc/redhat-release 
CentOS Stream release 9

# Step 2：查看内核版本
$ uname -r
5.14.0-596.el9.x86_64

# Step 3：更换 Centos-Base yum源 ##2025-12-13换源失败，所以这一步骤可以不执行
$ cd /etc/yum.repos.d/
$ mkdir bak
$ cp -r centos* bak/
$ vim centos.repo
[baseos]
name=CentOS Stream $releasever - Bavim centos.reposeOS
baseurl=https://mirrors.aliyun.com/centos-stream/$stream/BaseOS/$basearch/os/
gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-centosofficial
gpgcheck=1
repo_gpgcheck=0
metadata_expire=6h
countme=1
enabled=1

[baseos-debug]
name=CentOS Stream $releasever - BaseOS - Debug
baseurl=https://mirrors.aliyun.com/centos-stream/$stream/BaseOS/$basearch/debug/tree/
gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-centosofficial
gpgcheck=1
repo_gpgcheck=0
metadata_expire=6h
enabled=0

[baseos-source]
name=CentOS Stream $releasever - BaseOS - Source
baseurl=https://mirrors.aliyun.com/centos-stream/$stream/BaseOS/source/tree/
gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-centosofficial
gpgcheck=1
repo_gpgcheck=0
metadata_expire=6h
enabled=0

[appstream]
name=CentOS Stream $releasever - AppStream
baseurl=https://mirrors.aliyun.com/centos-stream/$stream/AppStream/$basearch/os/
gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-centosofficial
gpgcheck=1
repo_gpgcheck=0
metadata_expire=6h
countme=1
enabled=1

[appstream-debug]
name=CentOS Stream $releasever - AppStream - Debug
baseurl=https://mirrors.aliyun.com/centos-stream/$stream/AppStream/$basearch/debug/tree/
gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-centosofficial
gpgcheck=1
repo_gpgcheck=0
metadata_expire=6h
enabled=0

[appstream-source]
name=CentOS Stream $releasever - AppStream - Source
baseurl=https://mirrors.aliyun.com/centos-stream/$stream/AppStream/$basearch/debug/tree/
gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-centosofficial
gpgcheck=1
repo_gpgcheck=0
metadata_expire=6h
enabled=0

[crb]
name=CentOS Stream $releasever - CRB
baseurl=https://mirrors.aliyun.com/centos-stream/$stream/CRB/$basearch/os/
gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-centosofficial
gpgcheck=1
repo_gpgcheck=0
metadata_expire=6h
countme=1
enabled=0

[crb-debug]
name=CentOS Stream $releasever - CRB - Debug
baseurl=https://mirrors.aliyun.com/centos-stream/$stream/CRB/$basearch/debug/tree/
gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-centosofficial
gpgcheck=1
repo_gpgcheck=0
metadata_expire=6h
enabled=0

[crb-source]
name=CentOS Stream $releasever - CRB - Source
baseurl=https://mirrors.aliyun.com/centos-stream/$stream/CRB/source/tree/
gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-centosofficial
gpgcheck=1
repo_gpgcheck=0
metadata_expire=6h
enabled=0

$ vim centos-addons.repo 
[highavailability]
name=CentOS Stream $releasever - HighAvailability
baseurl=http://mirrors.aliyun.com/centos-stream/$stream/HighAvailability/$basearch/os/
gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-centosofficial
gpgcheck=1
repo_gpgcheck=0
metadata_expire=6h
countme=1
enabled=0

[highavailability-debug]
name=CentOS Stream $releasever - HighAvailability - Debug
baseurl=http://mirrors.aliyun.com/centos-stream/$stream/HighAvailability/$basearch/debug/tree/
gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-centosofficial
gpgcheck=1
repo_gpgcheck=0
metadata_expire=6h
enabled=0

[highavailability-source]
name=CentOS Stream $releasever - HighAvailability - Source
baseurl=http://mirrors.aliyun.com/centos-stream/$stream/HighAvailability/source/tree/
gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-centosofficial
gpgcheck=1
repo_gpgcheck=0
metadata_expire=6h
enabled=0

[nfv]
name=CentOS Stream $releasever - NFV
baseurl=http://mirrors.aliyun.com/centos-stream/$stream/NFV/$basearch/os/
gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-centosofficial
gpgcheck=1
repo_gpgcheck=0
metadata_expire=6h
countme=1
enabled=0

[nfv-debug]
name=CentOS Stream $releasever - NFV - Debug
baseurl=http://mirrors.aliyun.com/centos-stream/$stream/NFV/$basearch/debug/tree/
gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-centosofficial
gpgcheck=1
repo_gpgcheck=0
metadata_expire=6h
enabled=0

[nfv-source]
name=CentOS Stream $releasever - NFV - Source
baseurl=http://mirrors.aliyun.com/centos-stream/$stream/NFV/source/tree/
gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-centosofficial
gpgcheck=1
repo_gpgcheck=0
metadata_expire=6h
enabled=0

[rt]
name=CentOS Stream $releasever - RT
baseurl=http://mirrors.aliyun.com/centos-stream/$stream/RT/$basearch/os/
gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-centosofficial
gpgcheck=1
repo_gpgcheck=0
metadata_expire=6h
countme=1
enabled=0

[rt-debug]
name=CentOS Stream $releasever - RT - Debug
baseurl=http://mirrors.aliyun.com/centos-stream/$stream/RT/$basearch/debug/tree/
gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-centosofficial
gpgcheck=1
repo_gpgcheck=0
metadata_expire=6h
enabled=0

[rt-source]
name=CentOS Stream $releasever - RT - Source
baseurl=http://mirrors.aliyun.com/centos-stream/$stream/RT/source/tree/
gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-centosofficial
gpgcheck=1
repo_gpgcheck=0
metadata_expire=6h
enabled=0

[resilientstorage]
name=CentOS Stream $releasever - ResilientStorage
baseurl=http://mirrors.aliyun.com/centos-stream/$stream/ResilientStorage/$basearch/os/
gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-centosofficial
gpgcheck=1
repo_gpgcheck=0
metadata_expire=6h
countme=1
enabled=0

[resilientstorage-debug]
name=CentOS Stream $releasever - ResilientStorage - Debug
baseurl=http://mirrors.aliyun.com/centos-stream/$stream/ResilientStorage/$basearch/debug/tree/
gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-centosofficial
gpgcheck=1
repo_gpgcheck=0
metadata_expire=6h
enabled=0

[resilientstorage-source]
name=CentOS Stream $releasever - ResilientStorage - Source
baseurl=http://mirrors.aliyun.com/centos-stream/$stream/ResilientStorage/source/tree/
gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-centosofficial
gpgcheck=1
repo_gpgcheck=0
metadata_expire=6h
enabled=0

[extras-common]
name=CentOS Stream $releasever - Extras packages
baseurl=http://mirrors.aliyun.com/centos-stream/SIGs/$stream/extras/$basearch/extras-common/
gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-CentOS-SIG-Extras-SHA512
gpgcheck=1
repo_gpgcheck=0
metadata_expire=6h
countme=1
enabled=1

[extras-common-source]
name=CentOS Stream $releasever - Extras packages - Source
baseurl=http://mirrors.aliyun.com/centos-stream/SIGs/$stream/extras/source/extras-common/
gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-CentOS-SIG-Extras-SHA512
gpgcheck=1
repo_gpgcheck=0
metadata_expire=6h
enabled=0
# Step 4：缓存元数据
$ yum makecache fast

# Step 5: 安装必要的一些系统工具
$ yum install -y yum-utils 
    
# Step 6: 添加软件源信息
$ yum-config-manager --add-repo https://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo

# Step 7: 更新并安装Docker-ce
$ yum install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin -y

# Step 9: 开启Docker服务
$ systemctl enable  --now docker 

# Step 10：配置镜像加速器
$ mkdir -p /etc/docker
$ tee /etc/docker/daemon.json <<-'EOF'
{ 
  "registry-mirrors": [ "http://hub-mirror.c.163.com", 
   "https://kr1xs9ba.mirror.aliyuncs.com",
   "https://docker.m.daocloud.io", 
   "https://dockerproxy.com", 
   "https://docker.mirrors.ustc.edu.cn", 
   "https://docker.nju.edu.cn", 
   "https://docker.registry.cyou",
   "https://docker-cf.registry.cyou",
   "https://dockercf.jsdelivr.fyi",
   "https://docker.jsdelivr.fyi",
   "https://dockertest.jsdelivr.fyi",
   "https://mirror.aliyuncs.com",
   "https://dockerproxy.com",
   "https://mirror.baidubce.com",
   "https://docker.m.daocloud.io",
   "https://docker.nju.edu.cn",
   "https://docker.mirrors.sjtug.sjtu.edu.cn",
   "https://docker.mirrors.ustc.edu.cn",
   "https://mirror.iscas.ac.cn",
   "https://docker.rainbond.cc",
   "https://noohub.run",
   "https://huecker.io",
   "https://dockerhub.timeweb.cloud", 
   "https://registry.docker-cn.com",
   "https://yfw3r2c6.mirror.aliyuncs.com", 
   "http://hub-mirror.c.163.com", 
   "https://docker.m.daocloud.io",
   "https://dockerproxy.com",
   "https://docker.mirrors.ustc.edu.cn",
   "https://docker.nju.edu.cn"] 
}
EOF
# Step 12：重新加载systemd配置文件
$ systemctl daemon-reload

# Step 13：重启docker-ce
$ systemctl restart docker

# Step 14：查看镜像加速器是否生效
$ docker info | grep -A 5 'Registry Mirrors'
# Step 15：先 docker pull nginx
# Step 15：启动nginx:1.21容器，并且后台运行
$ docker  run -itd --name webservers  -p 80:80 nginx
    # 参数解释
        -it：让容器的标准输入打开，分配一个伪终端；允许后续通过 docker exec进入容器交互（如调试、修改配置）。
        -d：后台启动，生产环境中保持服务持续运行，不占用当前终端。
        -p: 将宿主机的80端口映照至容器的80端口
        --name: 容器名称
        nginx: 镜像名称

# Step 16：前台运行nginx容器，退出时删除
$ docker  run --rm -it nginx:1.21
```

## 3.2 `Docker`引擎详解

![null](https://hjmimage.oss-cn-zhangjiakou.aliyuncs.com/202406082218826.png#id=mVTiQ&originHeight=732&originWidth=754&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

### 3.2.1 `Docker Client`（`Docker `客户端）

  `Docker` 客户端是用户与` Docker` 系统交互的接口。用户通过 `CLI` 命令（如 `docker run`、`docker build`）与 `Docker` 守护进程通信，发出管理容器的各种指令。

### 3.2.2 `Dockerd`（`Docker` 守护进程）

  `Dockerd `是 `Docker`的核心守护进程，负责处理来自 `Docker`客户端的请求。它管理 `Docker` 容器、镜像、网络和数据卷，并将请求传递给下一级组件（如 `Containerd`）。通过`gRPC `与 `Containerd`通信。

### 3.2.3 `Containerd`

`  Containerd `是一个高级容器运行时，负责管理容器的整个生命周期。它处理容器的创建、执行、挂载存储和网络管理。通过 `gRPC` 接收 `Dockerd` 的指令，并进一步传递给 `Runc` 和 `Shim`。

- 容器生命周期管理：启动、停止、删除容器。

- 容器镜像管理：拉取、存储和管理容器镜像。

- 资源管理：管理容器的资源分配和限制。

- 日志管理：处理容器的日志输出。

### 3.3.4 `Runc`

  `Runc` 是一个 CLI 工具，用于根据` Open Container Initiative (OCI)` 规范创建和运行容器。`Runc` 负责执行容器的启动底层操作。通过 `fork` 进程来创建容器。`containerd`调用`runc`，并确保`Docker`镜像以`OCI`标准的格式交给`runc`。

### 3.3.5 `Shim`

  `Shim` 是一个中介程序，在容器与` Containerd` 之间提供隔离。当` Runc` 启动容器后，`Shim `保持容器运行并将` Runc `从系统进程中分离。这样，如果` Containerd `需要重启或崩溃，容器仍然可以继续运行。充当父进程，当容器的应用进程结束时，`Shim`负责接收容器的退出状态并清理资源。`runc`一旦容器创建完毕，对应的`runc`进程就会退出。因此，即使运行上百个容器，也无须保持上百个运行中的`runc`实例。一旦`runc`退出，相关联的`shim`进程就会成为容器的父进程。作为容器的父进程，`shim`用于管理容器与容器运行时之间的通信。在 `Docker` 中，`shim `的作用是让容器进程独立于` Docker` 守护进程，使得容器可以更稳定地运行，同时也提供了更好的隔离和资源管理。

- 保持所有`STDIN`和`STDOUT`流是开启状态，从而当`daemon`重启的时候，容器不会因为管道的关闭而终止；

- 容器进程管理：`shim`负责启动和管理容器内的主进程，并确保容器进程在后台正确运行。

- 日志转发：将容器的标准输出和错误日志转发到 `Docker` 引擎或日志系统。

- 容器终止处理：处理容器的正常或异常退出，并将退出状态报告给` daemon`。

- 生命周期管理：支持容器的启动、停止、重启等操作，确保容器生命周期的正常管理。



## 3.3 `Docker`基本指令

```bash
$ docker version
  
$ docker info 
```

## 3.4 `Docker`核心概念

### 3.4.1 镜像（`Image`）

  `Docker` 镜像（`Image`）就是一个只读的模板、一个标准化包。镜像可以用来创建`Docker`容器，一个镜像可以创建很多容器。镜像内包含操作系统，提供容器运行时所需的所有文件、二进制文件、库和配置等文件外，还包含了一些为运行时准备的一些配置参数（如环境变量、用户等）。镜像不包含任何动态数据，其内容在构建之后也不会被改变

  镜像有两个重要原则：

- 镜像是不可变的。镜像一旦创建，就无法修改。您只能创建新镜像或在其上添加更改。

- 容器镜像由层组成。每层代表一组添加、删除或修改文件的文件系统更改。

### 3.4.2 容器（`Container`通过镜像创建）

  `Docker` 利用容器（`Container`）独立运行的一个或一组应用。容器是从镜像创建的运行实例。它可以被启动、开始、停止、删除。每个容器都是相互隔离的、保证安全的平台。可以把容器看做是一个简易版的` Linux `环境（包括`root`用户权限、进程空间、用户空间和网络空间等）和运行在其中的应用程序。容器的实质是进程，但与直接在宿主执行的进程不同，容器进程运行于属于自己的独立的空间，因此容器可以拥有自己的` root `文件系统、自己的网络配置、自己的进程空间，甚至自己的用户 `ID` 空间。容器内的进程是运行在一个隔离的环境里，使用起来，就好像是在一个独立于宿主的系统下操作一样。这种特性使得容器封装的应用比直接在宿主运行更加安全。

  容器的定义和镜像几乎一模一样，也是一堆层的统一视角，唯一区别在于容器的最上面那一层是可读可写的。

### 3.4.3 仓库（存放镜像的地方）

  仓库类似于应用商店，存放的是`docker`镜像，分为公开仓库跟私有仓库。通常，仓库可以包含同一个软件不同版本的镜像，而标签就常用于对应该软件的各个版本。我们可以通过` <镜像名>:<标签>` 的格式来指定具体是这个软件哪个版本的镜像。如果不给出标签，将以 `latest `作为默认标签。

  仓库（`Repository`）是集中存放镜像文件的场所。有时候会把仓库和仓库注册服务器（`Registry`）混为一谈，并不严格区分。实际上，仓库注册服务器上往往存放着多个仓库，每个仓库中又包含了多个镜像，每个镜像有不同的标签（`tag`）。

## 3.5 Docker架构

​	`Docker`使用`C/S`架构，`Client `通过接口与`Server`进程通信实现容器的构建，运行和发布。`client`和`server`可以运行在同一台集群，也可以通过跨主机实现远程通信。

![null](https://hjmimage.oss-cn-zhangjiakou.aliyuncs.com/202411131420554.webp)

# 四、Docker镜像管理

## 4.1 登录官方镜像仓库（忽略）

链接：https://hub.docker.com/

```bash
# Step 1：登录
$ docker login

# Step 2：退出
$ docker logout
```

## 4.2 搜索官方仓库镜像

```bash
$ docker search nginx | head -3
NAME                        DESCRIPTION                                     STARS     OFFICIAL   AUTOMATED
nginx                       Official build of Nginx.                        16723     [OK]
bitnami/nginx               Bitnami nginx Docker Image                      124                  [OK]
```

![null](https://hjmimage.oss-cn-zhangjiakou.aliyuncs.com/202409081420131.png)

## 4.3 拉取镜像

```bash
$ docker pull tomcat:8-jdk8-corretto
```

## 4.4 导出镜像

```bash
$ docker image save tomcat:8-jdk8-corretto > /opt/docker-images-tar/tomcat-8-jdk-corretto.tar.gz
```

 提示：导出时需要指定镜像的名称和版本，否则再次导入时镜像名称为空

## 4.5 导入镜像

```bash
$ docker image load -i /opt/docker-images-tar/tomcat-8-jdk-corretto.tar.gz
```

## 4.6 删除镜像

```bash
$ docker rmi tomcat:8-jdk8-corretto
```

删除镜像(删除镜像需要保证没有基于此镜像运行容器，否则需要先删除容器。

## 4.7 查看镜像详细信息

```bash
$ docker image inspect nginx:1.21
```

## 4.8 阿里云镜像仓库使用

​	官网：https://cr.console.aliyun.com/cn-hangzhou/instances/mirrors

```bash
# Step 1：退出官方镜像仓库
$ docker logout
Removing login credentials for https://index.docker.io/v1/

# Step 2：登录私人阿里云镜像仓库
$ docker login --username=aliyun64123273 registry.cn-hangzhou.aliyuncs.com
用于登录的用户名为阿里云账号全名，密码为开通服务时设置的密码。

# Step 3：拉取私人阿里云镜像仓库镜像
$ docker pull registry.cn-hangzhou.aliyuncs.com/hujiaming/jiaming:[镜像版本号]

# Step 4：上传镜像到私人阿里云镜像仓库
$ docker login --username=aliyun64123273 registry.cn-hangzhou.aliyuncs.com
$ docker tag [ImageId] registry.cn-hangzhou.aliyuncs.com/hujiaming/jiaming:[镜像版本号]
$ docker push registry.cn-hangzhou.aliyuncs.com/hujiaming/jiaming:[镜像版本号]
```

# 五、容器的日常管理

![img](https://hjmimage.oss-cn-zhangjiakou.aliyuncs.com/202411110930370.png)

```bash
# Step 1：查看本地所有容器
$ docker ps -a     / docker container ls

# Step 2：启动一个容器
$ docker run -itd --name webserver -p 80:80 --restart=always nginx:1.21

# Step 3：查看正在运行的容器
$ docker ps 

# Step 4：查看所有的容器ID包括退出
$ docker ps -aq

# Step 5：停止/杀死/重启容器
$ docker stop/kill/restart webserver

# Step 7：删除容器
$ docker rm webserver

# Step 8：停止所有的容器（慎用）
$ docker stop `docker ps -q`

# Step 9：删除本地退出的所有容器（慎用）
$ docker container prune 

# Step 10：运行时限制资源需求 -m 限制内存大小；--cpu 限制cpu核数； --memory-swap 限制swap分区大小，默认内存的两倍。
$ docker run -itd --name webserver -m 512m --memory-swap=512m --cpus=1.0   nginx

# Step 11: 修改运行容器的内存限制
$ docker update --memory 1g --memory-swap 1g  webserver

# Step 12：查看容器的资源使用情况
$ docker stats webserver
```

## 5.1 查看容器的日志

```bash
# Step 1：查看容器的日志
$ docker logs -f <容器名称/容器ID>  --tail 1
# 或者：
$ cd /var/lib/docker/containers/<容器id>
```

![null](https://hjmimage.oss-cn-zhangjiakou.aliyuncs.com/202406091402223.png#id=NRxoO&originHeight=93&originWidth=1795&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

## 5.2 查看容器的`IP`地址

```bash
$ docker inspect <容器名称/容器ID> | grep -i -w "ipaddress"
```

![null](https://hjmimage.oss-cn-zhangjiakou.aliyuncs.com/202406091407510.png#id=pl0HB&originHeight=133&originWidth=1333&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

## 5.3 进入容器内

```bash
$ docker container exec -it webserver bash
```

## 5.4 容器与宿主机间传输文件

```bash
# Step 1：将容器的文件拷贝至宿主机中
$ docker cp webserver:/usr/share/nginx/html/index.html  /tmp/
Successfully copied 2.05kB to /tmp/

$ echo "2401" >  /tmp/index.html

# Step 2：宿主机的文件拷贝至容器中
$ docker cp /tmp/index.html webserver:/usr/share/nginx/html/index.html
```

## 5.5 容器重命名(慎用)

```bash
$ docker rename webserver02 webserver01
```

# 六、`Docker`数据卷的管理

​	`Docker` 存储卷（`Volume`）是用于将数据从容器持久化到宿主机中的一种机制。存储卷可以在容器之间共享和重用，即使容器被删除，卷中的数据仍然会保留。这样容器就算异常重启数据依然存在！设计数据卷的目的就是让数据的持久化完全独立于容器的生命周期。数据卷是经过特殊设计的目录。可以对数据卷里的内容直接进行修改。数据卷的变化不会影响镜像的更新。数据卷会一直存在，即使挂载数据卷的容器已经被删除。

- `Volumes`：数据存放在主机文件系统`/var/lib/docker/volumes/`目录下，该目录由`Docker`管理，不允许其他进程修改，官方推荐该种方式持久化数据。

- `Bind mounts`：直接挂载主机文件系统的任何目录或文件，类似主机和容器的共享目录，主机上任何进程都可以访问修改，在容器中也可以看到修改，这种方式最简单。

- `tmpfs`：挂载存储在主机系统的内存中，不会写入主机的文件系统。如果不希望将数据持久存储在任何位置，可以使用`tmpfs`，同时避免写入容器可写层提高性能。

![null](https://hjmimage.oss-cn-zhangjiakou.aliyuncs.com/202502122114553.png)

## 6.1 运行容器时持久化目录

```bash
$ mkdir /opt/docker-volumes		

$ docker rm -f $(docker ps -a -q)

$ docker run -itd --name webserver -p 8080:80 -v /opt/docker-volumes/webserver:/usr/share/nginx/html nginx:1.21


$ curl http://localhost:8080
<html>
<head><title>403 Forbidden</title></head>

<body>
<center><h1>403 Forbidden</h1></center>

<hr><center>nginx/1.21.6</center>

</body>

</html>

$ echo "hello docker volume" > /opt/docker-volumes/webserver/index.html

$ curl http://localhost:8080
hello docker volume


$ docker run -it -p 3306:3306 --name mysql \
-v /mydata/mysql/log:/var/log/mysql \
-v /mydata/mysql/data:/var/lib/mysql \
-v /mydata/mysql/conf:/etc/mysql/conf.d \
-e MYSQL_ROOT_PASSWORD=root  \
-d registry.cn-hangzhou.aliyuncs.com/hujiaming/mysql:5.7.44
```

## 6.2 挂载指定`volume`（数据卷容器）

  `volume`是`Docker`官方推荐的持久化方案，默认情况下，`volume`的存储空间来自于宿主机文件系统中的某个目录，如`/var/lib/docker/volumes/`，`docker`系统外的程序或者进程无权限修改其中的数据。如果没有`container`使用`volume`，其不会自动删除，用户需运行`docker volume prune`明确删除。

```bash
# Step 1：创建卷
$ docker volume create nginx-test01

# Step 2：查看卷
$ docker volume ls 
DRIVER    VOLUME NAME
local     nginx-test01

# Step 3：查看卷的详细信息
$ docker volume inspect nginx-test01
[
    {
        "CreatedAt": "2024-06-11T20:58:55+08:00",
        "Driver": "local",
        "Labels": null,
        "Mountpoint": "/var/lib/docker/volumes/nginx-test01/_data",
        "Name": "nginx-test01",
        "Options": null,
        "Scope": "local"
    }
]

# Step 4：查看nginx-test01持久卷的存放位置
$ ll /var/lib/docker/volumes/nginx-test01/_data/

# Step 5：挂载测试卷
$ docker run -itd --name webserver03 -p 81:80 -v nginx-test01:/usr/share/nginx/html nginx:v1.24.0

# Step 6：查看容器的详细信息
$ docker inspect webserver03
        "Mounts": [
            {
                "Type": "volume",
                "Name": "nginx-test01",
                "Source": "/var/lib/docker/volumes/nginx-test01/_data",
                "Destination": "/usr/share/nginx/html",
                "Driver": "local",
                "Mode": "z",
                "RW": true,
                "Propagation": ""
            }

# Step 7：再次查看nginx-test01的数据卷目录
$ ll /var/lib/docker/volumes/nginx-test01/_data/
总用量 8
-rw-r--r-- 1 root root 497 4月  11 2023 50x.html
-rw-r--r-- 1 root root 615 4月  11 2023 index.html

# Step 8：访问容器
$ curl 172.17.0.3
<!DOCTYPE html>
<html>
<head>
<title>Welcome to nginx!</title>

<style>
html { color-scheme: light dark; }
body { width: 35em; margin: 0 auto;
font-family: Tahoma, Verdana, Arial, sans-serif; }
</style>

</head>

<body>
<h1>Welcome to nginx!</h1>

<p>If you see this page, the nginx web server is successfully installed and
working. Further configuration is required.</p>

<p>For online documentation and support please refer to
<a href="http://nginx.org/">nginx.org</a>.<br/>
Commercial support is available at
<a href="http://nginx.com/">nginx.com</a>.</p>

<p><em>Thank you for using nginx.</em></p>

</body>

</html>

# Step 9：修改index.html文件内容
$ echo "hello volume nginx-test01" >  /var/lib/docker/volumes/nginx-test01/_data/index.html 

# Step 10：再次测试
$ curl 172.17.0.3
hello volume nginx-test01
```

## 6.3  `Bind Mounts`持久化（绑定挂载）

  `bind mount`持久化方式将宿主机中的文件、目录挂载到容器上；相应文件、目录可以被宿主机读写，也可以被容器读写。绑定挂载将主机文件系统中的一个目录挂载到容器中，允许容器直接访问和修改主机上的文件。

```bash
# Step 1：创建数据目录
$ mkdir /app/html -p

# Step 2：创建容器并且指定挂载Bind Mounts的卷
$ docker run -itd --name webserver04 -p 82:80 --mount type=bind,src=/app/html/,dst=/usr/share/nginx/html nginx:v1.24.0

# Step 3：查看容器详细信息
$ docker inspect webserver04
            "Mounts": [
                {
                    "Type": "bind",
                    "Source": "/app/html/",
                    "Target": "/usr/share/nginx/html"
                }
            ],
# Step 3：或者
$ docker inspect --format='{{.Mounts}}' <容器id>

# Step 4：测试访问容器
$ curl 172.17.0.3
<html>
<head><title>403 Forbidden</title></head>

<body>
<center><h1>403 Forbidden</h1></center>

<hr><center>nginx/1.24.0</center>

</body>

</html>

# Step 5：创建发布文件
$ echo "hello nginx world" > /app/html/index.html

# Step 6：再次测试
$ curl 172.17.0.3
hello nginx world
```

### 6.3.1 `bind mount`注意事项

​	宿主机目录路径必须以`/`或`~/`开头，否则`docker`会将其当成是`volume `而不是`bind mount`；如果容器中的目录不存在，`docker`会自动创建目录；如果容器中目录已有内容，那么`docker`会使用宿主机上目录的内容覆盖容器目录的内容。



## 6.4 `tmpfs mount`持久化

​	`tmpfs mount`只在`Linux`主机内存中持久化，是临时性的。当容器停止，`tmpfs mount`会被移除。只能在`Linux`主机内存中，不会持久化到磁盘。

​	场景：当启动需要访问这些敏感数据的`container`或者`service`时，`docker`会在宿主机上创建一个`tmpfs`，然后将敏感数据读出写到`tmpfs`中，再将`tmpfs mount`到`container`中，这样能保证数据安全。当容器停止运行时，则相应的`tmpfs`也从系统中删除。

```bash
# Step 1：创建容器并且指定他的卷为tmpfs类型
$ docker run -itd --name webserver05 --mount type=tmpfs,dst=/usr/share/nginx/html nginx:v1.24.0

# Step 2：查看容器的相关信息
$ docker inspect webserver05
        "Mounts": [
            {
                "Type": "tmpfs",
                "Source": "",
                "Destination": "/usr/share/nginx/html",
                "Mode": "",
                "RW": true,
                "Propagation": ""
            }
```

## 6.5 网络存储（`Network Storage`）

  使用网络文件系统（如 `NFS`等）将远程存储挂载到容器中，适用于需要跨多个主机共享数据的场景。

### 6.5.1`NFS`服务器配置

```bash
# Step 1：修改主机名
$ hostnamectl  set-hostname nfs-server

# Step 2：关闭防火墙及selinux
$ systemctl disable --now firewalld && setenforce 0

# Step 3：创建共享目录
$ mkdir /data

# Step 4：安装nfs
$ yum -y install nfs-utils rpcbind -y 

# Step 5：配置nfs
$ cat >> /etc/exports <<-EOF
/data  *(rw,sync,no_root_squash)
EOF

# Step 6：启动nfs
$ systemctl enable --now rpcbind nfs-server

# Step 7：测试挂载
$ showmount  -e 
Export list for nfs-server:
/data *
```

### 6.5.2 `Docker`服务器配置

```bash
# Step 1：安装nfs
$ yum -y install nfs-utils.x86_64

# Step 2：创建目录
$ mkdir /nfs

# Step 3：测试挂载
$ showmount  -e 192.168.174.9
Export list for 192.168.174.9:
/data *

# Step 4：远程挂载
$ mount -t nfs 192.168.174.9:/data /nfs

# Step 5：查看磁盘分区
$ df -Th 
文件系统                类型      容量  已用  可用 已用% 挂载点
devtmpfs                devtmpfs  2.0G     0  2.0G    0% /dev
tmpfs                   tmpfs     2.0G     0  2.0G    0% /dev/shm
tmpfs                   tmpfs     2.0G   12M  2.0G    1% /run
tmpfs                   tmpfs     2.0G     0  2.0G    0% /sys/fs/cgroup
/dev/mapper/centos-root xfs        17G  3.1G   14G   18% /
/dev/sda1               xfs      1014M  137M  878M   14% /boot
tmpfs                   tmpfs     394M     0  394M    0% /run/user/0
192.168.174.9:/data     nfs4       50G  1.4G   49G    3% /nfs
```

### 6.5.3 `Docker`测试

```bash
# Step 1：启动docker
$ docker run \
    -itd \
    --name webserver03 \
    -v /nfs/webserver03:/usr/share/nginx/html/  \
    nginx:1.27.1
    
# Step 2：测试
$ curl 172.17.0.2
<html>
<head><title>403 Forbidden</title></head>

<body>
<center><h1>403 Forbidden</h1></center>

<hr><center>nginx/1.27.1</center>

</body>

</html>

# Step 3：编写测试文件
$ echo hello,world > /nfs/webserver03/index.html

# Step 4：再次测试
$ curl 172.17.0.2
hello,world
```



## 6.6 存储卷的生命周期管理

```bash
# Step 1：查看所有volume
$ docker volume ls

# Step 2：查看单个volume详细信息
$ docker inspect nginx-test01/volume的名称
[
    {
        "CreatedAt": "2024-06-11T20:58:55+08:00",		# 创建时间
        "Driver": "local",		# 卷的驱动类型。local 是默认驱动，表示卷存储在本地宿主机文件系统中。
        "Labels": null,				# 卷的标签，用于标记或组织卷。可以为空或包含键值对。
        "Mountpoint": "/var/lib/docker/volumes/nginx-test01/_data",		# 卷在宿主机上的挂载点，即卷数据存储的路径。
        "Name": "nginx-test01",		# 卷的名称，是在 Docker 中标识这个卷的唯一名称。
        "Options": null,			# 卷的选项，可以用于配置卷的特定行为。可以为空或包含键值对。
        "Scope": "local"			# 卷的作用范围。local 表示该卷仅在创建它的宿主机上可用。
    }
]

# Step 3：查看volume是否挂载
$ docker ps -q | xargs docker inspect --format '{{ .Id }}: {{ .Mounts }}'

# Step 4：查看指定volume挂载在哪个容器
$ docker ps -a --format '{{.Names}}' | xargs -I {} docker inspect -f '{{ .Mounts }} {{ .Name }}' {} | grep 'volume名称'
```

![null](https://hjmimage.oss-cn-zhangjiakou.aliyuncs.com/202411181803405.png)

- `webserver03`：volume名称；

- `test`：容器名称。

```bash
#>>> 删除未使用的volume(慎用)
$ docker volume  prune -a
WARNING! This will remove anonymous local volumes not used by at least one container.
Are you sure you want to continue? [y/N] y
Total reclaimed space: 0B

#>>> 删除单个或多个volume（推荐）
$ docker volume rm <VOLUME_NAME> <VOLUME_NAME>
```



# 七、`Docker`网络

## 7.1 `Docker`网络简介

`Docker`默认使用桥接模式，在宿主机虚拟一个`Docker`容器网桥(`docker0`)，Docker启动一个容器时会根据`Docker`网桥的网段分配给容器一个`IP`地址，称为`Container-IP`，同时`Docker`网桥是每个容器的**默认网关**。在同一宿主机内的容器都接入同一个网桥，容器之间就能够通过容器的 `Container-IP`直接通信。`Docker`网桥是宿主机虚拟出来的，并不是真实存在的网络设备，外部网络是无法寻址到的，外部网络无法直接通过 `Container-IP`访问到容器。`bridge`可以理解为一个路由。它会在挂载到它的网口之间进行转发。同时，`Docker`随机分配一个本地未占用的私有网段中的一个地址给 `docker0`接口。

比如典型的 `172.17.42.1`，掩码为 `255.255.0.0`。此后启动的容器内的网口也会自动分配一个同一网段（`172.17.0.0/16`）的地址。

如果容器希望外部访问能够访问到，可以通过映射容器端口到宿主主机（端口映射），即`docker run`创建容器时候通过`-p`参数来启用，访问容器的时候就通过[宿主机IP]:[端口]访问容器。

```bash
# Step 1：查看网络列表
$ docker network list
NETWORK ID     NAME      DRIVER    SCOPE
6ea2847e7566   bridge    bridge    local
6dc3b646ecc7   host      host      local
8017dbee2836   none      null      local
```

- `bridge`：`Docker`默认的容器网络驱动。此模式会为每一个容器分配、设置`IP`等，并将容器连接到一个`docker0`虚拟网桥，通过`docker0`网桥以及`iptables nat`表配置与宿主机通信。

- `host`：容器与主机共享同一`Network Namespace`，共享同一套网络协议栈、路由表及`iptables`规则等。容器与主机看到的是相同的网络视图。

- `Container`：创建的容器不会创建自己的网卡，配置自己的`IP`，而是和一个指定的容器共享`IP`、端口。

- `None`：容器没有任何网络配置， 完全隔离的网络环境。

## 7.2 `host`网络模式配置（仅主机网络模式）

一个`Network Namespace`提供了一份独立的网络环境，包括网卡、路由、`iptable`规则等都与其他的`Network Namespace`隔离。 一个`Docker`容器一般会分配一个独立的`Network Namespace`。 但如果启动容器的时候使用`host`模式，那么这个容器将不会获得一个独立的`Network Namespace`， 而是和宿主机共用一个`Network Namespace`。容器将不会虚拟出自己的网卡、配置自己的`IP`等，而是共享宿主机的`IP`和端口。
																																			![img](https://cdn.nlark.com/yuque/0/2025/png/40379882/1760528677608-c4ccd743-a8a9-424b-ac0f-e3d37c34fa4c.png)

```bash
$ docker run -itd --name webserver01 --net=host nginx:v1.24.0

$ docker exec -it webserver01 bash

root@docker-ce:/# hostname  -I
192.168.174.110 172.17.0.1 
```

## 7.3 `container`网络模式配置

  该模式指定新创建的容器和已经存在的一个容器共享一个`Network Namespace`，而不是和宿主机共享。 新创建的容器不会创建自己的网卡，配置自己的`IP`，而是和一个指定的容器共享`IP`、端口范围等。同样，两个容器除了网络方面，其他的如文件系统、进程列表等还是隔离的。两个容器的进程可以通过`lo`网卡设备通信。
							![img](https://hjmimage.oss-cn-zhangjiakou.aliyuncs.com/202502102057757.png)													

```bash
$ docker run -id --name webserver03 registry.cn-hangzhou.aliyuncs.com/hujiaming/nginx:v1.24.0
6f9927ffd0090d95be1c4d93f278b40dfa8f0319fa4e8105c42a6446c0eba3c6

$ docker run -itd --name webserver04 --net container:webserver03  registry.cn-hangzhou.aliyuncs.com/hujiaming/tomcat:9.0.89-jdk8

$ docker exec -it webserver03 bash
root@6f9927ffd009:/# curl  localhost:8080
<!doctype html><html lang="en"><head><title>HTTP Status 404 – Not Found</title><style type="text/css">body {font-family:Tahoma,Arial,sans-serif;} h1, h2, h3, b {color:white;background-color:#525D76;} h1 {font-size:22px;} h2 {font-size:16px;} h3 {font-size:14px;} p {font-size:12px;} a {color:black;} .line {height:1px;background-color:#525D76;border:none;}</style></head><body><h1>HTTP Status 404 – Not Found</h1><hr class="line" /><p><b>Type</b> Status Report</p><p><b>Description</b> The origin server did not find a current representation for the target resource or is not willing to disclose that one exists.</p><hr class="line" /><h3>Apache Tomcat/9.0.89</h3></body></html>
```

## 7.4 `null`网络模式配置

  `none`模式，`Docker`容器拥有自己的`Network Namespace`，但是，并不为`Docker`容器进行任何网络配置。这个`Docker`容器没有网卡、`IP`、路由等信息。这种网络模式下容器只有`lo`回环网络，没有其他网卡。这种类型的网络没有办法联网，封闭的网络能很好的保证容器的安全性。

# 八、`Dockerfile`自定义构建`docker`镜像

## 8.1 `Dockerfile`指令集

  镜像层（`Image Layer`）是构成 `Docker` 镜像的基本单位。每个镜像都是由一系列只读的层**叠加**而成的。这些层中的每一层都代表了文件系统的一个**增量变更**。当创建一个新的镜像时，`Docker` 会基于基础镜像添加新的层，每一层包含了对文件系统的修改，如添加、删除或修改文件。

  镜像层特点：

- 只读性：每个镜像层都是只读的，这意味着一旦创建了一个层，就不能再对其进行修改。这种设计保证了镜像的一致性和不可变性。

- 增量更新：每个层只包含相对于前一层的差异部分。例如，如果一个层只是向文件系统中添加了一个新文件，那么这个层就只包含那个文件的信息，而不包含整个文件系统的完整副本。

- 共享性：多个镜像可以共享相同的底层。例如，如果你有两个不同的镜像，它们都是基于同一个基础镜像构建的，那么这两个镜像可以共享基础镜像的所有层，从而节省磁盘空间。

- 联合挂载：`Docker` 使用一种称为联合文件系统（`Union File System`, `UnionFS`）的技术来将这些只读层合并成一个统一的文件系统视图。它们可以被组合在一起以形成一个完整的镜像。当对镜像进行修改时，实际上是在创建一个新的层，这个新层包含了所做的修改，而底层的层则保持不变。这种分层的设计使得容器镜像非常灵活和高效，因为它可以充分利用共享层来减少存储空间的占用，并且可以快速构建和分发新的镜像。

![null](https://hjmimage.oss-cn-zhangjiakou.aliyuncs.com/202411130920360.png)

镜像层的工作原理：

- 构建过程：当你使用` docker build` 命令从 `Dockerfile` 构建镜像时，`Docker `会逐条解析 `Dockerfile` 中的指令，并为每条指令创建一个新的层。例如，`RUN`,`COPY`, `ADD`等命令都会生成新的层。

- 缓存机制：`Docker`在构建过程中会利用缓存来加速构建。如果 `Dockerfile` 中的某条指令之前已经执行过并且没有发生变化，`Docker`就可以直接使用之前的缓存层，而不需要重新执行该指令。

- 容器运行：当启动一个容器时，`Docker` 会在所有只读层之上添加一个可写层（通常称为“ 容器层 ”）。任何对文件系统的修改都会写入这个可写层，而不是修改底层的只读层。这样即使容器停止或被删除，只读层仍然保持不变。

- 存储优化：由于多个镜像和容器可以共享相同的底层，`Docker` 可以高效地管理磁盘空间。此外，只有实际发生变更的部分才会占用额外的空间，减少了存储需求。

### 8.1.1 `FROM`基础镜像

```bash
格式：
    FROM <image>
    FROM <image>:<tag>

示例：
    FROM registry.cn-hangzhou.aliyuncs.com/hujiaming/centos:centos7.9.2009

注：
    tag是可选的，如果不指定，将使用 latest 版本的基础镜像
```

### 8.1.2 `RUN`构建镜像时执行的命令

```bash
RUN 用于在构建镜像时执行命令，有以下两种执行方式：

shell 执行
格式：
    RUN <command>  # 直接通过 /bin/sh -c执行命令，支持 Shell 特性（如管道 |）。命令在 shell 中运行Linux 上默认为 /bin/sh -c。
示例：
RUN apt-get update && apt-get install -y python3
RUN echo "Hello, World!" > /tmp/test.txt

exec 执行
格式：
    RUN ["executable", "param1", "param2"]   # RUN ["命令”，“参数”]；使用 JSON 数组指定可执行文件和参数，不通过 Shell 解析。
示例：
RUN ["/bin/bash", "-c", "echo Hello, World!"]
RUN ["python3", "--version"]

注：RUN 指令创建的中间镜像会被缓存，并在下次构建中使用。如果不想使用这些缓存镜像，
可以在构建时指定 --no-cache 参数，如：docker build --no-cache
```

### 8.1.3 `ADD`将本地文件添加到容器中，自动解压

将本地文件添加到容器中，`tar`类型文件会自动解压。

```bash
格式：
    ADD <src>... <dest>

示例：
    ADD test.tar /apps/    # 添加 "test.tar" 到 /apps/
```

### 8.1.4 `COPY`将本地文件添加到容器中，不会自动解压

```bash
格式：
    COPY <src>... <dest>

示例：
    COPY test /apps/ 
```

### 8.1.5 `CMD`容器启动后执行的命令

构建镜像后调用，也就是在容器启动时才进行调用。

```dockerfile
Exec 格式（推荐）：
  语法格式：CMD ["executable","param1","param2"]  # 直接执行可执行文件，不通过 Shell 解析。避免 Shell 注入风险，兼容性更好（如 Alpine 环境）。
  示例：CMD ["/usr/bin/python3", "/app/app.py"]

Shell 格式：
  语法格式：CMD command param1 param2 # 隐式通过 /bin/sh -c执行命令，支持 Shell 特性（如管道 |）。兼容性较差。
  示例：CMD echo "Hello, $USER" > /tmp/hello.txt

作为 ENTRYPOINT 参数
  语法格式：CMD ["param1","param2"] # 仅在与 ENTRYPOINT配合时有效，参数会追加到 ENTRYPOINT命令后。无法独立生效。
  示例：ENTRYPOINT ["/usr/bin/nginx"]
        CMD ["-g", "daemon off;"]  # 最终命令：nginx -g "daemon off;"

注：CMD 不同于 RUN，CMD 用于指定容器启动时要执行的命令，而 RUN 用于指定镜像构建时要执行的命令。
```

### 8.1.6 `ENTRYPOINT`容器启动命令

```dockerfile
Exec 格式（推荐）：
  语法格式：ENTRYPOINT ["executable", "param1", "param2"] # 不通过 Shell 解析
  示例：ENTRYPOINT ["python", "app.py"]

Shell 格式（不推荐）：
  语法格式：ENTRYPOINT command param1 param2  # # 隐式通过 /bin/sh -c执行命令，支持 Shell 特性（如管道 |）。兼容性较差。
  示例：ENTRYPOINT top -b
  

  
docker run 传递的参数，都会先覆盖 CMD，然后由 CMD 传递给 ENTRYPOINT，实现灵活应用

注：ENTRYPOINT 与 CMD 非常类似，不同的是通过 docker run 执行的命令不会覆盖 ENTRYPOINT，而 docker run 命令中指定的任何参数，都会被当做参数再次传递给 CMD。Dockerfile 中只允许有一个 ENTRYPOINT 命令，多次指定时会覆盖前面的设置，而只执行最后的 ENTRYPOINT 指令。通常情况下，ENTRYPOINT 与 CMD 一起使用，ENTRYPOINT 写默认命令，当需要参数时使用 CMD 传参
```

### 8.1.7 `LABEL`为镜像添加元数据

```bash
格式：
    LABEL <key>=<value> <key>=<value> <key>=<value> ...

示例：
    LABEL version="1.0" description="这是一个 Web 服务器" by="IT 笔录"

注：
    使用 LABEL 指定元数据时，一条 LABEL 指定可以指定一或多条元数据，指定多条元数据时不同元数据
    之间通过空格分隔。推荐将所有的元数据通过一条 LABEL 指令指定，以免生成过多的中间镜像。
```

### 8.1.8 `ENV`设置环境变量

```bash
格式：
    ENV <key> <value>  # <key> 之后的所有内容均会被视为其 <value> 的组成部分，因此，一次只能设置一个变量
    ENV <key>=<value>  <key>=<value> # 可以设置多个变量，每个变量为一个 "<key>=<value>" 的键值对，如果 <key> 中包含空格，可以使用 \ 来进行转义，也可以通过 "" 来进行标示；另外，反斜线也可以用于续行

示例：
    ENV myName John Doe
    ENV myDog Rex The Dog
    ENV age=18  name=maoxiansheng
```

### 8.1.9 `EXPOSE`指定与外界交互的端口

```bash
格式：
    EXPOSE <port> [<port>...]

示例：
    EXPOSE 80 443
    EXPOSE 8080
    EXPOSE 11211/tcp 11211/udp

注：EXPOSE 并不会让容器的端口访问到主机。要使其可访问，需要在 docker run 运行容器时通过 -p 来发布这些端口，或通过 -P 参数来发布 EXPOSE 导出的所有端口

如果没有暴露端口，后期也可以通过 -p 8080:80 方式映射端口，但不能通过 -P 形式映射
```

### 8.1.10 `VOLUME`用于指定持久化目录（指定此目录可以被挂载出去）

```bash
格式：
    VOLUME ["/path/to/dir"]

示例：
    VOLUME ["/data"]
    VOLUME ["/var/www", "/var/log/apache2", "/etc/apache2"]
```

### 8.1.11 `WORKDIR`设置工作目录

```bash
格式：
    WORKDIR /path/to/workdir

示例：
    WORKDIR /a  (这时工作目录为 /a)
    WORKDIR b  (这时工作目录为 /a/b)
    WORKDIR c  (这时工作目录为 /a/b/c)

注：
  通过 WORKDIR 设置工作目录后，Dockerfile 中其后的命令 RUN、CMD、ENTRYPOINT、ADD、COPY
  等命令都会在该目录下执行。在使用 docker run 运行容器时，可以通过 -w 参数覆盖构建时所设置的工作目录。
```

### 8.1.12 `USER`指定运行容器时的用户名

指定运行容器时的用户名或 `UID`，后续的 `RUN `也会使用指定用户。使用` USER `指定用户时，可以使用用户名、`UID `或` GID`，或是两者的组合。当服务不需要管理员权限时，可以通过该命令指定运行用户。需要在之前创建所需要的用户。

```bash
格式:
USER user
USER user:group
USER uid
USER uid:gid
USER user:gid
USER uid:group

示例：
    USER www

注：
    使用 USER 指定用户后，Dockerfile 中其后的命令 RUN、CMD、ENTRYPOINT 都将使用该用户。
    镜像构建完成后，通过 docker run 运行容器时，可以通过 -u 参数来覆盖所指定的用户。
```

## 8.2 单阶段构建镜像

### 8.2.1 单阶段构建前端镜像

```bash
# Step 1：下载基础镜像
$ docker pull registry.cn-hangzhou.aliyuncs.com/hujiaming/node:16.15.0

# Step 2：创建存放目录
$ mkdir /opt/docker-images/web-vue -p
$ cd /opt/docker-images/web-vue

# Step 3：下载源码
$ git clone https://gitee.com/BRWYZ/web-vue.git

# Step 4：编写Dockerfile
$ vim /opt/docker-images/web-vue/Dockerfile
FROM registry.cn-hangzhou.aliyuncs.com/hujiaming/node:16.15.0
COPY ./web-vue .
WORKDIR web-vue
RUN npm install --registry=http://registry.npmmirror.com
EXPOSE 8080
CMD ["npm", "run", "serve"]

# Step 5：构建镜像
$ docker build -t webserver:v1.0 .

# Step 6：查看镜像
$ docker images | grep  -i -w webserver
webserver                                              v1.0              60f727ab4ebe   5 minutes ago   1.05GB

# Step 7：运行容器
$ docker run -itd --name webserver-vue -p 80:8080  webserver:v1.0

# Step 8：查看容器
$ docker ps  | grep  -w webserver-vue
97e8ab5a7cfb   webserver-vue:v1.0                                                   "docker-entrypoint.s…"   4 minutes ago       Up 4 minutes       0.0.0.0:8080->8080/tcp, :::8080->8080/tcp   webserver10

# Step 9：查看日志
$ docker logs -f webserver-vue
```

![img](https://cdn.nlark.com/yuque/0/2025/png/40379882/1754298457291-52e6ced5-736e-4d51-8c1b-a832b1d69a7d.png)

*浏览器访问：*`*http://主机IP:80*`

![img](https://cdn.nlark.com/yuque/0/2025/png/40379882/1754298486649-07d4b24b-33a7-4b6b-95da-076b770e2363.png)

### 8.2.2 单阶段构建后端项目

```bash
# Step 1：拉取基础镜像
$ cd /opt
$ docker pull registry.cn-hangzhou.aliyuncs.com/hujiaming/jre:8u211-data

# Step 2：拉取项目
$ git clone https://gitee.com/BRWYZ/java-test.git

# Step 3：切换目录
$ cd java-test/
$ ls
Dockerfile  spring-cloud-eureka-0.0.1-SNAPSHOT.jar

# Step 4：查看Dockerfile
$ cat Dockerfile 
FROM registry.cn-hangzhou.aliyuncs.com/hujiaming/jre:8u211-data
WORKDIR /app
COPY spring-cloud-eureka-0.0.1-SNAPSHOT.jar /app
EXPOSE 8761
CMD ["java","-jar","spring-cloud-eureka-0.0.1-SNAPSHOT.jar"]

# Step 5：构建镜像
$ docker build -t java-test:v1.0 .

# Step 6：查看镜像
$ docker images | grep java
java-test                                              v1.0              8975f4ec6299   11 minutes ago   174MB

# Step 7：启动容器
$ docker run -itd --name java-test  --ulimit nofile=65535:65535 --ulimit nproc=65535:65535 -p 8761:8761 java-test:v1.0

# Step 8：查看容器
$ docker ps | grep java 
8dcb97455b5d   java-test:v1.0                                                 "java -jar spring-cl…"   9 minutes ago   Up 9 minutes   0.0.0.0:8761->8761/tcp, :::8761->8761/tcp   java-test
```

**测试访问**
                                                                    ![img](https://hjmimage.oss-cn-zhangjiakou.aliyuncs.com/202502102058651.png)

## 8.3 `Dockerfile`优化方案

### 8.3.1 基础构建调试原则

1. 选择合适的基础镜像

![img](https://cdn.nlark.com/yuque/0/2025/png/40379882/1755430653233-e2065612-7a24-467d-9d4a-bb1d21b53810.png)

1. 采用多阶段构建

```yaml
# 构建阶段
FROM node:14-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# 生产阶段
FROM node:14-alpine
WORKDIR /app
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
CMD ["node", "dist/main.js"]
---
### 四层构建架构
# Stage 1: 依赖安装
FROM golang:1.21 AS deps
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download

# Stage 2: 构建二进制
FROM deps AS builder
COPY . .
RUN CGO_ENABLED=0 go build -o /app/bin

# Stage 3: 测试验证
FROM builder AS tester
RUN go test -v ./...

# Stage 4: 生产镜像
FROM alpine:3.18
COPY --from=builder /app/bin /usr/local/bin/
CMD ["bin"]
```

### 8.3.2 性能优化策略

1. 构建缓存利用层

```yaml
# 先复制package.json，利用缓存
COPY package.json package-lock.json ./
RUN npm install
COPY . .   # 后续文件变更不会导致npm重新执行
RUN npm build prod
```

1. 减少镜像层数以及合并 RUN 指令

```yaml
# 不推荐：多层命令
RUN apt-get update
RUN apt-get install -y curl
RUN apt-get clean

# 推荐：合并命令
RUN apt-get update && apt-get install -y curl && apt-get clean
```

1. 清理构建缓存

```yaml
# 错误示例：产生冗余层
RUN apt update
RUN apt install -y curl
RUN rm -rf /var/lib/apt/lists/*

# 正确优化：单层操作
RUN apt update && \
    apt install -y curl && \
    rm -rf /var/lib/apt/lists/*
```

1. 优化启动命令

```yaml
# 不推荐：使用shell形式
CMD python app.py

# 推荐：使用exec形式
CMD ["python", "app.py"]
```

### 8.3.3 安全优化加固

1. 使用非root用户

```yaml
# 创建非root用户
# 创建非root用户
RUN addgroup -S appgroup && \
    adduser -S appuser -G appgroup -h /app

USER appuser
WORKDIR /app
```

1. 减少暴露端口

```yaml
# 只暴露必要的端口
EXPOSE 8080
```

1. 最小化攻击面

```yaml
# 不推荐：安装不必要的工具
RUN apt-get update && apt-get install -y curl wget vim

# 推荐：只安装必要的工具
RUN apt-get update && apt-get install -y curl && apt-get clean
```

### 8.3.4 Dockerfile 优化总结

![img](https://cdn.nlark.com/yuque/0/2025/png/40379882/1755431246151-6387dee9-6eeb-433e-ae58-d7c59aa26d02.png)

## 8.4 项目实战

​	参考：若依项目`Docker`容器化部署课件

# 九、HarBor私有镜像仓库

## 9.1 简介

​	`Docker`容器应用的开发和运行离不开可靠的镜像管理，虽然`Docker`官方也提供了公共的镜像仓库，但是从安全和效率等方面考虑，部署我们私有环境内的`Registry`也是非常必要的。`Harbor`是由`VMware`公司开源的企业级的`Docker Registry`管理项目，它包括权限管理(`RBAC`)、`LDAP`、日志审核、管理界面、自我注册、镜像复制和中文支持等功能。

## 9.2 安装`docker-compose`

官方链接：https://github.com/docker/compose/releases/download/v2.33.0/docker-compose-linux-x86_64

```bash
$ wget https://github.com/docker/compose/releases/download/v2.33.0/docker-compose-linux-x86_64

$ mv docker-compose-linux-x86_64 /usr/local/bin/docker-compose

$ chmod a+x /usr/local/bin/docker-compose

$ docker-compose version
docker-compose  version
docker-compose version 1.18.0, build 8dd22a9
docker-py version: 2.6.1
CPython version: 3.6.8
OpenSSL version: OpenSSL 1.0.2k-fips  26 Jan 2017
```

## 9.5 安装`Harbor`

​	官方链接：https://github.com/goharbor/harbor/releases/download/v2.12.2/harbor-offline-installer-v2.12.2.tgz

```bash
# Step 1：上传安装包
$ ls
harbor-offline-installer-v2.12.2.tgz

# Step 2：解压安装包
$ tar xf harbor-offline-installer-v2.12.2.tgz

# Step 3：切换目录
$ cd harbor

# Step 4：拉取harbor所需的镜像
$ docker load -i harbor.v2.12.2.tar.gz

# Step 5：修改配置文件
$ cp harbor.yml.tmpl  harbor.yml
$ vim harbor.yml
...
hostname: harbor.tanke.love
http:
  port: 80
https:
  port: 443
  certificate: /tmp/fullchain.pem
  private_key: /tmp/privkey.pem
harbor_admin_password: 12345
data_volume: /data/harbor
location: /var/log/harbor
...

# Step 6：创建数据存放目录
$ mkdir /data/harbor -p

# Step 7：添加权限
$ chmod 777 -R /data/  /var/log/harbor/

# Step 8：生成和检查Harbor的配置文件，并确保所有必要的依赖项和环境都已准备就绪。
$ ./prepare 

# Step 9：查看镜像
$ docker-compose images
CONTAINER           REPOSITORY                    TAG                 IMAGE ID            SIZE
harbor-core         goharbor/harbor-core          v2.7.1              49d6c8a15d6c        215MB
harbor-db           goharbor/harbor-db            v2.7.1              b3f8d9d6c213        174MB
harbor-jobservice   goharbor/harbor-jobservice    v2.7.1              829d13e6aae7        252MB
harbor-log          goharbor/harbor-log           v2.7.1              eeb93d98a358        133MB
harbor-portal       goharbor/harbor-portal        v2.7.1              fe05b1b0bcfd        135MB
nginx               goharbor/nginx-photon         v2.7.1              e98018335c0d        126MB
redis               goharbor/redis-photon         v2.7.1              229dd1844a26        127MB
registry            goharbor/registry-photon      v2.7.1              9d50b10d3700        78.1MB
registryctl         goharbor/harbor-registryctl   v2.7.1              9b2219d529c8        140MB

# Step 10：安装和启动 Harbor 的主要安装脚本
$ ./install.sh 
[Step 5]: starting Harbor ...
WARN[0000] /opt/harbor/docker-compose.yml: `version` is obsolete 
[+] Running 10/10
 ✔ Network harbor_harbor        Created                                                                     0.1s 
 ✔ Container harbor-log         Started                                                                     0.9s 
 ✔ Container registry           Started                                                                     2.3s 
 ✔ Container registryctl        Started                                                                     1.9s 
 ✔ Container redis              Started                                                                     2.0s 
 ✔ Container harbor-portal      Started                                                                     2.3s 
 ✔ Container harbor-db          Started                                                                     2.3s 
 ✔ Container harbor-core        Started                                                                     2.9s 
 ✔ Container nginx              Started                                                                     4.1s 
 ✔ Container harbor-jobservice  Started                                                                     4.0s 
✔ ----Harbor has been installed and started successfully.----


# Step 11：查看启动的容器
$ docker-compose ps
NAME                IMAGE                                COMMAND                  SERVICE             CREATED             STATUS                    PORTS
harbor-core         goharbor/harbor-core:v2.7.1          "/harbor/entrypoint.…"   core                11 minutes ago      Up 11 minutes (healthy)   
harbor-db           goharbor/harbor-db:v2.7.1            "/docker-entrypoint.…"   postgresql          11 minutes ago      Up 11 minutes (healthy)   
harbor-jobservice   goharbor/harbor-jobservice:v2.7.1    "/harbor/entrypoint.…"   jobservice          11 minutes ago      Up 11 minutes (healthy)   
harbor-log          goharbor/harbor-log:v2.7.1           "/bin/sh -c /usr/loc…"   log                 11 minutes ago      Up 11 minutes (healthy)   127.0.0.1:1514->10514/tcp
harbor-portal       goharbor/harbor-portal:v2.7.1        "nginx -g 'daemon of…"   portal              11 minutes ago      Up 11 minutes (healthy)   
nginx               goharbor/nginx-photon:v2.7.1         "nginx -g 'daemon of…"   proxy               11 minutes ago      Up 11 minutes (healthy)   0.0.0.0:80->8080/tcp, :::80->8080/tcp, 0.0.0.0:443->8443/tcp, :::443->8443/tcp
redis               goharbor/redis-photon:v2.7.1         "redis-server /etc/r…"   redis               11 minutes ago      Up 11 minutes (healthy)   
registry            goharbor/registry-photon:v2.7.1      "/home/harbor/entryp…"   registry            11 minutes ago      Up 11 minutes (healthy)   
registryctl         goharbor/harbor-registryctl:v2.7.1   "/home/harbor/start.…"   registryctl         11 minutes ago      Up 11 minutes (healthy) 

# Step 12：登录镜像仓库
$ docker login https://harbor.tanke.love
```

![img](https://hjmimage.oss-cn-zhangjiakou.aliyuncs.com/202411092037308.png)

默认用户名:`admin`。密码：`Harbor12345`

**创建项目**

![img](https://hjmimage.oss-cn-zhangjiakou.aliyuncs.com/202411092038146.png)![img](https://hjmimage.oss-cn-zhangjiakou.aliyuncs.com/202411092039451.png)![img](https://hjmimage.oss-cn-zhangjiakou.aliyuncs.com/202411092040631.png)

## 9.6 `Harbor`简单使用

​	如果在使用`docker-compose`安装`HarBor`仓库时，使用的`HTTP`协议需要在`/etc/docker/daemon.json`配置一下内容，因为docker官方默认支持`HTTPS`协议。安装是使用的`HTTPS`忽略一下步骤

```bash
# Step 1：添加配置
$ cat /etc/docker/daemon.json 
{ 
  "registry-mirrors": [ "http://hub-mirror.c.163.com", 
  "https://kr1xs9ba.mirror.aliyuncs.com",
  "https://docker.m.daocloud.io", 
  "https://dockerproxy.com", 
  "https://docker.mirrors.ustc.edu.cn", 
  "https://docker.nju.edu.cn" ],
  "insecure-registries": ["192.168.174.179"]
}

# Step 2：重新加载配置文件
$ systemctl daemon-reload

# Step 3：重新启动docker
$ systemctl restart docker
```

1. 执行以下命令在项目中标记镜像。

```bash
docker tag SourceImage[:Tag] Harbor_address/ProjectName/Repsitory[:Tag]
```

 其中：`SourceImage` 表示您本地的镜像。

1. 执行以下命令将镜像上传到 Harbor 镜像仓库。

```bash
docker push Harbor_address/ProjectName/Repsitory[:Tag]
# Step 1：登录私有镜像仓库
$ docker login http://192.168.174.179:80
Username: admin
Password: 
WARNING! Your password will be stored unencrypted in /root/.docker/config.json.
Configure a credential helper to remove this warning. See
https://docs.docker.com/engine/reference/commandline/login/#credentials-store

Login Succeeded

# Step 2：退出仓库
$ docker logout
Removing login credentials for https://index.docker.io/v1/

# Step 3：查看登录信息
$ cat ~/.docker/config.json 
{
    "auths": {
        "192.168.174.179:80": {
            "auth": "YWRtaW46MTIzNDU2"
        }
    }
}

# Step 4：上传镜像到私有镜像仓库
$ docker tag 3b25b682ea82  192.168.174.179/cloud-study/nginx:latest
$ docker push 192.168.174.179/cloud-study/nginx:latest
The push refers to repository [192.168.174.179/cloud-study/nginx]
e4e9e9ad93c2: Pushed 
6ac729401225: Pushed 
8ce189049cb5: Pushed 
296af1bd2844: Pushed 
63d7ce983cd5: Pushed 
b33db0c3c3a8: Pushed 
98b5f35ea9d3: Pushed 
latest: digest: sha256:7ba542bde95e6523a4b126f610553e3657b8108bc3175596ee7e911ae1219bfc size: 1778
```

![img](https://hjmimage.oss-cn-zhangjiakou.aliyuncs.com/202411092051697.png)

## 9.7 `Harbor`复制同步

​	在大规模集群环境下，如果所有 `Docker` 主机都从一个镜像仓库中拉取镜像，那么此镜像仓库很可能会成为镜像分发的瓶颈，影响镜像分发的速度。可以通过搭建多个镜像仓库并配合使用远程复制功能，解决这一问题。

​	如下图所示，图中的镜像仓库分为两级：主仓库和子仓库。在主仓库和子仓库之间配置了远程复制策略。当一个应用镜像被推送到主仓库后，根据所配置的复制策略，镜像可以立即被分发到其他子镜像仓库。集群中的` Docker `主机就可以就近在其中任意一个子仓库中拉取所需的镜像，减轻主仓库的压力。

![null](https://hjmimage.oss-cn-zhangjiakou.aliyuncs.com/202411071139811.png)

### 9.7.1 `Push（推送）`模式

首先新建一个目标仓库，这里的目标仓库选择前面用`docker-0`部署的 `Harbor`。切记在`推送端`操作

![img](https://hjmimage.oss-cn-zhangjiakou.aliyuncs.com/202411092104909.png)![img](https://hjmimage.oss-cn-zhangjiakou.aliyuncs.com/202411092216164.png)![img](https://hjmimage.oss-cn-zhangjiakou.aliyuncs.com/202411092217324.png)

​	创建复制推送规则，复制策略支持推送和拉取两种方式。推送是指将当前 `Harbor` 实例的` Artifact（制品`）复制到远程` Artifact `仓库服务下；拉取是指将其他` Artifact `仓库服务中的 `Artifact `复制到当前 `Harbor `实例中。

​	`Harbor` 针对 `Artifact` 的不同属性支持` 4 `种过滤器，分别是`名称过滤器`、`Tag 过滤器`、`标签过滤器`、`资源过滤器`。

​	这里我们选择远程推送所有项目下的所有镜像到 `Docker Compose`部署的` Harbor` 中。触发模式为事件驱动，一旦有镜像推送到 `Harbor` 中，就会立即推送到远程仓库中。

![img](https://hjmimage.oss-cn-zhangjiakou.aliyuncs.com/202411092108123.png)![img](https://hjmimage.oss-cn-zhangjiakou.aliyuncs.com/202411092220562.png)![img](https://hjmimage.oss-cn-zhangjiakou.aliyuncs.com/202411092220349.png)

第一次需要手动复制，不然后续可能会自动触发失败。

![img](https://hjmimage.oss-cn-zhangjiakou.aliyuncs.com/202411092223772.png)

```bash
# Step 1：测试上传镜像
$ docker tag cdf68efc001e 192.168.174.179/cloud-study/harbor-exporter:v2.11.1
$ docker push 192.168.174.179/cloud-study/harbor-exporter:v2.11.1
The push refers to repository [192.168.174.179/cloud-study/harbor-exporter]
fe5588cde585: Pushed 
99078c9b3a60: Pushed 
99ff9f9dc8ce: Pushed 
926647c50af4: Pushed 
fa65d0b345aa: Mounted from cloud-study/prepare 
v2.11.1: digest: sha256:22caf9ff7131a278674bff2ed2494d7a47ee49ee6a8c6ed859740000d0322bca size: 1371
```

![img](https://hjmimage.oss-cn-zhangjiakou.aliyuncs.com/202411092225964.png)![img](https://hjmimage.oss-cn-zhangjiakou.aliyuncs.com/202411092226142.png)

目标镜像仓库查看

![img](https://hjmimage.oss-cn-zhangjiakou.aliyuncs.com/202411092228228.png)

## 十、`docker-compose`介绍

`Docker Compose`是一个用于定义和运行多容器 `Docker`应用的工具。通过使用`YAML`文件，你可以配置应用需要的所有服务，然后使用一个命令就能创建并启动这些服务。`Docker Compose`非常适合用来管理复杂的应用程序，其中包含多个相互依赖的服务。  

## 10.1 编排启动镜像

```bash
$ vim /opt/docker-compose/wordpress/docker-compose.yaml
services:
   db:
     image: registry.cn-hangzhou.aliyuncs.com/hujiaming/mysql:5.7
     volumes:
       - /data/db_data:/var/lib/mysql
     restart: always
     environment:
       MYSQL_ROOT_PASSWORD: somewordpress
       MYSQL_DATABASE: wordpress
       MYSQL_USER: wordpress
       MYSQL_PASSWORD: wordpress
   wordpress:
     depends_on:
       - db
     image: registry.cn-hangzhou.aliyuncs.com/hujiaming/wordpress:latest
     volumes:
       - /data/web_data:/var/www/html
     ports: 
       - "8000:80"
     restart: always
     environment:
       WORDPRESS_DB_HOST: db:3306
       WORDPRESS_DB_USER: wordpress
       WORDPRESS_DB_PASSWORD: wordpress

$ cd /opt/docker-compose/wordpress

# 启动服务
$ docker-compose up -d
```

## 10.2 `docker-compose`部署若依前后端项目

### 10.2.1 克隆源码

```bash
$ git  clone https://gitee.com/BRWYZ/vue-ruoyi.git
正克隆到 'vue-ruoyi'...
remote: Enumerating objects: 841, done.
remote: Counting objects: 100% (841/841), done.
remote: Compressing objects: 100% (657/657), done.
remote: Total 841 (delta 85), reused 841 (delta 85), pack-reused 0
接收对象中: 100% (841/841), 1.91 MiB | 1.26 MiB/s, done.
处理 delta 中: 100% (85/85), done.
```

### 10.2.2 制作jdk1.8镜像

官网：https://www.oracle.com/tw/java/technologies/javase/javase8-archive-downloads.html

![img](https://hjmimage.oss-cn-zhangjiakou.aliyuncs.com/202411131047460.png)

```bash
# Step 1：上传Linux服务器
[root@docker-0 java]# ls
jdk-8u202-linux-x64.rpm

# Step 2：拉取基础镜像
[root@docker-0 java]# docker pull registry.cn-hangzhou.aliyuncs.com/hujiaming/centos:centos7.9.2009
centos7.9.2009: Pulling from hujiaming/centos
2d473b07cdd5: Pull complete 
Digest: sha256:dead07b4d8ed7e29e98de0f4504d87e8880d4347859d839686a31da35a3b532f
Status: Downloaded newer image for registry.cn-hangzhou.aliyuncs.com/hujiaming/centos:centos7.9.2009
registry.cn-hangzhou.aliyuncs.com/hujiaming/centos:centos7.9.2009

# Step 3：编写jdk Dockerfile
[root@docker-0 java]# vim Dockerfile
FROM registry.cn-hangzhou.aliyuncs.com/hujiaming/centos:centos7.9.2009 
WORKDIR /root/
COPY jdk-8u202-linux-x64.rpm /root/
COPY ruoyi-admin.jar /root/
# 安装 JDK
RUN yum install -y \
    jdk-8u202-linux-x64.rpm && \
    yum clean all && \
    rm -rf /var/cache/dnf
COPY ./start.sh /
CMD [ "sh", "/start.sh" ]

# Step 4：准备启动脚本
[root@docker-0 java]# vim start.sh
#!/bin/bash
sleep 10 # 等待数据库初始化
ulimit -n 102400 # 解决了内存溢出
java -jar ./ruoyi-admin.jar # 启动java项目，端口是8080
```

### 10.2.3 制作nginx镜像

```bash
# Step 1：切换工作目录
[root@docker-0 java]# cd /root

# Step 2：创建目录
[root@docker-0 ~]# mkdir nginx

# Step 3：准备default配置文件
[root@docker-0 ~]# vim nginx/default.conf
[root@localhost ~]# mkdir ./nginx
[root@localhost ~]# vim ./nginx/default.conf
server {
    listen       80;
    server_name  localhost;
 
    location / {
        root   /usr/share/nginx/dist;
        try_files $uri $uri/ /index.html;
        index  index.html index.htm;
    }
 
    location /prod-api/{
      proxy_pass http://java.host:8080/; #注意这里的写法
      proxy_set_header Host $http_host;
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
   }
}

# Step 4：拉取nginx基础镜像
[root@docker-0 ~]# docker pull registry.cn-hangzhou.aliyuncs.com/hujiaming/nginx:1.27.1

# Step 5：编写Dockerfile
[root@docker-0 ~]# cd nginx/
[root@docker-0 nginx]# vim Dockerfile
FROM registry.cn-hangzhou.aliyuncs.com/hujiaming/nginx:1.27.1
# 将 dist 目录复制到 /usr/share/nginx/ 目录
COPY ./dist /usr/share/nginx/dist
# 将 default.conf 文件复制到 nginx 的配置目录
COPY ./default.conf /etc/nginx/conf.d/default.conf
# 保持 Nginx 前台运行
CMD ["nginx", "-g", "daemon off;"]
```

### 10.2.4 后端项目配置文件修改

```bash
# Step 1：切换工作目录
[root@docker-0 nginx]# cd /root/vue-ruoyi/

# Step 2：修改redis连接池
[root@docker-0 vue-ruoyi]# vim ruoyi-admin/src/main/resources/application.yml 
```

![null](https://hjmimage.oss-cn-zhangjiakou.aliyuncs.com/202411131111692.png)

```bash
# Step 3：修改MySQL连接地址
[root@docker-0 vue-ruoyi]# vim ruoyi-admin/src/main/resources/application-druid.yml
```

![null](https://hjmimage.oss-cn-zhangjiakou.aliyuncs.com/202411131113299.png)

### 10.2.5 修改项目菜单乱码问题(SQL修改)

```bash
[root@docker-0 vue-ruoyi]# vim sql/ry_20240629.sql 
SET NAMES "utf8";
```

![null](https://hjmimage.oss-cn-zhangjiakou.aliyuncs.com/202411131115944.png)

### 10.2.6 前端项目打包

```bash
# Step 1：切换目录
[root@docker-0 vue-ruoyi]# cd ruoyi-ui/

# Step 2：编译前端项目
[root@docker-0 vue-ruoyi]# docker run --rm -v $(pwd):/opt -w /opt registry.cn-hangzhou.aliyuncs.com/hujiaming/node:16.15.0 bash -c "npm install --registry=https://registry.npmmirror.com && npm run build:prod"

# Step 3：查看编译后的产物
[root@docker-0 ruoyi-ui]# ll dist/
总用量 32
-rw-r--r--. 1 root root  5663 11月 13 11:20 favicon.ico
drwxr-xr-x. 2 root root    39 11月 13 11:20 html
-rw-r--r--. 1 root root 12294 11月 13 11:20 index.html
-rw-r--r--. 1 root root  4086 11月 13 11:20 index.html.gz
-rw-r--r--. 1 root root    25 11月 13 11:20 robots.txt
drwxr-xr-x. 6 root root    51 11月 13 11:20 static

# Step 4：将前端打包好的目录拷贝到/root/nginx的配置目录中
[root@docker-0 ruoyi-ui]# cp -r ./dist  /root/nginx/

# Step 5：查看是否拷贝成功
[root@docker-0 ruoyi-ui]# ll /root/nginx/
总用量 8
-rw-r--r--. 1 root root 453 11月 13 11:01 default.conf
drwxr-xr-x. 4 root root 108 11月 13 11:22 dist
-rw-r--r--. 1 root root 325 11月 13 11:09 Dockerfile
```

### 10.2.7 后端代码打包

```bash
# Step 1：切换工作目录
[root@docker-0 ruoyi-ui]# cd /root/vue-ruoyi/

# Step 2：编译代码
[root@docker-0 ruoyi-ui]# docker run --rm -v $(pwd):/opt -v ~/.m2:/root/.m2 -w /opt registry.cn-hangzhou.aliyuncs.com/hujiaming/maven:3.8.6-jdk-8 mvn clean package
```

将代码映射到容器的/opt目录里，并指定/opt为工作目录，.m2是将打包所用到的缓存 Maven 下载的依赖项和插件映射出来。

```bash
# Step 3：将jar包拷贝到java的配置目录里
[root@docker-0 vue-ruoyi]# ll ruoyi-admin/target/
总用量 81996
drwxr-xr-x. 6 root root      149 11月 13 11:31 classes
drwxr-xr-x. 3 root root       25 11月 13 11:31 generated-sources
drwxr-xr-x. 2 root root       28 11月 13 11:31 maven-archiver
drwxr-xr-x. 3 root root       35 11月 13 11:31 maven-status
-rw-r--r--. 1 root root 83900165 11月 13 11:32 ruoyi-admin.jar
-rw-r--r--. 1 root root    61316 11月 13 11:31 ruoyi-admin.jar.original

[root@docker-0 vue-ruoyi]# cp -r ruoyi-admin/target/ruoyi-admin.jar /root/java/

[root@docker-0 vue-ruoyi]# ll /root/java/
总用量 256180
-rw-r--r--. 1 root root       311 11月 13 10:58 Dockerfile
-rw-r--r--. 1 root root 178418154 11月 13 10:48 jdk-8u202-linux-x64.rpm
-rw-r--r--. 1 root root  83900165 11月 13 11:33 ruoyi-admin.jar
```

### 10.2.8 编写Docker-compose 资源清单

```bash
# Step 1：切换工作目录
[root@docker-0 vue-ruoyi]# cd /root
[root@docker-0 ~]# cat docker-compose.yaml 
version: '3.8'  # 根据实际需要选择合适的版本
 
services:
  # Redis 服务
  ruoyi-redis:
    image: registry.cn-hangzhou.aliyuncs.com/hujiaming/redis:6.0
    container_name: ruoyi-redis
 
  # MySQL 服务
  ruoyi-db:
    image: registry.cn-hangzhou.aliyuncs.com/hujiaming/mysql:8
    container_name: ruoyi-db
    command: >
      --character-set-server=utf8mb4
      --collation-server=utf8mb4_general_ci
    environment:
      MYSQL_ROOT_PASSWORD: Abc123456!
      MYSQL_DATABASE: ry-vue
    volumes:
      - ./vue-ruoyi/sql:/docker-entrypoint-initdb.d:ro
      - ./ruoyi-db:/var/lib/mysql:rw
 
  # Java 后端服务
  ruoyi-java:
    build:
      context: ./java  # 使用 java 目录中的 Dockerfile
    container_name: ruoyi-java
    ports:
      - 8080:8080  # 公开端口，供 Nginx 代理访问
    links:
      - ruoyi-redis:redis.server
      - ruoyi-db:mysql.server
    depends_on:
      - ruoyi-db
      - ruoyi-redis
 
  # Nginx 服务
  ruoyi-nginx:
    build:
      context: ./nginx  # 使用 nginx 目录中的 Dockerfile
    container_name: ruoyi-nginx
    ports:
      - 80:80  # 将宿主机的 80 端口映射到容器的 80 端口
    links:
      - ruoyi-java:java.host  # 配置 Nginx 代理到 Java 服务
    depends_on:
      - ruoyi-java
      
# Step 2：构建
[root@docker-0 ~]# docker-compose  up --build
```

![null](https://hjmimage.oss-cn-zhangjiakou.aliyuncs.com/202411131147120.png)

![null](https://hjmimage.oss-cn-zhangjiakou.aliyuncs.com/202411131148520.png)

浏览器访问：`http://主机IP:80`



# 十一：扩展内容

## 11.1 Docker常用命令指南

![null](https://hjmimage.oss-cn-zhangjiakou.aliyuncs.com/202411131358582.webp)![null](https://hjmimage.oss-cn-zhangjiakou.aliyuncs.com/202411131358086.webp)



## 11.2 **进入运行的容器两种方式**

```bash
# Step 1：查看正在运行的容器
[root@docker-0 ~]# docker ps
CONTAINER ID   IMAGE          COMMAND                   CREATED         STATUS        PORTS     NAMES
4bdcf36e88f7   3b25b682ea82   "/docker-entrypoint.…"   3 seconds ago   Up 1 second   80/tcp    webserver01

# Step 2：进入容器方式一
[root@docker-0 ~]# docker exec -it webserver01  bash
root@4bdcf36e88f7:/# ls
bin  boot  dev	docker-entrypoint.d  docker-entrypoint.sh  etc	home  lib  lib64  media  mnt  opt  proc  root  run  sbin  srv  sys  tmp  usr  var

# Step 3：进入容器方式二
[root@docker-0 ~]# docker attach  webserver01
2024/11/13 06:05:17 [notice] 1#1: signal 28 (SIGWINCH) received
2024/11/13 06:05:17 [notice] 23#23: signal 28 (SIGWINCH) received
2024/11/13 06:05:17 [notice] 22#22: signal 28 (SIGWINCH) received
2024/11/13 06:05:17 [notice] 23#23: signal 28 (SIGWINCH) received
2024/11/13 06:05:17 [notice] 1#1: signal 28 (SIGWINCH) received
2024/11/13 06:05:17 [notice] 22#22: signal 28 (SIGWINCH) received
```

`docker exec  ` 进入容器后开启一个新的终端，可以在里面操作；`docker attach ` 进入容器正在执行的终端，不会启动新的进程！

区别：

​	`并发性`：`docker exec` 可以在同一个容器中并行执行多个命令，而 `docker attach` 则只能连接到容器的一个单独进程。
​	`安全性`：由于 `docker attach` 可能会导致容器主进程的意外终止，所以使用 `docker exec` 更安全。
​	`交互性`：尽管 `docker attach` 可以用于交互，但如果需要在容器内部启动新的交互式会话，使用 `docker exec` 会更方便。

参考链接：

​	`exec`：https://docs.docker.com/reference/cli/docker/container/exec/
​	`attach`：https://docs.docker.com/reference/cli/docker/container/attach/