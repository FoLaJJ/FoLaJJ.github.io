# 信息安全工程作业——模拟PGP协议收发数据



[TOC]

## 0. 实验描述

下图为PGP协议（RSA签名、RSA加密、IDEA消息加密的巧妙结合）的发送数据过程，请编程模拟PGP协议收发数据的过程，其中所涉及密码方案可以做替换。

![image-20241103163711307](../_media/image-20241103163711307.png)



## 1. 项目实现



如实验描述中，实验要使M明文通过RSA签名后压缩、IDEA消息加密再RSA加密的方式，最后经过base64编码的形式生成最后的加密结果。



我们就直接按照流程一步步模拟实现，然后最后再拼接在一起：



本次python需要使用的库和包：

```python
import base64
import hashlib
import zlib
from Crypto.Cipher import AES, PKCS1_OAEP
from Crypto.PublicKey import RSA
from Crypto.Random import get_random_bytes
```







## 2. 加密实现



### 2.0 RSA密钥对生成



```python
def generate_rsa_keys():
    key = RSA.generate(2048)
    private_key = key.export_key()
    public_key = key.publickey().export_key()
    return private_key, public_key
```



### 2.1 计算消息的md5哈希值

```python
def generate_md5_hash(message):
    md5_hash = hashlib.md5(message.encode()).digest()
    return md5_hash
```



### 2.2 使用私钥对md5哈希签名

```python
def rsa_sign(private_key, data_hash):
    key = RSA.import_key(private_key)
    cipher_rsa = PKCS1_OAEP.new(key)
    signature = cipher_rsa.encrypt(data_hash)
    return signature
```



### 2.3 zip压缩算法

```python
def zip_compress(data):
    compressed_data = zlib.compress(data.encode())
    return compressed_data
```



### 2.4 使用公钥加密IDEA密钥

```python
def rsa_encrypt_idea_key(public_key, idea_key):
    key = RSA.import_key(public_key)
    cipher_rsa = PKCS1_OAEP.new(key)
    encrypted_idea_key = cipher_rsa.encrypt(idea_key)
    return encrypted_idea_key
```





### 2.5 IDEA加密

```python
def idea_encrypt(idea_key, data):
    cipher = AES.new(idea_key, AES.MODE_EAX)
    ciphertext, tag = cipher.encrypt_and_digest(data.encode())
    return cipher.nonce, ciphertext, tag
```





### 2.6 Base64编码

没啥好说的，就是换一种形式

```python
def base64_encode(data):
    return base64.b64encode(data).decode()
```



### 2.7 PGP模拟加密



直接调用上面写好的函数就可以了

```python
# PGP加密
def pgp_encrypt(message, sender_private_key, receiver_public_key):
    # 1. 生成消息的MD5哈希
    data_hash = generate_md5_hash(message)
    
    # 2. 对MD5哈希进行RSA签名
    signature = rsa_sign(sender_private_key, data_hash)
    
    # 3. 压缩消息数据
    compressed_message = zip_compress(message)
    
    # 4. 生成随机的IDEA对称密钥
    idea_key = get_random_bytes(16)
    
    # 5. 使用IDEA密钥加密压缩后的数据
    nonce, ciphertext, tag = idea_encrypt(idea_key, compressed_message)
    
    # 6. 用接收者的公钥RSA加密IDEA密钥
    encrypted_idea_key = rsa_encrypt_idea_key(receiver_public_key, idea_key)
    
    # 7. 对加密数据和签名进行BASE64编码
    encoded_message = base64_encode(ciphertext)
    encoded_signature = base64_encode(signature)
    encoded_idea_key = base64_encode(encrypted_idea_key)
    
    return {
        "ciphertext": encoded_message,
        "signature": encoded_signature,
        "encrypted_idea_key": encoded_idea_key,
        "nonce": base64_encode(nonce),
        "tag": base64_encode(tag)
    }
```





### 2.8 加密完整脚本

```python
import base64
import hashlib
import zlib
from Crypto.Cipher import AES, PKCS1_OAEP
from Crypto.PublicKey import RSA
from Crypto.Random import get_random_bytes

# 生成RSA密钥对
def generate_rsa_keys():
    key = RSA.generate(2048)
    private_key = key.export_key()
    public_key = key.publickey().export_key()
    return private_key, public_key

# 生成MD5哈希
def generate_md5_hash(message):
    md5_hash = hashlib.md5(message.encode()).digest()
    return md5_hash

# RSA签名
def rsa_sign(private_key, data_hash):
    key = RSA.import_key(private_key)
    cipher_rsa = PKCS1_OAEP.new(key)
    signature = cipher_rsa.encrypt(data_hash)
    return signature

# ZIP压缩
def zip_compress(data):
    compressed_data = zlib.compress(data.encode())
    return compressed_data

# RSA加密IDEA密钥
def rsa_encrypt_idea_key(public_key, idea_key):
    key = RSA.import_key(public_key)
    cipher_rsa = PKCS1_OAEP.new(key)
    encrypted_idea_key = cipher_rsa.encrypt(idea_key)
    return encrypted_idea_key

# IDEA加密
def idea_encrypt(idea_key, data):
    cipher = AES.new(idea_key, AES.MODE_EAX)
    ciphertext, tag = cipher.encrypt_and_digest(data)
    return cipher.nonce, ciphertext, tag

# Base64编码
def base64_encode(data):
    return base64.b64encode(data).decode()


# PGP加密
def pgp_encrypt(message, sender_private_key, receiver_public_key):
    # 1. 生成消息的MD5哈希
    data_hash = generate_md5_hash(message)
    
    # 2. 对MD5哈希进行RSA签名
    signature = rsa_sign(sender_private_key, data_hash)
    
    # 3. 压缩消息数据
    compressed_message = zip_compress(message)
    
    # 4. 生成随机的IDEA对称密钥
    idea_key = get_random_bytes(16)
    
    # 5. 使用IDEA密钥加密压缩后的数据
    nonce, ciphertext, tag = idea_encrypt(idea_key, compressed_message)
    
    # 6. 用接收者的公钥RSA加密IDEA密钥
    encrypted_idea_key = rsa_encrypt_idea_key(receiver_public_key, idea_key)
    
    # 7. 对加密数据和签名进行BASE64编码
    encoded_message = base64_encode(ciphertext)
    encoded_signature = base64_encode(signature)
    encoded_idea_key = base64_encode(encrypted_idea_key)
    
    return {
        "ciphertext": encoded_message,
        "signature": encoded_signature,
        "encrypted_idea_key": encoded_idea_key,
        "nonce": base64_encode(nonce),
        "tag": base64_encode(tag)
    }


# 示例使用代码
def main():
    # 生成发送者和接收者的RSA密钥对
    sender_private_key, sender_public_key = generate_rsa_keys()
    receiver_private_key, receiver_public_key = generate_rsa_keys()
    print("\nsender_public_key:", sender_public_key)
    print("\nreceiver_private_key:", receiver_private_key)

    
    # 原始消息
    message = "我是xxxx同学，学号为xxxxxxx"
    print("\n明文:", message)
    
    # 加密消息
    encrypted_data = pgp_encrypt(message, sender_private_key, receiver_public_key)
    print("\nencrypted_data:",encrypted_data)
    print("\n密文:", encrypted_data["ciphertext"])
    

# 运行主函数
main()

```





### 2.9 运行结果

生成发送者的公钥、接收者的私钥、还有密文：

```
sender_public_key: b'-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA3BcuNs2w8tbk6WppWOgV\n53r3erFWBlANT7wseHHLxMtAR6M+XgQMHntQ6wYjyRqkm1j/iL47VSorNogiTASH\n35IpccYuJ9ag5i/LOc97P480OJ1Jf3Waa2XrxkU5nqIFSj+IWhoLNitIiAYgQSIa\nYIiizjeKQorg9fyQLgJTjHIYgUTCeAYt3WgBAft+trG+zf3nsN/pUeDLf7dWyw9E\nIRrD33MBbfOwbHybUCp3Q+pS9GjIZJA95W0gtwKMVLcvzsF+QzkQpPWS+915m7sq\nD8ddcKapp9jeDlrtC74IeUFUT6PpFsPd2RXpJuXhKAFwA7UtTVpBSYBqjNILEO0u\nzQIDAQAB\n-----END PUBLIC KEY-----'

receiver_private_key: b'-----BEGIN RSA PRIVATE KEY-----\nMIIEpAIBAAKCAQEAwIrf+kMMyd/Jzj+xLknKm4CMACcQAJcH2FGTpV3u10VR1K+V\nmcvdF8h+j/JGtjzVNR68SsreXuMdUy3hPJjRwEBgvO3sn5xI01NtqVHU0LSLBi0k\nfQapZlIsfZ+Kuw+qTsGrM/2b8bfQmttV3hVPceoZPRp8wVAH/pg23NYSZGsKEfbX\nElCrZKWStldc5SmWO1LFk6W//K7ynasC+XoYPDoK0UdEW2gZ9nNV3iAIhmDBIKD7\nj7284fP7hb4UNZpolChn8TW9O7FIiGKjarOW2qpjImHPRHV1/TLq2o2/ubn8Xpy4\nltVQON500RE4+du8M77PEytyUSYZSRRVDfCXSQIDAQABAoIBAAI9/q2KZc1F1uFT\nKo1+/H1Lor51WOctOCnlLO+esFH5n1DI1Htt69692Zq6QLkY7HAkA2WATOxDObcy\nh3zZzIyY3A1aFtolVsQhan5SjS1ApbS3tPOGrsnIVwKolfbnhEBKt8vxGxzKrI6U\nAgb6f0dXry8C4sU2nrzZb6fv+BE5o/LrUR4kfvVaVXAB/PANbz829z4pRWFVGGES\nkpiHtT5RqOkRjzvceVPBj6L+XVmjfr298beDTQ5SMX/zL/Bey9jD827Y7fj2Cs+g\nC3Oj4KkrAjp0RTQCNsRlS4aRZMNtaz441JOPIAR3c0gPPTahkEGxHFWleJgXXfK0\noogiVIUCgYEAxuoD24LBdAVAcQyEwx+7ZRMRVJ7v3+jegRTUzw7SkVpRBzWY1wjo\noElTE0fI6fVXwRMBkSYD4u6UjswOyQq1l1tuK51zIkQFwys4whGoWrN3Kg2Mba1Q\nwQlakCZp0v+0kGCsDv0qc5tppqXq3wWblWlm02X3XbOFpsHs6T5/bSMCgYEA98y+\nLz8+tTZndVjmgFNJh2QTPcY3mX5594A5FdCSQb4kbn2MO6C49HX3/2+FQ5Xnubb4\nywx34l81ZxD5GMGf6zKDdlWHeery7HRy26ENc5tnJNSRMFcGvsALfT0eFKSNkVDE\nwd13Cp2S5XKbPHLYsP8gz1u6DZDc1+2Cy0YsHqMCgYEAxkbYh4QEMBFYFhgjcpj7\n5BmoqdAwTeLDgKnyI1+kF82OfYA4lQjFUZklnU9t/4BW9Bds9XGOaDPnk5vmlRH+\nxxwVapZtANgLYmuADTsqtRa1jw6oT1924qTfSFdyHyhSpaQnfl1vZoOhQcObpqnh\nV4MUQ18dv6JGdF5UOH/a5z8CgYEA4/fUL5s7kXLPk0GKLRxyVMBYg0hL9kZI5s1r\ntwn+w8Stt4iA7opaHWw6DyEFtLvARzZxhDugPv3gH0WaJJBdEv+RudfNnvfrLGWl\nFTEBMw4Qwe1c9N/bMLl02G7VsaABLWLk4IVh8r4sWjIpZl8xwwOzp5B3hetzgKLc\n5S1VgYkCgYA63spfZ4fvLmgI+D061bhkfi0VW4hhiCNkBoxa79cxTY9k4s/ebtTr\nCetJtcnicUmlpWbLlbnjIcNc3/rk4yZRA2EXYW8UAtOmvasMtrAmudGYKPlgA6DF\nwWj8iBypIMmVAyphJO6GbD2VE5gqKURdzlkEJjg/dwZ094ftKAl9DQ==\n-----END RSA PRIVATE KEY-----'

明文: 我是xxxx同学，学号为xxxxxxx

encrypted_data: {'ciphertext': '1YD/9Qdotinz3HAIKGsvzyRfLW3SJuTbUWwetYUm3i5RTdfqoysjSFzl9e54DB7a/8ZS', 'signature': 'ssQGunufzfX36SnYjOUsevEz1eW8+sXkjQC/0r76LurBM7/x94gU6l4cRQZZSo3jXeAdxQXaLPwloohluz2o+qClUKAv1i1jSnnP3yb/W/W5VWil/3Z5zOJfo0xcILdFMfEbkarIDyAf4RMTQKA9YjPVhq0SET9drSQXSnU7CzvGpVzpsa7D8HgHthwTynGJmKTij/spGMNptNITShCXuWTv3zTxwstiDDwhwgqaDyZX7P8/nP+i72ZsgbcHd6/K+ctw8PNMgMBCCDG+LvqsfCbYaBpPCn0OW9Xyjn2EE7a2extgEb4lzzh90YA/Lo8jYfMHSHHyApbKACiI78JvIg==', 'encrypted_idea_key': 'HbHJZXSpOnyGilV/uNRNPTnmpjZdn0OB1xSOhMfpzHQeaCW38V8MtP1nvA9sNnO/+JzPXPQc4N2bOhJGRb5dCvDWYXyg+l8nswUpXNABpXDHbbhFI9YWNXt1BY272r7N60Ap+LehdQngQ38AwTXjbVo4pPWdNPk2H8oK5ntmgAAMBSEhb6uq0a3ym64yZu581SiIcnP/WeumWxRMjUdeng3b83Rch/k3vh94ArW7EBTjPpOJbj93oLEQbv3zqzb5ToRPCOq4Jbb1e+G92s+JQ85fUK07teJ40gdfnvOIMKFpC5XHvp4yMZnRV6oS5shxL3gktwA1YQ5K3xzXz0682Q==', 'nonce': '2pOEOeDXjQfxh+93YMWLLQ==', 'tag': 'jrTwFD2TjN7mQEQTk+6iMA=='}

密文: 1YD/9Qdotinz3HAIKGsvzyRfLW3SJuTbUWwetYUm3i5RTdfqoysjSFzl9e54DB7a/8ZS

```







## 3.解密实现



那就是结果倒着来：



### 3.0 Base64解码

```
 base64.b64decode()
```



### 3.1 IDEA解密

```python
def idea_decrypt(idea_key, nonce, tag, ciphertext):
    cipher = AES.new(idea_key, AES.MODE_EAX, nonce=nonce)
    data = cipher.decrypt_and_verify(ciphertext, tag)
    return data
```



### 3.2 ZIP解压缩

```python
def zip_decompress(compressed_data):
    decompressed_data = zlib.decompress(compressed_data)
    return decompressed_data.decode()
```



### 3.3 RSA解密IDEA密钥

```python
def rsa_decrypt_idea_key(private_key, encrypted_idea_key):
    key = RSA.import_key(private_key)
    cipher_rsa = PKCS1_OAEP.new(key)
    idea_key = cipher_rsa.decrypt(base64.b64decode(encrypted_idea_key))
    return idea_key
```



### 3.4 PGP模拟解密

```python
# PGP解密
def pgp_decrypt(encrypted_data, receiver_private_key, sender_public_key):
    encrypted_idea_key = encrypted_data["encrypted_idea_key"]
    nonce = base64.b64decode(encrypted_data["nonce"])
    tag = base64.b64decode(encrypted_data["tag"])
    ciphertext = base64.b64decode(encrypted_data["ciphertext"])
    signature = base64.b64decode(encrypted_data["signature"])
    
    # 1. 用接收者的私钥解密IDEA密钥
    idea_key = rsa_decrypt_idea_key(receiver_private_key, encrypted_idea_key)
    
    # 2. 用IDEA密钥解密数据
    compressed_message = idea_decrypt(idea_key, nonce, tag, ciphertext)
    
    # 3. 解压缩数据
    decrypted_message = zip_decompress(compressed_message)
    
    return decrypted_message
```



### 3.5 解密完整脚本

利用接收者的私钥和发送者的公钥进行解密：

```python
import base64
import hashlib
import zlib
from Crypto.Cipher import AES, PKCS1_OAEP
from Crypto.PublicKey import RSA
from Crypto.Random import get_random_bytes

# IDEA解密
def idea_decrypt(idea_key, nonce, tag, ciphertext):
    cipher = AES.new(idea_key, AES.MODE_EAX, nonce=nonce)
    data = cipher.decrypt_and_verify(ciphertext, tag)
    return data

# ZIP解压缩
def zip_decompress(compressed_data):
    decompressed_data = zlib.decompress(compressed_data)
    return decompressed_data.decode()

# RSA解密IDEA密钥
def rsa_decrypt_idea_key(private_key, encrypted_idea_key):
    key = RSA.import_key(private_key)
    cipher_rsa = PKCS1_OAEP.new(key)
    idea_key = cipher_rsa.decrypt(base64.b64decode(encrypted_idea_key))
    return idea_key

# PGP解密
def pgp_decrypt(encrypted_data, receiver_private_key, sender_public_key):
    encrypted_idea_key = encrypted_data["encrypted_idea_key"]
    nonce = base64.b64decode(encrypted_data["nonce"])
    tag = base64.b64decode(encrypted_data["tag"])
    ciphertext = base64.b64decode(encrypted_data["ciphertext"])
    signature = base64.b64decode(encrypted_data["signature"])
    
    # 1. 用接收者的私钥解密IDEA密钥
    idea_key = rsa_decrypt_idea_key(receiver_private_key, encrypted_idea_key)
    
    # 2. 用IDEA密钥解密数据
    compressed_message = idea_decrypt(idea_key, nonce, tag, ciphertext)
    
    # 3. 解压缩数据
    decrypted_message = zip_decompress(compressed_message)
    
    return decrypted_message


def main():
    # 解密消息
    encrypted_data = {'ciphertext': '1YD/9Qdotinz3HAIKGsvzyRfLW3SJuTbUWwetYUm3i5RTdfqoysjSFzl9e54DB7a/8ZS', 'signature': 'ssQGunufzfX36SnYjOUsevEz1eW8+sXkjQC/0r76LurBM7/x94gU6l4cRQZZSo3jXeAdxQXaLPwloohluz2o+qClUKAv1i1jSnnP3yb/W/W5VWil/3Z5zOJfo0xcILdFMfEbkarIDyAf4RMTQKA9YjPVhq0SET9drSQXSnU7CzvGpVzpsa7D8HgHthwTynGJmKTij/spGMNptNITShCXuWTv3zTxwstiDDwhwgqaDyZX7P8/nP+i72ZsgbcHd6/K+ctw8PNMgMBCCDG+LvqsfCbYaBpPCn0OW9Xyjn2EE7a2extgEb4lzzh90YA/Lo8jYfMHSHHyApbKACiI78JvIg==', 'encrypted_idea_key': 'HbHJZXSpOnyGilV/uNRNPTnmpjZdn0OB1xSOhMfpzHQeaCW38V8MtP1nvA9sNnO/+JzPXPQc4N2bOhJGRb5dCvDWYXyg+l8nswUpXNABpXDHbbhFI9YWNXt1BY272r7N60Ap+LehdQngQ38AwTXjbVo4pPWdNPk2H8oK5ntmgAAMBSEhb6uq0a3ym64yZu581SiIcnP/WeumWxRMjUdeng3b83Rch/k3vh94ArW7EBTjPpOJbj93oLEQbv3zqzb5ToRPCOq4Jbb1e+G92s+JQ85fUK07teJ40gdfnvOIMKFpC5XHvp4yMZnRV6oS5shxL3gktwA1YQ5K3xzXz0682Q==', 'nonce': '2pOEOeDXjQfxh+93YMWLLQ==', 'tag': 'jrTwFD2TjN7mQEQTk+6iMA=='}
    receiver_private_key = '-----BEGIN RSA PRIVATE KEY-----\nMIIEpAIBAAKCAQEAwIrf+kMMyd/Jzj+xLknKm4CMACcQAJcH2FGTpV3u10VR1K+V\nmcvdF8h+j/JGtjzVNR68SsreXuMdUy3hPJjRwEBgvO3sn5xI01NtqVHU0LSLBi0k\nfQapZlIsfZ+Kuw+qTsGrM/2b8bfQmttV3hVPceoZPRp8wVAH/pg23NYSZGsKEfbX\nElCrZKWStldc5SmWO1LFk6W//K7ynasC+XoYPDoK0UdEW2gZ9nNV3iAIhmDBIKD7\nj7284fP7hb4UNZpolChn8TW9O7FIiGKjarOW2qpjImHPRHV1/TLq2o2/ubn8Xpy4\nltVQON500RE4+du8M77PEytyUSYZSRRVDfCXSQIDAQABAoIBAAI9/q2KZc1F1uFT\nKo1+/H1Lor51WOctOCnlLO+esFH5n1DI1Htt69692Zq6QLkY7HAkA2WATOxDObcy\nh3zZzIyY3A1aFtolVsQhan5SjS1ApbS3tPOGrsnIVwKolfbnhEBKt8vxGxzKrI6U\nAgb6f0dXry8C4sU2nrzZb6fv+BE5o/LrUR4kfvVaVXAB/PANbz829z4pRWFVGGES\nkpiHtT5RqOkRjzvceVPBj6L+XVmjfr298beDTQ5SMX/zL/Bey9jD827Y7fj2Cs+g\nC3Oj4KkrAjp0RTQCNsRlS4aRZMNtaz441JOPIAR3c0gPPTahkEGxHFWleJgXXfK0\noogiVIUCgYEAxuoD24LBdAVAcQyEwx+7ZRMRVJ7v3+jegRTUzw7SkVpRBzWY1wjo\noElTE0fI6fVXwRMBkSYD4u6UjswOyQq1l1tuK51zIkQFwys4whGoWrN3Kg2Mba1Q\nwQlakCZp0v+0kGCsDv0qc5tppqXq3wWblWlm02X3XbOFpsHs6T5/bSMCgYEA98y+\nLz8+tTZndVjmgFNJh2QTPcY3mX5594A5FdCSQb4kbn2MO6C49HX3/2+FQ5Xnubb4\nywx34l81ZxD5GMGf6zKDdlWHeery7HRy26ENc5tnJNSRMFcGvsALfT0eFKSNkVDE\nwd13Cp2S5XKbPHLYsP8gz1u6DZDc1+2Cy0YsHqMCgYEAxkbYh4QEMBFYFhgjcpj7\n5BmoqdAwTeLDgKnyI1+kF82OfYA4lQjFUZklnU9t/4BW9Bds9XGOaDPnk5vmlRH+\nxxwVapZtANgLYmuADTsqtRa1jw6oT1924qTfSFdyHyhSpaQnfl1vZoOhQcObpqnh\nV4MUQ18dv6JGdF5UOH/a5z8CgYEA4/fUL5s7kXLPk0GKLRxyVMBYg0hL9kZI5s1r\ntwn+w8Stt4iA7opaHWw6DyEFtLvARzZxhDugPv3gH0WaJJBdEv+RudfNnvfrLGWl\nFTEBMw4Qwe1c9N/bMLl02G7VsaABLWLk4IVh8r4sWjIpZl8xwwOzp5B3hetzgKLc\n5S1VgYkCgYA63spfZ4fvLmgI+D061bhkfi0VW4hhiCNkBoxa79cxTY9k4s/ebtTr\nCetJtcnicUmlpWbLlbnjIcNc3/rk4yZRA2EXYW8UAtOmvasMtrAmudGYKPlgA6DF\nwWj8iBypIMmVAyphJO6GbD2VE5gqKURdzlkEJjg/dwZ094ftKAl9DQ==\n-----END RSA PRIVATE KEY-----'
    sender_public_key = '-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA3BcuNs2w8tbk6WppWOgV\n53r3erFWBlANT7wseHHLxMtAR6M+XgQMHntQ6wYjyRqkm1j/iL47VSorNogiTASH\n35IpccYuJ9ag5i/LOc97P480OJ1Jf3Waa2XrxkU5nqIFSj+IWhoLNitIiAYgQSIa\nYIiizjeKQorg9fyQLgJTjHIYgUTCeAYt3WgBAft+trG+zf3nsN/pUeDLf7dWyw9E\nIRrD33MBbfOwbHybUCp3Q+pS9GjIZJA95W0gtwKMVLcvzsF+QzkQpPWS+915m7sq\nD8ddcKapp9jeDlrtC74IeUFUT6PpFsPd2RXpJuXhKAFwA7UtTVpBSYBqjNILEO0u\nzQIDAQAB\n-----END PUBLIC KEY-----'
    decrypted_message = pgp_decrypt(encrypted_data, receiver_private_key, sender_public_key)
    print("\n解密后的明文:", decrypted_message)

# 运行主函数
main()

```





### 3.6 运行结果：

```
解密后的明文: 我是xxx同学，学号为xxxxxxxx
```





## 4.实验总结

- 对于实现层面而言，难度并不大，只需要一步步分解，一步步实现，然后将每一步连起来就可以得到相应的加密和解密模块。
- 学会了Python中的加密库的使用，尤其是RSA和IDEA等，PGP运用了多种加密手段进行协同。
- 可以从框图流程中得知：PGP 通过加密和数字签名这两个关键技术，有效地防止了中间人攻击和数据篡改，并且网上资料显示，在电子通信中，使用PGP协议，即使在传输过程中杯攻击者截获，但是攻击者没有私钥，也无法解读邮件内容，然后也无法伪造发送方的数字签名。

<br>

