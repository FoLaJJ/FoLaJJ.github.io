# 端口存活检测

```python
import socket
import threading
import time

def scan_port(target_ip, port):
    try:
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(1)
        result = sock.connect_ex((target_ip, port))
        if result == 0:
            print(f'端口 {port} 开放')
        sock.close()
    except:
        pass

def port_scanner():
    target = input('请输入目标IP地址: ')
    start_port = int(input('请输入起始端口号: '))
    end_port = int(input('请输入结束端口号: '))

    print(f'开始扫描目标: {target}')
    old_time = time.time()

    threads = []

    for port in range(start_port, end_port + 1):
        thread = threading.Thread(target=scan_port, args=(target, port))
        threads.append(thread)
        thread.start()

    for thread in threads:
        thread.join()
    new_time = time.time()
    print(f'所消耗的时间: {(new_time - old_time):.2f}s')

if __name__ == '__main__':
    port_scanner()
```



## 思考流程：

1. 连接一个端口是否存活的方法socket
2. 扫描端口提前准备ip，然后遍历给定端口范围
3. 多线程编程，每个线程扫描之后再将线程回收



```python
# 扫描一个端口
def scan_port(target_ip,port):
    try:
        sock = socket.socket(socket.AF_INET,socket.SOCK_STREAM)		# 创建套接字
        sock.settimeout(1)											# 设置超时时间
        result = sock.connect_ex((arget_ip,port))					# 尝试连接，并获取状态码
        if result == 0:
            print(f'{ip}')
        sock.close()
    except:
        pass
```





```python
# 扫描系列端口
def port_scanner():
    target = "192.168.10.1"
    threads = []												
    for port in range(0, 65535):
        thread = threading.Thread(target=scan_port, args=(target, port))		# 创建一个扫描线程
        threads.append(thread)													# 子线程载入threads中记录
        thread.start()															# 子线程开始
    for thread in threads:
        thread.join()

```



```python
# 需要导入的包
import threading
import socket

# 可能需要扫描计时
import time
```



## 可以学习的库函数使用：

### threading

```python
# 导入包
import threading

# 创建线程
thread = threading.Thread(target=函数名,args=(所需要的参数，用逗号隔开))

# 启动线程
thread.start()

# 等待线程完成
thread.join()

# 进程加锁，然后lock判断的地方可以放在调用的函数里面
lock = threading.Lock()

# 守护线程是在后台运行的线程，但是主线程退出，守护线程也会退出
daemon_thread = threading.Thread(target=函数名, daemon=True,args=(所需要的参数，如果没有可以不写args))

# 剩余如防止死锁、线程间通信、线程池等此处不表
```







# 目录爆破

```python
import requests
import time
from urllib.parse import urljoin

def create_dict():
    try:
        with open('dir_dict.txt', 'r') as f:
            directories = [line.strip() for line in f.readlines()]
    except FileNotFoundError:
        print("未找到字典文件")
        exit(-1)
    full_dict = []
    for directory in directories:
        if directory:  # 忽略空行
            full_dict.append(directory)
            full_dict.append(directory + '/')
            full_dict.append(directory + '.php')
            full_dict.append(directory + '.html')
    return full_dict

def dir_scan(url):
    url = 'http://' + url
    directories = create_dict()
    found_dirs = []

    print(f"\n开始扫描网站: {url}")
    print("=" * 50)

    for directory in directories:
        full_url = urljoin(url, directory)
        try:
            response = requests.get(full_url, timeout=3)
            print(f"[+] 正在扫描url:{full_url}")
            if response.status_code == 200:
                print(f"[+] 发现目录: {full_url}")
                found_dirs.append(full_url)
            time.sleep(0.1)  # 添加延时，避免请求过快

        except requests.exceptions.RequestException:
            continue
    return found_dirs


def main():
    target = input("请输入要扫描的网站域名 or IP地址: ")
    try:
        founds = dir_scan(target)
        print("\n扫描完成!")
        print(f"共发现 {len(founds)} 个可访问的目录")
        for found in founds:
            print(f"{found}")
    except Exception as e:
        print(f"\n扫描过程中出现错误: {str(e)}")

if __name__ == "__main__":
    main()
```





## 思考流程：



## 可以学习的库函数使用：
