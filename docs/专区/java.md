# java入门



- 面向对象
- 分布式
- 健壮
- 安全
- 体系结构中立
- 可移植
- 解释型
- 多线程
- 动态

## java 专业术语



- **JDK（Java Development Kit）** ： 编写Java程序的程序员使用的软件
- **JRE（Java Runtime Environment）** ： 运行Java程序的用户使用的软件
- **Server JRE（Java SE Runtime Environment）** ： 服务端使用的Java运行环境
- **SDK（Software Development Kit）** ： 软件开发工具包，在Java中用于描述1998年-2006年之间的JDK
- **DAO（Data Access Object）** ： 数据访问接口，数据访问
- **MVC（Model View Controller）** ： 模型-视图-控制器的缩写



## 语法基础

### hello world

```java
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Weclome" + args[0]);
    }
}
```



run

```
java test1.java Alice
```



输出

```
Weclome Alice
```



![img](D:/docsify/docs/_media/662E827A-FA32-4464-B0BD-40087F429E98.jpg)





编码出错可以选择下面的设置utf-8进行编译



```
Java -encoding UTF-8 test1.java
```



### 标识符

- 所有的标识符都应该以字母（A-Z 或者 a-z）,美元符（$）、或者下划线（_）开始
- 关键字不能用作标识符
- 标识符是大小写敏感的
- 私下运行甚至可以选择使用中文作为标识符







![img](D:/docsify/docs/_media/ZSSDMld.png)



### 转义字符

```
"\b" (退格)
"\f" (换页)
"\n" (换行)
"\r" (回车)
"\t" (水平制表符(到下一个tab位置))
"\' " (单引号)
"\" " (双引号) 
"\\" (反斜杠)
```



### 数据类型

| type           | 范围                                                 | 字节 |
| -------------- | ---------------------------------------------------- | ---- |
| byte           | -128~127                                             | 1    |
| short          | -32768~32767                                         | 2    |
| int            | -2147483648~2147483647                               | 4    |
| long           | -9,223,372,036,854,775,808~9,223,372,036,854,775,807 | 8    |
| float          | 1.4E-45  ~  3.4028235E38                             | 4    |
| double         | 4.9E-324 ~  1.7976931348623157E308                   | 8    |
| boolean        | true or false      或者   1  or   0                  | 1    |
| char           | \u0000~\uffff     or     0~65535                     | 2    |
| 类、接口、数组 | -                                                    | -    |



基本上java里面的数据类型的未定义初始值都为0或者null或者\u0000



```java

public class PrimitiveTypeTest {  
    public static void main(String[] args) {  
        // byte  
        System.out.println("基本类型：byte 二进制位数：" + Byte.SIZE);  
        System.out.println("包装类：java.lang.Byte");  
        System.out.println("最小值：Byte.MIN_VALUE=" + Byte.MIN_VALUE);  
        System.out.println("最大值：Byte.MAX_VALUE=" + Byte.MAX_VALUE);  
        System.out.println();  
  
        // short  
        System.out.println("基本类型：short 二进制位数：" + Short.SIZE);  
        System.out.println("包装类：java.lang.Short");  
        System.out.println("最小值：Short.MIN_VALUE=" + Short.MIN_VALUE);  
        System.out.println("最大值：Short.MAX_VALUE=" + Short.MAX_VALUE);  
        System.out.println();  
  
        // int  
        System.out.println("基本类型：int 二进制位数：" + Integer.SIZE);  
        System.out.println("包装类：java.lang.Integer");  
        System.out.println("最小值：Integer.MIN_VALUE=" + Integer.MIN_VALUE);  
        System.out.println("最大值：Integer.MAX_VALUE=" + Integer.MAX_VALUE);  
        System.out.println();  
  
        // long  
        System.out.println("基本类型：long 二进制位数：" + Long.SIZE);  
        System.out.println("包装类：java.lang.Long");  
        System.out.println("最小值：Long.MIN_VALUE=" + Long.MIN_VALUE);  
        System.out.println("最大值：Long.MAX_VALUE=" + Long.MAX_VALUE);  
        System.out.println();  
  
        // float  
        System.out.println("基本类型：float 二进制位数：" + Float.SIZE);  
        System.out.println("包装类：java.lang.Float");  
        System.out.println("最小值：Float.MIN_VALUE=" + Float.MIN_VALUE);  
        System.out.println("最大值：Float.MAX_VALUE=" + Float.MAX_VALUE);  
        System.out.println();  
  
        // double  
        System.out.println("基本类型：double 二进制位数：" + Double.SIZE);  
        System.out.println("包装类：java.lang.Double");  
        System.out.println("最小值：Double.MIN_VALUE=" + Double.MIN_VALUE);  
        System.out.println("最大值：Double.MAX_VALUE=" + Double.MAX_VALUE);  
        System.out.println();  
  
        // char  
        System.out.println("基本类型：char 二进制位数：" + Character.SIZE);  
        System.out.println("包装类：java.lang.Character");  
        // 以数值形式而不是字符形式将Character.MIN_VALUE输出到控制台  
        System.out.println("最小值：Character.MIN_VALUE="  
                + (int) Character.MIN_VALUE);  
        // 以数值形式而不是字符形式将Character.MAX_VALUE输出到控制台  
        System.out.println("最大值：Character.MAX_VALUE="  
                + (int) Character.MAX_VALUE);  
    }  
}
```



run-ans:

```bash
基本类型：byte 二进制位数：8
包装类：java.lang.Byte
最小值：Byte.MIN_VALUE=-128
最大值：Byte.MAX_VALUE=127

基本类型：short 二进制位数：16
包装类：java.lang.Short
最小值：Short.MIN_VALUE=-32768
最大值：Short.MAX_VALUE=32767

基本类型：int 二进制位数：32
包装类：java.lang.Integer
最小值：Integer.MIN_VALUE=-2147483648
最大值：Integer.MAX_VALUE=2147483647

基本类型：long 二进制位数：64
包装类：java.lang.Long
最小值：Long.MIN_VALUE=-9223372036854775808
最大值：Long.MAX_VALUE=9223372036854775807

基本类型：float 二进制位数：32
包装类：java.lang.Float
最小值：Float.MIN_VALUE=1.4E-45
最大值：Float.MAX_VALUE=3.4028235E38

基本类型：double 二进制位数：64
包装类：java.lang.Double
最小值：Double.MIN_VALUE=4.9E-324
最大值：Double.MAX_VALUE=1.7976931348623157E308

基本类型：char 二进制位数：16
包装类：java.lang.Character
最小值：Character.MIN_VALUE=0
最大值：Character.MAX_VALUE=65535
```



### 自动类型转换优先级

```
低  ------------------------------------>  高

byte,short,char—> int —> long—> float —> double 
```



attention：

- 不能对boolean类型进行类型转换
- 不能把对象类型转为不相关类的对象
- 容量大转容量小的必须使用强制类型转换
- 转换过程中会导致溢出或者损失精度



java中使用long类型的数据后面要加上L！！，否则转换会报错

```java
long value = 9223372036854775807L;
```



### 注释



```java
// 单行注释

/*
多行注释
*/

/**
*规范注释说明文档
*
*
*/
```



### 常量

Java里面的常量定义使用final关键字进行修饰

```java
final double PI = 3.1415926;
```



字符串常量

```
"Hello World"
```



字符串常量和变量都可以包含任何Unicode字符





### 类和对象基本跟C++类似





