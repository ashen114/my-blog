---
title: cmd命令报错记录
description: 整合控制台的报错处理，方便检索
date: 2020-04-21 16:58:16
---

<!-- more -->


## github 相关

+ git clone 出错
   
  报如下错误

  ```
  error: RPC failed; curl 18 transfer closed with outstanding read data remaining
  fatal: the remote end hung up unexpectedly
  fatal: early EOF
  fatal: index-pack failed
  ```
  原因：
  因为curl的postBuffer的默认值太小，我们需要调整它的大小，在终端重新配置大小

  解决方案：
  把postBuffer的值配置成500M
  `git config --global http.postBuffer 524288000`

  若再次出现问题
  ```
  error: RPC failed; curl 56 OpenSSL SSL_read: Connection was reset, errno 10054
  fatal: the remote end hung up unexpectedly
  fatal: early EOF
  fatal: index-pack failed
  ```

  解决方案：

    让GIt忽略SSL证书错误的方法
    `git config --global http.sslVerify "false"`

    若需要查看命令是否成功添加到git中，可使用`git --list`


+ git mv

  场景：存在一个文件夹名为Apple，将其改为apple，然后使用git add .等一系列操作，发现git没有记录下文件夹的大小写的变化

  原因：由于window对大小写不敏感（Linux大小写敏感），git不对window下的文件名大小写变更生效

  解决方案：

    使用git mv命令：

    针对文件（若不生效，可以使用针对文件夹的方式）：
    1. git mv directoryToFolder/oldName.txt directoryToFolder/newname.txt
    
    针对文件夹：
    2. git mv directoryToFolder/oldName temp
    3. git mv temp directoryToFolder/newName

## npm 相关

- 安装依赖报错

  使用`npm i`安装依赖时，若出现错误
  
  解决方案：
  删除 node_modules，`npm cache clean --force`清除缓存，再尝试`npm i`