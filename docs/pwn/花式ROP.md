# 花式ROP









## ROP滑梯绕过ASLR

ROP滑梯可以绕过`ASLR`

![image-20241123131806602](../_media/image-20241123131806602.png)





## 栈迁移

用gadget改变esp的值



- 栈溢出的长度足以直接使用ROP
- 栈溢出payload会出现空字符截断，且gadget地址含有空字符
- 泄露地址信息后需要新的ROP payload



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





## Canary绕过

低版本libc，直接利用库函数缺陷溢出，将指针替换为需要泄露出的字符串地址，主动触发检测，打印`flag`



子进程爆破Canary值，有fork的话



两种思路：

- 将Canaries的值泄露出来，然后栈溢出的时候精准覆盖
- 同时篡改TLS和栈上的Canaries，绕过检查

 
