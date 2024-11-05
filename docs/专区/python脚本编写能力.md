# CTF中写代码





一般使用python

## 实现01文件的二维码转换

给出一个01文件，要你转换为二维码



思考思路：

- 二维码是正方形，所以直接读取文本的长度，再进行开方，如果得出答案，就说明是二维码，这样也得出边长来

```python
import math

f = open('C:\\xxx\\xxx.txt','r')
s = f.read()
print(len(s))
print(math.sqrt(len(s)))
```

- 二维码就是在边长为260的画布上画画，此时直接调用Python中的PIL库即可

```python
from PIL import Image
x = 260
y = 260
image_new = Image.new('RGB', (x,y), (0,0,0)) # RGB模式，边长均为260，黑色（0,0,0）\白色（255,255,255）
image_new.show()
```

- 利用读取到的文件数据进行上色画画

```python
# 3. 区分0或1分别上色黑或白，修复完整二维码
idx = 0    # idx表示txt文件中数据序号，第一个数据为0号，对应坐标点（0,0）  下一个1号对用坐标点（1,0）
for y in range(0, 260):   # 就是平面坐标（x,y）初中几何的知识，只不过用代码写出来
    for x in range(0, 260):
        data = s[idx]  
        if data == '0': # 假如txt中第一个数据为0，对应坐标点（0,0），就给他上黑丝（黑色）
            img_new.putpixel((x,y),(0,0,0)) 
        elif data == '1':
            img_new.putpixel((x,y),(255,255,255))
        idx += 1
img_new.show()

```

- 总代码如下：

```python
import math
from PIL import Image

# 1.判断二维码数据是否可用
f = open('txt文件路径', 'r')
s = f.read()
print(len(s))
# 开平方根，如果二进制大小能整除，证明是长方形，得出宽、高  x=y=260
print(math.sqrt(len(s)))

# 2. 测试每个像素点上色（全白、全黑）
x = 260
y = 260
img_new = Image.new('RGB', (x,y), (0,0,0)) # RGB模式，边长均为260，黑色（0,0,0）\白色（255,255,255）
# image_new.show()

# 3. 区分0或1分别上色黑或白，修复完整二维码
idx = 0
for y in range(0, 260):
    for x in range(0, 260):
        data = s[idx]
        if data == '0':
            img_new.putpixel((x,y),(0,0,0))
        elif data == '1':
            img_new.putpixel((x,y),(255,255,255))
        idx += 1
img_new.show()

```



## 爆破凯撒密码

其实就是左右偏移，但是题目没有告诉你凯撒密码偏移的距离，可能有25种可能

所以直接用Python爆破，把所有可能性给打印出来

```python
from string import ascii_letters
str1 = 'ComeChina'
str2 = str1.lower()
num = 1
table = ascii_letters
for i in range(26):
    print("{}:  ".format(num), end='')
    for temp in str2:
        if temp not in table:
            print(chr(ord(temp)), end="")
        elif ((ord(temp)+num)>ord('z')):
            print(chr((ord(temp)+num)-26), end='')
        else:
            print(chr((ord(temp)+num)), end='')
    num += 1
    print("")
# 结果会输出26种全部结果，其中有个flag
```



## 变异凯撒密码

每一位的加密方式并不一样，但都是有规律的变化（~~不然就不叫加密了，天王老子来了都解不了~~）

```python
key = 5  # 初始key值
result = ""
content = "afZ_r9VYfScOeO_UL^RWUc"  # 密文
for i in range(len(content)):
    ori = ord(content[i]) + key
    result += chr(ori)
    key += 1
print(result)

# 输出结果 flag{Caesar_variation}

```



## base换表爆破

```python
import itertools
def My_base64_decode(inputs,s):
	bin_str = []
	for i in inputs:
		if i != '=':
			x = str(bin(s.index(i))).replace('0b', '')
			bin_str.append('{:0>6}'.format(x))
	#print(bin_str)
	outputs = ""
	nums = inputs.count('=')
	while bin_str:
		temp_list = bin_str[:4]
		temp_str = "".join(temp_list)
		#print(temp_str)
		if(len(temp_str) % 8 != 0):
			temp_str = temp_str[0:-1 * nums * 2]
		for i in range(0,int(len(temp_str) / 8)):
			outputs += chr(int(temp_str[i*8:(i+1)*8],2))
		bin_str = bin_str[4:]	
	return outputs
h=['j','u','3','4']
h1=list(itertools.permutations(h))
for i in h1:
	m="".join(i)
	s = "JASGBWcQPRXEFLbCDIlmnHUVKTYZdMovwipatNOefghq56rs"+m+"kxyz012789+/"
	input_str="mtHVnkLnIaP3FaA7KOWjTmKkVjWjVzKjdeNvTnAjoH9iZOIvTeHbvD=="
	print(My_base64_decode(input_str,s),i)
 
 
#NEWSCTF2021{base64_1s_v3ry_e@sy_and_fuN}
```



## 快速计算式

```python
# coding:utf-8

import re
import requests
#from bs4 import BeautifulSoup  也可选择使用BeautifulSoup来筛选元素值

url = 'http://lab1.xseclab.com/xss2_0d557e6d2a4ac08b749b61473a075be1/index.php'
s = requests.session()
r = s.get(url)

# get方法会返回一个<class 'requests.models.Response'>，Response对象，该对象中有content属性
#Help on property:

# Content of the response, in bytes.
#该属性内容为一个二进制流
#type(r.content)
#<class 'bytes'>

content = r.content.decode('utf-8')     #解码完后为'str'类型数据

# 编译正则表达式模式，返回模式对象。
num = re.findall(re.compile(r'<br/>\s+(.*?)='), content)[0]

# 要计算的式子
print(num)
print('\n')

# 要传输的式子结果
print(eval(num))
print('\n')

# 根据页面源代码构造payload
payload = {'v':eval(num)}      # 页面源码中post参数名为`v`

# post提交上去
flag = s.post(url,data=payload)
html = flag.content.decode('utf-8')
#soup = BeautifulSoup(html, 'html.parser')

print(html)
#print(soup.body)
```



```python
# coding:utf-8

import requests
from bs4 import BeautifulSoup as BP

url = "http://123.206.87.240:8002/qiumingshan/"
s = requests.session()   # 必须使用session()会话对象，不然提交的时候式子又会变，结果对不上
r = s.get(url)
html = r.content.decode('utf-8')
soup = BP(html,'html.parser')
num1 = soup.div
num2 = num1.get_text()

payload = {'value':eval(num2)}

flag = s.post(url,data=payload)
print(flag.content.decode('utf-8'))
```



根据不同的网页代码进行编写



## 多重未知加密方式进行解码

程序可以进行修改，增加更多的解码函数，并且加到解码器列表中

```python
import base64
import binascii
import codecs
from Crypto.Cipher import AES, DES
from Crypto.Util.Padding import unpad

# 定义常见的解码函数
def try_base64_decode(data):
    try:
        return base64.b64decode(data).decode('utf-8')
    except Exception:
        return None

def try_base32_decode(data):
    try:
        return base64.b32decode(data).decode('utf-8')
    except Exception:
        return None

def try_hex_decode(data):
    try:
        return bytes.fromhex(data).decode('utf-8')
    except Exception:
        return None

def try_rot13_decode(data):
    try:
        return codecs.decode(data, 'rot_13')
    except Exception:
        return None

# AES解密（需要已知密钥和IV）
def try_aes_decrypt(data, key, iv):
    try:
        cipher = AES.new(key, AES.MODE_CBC, iv)
        decrypted = unpad(cipher.decrypt(binascii.unhexlify(data)), AES.block_size)
        return decrypted.decode('utf-8')
    except Exception:
        return None

# DES解密（需要已知密钥和IV）
def try_des_decrypt(data, key, iv):
    try:
        cipher = DES.new(key, DES.MODE_CBC, iv)
        decrypted = unpad(cipher.decrypt(binascii.unhexlify(data)), DES.block_size)
        return decrypted.decode('utf-8')
    except Exception:
        return None

# 解码器列表
decoders = [
    try_base64_decode,
    try_base32_decode,
    try_hex_decode,
    try_rot13_decode,
]

# 自动解码函数
def auto_decode(encoded_str, max_iterations=10, aes_key=None, aes_iv=None, des_key=None, des_iv=None):
    current_str = encoded_str
    for i in range(max_iterations):
        for decoder in decoders:
            decoded = decoder(current_str)
            if decoded:
                print(f"Step {i + 1}: {decoder.__name__} -> {decoded}")
                current_str = decoded
                break
        else:
            # 如果没有找到任何解码方式，尝试AES或DES解密（如果提供了密钥和IV）
            if aes_key and aes_iv:
                decoded = try_aes_decrypt(current_str, aes_key, aes_iv)
                if decoded:
                    print(f"Step {i + 1}: AES Decrypt -> {decoded}")
                    current_str = decoded
                    continue
            if des_key and des_iv:
                decoded = try_des_decrypt(current_str, des_key, des_iv)
                if decoded:
                    print(f"Step {i + 1}: DES Decrypt -> {decoded}")
                    current_str = decoded
                    continue
            # 如果所有解码方式都失败，则退出
            print("无法进一步解码")
            break
    return current_str

# 示例使用
encoded_string = "加密的字符"
aes_key = b'YOUR_AES_KEY'  # 16字节
aes_iv = b'YOUR_AES_IV'    # 16字节
des_key = b'YOUR_DES_KEY'  # 8字节
des_iv = b'YOUR_DES_IV'    # 8字节

decoded_string = auto_decode(encoded_string, aes_key=aes_key, aes_iv=aes_iv, des_key=des_key, des_iv=des_iv)
print("最终解码结果:", decoded_string)
print(base64.b32decode(decoded_string).decode('utf-8'))
```





## 大文本的base家族破解

```python
import string
import base64
with open('base.txt') as f:
    text = f.read()
while(1):
    try:
        text = base64.b64decode(text).decode()
    except Exception as e:
        try:
            text = base64.b32decode(text).decode()
        except Exception as e:
            try:
                text = base64.b16decode(text).decode()
            except Exception as e:
                break
print(text)
```





## 共模攻击

```python
from Crypto.Util.number import inverse
from sympy import gcd

# 模数 N，和两个加密指数 e1 和 e2
N = 0x00b0bee5e3e9e5a7e8d00b493355c618fc8c7d7d03b82e409951c182f398dee3104580e7ba70d383ae5311475656e8a964d380cb157f48c951adfa65db0b122ca40e42fa709189b719a4f0d746e2f6069baf11cebd650f14b93c977352fd13b1eea6d6e1da775502abff89d3a8b3615fd0db49b88a976bc20568489284e181f6f11e270891c8ef80017bad238e363039a458470f1749101bc29949d3a4f4038d463938851579c7525a69984f15b5667f34209b70eb261136947fa123e549dfff00601883afd936fe411e006e4e93d1a00b0fea541bbfc8c5186cb6220503a94b2413110d640c77ea54ba3220fc8f4cc6ce77151e29b3e06578c478bd1bebe04589ef9a197f6f806db8b3ecd826cad24f5324ccdec6e8fead2c2150068602c8dcdc59402ccac9424b790048ccdd9327068095efa010b7f196c74ba8c37b128f9e1411751633f78b7b9e56f71f77a1b4daad3fc54b5e7ef935d9a72fb176759765522b4bbc02e314d5c06b64d5054b7b096c601236e6ccf45b5e611c805d335dbab0c35d226cc208d8ce4736ba39a0354426fae006c7fe52d5267dcfb9c3884f51fddfdf4a9794bcfe0e1557113749e6c8ef421dba263aff68739ce00ed80fd0022ef92d3488f76deb62bdef7bea6026f22a1d25aa2a92d124414a8021fe0c174b9803e6bb5fad75e186a946a17280770f1243f4387446ccceb2222a965cc30b3929
e1 = 17
e2 = 65537

# 读取 encrypt1 和 encrypt2
with open("flag.enc1", "rb") as f:
    encrypt1 = int(f.read().hex(), 16)

with open("flag.enc2", "rb") as f:
    encrypt2 = int(f.read().hex(), 16)

# 扩展欧几里得算法，找到 s1 和 s2 使得 s1*e1 + s2*e2 = 1
def extended_gcd(a, b):
    if b == 0:
        return a, 1, 0
    gcd_val, x, y = extended_gcd(b, a % b)
    return gcd_val, y, x - (a // b) * y

g, s1, s2 = extended_gcd(e1, e2)

# 确保 e1 和 e2 互质
if g != 1:
    raise ValueError("e1 and e2 are not coprime.")

# 根据 s1 和 s2 的正负来计算 data_num
if s1 < 0:
    part1 = inverse(pow(encrypt1, -s1, N), N)
else:
    part1 = pow(encrypt1, s1, N)

if s2 < 0:
    part2 = inverse(pow(encrypt2, -s2, N), N)
else:
    part2 = pow(encrypt2, s2, N)

data_num = (part1 * part2) % N

# 将 data_num 转换为原始字节数据
data_hex = format(data_num, 'x')
if len(data_hex) % 2 != 0:
    data_hex = '0' + data_hex  # 保证长度为偶数
data_bytes = bytes.fromhex(data_hex)

# 去除随机填充并输出 flag 内容
flag = data_bytes.lstrip(b"\x00\xff")  # 假设填充数据为 \x00 或 \xff
print("Recovered flag.txt:", flag)

```





## 实现png的CRC冗余码计算正确的长宽

```python
import binascii 
import struct

crcbp = open("misc33.png", "rb").read() #打开图片 
crc32frombp = int(crcbp[29:33].hex(),16) #读取图片中的CRC校验值 print(crc32frombp)

for i in range(1000): #宽度1-4000进行枚举 
    for j in range(1000): #高度1-4000进行枚举 
        data = crcbp[12:16] + struct.pack('>i', i)+struct.pack('>i', j)+crcbp[24:29] 
        crc32 = binascii.crc32(data) & 0xffffffff 
        if(crc32 == crc32frombp): #计算当图片大小为i:j时的CRC校验值，与图片中的CRC比较，当相同，则图片大小已经确定 
            print(i, j) 
            print('hex:', hex(i), hex(j)) 
            exit(0)
```



## 批量修改png的宽度并另存

```python
import os 
import binascii 
import struct 

bp = open("misc34.png", "rb").read()

for i in range(901,1500): 
    png_name='misc34/'+str(i)+'.png'#我是建立一个文件夹，可以不写前面的文件夹路径。 
    png=open(png_name,"wb") 
    data=bp[:16] + struct.pack('>i', i)+bp[20:24]+bp[24:] 
    png.write(data) 
    png.close()
```



## 批量修改jpg宽度并另存

```python
import struct

file = "misc35.jpg"
with open(file, 'rb') as f:
    all_bin = f.read()
    for i in range(901, 1051):
        jpg_name='misc35/'+str(i)+'.jpg'
        f1 = open(jpg_name, "wb")
        pic = all_bin[0:159] + struct.pack('>h', i) + all_bin[161:]  # 159到160B的内容为宽度，2字节
        f1.write(pic)
        f1.close()
```



## 修改gif宽度另存

```python
import struct 
file = "misc36.gif" 
with open(file, 'rb') as f: 
    all_bin = f.read() 
    for i in range(920, 951): 
        gif_name='misc36/'+str(i)+'.gif'
        f1 = open(gif_name, "wb") 
        pic = all_bin[0:38] + struct.pack('<h', i) + all_bin[40:] # 16到20B的内容为宽度 
        f1.write(pic) 
        f1.close() 
```





## 变种二进制问题

7个bit为1位

```python
s = '11000111110100110011011100111101000110111111101111111011011010101100100111000011000101100101100110110011001110010111001011010111001101100010011011111000101100101011001001101100111000110010001110010110110011001111000010111001110010111000101100011110000101100000110100011010101110011111101'

for i in range(0,287,7):
    print(chr(int(s[i:i+7],2)),end="")
```



## 遍历扫描目录下文件并读取内容

```python
flag=""
for i in range(28,69): #flag内容从28位开始
    f = open('D:/下载/浏览器下载/misc40/apngframe/apngframe'+str(i)+'.txt')
    s = f.read()
    flag += chr(int(s.split("/")[0][6:]))
print(flag)

```



## 读取GIF偏移量后画图找出flag

```python
# 第一阶段：读取偏移
with open('misc46.gif', 'rb') as f:
    bin_data = f.read()

point_list = []
for i in range(0, len(bin_data)):
    #print(hex(bin_data[i]))
    # struct GRAPHICCONTROLEXTENSION GraphicControlExtension[0~n] 中偏移固定位置在21 f9后的 9 10 11 12 位
    # 先找到21 f9，再根据固定的偏移找到ushort ImageLeftPosition 9 10 和ushort ImageTopPosition 11 12
    if i+1<=len(bin_data) and hex(bin_data[i])=='0x21' and hex(bin_data[i+1])=='0xf9':
        # 两字节转为十进制
        # 低位字节存在前，高位字节存在后，大端字节序
        l = int((bin_data[i+10] << 8) | bin_data[i+9])
        r = int((bin_data[i+12] << 8) | bin_data[i+11])
        point_list.append((l,r))

# 第二阶段：通过偏移画图
from PIL import Image
import matplotlib.pyplot as plt

img = Image.new('RGB',(400,70),(255,255,255))
for i in point_list:
    new = Image.new('RGB',(1,1),(0,0,0))
    img.paste(new,i)
plt.imshow(img)
plt.show()
```



## 读取apng偏移量后画图找出flag

```python
# 第一阶段：读取偏移
with open('misc47.png', 'rb') as f:
    bin_data = f.read()

point_list = []
for i in range(0, len(bin_data)):
    #print(hex(bin_data[i]))
    # union CTYPE type 中偏移固定位置在66 63 54 4C 后的 16 17 18 19 20 21 22 23 位
    # 先找到66 63 54 4C ，再根据固定的偏移找到uint32 x_offset 16 17 18 19 和uint32 y_offset 20 21 22 23
    if i+3<=len(bin_data) and hex(bin_data[i])=='0x66' and hex(bin_data[i+1])=='0x63' and hex(bin_data[i+2])=='0x54' and hex(bin_data[i+3])=='0x4c':
        # 两字节转为十进制，赌他不会用到三字节
        # 高位字节存在前，低位字节存在后，小端字节序
        l = int((bin_data[i+18] << 8) | bin_data[i+19])
        r = int((bin_data[i+22] << 8) | bin_data[i+23])
        point_list.append((l,r))

# 第二阶段：通过偏移画图
from PIL import Image
import matplotlib.pyplot as plt

img = Image.new('RGB',(400,70),(255,255,255))
for i in point_list:
    new = Image.new('RGB',(1,1),(0,0,0))
    img.paste(new,i)
plt.imshow(img)
plt.show()
```



## 提取文件中的大写字母并输出

```python
def read_file_and_concat_uppercase(file_path):
    with open(file_path, 'r') as file:
        content = file.read()
        
    # 提取大写字母并拼接
    uppercase_letters = ''.join(char for char in content if char.isupper())
    
    return uppercase_letters

# 示例用法
file_path = '1.txt'  # 替换为你的文件路径
result = read_file_and_concat_uppercase(file_path)
print(result)

```





## 提取fps人物键盘移动轨迹画图

```python
import matplotlib.pyplot as plt

with open("1.txt","r+") as file:
	content = file.read()

contentListX = []
contentListY = []
x = 0
y = 0
for c in content:
	if c=="a":
		x = x-1
	elif c=="d":
		x = x+1
	elif c=="w":
		y = y+1
	elif c=="s":
		y = y-1
	else:
		continue
	contentListX.append(x)
	contentListY.append(y)

plt.plot(contentListX,contentListY)
plt.show()
```



## 倒序输出文件内容

```python
input = open('flag.jpg','rb') 
input_all =input.read() 
ss = input_all[::-1] 
output = open('123.jpg','wb') 
output.write(ss) 
input.close() 
output.close()
```



## 音频提取高低波形为10进行解码

```python
import wave as we

import numpy as np

import codecs


wavfile= we.open(u'music.wav',"rb")

params=wavfile.getparams()

framesra,frameswav=params[2],params[3]

datawav=wavfile.readframes(frameswav)

wavfile.close()

datause=np.frombuffer(datawav,dtype=np.short)


result_bin=''

result_hex=''

max=0


for i in range(len(datause)-1):

   if datause[i]>max:

       max=datause[i]

   try:

       if(datause[i]<0 and datause[i+1]>=0):

           if(max-24000>0):

               result_bin+='1'

               max=datause[i+1]

           else:

               result_bin+='0'

               max=datause[i+1]

   except:

       break
  

for i in range(0,len(result_bin),4):

   result_hex+=hex(int(result_bin[i:i+4],2))[2:]


print(result_hex)

file_rar=open("test.rar","wb")

file_rar.write(codecs.decode(result_hex,'hex'))  

file_rar.close()    
```





## 字符串和列表，字符串赋值操作

```python
Str2 = '{hello_world}'
flag = list(Str2)

for j in range(len(flag)):
    if( j > len(flag)):
        break
    if(flag[j]==chr(111)):
        flag[j] = chr(48)
        
Str2 = ''.join(flag)
print(Str2)
```











## 逆向

看着代码反着写









```python
s1 = 'qasxcytgsasxcvrefghnrfghnjedfgbhn'
s2 = [0x56, 0x4e, 0x57, 0x58, 0x51, 0x51, 0x09, 0x46,
      0x17, 0x46, 0x54,
      0x5A, 0x59, 0x59, 0x1F, 0x48, 0x32, 0x5B, 0x6B,
      0x7C, 0x75, 0x6E, 0x7E, 0x6E, 0x2F, 0x77, 0x4F,
      0x7A, 0x71, 0x43, 0x2B, 0x26, 0x89, 0xFE, 0x00]

flag = ''

s1 = bytearray(s1,'utf-8')

for i in range(33):
    s1[i] ^=(2*i+65)
    
for j in range(33):
    flag += chr(s1[j]^s2[j])
    
flag = ''.join(flag)
print(flag)
```



- 字符串转数组s1 = bytearray(s1,'utf-8')







## 迷宫脚本编写

重点是识别出是迷宫，其次就是会将数据转为迷宫

```python
s1 =[]			# 大量的数据

x = 0
y = 0

for i in range(0,len(s1)):
    print(s1[i],end="")
    x+=1
    if(x==15):
        x=0
        print(" ")
        y+=1
    if(y==15):
        y=0
        print("--------------------------")
```





## 字符串哈希

```python
import hashlib
s2 = "ddsssddddsssdss"
s3 = "dddddsssddddsssaassssddds"
s4 = "ddssddwddssssssdddssssdddss"

s5 = s2 + s3 + s4
m = hashlib.md5()

m.update(s5.encode('utf-8'))

print(m.hexdigest())

```



## rc4解密脚本

```python
def rc4_init(key):
    s = list(range(256))  # S-box
    k = [ord(key[i % len(key)]) for i in range(256)]  # Key schedule

    j = 0
    for i in range(256):
        j = (j + s[i] + k[i]) % 256
        s[i], s[j] = s[j], s[i]  # Swap s[i] and s[j]

    return s

def rc4_crypt(s, data):
    i = j = 0
    output = bytearray()

    for byte in data:
        i = (i + 1) % 256
        j = (j + s[i]) % 256
        s[i], s[j] = s[j], s[i]  # Swap s[i] and s[j]
        t = (s[i] + s[j]) % 256
        output.append(byte ^ s[t])  # XOR the byte with s[t]

    return output

# Main function
if __name__ == "__main__":
    key = "12345678abcdefghijklmnopqrspxyz"
    pData = bytearray([0xbc, 0xc5, 0x12, 0x7d, 0x85, 0x23, 0x84, 0x71, 
                       0x7b, 0x39, 0x28, 0x2, 0xd3, 0x51, 0xf3, 0x2c, 
                       0x89, 0x2b, 0xa6, 0x2c, 0xaf, 0x9, 0x22, 0x22])

    print(f"pData={list(pData)}")
    print(f"key={key}, length={len(key)}\n")

    s = rc4_init(key)  # Initialization
    s2 = s[:]  # Copy the initialized S-box for decryption

    print("已经加密，现在解密:\n")

    # Decrypt
    decrypted_data = rc4_crypt(s2, pData)
    print(f"pData={list(decrypted_data)}\n")

    for i in range(len(decrypted_data)):
        print(chr(decrypted_data[i]),end="")

```





## IDA模拟复刻rc4代码

```python
Str = "12345678abcdefghijklmnopqrspxyz"
flag = ""
byte_14013B000 =[
  0x9E, 0xE7, 0x30, 0x5F, 0xA7, 0x01, 0xA6, 0x53, 0x59, 0x1B, 
  0x0A, 0x20, 0xF1, 0x73, 0xD1, 0x0E, 0xAB, 0x09, 0x84, 0x0E, 
  0x8D, 0x2B, 0x00, 0x00
]
v10 = []
print("v10:")
for i in range(22):
    v10.append(byte_14013B000[i]^0x22)
    print(v10[i],end=" ")


v6 = 0
v7 = 0
v8 = 0
v9 = []
print("\nv9:")
for i in range(256):
    v9.append(i)
    print(v9[i],end=" ")

for j in range(256):
    v8 = v9[j]
    v7 = (ord(Str[v6])+v8+v7) % 256
    v9[j] = v9[v7]
    v9[v7] = v8
    v6 = v6 + 1
    if v6 >= len(Str):
        v6 = 0
print("\nv9:")
for i in range(256):
    print(v9[i], end=" ")

v5 = 0
v6 = 0

for i in range(len(v10)):
    v5 = (v5 + 1) % 256
    v7 = v9[v5]
    v6 = (v7 + v6) % 256
    v8 = v9[v6]
    v9[v5] = v8
    v9[v6] = v7
    flag += chr(v10[i] ^ (v9[(v8 + v7)%256]) % 256)
print("\n")
print(flag)
```



## 字符串数组互转

```python
s_box = [0 for _ in range(33)]

Str1 = "f\nk\fw&O.@\x11x\rZ;U\x11p\x19F\x1Fv\"M#D\x0Eg\x06h\x0FG2O"

Str2 = list(Str1)

for i in range(32,0,-1):
    s_box[i] = ord(Str2[i]) ^ ord(Str2[i-1])

flag = ""

for i in range(len(s_box)):
    flag += chr(s_box[i])

print(flag)
```



## base64基本解码

```python
import base64

Str1 = 'e3nifIH9b_C@n@dH'

Destination1 = ''
flag = ''

for i in range(len(Str1)):
    Destination1 = chr(ord(Str1[i]) - i)
    flag += Destination1

flag = base64.b64decode(flag)
print(flag)
print(flag.decode('utf-8'))
```





## ==小端序大端序字符转换==

```python
flag = 'GXY{do_not_'
f2=[0x7F,0x66,0x6F,0x60,0x67,0x75,0x63,0x69][::-1]


for i in range(8):
    if i%2==1:
        s = chr(f2[i]-2)
    else :
        s = chr(f2[i]-1)
    flag += s
print(flag)
```





## 字符串索引查找find方法

```python
encrypt = "*F'\"N,\"(I?+@"
encrypt = list(encrypt)

key = '~}|{zyxwvutsrqponmlkjihgfedcba`_^]\[ZYXWVUTSRQPONMLKJIHGFEDCBA@?>=<;:9876543210/.-,+*)(\'&%$# !"'

x = []

flag = ""

for i in encrypt:
    x.append(key.find(i)+1)

for i in x:
    flag +=chr(i)

print(flag)
```



## 取余操作逆向，思想值得注意

```python

# for i in range(l):
#     num = ((input1[i] + i) % 128 + 128) % 128


code = ['\x1f','\x12','\x1d','(','0','4','\x01','\x06','\x14','4',',','\x1b','U','?','o','6','*',':','\x01','D',';','%','\x13']

for i in range(len(code)-1,0,-1):
    code[i-1] = chr(ord(code[i-1]) ^ ord(code[i]))

for j in range(len(code)):
    print(chr((ord(code[j])-j)%128),end="")
```



## 网站备份扫描

```python
import requests

url1 = 'http://0192c6b42dcf7c18ac821e3799d67707.8td7.dg05.wangdingcup.com:43011'  # url为被扫描地址，后不加‘/’

# 常见的网站源码备份文件名  同目录下创建List.txt 如web,website,backup,back,www,wwwroot,temp等
with open('C:\\Users\\HelloCTF_OS\\Desktop\\python-test\\List1.txt', 'r') as f:
    list1 = f.read().splitlines()
    
# 常见的网站源码备份文件后缀
list2 = ['tar', 'tar.gz', 'zip', 'rar', '7-zip', '7z']
for i in list1:
    for j in list2:
        back = str(i) + '.' + str(j)
        url = str(url1) + '/' + back
        print(back + '    ', end='')
        print(requests.get(url).status_code)

        #结果返回的是状态码，如果状态码为200则存在
```





## 哈希碰撞

```python
import random
import hashlib
 
value = "8b184b"
while 1:
    plainText = random.randint(10**11, 10**12 - 1)
    plainText = str(plainText)
    MD5 = hashlib.md5()
    MD5.update(plainText.encode(encoding='utf-8'))
    cipherText = MD5.hexdigest()
    if cipherText[-6:]==value :
        print("碰撞成功:")
        print("密文为:"+cipherText)
        print("明文为:"+plainText)
        break
    else:
        print("碰撞中.....")
```



哈希不一定只有md5，一定要去查资料，看他的考点是什么，比如下面sha256爆破，由于是电话号码，所以做法有两种，一种就是遍历，一种还是遍历，一定要注意信息收集，题目一个给了86170，一个给了首批放号，就是8617091，然后又给了论文，直接查论文AirDrop的加密方式即可，sha256

```python
import hashlib

target_hash = 'c22a563acc2a587afbfaaaa6d67bc6e628872b00bd7e998873881f7c6fdc62fc'
start = 8617000000000
end = 8617099999999

for i in range(end,start,-1):
    plainText = str(i)
    cipherText = hashlib.sha256(plainText.encode('utf-8')).hexdigest()
    
    if cipherText == target_hash:
        print("碰撞成功:")
        print("密文为:", cipherText)
        print("明文为:", plainText)
        break
    else:
        print("碰撞中-------",i)

```





