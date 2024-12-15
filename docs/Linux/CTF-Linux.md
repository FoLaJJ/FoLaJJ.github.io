# Linux漏洞专区



## VIM漏洞

### 缓存异常

开发人员线上使用vim编辑器，当vim异常退出时，会有缓存一直留在文件夹中，并且一般是`.文件名.swp`

直接网站访问 

```
http://xxx.xxx.xx.x/.index.php.swp
```



然后下载，使用vim进行还原

```
vim -r index.php.swp
```



这样就得到某个文件的源码了





## 软硬链接



```
ln -s xxx.txt link
```



将xxx.txt创建软链接link，如果txt丢失，则会失效





```
ln xxx.txt link
```

创建硬链接





## Nmap扫描端口



```
nmap 172.31.171.103
```



扫描172.31.171.103的1~1000端口

```
nmap -p 1-1000 172.31.171.103
```



确定运行在开放端口上的服务

```
nmap -sV 172.31.171.103
```



确认操作系统

```
nmap -O 172.31.171.103
```



### 绕过防火墙

入侵检测系统IDS 检测和响应网络中的恶意活动和安全威胁





分段数据包：

```
-f/-ff 
```



最大传输单位：

```
--mtu <databytes>
```



改变最小并行端口扫描/最大并行端口扫描

```
--max-parallelism <number>
--min-parallelism <number>
```



设置最小超时时间/最大超时时间

```
--min-rtt-timeout <milliseconds>
--max-rtt-timeout <milliseconds>
```



欺骗源地址

```
-S <IP_Address>
```



mac地址欺骗

```
--spoof-mac <mac address/prefix/vendor name>
```





## 备份文件

常见的备份文件如下：

```
.git
.svn
.swp
.~
.bak
.bash_history
.bkf
```



### .git文件

#### Git泄露

Git init初始化的时候，会在当前目录自动生成.git且一般来说是隐藏的，所以就很容易被程序员遗漏，部署网站的时候没有进行删除，也没有进行相应的检测，导致外部可以直接访问.git，下载使用工具等进行还原网站源码



#### Git目录结构



典型目录结构如下：

- HEAD：指向当前分支的指针
- config：存储仓库的配置信息
- description：用于描述仓库的简要信息，通常只在裸仓库中使用
- hooks：存放各种客户端或者服务器端的钩子脚本，用来执行特定操作
- info：存储一些额外的配置信息，例如排除文件列表（exclude）
- objects：存储所有的数据对象
- refs：存储分支、标签等引用信息





#### 判断网站是否有git泄露



- 直接通过网页访问.git目录

- 直接访问.git/head文件，如果能够下载就说明存在git泄露



下载之后可以使用GitHack.py进行还原





#### Git使用方法





#### Git查看敏感信息

- 查看提交历史，尤其敏感文件，配置文件、凭证文件、数据库连接字符串等

```
git log
```

结合--grep参数查找关键字，如：

```
git log --grep="password"
git log --grep="flag"
```



- 查看文件历史

```
git log --<文件名>
```



- 查看分支信息refs目录下保存了分支、标签的信息，查看未合并的代码

```
cat .git/refs/heads/<branch_name>
```



- 查看对象信息，objects保存了所有提交、文件、树和标签的对象

```
git cat-file -p <object_id>
```



- 查看最近的一次提交

```
git show
```



- 查看main分支最新提交

```
git show main
```



- 查看标签v1.0的提交

```
git show v1.0
```





- 查看特定提交,可以使用提交的哈希值进行指定

```
git show <commit-hash>
```



- 文件差异

```
git diff <前> -- <后>
```



#### 免杀

清理本地日志

```
git reflog expire --expire=now --all
git gc --prune=now --aggressive
```



#### 防止措施



Apache在`.htaccess`文件中

```
RedirectMatch 404 /\.git
```



Nginx加入规则

```
location ~ /.git {
    deny all;
}
```



### .DS_Store文件

.DS_Store是mac os保存文件夹的自定义属性的隐藏文件，如文件的图标位置和背景颜色



性质相当于Windows的desktop.ini

每一个文件夹里面都可能有一个.DS_Store





#### 查看

查看直接VScode里面下载Hex Editor进行查看即可，因为它是十六进制文件

或者cat、hexdump

```
cat .DS_Store
hexdump .DS_Store
```



strings 提取文件中可读的字符串

```
strings .DS_Store
```





#### .DS_Store和._.DS_Store区别

.DS_Store

- **功能**：用于存储文件夹的自定义视图设置和属性，如图标位置、窗口大小等。
- **位置**：每个文件夹中都有一个，用于 macOS 的 Finder 显示。

._.DS_Store

- **功能**：通常是 macOS 创建的 AppleDouble 文件，目的是在非 macOS 系统（如 Windows 或 Linux）上保存 macOS 特有的文件元数据。
- **位置**：在文件通过网络共享或复制到非 macOS 系统时生成，确保这些系统可以理解文件的属性。





## 







## 递归解压缩



```sh
#!/bin/bash

# 递归解压函数
recursive_unzip() {
    # 查找当前目录下所有的压缩文件类型
    for file in $(find . -type f \( -name "*.zip" -o -name "*.tar.gz" -o -name "*.tar.bz2" -o -name "*.rar" -o -name "*.7z" \)); do
        case "$file" in
            *.zip)
                unzip -d "${file}_extracted" "$file" && rm "$file"
                ;;
            *.tar.gz)
                mkdir -p "${file%.*.*}_extracted" && tar -xzf "$file" -C "${file%.*.*}_extracted" && rm "$file"
                ;;
            *.tar.bz2)
                mkdir -p "${file%.*.*}_extracted" && tar -xjf "$file" -C "${file%.*.*}_extracted" && rm "$file"
                ;;
            *.rar)
                mkdir -p "${file%.*}_extracted" && unrar x "$file" "${file%.*}_extracted" && rm "$file"
                ;;
            *.7z)
                mkdir -p "${file%.*}_extracted" && 7z x "$file" -o"${file%.*}_extracted" && rm "$file"
                ;;
        esac
    done
}

# 主循环，每次调用解压函数直到没有压缩文件
while find . -type f \( -name "*.zip" -o -name "*.tar.gz" -o -name "*.tar.bz2" -o -name "*.rar" -o -name "*.7z" \) | grep -q .; do
    recursive_unzip
done

echo "所有嵌套压缩包已解压完成！"
```





## 递归查找文件内容



查找文件内容中有flag{ }字样的内容

```sh
grep -r -o -E "flag\{[^}]*\}" .
```



反向匹配

匹配tmp目录下的文件中没有"flag is not here"的文件

```
grep -r -L "flag is not here" tmp
```





## 正则匹配文件内容



```bash
cat my_flag.txt |grep -E 'flag\{[0-9]{3}[A-Z].*' -o
```





