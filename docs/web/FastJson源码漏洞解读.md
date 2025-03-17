# Fastjson

Fastjson 是阿里巴巴开源的一个 Java 库

可以将 Java 对象转换为 JSON 格式，也可将 JSON 字符串转换为 Java 对象。



JSON库被多次爆出有严重的反序列化漏洞(如AutoType绕过、反序列化RCE等等)



关键的方法就是：

- 将对象转为JSON字符串

```
JSON.toJSONString
```

- 将JSON字符串转换为对象

```
JSON.parse
JSON.parseObject()
```



参考资料：

https://zonghaishang.gitbooks.io/fastjson-source-code-analysis/content/
