# Kali环境配置

虚拟机直接安装个人版版，免费使用即可，不用破解



kali的iso镜像就直接官网下载即可，安装的时候选择系统为debian



==切记切记切记，要拍摄快照==



## 基础自定义

重置超级用户密码

```
passwd root
```

添加普通用户

```
adduser jiangxiao
```

加速kali运行

一些基本的加速软件 preload

```
apt-get install preload
```

识别用户最常用的程序，将二进制文件和依赖预先加载至内存



bleachbit释放磁盘空间

```
apt-get install bleachbit
```



## 虚拟机共享文件夹



与Windows共享文件夹，这个其实安装了vmware tools也能实现相同功能，这里就是在设置里面找到共享文件夹菜单，创建操作系统中已经存在的共享文件夹的路径，在编辑虚拟机设置里面的选项里头就能看到设置了

需要注意的是，共享文件夹在外面设置之后，里面还要进行挂载操作

```
sudo mount -t fuse.vmhgfs-fuse .host:/ /mnt/hgfs -o allow_other
```

```
sudo mount -t fuse.vmhgfs-fuse .host:/ 挂载点 -o allow_other
```

```
sudo mount -t fuse.vmhgfs-fuse .host:/ /mnt/windows-share -o allow_other
```

如果虚拟机重启，需要再次挂载共享文件夹。

所以可以写一个bash，开机一键启动







## 源更新失败（签名出错）

W: GPG 错误：http://mirrors.ustc.edu.cn/kali kali-rolling InRelease: 下列签名无效： EXPKEYSIG ED444FF07D8D0BF6 Kali Linux Repository <devel@kali.org>
E: 仓库 “http://mirrors.ustc.edu.cn/kali kali-rolling InRelease” 没有数字签名。
N: 无法安全地用该源进行更新，所以默认禁用该源。
N: 参见 apt-secure(8) 手册以了解仓库创建和用户配置方面的细节。

```bash
wget archive.kali.org/archive-key.asc   //下载签名
 
sudo apt-key add archive-key.asc   //安装签名
```



## 更换安装源

```
vim /etc/apt/sources.list      #使用vim访问源
```

把官方源注释掉

```
#中科大
deb http://mirrors.ustc.edu.cn/kali kali-rolling main non-free contrib
deb-src http://mirrors.ustc.edu.cn/kali kali-rolling main non-free contrib
```

```
sudo apt update
# 更新索引
```



```
sudo apt upgrade
#更新软件
```

大概需要10分钟



## 安装东西

vscode 记得配置中文环境

deb包就使用dpkg进行安装

直接Tab键就不用输入xxxx.deb了

```bash
sudo dpkg -i xxxxx.deb
```



## 运行如果没有配置环境变量

运行php如果没有配置环境变量直接在文件最上面加这一行东西。

```
#!/usr/bin/php
```





## bp证书

直接配置好之后，浏览器打开 /burp

点击下载，然后浏览器设置里面搜certificates，从view certificates导入即可







## 概念性

安全测试：一个过程，用于验证信息资产或系统是否受到保护，并且验证保护功能是否按照预期效果进行

OSINT，开源情报

APT，Advanced Persistent Threats 高级持久性威胁

IDS，入侵检测系统

IPS，入侵组织系统





## Maltego工具

Maltego是OSINT框架中最强大的一个

收集个人在互联网上各个公开的信息，枚举域名系统，强力破解普通DNS







## 信息收集：

google缓存，网页快照

http://cachedview.com/

http://web.archive.org/web/*/

http://webcache.googleusercontent.com/search?q=cache:xxx.com

一系列的快照网站都可以



## Shodan

比较全的搜索引擎

基本查ip可以分析很多服务器、操作系统、网站服务啥的



https://www.shodan.io/

可以查询Apache，就会弹出所有使用该服务的网站

也可以直接查询ip



比如查询szu.edu.cn

可以查询出下面的子域名，以及ip地址，开放端口号

```
210.39.3.5

szu.edu.cn
imap.szu.edu.cn
smtp.szu.edu.cn
pop.szu.edu.cn
mail.szu.edu.cn
pop3.szu.edu.cn

开放端口：25、80、110、443、465、993、995
```



继续查询ip，可以看到SSL证书，TCP连接服务

所属地、组织、各种服务







各种黑客组织的漏洞网站信息库

http://zone-h.com/?zh=1

https://haveibeenpwned.com



漏洞网站：

http://testfire.net/



## metasploit



shellcode

自动攻击脚本

kali自带



打开

```bash
msfconsole
```



查询漏洞

```
search ms17_010
```



使用模块，直接use查询的全称

```
use xxxxx/xxxxx/xxxxx/xxxx/xxxx
```



进入到模块，查看配置

```
show options
```



```
ping 目标ip
```



然后一个一个去set设置

```
set LHOST xxx.xx.xxx.x
```

设置listen攻击端口

```
set LPORT 12345
```





运行

```
run
```



然后help查看具体功能

```
help
```





永恒之蓝漏洞



永恒之蓝是指2017年4月14日，黑客团体Shadow Brokers（影子经纪人）公布一大批网络攻击工具，其中就包括“永恒之蓝”工具，利用Windows系统的SMB漏洞获取系统最高权限。5月12日，不法分子改造“永恒之蓝”制作了wannacry勒索病毒，被勒索支付高额赎金才能解密恢复文件



wannacry：缓冲区溢出漏洞









