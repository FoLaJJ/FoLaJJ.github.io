# Volatility



取证工具



## 分析内存文件

### 文件信息

```
volatility imageinfo -f xp.raw
```



### 数据库文件

```
volatility hivelist -f XP.raw --profile=WinXPSP3x86
```



### 注册表内容

```
volatility -f XP.raw --profile=WinXPSP3x86 hivedump -o 0xe124f8a8
```



### 用户账号

```
volatility -f XP.raw --profile=WinXPSP3x86 printkey -K "SAM\Domains\Account\Users\Names"
```



### 最后登录的用户

```
volatility -f xp.raw --profile=WinXPSP3x86 printkey -K "SOFTWARE
\Microsoft\Windows NT\CurrentVersion\Winlogon"
```



### 正在运行的程序

次数和最后一次运行时间

```
volatility -f XP.raw --profile=WinXPSP3x86 userassist
```



### 进程信息

```
volatility -f XP.raw --profile=WinXPSP3x86 pslist
```

