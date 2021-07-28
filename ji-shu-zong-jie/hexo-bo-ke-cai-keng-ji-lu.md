---
title: Hexo博客踩坑记录
description: 学习笔记
date: '2020-02-25T16:44:02.000Z'
---

# Hexo博客踩坑记录

## 踩坑记录

1. hexo g 报错

   报错如下：

   ```text
    Error: expected end of comment, got end of file
    at Object._prettifyError (...@3.2.1@nunjucks\src\lib.js:36:11)
   ```

   原因： 由于md文档需要转换为html文件，其文档中不允许出来类似{\#\#}的语法

   解决方案： 避免md文档中出现{\#\#}类似的语法

## 开启评论及阅读

在 themes\next\_config.yml 中修改如下

```text
valine:
  enable: true
  appid: YourID # Your leancloud application appid
  appkey: YourKEY # Your leancloud application appkey
  notify: true # Mail notifier
  verify: true # Verification code
  placeholder: 欢迎留言... # Comment box placeholder
  avatar: identicon # Gravatar style
  guest_info: nick,mail,link # Custom comment header
  pageSize: 10 # Pagination size
  language: # Language, available values: en, zh-cn
  visitor: true #true # Article reading statistic
  comment_count: true # If false, comment count will only be displayed in post page, not in home page
  recordIP: true # Whether to record the commenter IP
  serverURLs: # When the custom domain name is enabled, fill it in here (it will be detected automatically by default, no need to fill in)
  #post_meta_order: 0
```

其中 YourID 及 YourKEY 为 leancloud 中'评论量'的 id 及 key

## 将每篇文章的下方的标签的\#改为图标

在 themes\next\_config.yml 中修改属性

```text
tag_icon: true
```

## 为文章新增阅读时长及文章字数统计

先安装插件 `npm install hexo-symbols-count-time --save`

在 themes\next\_config.yml 中新增或者修改如下

```text
symbols_count_time:
  separated_meta: true # 是否另起一行（true的话不和发表时间等同一行）
  item_text_post: true # 首页文章统计数量前是否显示文字描述（本文字数、阅读时长）
  item_text_total: false # 页面底部统计数量前是否显示文字描述（站点总字数、站点阅读时长）
  awl: 4 # Average Word Length
  wpm: 275 # Words Per Minute（每分钟阅读词数）
  suffix: mins.
```

在\_config.yml 中新增

```text
symbols_count_time:
  symbols: true # 文章字数统计
  time: true # 文章阅读时长
  total_symbols: true # 站点总字数统计
  total_time: true # 站点总阅读时长
  exclude_codeblock: false # 排除代码字数统计
```

## 更换 next 默认头像

在 themes\next\_config.yml 的 avatar 中修改 url 属性，例如：

```text
avatar:
  url: /images/ashen_head.jpg
```

## 新建热度排行榜

教程：[https://blog.qust.cc/archives/48665.html](https://blog.qust.cc/archives/48665.html)

BUG 修改：[https://www.dazhuanlan.com/2019/08/17/5d576bec311dc/](https://www.dazhuanlan.com/2019/08/17/5d576bec311dc/)

代码纠正

```javascript
var query = new AV.Query("Counter");
if (request.object.updatedKeys.indexOf("time") !== -1) {
  return query.get(request.object.id).then(function(obj) {
    if (obj.get("time") > request.object.get("time")) {
      throw new AV.Cloud.Error("Invalid update!");
    }
    return request.object.save();
  });
}
```

## 添加 Github 丝带或者角标&添加 RSS 订阅&添加动态背景&文章结尾添加结束标记&主页文章添加阴影效果

教程：[https://blog.csdn.net/Z_Z\_W_/article/details/97617436](https://blog.csdn.net/Z_Z_W_/article/details/97617436)

### 添加动态背景无效解决方案

链接：[https://www.jianshu.com/p/b9556119ee8a](https://www.jianshu.com/p/b9556119ee8a)

`cd themes/next` `git clone https://github.com/theme-next/theme-next-canvas-nest source/lib/canvas-nest`

### 主页文章添加阴影效果解决方案-四楼

链接：[https://tieba.baidu.com/p/6365333284?traceid=](https://tieba.baidu.com/p/6365333284?traceid=)

## 添加搜索功能&添加相关文章功能

教程：[http://bamshoot.coding.me/posts/84fe2c24.html](http://bamshoot.coding.me/posts/84fe2c24.html)

## SEO 优化&文章持久化

设置收录时，若为 next 主题，则直接在`themes\next\_config.yml`中对应的`google_site_verification`及`baidu_site_verification`中添加对应的 content 即可

（手动推送）教程参考：[http://dugblog.coding.me/Hexo/20180625-Hexo-SEO.html](http://dugblog.coding.me/Hexo/20180625-Hexo-SEO.html)

文章持久化-算法参考：[http://bamshoot.coding.me/posts/84fe2c24.html](http://bamshoot.coding.me/posts/84fe2c24.html)

## 添加顶部加载条&文章加密访问&修改字体大小

教程：[https://www.jianshu.com/p/f054333ac9e6](https://www.jianshu.com/p/f054333ac9e6)

## 为博客加上萌萌的宠物

教程：[https://blog.csdn.net/mqdxiaoxiao/article/details/93793530](https://blog.csdn.net/mqdxiaoxiao/article/details/93793530)

## 百度统计

教程：[https://blog.csdn.net/loze/article/details/94212661](https://blog.csdn.net/loze/article/details/94212661)

## 在底部增加运行时间

在 themes\next\layout\_partials\footer.swig 中新增

```javascript
<!-- 在网页底部添加网站运行时间 -->
<div>
<span id="timeDate">载入天数...</span><span id="times">载入时分秒...</span>
</div>
<script>
    var now = new Date();
    function createtime() {
        var grt= new Date("07/21/2018 00:00:00");//此处修改你的建站时间或者网站上线时间
        now.setTime(now.getTime()+250);
        days = (now - grt ) / 1000 / 60 / 60 / 24; dnum = Math.floor(days);
        hours = (now - grt ) / 1000 / 60 / 60 - (24 * dnum); hnum = Math.floor(hours);
        if(String(hnum).length ==1 ){hnum = "0" + hnum;} minutes = (now - grt ) / 1000 /60 - (24 * 60 * dnum) - (60 * hnum);
        mnum = Math.floor(minutes); if(String(mnum).length ==1 ){mnum = "0" + mnum;}
        seconds = (now - grt ) / 1000 - (24 * 60 * 60 * dnum) - (60 * 60 * hnum) - (60 * mnum);
        snum = Math.round(seconds); if(String(snum).length ==1 ){snum = "0" + snum;}
        document.getElementById("timeDate").innerHTML = "Run for "+dnum+" Days ";
        document.getElementById("times").innerHTML = hnum + " Hours " + mnum + " m " + snum + " s";
    }
setInterval("createtime()",250);
</script>
```

参考链接:[https://www.jianshu.com/p/1ff2fcbdd155](https://www.jianshu.com/p/1ff2fcbdd155)

## 相册功能

坑：若运行 tool.py，先确定在 hexo\_res 中是否已经存在 photos 及 min\_photos

参考链接：[https://malizhi.cn/HexoAlbum/](https://malizhi.cn/HexoAlbum/)

## 样式取消

让 source 某文件不被 layout 样式影响，在站点的`_config.yml`中的`skip_render:`加上对应的文件夹或者文件名

参考链接:[http://dugblog.coding.me/Hexo/20180620-hexo-private-customization.html](http://dugblog.coding.me/Hexo/20180620-hexo-private-customization.html)

## 使用hexo-all-minifier优化hexo访问速度

`cnpm install hexo-all-minifier --save`

```javascript
{
  "name": "hexo-site",
  "version": "0.0.0",
  "private": true,
  "hexo": {
    "version": "3.9.0"
  },
  "dependencies": {
    "babel-runtime": "^6.26.0",
    "hexo": "^3.9.0",
    "hexo-abbrlink": "^2.0.5",
    "hexo-admin": "^2.3.0",
    // + "hexo-all-minifier": "^0.5.3",
    "hexo-autonofollow": "^1.0.1",
    "hexo-baidu-url-submit": "^0.0.6",
    "hexo-deployer-git": "^1.0.0",
    "hexo-generator-archive": "^0.1.5",
    "hexo-generator-category": "^0.1.3",
    "hexo-generator-feed": "^2.2.0",
    "hexo-generator-index": "^0.2.1",
    "hexo-generator-searchdb": "^1.2.0",
    "hexo-generator-sitemap": "^2.0.0",
    "hexo-generator-tag": "^0.2.0",
    "hexo-helper-live2d": "^3.1.1",
    "hexo-leancloud-counter-security": "^1.4.1",
    "hexo-renderer-ejs": "^0.3.1",
    "hexo-renderer-marked": "^0.3.2",
    "hexo-renderer-stylus": "^0.3.3",
    "hexo-server": "^0.3.3",
    "hexo-symbols-count-time": "^0.7.0"
  }
}
```

在站点的\_config.yml中配置

```text
tml_minifier:
  enable: true
  exclude: 

css_minifier:
  enable: true
  exclude: 
    - '*.min.css'

js_minifier:
  enable: true
  mangle: true
  output:
  compress:
  exclude: 
    - '*.min.js'
```

参考链接：[https://www.difashi.com/2020-02/20-hexo-minifier.html](https://www.difashi.com/2020-02/20-hexo-minifier.html)

## 图片放大镜功能

在`themes\next\_config.yml`中设置

```text
fancybox: true
```

## 增加音乐播放器

[https://music.163.com/\#/playlist?id=377283757](https://music.163.com/#/playlist?id=377283757)

参考链接：[https://www.jianshu.com/p/f1005ae09e5a](https://www.jianshu.com/p/f1005ae09e5a)

## YAMLException: end of the stream or a document separator is expected...

报错例子：

```text
YAMLException: end of the stream or a document separator is expected at line 4, column 1:
    - [x] 提交入职材料
```

解决方案：在文章顶部增加下述代码

```text
---
---
```

或者

```text
---
abbrlink: '0'
---
```

更多解决方案，可参考：[https://blog.csdn.net/yongf2014/article/details/50016783](https://blog.csdn.net/yongf2014/article/details/50016783)

## Q&A

Q：为什么全是链接？

A：既然已经现存方案，先不造轮子，后续若有时间，会将他们搬进来

