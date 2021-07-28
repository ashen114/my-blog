# JavaScript高级程序设计（第4版）阅读笔记

## 数组

### 类数组

类数组：拥有leng属性，length可隐式转换为number类型且不大于Math.pow(2,32)

例如：
```js
let a = { 1:'apple', 2:'bus', length: 3};
Array.from(a); //  [undefined, "apple", "bus"]
```

> Array 构造函数还有两个ES6新增的用于创建数组的静态方法：
>
> `from()` 和 `of()` 。 `from()` 用于将类数组结构转换为数组实例，而`of()` 用于将一组参数转换为数组实例。
> 
> `Array.from()` 的第一个参数是一个类数组对象，即任何可迭代的结构，或者有一个 length 属性和可索引元素的结构。这种方式可用于很多场合： 

```js
// 字符串会被拆分为单字符数组
console.log(Array.from("Matt")); // ["M","a","t","t"]
```

```js
// 可以使用from()将集合和映射转换为一个新数组
const m = new Map().set(1, 2).set(3, 4);
const s = new Set().add(1).add(2).add(3).add(4);
console.log(Array.from(m)); // [[1, 2], [3, 4]]
console.log(Array.from(s)); // [1, 2, 3, 4]
```

```js
// Array.from()对现有数组执行浅复制
const a1 = [1, 2, 3, 4];
const a2 = Array.from(a1);
console.log(a1); // [1, 2, 3, 4]
alert(a1 === a2); // false
```

```js
// 可以使用任何可迭代对象
const iter = {
    *[Symbol.iterator]() {
        yield 1;
        yield 2;
        yield 3;
        yield 4;
    }
};
console.log(Array.from(iter)); // [1, 2, 3, 4]
```

```js
// arguments对象可以被轻松地转换为数组
function getArgsArray() {
    return Array.from(arguments);
}
console.log(getArgsArray(1, 2, 3, 4)); // [1, 2, 3,4]
```

```js
// from()也能转换带有必要属性的自定义对象
const arrayLikeObject = {
    0: 1,
    1: 2,
    2: 3,
    3: 4,
    length: 4
};
console.log(Array.from(arrayLikeObject)); // [1, 2,3, 4]
```

> `Array.from()` 还接收第二个可选的映射函数参数。这个函数可以直接增强新数组的值，而无须像调用 `Array.from().map()` 那样先创建一个中间数组。还可以接收第三个可选数，用于指定映射函数中`this` 的值。但这个重写的 `this` 值在箭头函数中不适用。

```js
const a1 = [1, 2, 3, 4];
const a2 = Array.from(a1, x => x**2);
const a3 = Array.from(a1, function(x) {return x**this.exponent}, {exponent: 2});
console.log(a2); // [1, 4, 9, 16]
console.log(a3); // [1, 4, 9, 16]
```

### length 属性

> 数组 `length` 属性的独特之处在于，它不是只读的。通过修改`length` 属性，可以从数组末尾删除或添加元素。来看下面的例子：

```js
// 删除数组最后一个值
let colors = ["red","blue","green"]; // 创建一个包含3个字符串的数组
colors.length = 2;
console.log(colors); // ["red", "blue"]
```

```js
// 使用 length 属性向数组末尾添加元素
let colors = ["red","blue","green"]; // 创建一个包含3个字符串的数组
colors[colors.length] = "black"; // 添加一种颜色（位置3）
colors[colors.length] = "brown"; // 再添加一种颜色（位置4）
console.log(colors); //  ["red", "blue", "green", "black", "brown"]
```

### 迭代器方法

> 在ES6中， Array 的原型上暴露了3个用于检索数组内容的方法： `keys()` 、 `values()` 和 `entries()` 。
> 
> `keys()` 返回**数组索引**的迭代器， `values()` 返回**数组元素**的迭代器，而 `entries()` 返回**索引/值对**的迭代器：

```js
const a = ["foo","bar","baz","qux"];
// 因为这些方法都返回迭代器，所以可以将它们的内容
// 通过Array.from()直接转换为数组实例
const aKeys = Array.from(a.keys());
const aValues = Array.from(a.values());
const aEntries = Array.from(a.entries());

console.log(aKeys); // [0, 1, 2, 3]
console.log(aValues); // ["foo","bar","baz","qux"]
console.log(aEntries); // [[0,"foo"], [1,"bar"],[2,"baz"], [3,"qux"]]

// 使用ES6的解构可以非常容易地在循环中拆分键/值对：
for (const [idx, element] of a.entries()) {
    console.log(`${idx}:${element}`);
}
// 0:foo
// 1:bar
// 2:baz
// 3:qux
```

> 复制填充数组的方法：
> `fill()`: 批量**复制**
> `copyWithin()`:批量**覆盖**

```js
// fill的一个参数为填充值
Array.from({ length:3 }).fill(5); // [5, 5, 5]

// fill的 第二个参数 可以指定覆盖的索引值起点，例从索引值为 2 开始，填充为 5
[7,8,9,10].fill(5,2)  // [7, 8, 5, 5]

// fill的 第三个参数 可以指定覆盖的索引值终点，例从索引值为 2 开始至 5 结束，填充为6
[1,2,3,4,5,6,7].fill(6,2,5); // [1, 2, 6, 6, 6, 6, 7]
```

```js
// copyWithin的第一个参数为指定复制的插入索引点，例从索引值为0的位置开始复制再覆盖到索引值为3的地方
[1,2,3,4,5,6,7,8,9].copyWithin(3) // [1, 2, 3, 1, 2, 3, 4, 5, 6]

// copyWithin的第二个参数为开始复制值的索引值，例如在3的索引值位置覆盖从索引值为5的值直到结束
[1,2,3,4,5,6,7,8,9].copyWithin(3, 5) // [1, 2, 3, 6, 7, 8, 9, 8, 9]

// copyWithin的第三个参数为结束复制值的索引值，例如在3的索引值位置覆盖索引值为5的值直到所索引值为7的位置结束
[1,2,3,4,5,6,7,8,9].copyWithin(3, 5, 7) // [1, 2, 3, 6, 7, 6, 7, 8, 9]
```