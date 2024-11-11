# Shell Script

## 1.什么是shell script？

所谓shell script分为shell 和script。shell就是一个命令行界面下面让我们与系统沟通的一个工具接口；script就是字面上的意思，脚本；shell script就是针对shell执行的脚本

**官话：shell script是利用shell的功能所写的一个程序，这个程序是使用纯文本文件，将一些shell的语法与命令（含外部命令）写在里面，搭配正则表达式、管道命令与数据重定向等功能，以达到我们所想要的处理目的。**

## 2.学习shell script的必要性

- **自动化管理的依据**
- **追踪与管理系统的重要工作**
- **简单入侵检测功能**
- **连续命令单一化**
- **简易的数据处理**
- **跨平台支持与学习历程较短**

shell script在处理系统管理方面优势极为强大，但不适合处理大量数值运算，因为shell script的速度较慢，并且使用的CPU资源较多，会造成主机资源的分配不良。所以我们通常利用shell script 来处理服务器的检测，没有进行大量的运算，所以放心使用强大的shell script

## 3.shell script注意事项

- 命令的执行是从上而下、从左而右地分析与执行
- 命令、参数间的多个空白都会被忽略掉
- 空白行也被忽略掉，并且[Tab]键所得的空白同样视为空格键
- 如果读取到一个 Enter符号（CR），就尝试开始执行
- 至于如果一行的内容太多，则可以使用”\\[Enter]“来拓展至下一行
- ”#“可作为批注。任何加在#后面的数据将全部被视为批注文字而被忽略，除了第一行，#!/bin/bash指定这个script要使用的shell
- 要标明一些环境变量，写上去准不会错，比如PATH和LANG
- 结束要传值exit 0；
- 文件要有rwx权限

**时刻记得养成良好的编写习惯，在头文件做注释**

- script 的功能

- script 的版本信息

- script 的作者与联络方式

- script 的版权声明方式

- script 的 History

- script 内较为特殊的命令，使用绝对路径来执行

- script 执行时需要的环境变量预先声明与设置

## 4.正式开始学习shell script

### 1.shell基础：

```shell
grep root /etc/passwd
//查看root用户的shell解释器
cat /etc/shells
//查看该Linux系统的shell解释器
usermod -s /usr/bin/bash root
//修改root用户的shell解释器
```

\>与\>\>的区别

```shell
>覆盖
>>追加
2>错误信息
&>错误正确一起输出
```

### 2.第一个shell脚本文件

```
#!/bin/bash
echo 'Hello World \a \n'
exit 0
```

运行脚本的n种方式

```shell
sh sh01.sh
bash sh01.sh
//执行脚本，会建立一个新的bash，结果不返回父进程
source sh01.sh
//在父进程中进行
//值得注意的是上述两种方式不需要文件有执行权限

./sh01.sh
//而这个需要提权操作
```

### 3.变量

```shell
//定义变量：
变量名=变量值

//取消变量：
unset 变量名

//查看变量：
$变量名
${变量名}
{}//减少歧义
```

**系统环境变量**

```shell
存储在/etc/profile或者在~/.bash_profile
使用env可以列出所有的环境变量
常见环境变量：
PATH、PWD、USER、UID、HOME、SHELL
```

**预定义变量**

- $0 当前所在进程或脚本名
- $\$ 当前运行进程的PID号
- $? 命令返回状态，0表示正常，1或其他值表示异常
- $# 已加载的位置变量个数，总数！！
- $* 所有位置变量的值

### 4.多种引号的区别

```shell
双引号 " "
//允许拓展，以$引用其他变量
单引号 ' '
//禁用拓展，即便$也视为普通字符
反引号 ` `
//将命令的执行输出作为变量值，$()与反引号等效
//里面只能放命令  
```

### 5.基本运算法则

法则一致，加减乘除取模

```shell
基本运算要在$[]、$(())之内运行才正常
```

### 6.echo指令

```shell
echo  "  "
//打印""内的语句到shell中
echo -n " "
//不换行打印
echo -e "\033[32mOK\033[0m"
//-e 拓展属性
// \033[ 开启颜色属性
// 32m是一种颜色
// OK输出的内容
// \033[0m 关闭颜色 [0m 黑色
```

**-e 属性大全**

- 三十多是字体颜色
  - 31m 红色
  - 32m 浅绿色
  - 33m 橙色
  - 34m 深蓝色
  - 35m 紫罗兰
  - 36m 天蓝色
  - 37~40原色
- 四十多是背景颜色
  - 数值与色彩对应和三十多的是一致的！
  - 37有所差异，背景银白色

### 7.字符串比较

```shell
[ -z 字符串 ]
//是否为空，前面一个中括号必须要有空格
[ 字符串1 == 字符串2 ]
//等于比较 ，以及  != 不等于比较
```

 grep MemAvailable /proc/meminfo







## 5.案例说明

### 1.基本的Hello World

```shell
#!/bin/bash
#功能：打印Hello World在shell上
PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/local/games:/usr/games
export PATH
echo "Hello World"
exit 0
```

### 2.你是谁？

```shell
#!/bin/bash
#功能：将用户的名字输入并输出至shell上
PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/local/games:/usr/games
export PATH
read -p "Please input your first name:" firstname
read -p "Please input your last name:" lastname
echo "\nYour full name is:$firstname$lastname"
exit 0
```

### 3.它输的是Y还是N？

```shell
#!/bin/bash
#判断yes or no的一个简单的程序
read -p " Please input (Y/N) : " yn
[ "$yn" == "Y" -o "$yn" == "y" ] && echo "OK,continue" &&exit 0
[ "$yn" == "N" -o "$yn" == "n" ] && echo "OK,interrupt" &&exit 0
echo "我不知道你输出的是什么勾吧东西" && exit 0
```

### 4.菜单选项

```shell
#!/bin/bash
#这是一个最简单的菜单选项
echo "---------------------菜单脚本选项----------------- "
echo "1.查看剩余内存容量
2.查看跟分区剩余容量
3.查看CPU十五分钟负载
4.查看系统进程数量
5.查看系统账户数量
6.退出"
while : 
do
  read -p "请输入选项【1~6】:" key
  case $key in
1)
        grep MemAvailable /proc/meminfo;;
2)
        df | awk '/\/$/{print $4)';;
3)
        uptime | awk '{print $NF)';;
4)
        ps anx | wc -l;;
5)
        sed -n '$=' /etc/passwd;;
6)
        exit
esac
done
echo "---------------------菜单脚本选项----------------- "
```

### 5.非我即死

```shell
#!/bin/bash
#判断当前用户是不是root用户，不是的话就将该用户踢出
PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/local/games:/usr/games
export PATH
if [ $USER == root ] ;then
        echo "自己人，不用慌！！"
        exit 0
else
        echo " 你不是自己人？"
        echo "自爆程序开启！"
        sleep 1
        i=$(whoami)
        a=$(pstree -ap | grep ${i})
        b=${a%%:*}
        c=${b##*,}
        kill -9 $c
fi
exit 0
```

#### 1.截取字符串的方法

```shell
#/bin/bash
str="https://76.38.71.244,port:8080"
echo "0:  $str"
echo ----------------------------------
echo ""#" 删除左边,保留右边"
echo "1:  ${str#*.}"    #从左边开始,遇见第一个"."结束,进行删除
echo "2:  ${str##*.}"   #从左边开始,遇见最后一个"."结束,进行删除
echo ----------------------------------
echo ""%" 删除右边,保留左边"
echo "3:  ${str%.*}"    #从右边开始,遇见第一个"."结束,进行删除
echo "4:  ${str%%.*}"   #从右边开始,遇见最后一个"."结束,进行删除
echo ----------------------------------
echo "指定索引位截取"
echo "5:  ${str:3:4}"   #第三位开始,往后4位,进行截取操作
echo "6:  ${str:10}"    #从第10位开始,一直到最后,进行截取操作
echo "7:  ${str:0-9:5}" #从右边数,第9位开始,往后5位进行截取操作
echo "8:  ${str:0-9}"   #从右边数,第9位开始,一直到最后,进行截取
```

### 6.检查各个重要端口是否开放

```shell
#!/bin/bash
#这是一个检查各个重要端口是否开放的脚本
PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/local/games:/usr/games
export PATH
echo "------------------- 程序运行中----------------------- "
echo "--------------检查各个重要端口是否开放--------------- "
netstat -tuln | grep ":21" > /dev/null && echo "21端口exist" || echo "21端口no exist"
netstat -tuln | grep ":22" > /dev/null && echo "22端口exist" || echo "22端口no exist" 
netstat -tuln | grep ":23" > /dev/null && echo "23端口exist" || echo "23端口no exist" 
netstat -tuln | grep ":25" > /dev/null && echo "25端口exist" || echo "25端口no exist" 
netstat -tuln | grep ":53" > /dev/null && echo "53端口exist" || echo "53端口no exist" 
netstat -tuln | grep ":80" > /dev/null && echo "80端口exist" || echo "80端口no exist" 
netstat -tuln | grep ":118" > /dev/null && echo "118端口exist" || echo "118端口no exist" 
exit 0
```

### 7.封ip操作

```shell
#!/bin/bash
## 日志文件路径
log_file="/home/logs/client/access.log"
## 当前时间减一分钟的时间
d1=`date -d "-1 minute" +%H:%M`
## 当前时间的分钟段
d2=`date +%M`
## iptables命令所在的路径
ipt="/sbin/iptables"
## 用于存储访问日志里的ip
ips="/tmp/ips.txt"
 
## 封ip
block(){
   ## 把日志文件中的ip过滤出来，去掉重复的ip，并统计ip的重复次数以及对ip进行排序，最后将结果写到一个文件中
   grep "$d1:" $log_file |awk '{print $1}' |sort -n |uniq -c |sort -n > $ips
   ## 将文件里重复次数大于100的ip迭代出来
   for ip in `awk '$1 > 100 {print $2}' $ips`
   do
      ## 通过防火墙规则对这些ip进行封禁
      $ipt -I INPUT -p -tcp --dport 80 -s $ip -j REJECT
      ## 将已经封禁的ip输出到一个文件里存储
      echo "`date +%F-%T` $ip" >> /tmp/badip.txt
   done
}
 
## 解封ip
unblock(){
   ## 将流量小于15的规则索引过滤出来
   for i in `$ipt -nvL --line-number |grep '0.0.0.0/0' |awk '$2 < 15 {print $1}' |sort -nr`
   do
      ## 通过索引来删除规则
      $ipt -D INPUT $i
   done
   ## 清空规则中的数据包计算器和字节计数器
   $ipt -Z
}
 
## 为整点或30分钟就是过了半个小时，就需要再进行分析
if [ $d2 == "00" ] || [ $d2 == "30" ]
then
   unblock
   block
else
   block
fi
```

