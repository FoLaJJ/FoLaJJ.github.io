# CSRF

参考链接：[CSRF漏洞原理攻击...](https://blog.csdn.net/qq_43378996/article/details/123910614?fromshare=blogdetail&sharetype=blogdetail&sharerId=123910614&sharerefer=PC&sharesource=weixin_51334923&sharefrom=from_link)

## 定义

CSRF跨站请求伪造

Cross Site Request Forgery 跨站请求伪造



伪造数据包

无过滤防护或者防护可以绕过

需要诱惑受害者触发，h色网站即可







基本就是获取登录的网页get之类的，然后构造一个一模一样的请求头，插入到钓鱼网站中，利用用户自身浏览器存储的cookie进行提交，BP专业版可以自动生成CSRF攻击页面



可以通过短链接进行分享给受害者，也可以搞h色网站诱惑访问，也可以伪造404页面进行点击





偏向社工类 



get、post、token三类





## CSRF挖掘

- 抓包，没有Referer和token字段，那么极有可能有CSRF漏洞
- 有Referer字段，但是改包去掉该字段提交仍然有效，那么就是存在漏洞

## 伪造类型

### 1.GET伪造

get直接伪造成链接即可

```
http://www.mybank.com/Transfer.php?toBankId=11&money=1000
```





### 2.POST伪造

post伪造，伪造一个表单即可，具体表单提交的东西可以直接F12检查元素进行复制，模板如下

```html
<!DOCTYPE html>
<html langc>
    <head>
        <title>404 no found</title>
    </head>
    <body>
        <from action='xxx.xxx.xxx.xxx(提交到目标网址)' method='POST'>
        <input name="sex" value="admin" type="hidden"  >
        <input class="phonenum" name="phonenum" value="xxx" type="hidden">
        <input class="add" name="add" value="xxxxxxxx" type="hidden">
        <input class="email" name="email" value="xxxxxxxx" type="hidden">
        <input class="sub" name="submit" value="submit" type="submit">
        </from>
    </body>
</html>
	
```



### 3.Token伪造

还是F12检查元素，看一下表单的Token隐藏在哪里了，直接找出来假设Token=xxxxxxxxx，实际情况就直接抓包流量分析，

token直接爆破，如果没有限制的话





## 防护措施

### 1.Referer同源

就是检查Referer字段

严谨的检测绕过

文件上传绕过

XSS绕过



不严谨的检测绕过



全部对比：ip=ip

匹配对比：包含这个ip即可

```
http://xx.xx.xx.xx/http://xx.xx.xx.xx
```



可以篡改



### 2.Token校验

对于 GET 请求，token 将附在请求地址之后，这样 URL 就变成 http://url?csrftoken=tokenvalue。 而对于 POST 请求来说，要在 form 的最后加上 ，这样就把 token 以参数的形式加入请求了。



缺点：

- Token完全无遗漏地加到每一个请求上面，可以用js遍历dom数进行写入，尤其a和form标签
- 发表评论的外链没有限制的话就会利用外链进行攻击，可以增加判断，访问外链就不加token，内网就加



### 3.验证码



### 4.HTTP请求头中自定义属性



然而这种方法的局限性非常大，XMLHttpRequest 请求通常用于 Ajax 方法中对于页面局部的异步刷新，并非所有的请求都适合用这个类来发起，而且通过该类请求得到的页面不能被浏览器所记录下，从而进行前进，后退，刷新，收藏等操作，给用户带来不便。





## 靶场

### pikachu