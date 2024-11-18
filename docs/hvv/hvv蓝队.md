# hvv蓝队应急

## 事件类型

一级-四级

红橙黄蓝



应用安全

WebShell、网页篡改、网页挂马



系统安全

勒索病毒、挖矿木马、远控后门



网络安全

DDOS攻击、ARP攻击、流量劫持



数据安全

数据泄露、损坏、加密





## 入侵痕迹排查：

### 文件及敏感目录排查

倒序查看当前目录下的所有文件

```
ls -alt
```



排查临时目录

```
find /tmp ! -type d -exec ls -lctr --full-time {} \+ 2>/dev/null
```



排查home目录

```
find $HOME ! -type d -exec ls -lctr --full-time {} \+ 2>/dev/null
```



特权文件排查

```
find / -perm 2000 2>/dev/null
```



按照时间文件排查

```
find / -newerct '2024-01-24 08:10:00' ! -newerct '2024-01-24 09:10:00' ! -path '/proc/*' ! -path /'sys/*' ! -path '/run/*' -type f -exec ls -lctr --full-time {} \+ 2>/dev/null
```



文件创建及修改时间查询

```
stat 【文件名路径/文件名】
```



查看进程占用文件

```
lsof 【文件名路径/文件名】
```



### 后门账户排查

排查有登录SSH权限的账户

```
cat /etc/passwd | grep -v nologin$
```



排查UID是0的超级权限用户

```
cat /etc/passwd | awk -F: '$3==0 {print $1}'
```



排查拥有口令的SSH账户

```
cat /etc/shadow | awk -F: 'length($2)>2 {print $1}'
```



排查空口令账户

```
cat /etc/shadow | awk -F: 'length($2)==0 {print $1}'
```



SSH登录密钥

```
cat /root/.ssh/authorized_keys
```



### 后门程序排查

排查开机启动脚本文件

```
cat /etc/rc.local
```



排查服务启动脚本文件

```
ls /etc/init.d
```



排除计划任务脚本文件

```
cat /etc/crontab
crontab -l
```



排除环境变脸设置

```
cat /etc/profile
```

```
 .bash_profile .bash_login .bash_logout
```



- `/etc/profile` :  系统的每个用户设置环境信息
- `~/.bash_profile` : 每个用户都可以使用该文件输入专用于自己使用的shell信息 
- `~/.bash_login` : 和logout差不多就是查看登录登出的信息



要注意文件别名还有软链接之类的设置





### 后门排查

RPM包可信校验

```
rpm -Vf [可执行文件路径]
```



校验所有的安装包

```
rpm -V -a
```



命令别名查询

```
alias
```



排除上传文件目录PHP文件

```
find ./ -name "*.php"
```



排除web目录下新创建的文件

```
find / -ctime -i
```



批量过滤关键字，如eval等

```
grep eval /var/www/html/*
find ./ | xargs grep eval
```



### 日志分析

日志默认存放的位置

```
/val/log
```



查看日志配置情况

```
more /etc/rsyslog.conf
```



日志信息

| 日志文件         | 说明                                                         |
| ---------------- | ------------------------------------------------------------ |
| /var/log/cron    | 记录了系统定时任务相关的日志                                 |
| /var/log/cups    | 记录打印信息的日志                                           |
| /var/log/dmesg   | 记录了系统在开机时内核自检的信息，也可以使用dmesg命令直接查看内核自检信息 |
| /var/log/mailog  | 记录邮件信息                                                 |
| /var/log/message | 记录系统重要信息的日志。这个日志文件中会记录Linux系统的绝大多数重要信息，如果系统出现问题时，首先要检查的就应该是这个日志文件 |
| /var/log/btmp    | 记录错误登录日志，这个文件是二进制文件，不能直接vi查看，而要使用lastb命令查看 |
| /var/log/lastlog | 记录系统中所有用户最后一次登录时间的日志，这个文件是二进制文件，不能直接vi，而要使用lastlog命令查看 |
| /var/log/wtmp    | 永久记录所有用户的登录、注销信息，同时记录系统的启动、重启、关机事件。同样这个文件也是一个二进制文件，不能直接vi，而需要使用last命令来查看 |
| /var/log/utmp    | 记录当前已经登录的用户信息，这个文件会随着用户的登录和注销不断变化，只记录当前登录用户的信息。同样这个文件不能直接vi，而要使用w,who,users等命令来查询 |
| /var/log/secure  | 记录验证和授权方面的信息，只要涉及账号和密码的程序都会记录，比如SSH登录，su切换用户，sudo授权，甚至添加用户和修改用户密码都会记录在这个日志文件中 |



==查看最近登录的ip==

```
cat /var/log/auth.log | grep Accepted | awk '{print $11}' | sort | uniq -c | sort -nr
```



查询ip登录失败次数

```
cat /var/log/secure* | grep 8.219.176.16 | grep Failed | wc -l
```



查询ip登录成功次数

```
cat /var/log/secure* | grep 222.186.16.186 | grep Accepted | wc -l
```



查询ip登录时间

```
cat /var/log/secure* | grep xxx.xxx.xx.xx
```



==统计多少ip爆破root==

```
grep "Failed password for root" /var/log/secure | awk '{print $11}' | sort | uniq -c | sort -nr | more
```



具体定位爆破ip

```
grep "authentication failure" /var/log/auth.log|grep -E -o "(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)"|uniq -c
```



lastlog查询最新一次用户登录情况

```
lastlog
```



w查询当前用户的信息

```
w
```





## misc：

木马文件优先放在C:\Windows\Temp

linux在/temp

病毒分析，删除病毒的同时要备份，然后逆向



 Windows系统下的当前系统用户：

```
net user
```

看不了隐藏用户，需要在控制面板、lusrmgr.msc、用户组可以看到



影子用户，只有注册表中能看到



删除某个用户：，慎重，删除不了隐藏和影子

```
net user xxxx /del
```









## 参考资料：

https://mp.weixin.qq.com/s/lFxWCgfZpsGj7Bpd63JPnQ



