---
title: Vue源码阅读笔记
date: 2020-02-28 15:51:02
description: 阅读源码过程中整理的笔记
---

源码解读：[https://github.com/ashen114/CodingFun/blob/master/sourceCode/vue.js](https://github.com/ashen114/CodingFun/blob/master/sourceCode/vue.js)

## 研究对象

```js
(function (global, factory) {
  // 检测上下文环境是否为Node
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.Vue = factory());
}(this, function () { ...
}));
```

> 参考链接：https://www.iteye.com/blog/zccst-2215317 https://www.jianshu.com/p/013b37a677f0
> CommonJS 用在服务器端，同步的，例如 nodejs
> AMD,CMD 用于浏览器端，异步，例如 request 和 seajs

### CommonJS

根据 CommonJS 规范，一个单独的文件就是一个模块。加载模块使用 require 方法，该方法读取一个文件并执行，最后返回文件内部的 exports 对象。

```js
//exports对象上的方法和变量是公有的
var foobar = new foobar();
exports.foobar = foobar;

//require方法默认读取js文件，所以可以省略js后缀
var test = require("./boobar").foobar;

test.bar();
```

CommonJS 加载模块是同步的，所以只有加载完成才能执行后面的操作。像 Node.js 主要用于服务器的编程，加载的模块文件一般都已经存在本地硬盘，所以加载起来比较快，不用考虑异步加载的方式，所以 CommonJS 规范比较适用。但如果是浏览器环境，要从服务器加载模块，这是就必须采用异步模式。所以就有了 AMD CMD 解决方案。

### AMD

AMD 是 RequireJS 在推广过程中对模块定义的规范化产出
AMD 异步加载模块。它的模块支持对象 函数 构造器 字符串 JSON 等各种类型的模块。
适用 AMD 规范适用 define 方法定义模块。

```js
//通过数组引入依赖 ，回调函数通过形参传入依赖
define(['someModule1', ‘someModule2’], function (someModule1, someModule2) {
    function foo () {
        /// someing
        someModule1.test();
    }
    return {foo: foo}
});
```

AMD 规范允许输出模块兼容 CommonJS 规范，这时 define 方法如下：

```js
define(function(require, exports, module) {
  var reqModule = require("./someModule");
  requModule.test();
  exports.asplode = function() {
    //someing
  };
});
```

### CMD

CMD 是 SeaJS 在推广过程中对模块定义的规范化产出

CMD 和 AMD 的区别有以下几点：

1.对于依赖的模块 AMD 是提前执行，CMD 是延迟执行。不过 RequireJS 从 2.0 开始，也改成可以延迟执行（根据写法不同，处理方式不通过）。

2.CMD 推崇依赖就近，AMD 推崇依赖前置。

```js
//AMD
define(['./a','./b'], function (a, b) {

    //依赖一开始就写好
    a.test();
    b.test();
});

//CMD
define(function (requie, exports, module) {
    //依赖可以就近书写
    var a = require('./a');
    a.test();
    ...
    //软依赖
    if (status) {
        var b = requie('./b');
        b.test();
    }
});
```

虽然 AMD 也支持 CMD 写法，但依赖前置是官方文档的默认模块定义写法。

### seajs

1、引入 seajs
在文件夹中放入 seajs，相关的 html 页面引入

```html
<script type="text/javascript" src="yourfile/js/sea.js"></script>
```

2、seajs 经常使用的 api 有 use，config
seajs.use 主要用于载入入口模块。入口模块相当于 C 语言的 main 函数，同时也是整个模块依赖树的根。seajs.use 的用法如下：

```js
//第一模式
seajs.use("./a");

//回调模式
seajs.use("./a", function(a) {
  a.run();
});

//多模块模式
seajs.use(["./a", "./b"], function(a, b) {
  a.run();
  b.run();
});
```

### 结论

AMD 的 api 默认是一个当多个用，CMD 严格的区分推崇职责单一。例如：AMD 里 require 分全局的和局部的。CMD 里面没有全局的 require,提供 seajs.use()来实现模块系统的加载启动。CMD 里每个 API 都简单纯粹。
require 是 AMD 规范引入方式
import 是 es6 的一个语法标准，如果要兼容浏览器的话必须转化成 es5 的语法。

> 参考链接：[RequireJS、SeaJS 的区别](https://www.cnblogs.com/xiaobai110/p/6654522.html)

## 研究对象

```js
function isPrimitive(value) {
  return (
    typeof value === "string" ||
    typeof value === "number" ||
    // $flow-disable-line
    typeof value === "symbol" ||
    typeof value === "boolean"
  );
}
```

### 数据类型

JavaScript 语言规定了 7 种语言类型，他们分别是：
Number（数字）
Boolean（布尔值）
String（字符串）
Null （空）
Undefined （未定义）
Symbol （es6 新增，表示独一无二的值）
Object（对象）
其中，除了 Object 是对象类型，其他的都是原始（基本）类型。

### symbol

ES5 的对象属性名都是字符串，这就很容易造成属性名的冲突。为了防止属性名冲突，创建独一无二的变量名，在 ES6 中引入了 Symbol 基本数据类型。Symbol() 函数返回的是 Symbol 类型的值，该类型具有静态方法和静态属性。

```js
Symbol("ashen") == Symbol("ashen"); // false
```

借助该特性，可以将其作为对象的属性名，保证不会出现同名属性。

```js
let name = Symbol("shen");
let a = {};
a[name] = "ashen";

let b = {
  [name]: "ashen"
};

let c = {};
Object.defineProperty(c, name, { value: "ashen" }); // c = { Symbol(shen):"ashen" }

// a,b,c的值都为{Symbol(shen): "ashen"},然而三者并不相等
```

## 研究对象

```js
function isValidArrayIndex(val) {
  var n = parseFloat(String(val));
  return n >= 0 && Math.floor(n) === n && isFinite(val);
}
```

### 内置函数

isFinite(number) 是 JavaScript 内置函数，用于判断 number 对象是否可以转换成一个有限的数字。

```js
isFinite(123); // true
isFinite("123"); // true
isFinite("123a"); // false
```

### Math 对象

Math 对象用于执行数学任务。
Math 对象并不像 Date 和 String 那样是对象的类，因此没有构造函数 Math()。

```js
Math.floor(1234.567); // 向下取整数，得到123
```

## 研究对象

```js
function toString(val) {
  return val == null
    ? "" // 若为null，则返回""
    : Array.isArray(val) || (isPlainObject(val) && val.toString === _toString)
    ? JSON.stringify(val, null, 2)
    : String(val);
}
```

## 类型判断

判断数据是否为 array 数组类型

```js
let arr = ["a", "b", "c"];
Array.isArray(arr); // true
```

## 原型链

```js
let _ArrtoString = Array.prototype.toString;
let _ObjtoString = Object.prototype.toString;

let arr = ["a", "b", "c"];
let obj = { name: "a" };

// 可以用于判断数值是什么类型
arr.toString == _ArrtoString; // true
arr.toString == _ObjtoString; // false

obj.toString == _ObjtoString; // true
obj.toString == _ArrtoString; // false
```

## 类型转换

### JSON.stringfy

> 可以将对象转换为字符串
> 语法
> JSON.stringify(value[, replacer[, space]])
> 参数说明：
> value: 必需， 要转换的 JavaScript 值（通常为对象或数组）。
> replacer: 可选。用于转换结果的函数或数组。如果 replacer 为函数，则 JSON.stringify 将调用该函数，并传入每个成员的键和值。使用返回值而不是原始值。如果此函数返回 undefined，则排除成员。根对象的键是一个空字符串：""。如果 replacer 是一个数组，则仅转换该数组中具有键值的成员。成员的转换顺序与键在数组中的顺序一样。当 value 参数也为数组时，将忽略 replacer 数组。
> space:可选，文本添加缩进、空格和换行符，如果 space 是一个数字，则返回值文本在每个级别缩进指定数目的空格，如果 space 大于 10，则文本缩进 10 个空格。space 也可以使用非数字，如：\t。

[JSON.stringify 的使用细节](https://baijiahao.baidu.com/s?id=1606340664976316132&wfr=spider&for=pc)

```js
let val = { name: "ahsen" };

/**
 * val是原数据value;
 * null为用于转换结果的函数或数组replacer;
 * 2为分别前插入2个空格,若为字符串，则是分别前插入字符串...;
 **/
JSON.stringify(val, null, 2);
// 输出应为
// {
//   name:'ashen'
// }

// 其中null的用法可以有如下：
// 1. 通过函数处理数组(arr,function)
let arr = ["a", "b"];
let json = JSON.stringify(arr, changeArr); // 得到 ""A,B""
function changeArr(key, value) {
  console.log(value); // ["a","b"]
  return value.toString().toUpperCase(); // 将value转为字符串"a,b" 然后转为大写"A,B"
}

// 2. 通过函数处理对象(obj,function)
let obj = {
  name: "ashen",
  age: "18"
};
let json = JSON.stringify(obj, changeObj); // 得到""ASHEN""
function changeObj(key, value) {
  console.log(value); // { name:"ashen",age:"18" }
  return value.name.toString().toUpperCase(); //将value中的name的属性转为大写
}

// 3. 通过数组与数组组合，结果第二个数组被忽略(arr1,arr2)
let arr1 = ["a", "b", "c"];
let arr2 = ["d", "e"];
let json = JSON.stringify(arr1, arr2); // 得到"["a","b","c"]"

// 4. 通过对象与数组结合，结果显示为若数组的值和对象的键都存在的，则保留，过滤掉两者不共同拥有的部分
let obj = {
  name: "ashen",
  age: "18",
  height: "180cm"
};
let arr = ["name", "age", "sex"];
let json1 = JSON.stringify(obj, arr); // 得到 "{"name":"ashen","age":"18"}"  分析：由于arr中不存在height及obj中不存在sex，因此两者被过滤，剩下两者都存在的
let json2 = JSON.stringify(arr, obj); // 得到 "["name","age","sex"]" 结果和定义的arr一样
```

### String(val)

适用于转换转换非对象类型的数据为字符串类型

```js
let num = 1;
String(num); // "1"

let arr = ["a", "b", "c"];
String(arr); // "a,b,c"

let obj = {
  name: "ashen",
  age: "18",
  height: "180cm"
};
String(obj); // "[object Object]" 对object对象类型转换达到的效果
```

## 研究对象

```js
function makeMap(str, expectsLowerCase) {
  var map = Object.create(null);
  var list = str.split(",");
  for (var i = 0; i < list.length; i++) {
    map[list[i]] = true;
  }
  return expectsLowerCase
    ? function(val) {
        // 若expectsLowerCase存在且为true
        return map[val.toLowerCase()]; // 则将键转为小写再返回map
      }
    : function(val) {
        // 若expectsLowerCase不存在或者为false
        return map[val]; // 则直接返回map
      };
}
```

## 柯里化函数

在计算机科学中，柯里化（Currying）是把接受多个参数的函数变换成接受一个单一参数(最初函数的第一个参数)的函数，并且返回接受余下的参数且返回结果的新函数的技术。

```js
// ---普通版--
function typeTest(dataType, obj) {
  return new RegExp(dataType, "gi").test(Object.prototype.toString.call(obj));
}
typeTest("array", [1, 2, 3]); //true

typeTest("array", "Hello"); //false

typeTest("boolean", true); //true

// ---Currying柯里化---
function typeTest(dataType, obj) {
  return new RegExp(dataType, "gi").test(Object.prototype.toString.call(obj));
}
//--第一种--
var isNum = (function(type) {
  return function(data) {
    return typeTest(type, data);
  };
})("number"); // 'number'传递到type，函数实际接收的参数传递到data

isNum(1); //true
isNum([]); //false

//--第二种--
var isArr = typeTest.bind(null, "array"); // typeTest('array',null) null.typeTest('array')

isArr(1); //false
isArr([]); //true
```

## 研究对象

```js
/**
 * 函数
 * @param fn 接收待缓存的函数
 * 此处主要应用了闭包的思想，
 * 例如：
 * var strFn = cached(function(str) { return str })
 * var a = strFn('ashen') 结果为'ashen'，此时strFn会存起cachedFn，由于闭包作用，cache也会被缓存起来，此时,由于hit为undefined,因此cache['ashen'] = 'ashen'
 * var b = strFn('ashen') 此时strFn也会存起cachedFn，由于cache已经被缓存起来，因此，第二次调用的是第一次a缓存的strFn函数。var hit = cache[str]会等于'ashen'
 * var c = strFn('test') 此时第三次调用，调用的strFn还是上次缓存的cachedFn，因为cache['test']为undefined，因此再次cache['test'] = 'test'，外层的return cachedFn会被strFn缓存起来，其中的cache['test'] = 'test'也会被缓存起来，用于下次
 * 由于缓存的原因，var cache = Object.create(null); 只执行一次
 * 每次调用，上次的cache都被缓存起来
 */
function cached(fn) {
  var cache = Object.create(null); // 创建空对象
  return function cachedFn(str) {
    // 函数，接收fn中的str参数，闭包
    var hit = cache[str]; // 将fn中的str参数....?
    return hit || (cache[str] = fn(str)); // 若hit没有str属性和值，则赋予fn的返回数据作为值
  };
}
```

### 闭包

例子 1

```js
/**
 * myFunc 是执行 makeFunc 时创建的 displayName 函数实例的引用，
 * 而 displayName 实例仍可访问其词法作用域中的变量，即可以访问到 name 。
 * 由此，当 myFunc 被调用时，name 仍可被访问，其值 Mozilla 就被传递到alert中。
 */
function makeFunc() {
  var name = "Mozilla";
  function displayName() {
    alert(name);
  }
  return displayName;
}

var myFunc = makeFunc();
myFunc(); // 可以访问闭包的name
```

例子 2

```js
function makeAdder(x) {
  return function(y) {
    return x + y;
  };
}

var add5 = makeAdder(5);
var add10 = makeAdder(10);

console.log(add5(2)); // 7
console.log(add10(2)); // 12
```

例子 3，[对本次研究对象进行实例分析](./html/cached.html)

```js
function cached(fn) {
  var cache = Object.create(null); // 创建空对象
  return function cachedFn(str) {
    // 函数，接收fn中的str参数
    debugger;
    let hit = cache[str]; // 将fn中的str参数....?
    debugger;

    return hit || (cache[str] = fn(str)); // 若hit没有str属性和值，则赋予fn的返回数据作为值
  };
}

var capitalize = cached(function(str) {
  debugger;
  return str.charAt(0).toUpperCase() + str.slice(1);
});

var a = capitalize("ahen"); // 调用了capitalize，capitalize实际存储起来的是cachedFn，因此，下次此时var capitalize = function cachedFn(str) {let hit = cache[str]; return hit || (cache[str] = fn(str)); };

var b = capitalize("ahen"); // 由于上述capitalize实际是已经缓存起来了cachedFn，而且由于闭包的原因，cache实际上自从第一次被创建后，每次调用都会被str覆盖，除非上次的结果等于本次的属性。

var c = capitalize("ahen1");

var d = capitalize("ahen2");

var e = capitalize("ahen");
```

## 研究对象

```js
var camelizeRE = /-(\w)/g;
```

### 正则表达式（待完善）

[参考学习](https://www.jianshu.com/p/488d60349325)
[参考文档](https://www.w3school.com.cn/js/js_regexp.asp)

```js
let str = "test123ABC";
// 1. 构造函数式声明
let patt1 = new RegExp("\\d", "g"); // 需要使用\\d来表示 \d，若只使用\d或者d则会解析成/d/g，则表示只匹配字母d
patt1.test(str); // let patt1 = /\d/ 返回true，因为str含有123
patt1.exec(str); // 返回["1", index: 4, input: "test123ABC", groups: undefined]
patt1.exec(str); // 返回["2", index: 5, input: "test123ABC", groups: undefined]
patt1.exec(str); // 返回["3", index: 6, input: "test123ABC", groups: undefined]
patt1.exec(str); // 返回null
```

exec 例子：

![exec例子](/images/2019-12-18-20-26-47.png)

exec 解释：[参考文档](https://www.w3school.com.cn/jsref/jsref_exec_regexp.asp)

![](/images/2019-12-18-20-27-59.png)

```js
let str = "test123ABC";

// 2. 字面量式声明
let patt1 = /\d/g; // 通过//符号作为开始结束，\d为元字符，表示匹配数字,g表示全局匹配

str.match(patt1); // 得到["1","2","3"]，若没有g，则得到["1", index: 4, input: "test123ABC", groups: undefined]，其中"1"表示匹配到的第一个数字，index则表示位置
str.replace(patt1, "WK"); // 得到testWKWKWKABC，若没有g，则得到testWK23ABC
// 若为'v-for'.replace(patt1,function(a,b){ return b })，其中a接收的是'-for',b接收的是'for',因为是replace，所以-for被替换，return b，则-for被替换为for，因此结果我vfor
```

#### 修饰符

- i 执行对大小写不敏感
- g 执行全局匹配
- m 执行多行匹配

#### 表达式

> `[]` 匹配方括号内的任意字符，`()`类似将一个表达式闭包闭合起来

- `[abc]` 匹配反括号之间的任何字符 例如：`'ashen114'.match(/[abcde]/g)`，得到`["a","e"]`，
- `[^abc]` 匹配不在方括号内的任意字符 例如：`'ashen114'.match(/[^abcde]/g)`，得到`["s","h","n"]`，
- `[0-9]` 匹配反括号之间的任何字符 例如：`'ashen114'.match(/[0-9]/g)`，得到`["1","1","4"]`，
- `[a-z]` 匹配任何从小写 a-z 的字符 例如：`'ashen114'.match(/[a-z]/g)`，得到`["a","s","h","e","n"]`，
- `[A-Z]` 匹配任何从大写 A-Z 的字符 例如：`'CodingFun'.match(/[a-z]/g)`，得到`["C","F"]`，
- `(x|y)` 查询由`|`分割的任何选项 例如：`'red,yellow,red,green'.match(/(red|green)/g)`，得到`["red", "red", "green"]`
- `\w` 查找单词字符，单词字符包括：a-z、A-Z、0-9，以及下划线, 包含 \_ (下划线) 字符。 例如:`'a@b#1$2%'.match(/\w/g)`，得到`["a", "b", "1", "2"]`

#### 元字符

- `\d` 查找数字 例如：`'ashen114'.match(/\d/g)`，得到  `["1", "1", "4"]`
- `\s` 查找空白字符 例如：`'a is a'`，得到`["",""]`表示存在两个空白字符
- `\b` 匹配单词边界，查找对象是否处于边界，空白字符串，及非\w 的都可以作为边界 例如：`'js sj@js jsj'.match(/\bjs/g)`，得到`["js","js","js"]`,其中第一个 js 为开头的 js，第二个是因为特殊符号@不包括\w 中，因为被列为边界，第三个 js 则是结尾的 jsj 的开头部分 js
- `\B` 与`\b`相反 例如`'js sj@js jsj'.match(/\bj/g)`，得到`["j", "j"]`,其中第一个 j 是 sj@的 j，第二个 j 则是结尾的 j，因为他们不处于边界，而开头的 js，@js 何结尾的 jsj 的首字母都处于边界。
- `\uxxxxx` 匹配 16 进制字符串 例如：`'Welcome! Hello World'.match(/\u0057/g)`，得到`["W","W"]`,因为十六进制 0057 是 W

#### 量词

- `n+` 匹配任何包含至少一个 n 的字符串 例如：`'i am aaa,hahaah'.match(/a+/g)`,得到`["a","aaaa","a","aa"]`，若是`/aa+/g`，则得到`["aaa","aa"]`
- `n*` 匹配任何包含零个或者多个 n 的字符串 例如：`'i am aaa,hahaah'.match(/ha*/g)`,得到`["ha", "haa", "h"]`，若是`/h*/g`，则得到`["", "", "", "", "", "", "", "", "", "h", "", "h", "", "", "h", ""]`
- `n?` 匹配任何包含零个或者一个 n 的字符串 例如：`'i am aaa,hahaah'.match(/ha?/g)`,得到`["ha", "ha", "h"]`，若是`/h?/g`，则得到`["", "", "", "", "", "", "", "", "", "h", "", "h", "", "", "h", ""]`

#### 练习

> 过滤 p 标签

```js
let str = '<p class="test" style="height:60px;"></p>';
str.replace(/<p[^>]*? style\s?=\s?["']?([^"']*)["']?[^>]*?>/g, "<p>"); // "<p></p>"
```

> 过滤 p 标签的 style

```js
let str = '<p class="test" style="height:60px;"></p>';
let reg = /<p(\s([a-zA-Z0-9-]*)=\"([^=\"]*)\")*>/gim;
str.replace(reg, function(s) {
  return (s = s.replace(/\sstyle=\"[^\"]*\"/, ""));
}); // "<p class="test"></p>"
```

## 研究对象

```js
var capitalize = cached(function(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
});
```

### charAt

> `str.charAt(index)` 可以根据 index 索引值找到当前字符串的值

例如：`'ashen'.charAt(2)`得到`h`

## 研究对象

```js
/** 正则表达式：匹配全部处于非边界的大写A-Z的字母，例如：_TEST.match(hyphenateRE)，则 得到TEST*/
var hyphenateRE = /\B([A-Z])/g;
var hyphenate = cached(function(str) {
  // 将匹配项转为"-小写"，其中$1表示每个匹配的字母，将每个匹配的转为-字母，再转为小写
  return str.replace(hyphenateRE, "-$1").toLowerCase();
});
```

`str.replace(hyphenateRE, "-$1").toLowerCase();`

其中`$1`为每个匹配项

## 研究对象

[参考文档](https://www.jianshu.com/p/625c35d84a80)

```js
function polyfillBind(fn, ctx) {
  function boundFn(a) {
    var l = arguments.length;
    return l
      ? l > 1
        ? fn.apply(ctx, arguments)
        : fn.call(ctx, a)
      : fn.call(ctx);
  }

  boundFn._length = fn.length;
  return boundFn;
}
```

### apply && call

学习链接：[https://www.runoob.com/w3cnote/js-call-apply-bind.html](https://www.runoob.com/w3cnote/js-call-apply-bind.html)

apply

> 调用一个对象的方法，用另一个对象替换当前对象，可以继承另外一个对象的属性，它的语法是：
> `Function.apply(obj[, argArray]);`

call

> 调用一个对象的方法，用另一个对象替换当前对象，可以继承另外一个对象的属性，它的语法是：
> `Function.call(obj[, param1[, param2[, [,...paramN]]]]);`

apply 与 call 类似，只是传参有点差异

```js
function add(a, b, c) {
  return a + b + c;
}

function sub(a, b) {
  return a - b;
}

console.log(add.call(sub, 1, 2, 3)); // 6

// 因为call()方法改变了this的指向，使得sub可以调用add的方法，也就是用sub去执行add中的内容
```

```js
function People(name, age) {
  this.name = name;
  this.age = age;
}

function Student(name, age, grade) {
  People.call(this, name, age);
  this.grade = grade;
}

var student = new Student("小明", 21, "大三");
console.log(student.name + student.age + student.grade); //小明21大三

// People.call(this, name, age);中的this代表的是Student，这也就是之前说的，使得Student可以调用People中的方法，因为People中有this.name = name;等语句，这样就将name和age属性创建到了Student中。

// 总结一句话就是call()可以让括号里的对象来继承括号外函数的属性。

// People.apply(this, [name, age]); 等价于 People.apply(this, arguments);
```

apply()的其他用法

```js
Math.max(12, 5, 7); // 得到12
```

```js
// 将Math.max接收的参数由(a,b,c)改为[a,b,c]
Math.max.apply(null, [12, 5, 7]); // 得到12
```

同理 Math.min 也可以

```js
let arr1 = [1, 2, 3];
let arr2 = [4, 5, 6];
Array.prototype.push.apply(arr1, arr2); //把arr2合并到arr1中,得到的arr1为[1,2,3,4,5,6]

let arr3 = [1, 2, 3];
let arr4 = [4, 5, 6];
arr3.push.apply(arr3, arr4); // 把arr4合并到arr3中,得到的arr3为[1,2,3,4,5,6]
// 或者使用[].push.apply(arr3,arr4)也可以达到同样的目的
```

## 研究对象

```js
/**
 * @function 将list转换为数组类型，允许从start开始截断数组
 * @params list 需要转换的数组
 * @params start 需要转换的开始位置，默认从0开始
 */
function toArray(list, start) {
  start = start || 0;
  var i = list.length - start;
  var ret = new Array(i);
  while (i--) {
    ret[i] = list[i + start];
  }
  return ret;
}

/**
 * Mix properties into target object.
 * 将属性混合到目标对象中
 */
/**
 * @function 将_form插入到to对象中
 * @params to 原对象，目标对象
 * @params _from 待被插入到to对象的基本对象或数组
 */
function extend(to, _from) {
  for (var key in _from) {
    to[key] = _from[key];
  }
  return to;
}

/**
 * Merge an Array of Objects into a single Object.
 * 将对象数组合并到单个对象
 */
/**
 * @function 调用extend，将arr数组转换为对象
 * @params arr
 */
function toObject(arr) {
  var res = {};
  for (var i = 0; i < arr.length; i++) {
    if (arr[i]) {
      extend(res, arr[i]);
    }
  }
  return res;
}
```

1. 处理数组，截断数组 `toArray(list,start)`
2. 处理对象，将对象或者数组插入到对象中 `extend(to,_from)`
3. 处理对象，将数组转换为对象 `toObject(arr)`



--- *待更新* ---