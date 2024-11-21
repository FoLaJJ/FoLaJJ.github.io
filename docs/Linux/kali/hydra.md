# hydra暴力破解

## 简述

暴力破解攻击

就是跑字典，自动尝试多种用户名和密码组合。



支持HTTP、FTP、SSH、SMB、MySQL服务等等



官方文档：

```
or -P FILE  try password PASS, or load several passwords from FILE
  -C FILE   colon separated "login:pass" format, instead of -L/-P options
  -M FILE   list of servers to attack, one entry per line, ':' to specify port
  -t TASKS  run TASKS number of connects in parallel per target (default: 16)
  -U        service module usage details
  -m OPT    options specific for a module, see -U output for information
  -h        more command line options (COMPLETE HELP)
  server    the target: DNS, IP or 192.168.0.0/24 (this OR the -M option)
  service   the service to crack (see below for supported protocols)
  OPT       some service modules support additional input (-U for module help)
```



- -L：指定用户名列表文件，账号字典
- -P：指定密码列表文件，密码字典
- -l：就直接一个用户名
- -p：就直接一个密码

注意了大写就是引入字典，小写就是直接写上去即可。



- protocol，直接写



## 简单使用

如果是命令行使用：

```shell
hydra -l user -P passlist.txt ftp://192.168.0.1
```



注意kali自带了字典，具体在密码攻击的`wordlists` ，具体hydra的字典用的是啥，可以进去里面选择，灵活选择。



如果是点进去应用，他会一步一步地让你填，直接傻瓜式应用



tips：统计字典个数

```
cat xxx.txt | wc -l
```



## 常用

- -l，小写l，直接指定用户名
- -P，大写P，跑字典
- smb，就是windows一般开放的协议，445端口
- -V，显示详情

```
hydra -l administrator -P /usr/share/wordlists/rockyou.txt 192.168.xxx.xx smb -V
```

