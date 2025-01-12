# WireShark工具使用





## 简介

抓包引擎

- Linux——Libpcap9
- Windows——Winpcap10















## nc抓取实验对比

不加密的流量nc

```
主机
nc -lp 333 -c bash

客户机
nc -nv 10.1.1.11 333
```



加密的ssl监听ncat，加密的流量

```
主机
ncat -nvl 333 -c bash --ssl

客户机
ncat -nv 10.1.1.11 333 --ssl
```

