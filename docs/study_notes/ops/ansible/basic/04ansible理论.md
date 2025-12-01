# Ansible 初识四：理论

Ansible是一款基于Python开发的自动化运维工具，采用SSH协议与远程主机通信，无需在被管理端安装客户端或代理程序。其核心功能包括批量系统配置、程序部署、运行命令及多任务编排，支持通过模块化设计和Playbook实现复杂运维操作 。Ansible以部署简单、扩展性强著称，提供大量内置模块（如文件管理、服务控制等）并支持自定义开发。截至2023年，该工具已被[红帽公司](https://baike.baidu.com/item/红帽公司/10418953?fromModule=lemma_inlink)收购，成为自动化运维领域认可度较高的解决方案之一。



##### 一、基础入门（必备）

##### 1、核心概念：

  **控制节点（管理机）**：只能是 Linux/macOS（Windows 需用 WSL2），推荐 CentOS 7/8/9 或 Ubuntu。

  安装方式（CentOS 示例）：

```bash
yum install -y epel-release  # Ansible 依赖 EPEL 仓库
yum install -y ansible       # 安装 Ansible
ansible --version            # 验证安装（需显示版本号，如 2.9.x 或 2.14+）
```

**被控节点（目标机）**：支持 Linux/Windows（Windows 需额外配置 WinRM），核心要求：

- 控制节点能通过 SSH 免密登录被控节点（即之前学的 SSH 密钥登录，Ansible 核心依赖）。
- 被控节点需安装 Python（2.7 或 3.5+，CentOS 7 默认已装 Python 2.7）。**（其他发行版需要验证Python环境）**

**环境验证**：控制节点执行 `ansible all -m ping`，能返回 `pong` 说明通信正常。

需要截图：



##### 2、术语解析：

- **控制节点（Control Node）**：安装 Ansible 的机器，负责下发命令和执行剧本。
- **被控节点（Managed Nodes）**：被管理的服务器（如你之前的 innerServer、innerServernode2）。
- **Inventory（主机清单）**：记录所有被控节点的配置文件（默认 `/etc/ansible/hosts`），用于分组管理主机。
- **模块（Module）**：Ansible 执行具体任务的 “工具”（如 `ping` 测试连通性、`yum` 安装软件、`copy` 复制文件），是 Ansible 的核心功能单元。
- **剧本（Playbook）**：用 YAML 语法编写的任务集合，能按顺序执行多个模块，实现复杂自动化（如 “安装 Nginx→配置文件→启动服务”）。
- 角色（Role）：剧本的结构化拆分，用于复用和维护（如把 “Nginx 部署” 封装为一个 Role，可在多个项目中调用）。
- **变量（Variable）**：用于动态配置（如定义软件版本、文件路径，避免硬编码）。
- 事实（Facts）：Ansible 自动收集被控节点的系统信息（如 IP、系统版本、内存大小），可在剧本中直接使用。



##### 二、主要功能：Inventory + 模块 + Playbook（重点）

（Inventory + 模块 + Playbook）是 Ansible 最常用的核心功能，学会后能解决 80% 的日常运维场景（批量执行命令、安装软件、配置服务等）。

##### 1. Inventory 主机清单（分组 + 配置）

Inventory 是管理被控节点的入口，重点学习 “分组、变量、动态清单”：

**基础格式（静态清单）**：

```ini
# 单主机
192.168.247.163

# 分组：web 服务器组（包含 2 台主机）
[web_servers]
innerServer ansible_host=192.168.247.163 ansible_user=root  # 对应之前的 SSH 配置
innerServernode2 ansible_host=192.168.247.165 ansible_user=root

# 分组：数据库服务器组
[db_servers]
192.168.247.166 ansible_user=root ansible_port=2222  # 自定义 SSH 端口

# 嵌套分组（父组包含子组）
[all_servers:children]
web_servers
db_servers
```

- **参数**：
  - `ansible_host`：被控节点 IP（若 Host 名称不是 IP，需指定）。
  - `ansible_user`：登录用户名（如 root）。
  - `ansible_port`：SSH 端口（默认 22）。
  - `ansible_ssh_private_key_file`：SSH 私钥路径（免密登录用）（不常用）。

**1 .1、分组变量（批量配置）（了解）**：

给整个组设置统一变量（避免重复配置），在 Inventory 中添加：

```ini
[web_servers:vars]
ansible_ssh_private_key_file=~/.ssh/id_rsa  # web 组所有主机共用私钥
nginx_version=1.20.1                        # 自定义变量（后续剧本用）
```

**1.2、动态清单（可选）**：当主机数量多（如百台以上），用脚本 / API 生成清单（如从云厂商接口拉取主机列表），核心是输出自定义格式的主机信息。



##### 2. 模块（Module）：执行具体任务

核心模块：

| 模块名        | 功能描述                                   | 示例命令（控制节点执行）                                     |      |
| ------------- | ------------------------------------------ | ------------------------------------------------------------ | ---- |
| **`ping`**    | **测试被控节点连通性**                     | **`ansible web_servers -m ping`（批量测试 web 组主机）**     |      |
| **`command`** | **执行 Linux 命令（无 Shell 解析）**       | **`ansible db_servers -m command -a "df -h"`（查看 db 组主机磁盘使用率）** |      |
| **`shell`**   | **执行 Linux 命令（支持管道、变量）**      | **`ansible web_servers -m shell -a "ps -ef"**                |      |
| `yum`         | **安装 / 卸载 RPM 包（CentOS）**           | `ansible web_servers -m yum -a "name=nginx state=present"`（批量安装 Nginx） |      |
| `apt`         | 安装 / 卸载 DEB 包（Ubuntu）               | `ansible web_servers -m apt -a "name=nginx state=present"`   |      |
| **`copy`**    | **本地文件复制到被控节点**                 | **`ansible web_servers -m copy -a "src=/local/nginx.conf dest=/etc/nginx/nginx.conf mode=644"`** |      |
| `template`    | 复制带变量的模板文件                       | `ansible web_servers -m template -a "src=/local/nginx.conf.j2 dest=/etc/nginx/nginx.conf"` |      |
| **`service`** | **管理系统服务（启动 / 停止 / 开机自启）** | **`ansible web_servers -m service -a "name=nginx state=started enabled=yes"`（启动 Nginx 并设开机自启）** |      |
| `file`        | 管理文件 / 目录（创建 / 删除 / 权限）      | `ansible web_servers -m file -a "path=/data/logs state=directory mode=755"`（创建日志目录） |      |
| `user`        | 管理系统用户                               | `ansible all_servers -m user -a "name=ops state=present shell=/bin/bash"`（创建 ops 用户） |      |

##### 例外（管道的应用）：

ansible wlan_nginx -m command -a "**bash -c** 'netstat -anlp |grep :80'"

ansible wlan_nginx -m shell -a "netstat -anlp |grep :80"



##### 3. Playbook：自动化剧本（核心中的核心）

Playbook 是 Ansible 自动化的核心，用 YAML 语法编写，能按顺序执行多个任务，实现 “一键部署”（如部署 Nginx、MySQL 等）。

**YAML 语法基础（必须掌握）**：

- 缩进：用 2 个空格（不能用 tab），缩进代表层级关系。
- 键值对：`key: value`（冒号后必须加空格）。
- 列表：用 `-` 开头（如 `- task1`、`- task2`）。
- 注释：`# 注释内容`。

**Playbook 基本结构**：

一个 Playbook 包含多个 `play`，每个 `play` 对应一组主机和一系列任务。示例（部署 Nginx 的 playbook：`deploy_nginx.yml`）：

```yaml
---
# 第一个 play：给 web_servers 组部署 Nginx
- name: Deploy Nginx to web servers  # play 名称（自定义，便于查看日志）
  hosts: web_servers                 # 目标主机组（对应 Inventory 中的分组）
  remote_user: root                  # 登录用户
  vars:                              # 自定义变量（也可在 Inventory 中定义）
    nginx_conf_path: /etc/nginx/nginx.conf
    nginx_log_path: /var/log/nginx

  tasks:                             # 任务列表（按顺序执行）
    # 任务1：安装 Nginx
    - name: Install Nginx package
      yum:
        name: nginx
        state: present  # present=安装，absent=卸载

    # 任务2：复制 Nginx 配置文件（用 template 支持变量）
    - name: Copy Nginx config file
      template:
        src: ./templates/nginx.conf      # 本地模板文件（带变量）
        dest: "{{ nginx_conf_path }}"    # 引用变量（双大括号包裹）
        mode: 644                        # 文件权限

    # 任务3：创建 Nginx 日志目录
    - name: Create Nginx log directory
      file:
        path: "{{ nginx_log_path }}"
        state: directory
        mode: 755

    # 任务4：启动 Nginx 并设开机自启
    - name: Start and enable Nginx service
      service:
        name: nginx
        state: started
        enabled: yes
```

**Playbook 执行与调试**：

```bash
# 执行 playbook（核心命令）
ansible-playbook deploy_nginx.yml

# 加 -v 查看详细输出（调试用），-vvv 更详细（显示模块执行过程）
ansible-playbook deploy_nginx.yml -v

# 检查语法错误（执行前必做）
ansible-playbook deploy_nginx.yml --syntax-check

# 模拟执行（不实际修改被控节点，验证任务是否正确）
ansible-playbook deploy_nginx.yml --check
```

**变量与模板（提升 Playbook 灵活性）**：

```
- 变量来源：Inventory 分组变量、Playbook 内 `vars` 定义、 Facts 自动收集、命令行传参（`-e "nginx_version=1.21.0"`）。
- Jinja2 模板：在文件中嵌入变量和逻辑（如 `nginx.conf.j2` 中用 `{{ ansible_default_ipv4.address }}` 引用被控节点的 IP），配合 `template` 模块使用。
```

##### 实战：



**需求：**

1、研发上线了一个新接口(api02.rex.com)对应一组内网java项目（ipA、ipB）。

2、使用ansible批量设置外网nginx，并且使新配置生效。

**准备环境：**（自行准备，简化拓扑）

0、准备api02两台项目机器：

​	1） yum install java-1.8.0-openjdk* -y       #安装环境

​         2）java -jar 包名.jar

1、部署yum源、安装ansible使用ssh远程部署。

**任务一：（无需剧本，使用ansible分组即可，因为不经常安装）**

1、安装nginx（4台），模拟外网nginx。

2、启动nginx，看到欢迎界面即可。

**任务二：（asible剧本实现）**

1、批量设置4台外网nginx，使得4台nginx可以访问新项目api02.rex.com

##### 剧本提示:

```
---
- name: updata config nginx
  hosts: wlan_nginx
  remote_user: root
  vars:
    nginx_confd_path: /etc/nginx/conf.d
    local_nginx_confd_path: ./nginx_confd

  tasks:
    - name: Copy Nginx config file
      template:
        src: "{{ local_nginx_confd_path }}/web01.conf"
        dest: "{{ nginx_confd_path }}/web01.conf"
        mode: 644
      notify: reload nginx

  handlers:
   - name: reload nginx
     service:
       name: nginx
       state: reloaded
```

**服务操作：**

```
- name: Start a service
  service:
    name: nginx
    state: started

- name: Stop a service
  service:
    name: nginx
    state: stopped

- name: Restart a service
  service:
    name: nginx
    state: restarted

- name: Reload a service (不中断)
  service:
    name: nginx
    state: reloaded
```



**变量的使用：**

常用变量：

```
- name: 显示系统信息
  hosts: all
  tasks:
    - debug:
        msg: |
          主机名: {{ ansible_hostname }}
          操作系统: {{ ansible_os_family }}
          系统版本: {{ ansible_distribution }} {{ ansible_distribution_version }}
          架构: {{ ansible_architecture }}
          内核版本: {{ ansible_kernel }}
```

```
    - name: Display network information
      debug:
        msg: |
          默认IP: {{ ansible_default_ipv4.address | default('未知') }}
          所有IPv4: {{ ansible_all_ipv4_addresses | default([]) | join(', ') }}
          MAC地址: {{ ansible_default_ipv4.macaddress | default('未知') }}
          FQDN: {{ ansible_fqdn | default('未知') }}
          默认接口: {{ ansible_default_ipv4.interface | default('未知') }}
          IP地址: {{ ansible_default_ipv4.address | default('未知') }}
          网络掩码: {{ ansible_default_ipv4.netmask | default('未知') }}
          网关: {{ ansible_default_ipv4.gateway | default('未知') }}
          广播地址: {{ ansible_default_ipv4.broadcast | default('未知') }}
          CIDR表示法: {{ ansible_default_ipv4.network | default('未知') }}/{{ ansible_default_ipv4.netmask | replace('255.255.255.0', '24') | replace('255.255.0.0', '16') | replace('255.0.0.0', '8') | default('24') }}
```

```
- debug:
    msg: |
      内存总量: {{ ansible_memtotal_mb }} MB
      内存可用: {{ ansible_memfree_mb }} MB
      CPU核心数: {{ ansible_processor_cores }}
      CPU型号: {{ ansible_processor[1] }}
      挂载点: {{ ansible_mounts }}
```

```
- debug:
    msg: |
      当前主机: {{ inventory_hostname }}
      主机组: {{ group_names }}
      所有主机: {{ ansible_play_hosts }}
      当前用户: {{ ansible_user_id }}
      Play名称: {{ ansible_play_name }}
```

引用结果：

```
- name: Get current date
  shell: date +%Y-%m-%d
  register: current_date

- name: Use registered variable
  debug:
    msg: "今天是 {{ current_date.stdout }}"
```



```
- name: Example with multiple attributes
  command: "ls -l /etc/nginx/nginx.conf"
  register: file_info

- name: Use different attributes
  debug:
    msg: |
      标准输出: {{ file_info.stdout }}
      错误输出: {{ file_info.stderr }}
      返回码: {{ file_info.rc }}
      是否改变: {{ file_info.changed }}
      行输出: {{ file_info.stdout_lines }}
```

**文件操作：**

**方法1：**

```
- name: Get system info for file
  shell: |
    echo "System Report"
    echo "=============="
    echo "Hostname: $(hostname)"
    echo "IP: $(hostname -I)"
    echo "Date: $(date)"
    echo "Uptime: $(uptime)"
  register: system_info

- name: Write system info to file
  copy:
    content: "{{ system_info.stdout }}"
    dest: /tmp/system-report.txt
```

**方法2：**

```
    - name: Create JSON configuration file
      vars:
        db_host: "db_host123"
        db_port: "db_port123"
        db_name: "db_name123"
        app_port: "app_port123"
        debug_mode: "debug_mode123"
      copy:
        content: |
          {
            "database": {
              "host": "{{ db_host | default('localhost') }}",
              "port": {{ db_port | default(5432) }},
              "name": "{{ db_name | default('myapp') }}"
            },
            "server": {
              "port": {{ app_port | default(3000) }},
              "debug": {{ debug_mode | default(false) | lower }}
            }
          }
        dest: /opt/config.json
        owner: root
        group: root
        mode: 0600

```



##### 实验室环境-需求：

1、制作虚拟机模版，动态获取网卡IP（DHCP）；

2、将动态IP、网关、DNS固化成静态IP防止改变；

3、自行实验，有问题问rex哟；

**剧本提示：**

##### 方法1：直接调用变量：

```
---
- name: Configure network interface  # 修正play名称
  hosts: wlan_nginx
  remote_user: root
  gather_facts: yes  # 必须开启才能获取网络变量

  tasks:
    # 任务：配置网络接口
    - name: Configure network interface file
      copy:
        content: |
          TYPE=Ethernet
          BOOTPROTO=static
          NAME={{ ansible_default_ipv4.interface }}
          DEVICE={{ ansible_default_ipv4.interface }}
          ONBOOT=yes
          IPADDR={{ ansible_default_ipv4.address }}
          NETMASK={{ ansible_default_ipv4.netmask }}
          GATEWAY={{ ansible_default_ipv4.gateway }}
          DNS1=114.114.114.114
        dest: /etc/sysconfig/network-scripts/ifcfg-{{ ansible_default_ipv4.interface }}
        owner: root
        group: root
        mode: 0644
      when: ansible_os_family == "RedHat"  # 仅适用于RedHat系系统
      notify: reload nginx
  handlers:
   - name: reload network
     service:
       name: network
       state: reloaded
```

**注册变量：**

```
---
- name: Get command output as variable
  hosts: all
  tasks:
    - name: Execute command and register output
      command: hostname -I
      register: ip_output  # 注册命令输出到变量

    - name: Display registered variable
      debug:
        msg: "IP地址: {{ ip_output.stdout }}"

```

**方法2：**

```
---
- name: Configure network interface  # 修正play名称
  hosts: wlan_nginx
  remote_user: root
  gather_facts: yes  # 必须开启才能获取网络变量

  tasks:
    # 任务：配置网络接口
    - name: Execute command and register output
      shell: ifconfig ens33 | grep 'inet ' | awk '{print $2}'
      register: ip_output  # 注册命令输出到变量
    - name: Configure network interface file
      copy:
        content: |
          TYPE=Ethernet
          BOOTPROTO=static
          NAME={{ ansible_default_ipv4.interface }}
          DEVICE={{ ansible_default_ipv4.interface }}
          ONBOOT=yes
          IPADDR={{ ip_output.stdout }}
          NETMASK={{ ansible_default_ipv4.netmask }}
          GATEWAY={{ ansible_default_ipv4.gateway }}
          DNS1=114.114.114.114
        dest: /etc/sysconfig/network-scripts/ifcfg-{{ ansible_default_ipv4.interface }}
        owner: root
        group: root
        mode: 0644
      when: ansible_os_family == "RedHat"  # 仅适用于RedHat系系统
      notify: reload network
  handlers:
   - name: reload network
     service:
       name: network
       state: restarted
```



```
- name: 显示系统信息
  hosts: nginxserver
  tasks:
    - name: IPADRR
      shell: ip a s ens33|grep 'inet '|awk -F"[ ]*|/" '{print $3}'
      register: ipaddr
    - name: Use different attributes
      debug:
        msg: |
          标准输出: {{ ipaddr.stdout }}
    - name: 写入系统信息到文件
      copy:
        content: |
          IPADDR={{ ipaddr.stdout }}
          GATEWAY={{ ipaddr.stdout }}
        dest: /opt/ip.config

```

