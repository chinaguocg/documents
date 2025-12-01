# Ansible 初识四：Ansible 实验一

## 1.控制节点安装ansible

```bash
[root@bogon ~]# yum install -y ansible
#安装 ansible ……

Complete!
[root@bogon ~]# ansible --version
ansible 2.9.27
  config file = /etc/ansible/ansible.cfg
  configured module search path = [u'/root/.ansible/plugins/modules', u'/usr/share/ansible/plugins/modules']
  ansible python module location = /usr/lib/python2.7/site-packages/ansible
  executable location = /usr/bin/ansible
  python version = 2.7.5 (default, Aug  4 2017, 00:39:18) [GCC 4.8.5 20150623 (Red Hat 4.8.5-16)]
```

## 2.控制节点与被控节点之间实现免密登录

```bash
# 控制节点生成密钥
[root@bogon ~]# ssh-keygen
Generating public/private rsa key pair.
Enter file in which to save the key (/root/.ssh/id_rsa): 
Created directory '/root/.ssh'.
Enter passphrase (empty for no passphrase): 
Enter same passphrase again: 
Your identification has been saved in /root/.ssh/id_rsa.
Your public key has been saved in /root/.ssh/id_rsa.pub.
The key fingerprint is:
SHA256:ZDTrY1VLFnHvT6ELvRu1dzKfNMXPeWjxqfgwe1BvMLA root@bogon
The key's randomart image is:
+---[RSA 2048]----+
|        o   *o.  |
|       . o = o . |
|        + . +  ..|
|       + . E.+.o.|
|        S  ..o=.=|
|       . . .. +OB|
|           o.+**O|
|            =o=+*|
|           oo+ ..|
+----[SHA256]-----+
[root@bogon ~]# ls .ssh/
id_rsa  id_rsa.pub

# 控制节点将公钥传给被控节点（被控节点相当于服务端）
[root@bogon ~]# ssh-copy-id root@192.168.230.143
/usr/bin/ssh-copy-id: INFO: Source of key(s) to be installed: "/root/.ssh/id_rsa.pub"
The authenticity of host '192.168.230.143 (192.168.230.143)' can't be established.
ECDSA key fingerprint is SHA256:Q/vkKEb66rKmwCj2sJb0BA5KECXKF86jfiLcKXOsdKY.
ECDSA key fingerprint is MD5:79:0a:25:1e:bb:21:61:b4:e7:97:a9:8b:f0:40:72:b4.
Are you sure you want to continue connecting (yes/no)? yes
/usr/bin/ssh-copy-id: INFO: attempting to log in with the new key(s), to filter out any that are already installed
/usr/bin/ssh-copy-id: INFO: 1 key(s) remain to be installed -- if you are prompted now it is to install the new keys
root@192.168.230.143's password: 

Number of key(s) added: 1

Now try logging into the machine, with:   "ssh 'root@192.168.230.143'"
and check to make sure that only the key(s) you wanted were added.

# 测试免密登录是否成功
[root@bogon ~]# ssh 192.168.230.143
Last login: Mon Dec  1 03:29:21 2025 from 192.168.230.1
[root@bogon ~]# ifconfig
ens33: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 192.168.230.143  netmask 255.255.255.0  broadcast 192.168.230.255
        inet6 fe80::92e6:f41d:63f3:a3ec  prefixlen 64  scopeid 0x20<link>
        inet6 fe80::1431:4dd4:6bee:a8a1  prefixlen 64  scopeid 0x20<link>
        ether 00:0c:29:31:28:e3  txqueuelen 1000  (Ethernet)
        RX packets 1198  bytes 97673 (95.3 KiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 542  bytes 55899 (54.5 KiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536
        inet 127.0.0.1  netmask 255.0.0.0
        inet6 ::1  prefixlen 128  scopeid 0x10<host>
        loop  txqueuelen 1  (Local Loopback)
        RX packets 64  bytes 5568 (5.4 KiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 64  bytes 5568 (5.4 KiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

[root@bogon ~]# exit
logout
Connection to 192.168.230.143 closed.
[root@bogon ~]# 


```

## 3.控制节点配置ansible playbook

```bash
# 修改默认的清单文件： /etc/ansible/hosts
[root@bogon ~]# vim /etc/ansible/hosts
[root@bogon ~]# cat /etc/ansible/hosts 
#…忽略…
[qianduan]
192.168.230.143
#…忽略…
# 验证：ansible  组名|主机名   --list-hosts   [-i   清单文件名称] 
[root@bogon ~]# ansible qianduan   --list-hosts
  hosts (1):
    192.168.230.143
[root@bogon ~]# 


# 准备控制节点的前端目录及配置文件(模拟前端的部署：当前主要是做了一个nginx的配置文件)
# 被控制节点已经提前安装了Nginx
[root@bogon ~]# mkdir /qianduan
[root@bogon ~]# cd /qianduan
[root@bogon qianduan]# ll
total 0
[root@bogon qianduan]# vim qianduan_project_deploy.yml
[root@bogon qianduan]# vim nginx_qianduan.conf
[root@bogon qianduan]# cat qianduan_project_deploy.yml
---
- name: updata config nginx qianduan
  hosts: qianduan
  remote_user: root
  vars:
    nginx_confd_path: /etc/nginx/conf.d
    local_nginx_confd_path: ./nginx_qianduan.conf

  tasks:
    - name: Copy Nginx config file
      template:
        src: "{{ local_nginx_confd_path }}"
        dest: "{{ nginx_confd_path }}"
        mode: 644
      notify: reload nginx

  handlers:
   - name: reload nginx
     service:
       name: nginx
       state: reloaded
[root@bogon qianduan]# cat nginx_qianduan.conf
upstream qianduan {
  server 10.9.41.166:80;
}
server {
  listen 80;
  server_name localhost;
  location {
    proxy_pass http://qianduan;
  }
}



# 模拟执行
[root@bogon qianduan]# ansible-playbook qianduan_project_deploy.yml --check

PLAY [updata config nginx qianduan] **********************************************************

TASK [Gathering Facts] ***********************************************************************
ok: [192.168.230.143]

TASK [Copy Nginx config file] ****************************************************************
changed: [192.168.230.143]

RUNNING HANDLER [reload nginx] ***************************************************************
changed: [192.168.230.143]

PLAY RECAP ***********************************************************************************
192.168.230.143            : ok=3    changed=2    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0   

# Playbook 执行
[root@bogon qianduan]# ansible-playbook qianduan_project_deploy.yml

PLAY [updata config nginx qianduan] *****************************************************************************************************************************************************************************

TASK [Gathering Facts] ******************************************************************************************************************************************************************************************
ok: [192.168.230.143]

TASK [Copy Nginx config file] ***********************************************************************************************************************************************************************************
changed: [192.168.230.143]

RUNNING HANDLER [reload nginx] **********************************************************************************************************************************************************************************
fatal: [192.168.230.143]: FAILED! => {"changed": false, "msg": "Unable to start service nginx: Job for nginx.service failed because the control process exited with error code. See \"systemctl status nginx.service\" and \"journalctl -xe\" for details.\n"}

NO MORE HOSTS LEFT **********************************************************************************************************************************************************************************************

PLAY RECAP ******************************************************************************************************************************************************************************************************
192.168.230.143            : ok=2    changed=1    unreachable=0    failed=1    skipped=0    rescued=0    ignored=0   

# 报错了 就得排错

```

## 4.排错

```bash
# 根据提示就去到192.168.230.143(被控节点)去排错了
[root@bogon ~]# systemctl status nginx.service
● nginx.service - The nginx HTTP and reverse proxy server
   Loaded: loaded (/usr/lib/systemd/system/nginx.service; disabled; vendor preset: disabled)
   Active: failed (Result: exit-code) since Mon 2025-12-01 06:59:37 EST; 45s ago
  Process: 11509 ExecStartPre=/usr/sbin/nginx -t (code=exited, status=1/FAILURE)
  Process: 11507 ExecStartPre=/usr/bin/rm -f /run/nginx.pid (code=exited, status=0/SUCCESS)

Dec 01 06:59:37 bogon systemd[1]: Starting The nginx HTTP and reverse proxy server...
Dec 01 06:59:37 bogon nginx[11509]: nginx: [emerg] invalid number of arguments in "location" directive in /etc/nginx/conf.d/nginx_qianduan.conf:7
Dec 01 06:59:37 bogon nginx[11509]: nginx: configuration file /etc/nginx/nginx.conf test failed
Dec 01 06:59:37 bogon systemd[1]: nginx.service: control process exited, code=exited status=1
Dec 01 06:59:37 bogon systemd[1]: Failed to start The nginx HTTP and reverse proxy server.
Dec 01 06:59:37 bogon systemd[1]: Unit nginx.service entered failed state.
Dec 01 06:59:37 bogon systemd[1]: nginx.service failed.
[root@bogon ~]# systemctl start nginx.service
Job for nginx.service failed because the control process exited with error code. See "systemctl status nginx.service" and "journalctl -xe" for details.

[root@bogon ~]# journalctl -xe
-- Defined-By: systemd
-- Support: http://lists.freedesktop.org/mailman/listinfo/systemd-devel
-- 
-- Unit nginx.service has begun starting up.
Dec 01 07:13:34 bogon nginx[11916]: nginx: [emerg] invalid number of arguments in "location" directive in /etc/nginx/conf.d/nginx_qianduan.conf:7
Dec 01 07:13:34 bogon nginx[11916]: nginx: configuration file /etc/nginx/nginx.conf test failed
Dec 01 07:13:34 bogon systemd[1]: nginx.service: control process exited, code=exited status=1
Dec 01 07:13:34 bogon systemd[1]: Failed to start The nginx HTTP and reverse proxy server.
-- Subject: Unit nginx.service has failed
-- Defined-By: systemd
-- Support: http://lists.freedesktop.org/mailman/listinfo/systemd-devel
-- 
-- Unit nginx.service has failed.
-- 
-- The result is failed.
Dec 01 07:13:34 bogon systemd[1]: Unit nginx.service entered failed state.
Dec 01 07:13:34 bogon systemd[1]: nginx.service failed.
Dec 01 07:13:34 bogon polkitd[727]: Unregistered Authentication Agent for unix-process:11909:1387215 (system bus name :1.63, object path /org/freedesktop/PolicyKit1/AuthenticationAgent, locale en_US.UTF-8) (di
Dec 01 07:13:53 bogon polkitd[727]: Registered Authentication Agent for unix-process:11921:1389137 (system bus name :1.64 [/usr/bin/pkttyagent --notify-fd 5 --fallback], object path /org/freedesktop/PolicyKit1
Dec 01 07:13:53 bogon systemd[1]: Starting The nginx HTTP and reverse proxy server...
-- Subject: Unit nginx.service has begun start-up
-- Defined-By: systemd
-- Support: http://lists.freedesktop.org/mailman/listinfo/systemd-devel
-- 
-- Unit nginx.service has begun starting up.
Dec 01 07:13:53 bogon nginx[11928]: nginx: [emerg] invalid number of arguments in "location" directive in /etc/nginx/conf.d/nginx_qianduan.conf:7
Dec 01 07:13:53 bogon nginx[11928]: nginx: configuration file /etc/nginx/nginx.conf test failed
Dec 01 07:13:53 bogon systemd[1]: nginx.service: control process exited, code=exited status=1
Dec 01 07:13:53 bogon systemd[1]: Failed to start The nginx HTTP and reverse proxy server.
-- Subject: Unit nginx.service has failed
-- Defined-By: systemd
-- Support: http://lists.freedesktop.org/mailman/listinfo/systemd-devel
-- 
-- Unit nginx.service has failed.
-- 
-- The result is failed.
Dec 01 07:13:53 bogon systemd[1]: Unit nginx.service entered failed state.
Dec 01 07:13:53 bogon systemd[1]: nginx.service failed.
Dec 01 07:13:53 bogon polkitd[727]: Unregistered Authentication Agent for unix-process:11921:1389137 (system bus name :1.64, object path /org/freedesktop/PolicyKit1/AuthenticationAgent, locale en_US.UTF-8) (di

# 根据日志报错提示，并经过反复排查后发现 是nginx_qianduan.conf第7行的"location"漏掉了路径，所以修改添加上并检测重启测试
[root@bogon ~]# vim /etc/nginx/conf.d/nginx_qianduan.conf
[root@bogon ~]# nginx -t
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
[root@bogon ~]# systemctl start nginx.service
[root@bogon ~]# systemctl stop firewalld
[root@bogon ~]# setenforce 0
[root@bogon ~]# cat /etc/nginx/conf.d/nginx_qianduan.conf
upstream qianduan {
  server 10.9.41.166:80;
}
server {
  listen 80;

  location / {
    proxy_pass http://qianduan;
  }

}

[root@bogon ~]# 

# 然后再回到控制节点上修改配置文件，并重新执行Playbook
[root@bogon qianduan]# vim nginx_qianduan.conf
[root@bogon qianduan]# cat nginx_qianduan.conf
upstream qianduan {
  server 10.9.41.166:80;
}
server {
  listen 80;

  location / {
    proxy_pass http://qianduan;
  }

}

[root@bogon qianduan]# ansible-playbook qianduan_project_deploy.yml

PLAY [updata config nginx qianduan] *****************************************************************************************************************************************************************************

TASK [Gathering Facts] ******************************************************************************************************************************************************************************************
ok: [192.168.230.143]

TASK [Copy Nginx config file] ***********************************************************************************************************************************************************************************
ok: [192.168.230.143]

PLAY RECAP ******************************************************************************************************************************************************************************************************
192.168.230.143            : ok=2    changed=0    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0   

[root@bogon qianduan]# curl 192.168.230.143
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="description" content="">
    <meta name="author" content="">
    <title>Hello, World! 11111</title>
</head>
<body>
Hello, World! 11111
</body>
</html>

```

