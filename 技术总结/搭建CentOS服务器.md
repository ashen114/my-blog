# 搭建CentOS服务器

本例为在本地通过创建虚拟机搭建CentOs服务器

## 安装CentOs系统

- 下载并安装 VMware Workstation
- 下载并安装 CentOS 7 到虚拟机上即可

> 问题：若提示“此主机支持Intel VT-x,但Intel VT-x处于禁用状态”
> 解决：进入BIOS（例如技嘉主板是按住Del进入，然后在`BIOS Features`下，将`Virtualization Technology`设置为`enabled`），然后保存重启

## 安装ssh服务

```s
# 检查是否安装了ssh服务
yum list installed | grep openssh-server

# 若没有安装，可以通过下述命令安装
yum install openssh-server

# 打开sshd_config
vim /etc/ssh/sshd_config
```

开启sshd_config中的

```conf
# 开启监听端口、监听地址
Port 22
# AddressFamily any
ListenAddress 0.0.0.0
ListenAddress ::

# 开启允许远程登录
PermitRootLogin yes
PasswordAuthentication yes
```

```s
# 开启ssh服务
sudo service sshd start

# 开机自启动
systemctl enable sshd.service
```

其后，可以通过xshell等工具连接

## 安装nginx服务

```s
# 使用 EPEL 仓库中的nginx安装包
sudo yum install epel-release

# 安装nginx
sudo yum install nginx

# 设置开机启动
sudo systemctl enable nginx

# 启动nginx
sudo systemctl start nginx

# 打开80和443端口
sudo firewall-cmd --permanent --zone=public --add-service=http
sudo firewall-cmd --permanent --zone=public --add-service=https
sudo firewall-cmd --reload

# 查询ip
ip addr show
```

尝试在外部浏览器访问虚拟机的ip地址，确认是否能正常访问



更多步骤可参考：https://segmentfault.com/a/1190000018109309

----

## 搭建FTP服务

```s
# 安装vsftpd
yum install -y vsftpd

# 开机自启动
systemctl enable vsftpd

# 启动ftp服务
systemctl start vsftpd

# 确认服务是否启动
netstat -antup | grep ftp
```

> 问题：若提示netstat command not found
> 解决：安装网络工具 `yum install net-tools`

```s
# 下述操作步骤需要使用vim，先检查是否安装了vim
rpm -qa|grep vim
```

正常安装了完整的vim会显示如下

```s
vim-enhanced-7.0.109-7.el5
vim-minimal-7.0.109-7.el5
vim-common-7.0.109-7.el5
```

若缺了其中某个，可以使用例如`yum -y install vim-enhanced`的命令安装，也可以一次性安装全部，使用```yum -y install vim*```

```s
# 配置vsftpd
useradd ftpuser
passwd ftpuser

# 创建 FTP 服务使用的文件目录
mkdir /var/ftp/test

# 修改目录权限
chown -R ftpuser:ftpuser /var/ftp/test

# 打开 vsftpd.conf 文件
vim /etc/vsftpd/vsftpd.conf
```

按 i 切换到编辑模式，修改vsftpd.conf配置


```conf
# 不允许匿名访问，设置为NO时，访问ftp的时候不需要输入密码，设置为YES的时候，需要输入密码访问。
anonymous_enable=YES

# 将用户限制在为其配置的主目录
local_enable=YES
chroot_local_user=YES
chroot_list_enable=YES
chroot_list_file=/
listen=YES

# 开启被动模式，设置本地用户登录后所在目录，以及云服务器建立数据传输可使用的端口范围值
local_root=/var/ftp/test
allow_writeable_chroot=YES
pasv_enable=YES
pasv_address=xxx.xx.xxx.xx #请修改为您的 Linux 云服务器公网 IP
pasv_min_port=40000
pasv_max_port=45000
```

按下`ESC`输入`:wq`保存退出

```s
# 重启服务
systemctl restart vsftpd.service
```