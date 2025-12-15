# Centos9 安装docker

```bash
[root@bogon ~]# ll
total 4
-rw-------. 1 root root 996 Dec 13 16:18 anaconda-ks.cfg
[root@bogon ~]# ip a
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
       valid_lft forever preferred_lft forever
    inet6 ::1/128 scope host 
       valid_lft forever preferred_lft forever
2: ens160: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc fq_codel state UP group default qlen 1000
    link/ether 00:0c:29:1b:dc:15 brd ff:ff:ff:ff:ff:ff
    altname enp3s0
    inet 192.168.230.150/24 brd 192.168.230.255 scope global dynamic noprefixroute ens160
       valid_lft 1579sec preferred_lft 1579sec
    inet6 fe80::20c:29ff:fe1b:dc15/64 scope link noprefixroute 
       valid_lft forever preferred_lft forever
[root@bogon ~]# yum install -y vim
Last metadata expiration check: 0:39:48 ago on Sat 13 Dec 2025 04:41:52 PM CST.
Dependencies resolved.
====================================================================================================================
 Package                      Architecture         Version                            Repository               Size
====================================================================================================================
Installing:
 vim-enhanced                 x86_64               2:8.2.2637-23.el9                  appstream               1.7 M
Installing dependencies:
 gpm-libs                     x86_64               1.20.7-29.el9                      appstream                21 k
 vim-common                   x86_64               2:8.2.2637-23.el9                  appstream               7.0 M
 vim-filesystem               noarch               2:8.2.2637-23.el9                  baseos                   13 k

Transaction Summary
====================================================================================================================
Install  4 Packages

Total download size: 8.8 M
Installed size: 34 M
Downloading Packages:
(1/4): vim-filesystem-8.2.2637-23.el9.noarch.rpm                                    161 kB/s |  13 kB     00:00    
(2/4): gpm-libs-1.20.7-29.el9.x86_64.rpm                                            217 kB/s |  21 kB     00:00    
(3/4): vim-enhanced-8.2.2637-23.el9.x86_64.rpm                                      495 kB/s | 1.7 MB     00:03    
(4/4): vim-common-8.2.2637-23.el9.x86_64.rpm                                        822 kB/s | 7.0 MB     00:08    
--------------------------------------------------------------------------------------------------------------------
Total                                                                               571 kB/s | 8.8 MB     00:15     
CentOS Stream 9 - BaseOS                                                            1.3 MB/s | 1.6 kB     00:00    
Importing GPG key 0x8483C65D:
 Userid     : "CentOS (CentOS Official Signing Key) <security@centos.org>"
 Fingerprint: 99DB 70FA E1D7 CE22 7FB6 4882 05B5 55B3 8483 C65D
 From       : /etc/pki/rpm-gpg/RPM-GPG-KEY-centosofficial
Key imported successfully
Running transaction check
Transaction check succeeded.
Running transaction test
Transaction test succeeded.
Running transaction
  Preparing        :                                                                                            1/1 
  Installing       : gpm-libs-1.20.7-29.el9.x86_64                                                              1/4 
  Installing       : vim-filesystem-2:8.2.2637-23.el9.noarch                                                    2/4 
  Installing       : vim-common-2:8.2.2637-23.el9.x86_64                                                        3/4 
  Installing       : vim-enhanced-2:8.2.2637-23.el9.x86_64                                                      4/4 
  Running scriptlet: vim-enhanced-2:8.2.2637-23.el9.x86_64                                                      4/4 
  Verifying        : vim-filesystem-2:8.2.2637-23.el9.noarch                                                    1/4 
  Verifying        : gpm-libs-1.20.7-29.el9.x86_64                                                              2/4 
  Verifying        : vim-common-2:8.2.2637-23.el9.x86_64                                                        3/4 
  Verifying        : vim-enhanced-2:8.2.2637-23.el9.x86_64                                                      4/4 

Installed:
  gpm-libs-1.20.7-29.el9.x86_64           vim-common-2:8.2.2637-23.el9.x86_64 vim-enhanced-2:8.2.2637-23.el9.x86_64
  vim-filesystem-2:8.2.2637-23.el9.noarch

Complete!
[root@bogon ~]# yum install -y yum-utils 
Last metadata expiration check: 0:41:32 ago on Sat 13 Dec 2025 04:41:52 PM CST.
Dependencies resolved.
====================================================================================================================
 Package                                Architecture         Version                     Repository            Size
====================================================================================================================
Installing:
 yum-utils                              noarch               4.3.0-24.el9                baseos                39 k
Upgrading:
 dnf-plugins-core                       noarch               4.3.0-24.el9                baseos                36 k
 python3-dnf-plugins-core               noarch               4.3.0-24.el9                baseos               263 k

Transaction Summary
====================================================================================================================
Install  1 Package
Upgrade  2 Packages

Total download size: 337 k
Downloading Packages:
(1/3): yum-utils-4.3.0-24.el9.noarch.rpm                                            324 kB/s |  39 kB     00:00    
(2/3): dnf-plugins-core-4.3.0-24.el9.noarch.rpm                                     266 kB/s |  36 kB     00:00    
(3/3): python3-dnf-plugins-core-4.3.0-24.el9.noarch.rpm                             1.1 MB/s | 263 kB     00:00    
--------------------------------------------------------------------------------------------------------------------
Total                                                                                19 kB/s | 337 kB     00:18     
Running transaction check
Transaction check succeeded.
Running transaction test
Transaction test succeeded.
Running transaction
  Preparing        :                                                                                            1/1 
  Upgrading        : python3-dnf-plugins-core-4.3.0-24.el9.noarch                                               1/5 
  Upgrading        : dnf-plugins-core-4.3.0-24.el9.noarch                                                       2/5 
  Installing       : yum-utils-4.3.0-24.el9.noarch                                                              3/5 
  Cleanup          : dnf-plugins-core-4.3.0-23.el9.noarch                                                       4/5 
  Cleanup          : python3-dnf-plugins-core-4.3.0-23.el9.noarch                                               5/5 
  Running scriptlet: python3-dnf-plugins-core-4.3.0-23.el9.noarch                                               5/5 
  Verifying        : yum-utils-4.3.0-24.el9.noarch                                                              1/5 
  Verifying        : dnf-plugins-core-4.3.0-24.el9.noarch                                                       2/5 
  Verifying        : dnf-plugins-core-4.3.0-23.el9.noarch                                                       3/5 
  Verifying        : python3-dnf-plugins-core-4.3.0-24.el9.noarch                                               4/5 
  Verifying        : python3-dnf-plugins-core-4.3.0-23.el9.noarch                                               5/5 

Upgraded:
  dnf-plugins-core-4.3.0-24.el9.noarch                 python3-dnf-plugins-core-4.3.0-24.el9.noarch                
Installed:
  yum-utils-4.3.0-24.el9.noarch                                                                                     

Complete!
[root@bogon ~]# yum-config-manager --add-repo https://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
Adding repo from: https://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
[root@bogon ~]# yum install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin -y
Docker CE Stable - x86_64                                                           189 kB/s |  65 kB     00:00    
Dependencies resolved.
====================================================================================================================
 Package                           Architecture   Version                            Repository                Size
====================================================================================================================
Installing:
 containerd.io                     x86_64         2.2.0-2.el9                        docker-ce-stable          35 M
 docker-buildx-plugin              x86_64         0.30.1-1.el9                       docker-ce-stable          17 M
 docker-ce                         x86_64         3:29.1.3-1.el9                     docker-ce-stable          22 M
 docker-ce-cli                     x86_64         1:29.1.3-1.el9                     docker-ce-stable         8.3 M
 docker-compose-plugin             x86_64         5.0.0-1.el9                        docker-ce-stable         8.1 M
Installing dependencies:
 container-selinux                 noarch         4:2.242.0-1.el9                    appstream                 60 k
 fuse-overlayfs                    x86_64         1.16-1.el9                         appstream                 66 k
 passt                             x86_64         0^20250512.g8ec1341-2.el9          appstream                263 k
 passt-selinux                     noarch         0^20250512.g8ec1341-2.el9          appstream                 26 k
Installing weak dependencies:
 docker-ce-rootless-extras         x86_64         29.1.3-1.el9                       docker-ce-stable         3.4 M

Transaction Summary
====================================================================================================================
Install  10 Packages

Total download size: 95 M
Installed size: 368 M
Downloading Packages:
(1/10): fuse-overlayfs-1.16-1.el9.x86_64.rpm                                        435 kB/s |  66 kB     00:00    
(2/10): container-selinux-2.242.0-1.el9.noarch.rpm                                  381 kB/s |  60 kB     00:00    
(3/10): passt-selinux-0^20250512.g8ec1341-2.el9.noarch.rpm                          466 kB/s |  26 kB     00:00    
(4/10): passt-0^20250512.g8ec1341-2.el9.x86_64.rpm                                  1.2 MB/s | 263 kB     00:00    
(5/10): docker-buildx-plugin-0.30.1-1.el9.x86_64.rpm                                351 kB/s |  17 MB     00:49    
(6/10): docker-ce-29.1.3-1.el9.x86_64.rpm                                           321 kB/s |  22 MB     01:10    
(7/10): docker-ce-rootless-extras-29.1.3-1.el9.x86_64.rpm                           136 kB/s | 3.4 MB     00:25    
(8/10): containerd.io-2.2.0-2.el9.x86_64.rpm                                        363 kB/s |  35 MB     01:39    
(9/10): docker-compose-plugin-5.0.0-1.el9.x86_64.rpm                                586 kB/s | 8.1 MB     00:14    
(10/10): docker-ce-cli-29.1.3-1.el9.x86_64.rpm                                      137 kB/s | 8.3 MB     01:02    
--------------------------------------------------------------------------------------------------------------------
Total                                                                               859 kB/s |  95 MB     01:52     
Docker CE Stable - x86_64                                                            15 kB/s | 1.6 kB     00:00    
Importing GPG key 0x621E9F35:
 Userid     : "Docker Release (CE rpm) <docker@docker.com>"
 Fingerprint: 060A 61C5 1B55 8A7F 742B 77AA C52F EB6B 621E 9F35
 From       : https://mirrors.aliyun.com/docker-ce/linux/centos/gpg
Key imported successfully
Running transaction check
Transaction check succeeded.
Running transaction test
Transaction test succeeded.
Running transaction
  Preparing        :                                                                                            1/1 
  Installing       : passt-0^20250512.g8ec1341-2.el9.x86_64                                                    1/10 
  Running scriptlet: passt-selinux-0^20250512.g8ec1341-2.el9.noarch                                            2/10 
  Installing       : passt-selinux-0^20250512.g8ec1341-2.el9.noarch                                            2/10 
  Running scriptlet: passt-selinux-0^20250512.g8ec1341-2.el9.noarch                                            2/10 
  Installing       : docker-buildx-plugin-0.30.1-1.el9.x86_64                                                  3/10 
  Running scriptlet: docker-buildx-plugin-0.30.1-1.el9.x86_64                                                  3/10 
  Installing       : docker-compose-plugin-5.0.0-1.el9.x86_64                                                  4/10 
  Running scriptlet: docker-compose-plugin-5.0.0-1.el9.x86_64                                                  4/10 
  Running scriptlet: container-selinux-4:2.242.0-1.el9.noarch                                                  5/10 
  Installing       : container-selinux-4:2.242.0-1.el9.noarch                                                  5/10 
  Running scriptlet: container-selinux-4:2.242.0-1.el9.noarch                                                  5/10 
  Installing       : containerd.io-2.2.0-2.el9.x86_64                                                          6/10 
  Running scriptlet: containerd.io-2.2.0-2.el9.x86_64                                                          6/10 
  Installing       : docker-ce-cli-1:29.1.3-1.el9.x86_64                                                       7/10 
  Running scriptlet: docker-ce-cli-1:29.1.3-1.el9.x86_64                                                       7/10 
  Installing       : fuse-overlayfs-1.16-1.el9.x86_64                                                          8/10 
  Running scriptlet: fuse-overlayfs-1.16-1.el9.x86_64                                                          8/10 
  Installing       : docker-ce-rootless-extras-29.1.3-1.el9.x86_64                                             9/10 
  Running scriptlet: docker-ce-rootless-extras-29.1.3-1.el9.x86_64                                             9/10 
  Installing       : docker-ce-3:29.1.3-1.el9.x86_64                                                          10/10 
  Running scriptlet: docker-ce-3:29.1.3-1.el9.x86_64                                                          10/10 
  Running scriptlet: passt-selinux-0^20250512.g8ec1341-2.el9.noarch                                           10/10 
  Running scriptlet: container-selinux-4:2.242.0-1.el9.noarch                                                 10/10 
  Running scriptlet: docker-ce-3:29.1.3-1.el9.x86_64                                                          10/10 
  Verifying        : container-selinux-4:2.242.0-1.el9.noarch                                                  1/10 
  Verifying        : fuse-overlayfs-1.16-1.el9.x86_64                                                          2/10 
  Verifying        : passt-0^20250512.g8ec1341-2.el9.x86_64                                                    3/10 
  Verifying        : passt-selinux-0^20250512.g8ec1341-2.el9.noarch                                            4/10 
  Verifying        : containerd.io-2.2.0-2.el9.x86_64                                                          5/10 
  Verifying        : docker-buildx-plugin-0.30.1-1.el9.x86_64                                                  6/10 
  Verifying        : docker-ce-3:29.1.3-1.el9.x86_64                                                           7/10 
  Verifying        : docker-ce-cli-1:29.1.3-1.el9.x86_64                                                       8/10 
  Verifying        : docker-ce-rootless-extras-29.1.3-1.el9.x86_64                                             9/10 
  Verifying        : docker-compose-plugin-5.0.0-1.el9.x86_64                                                 10/10 

Installed:
  container-selinux-4:2.242.0-1.el9.noarch              containerd.io-2.2.0-2.el9.x86_64                           
  docker-buildx-plugin-0.30.1-1.el9.x86_64              docker-ce-3:29.1.3-1.el9.x86_64                            
  docker-ce-cli-1:29.1.3-1.el9.x86_64                   docker-ce-rootless-extras-29.1.3-1.el9.x86_64              
  docker-compose-plugin-5.0.0-1.el9.x86_64              fuse-overlayfs-1.16-1.el9.x86_64                           
  passt-0^20250512.g8ec1341-2.el9.x86_64                passt-selinux-0^20250512.g8ec1341-2.el9.noarch             

Complete!
[root@bogon ~]# yum install -y yum-utils device-mapper-persistent-data lvm2
Last metadata expiration check: 0:08:48 ago on Sat 13 Dec 2025 05:24:21 PM CST.
Package yum-utils-4.3.0-24.el9.noarch is already installed.
Package device-mapper-persistent-data-1.1.0-1.el9.x86_64 is already installed.
Package lvm2-9:2.03.32-2.el9.x86_64 is already installed.
Dependencies resolved.
Nothing to do.
Complete!
# 下面这一步可以尝试忽略 不执行，得试一下
[root@bogon ~]# sed -i 's/$releasever/9/g' /etc/yum.repos.d/docker-ce.repo
# 上面这一步可以尝试忽略 不执行，得试一下

[root@bogon ~]# systemctl enable  --now docker
Created symlink /etc/systemd/system/multi-user.target.wants/docker.service → /usr/lib/systemd/system/docker.service.
[root@bogon ~]# mkdir -p /etc/docker
[root@bogon ~]# tee /etc/docker/daemon.json <<-'EOF'
{               mkdir -p /etc/docker
                tee /etc/docker/daemon.json <<-'EOF'
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
   "^C
[root@bogon ~]# ^C
[root@bogon ~]# tee /etc/docker/daemon.json <<-'EOF'
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
EOF"https://docker.nju.edu.cn"] edu.cn",
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
[root@bogon ~]# cd /etc/docker/
[root@bogon docker]# ll
total 4
-rw-r--r--. 1 root root 1090 Dec 13 17:40 daemon.json
[root@bogon docker]# vim daemon.json
[root@bogon docker]# systemctl daemon-reload
[root@bogon docker]# systemctl restart docker
[root@bogon docker]# docker info | grep -A 5 'Registry Mirrors'
 Registry Mirrors:
  http://hub-mirror.c.163.com/
  https://kr1xs9ba.mirror.aliyuncs.com/
  https://docker.m.daocloud.io/
  https://dockerproxy.com/
  https://docker.mirrors.ustc.edu.cn/
[root@bogon docker]# docker version
Client: Docker Engine - Community
 Version:           29.1.3
 API version:       1.52
 Go version:        go1.25.5
 Git commit:        f52814d
 Built:             Fri Dec 12 14:53:00 2025
 OS/Arch:           linux/amd64
 Context:           default

Server: Docker Engine - Community
 Engine:
  Version:          29.1.3
  API version:      1.52 (minimum version 1.44)
  Go version:       go1.25.5
  Git commit:       fbf3ed2
  Built:            Fri Dec 12 14:49:33 2025
  OS/Arch:          linux/amd64
  Experimental:     false
 containerd:
  Version:          v2.2.0
  GitCommit:        1c4457e00facac03ce1d75f7b6777a7a851e5c41
 runc:
  Version:          1.3.4
  GitCommit:        v1.3.4-0-gd6d73eb8
 docker-init:
  Version:          0.19.0
  GitCommit:        de40ad0
[root@bogon docker]# docker ps
CONTAINER ID   IMAGE     COMMAND   CREATED   STATUS    PORTS     NAMES
[root@bogon docker]# docker images
                                                                                                i Info →   U  In Use
IMAGE   ID             DISK USAGE   CONTENT SIZE   EXTRA
[root@bogon docker]# 
```

