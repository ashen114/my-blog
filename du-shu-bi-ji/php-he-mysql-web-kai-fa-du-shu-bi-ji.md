---
title: 《PHP和Mysql Web开发》读书笔记
description: 学习笔记
date: '2018-09-12T10:21:41.000Z'
---

# PHP 和 Mysql Web 开发

## 第一篇: 使用 PHP

### 第 1 章: PHP 快速入门

...

## 第四篇: PHP 高级技术

### 第 20 章

#### 20.1: 了解可供使用的协议

* 不同的计算机协议适用于不同的情况和应用程序
  * HTTP: 超文本传输协议
  * FTP: 文件传输协议

#### 20.2: 发送和读取电子邮件

* SMTP 只能用来发送邮件
* IMAP4 和 POP3 可以用来读取特定邮件服务器上的邮件，这些协议不能发送邮件
  * IMAP4 用于读取和操作存储在服务器上的邮件
  * POP3 适用于将邮件下载到客户端，并从服务器上删除他们

#### 20.3: 使用其他 Web 站点的数据

代码: `lookup.php`

以下思路和`lookup.php`不太一致。

1. 获取 url，保存在$url 中
2. 可以通过`file_get_contents( $url )`获取 url 中网页的全部内容，可以通过 if 进行错误判断`if(!($contens = file_get_contents( $url )){ echo "无法打开url"; }`
3. 此时可以通过`echo $contents`，查看网页内容。
4. 为了获取到真正有用，想要的数据，可以先对`$contents`数组，进行分割，然后就把想要的数据存在$a 数组的某段中，可以通过 foreach 循环输出，找出需要的数据在哪个位置。如下例子:

```php
$a  = explode('div',$contents); //以 div 为分割线，分割$contents,结果赋给$a 数组
foreach ($a as $key => $value){
    echo "<br/>key: ".$key.";value: ".$value."<br />";
}  //此时可以通过$a[i]来访问其内容 - 5.如果$a[i] 的内容还不够纯粹，还有不需要的片段，可以继续使用explode()继续分割。
```

例如:

```php
$b = explode("t\">",$a[30]);
echo $b[1];
```

#### 20.4. 使用网络查找函数

代码: directory\_submit.php

1. 获取 URL，并作为 `parse(\$url)`的参数。

`parse(\$url )`可获取 url 中“模式”、“用户”等等信息

例子 url: [http://nobody:secret@example.com:80/script.php?variable](http://nobody:secret@example.com:80/script.php?variable) = value\#anchor

* scheme（模式）:http
* user（用户）: nobody
* pass（传递）: secret
* host（主机）: example.com
* port（端口）: 80
* path（路径）: /script.php
* query（查询）: variable = value
* fragment（代码段）: anchor
* 以从 url 中获取的 host 作为`gethostbyname($host)`的参数，判断是否存在可用 ip
* 作用相当于 win 的 ping
* 可以用`gethostbuaddr( )` 代替 `gethostbyname( )`，`gethostbuaddr( )` 以 IP 作为参数，返回主机名。
* 以@作为`explode( )`的分隔符，分割邮箱地址，获取邮箱的 host 部分。把分割出来的 host 部分作为`dns_get_mx($emailhost,$mxhostsarr)`的参数，检查 dns 服务器上是否存在可以解析的 MX 记录，有则把结果以数组的形式赋给$mxhostsarr。可用`foreach( $mxhostsarr as $mx ){ echo $mx;}`遍历输出。
* 可以用`checkdnsrr( )`代替`dns_get_mx( )`,不过只返回 true 或 false。

#### 20.5: 备份或镜像一个文件

**20.5.1: 使用 FTP 备份或镜像一个文件**

代码: ftp\_mirror.php

1. 连接远程 FTP 服务器

* 使用ftp\_connent\($host\)连接ftp服务器，可以把结果存在$conn中。可以判断if\(!$conn\){exit;}
* $host（即将连接的FTP服务器的名称，ftp的地址）
  * 以$host（即将连接的FTP服务器的名称，ftp的地址）、、$remotefile（将要下载的远程ftp服务器上的文件，包含路径和文件名）

1. 登陆到 FTP 服务器
2. 使用`ftp_login( $conn,$user,$pass )`登陆 ftp 服务器,把结果存放在$result，可以判断`if( !$result ){ ftp_quit($conn );}`

* ftp\_quit\($conn\): 关闭ftp连接
* $user（登陆的用户名）
* $password（用户的密码）

1. 检查文件更新时间

```text
1.可以先判断本地是否已经存在了文件（用file_exists($localfile )判断），
```

* 存在则$localtime = filemtime\( $localfile \)获取本地文件的最近一次修改的时间； 2.不存在则把本地文件的时间修改为 0，即$localtime = 0（赋予本地文件的初始时间为 0，对于时间戳而言，时间越接近未来，时间戳越大，时间越接近过去，则时间戳越小，此时初始时间戳为 0，则是最古老的时间，则可以保证远程文件的修改时间是最新的，由于是最新的，所以就可以覆盖本地文件。）
  * filemtime\( $localfile \): 获取文件最近一次文件修改的时间
  * $localfile（本地的文件，包含路径和文件名）
* 接着获取远程文件的时间戳，例如: $remotetime = ftp\_mdtm\( $conn,$remotefile \)。
* 接着判断获取到的远程文件的时间戳是否小于 0，若小，则可能是存在某种错误或者远程文件的服务器不支持这种特性。此时可以手动把远程文件的时间戳改为本地文件的时间戳+1，这样子就能保证远程文件的时间戳比本地的时间戳要大，即表示远程文件的比本地文件新。
* 接着判断本地文件的时间戳和远程文件的时间戳，若本地文件比较新，则直接退出即可，因为不需要远程文件的旧版本。例如:

  ```php
  $remotetime = ftp_mdtm($conn,$remotefile);
      if(!($remotetime > 0)){
  echo "Can\'t access remote file time.<br />";
  $remotetime = $localtime + 1;//使远程文件的时间比本地文件的大，即使远程的文件比较新。
  }else{
  echo "Remote file last updated: ";
  echo date('G:i j-M-Y',\$remotetime)."<br />";
  }

  if(!($remotetime > $localtime)){
      echo "Local copy is up to date.<br />";
      //exit;
  }
  ```

* 下载文件
  * 通过文件时间戳后，若远程文件比较新，则开始下载。使用 fopen\( $localhost,'w'\) ，打开本地文件，给予“写”的权限，然后把结果赋给$fp，即 $fp = fopen\( $localfile,'w' \);然后把远程文件通过二进制的形式写入本地文件中，可以判断该操作是否成功，以给予相应提示。例如:

    ```php
    if( !$success = ftp_fget( $conn,$fp,$remotefile,FTP_BINARY )){
    echo "写入失败，即是下载失败";
    fclose( $fp );     //既然失败，那可以关闭本地文件了
      ftp_quit( $conn ); //既然失败，那也可以关闭 ftp 连接了
    exit;
    }
    ```

    ftp\_fget（）在 ftp 正在连接下，即$conn正常下，把$remotefile 通过二进制的方式（FTP\_BINARY，如果是文本文件，可以用 ASCII 的方式，这里的例子是压缩文件包，所以用 BINARY），写入到$fp 中，
* 关闭 FTP 连接
  * 无论结果如何，程序结束了，是时候关闭一切了。例如:

    ```php
    fclose( $fp );
    ftp_quit( $conn );
    ```

**20.5.2: 上传文件**

```php
  int ftp_put( int ftp_connetion,string remotefile_path,int fp,int model);
```

**20.5.3: 避免超时**

```php
  set_time_limit(90); //设置最大执行时间为 90 秒
```

**20.5.4: 使用其他的 FTP 函数**

* int ftp\_size\( int ftp\_connection,string remotefile\_path \);
  * 返回远程文件的字节数或者-1（出错的情况下）。该函数不是所有服务器都支持。
  * 使用用途可以用来计算特定传输速率一次文件传输所需最大可执行时间。知道文件大小和传输连接速度，可以估算出传输需要的时间，并以此来设置 set\_time\_limit\( \)。
* $listing = ftp\_nlist\( $conn,dirname\( $remotefile \)\)
  * dirname\( $remotefile\)
    * dirname\( \)可以获取文件的路径，去掉文件的名称。例如: 若$remotefile = 'c:/testweb/home.php';则dirname\( $remotefile \)返回 ‘c:/testweb’
  * ftp\_nlist\( $conn,file\_dirpath \)
    * 通过链接和目录路径作为参数，获取该目录下的文件名列表，结果为存放文件名的数组
  * 可以通过 foreach 循环$listing 来输出该目录下的文件名
    * foreach\( $listing as $filename\)

echo $filename;

### 第 21 章: 日期和时间的管理

#### 21.1: 在 PHP 中获取日期和时间

**21.1.1: 使用 date\( \)函数**

例如: echo date\(' jS F Y'\)

* j: 月份中的日期: 0~31
* S: 序号，日期后缀，以两个字符表示，例如: ”st“、”nd“、”rd“或者”th“，取决于日期数字后面的数字是什么
  * 第 1: first
  * 第 2: second
  * 第 3: third
  * 第 4: fourth
  * 第 5: fifth
  * 第 6: sixth
  * 第 7: seventh
  * 第 8: eighth
  * 第 9: ninth
  * 第 10: tenth
  * 第 11: eleventh
  * 第 12: twelfth
  * 第 13: thirteenth
  * 第 14: fourteenth
  * 第 15: fifteenth
* F: 年中的月份，全写，从”January“到”December“
  * 一月: January
  * 二月: February
  * 三月: March
  * 四月: April
  * 五月: May
  * 六月: July
  * 七月: July
  * 八月: August
  * 九月: September
  * 十月: October
  * 十一月: November
  * 十二月: December

**21.1.2: 使用 UNIX 时间戳**

* 32 位的整数，从 1970.1.1 到当前时刻的秒数。超过 2038 年可能有问题。
* 使用 mktime\( \)函数可以把时间转换位 UNIX 时间戳
  * int mktime\(时，分，秒，日，月，年，int is\_dst\)
    * is\_dst: 是否为夏令时，不是为 1，是为 0，不知道则-1，-1 则按照系统的时间来确认是否是夏令时，默认-1。值得注意的是: 该参数在 PHP 5.1.0 中被废弃。取而代之使用的是新的时区处理特性。
  * $timestamp 获取时间戳的三种方法
    1. $timestamp = mktime\( \);
    2. 不带参数，则获取当前时刻的时间戳
    3. $timestamp = time\( \);
    4. 不带参数，则获取当前时刻的时间戳
    5. $timestamp = date\( "U" \);
    6. 获取当前时刻的时间戳

**21.1.3: 使用 getdate\( \)函数**

```php
$today = getdate( );
print_r( \$today );
```

> getdate 可以把时间戳作为参数，如果把时间戳作为参数则会以数组的形式输出时间戳对应的时间信息。如果 getdate\( \)不带参数时把当前时间以数组形式返回。输出如下:

```php
  Array
  (
  [seconds] => 44
  [minutes] => 36
  [hours] => 20
  [mday] => 12
  [wday] => 3
  [mon] => 9
  [year] => 2018
  [yday] => 254
  [weekday] => Wednesday
  [month] => September
  [0] => 1536755804
  )
```

0: 表示时间戳

**21.1.14: 使用 checkdate\( \) 函数检验日期有效性**

* 可以判断闰年和平年关于 2 月 29 日的问题
  * true: checkdate\( 2,29,2008 \);
    * 年份是整百数时，必须是 400 的倍数才是闰年；不是 400 的倍数的世纪年，即使是 4 的倍数也不是闰年。
      * 这就是通常所说的: 四年一闰，百年不闰，四百年再闰。 例如，2000 年是闰年，2100 年则是平年。
  * false: checkdate\( 2,29,2007 \)

**21.1.15: 格式化时间戳**

* strftime\( \)格式化本地系统的时间戳
  * echo strftime\( '%A'\);
    * 输出 Friday
  * echo strftime\( '%x'\);
    * 输出 09/12/18
  * echo strftime\( '%c'\);
    * 输出 09/12/18 21:18:55
  * echo strftime\( '%Y'\);
    * 输出 2018

#### 21.2: 在 PHP 日期格式和 MySQL 日期格式之间转换

* MySQL 的日期和时间是以 ISO8601 来处理的
  * 格式: YYYY-MM-DD

例如: 2018-09-12

* 日期4位，月份、日期带前导0

#### 21.3: 在 PHP 中计算日期

* floor\( time\( \)/\(365_24_60\*60\) ）= 48
  * 当前时间戳/365_24_60\*60 = 1970 距离今年的时间
    * 365_24_60\*60 = 365 天的秒数
* 可以用两个时间点的时间戳相减来获取两点时间的距离，再除以一年的秒数既可获取具体的年份距离。

#### 21.4: 在 MySQL 中计算日期

* 可以使用 datadiff\( \)、date\_add\( \)、date\_sub\( \)、date\_diff\( \)函数
  * 例如:

mysqli\_query\($db,"select datediff\( now\(\),'bdayISO' \)"\)

* now\( \)可以获取当前时间的时间戳
* bdayISO 则是自定义的某时间的时间戳
* data\_datadiff\( \)把两个参数相减

#### 21.5: 使用微秒

* microtime\( \)可以获取微秒
  * 返回类似这样子的数字: 0.50451000 1536759631
    * 前者应该是当前时间的微秒，后者是 1970 年以来的所有秒数，不是微秒。

#### 21.6: 使用日历函数

_XMind: ZEN - Trial Version_

--- _待更新：2018-09-12_ ---

