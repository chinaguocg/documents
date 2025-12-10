# 实现Ubuntu类似的motd

在 **CentOS Linux** 中，**MOTD（Message Of The Day）** 是用户登录后显示的欢迎信息。默认情况下，CentOS 的 MOTD 是静态文本，但可以通过 **自定义脚本** 实现动态内容（如系统状态、登录统计等）。以下是几种实现方式：

---

## **1. 传统的 `/etc/motd`（静态内容）**
默认情况下，CentOS 的 MOTD 内容存储在 `/etc/motd`，但它是**静态文本**，不支持脚本。

**修改方法**：

```bash
sudo vim /etc/motd
```
写入任意欢迎信息，例如：
```
Welcome to CentOS Server!
```
但这种方式**无法动态更新**。

---

## **2. 使用 `/etc/system-info.sh`（动态 MOTD）**

### **（1）创建动态 MOTD 脚本**

```bash
[root@tianyun ~]# vim /etc/system-info.sh
#!/bin/bash
echo "===== System Info ====="
echo "Hostname: $(hostname)"
echo "Uptime: $(uptime -p)"
echo "Load: $(uptime | awk -F'load average: ' '{print $2}')"
echo "Memory: $(free -h | awk '/Mem/{print $3 " / " $2}')"
echo "Disk: $(df -h / | awk 'NR==2{print $3 " / " $2}')"
```

赋予执行权限：

```bash
sudo chmod +x /etc/system-info.sh
```

### **（2）设置 MOTD 自动更新**

编辑 `/etc/profile`，在末尾添加：

```bash
sudo vim /etc/profile
```

```bash
/etc/system-info.sh
```

## **3. 使用 `/etc/update-motd.d/`（动态 MOTD）**

**Ubuntu/Debian** 提供了 `/etc/update-motd.d/` 目录，允许通过脚本动态生成 MOTD。虽然 CentOS **默认没有这个机制**，但可以手动实现类似功能。

### **（1）创建动态 MOTD 脚本**
```bash
sudo mkdir -p /etc/update-motd.d/
sudo chmod 755 /etc/update-motd.d/
```

### **（2）编写 MOTD 脚本示例**
例如，创建一个显示系统信息的脚本：
```bash
sudo vim /etc/update-motd.d/10-system-info
```
写入以下内容：
```bash
#!/bin/bash
echo "===== System Info ====="
echo "Hostname: $(hostname)"
echo "Uptime: $(uptime -p)"
echo "Load: $(uptime | awk -F'load average: ' '{print $2}')"
echo "Memory: $(free -h | awk '/Mem/{print $3 " / " $2}')"
echo "Disk: $(df -h / | awk 'NR==2{print $3 " / " $2}')"
```
赋予执行权限：
```bash
sudo chmod +x /etc/update-motd.d/10-system-info
```

### **（3）设置 MOTD 自动更新**
编辑 `/etc/profile`，在末尾添加：
```bash
sudo vim /etc/profile
```
加入：
```bash
if [ -d /etc/update-motd.d/ ]; then
    for script in /etc/update-motd.d/*; do
        [ -x "$script" ] && "$script"
    done
fi
```
这样，用户登录时会自动执行 `/etc/update-motd.d/` 下的所有可执行脚本，并显示动态内容。

