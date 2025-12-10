## Shell 配置文件执行顺序

在 **CentOS Linux**（以 **Bash** 作为默认Shell为例），Shell配置文件的执行顺序取决于 **Shell的启动方式**（登录Shell or 非登录Shell、交互式 or 非交互式）。

---

## **1. 登录Shell（Login Shell）**
**触发场景**：

- 通过 **SSH 登录**
- 使用 `su - username`（带 `-` 参数）
- 在 **tty1~tty6** 终端直接登录

**配置文件加载顺序**：

1. **`/etc/profile`**  
   → 系统全局配置，设置环境变量（如 `PATH`、`USER`、`MAIL` 等）。

   **`/etc/profile.d/*.sh`**  
   → 加载 `/etc/profile.d/` 目录下的所有 `.sh` 脚本（按字母顺序）。

2. **用户级配置文件（按优先级只加载一个）**：

   - `~/.bash_profile`（优先）
   - `~/.bash_login`（如果 `.bash_profile` 不存在）
   - `~/.profile`（如果前两者都不存在）

3. **`~/.bashrc`** 

4. **/etc/bashrc**

5. **退出时（Logout）**：

   - `~/.bash_logout`（如果存在）

---

## **2. 非登录Shell（Non-Login Shell）**
**触发场景**：
- 在终端直接运行 `bash` 命令
- 图形界面（如 GNOME Terminal）打开的终端
- 使用 `su username`（不带 `-` 参数）

**配置文件加载顺序**：

1. **`~/.bashrc`**  
   → 用户级配置（别名、函数、自定义提示符等）。
2. **`/etc/bashrc`**（部分系统可能是 `/etc/bash.bashrc`）  
   → 系统级 Bash 配置（通常由 `~/.bashrc` 显式加载）。

## **3. 总结（CentOS + Bash）**
| **Shell类型**   | **加载顺序**                                                 |
| --------------- | ------------------------------------------------------------ |
| **登录Shell**   | `/etc/profile` → `~/.bash_profile`→ `~/.bashrc` → `/etc/bashrc` |
| **非登录Shell** | `~/.bashrc` → `/etc/bashrc`                                  |

```bash
[root@web1 ~]# su - tom
Last login: Mon Aug 11 11:08:48 CST 2025 on pts/0
[tom@web1 ~]$ echo $0
-bash													# 登录shell
[tom@web1 ~]$ 
[tom@web1 ~]$ exit
logout
[root@web1 ~]# su tom
[tom@web1 root]$ pwd
/root
[tom@web1 root]$ echo $PWD
/root
[tom@web1 root]$ echo $0
bash													# 非登录shell
```

```bash
run /etc/profile.
run alice .bash_profile.
run alice .bashrc
run /etc/bashrc.

su - alice
run /etc/profile.
run alice .bash_profile.
run alice .bashrc
run /etc/bashrc.

su alice
run alice .bashrc
run /etc/bashrc.
```

