# Volatility



取证工具

Volatility 是一款开源的**内存取证分析工具**，常用于分析内存转储文件（如`.raw`、`.dmp`），检测恶意进程、Rootkit、网络连接痕迹等。

以下是常见使用场景和参数示例：

- 查看进程列表

```
volatility -f memory.dump --profile=Win10x64 pslist  
```

- 提取网络连接

```
volatility -f memory.dump --profile=Win10x64 netscan  
```

- 检测隐藏进程，如Rootkit

```
volatility -f memory.dump --profile=Win10x64 malfind  
```

- 提取注册表信息

```
volatility -f memory.dump --profile=Win10x64 hivelist  
```

在CTF比赛中，通过分析内存镜像发现异常进程（如`notepad.exe`注入恶意代码），提取恶意载荷或密钥文件。





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

