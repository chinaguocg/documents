# Jumpserver堡垒机

官方安装参考文档：https://docs.jumpserver.org/zh/v3/quick_start/

环境介绍：

| 主机名称    | IP             | 角色                   |
| ----------- | -------------- | ---------------------- |
| jumpserver  | 192.168.91.133 | 堡垒机管理节点V3.10.18 |
| k8s-master1 | 192.168.91.134 | 被管理节点             |
| k8s-node1   | 192.168.91.135 | 被管理节点             |
| gitlab      | 192.168.91.137 | 被管理节点             |

## 1.安装部署

操作系统：CentOS Stream release 9

```plain
[root@jumpserver ~]# setenforce 0
[root@jumpserver ~]# systemctl disable firewalld
[root@jumpserver ~]# systemctl stop firewalld
[root@jumpserver ~]# curl -sSL https://resource.fit2cloud.com/jumpserver/jumpserver/releases/download/v3.10.18/quick_start.sh | bash
```

![](/documents/img/ops/linux/basic/jumpserver/1752061234309-f6b52084-f6f6-4b6e-92ff-36ca7c083600.png)

![](/documents/img/ops/linux/basic/jumpserver/1752059375091-d8b02b32-8f73-44fa-9cf9-cb334b9475e4.png)

![](/documents/img/ops/linux/basic/jumpserver/1752061343662-fb36ceab-455c-4e0f-86f8-502e3d5ebe3c.png)

![](/documents/img/ops/linux/basic/jumpserver/1698986305154-3f2344cc-8b28-48b9-a339-1da76f4d18b1.png)

```plain
>>> 安装完成了
1. 可以使用如下命令启动, 然后访问
cd /opt/jumpserver-installer-v3.10.18
./jmsctl.sh start

2. 其它一些管理命令
./jmsctl.sh stop
./jmsctl.sh restart
./jmsctl.sh backup
./jmsctl.sh upgrade
[root@jumpserver ~]# jmsctl --help  #查看帮助命令使用文档
[root@jumpserver ~]#  vim /opt/jumpserver/config/config.txt
```

![](/documents/img/ops/linux/basic/jumpserver/1698986453385-5e059080-d768-4104-a5e1-443c7a03a59a.png)


- 关于80端口被占用

![](/documents/img/ops/linux/basic/jumpserver/01.png)
![](/documents/img/ops/linux/basic/jumpserver/02.png)
![](/documents/img/ops/linux/basic/jumpserver/03.png)
![](/documents/img/ops/linux/basic/jumpserver/04.png)
![](/documents/img/ops/linux/basic/jumpserver/05.png)


```plain
[root@jumpserver ~]# jmsctl start  #启动
[root@jumpserver ~]# jmsctl restart #重启
[root@jumpserver ~]# jmsctl stop   #关闭
```

![](/documents/img/ops/linux/basic/jumpserver/1752061685738-03427902-dd9e-446e-bc8c-4250422319b5.png)

## 2.访问登录

访问，如果出现浏览器不友好提示，请换浏览器；

默认用户名：admin

默认密码：admin

![](/documents/img/ops/linux/basic/jumpserver/1698991826903-896e1da7-162e-4e1c-9590-d69445ddf064.png)

第一次登录，需要修改密码

![](/documents/img/ops/linux/basic/jumpserver/1698991950863-d497dbdc-0756-4eb1-beae-4dd551e4a0ab.png)

### 关于用户、账户、资产

![](/documents/img/ops/linux/basic/jumpserver/06.png)
![](/documents/img/ops/linux/basic/jumpserver/07.png)

## 3.用户管理

用户组

![](/documents/img/ops/linux/basic/jumpserver/1698992305990-0e84066d-1ed5-40c5-8d5f-93b147184eac.png)

![](/documents/img/ops/linux/basic/jumpserver/1698992334118-07aec0c2-e68e-448c-a84e-5369b6ae7113.png)

![](/documents/img/ops/linux/basic/jumpserver/1698992447275-fc733052-e075-41e9-bfb3-9e0d8b815cc0.png)

用户

![](/documents/img/ops/linux/basic/jumpserver/1698992627477-c6bb0b01-766e-45d8-8bd8-c1a84b74d002.png)

![](/documents/img/ops/linux/basic/jumpserver/1698992654171-d4a2534b-1555-43cf-b9b8-837be673cc13.png)

![](/documents/img/ops/linux/basic/jumpserver/1698997107635-d855a699-395f-419e-8ecb-47990269d506.png)

![](/documents/img/ops/linux/basic/jumpserver/1698997162476-8d9112cb-ccee-4a56-a15f-8d5fe1ad0090.png)

## 4.创建资产

![](/documents/img/ops/linux/basic/jumpserver/1698992701290-17a791a0-854a-484f-9341-ffc5c30f67f2.png)

![](/documents/img/ops/linux/basic/jumpserver/1698997067086-706ae1fa-48bc-4f66-8dd0-8ce5c255c3d5.png)

## 5.创建主机

先创建公私钥，将公钥发送给被管理的节点(再开3台机器；假设一台是k8s-master，一台是k8s-node1，一台是gitlab)

```plain
[root@jumpserver ~]# ssh-keygen
[root@jumpserver ~]# ssh-copy-id  192.168.91.134  #发送到k8s-master
[root@jumpserver ~]# ssh-copy-id  192.168.91.135  #发送到k8s-node1
[root@jumpserver ~]# ssh-copy-id  192.168.91.137  #发送到gitlab
[root@jumpserver ~]# sz /root/.ssh/id_rsa #先将私钥存到自己电脑一下
```

![](/documents/img/ops/linux/basic/jumpserver/1698992859183-23030c90-84b4-4c25-9c8d-b4c4da83e778.png)

![](/documents/img/ops/linux/basic/jumpserver/1752062443158-a76dff9a-df27-4afb-a1cf-6ea1e7639503.png)

![](/documents/img/ops/linux/basic/jumpserver/1698993335452-7dc7882e-d95a-459f-a578-a7d0d6d7271c.png)

![](/documents/img/ops/linux/basic/jumpserver/1698993359361-b0e69d10-458e-436a-ac14-7080ada45fd5.png)

![](/documents/img/ops/linux/basic/jumpserver/1752062637129-675b874c-9163-42f8-8667-c1e530c88094.png)





```plain
[root@jumpserver ~]# cat /root/.ssh/id_rsa
```

![](/documents/img/ops/linux/basic/jumpserver/1698996656883-5b984bbf-56d2-4f77-a4d0-38cb8058acf9.png)

![](/documents/img/ops/linux/basic/jumpserver/1698997243340-56a2148d-405f-48b5-b43f-45ec20ff4cbd.png)

![](/documents/img/ops/linux/basic/jumpserver/1698996817002-904bb141-6e31-4f92-8b44-7979a7e7548d.png)

![](/documents/img/ops/linux/basic/jumpserver/1752062792788-a580c7c8-8d0b-4470-9c23-88884f627dc7.png)

![](/documents/img/ops/linux/basic/jumpserver/1752062806230-739a7323-1f80-49fc-831e-3a6bb2b9cc90.png)

![](/documents/img/ops/linux/basic/jumpserver/1752062846295-0bb9ba99-0aa6-4aa0-a9ee-8d4ee364c11e.png)

## 6.资产授权

授权开发组（开发-tom）只能连接gitlab节点（gitlab），运维组（运维-youngfit）只能连接k8s节点（k8s-master、k8s-node1）

### 6.1账号推送（暂时用不到）

![](/documents/img/ops/linux/basic/jumpserver/1698997445102-8afa6aff-c271-4517-819a-e6f41b3decf8.png)

![](/documents/img/ops/linux/basic/jumpserver/1698997757210-af619bbc-491c-4b6b-9b84-658ac646e710.png)

![](/documents/img/ops/linux/basic/jumpserver/1752062925683-208917cb-b89d-4975-8097-657dd09ab43c.png)

![](/documents/img/ops/linux/basic/jumpserver/1698997666153-014e9abf-2845-48d3-90f3-dd260d9d55d6.png)

![](/documents/img/ops/linux/basic/jumpserver/1698997719204-f6a9f20d-5b6b-4da5-814a-bf45433e7c2a.png)

![img](https://cdn.nlark.com/yuque/0/2023/png/23214851/1698997729404-8a6f88cc-ca9f-4ba3-90a3-de273266e0cd.png?x-oss-process=image%2Fwatermark%2Ctype_d3F5LW1pY3JvaGVp%2Csize_44%2Ctext_TGludXjpo55GZWnlk6U%3D%2Ccolor_FFFFFF%2Cshadow_50%2Ct_80%2Cg_se%2Cx_10%2Cy_10)

![](/documents/img/ops/linux/basic/jumpserver/1698997795485-c1e5cd9a-d6d8-420e-b7f3-ac41b6753fdf.png)

![](/documents/img/ops/linux/basic/jumpserver/1698997782146-d8240fa2-83b2-4170-9f6b-5204707e0af9.png)

![](/documents/img/ops/linux/basic/jumpserver/1752063081476-673c6492-ed7c-432d-9640-10dd0e6e9b8e.png)

![](/documents/img/ops/linux/basic/jumpserver/1698997872743-5b48c8c4-bc25-4302-9891-ef682082eea7.png)

![](/documents/img/ops/linux/basic/jumpserver/1698997895421-eb890631-22c5-4143-adb4-47c73a521980.png)

![](/documents/img/ops/linux/basic/jumpserver/1698998325018-af19d8f3-c2d2-4824-98d4-89625b2f0e81.png)

### 6.2授权资产

![](/documents/img/ops/linux/basic/jumpserver/1698998430176-98dddebe-f2fe-4817-9896-f86150ce93e4.png)

![](/documents/img/ops/linux/basic/jumpserver/1752063298567-6e4a8b80-1153-46ce-abfb-579250b5e3f9.png)

![](/documents/img/ops/linux/basic/jumpserver/1752063318085-58a0d1b7-1236-4939-bf34-95850f5e6332.png)

![](/documents/img/ops/linux/basic/jumpserver/1698998674837-31749b07-b543-4413-9288-6abee5575808.png)

![](/documents/img/ops/linux/basic/jumpserver/1698998695386-41cb15c0-2314-4389-b6e4-34d2d2e240c4.png)

## 7.验证测试连接(Web)

![](/documents/img/ops/linux/basic/jumpserver/1698998780111-b92382cb-523b-4a30-aa08-d38b1a7dc148.png)

![](/documents/img/ops/linux/basic/jumpserver/1752063448549-1a8df674-0f67-4864-9969-ee75266e3a39.png)

![](/documents/img/ops/linux/basic/jumpserver/1698998848504-3650536a-5cdd-4290-b9b9-905914a8a9a9.png)

![](/documents/img/ops/linux/basic/jumpserver/1698999045970-2130fffe-d9d9-41d1-9fa8-06899ca3776c.png)

![](/documents/img/ops/linux/basic/jumpserver/1698999031832-70638174-52e2-49d9-8751-3e39e89d0d57.png)

![](/documents/img/ops/linux/basic/jumpserver/1698999061715-6ab8647b-fcae-4291-bdfd-5dc3fb7b96bd.png)



![](/documents/img/ops/linux/basic/jumpserver/1698999083184-51423b78-3e3e-40f2-ba67-5a1ea438da22.png)

![](/documents/img/ops/linux/basic/jumpserver/1698999242888-c160c83e-da6e-4c6d-868f-20bb7e677b39.png)![](/documents/img/ops/linux/basic/jumpserver/1698999251956-f7d5f2c2-5d9d-470c-b5a0-bcbb3314df3d.png)

![](/documents/img/ops/linux/basic/jumpserver/1699000124141-50b077f2-b3f8-4274-96b3-a9deaf39e53c.png)



## 8.验证测试连接(Xshell)

先将资产给admin授权一下，先账号推送 

![](/documents/img/ops/linux/basic/jumpserver/1699000482219-d7383d29-a747-4845-82b4-5e0438c741b0.png)![](/documents/img/ops/linux/basic/jumpserver/1699000546758-41a60ad5-00f1-4907-bdc3-59a4b920df16.png)![](/documents/img/ops/linux/basic/jumpserver/1699000573353-4f2d5d34-4eff-4f1f-9ad1-0380e4efe4b1.png)![](/documents/img/ops/linux/basic/jumpserver/1699000726793-82913232-f867-4850-94b2-41bcfc183ca7.png)

验证一下test3用户是否推送成功

![img](https://cdn.nlark.com/yuque/0/2023/png/23214851/1699000817357-c416892e-2945-4c6d-898f-077cd111afc9.png?x-oss-process=image%2Fwatermark%2Ctype_d3F5LW1pY3JvaGVp%2Csize_21%2Ctext_TGludXjpo55GZWnlk6U%3D%2Ccolor_FFFFFF%2Cshadow_50%2Ct_80%2Cg_se%2Cx_10%2Cy_10)![](/documents/img/ops/linux/basic/jumpserver/1699000825363-c7e9b89a-94df-4cc0-8ad8-c4425b0ea6f8.png)![img](https://cdn.nlark.com/yuque/0/2023/png/23214851/1699000833945-ed6c41cc-0b82-4cfa-bdf9-1a730bbc2bec.png?x-oss-process=image%2Fwatermark%2Ctype_d3F5LW1pY3JvaGVp%2Csize_24%2Ctext_TGludXjpo55GZWnlk6U%3D%2Ccolor_FFFFFF%2Cshadow_50%2Ct_80%2Cg_se%2Cx_10%2Cy_10)

创建资产授权规则

![](/documents/img/ops/linux/basic/jumpserver/1699000903487-bec98104-b4b0-4cc6-b810-f1be4519f96e.png)![](/documents/img/ops/linux/basic/jumpserver/1699000940738-694bec10-57ca-4c5e-a9d8-a713a67bfb36.png)![](/documents/img/ops/linux/basic/jumpserver/1699000955721-c86c5c9b-0ef4-485c-a38b-a252c2ae9bc9.png)

用任意一台机器尝试

```plain
[root@k8s-node1 ~]# ssh admin@10.8.166.233 -p 2222
```

![](/documents/img/ops/linux/basic/jumpserver/1699001008490-2300ecf4-5e2a-458f-8fa3-9b9db0405552.png)![](/documents/img/ops/linux/basic/jumpserver/1699001017036-916a377b-955d-4a13-a2ce-4a815b3c827e.png)![img](https://cdn.nlark.com/yuque/0/2023/png/23214851/1699001052827-c3655b33-b109-4ee3-9888-c05ce2e2122e.png?x-oss-process=image%2Fwatermark%2Ctype_d3F5LW1pY3JvaGVp%2Csize_48%2Ctext_TGludXjpo55GZWnlk6U%3D%2Ccolor_FFFFFF%2Cshadow_50%2Ct_80%2Cg_se%2Cx_10%2Cy_10)

## 9.开启sudo提权

在不授权的情况下

```plain
[test3@k8s-master ~]$ cd /
[test3@k8s-master /]$ touch a.txt
touch: cannot touch ‘a.txt’: Permission denied
```

![](/documents/img/ops/linux/basic/jumpserver/1699001448049-3c468d2e-2407-4396-bb94-d3d8fc3e25eb.png)



![](/documents/img/ops/linux/basic/jumpserver/1699001869849-74f6ba67-017f-4423-b300-27c251f8f01d.png)

![](/documents/img/ops/linux/basic/jumpserver/1699001837357-f09a904a-77ab-4dd3-a389-d76996fa6c45.png)![](/documents/img/ops/linux/basic/jumpserver/1699001923599-ace6222e-949f-47b2-a183-5b064146258c.png)

![](/documents/img/ops/linux/basic/jumpserver/1699001959723-41e7270f-07b3-42e5-922c-99e5c472affb.png)

![](/documents/img/ops/linux/basic/jumpserver/1752064573770-31510c3c-ad5c-4867-87c9-0836501d2d33.png)

## 10.命令过滤

![](/documents/img/ops/linux/basic/jumpserver/1699163726176-f0fb55a4-1afe-44af-a257-9746feb03062.png)

![](/documents/img/ops/linux/basic/jumpserver/1699163756646-0bdd7b0f-f512-40b5-868c-5c7dfb209fcc.png)![](/documents/img/ops/linux/basic/jumpserver/1699163798695-ef308a95-adb9-4718-a79b-e8edd5aa27a4.png)![](/documents/img/ops/linux/basic/jumpserver/1699163823821-89cf8cbd-bbd0-4375-9313-f0203c4f2f4e.png)![](/documents/img/ops/linux/basic/jumpserver/1699164072185-a9a42e39-8cd7-405b-a0db-a0fdcbeb3772.png)![](/documents/img/ops/linux/basic/jumpserver/1699164084497-c3a5c625-5af5-4a4b-a2af-8af627d2a062.png)

切换到youngfit用户，用test2用户连接资产

![](/documents/img/ops/linux/basic/jumpserver/1699164142053-d997c72a-2043-43e8-902c-4e9223887078.png)

## 11.审计台

右列有回放

![](/documents/img/ops/linux/basic/jumpserver/1699164331229-281e1148-8475-4161-aada-255c550a386f.png)