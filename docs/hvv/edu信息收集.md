# edu信息收集

参考资料：

[手把手教学 edu src 漏洞挖掘（非常详细）零基础入门到精通，收藏这一篇就够了_edusrc-CSDN博客](https://blog.csdn.net/Javachichi/article/details/140313655)

[edusrc挖掘技巧汇总+信息收集各种姿势 - 先知社区](https://xz.aliyun.com/t/15285?time__1311=GqjxnD0D2DuQGQD%2FirPBKISOYqKxY5i3Px)



## 域名信息泄露

直接上工具：

- [**FOFA**]( https://fofa.info/)
- [**Shodan**](https://www.shodan.io)
- [**Zoomeye**](https://www.zoomeye.org/)
- [**Hunter**](https://hunter.qianxin.com/)
- [**360Quake**](https://quake.360.net)

- [**intelligence**](https://intelx.io/)

都是挺好用的，避免使用自己的ip进行第一波攻击





## 邮箱信息泄露

[Find email addresses and send cold emails • Hunter](https://hunter.io/)



拿着学校的邮箱在一些网站上搜索，可以发现一些子域名下的邮箱，比如老师或者学生的，在邮箱里面找到学号或者工号





## github信息泄露

手工搜集：

```
in:name baidu               #标题搜索含有关键字baidu
in:descripton baidu         #仓库描述搜索含有关键字
in:readme baidu             #Readme文件搜素含有关键字
stars:>3000 baidu           #stars数量大于3000的搜索关键字
stars:1000..3000 baidu      #stars数量大于1000小于3000的搜索关键字
forks:>1000 baidu           #forks数量大于1000的搜索关键字
forks:1000..3000 baidu      #forks数量大于1000小于3000的搜索关键字
size:>=5000 baidu           #指定仓库大于5000k(5M)的搜索关键字
pushed:>2019-02-12 baidu    #发布时间大于2019-02-12的搜索关键字
created:>2019-02-12 baidu   #创建时间大于2019-02-12的搜索关键字
user:name                   #用户名搜素
license:apache-2.0 baidu    #明确仓库的 LICENSE 搜索关键字
language:java baidu         #在java语言的代码中搜索关键字
user:baidu in:name baidu    #组合搜索,用户名baidu的标题含有baidu的
```



比较常用的就是readme和标题、仓库搜索

搜索相关域名，或者学校名的缩写等，查找高危的账号姓名



自动搜集：

GitDorker 是一款github自动信息收集工具，它利用 GitHub 搜索 API 和作者从各种来源编译的大量 GitHub dorks 列表，以提供给定搜索查询的 github 上存储的敏感信息的概述。

https://github.com/obheda12/GitDorker







## Google信息泄露

```
1.site:域名 intext:管理|后 台|登陆|用户名|密码|验证码|系统|帐号|manage|admin|login|system

2.site:域名 inurl:login|admin|manage|manager|admin_login|login_admin|system

3.site:域名 intext:"手册"

4.site:域名 intext:"忘记密码"

5.site:域名 intext:"工号"

6.site:域名 intext:"优秀员工"

7.site:域名 intext:"身份证号码"

8.site:域名 intext:"手机号"
```



这样子可以进行某些搜索，有时候会给你个惊喜

重点查找学号密码

运维手册等等





一个更加好的自动生成的工具：

[Hacker Dork Generator](https://iamunixtz.github.io/LazyDork/)





## 备案号泄露

企查查和小蓝本

爬虫工具进行付费查询

[wgpsec/ENScan_GO: 一款基于各大企业信息API的工具，解决在遇到的各种针对国内企业信息收集难题。一键收集控股公司ICP备案、APP、小程序、微信公众号等信息聚合导出。](https://github.com/wgpsec/ENScan_GO)

上面是最新版



这个是python老版本：[wgpsec/ENScan: 基于各大API的一款企业信息查询工具，为了更快速的获取企业的信息，省去收集的麻烦过程，web端于plat平台上线](https://github.com/wgpsec/ENScan)

```bash
python ENScan.py -k keyword.txt
//keyword.txt里面填企业名称
```



## edusrc

关注一下这个学校的网站是什么公司开发的，然后看这个公司有没有爆出最新的day和漏洞，然后趁它没有更新的时候进行打



https://src.sjtu.edu.cn/    重点关注教育漏洞报告平台





## 逻辑漏洞







弱口令



登录验证绕过

爆破账户

明文存储密码

忘记密码重置密码绕过