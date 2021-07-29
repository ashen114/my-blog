# 设计模式

## 创建型模式

> 创建型模式：描述“如何创建对象”，主要特点是“将对象的创建和使用分离”，将一个复杂的对象分解成多个简单的部分，然后根据不同的需求分别创建他们，最后构建成该复杂的对象。包括**原型**、**单例**、**工厂方法**、**抽象工厂**和**建造者**5种模式。

例如：一个电脑主机由主板、cpu、内存、硬盘和电源等组成

### 原型

### 单例

例如，一台可以支持多个鼠标，但是没有特殊设置一般只支持一个光标

```javascript
// 光标类
class Cursor{
    constructor(position){
        this.position = position;
        this.getPosition();
    }
    getPosition(){
        return this.position;
    }
}
// 单例模式
let mouseCursor = (function(){
    let instance = null;
    return function(position){
        if(!instance){
            instance = new Cursor(position)
        }
        return instance;
    }
})();

// 测试用例
let mouseA = new mouseCursor('x:1,y:1');
let mouseB = new mouseCursor('x:2,y:2');
console.log(mouseA === mouseB);
```

应用场景：全局弹窗，canvas画图等

### 工厂方法

### 抽象工厂

### 建造者

```typescript
class Computer{
    constructor(
        public mainboard: string;
        public centralProcessingUnit: string;
        public memory: string;
    ){}
}

class ComputerBuilder{
    mainboard!: string;                             // 主板
    centralProcessingUnit!: string;     // CPU
    memory!: string;                                     // 内存

    // 添加主板
    addMainboard(mainboard){
        this.mainboard = mainboard;
        return this;
    }

    // 添加CPU
    addCentralProcessingUnit(centralProcessingUnit){
        this.centralProcessingUnit = centralProcessingUnit;
        return this;
    }

    // 添加内存条
    addMemory(memory){
        this.memory = memory;
        return this;
    }

    // 组装电脑
    build(){
        return new Computer(this.mainboard, this.centralProcessingUnit, this.memory)
    }
}

// 调用
const myComputer = new ComputerBuilder()
    .addMainboard('MSIMAG B460M MORTAR WIFI')
    .addCentralProcessingUnit('Intel i5-10400')
    .addMemory('DDR4 2666 16G*2')
    .build();
```

#### 应用场景

* 需要生成的产品对象有复杂的内部结构，这些产品对象通常包含多个成员属性。
* 需要生成的产品对象的属性相互依赖，需要指定其生成顺序。
* 隔离复杂对象的创建和使用，并使得相同的创建过程可以创建不同的产品。
* Github - node-sql-query：[https://github.com/dresende/node-sql-query](https://github.com/dresende/node-sql-query)

## 结构型模式

> 结构型模式：描述如何将类或者对象按照某种布局组成更大的结构。包括**代理**、**适配器**、**桥接**、**外观**、**享元**和**组合**7种模式。

### 代理

> 代理模式的定义：为一个对象提供一个代用品或占位符，以便控制对它的访问。

常用的虚拟代理形式：某一个花销很大的操作，可以通过虚拟代理的方式延迟到这种需要它的时候才去创建（例：使用虚拟代理实现图片懒加载） 图片懒加载的方式：先通过一张loading图占位，然后通过异步的方式加载图片，等图片加载好了再把完成的图片加载到img标签里面。

```javascript
let imgFunc = (function(){
    let imgNode = document.createElement('img');
    document.body.appendChild(imgNode);
    return {
        setSrc: function(src){
            imgNode.src = src;
        }
    }
});
let proxyImage = (function(){
    let img = new Image();
    img.onload = function(){
        imgFunc.setSrc(this.src);
    }
    return {
        setSrc: function(src){
            imgFunc.setSrc('./loading.gif');
            img.src = src;
        }
    }
})();
proxyImages.setSrc('./pic.png');
```

使用代理模式实现图片懒加载的优点还有符合单一职责原则。减少一个类或方法的粒度和耦合度。

> 单一职责原则指的是，就一个类（通常也包括对象和函数等）而言，应该仅有一个引起它变化的原因。如果一个对象承担了多项职责，就意味着这个对象将变得巨大，引起它变化的原因可能会有多个。面向对象设计鼓励将行为分布到细粒度的对象之中，如果一个对象承担的职责过多，等于把这些职责耦合到了一起，这种耦合会导致脆弱和低内聚的设计。当变化发生时，设计可能会遭到意外的破坏。

### 适配器

### 桥接

### 外观

### 享元

### 组合

## 行为型模式

> 行为型模式：识别对象之间的常用交流模式以及如何分配职责。包括**模板方法**、**策略**、**命令**、**职责链**、**状态**、**观察者**、**中介者**、**迭代器**、**访问者**、**备忘录**和**解释器**11种模式。

### 模板方法

### 策略

> 策略模式的目的就是将算法的使用算法的实现分离开来。 一个基于策略模式的程序至少由两部分组成。第一个部分是一组策略类（可变），策略类封装了具体的算法，并负责具体的计算过程。第二个部分是环境类Context（不变），Context接受客户的请求，随后将请求委托给某一个策略类。要做到这一点，说明Context中要维持对某个策略对象的引用。

```javascript
// 普通的if...else方法
let chooseMainboard = function(model, price){
    if(model == 'MSIMAG'){
        return price * 1.1;
    }
    if(model == 'ASUS'){
        return price * 1.2;
    }
    if(model == 'GIGA'){
        return price * 1.3;
    }
}

chooseMainboard('MSIMAG', 800);
chooseMainboard('ASUS', 600);

// 策略模式
let mainboardPrice = {
    'MSIMAG': function(price){
        return price * 1.1;
    },
    'ASUS': function(price){
        return price * 1.2;
    },
    'GIGA': function(price){
        return price * 1.3;
    }
}
let chooseMainboard = function(model, price){
    return chooseMainboard[model](price);
}

chooseMainboard('MSIMAG', 800);
chooseMainboard('ASUS', 600);
```

> 开放-封闭原则：（类、模块、函数）等应该是可以扩展的，但是不可修改

### 命令

### 职责链

### 状态

### 观察者

### 中介者

### 迭代器

### 访问者

### 备忘录

### 解释器

## 参考资料

\[这九种常用的设计模式你掌握了吗\]：\([https://juejin.im/post/6881384600758091784](https://juejin.im/post/6881384600758091784)\) [2020.06.18-JavaScript设计模式](http://confluence.zhichiwangluo.com/pages/viewpage.action?pageId=3607469)

