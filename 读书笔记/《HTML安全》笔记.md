---
title: 《HTML安全》笔记
description: 学习笔记
date: 2018-11
---

# 信息安全

## HTML5安全

### 新标签的XSS

### iframe的sandbox
- allow-same-origin：允许同源访问
- allow-top-navigation：允许访问顶层窗口
- allow-forms：允许提交表单
+ allow-scripts：允许执行脚本
  - 即使设置了allow-scripts，也是不允许的，比如“弹出窗口”

```html
<!--例子-->
<iframe sandbox="allow-same-origin allow-forms allow-scripts" src="http://www.a.com/a.html"></iframe>
```

### Link Types ：noreferrer
```html
<!--使用norferrer后，浏览器在请求该标签指定的地址时将不再发送Referer。-->
<a href="xxx" rel="noreferrer" >test</a>
```

### Canvas的妙用

把图片导入Canvas，并进行转换。通过判断

### 其他安全问题

+ Cross-Origin Resource Sharing：实现跨域请求
  - XMLHttpRequest请求
  - XDomainRequest（用于IE8）
+ Window.PostMessage（）方法可以安全地实现跨源通信。通常需同源才可以通信，但+Window.PostMessage（）方法提供了一种受控机制来规避此限制，只要正确的使用，这种方法就很安全。
  ```javascript
    otherWindow.PostMessage（message，targetOrigin，[transfer]）;
    
    otherWindow：其他窗口的引用，比如iframe的contentWindow属性，执行window.open返回的窗口对象，或是命名过数值索引的window.frames。
    
    message：将要发送到其他window的数据。
    
    targetOrigin：通过窗口的origin属性来指定哪些窗口能接收到消息事件，其值可以是字符串“*”（表示无限性）或者一个URI
    
    transfer：可选项，是一串和message同时传递的Transferable对象，这些对象的所有权将转移给消息接收方，而发送一方将不再保有所有权。
    
    示例：...postMessage("hello","http://www.a.com");
    
    
    document.domain：返回当前文档的域名，例：localhost或者www.a.com
  ```

+ WebStorage
  + 类型
     - Session Storage：关闭浏览器就会失效
     + Local Storage：一直存在
  + 设置、读取
     - 设置一个值：window.sessionStorage.setItem(key,value)
     - 读取一个值：window.sessionStorage.getItem(key)
     + webStorage也受到同源策略的约束，每个域所拥有的信息只会保存在自己的域下。
     + 与WebStorage相比，Cookie主要用于保存登陆凭证和少量信息，其最大长度的限制决定了不可能在Cookie中存储太多信息。于是W3C委员设计了WebStorage，能在客户端提供一个较为强大和方便的本地存储功能。



----

## XSS:跨站脚本攻击

xss攻击，通常指黑客通过“HTML注入”篡改了网页，插入了恶意的脚本，从而在用户浏览网页时，控制用户浏览器的一种攻击。
* 反射型XSS:简单地把用户输入的数据“反射”给浏览器。
* 存储型XSS:把用户输入的数据“存储”到服务器端。
* DOM Based XSS:特殊反射型XSS

常用闭合手法，如 ' onclick = alert(/XSS/) //
'用于闭合，//用于注释后面的

----

## Secure by default原则

> "Secure by default"原则，也可以归纳为白名单、黑名单思想。

### 白名单
* 如果网络只提供Web服务，那么正确的做法是只允许网站服务的80和443端口对外提供服务，屏蔽除此之外的其他端口。
* 在网站生产环境服务器上，应该限制随意安装软件，而需要制定统一的软件版本规范：根据业务需求，列出一个允许使用的软件以及软件版本的清单，在此清单外的软件则禁止。


### 黑名单
* 不允许SSH端口对外开放，那么审计SSH的默认端口：22端口是否开放Internet。

----

## ClickJacking-点击劫持

> 通过透明的frame覆盖在正常按键上面，欺骗点击

> 攻击者使用一个透明的、不可见的iframe，覆盖在一个网页上，然后诱导用户在该网页上进行操作，此时用户将在不知情下点击透明的iframe页面。

+ #### Flash点击劫持

  - 诱导点击打开摄像头
+ #### 图片覆盖攻击

  - 类似透明iframe，把iframe换成一个虚假带链接的img。图片还可以伪造成一个正常的链接、按钮或文字等等。。
+ #### 拖拽劫持与数据窃取

  - 网页小游戏，小海豹顶球。球为正常页面的iframe，但是被球隐藏了，小海豹头顶为textarea等可以窃取数据的接收方。
+ #### ClickJacking3.0 : 触屏劫持

  - ##### 作用于移动端
  + ##### 防御ClickJacking

    - frame busting:禁止iframe嵌套
    + X-Frame-Options:Http头
      - DENY:拒绝加载任何frame页面
      - SAMEORIGIN:frame同源域名下的页面
      - ALLOW-FROM:可以定义允许的frame加载的页面地址
      - Firefox的“Content Security”或者“NoScript扩展”等等...

  P3P头的副作用：如果网站返回给浏览器的HTTP头中包含有P3P头，则在某种程序上来说，将允许浏览器发送第三方Cookie。在IE即使是iframe或者script等标签也将不再拦截第三方Cookie的发送。

----

## CSRF-跨站点请求伪造

> 访问危害正常页面的其他页面中，存在危害正常页面的url

### 浏览器的Cookie策略

* Session Cookie：没有指定的Expire时间，浏览器关闭才失效。只要浏览器不关闭，可以在不同Tab页面共享。
* Third-party Cookie（本地Cookie）：有指定的Expire时间，只有到了Expire时间才会失效，保存在本地。浏览器会阻止Third-party Cookie在不同域之间的页面的发送。

> ```<img src="http://www.a.com/entry.do?m=delete&id=131" /> ```
> 浏览这个图片时，会对浏览器发送img的src里面的GET请求，从而达到删除idwei131的东西，而之所以能有权限删除，是因为用户成功登陆后，留下了Cookie。

### CSRF的防御

+ 验证码
+ Referer Check
  - 在互联网中最常见的应用就是“防止图片盗链”，也被用于检查请求是否来自合法的“源”
  - Referer：是http的header的一部分，当浏览器向web服务器发送请求的时候，一般会带上Referer，告诉服务器我是从哪个页面链接过来的。
+ Anti CSRF Token
  - 现在业界针对CSRF的防御，一致做法是使用一个Token。
+ CSRF的本质原因是重要操作的所有参数都是可以被攻击者猜测到的。
  - 使用Token，Token的生成一定要足够随机，需要使用安全的随机数生成器生成Token。
+ Token的使用原则
  - 如果用户已经提交了表单，则这个Token已经消耗掉，应该再次重新生成一个新的Token。
  - 考虑到如果一个用户打开多个相同的页面同时操作，当某个页面消耗掉Token后，其他页面的表单内保存的还是原本被消耗掉的那个Token
    - 可以考虑生成多个有效的Token，以解决多页面共存的场景，

----

## 注入攻击

#### SQL注入

+ 关键条件
  - 用户能够控制输入
  - 原本程序原本要执行的代码，拼接了用户输入的数据。
+ 例子：select * from 表  where 字段 = ‘  “+用户输入的数据+” ’ ;  
  - 如果用户输入  jack;drop table 表--  则 select * from 表  where 字段 = ‘  jack;drop table 表-- ’ ;
+ 在SQL注入中的过程中，如果网站的Web服务器开启了错误回显，则会为攻击者提供极大的便利。

----

#### 盲注（Blind Injection）

对于web服务器关闭了错误回显，可以通过盲注攻击。盲注：在服务器没有错误回显时完成的注入攻击。构造简单的条件语句，根据返回页面是否发生变化，来判断SQL语句是否得到执行。

##### 例子：

	http://www.a.com/index.php?id=1 相当于执行了SQL语句：select title,description,body from items where id =2
	
	若：http://www.a.com/index.php?id=1 and 1=2相当于执行了SQL语句：select title,description,body from items where id =2 and 1=2
	因为“and 1=2”为伪命题，所以这条“and”条件语句永远无法成立。对于web应用来说，也不会有结果返回给用户，只能看到结果为空或者一个错误页面。
	为了进一步确认注入是否存在，再次验证。因为一些处理逻辑或安全功能，在异常请求时会导致页面返回不正常。
	
	继续构造：http://www.a.com/index.php?id=1 and 1=1
	因为“and 1=1”为真命题，如果页面正常返回，则说明SQL语句的“and”成功执行，那么可以判断“id”参数存在SQL注入漏洞。

----

#### Timing Attack

+ MYSQL函数：BENCHMARK( count，expr )
  - 用于测试函数性能
  - 函数的执行结果是将表达式expr执行count次。
  - 利用BENCHMARK()函数，可以让同一个函数执行若干次，使得结果返回的时间比平时要长；通过时间长短的变化，可以判断出注入语句是否执行成功。这是一种边信道攻击，这个技巧在盲注中被称为Timing Attack。

----

### 数据库攻击技巧

#### 常用的攻击技巧

  + 猜解数据库对应版本
    - http://www.a.com/news.php?id=5 and substring(@@version,1,1) = 4
  +  利用union select分别确认表面admin是否存在，列名passwd是否存在
    - id=5 union all select 1,2,3 from admin 
    - id=5 union all select 1,2,passwd from admin
  + 进一步，想要猜出username和password具体的值，可以通过判断字符范围
    - id=5 and ascii(substring(select concat(username,0x3a,passwd) from users limit 0,1),1,1) >64 
    - id=5 and ascii(substring(select concat(username,0x3a,passwd) from users limit 0,1),1,1) >96
    - id=5 and ascii(substring(select concat(username,0x3a,passwd) from users limit 0,1),1,1) >100
    - id=5 and ascii(substring(select concat(username,0x3a,passwd) from users limit 0,1),2,1) >64 
    - ......
        + ascii()>64
          - 在ASCII码对照表中，十进制的65~90 对应字符 A~Z，十进制的97~122 对应字符 a~z
        + substring("hello"，1，2)
          - 返回hello的第1至第2位：he
        + substring("hello"，2，1)
          - 返回hello的第1位至第二位，但截取第1位，则返回：e
        + concat(a,b,c)
          - 合并字符，结果为：abc
        + 0x3a
          - 在ASCII码对照表中，十进制的58对应的十六进制是0x3a，其对应的字符是：“:”（冒号）
        + limit(0，1)
          - 0是偏移量，1是返回记录行的最大数目。所以检索的记录行是：从0到0+1
  + 注入过程中，常常会用到一些读写文件的技巧
    + 如果当前数据库用户拥有系统相应文件或目录的权限，则在mysql中，可以通过LOAD_FILE()读取系统文件，并通过INTO DUMPFILE写入本地文件。
      - ... union select 1,1,LOAD_FILE('/etc/passwd'),1,1;
    + 如果当前数据库用户拥有创建表的权限，则可以通过LOAD_FILE()将系统文件读出，再通过INTO DUMPFILE将该文件写入系统中，然后通过LOAD DATA INFILE将文件导入创建的表中，最后就可以通过一般的注入技巧直接操作表数据了。 
      - HEX（）函数：返回十六进制值的字符串表示形式。注意：并不是十进制转化为十六进制数，而是转化为字符串。。。
      - CREATE TABLE 表名(...);
     UNION SELECT 1,1HEX(LOAD_FILE('/ect/表名')),1,1 INTO DUMPFILE '/tmp/表名'；
     LOAD DATA INFILE '/tmp/表名'  INTO TABLE 表名;
    + 写入文件的技巧，经常被用于导出一个webshell，为攻击者的进一步攻击做铺垫。 
  + 因此，在数据库安全方案设计时，可以禁止普通数据库用户具备操作文件的权限。

#### 命令执行

  - 利用”用户自定义函数“技巧，即UDF(User-Defined Functions)来执行命令。
  + 一般来说，在数据库中执行系统命令，要求具有较高的权限。
    - 在数据库加固时，可以参阅官方文档给出的安全指导文档。
    - 在建立数据库账号时，应遵循”最小权限原则“，尽量避免给Web应用使用数据库的管理员权限。

#### 攻击存储过程

+ 除了存储过程直接攻击外，存储过程本身也可能会存在注入漏洞。

#### 编码问题

+ 要解决编码问题，需要统一数据库、操作系统、Web应用所使用的字符集，以避免各层对字符的理解存在差异。
  - 统一设置为UTF-8是一个很好的方法。
+ 基于字符集的攻击并不局限于SQL注入，凡是会解析数据的地方都可能存在此问题。
  - 解决方法就是在HTML页面的<code><meta></code>标签中指定当前页面的charset。
+ 如果因为种种原因无法统一字符编码，则需要单独实现一个用于过滤或转义的安全函数。
  - 根据系统所使用的不同字符集来限制用户输入数据的字符允许范围，以实现安全过滤。

#### SQL Column Truncation

+ 在MySQL的配置中，若sql_mode选项设置为default，即没有开启STRICT_ALL_TABLES选项时，MySQL对于用户插入的超长值只会提示warning，而不是error。(如果是error则插入不成功)
  + 开启strict模式，在strict模式下，输入的字符超出长度限制，数据库返回一个error信息，同时插入不超过。
  + 关闭strict模式，数据库只返回warning信息，但数据插入成功。

```
  insert into 表（'username','password'）values('admin                                                   x','123456');

  // 注册一个用户名为“admin（55个空格）x”的用户，就可以修改原管理员密码了。
```

#### 正确地防御SQL注入

+ 条件
  - 找到所有SQL注入漏洞
  - 修补这些漏洞
+ 只对用户输入做一些escape处理还不够。处理包括“空格”、“括号”在内的一些特殊字符，以及一些SQL保留字，比如SELECT、INSERT等也不够。
  - 使用预编译语句
  - 防御SQL注入的最佳方式，就是使用预编译语句，绑定变量。
  - 使用预编译的SQL语句，SQL语句的语义不会发生改变。在SQL语句中，变量用？表示，攻击者无法改变SQL的结构。
  - php绑定变量示例：

```php
  $query = "INSERT INTO 表(Name,Age,Sex) VALUES(?,?,?)";
  $stmt = $mysqli -> prepare($query);
  $stmt->bind_param("sis",$val1,$val2,$val3);
  $val1 = 'jack';
  $val2 = '12';
  $val3 = 'boy';
  $stmt->execute();
```
  +  对于bind_param()的“sis”：
  		- i /- integer（整型）
        - d /- double（双精度浮点型）
        - s /- string  （字符串）
        - b /- BLOB  （布尔型）
