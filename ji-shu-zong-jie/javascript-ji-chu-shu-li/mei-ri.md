# 每日

## React

### 高阶组件

[说说对高阶组件的理解？应用场景?](https://mp.weixin.qq.com/s/33iiPeWUyNTtGxN5UkZ5xA)

定义：

* 接受一个或多个函数作为输入
* 输出一个函数

本质上是一个装饰者设计模式

### React Hooks

[说说对 React Hooks 的理解？解决了什么问题？](https://mp.weixin.qq.com/s/495CCxYzhtRqbledXrdWFw)

* useState

  ```javascript
  const [count, setCount] = useState(0)
  // 依赖旧值
  setCount(prevCount => prevCount + 1)

  const [name, setName] = useState({
    lastName: '',
    firstName: ''
  })
  setName({
    ...name,  // 不会自动合并对象，需要使用展开运算符来手动合并对象
    lastName: 'T'
  })
  const [items, setItems] = useState([])
  setItems([
    ...items, // 数值也是如此
    {
      name: 'apple'
    }
  ])
  ```

* useEffect
* useContext

  ```javascript
  // app.js
  export const UserContext = React.createContext('')
  export const ChannelContext = React.createContext('')

  return (
    <UserContext.Provider value={'chuanshi'}>
      <ChannelContext.Provider value={'code volution'}>
        <ComponentC />
      </ChannelContext.Provider>
    </UserContext.Provider>
  )
  ```

  ```javascript
  // ComponentC
  import React, { useContext } from 'react'
  import { UserContext, ChannelContext } from '../App'

  const user = useContext(UserContext)
  const channel = useContext(ChannelContext)
  ```

* useReducer

  ```javascript
  import React, { useReducer } from 'react'

  const reducer = (state, action) {
    switch(action.type){
      case 'ADD'
        return state + action.number
    }
  }
  const initialState = 0;
  const [count, dispatch] = useReducer(reducer, initialState)
  dispatch({ type: 'ADD', number: 1 })
  ```

  > 链接：[https://juejin.cn/post/6844904157892050957](https://juejin.cn/post/6844904157892050957)
  >
  > * 如果 state 的类型为 Number, String, Boolean 建议使用 useState，如果 state 的类型 为 Object 或 Array，建议使用 useReducer
  > * 如果 state 变化非常多，也是建议使用 useReducer，集中管理 state 变化，便于维护
  > * 如果 state 关联变化，建议使用 useReducer
  > * 业务逻辑如果很复杂，也建议使用 useReducer
  > * 如果 state 只想用在 组件内部，建议使用 useState，如果想维护全局 state 建议使用 useReducer

* useCallback

  > [https://juejin.cn/post/6844904162040233997](https://juejin.cn/post/6844904162040233997)

  React.memo 在 props 或 state 没有变化时，阻止组件的 rerender

  ```javascript
  const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
  ```

  使用useCallback，只有依赖于age，salary的组件，才会 rerender

  ```javascript
  const incrementAge = useCallback(
    () => {
      setAge(age + 1)
    },
    [age],
  )

  const incrementSalary = useCallback(
    () => {
      setSalary(salary + 1000)
    },
    [salary],
  )
  ```

* useMemo

  ```javascript
    const isEven = useMemo(() => {
    let i = 0
    while (i < 1000000000) i += 1
    return counterOne % 2 === 0
  }, [counterOne])

  <span>
  {
    isEven ? 'event' : 'odd'
  }
  </span>
  ```

  useMemo 与 useCallback 的区别 useCallback 是缓存了函数自身，而 useMemo 是缓存了函数的返回值。

* useRef

  一是让我们允许访问 Dom 节点； 二是成为一个容器，用来缓存变量。 第二种用法较为少见，需要多加注意，遇到类似的场景可以尝试使用。

* custom Hook

  ```javascript
  // useCounter Hook
  import { useState } from 'react'

  function useCounter(initialValue = 0, value = 1) {
    const [count, setCount] = useState(initialValue)
    const increment = () => {
      setCount(preCount => preCount + value)
    }
    const decrement = () => {
      setCount(preCount => preCount - value)
    }
    return [count, increment, decrement]
  }
  export default useCounter
  ```

  ```javascript
  // 使用自定义hook-useCounter
  import useCount from '../hook/useCounter'

  const [count, increment, decrement] = useCounter(10, 5)

  <span>{ count }</span>
  <button onClick={increment}></button>
  <button onClick={decrement}></button>
  ```

更多文档：[https://juejin.cn/column/6987427184843440141](https://juejin.cn/column/6987427184843440141)

### React 引入 css 的几种方式

[说说 react 中引入 css 的方式有哪几种？区别？](https://mp.weixin.qq.com/s/zpJje5J2fbKfXqUEEv4mcg)

常用引入方式

* 在组件内直接使用

  ```javascript
  style={{
    backgroundColor: "#44014C",  //驼峰法
  }}
  ```

* 组件中引入 .css 文件

  ```javascript
  // 样式会全局污染
  import './style.css'

  ;<div className='title'>标题</div>
  ```

* 组件中引入 .module.css 文件

  ```javascript
  // 样式不会造成全局污染
  import style from './style.css'

  ;<div className={style.title}>标题</div>
  ```

* CSS in JS

  第三方库：styled-components、emotion、glamorous

  例如 styled-components

  `yarn add styled-components`

  ```javascript
  const DivWrapper =  styled.div`
    color: red;
  `

  const RedColorText = styled(DivWrapper)`
    background-color: black;
  `

  <DivWrapper>标题</DivWrapper>
  ```

更多参考文档：[https://mp.weixin.qq.com/s/oywTpNKEikMXn8QTBgITow](https://mp.weixin.qq.com/s/oywTpNKEikMXn8QTBgITow)

### React 中组件间的过渡动画

[在 React 中组件间过渡动画如何实现？](https://mp.weixin.qq.com/s/j6ILUdt_XToew2McPeFjuQ)

例如第三方组件库：react-transition-group

* CSSTransition：在前端开发中，结合 CSS 来完成过渡动画效果
* SwitchTransition：两个组件显示和隐藏切换时，使用该组件
* TransitionGroup：将多个动画组件包裹在其中，一般用于列表中元素的动画

详情文档：[https://reactcommunity.org/react-transition-group/](https://reactcommunity.org/react-transition-group/)

### Redux 的工作原理

[说说你对 Redux 的理解？其工作原理？](https://mp.weixin.qq.com/s/w33yWPg-CO0FBAZbPS_gdg)

工作原理：

使用（以 react-redux 为例）：

```javascript
const redux = require('redux')

// 1. 创建数据的公共存储区域
import { createStore } from 'redux'
const store = createStore()

// 2. 创建一个记录本去辅助管理数据：reducer
const initialState = {
  // 设置默认值
  counter: 0,
}
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'PLUS':
      return { ...state, counter: state.counter + 1 }
    case 'REDUCE':
      return { ...state, counter: state.counter - 1 }
    case 'ADD':
      return { ...state, counter: state.counter + action.number }
    default:
      return state
  }
}

// 3. 传递store，建立连接
const store = createStore(reducer)

// 4. 可以监听store的变化
store.subscribe(() => {
  console.log('store:', store.getState())
})

// 5. 触发reducer的事件以修改store的值
store.dispatch({
  type: 'PLUS',
})
store.dispatch({
  type: 'REDUCE',
})
store.dispatch({
  type: 'ADD',
  number: 5,
})
```

### Redux 中间件的使用及原理

[说说对 Redux 中间件的理解？常用的中间件有哪些？实现原理？](https://mp.weixin.qq.com/s/hOI-8UaOo4AP8AqokbDKHQ)

常用中间件：

* redux-thunk：用于异步操作
* redux-logger：用于日志记录

使用： 通过 applyMiddlewares 进行注册，作用是将所有的中间件组成一个数组，依次执行，然后作为第二个参数传入到 createStore 中

原理：

略，详情见[https://mp.weixin.qq.com/s/hOI-8UaOo4AP8AqokbDKHQ](https://mp.weixin.qq.com/s/hOI-8UaOo4AP8AqokbDKHQ)

### React Redux 的使用及项目结构（待补充）

[你在 React 项目中是如何使用 Redux 的? 项目结构是如何划分的？](https://mp.weixin.qq.com/s/fJqZqgQQkHyBjdnnyUB5uA)

使用：

1. 在组件顶层使用 Provider 组件包裹，传递 store 下去
2. 在子组件中，通过 connect 将组件包裹，使用 mapStateToProps 将组件与 store 的存储状态建立连接，通过 mapDispatchToProps 将组件和 store 的 dispatch 建立映射关系

项目结构：

。。。

源码：[https://zhuanlan.zhihu.com/p/80655889](https://zhuanlan.zhihu.com/p/80655889)

### React Router 常用组件

[说说你对 React Router 的理解？常用的 Router 组件有哪些？](https://mp.weixin.qq.com/s/B-UOykt19lwUqOdJ9y63Nw)

react-router 主要分成以下几个包：

* react-router: 实现了路由的核心功能
* react-router-dom：基于 react-router，加入了在浏览器运行环境下的一些功能
* react-router-native：基于 react-router，加入了 react-native 运行环境下的一些功能
* react-router-config: 用于配置静态路由的工具库

react-route-dom 常用组件：

* BrowserRouter、HashRouter
* Route
* Link、NavLink
* Switch
* Redirect

react-route-dom 常用 hooks：

例如：`import { useHistory } from "react-router-dom";const history = useHistory();`

* useHistory
* useParams
* useLocation

### React Router 模式及原理

[说说 React Router 有几种模式？实现原理？](https://mp.weixin.qq.com/s/UCG9aRmYHCirdrrS6YkdNg)

模式：

1. hash 模式：在 url 后面加上\#
2. history 模式，允许操作浏览器的曾经标签页或者框架里访问的会话历史记录

使用：

在 React Router 对应的模式及组件为

```javascript
import {
  BrowserRouter as Router,
  HashRouter as Router,
  Route,
} from 'react-router-dom'

// 作为顶层组件包裹其他组件
...
return (
  <Router>
    <Route path="/login" component={null}></Route>
    <Route path="/page/:id" component={<></>}></Route>
    <Route></Route>
  </Router>
)
...
```

原理：

以 hash 模式为例，hash 值改变时，触发全局 window 对象的 hashchange 事件，hashchnage 事件监听 url 的变化以进行 DOM 操作模拟页面跳转，react-router 也是基于这个原理

[说说 React Router 有几种模式？实现原理？](https://mp.weixin.qq.com/s/UCG9aRmYHCirdrrS6YkdNg)

### Immutable Data 的理解与使用

[说说你对 Immutable Data 的理解？如何应用在 React 项目中？](https://mp.weixin.qq.com/s/laYJ_KNa8M5JNBnIolMDAA)

理解：

1. 结构共享，树节点发生修复，只影响当前节点及父节点
2. 数据发生变化时，返回的新对象会尽量使用之前的数据结构，避免内存浪费

使用：

* 第三方库：immutable.js

### React render 原理及触发时机

[说说 React render 方法的原理？在什么时候会被触发？](https://mp.weixin.qq.com/s/M3jUtSOpP-BEkDlo84Omdg)

原理：

1. render 函数被调用时，返回一个 element（原生及自定义组件类最终都是转换为原生 DOM 标签形式的 element）
2. 虚拟 DOM 树与旧版本的树进行 diff 比较。更新 DOM 树，最新渲染成真实 DOM

触发时机：

1. **类组件**中，只要执行了 setState 方法，就**一定**会触发 render 函数
2. **函数组件**中，执行了 setState，若**值不变化**等，则**不会**触发 render
3. 组件的 props 改变不一定触发 render，
4. 若 props 来自父组件或者祖先的 state，则其 state 改变，则其子组件会重新渲染

## webpack\[待补充\]

### webpack 的理解

[webpack 的理解](https://mp.weixin.qq.com/s/3eQvXFcXJJCpRqbkBCKJ5A)

[webpack 文档：https://cloud.tencent.com/developer/doc/1250](https://cloud.tencent.com/developer/doc/1250)

解决的问题：

* 需要通过模块化的方式来开发
* 使用一些高级的特性来加快我们的开发效率或者安全性，比如通过 ES6+、TypeScript 开发脚本逻辑，通过 sass、less 等方式来编写 css 样式代码
* 监听文件的变化来并且反映到浏览器上，提高开发的效率
* JavaScript 代码需要模块化，HTML 和 CSS 这些资源文件也会面临需要被模块化的问题
* 开发完成后我们还需要将代码进行压缩、合并以及其他相关的优化

能力：

* 「编译代码能力」，提高效率，解决浏览器兼容问题
* 「模块整合能力」，提高性能，可维护性，解决浏览器频繁请求文件的问题
* 「万物皆可模块能力」，项目维护性增强，支持不同种类的前端模块类型，统一的模块化方案，所有资源文件的加载都可以通过代码控制

### webpack 构建过程（!）

[webpack 构建过程](https://mp.weixin.qq.com/s/PlqhRNZNIfBJHSVoVD3fHw)

![](../../.gitbook/assets/2021-05-07-11-13-01.png)

### webpack 的 loader

[webpack 的 loader](https://mp.weixin.qq.com/s/UrIH72bYufUxCoXs54QqlQ)

```javascript
module.exports = {
  module: {
    // rules为数组形式，可以配置多个loader
    rules: [
      {
        // 匹配规则一般为正则表达式
        test: /\.css$/,
        // 针对上述匹配到的文件类型，调用loader进行处理，链式调用，执行顺序为从右边左，从下到上，即sass-loader -> css-loader -> style-loader
        use: [
          { loader: 'style-loader' },
          {
            loader: 'css-loader',
            options: {
              modules: true,
            },
          },
          { loader: 'sass-loader' },
        ],
      },
    ],
  },
}
```

额外特性：

* `loader` 可以是同步的，也可以是异步的
* `loader` 运行在 `Node.js` 中，并且能够执行任何操作
* 除了常见的通过 `package.json` 的 `main` 来将一个 `npm` 模块导出为 `loader`，还可以在 `module.rules` 中使用 `loader` 字段直接引用一个模块
* 插件\(`plugin`\)可以为 `loader` 带来更多特性
* `loader` 能够产生额外的任意文件

常见 loader：

* style-loader: 将 css 添加到 DOM 的内联样式标签 style 里
* css-loader :允许将 css 文件通过 require 的方式引入，并返回 css 代码（css-loader 只负责 css 文件解析，需要配置 style-loader 才能插入到页面中）
* less-loader: 处理 less
* sass-loader: 处理 sass
* postcss-loader: 用 postcss 来处理 CSS
* autoprefixer-loader: 处理 CSS3 属性前缀，已被弃用，建议直接使用 postcss
* file-loader: 分发文件到 output 目录并返回相对路径
* url-loader: 和 file-loader 类似，但是当文件小于设定的 limit 时可以返回一个 Data Url
* html-minify-loader: 压缩 HTML
* babel-loader :用 babel 来转换 ES6 文件到 ES

### webpack 的 plugin

[webpack 的 plugin](https://mp.weixin.qq.com/s/w729tXTfgp0uXmsrJw248w)

作用：打包优化、资源管理、环境变量注入等，解决 loader 无法实现的其他事

```javascript
/**
 * plugin配置方式：通过配置文件导出对象中plugins属性传入new实例对象
 */
const HtmlWebpackPlugin = require('html-webpack-plugin'); // 通过 npm 安装
const webpack = require('webpack'); // 访问内置的插件
module.exports = {
  ...
  plugins: [
    new webpack.ProgressPlugin(),
    new HtmlWebpackPlugin({ template: './src/index.html' }),
  ],
};
```

常见的 plugin：

* AggressiveSplittingPlugin: 将原来的 chunk 分成更小的 chunk
* BabelMinifyWebpackPlugin: 使用 babel-minify 进行压缩
* BannerPlugin: 在每个生成的 chunk 顶部添加 banner
* CommonsChunkPlugin: 提取 chunks 之间共享的通用模块
* CompressionWebpackPlugin: 预先准备的资源压缩版本，使用 Content-Encoding 提供访问服务
* ContextReplacementPlugin: 重写 require 表达式的推断上下文
* CopyWebpackPlugin: 将单个文件或整个目录复制到构建目录
* DefinePlugin: 允许在编译时\(compile time\)配置的全局常量
* DllPlugin: 为了极大流少构建时间，进行分置打包
* EnvironmentPlugin: DefinePlugin 中 process.env S!的简写方式.
* ExtractTextWebpackPlugin: 从 bundle 中提取文本\(CSS\)到单独的文件
* HotModuleReplacementPlugin: 启用模块热替换\(Enable Hot Module Replacement - HMR\)
* HtmlWebpackPlugin: 简单创建 HTML 文件，用于服务器访问
* I18nWebpackPlugin: 为 bundle 增加国际化支持
* IgnorePlugin: 从 bundle 中排除某些模块
* LimitChunkCountPlugin: 设置 chunk 的最小/最大限制，以微调和控制 chunk
* LoaderOptionsPlugin: 用于从 webpack 1 迁移到 webpack 2
* MinChunkSizePlugin: 确保 chunk 大小超过指定限制
* NoEmitOnErrorsPlugin: 在输出阶段时，遇到编译错误跳过
* NormalModuleReplacementPlugin: 替换与正则表达式匹配的资源

### loader 和 plugin

[loader 和 plugin](https://mp.weixin.qq.com/s/U5J6nCANyKx3olFTzRVr6g)

loader: 文件加载器，加载文件并进行处理，例如编译、压缩等，最终打包到指定的文件中，运行在打包文件之前 plugin：解决 loader 无法实现的其他事情，例如打包优化、资源管理、环境变量注入等，在整个编译周期都起作用

### 热模块更新

[热模块更新](https://mp.weixin.qq.com/s/9PfpauvoX97gwtXwvk8Mcg)

HMR 全称 Hot Module Replacement，监听文件变化，以不刷新的形式更新页面

```javascript
/**
 * webpack的简单配置
 * 可以在修改css文件的时候达到热更新，但是修改js文件时还是会刷新页面
 */
const webpack = require('webpack')

module.exports = {
  // ...
  devServer: {
    // 开启HMR
    hot: true,
  },
}
```

* 通过 webpack-dev-server 创建两个服务器：提供静态资源的服务（express）和 Socket 服务
  * express server 负责直接提供静态资源的服务（打包后的资源直接被浏览器请求和解析）
  * socket server 是一个 websocket 的长连接，双方可以通信
    * 当 socket server 监听到对应的模块发生变化时，会生成两个文件.json（manifest 文件）和.js 文件（update chunk）
    * 通过长连接，socket server 可以直接将这两个文件主动发送给客户端（浏览器）
    * 浏览器拿到两个新的文件后，通过 HMR runtime 机制，加载这两个文件，并且针对修改的模块进行更新

### webpack proxy

[webpack proxy](https://mp.weixin.qq.com/s/6nQ-m9HL3-FENv6vF4dOnQ)

webpack-dev-server 是 webpack 官方推出的一款开发工具，将自动编译和自动刷新浏览器等一系列对开发友好的功能全部集成在了一起，proxy 工作原理实质上是利用 http-proxy-middleware 这个 http 代理中间件，实现请求转发给其他服务器

```javascript
// ./webpack.config.js
const path = require('path')

module.exports = {
  // ...
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 9000,
    proxy: {
      '/api': {
        target: 'https://api.github.com', // 代理到目标地址
      },
    },
    // ...
  },
}
```

注意：「服务器与服务器之间请求数据并不会存在跨域行为，跨域行为是浏览器安全策略限制」

### Webpack 性能优化

[Webpack 性能优化](https://mp.weixin.qq.com/s/Gq0VTuCmLHlAan85y6fUDQ)

优化手段：减小文件体积、分包、减少 http 请求等

1. JS 代码压缩（terser-webpack-plugin）
2. CSS 代码压缩（css-minimizer-webpack-plugin）
3. HTML 文件代码压缩（HtmlWebpackPlugin）
4. 文件大小压缩（compression-webpack-plugin）
5. 图片压缩（file-loader + image-webpack-loader）
6. Tree Shaking（js：usedExports、sideEffects；css：purgecss-plugin-webpack）
7. 代码分离（splitChunksPlugin）
8. 内联 chunk（InlineChunkHtmlPlugin）

### Webpack 构建速度

* 优化 loader 配置

  例如：babel-loader 可优化正则匹配，cacheDirectory 缓存输出，指定 include 的文件目录

* 合理使用 resolve.extendsions

  resolve.extendsions 解析文件，自动添加文件后缀

* 优化 resolve.modules

## CSS

### flex 弹性布局

[flex 弹性布局](https://mp.weixin.qq.com/s/OORqq5uK8jgjDV2Hkx0baA)

### Grid 布局（!）

[Grid 布局](https://mp.weixin.qq.com/s/5rs7f7SCclJnG88Veb-P9g)

Grid，由纵横组合而成网格布局

IE10 以下不支持，移动端不太友好

\`\`html

  
  \* {  
    padding: 0;  
    margin: 0;  
  }  
  
  .container {  
    display: grid;  
    grid-template-columns: repeat\(3,auto\);  
    grid-gap: 10px;  
    grid-template-rows: repeat\(2, 80px\);  
    background: \#ddd;  
  }  
  .item {  
    height: 80px;  
    background: \#0dd;  
  }  


 1

```text
## CSS3 新增特性

[CSS3 新增特性](https://mp.weixin.qq.com/s/RBtXfH3t-AAhjuLLOi0lGQ)

- 一些选择器，例如 nth-child、^=、\*=、$=等
- 边框属性，border-radius、box-shadow、border-image
- 背景，background-clip、background-origin、background-size、background-break
- 渐变，用于 background-image 中的 linear-gradient、radial-gradient
- 文本，word-wrap、text-overflow、text-shadow、text-decoration、-webkit-text-fill-color、-webkit-text-stroke-color、-webkit-stroke-width
- 颜色，rgba、hsla
- transition、transform、animation
- 布局，flex、grid、多列布局、媒体查询、混合模式等

## CSS 动画

[CSS 动画](https://mp.weixin.qq.com/s/azcij-vOQ16XOUnaF83npA)

- transition（渐变动画）

  ```css
  .base {
    width: 100px;
    height: 100px;
    color: black;
    border: 1px solid black;
    background-color: white;
    transition: all 1s ease-in 500ms; /* 需要变化的属性 过渡效果的时间 速度曲线 延迟触发时间 */
  }

  .base:hover {
    width: 200px;
    height: 200px;
    color: white;
    border: 2px solid red;
    background-color: black;
  }
```

* transform（转变动画，不支持 inline 元素，使用前可先设置 block，一般搭配 transform 使用）

  ```css
  .base {
    width: 100px;
    height: 100px;
    color: black;
    border: 1px solid black;
    background-color: white;
    transition: all 1s ease-in 500ms;
  }

  .base:hover {
    /* scale缩放x轴0.8倍，y轴1.5倍  rotate旋转35度 skew倾斜5度 translate位移垂直15px水平25px */
    transform: scale(0.8, 1.5) rotate(35deg) skew(5deg) translate(15px, 25px);
  }
  ```

* animation（自定义动画）

  ```css
  .base {
    width: 100px;
    height: 100px;
    color: black;
    border: 1px solid black;
    background-color: white;
  }

  .base:hover {
    animation: allAnima 1s ease-in 500ms forwards; /* forwards让动画保持最后一帧的状态 */
  }

  @keyframes allAnima {
    to {
      transform: scale(0.8, 1.5) rotate(35deg) skew(5deg) translate(15px, 25px);
    }
  }
  ```

### 回流与重绘

[回流与重绘](https://mp.weixin.qq.com/s/hLnFQmfScwK9bWwn6sMlmw)

通过设置元素的`display:none`来进行元素的隐藏，此时操作元素不会导致回流与重绘，这个过程被称为离线操作

避免回流：

* 如果想设定元素的样式，通过改变元素的 class 类名 （尽可能在 DOM 树的最里层）
* 避免设置多项内联样式
* 应用元素的动画，使用 position 属性的 fixed 值或 absolute 值
* 避免使用 table 布局，table 中每个元素的大小以及内容的改动，都会导致整个 table 的重新计算
* 对于那些复杂的动画，对其设置 position: fixed/absolute，尽可能地使元素脱离文档流，从而减少对其他元素的影响
* 使用 css3 硬件加速，可以让 transform、opacity、filters 这些动画不会引起回流重绘
* 避免使用 CSS 的 JavaScript 表达式

### 响应式设计

[响应式设计](https://mp.weixin.qq.com/s/5N5ZMIzACWj08mrZAa7fKg)

```markup
<!-- 
  必须声明viewport
  width=device-width：自适应手机屏幕尺寸宽度
  initial-scale：缩放的初始化
  maximum-scale：缩放比例的最大值
  user-scalable：是否允许缩放操作
 -->
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
```

实现方式：

* 媒体查询

  ```css
  /* 窗口在375px-600px之间时，设置字体为18px，2x的背景图 */
  @media screen (min-width: 375px) and (max-width: 600px) {
    body {
      font-size: 18px;
      background: url('bg@2x.png');
    }
  }
  ```

* 百分比（由于百分比的对照不一，容易造成布局复杂度高，不建议使用百分比实现响应式）
  * width、height 的属性的百分比依托于父元素的宽高
  * 子元素的 top、left、right、bottom 的百分比相对于直接的非 static 定位的父元素的宽（bottom、right）高（top、left）
  * 子元素的 padding 的百分比都相对于父元素的宽度 width，和高度 height 无关
  * 子元素的 margin 的百分比都相对于父元素的宽度 width，和高度 height 无关
  * border-radius 的百分比相对于自身的宽度 width
* vm/vh
* rem（相对于根元素 html 的 font-siz 属性，默认情况下 font-size 为 16px，即`1rem = 16px`）

  ```javascript
  /**
   * 设置rem始终为width的1/10
   */
  //动态为根元素设置字体大小
  function init() {
    // 获取屏幕宽度
    var width = document.documentElement.clientWidth
    // 设置根元素字体大小。此时为宽的10等分
    document.documentElement.style.fontSize = width / 10 + 'px'
  }

  //首次加载应用，设置一次
  init()
  // 监听手机旋转的事件的时机，重新设置
  window.addEventListener('orientationchange', init)
  // 监听手机窗口变化，重新设置
  window.addEventListener('resize', init)
  ```

### CSS 性能优化

[CSS 性能优化](https://mp.weixin.qq.com/s/7GdzjfV-wWgUvZPCWCLRwQ)

可以从选择器嵌套、属性特性、减少 http 请求、css 代码加载顺序等方面考虑

* 内联首屏关键 CSS（解析 html 时遇到外部 css 要先下载才能渲染，内联可以下载 html 时就渲染）
* 异步加载`CSS`（避免阻塞渲染）
  * 使用`javascript`动态创建`link`标签插入到`head`标签最后的位置

    ```javascript
    // 创建link标签
    const outCSS = document.createElement('link')
    outCSS.rel = 'stylesheet'
    outCSS.href = 'outStyles.css'
    // 插入到head标签的最后位置
    document.head.insertBefore(outCSS, document.head.childNodes[document.head.childNodes.length - 1].nextSibling)
    ```

  * 设置`link`标签的**media**属性为`noexist`，使其在不阻塞页面渲染的情况下加载，加载完再将`media`设置为`screen`或者`all`，让浏览器解析它

    ```markup
    <link ref="stylesheet" href="outStyles.css" media="noexist" onload="this.media='all'" />
    ```

  * 设置`link`标签的**rel**属性为`alternate`，效果同上，加载完再将`rel`设置为`stylesheet`

    ```markup
    <link ref="alternate" href="outStyle.css" onload="this.ref='stylesheet'" />
    ```
* 资源压缩（利用`webpack`、`gulp`/`grunt`、`rollup`等模块化工具，将 css 代码进行压缩，使文件变小，降低了浏览器的加载时间）
* 合理使用选择器（CSS 的匹配规则是从右到左的）
  * 嵌套不要多于三层
  * 少用通配符和属性选择器
  * 使用`id`选择器没必要再嵌套
* 减少使用昂贵的属性（`box-shadow`、`border-radius`、`filter`、`opacity`、`:nth-child`等）
* 不要使用`@import`（css 引入有两种，一是`link`，二是`@import`，`@import`可能会导致下载紊乱，需要解析前一个`@import`才能下载下一个`@import`）
* 减少重排重绘
* 雪碧图
* 小的 icon 转为 base64 编码
* CSS3 动画或者过渡尽量使用 transform 和 opacity，不要使用 left、top 属性

### 文本溢出省略

[文本溢出省略](https://mp.weixin.qq.com/s/69DhD8cUliuZZZl5tml5yA)

```markup
<div class="text-after">一段文本</div>
```

单行文本：

```css
div {
  text-overflow: ellipsis; /* 文本溢出时的显示方式为省略符 */
  white-space: nowrap; /* 文本不换行 */
  overflow: hidden; /* 超出限定宽度则隐藏 */
}
```

text-overflow 只有在设置了 overflow:hidden 和 white-space:nowrap 才能够生效的

多行文本：

```css
/**
 * 1. 基于高度截断（伪元素 + 定位）
 * 特点：兼容性号，响应式截断
 */
div {
  position: relative;
  width: 400px;
  line-height: 20px;
  height: 40px; /* 可以通过js获取文本所在元素高度来设置此高度及.text-after的展示（addClass） */
  word-break: break-all; /* 使英文不会整段换行 */
}

.text-after::after {
  display: inherit;
  content: '...';
  position: absolute;
  bottom: 0;
  right: 0;
  padding-left: 20px;
  background: linear-gradient(to right, transparent, #fff 55%);
}

/**
 * 2. 基于行数截断
 * 特点：只适用webkit内核的浏览器
 */
div {
  width: 100px;
  display: -webkit-box; /* 弹性伸缩盒子模型 */
  -webkit-box-orient: vertical; /* 伸缩盒子的排列方式 */
  -webkit-line-clamp: 2; /* 显示的文本行数 */
  overflow: hidden; /* 超出部分隐藏 */
  text-overflow: ellipsis; /* 溢出部分省略号展示 */
}
```

### CSS 预处理器

[CSS 预处理器](https://mp.weixin.qq.com/s/HUEnnJKJDTp8Vlvu2NfUzA)

[CSS、Sass、Scss，以及 sass 和 scss 的区别](https://segmentfault.com/a/1190000019573996)

预处理语言：

* [sass](https://www.sass.hk/guide/)，sass3 引入了新语法 scss
* [less](https://less.bootcss.com/#%E6%A6%82%E8%A7%88)
* [stylus](https://stylus.bootcss.com/)

预处理语言特性：

变量，作用域名，代码混合，嵌套，代码模块化

```css
// scss
$red: #c00;
p {
  color: $red;
}
```

```css
// less
@red: #c00;
p {
  color: @red;
}
```

```css
// stylus
red = #000

p
  color: red
```

### 更小的字号

[更小的字号](https://mp.weixin.qq.com/s/4z3uYqqWV9IvJkXCXGrhvg)

```css
 {
  /* 缩放50% */
  zoom: 0.5;
  zoom: 50%;
  transform: scale(0.5);

  /**
   * 字体不随窗口大小变化
   * 可选属性 percentage：字体显示的大小；auto：默认，字体大小会根据设备/浏览器来自动调整；none:字体大小不会自动调整
   */
  -webkit-text-size-adjust: none;
}
```

* zoom: 有兼容性问题，缩放会改变元素占据的空间大小，触发重排
* scale: 兼容较好，缩放不会改变元素的占据，不触发重排
* -webkit-text-size-adjust: 不兼容 chrome 27 之后的版本

### 画三角形

[画三角形](https://mp.weixin.qq.com/s/KtKFnuRtK-PDESrVeGclEw)

border 相邻的两边，为相切 45%；border 不相邻的两边，则 90%

![](../../.gitbook/assets/2021-04-23-18-26-44.png)

```css
/**
 * 画普通三角形
 */
 {
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 0 50px 50px;
  border-color: transparent transparent #d9534f; /*  */
}
```

### 视觉差动

[视觉差动](https://mp.weixin.qq.com/s/zidEa2l1cG7wgTCdxXgFvw)

使用 css 形式实现视觉差滚动效果的方式有：

`background-attachment`

代码片段：[attachment.html](https://github.com/ashen114/my-blog/tree/a75766a82180e5a9b3746941753d748ee0a92be6/技术总结/code/前端特效练习/视觉差/attachment.html)

`transform:translate3D`

代码片段：[translate3D.html](https://github.com/ashen114/my-blog/tree/a75766a82180e5a9b3746941753d748ee0a92be6/技术总结/code/前端特效练习/视觉差/translate3D.html)

### CSS 选择器

[CSS 选择器](https://mp.weixin.qq.com/s/hCaRwKswMVdK8ZrYfqcTcA)

内联 &gt; ID 选择器 &gt; 类选择器 &gt; 标签选择器

代码片段：[https://codepen.io/ashen114/pen/qBRMVJZ](https://codepen.io/ashen114/pen/qBRMVJZ)

```markup
<ul id="nav" class="list">
  <li>123</li>
</ul>
```

```css
#nav {
  background: red;
}
.list {
  background: yellow;
}
ul {
  background: green;
}
```

### 盒模型

[盒模型](https://mp.weixin.qq.com/s/Kue_0BOBWaBuSjRQe9cnew)

> 涉及：标准盒模型、怪异盒模型

盒子组成部分 = `content` + `padding` + `border` + `margin`

![&#x6807;&#x51C6;&#x76D2;&#x5B50;&#x6A21;&#x578B;](../../.gitbook/assets/2021-03-29-09-40-09.png)

标准盒子模型\(`box-sizing: content-box`\)

* 宽度：`width` = `content`
* 高度：`height` = `content`

![IE&#x602A;&#x5F02;&#x76D2;&#x5B50;&#x6A21;&#x578B;](../../.gitbook/assets/2021-03-29-09-40-22.png)

IE 怪异盒子模型\(box-sizing: border-box\)

* 宽度：`width` = `content` + `padding` + `border`
* 高度：`width` = `content` + `padding` + `border`

## JavaScript

### web 攻击方式

[web 攻击方式](https://mp.weixin.qq.com/s/WWxWJwjnsfINg2QgmPSa_w)

> 设计：web 安全，网络安全

#### XSS\(Cross Site Scripting\)：跨站脚本攻击

* 攻击目的：获取 `cookie` 等用于识别客户端身份的信息
* 攻击来源类型：存储型（提交到数据库）、反射型（构造恶意的 URL 调用接口）、DOM 型（构造恶意 URL 由浏览器解析并执行）
* 防范措施：主要从两个方面预防，一是攻击者的提交，二是浏览器的执行

  * 攻击者的提交：在使用 `.innerHTML`、`.outerHTML`、`document.write()` 时要特别小心，不要把不可信的数据作为 HTML 插到页面上，而应尽量使用 `.textContent`、`.setAttribute()` 等，若是 Vue 技术栈，则需要注意 `v-html` 的使用，可覆写 `v-html` 指令，过滤 XSS 攻击代码：[https://blog.csdn.net/lingxiaoxi\_ling/article/details/105851736](https://blog.csdn.net/lingxiaoxi_ling/article/details/105851736)

  ![&#x8986;&#x5199;v-html&#x6307;&#x4EE4;&#xFF0C;&#x8FC7;&#x6EE4;XSS&#x653B;&#x51FB;&#x4EE3;&#x7801;](../../.gitbook/assets/2021-03-29-18-25-34.png)

  * 浏览器的执行：DOM 中内联事件监听器，a 标签的 href，js 的`eval()`、`setTimeout()`、`setInterval()`...

#### CSRF\(Cross-site request forgery\)：跨站请求伪造

* 防止 csrf 常用方案如下：
  * 阻止不明外域的访问
    * 同源检测
    * Samesite Cookie
  * 提交时要求附加本域才能获取的信息
    * CSRF Token
    * 双重 Cookie 验证

#### SQL 注入攻击

[第一关-很简单的一个注入](https://github.com/ashen114/my-blog/blob/main/%E6%8A%80%E6%9C%AF%E6%80%BB%E7%BB%93/WeBug3.0%E7%BB%83%E4%B9%A0%E7%AC%94%E8%AE%B0.md#%E7%AC%AC%E4%B8%80%E5%85%B3-%E5%BE%88%E7%AE%80%E5%8D%95%E7%9A%84%E4%B8%80%E4%B8%AA%E6%B3%A8%E5%85%A5)

### 单点登陆

单点登录（Single Sign On），简称为 SSO

1. 同域名下的单点登录

   利用 Cookie 的 domain 属性设置为父级域名，将 Session ID\(获取 Token\) 保存到父域名

2. 不同域名下的单点登录
3. 在验证中心获取 token，提供 url 携带 token 至目标系统，验证 token 合法性，合法则提供，保存 cookie；否则回到验证中心登陆
4. 在验证中心获取 token，使用 iframe + postMessage\(\) 发送 token 到各个目标系统中，可以写入到 localStorage 中

   ```javascript
   /** 验证中心 http://a.com */

   // 获取token
   const token = '123'

   // 动态创建不可见的iframe，在iframe中设置跨域的HTML
   let iframe = document.createElement('iframe')
   iframe.src = 'http://b.com/main.html'
   document.body.append(iframe)

   // 使用postMessage()将token传递到目标系统
   setTimeout(() => {
     iframe.contentWindow.postMessage(token, 'http://b.com')
   }, 1000)
   // 发送完成后，移除iframe
   setTime(() => {
     iframe.remove()
   }, 2000)
   ```

   ```javascript
   /** 目标系统之一 http://b.com */

   // 设置监听器，获取并存储token
   window.addEventListener('message', (event) => {
     localStorage.setItem('token', event.data)
   })
   ```

### 断点继传

[断点继传](https://mp.weixin.qq.com/s/5KPCzcX5T0UbR4_P1pd4NQ)

> 涉及：分片切割、Web Work

[Web Workers API](https://developer.mozilla.org/zh-CN/docs/Web/API/Worker)

#### Web Workers API Demo

```markup
<p>
  计数：
  <output id="result">849</output>
</p>
<p>
  <button onclick="startWorker()">启动 Worker</button>
  <button onclick="stopWorker()">停止 Worker</button>
</p>
```

```javascript
// 前端代码
var w = null
function startWorker() {
  if (typeof Worker !== 'undefined') {
    if (typeof w == 'undefined') {
      w = new Worker('https://www.w3school.com.cn/example/html5/demo_workers.js')
    }
    w.onmessage = function (event) {
      document.getElementById('result').innerHTML = event.data
    }
  } else {
    document.getElementById('result').innerHTML = 'Sorry, your browser does not support Web Workers...'
  }
}

function stopWorker() {
  w.terminate()
}
```

```javascript
// demo_workers.js
var i = 0

function timedCount() {
  i = i + 1
  postMessage(i)
  setTimeout('timedCount()', 500)
}

timedCount()
```

### 上拉加载下拉刷新

[上拉加载下拉刷新](https://mp.weixin.qq.com/s/BigZ8UbvWCl251VZzPEcOw)

> 涉及：滚动监听、触摸监听、窗口、元素宽高

代码片段：[https://codepen.io/ashen114/pen/dyNygbo](https://codepen.io/ashen114/pen/dyNygbo)

第三方库：开源社区也有很多优秀的解决方案，如 iscroll、better-scroll、pulltorefresh.js 库等等

### 判断元素在可视区域内

[元素是否在可视区域](https://mp.weixin.qq.com/s/7lZL6Zkm2AqwfzysXcBz6Q)

> 涉及：元素宽高、结点插入、`IntersectionObserver` 元素可视监听

代码片段：[https://codepen.io/ashen114/pen/wvgwMXP](https://codepen.io/ashen114/pen/wvgwMXP)

```javascript
/**
 * 教程：http://www.ruanyifeng.com/blog/2016/11/intersectionobserver_api.html
 * IntersectionObserver是浏览器原生提供的构造函数，接受两个参数：callback是可见性变化时的回调函数，option是配置对象（该参数可选）。
 * var io = new IntersectionObserver(callback, option);
 */
var intersectionObserver = new IntersectionObserver(function (entries) {
  // 如果不可见，就返回
  if (entries[0].intersectionRatio <= 0) return
  loadItems(10)
  console.log('Loaded new items')
})

// 开始观察
intersectionObserver.observe(document.querySelector('.scrollerFooter'))
```

### 防抖与节流

[防抖与节流](https://mp.weixin.qq.com/s/xGMUjQiZEI7PV8Wlvf_YNA)

> 涉及：闭包、滚动、输入监听、鼠标移动监听

代码片段：[https://codepen.io/ashen114/pen/wvgwMXP](https://codepen.io/ashen114/pen/wvgwMXP)

* 节流： n 秒内只执行一次，n 秒内重复触发只执行一次

  ```javascript
  // 时间戳写法
  function throttled1(fn, delay = 500) {
    let oldTime = Date.now()
    return function (...args) {
      let newTime = Date.now()
      if (newTime - oldTime >= delay) {
        fn.apply(null, args)
        oldTime = Date.now()
      }
    }
  }

  // 定时器写法
  function throttled2(fn, delay = 500) {
    let timer = null
    return function (...args) {
      if (!timer) {
        timer = setTimeout(() => {
          fn.apply(this, args)
          timer = null
        }, delay)
      }
    }
  }

  // 时间戳+定时器的写法（更精确的节流）
  function throttled(fn, delay = 500) {
    let timer = null
    let startTime = null
    return function () {
      let curTime = Date.now() // 当前时间
      let remaining = delay - (curTime - startTime) // 从上一次执行到现在，剩余的时间
      let context = this
      let args = arguments
      timer && clearTimeout(timer) // 每次执行，先清除现有的定时器
      if (remaining <= 0) {
        fn.apply(context, args)
        startTime = Date.now()
      } else {
        timer = setTimeout(fn, remaining)
      }
    }
  }
  ```

* 防抖：n 秒后执行一次，n 秒内重复触发，则重新计时，n 秒后执行一次

  ```javascript
  // 简单版：n 秒后执行一次
  function debounce1(fn, delay) {
    let timer = null
    return function () {
      let context = this
      let args = arguments

      clearTimeout(timer)
      timer = setTimeout(() => {
        fn.apply(context, args)
      }, delay)
    }
  }

  // 立即执行版
  function debounce2(fn, delay, immediate) {
    let timer = null

    return function () {
      let context = this
      let args = arguments

      timer && clearTimeout(timer) // 注意：timer被clearTimeout后，依然会有值
      if (immediate) {
        let isNowCall = !timer // 是否应该立即执行
        timer = setTimeout(() => {
          timer = null // 已经过了delay，则可以重新立即执行
        }) // 给timer赋值，防止在delay时间内调用还是为null
        if (isNowCall) {
          fn.apply(context, args)
        }
      } else {
        // 非立即执行情况下，则重新计时
        timer = setTimeout(() => {
          fn.apply(context, args)
        }, delay)
      }
    }
  }
  ```

### 浮点精度丢失

[浮点精度丢失](mei-ri.md)

> 涉及：二进制...

0.1 + 0.2 != 0.3

因为 0.1 实际上不等于 0.1

```javascript
// 使用toPrecision得到21位的精度
;(0.1).toPrecision(21) !== 0.1
```

```javascript
/**
 * 获取精度小数（一般精度达到16位即可）
 */
function strip(num, precision = 12) {
  return +parseFloat(num.toPrecision(precision))
}
/**
 * 精确加法
 */
function add(num1, num2) {
  const num1Digits = (num1.toString().split('.')[1] || '').length
  const num2Digits = (num2.toString().split('.')[1] || '').length
  const baseNum = Math.pow(10, Math.max(num1Digits, num2Digits))
  return (num1 * baseNum + num2 * baseNum) / baseNum
}
```

### 函数缓存

[函数缓存](https://mp.weixin.qq.com/s/rbzx-KxC1PlhRV2_Wtbr4Q)

> 涉及：闭包、高阶函数、柯里化

实现原理：闭包、柯里化、高阶函数

```javascript
const memoize = function (func, content) {
  let cache = Object.create(null) // 在当前函数作用域定义了一个空对象，用于缓存运行结果
  content = content || this
  // 运用柯里化返回一个函数，返回的函数由于闭包特性，可以访问到cache
  return (...key) => {
    // 然后判断输入参数是不是在cache的中。如果已经存在，直接返回cache的内容，如果没有存在，使用函数func对输入参数求值，然后把结果存储在cache中
    if (!cache[key]) {
      cache[key] = func.apply(content, key)
    }
    return cache[key]
  }
}

const add = (a, b) => a + b
const calc = memoize(add) // 函数缓存
calc(10, 20) // 30
calc(10, 20) // 30 缓存
```

### 函数式编程

[函数式编程](https://mp.weixin.qq.com/s/4UhogYD4HK7bBtmW12HmKg)

> 涉及：编程范式、高阶函数、柯里化、组合与管道函数

主要编程范式：命令式，声明式，函数式

相比命令式编程，函数式编程更加强调程序执行的结果而非执行的过程，倡导利用若干简单的执行单元让计算结果不断渐进，逐层推导复杂的运算，而非设计一个复杂的执行过程

例如：

```javascript
// 命令式编程
var array = [0, 1, 2, 3]
for (let i = 0; i < array.length; i++) {
  array[i] = Math.pow(array[i], 2)
}

// 函数式方式
;[0, 1, 2, 3].map((num) => Math.pow(num, 2))
```

### JavaScript 本地缓存

[JavaScript 本地缓存](https://mp.weixin.qq.com/s/XwzBwC7tpnZ590B3TXI8BQ)

> 涉及：本地存储

`JavaScript` 本地缓存方式

* `cookie`
* `sessionStorage`
* `localStorage`
* `indexedDB`

#### cookie

存储大小：4kb 左右

常用属性：

* Expires: 设置 `Cookie` 的过期时间，例如：`Expires=Wed, 21 Oct 2015 07:28:00 GMT`
* Max-Age: 设置在 `Cookie` 失效之前需要经过的秒数（优先级比`Expires`高），例如：`Max-Age=604800`
* Domain: 指定了 `Cookie` 可以送达的主机名
* Path: 指定了一个 URL 路径，这个路径必须出现在要请求的资源的路径中才可以发送 `Cookie` 首部

例如：

![](../../.gitbook/assets/2021-03-18-15-55-56.png)

例子：

```javascript
document.cookie = 'username=Bill Gates; expires=Sun, 31 Dec 2017 12:00:00 UTC; path=/'
```

#### localStorage

存储大小：5MB 左右

```javascript
localStorage.setItem('username', { name: 'ashen' })
localStorage.key(0) // 'username' 获取第一个键名（非按顺序存储，而是key会按照a-z排序）
console.log(localStorage.getItem('username')) // '[object, Object]' 只能存入字符串，无法直接存对象
localStorage.removeItem('username')
localStorage.clear() // 一次性清除所有存储
```

由于 localStorage 的持久化储存，不主动清除不会过期，因此可拓展

```javascript
/**
 * 缓存值到localStorage，可带上过期时间（单位：秒）
 * 例如缓存test的值10秒：newStorage.setItem({ name: 'test', value: '测试10秒过期', expires: 10 })
 */
export const newStorage = {
  /**
   * 设置缓存
   * @param {StorageItem} params 缓存值
   */
  setItem(params: StorageItem) {
    let obj: StorageItem = {
      name: 'storage',
      value: '',
      expires: 0,
      startTime: new Date().getTime(), // 记录何时将值存入缓存，毫秒级
    }
    let options: StorageItem = {}
    // 将obj和传进来的params合并
    Object.assign(options, obj, params)
    if (options.expires) {
      // 如果options.expires设置了的话
      // 以options.name为key，options为值放进去
      options.expires = options.expires * 1000
      localStorage.setItem(options.name, JSON.stringify(options))
    } else {
      // 如果options.expires没有设置，就判断一下value的类型
      let type = Object.prototype.toString.call(options.value)
      // 如果value是对象或者数组对象的类型，就先用JSON.stringify转一下，再存进去
      if (type === '[object Object]') {
        options.value = JSON.stringify(options.value)
      }
      if (type === '[object Array]') {
        options.value = JSON.stringify(options.value)
      }
      localStorage.setItem(options.name, options.value)
    }
  },
  /**
   * 获取缓存的值
   * @param name 缓存的key
   * @returns values || null
   */
  getItem(name: string) {
    let item: any = localStorage.getItem(name)
    // 先将拿到的试着进行json转为对象的形式
    try {
      item = JSON.parse(item)
    } catch (error) {
      // 如果不行就不是json的字符串，就直接返回
      item = item
    }
    console.info(item)
    // 如果有startTime的值，说明设置了失效时间
    if (item && item.startTime) {
      let date = new Date().getTime()
      // 何时将值取出减去刚存入的时间，与item.expires比较，如果大于就是过期了，如果小于或等于就还没过期
      if (date - item.startTime > item.expires) {
        // 缓存过期，清除缓存，返回false
        localStorage.removeItem(name)
        return false
      } else {
        // 缓存未过期，返回值
        return item.value
      }
    } else {
      // 如果没有设置失效时间，直接返回值
      return item
    }
  },
  /**
   * 移出缓存
   * @param name 缓存的key
   */
  removeItem(name) {
    localStorage.removeItem(name)
  },
  /**
   * 移除全部缓存
   */
  clear() {
    localStorage.clear()
  },
}
```

#### sessionStorage

`sessionStorage` 和 `localStorage` 使用方法基本一致，唯一不同的是生命周期，一旦页面（会话）关闭，`sessionStorage` 将会删除数据

#### indexedDB

`IndexedDB` 的存储空间是没有限制

所有操作都是异步的，相比 `LocalStorage` 同步操作性能更高，尤其是数据量较大时

原生支持储存 JS 的对象

是个正经的数据库，持久化，意味着数据库能干的事它都能干

[使用教程](https://segmentfault.com/a/1190000019006851)

```javascript
var data = [
  {
    id: 1,
    name: 'Tom',
    age: '18',
  },
  {
    id: 2,
    name: 'Tommy',
    age: '16',
  },
]
// 打开数据库，两个参数（数据库名字，版本号），如果数据库不存在则创建一个新的库
var request = window.indexedDB.open('myDatabase', '1')
// 数据库操作过程中出错，则错误回调被触发
request.onerror = (event) => {
  console.log(event)
}
// 数据库操作一切正常，所有操作后触发
request.onsuccess = (event) => {
  var db = event.target.result
  // 数据读取
  var usersObjectStore = db.transaction('users').objectStore('users')
  var userRequest = usersObjectStore.get(1)
  userRequest.onsuccess = function (event) {
    console.log(event.target.result)
  }
}
// 创建一个新的数据库或者修改数据库版本号时触发
request.onupgradeneeded = (event) => {
  var db = event.target.result
  // 创建对象仓库用来存储数据，把id作为keyPath，keyPath必须保证不重复，相当于数据库的主键
  var objectStore = db.createObjectStore('users', { keyPath: 'id' })
  // 建立索引，name和age可能重复，因此unique设置为false
  objectStore.createIndex('name', 'name', { unique: false })
  objectStore.createIndex('age', 'age', { unique: false })
  // 确保在插入数据前对象仓库已经建立
  objectStore.transaction.oncomplete = () => {
    // 将数据保存到数据仓库
    var usersObjectStore = db.transaction('users', 'readwrite').objectStore('users')
    data.forEach((data) => {
      usersObjectStore.add(data)
    })
  }
}
```

#### 区别

> 数据与服务器之间的交互方式，cookie 的数据会自动的传递到服务器，服务器端也可以写 cookie 到客户端；sessionStorage 和 localStorage 不会自动把数据发给服务器，仅在本地保存

* 标记用户与跟踪用户行为的情况，推荐使用 cookie
* 适合长期保存在本地的数据（令牌），推荐使用 localStorage
* 敏感账号一次性登录，推荐使用 sessionStorage
* 存储大量数据的情况、在线文档（富文本编辑器）保存编辑历史的情况，推荐使用 indexedDB

### 内存泄露

[内存泄露](https://mp.weixin.qq.com/s/01_qwiL37Jz9nY57fh7fDA)

> 涉及：垃圾回收机制、闭包、定时器、DOM、事件监听

* 标记清除（标记进入环境，离开环境）

  ```javascript
  var m = 0,
    n = 19 // 把 m,n,add() 标记为进入环境。
  add(m, n) // 把 a, b, c标记为进入环境。
  console.log(n) // a,b,c标记为离开环境，等待垃圾回收。
  function add(a, b) {
    a++
    var c = a + b
    return c
  }
  ```

* 引用计数

  ```javascript
  const arr = [1, 2, 3, 4] // 尽管后面的代码没有用到arr，它还是会持续占用内存
  console.log('hello world')

  // 通过设置arr为null，就解除了对数组[1,2,3,4]的引用，引用次数变为 0，就被垃圾回收了
  arr = null
  ```

有了垃圾回收机制，不代表不用关注内存泄露。那些很占空间的值，一旦不再用到，需要检查是否还存在对它们的引用。如果是的话，就必须手动解除引用

#### 常见内存泄露

1. 意外的全局变量

```javascript
function foo(arg) {
  bar = 'this is a hidden global variable'
}
```

1. foo 调用自己，this 指向了全局对象（window）

```javascript
function foo() {
  this.variable = 'potential accidental global'
}

foo()
```

1. 定时器也常会造成内存泄露

```javascript
// 如果id为Node的元素从DOM中移除，该定时器仍会存在，同时，因为回调函数中包含对someResource的引用，定时器外面的someResource也不会被释放
var someResource = getData()
setInterval(function () {
  var node = document.getElementById('Node')
  if (node) {
    // 处理 node 和 someResource
    node.innerHTML = JSON.stringify(someResource)
  }
}, 1000)
```

1. 闭包，维持函数内局部变量，使其得不到释放

```javascript
function bindEvent() {
  var obj = document.createElement('XXX')
  var unused = function () {
    console.log(obj, '闭包内引用obj obj不会被释放')
  }
  obj = null // 解决方法
}
```

1. 没有清理对 DOM 元素的引用

```javascript
const refA = document.getElementById('refA')
document.body.removeChild(refA) // dom删除了
console.log(refA, 'refA') // 但是还存在引用能console出整个div 没有被回收
refA = null
console.log(refA, 'refA') // 解除引用
```

1. 使用事件监听 `addEventListener` 监听的时候

在不监听的情况下应该使用 `removeEventListener` 取消对事件监听

### 尾递归

[尾递归](https://mp.weixin.qq.com/s/5EefijUaPjb5ol-T_n-sgw)

> 涉及：递归

尾递归特性

* 在尾部调用的是函数自身
* 可通过优化，使得计算仅占用常量栈空间（普通递归会为每一层返回点开辟栈来储存，次数过多容易造成栈溢出，尾递归则只存在一个调用记录，不会发送栈溢出）

  ```javascript
  /**
   * 普通的递归
   * 空间复杂度：O(n)
   * 如果n等于5，这个方法要执行5次，才返回最终的计算表达式，这样每次都要保存这个方法，就容易造成栈溢出，
   */
  function factorial(n) {
    if (n === 1) return 1
    return n * factorial(n - 1) // 每次都需要保留结果
  }

  factorial(5, 6) // 120
  ```

  ```javascript
  /**
   * 尾递归
   * 空间复杂度：O(1)
   * 每一次返回的就是一个新的函数，不带上一个函数的参数，也就不需要储存上一个函数了。尾递归只需要保存一个调用栈
   */
  function factorial(n, total) {
    if (n === 1) return total
    return factorial(n - 1, n * total) // 返回新的函数
  }

  factorial(5, 6) // 120
  ```

应用场景：

```javascript
/**
 * 数组求和
 */
function sum(arr, total) {
  if (!arr.length) {
    return total
  }
  return sum(arr, total + arr.pop()) // 每次循环，取出数组最后一位 用于与total相加
}

sum([1, 2, 3, 4], 0) // 10
```

```javascript
/**
 * 斐波那契数列
 * 0,1,1,2,3,5,8,13,21,34....
 */
function factorial(n, start = 0, total = 1) {
  if (n <= 2) {
    return total
  }
  return factorial(n - 1, total, total + start) // 循环条件, 上次的结果作为下次的开始值, 每次将上次的结果 + 上次的开始值
}

factorial(4) // 2
```

```javascript
/**
 * 数组扁平化
 * 将多维数组 [1,2,3, [1,2,3, [1,2,3]]] 转为 一维数组 [1,2,3,1,2,3,1,2,3]
 */
function flat(arr = [], result = []) {
  arr.forEach((item) => {
    result = result.concat(Array.isArray(item) ? flat(item, []) : item)
  })
  return result
}

flat([1, 2, 3, [1, 2, 3, [1, 2, 3]]]) // [1,2,3,1,2,3,1,2,3]
```

```javascript
/**
 * 对象格式化
 * 将对象的键转为小写 { NAME: 'APPLE', INFO: { ID: '1' } } => { name: 'APPLE', info: { id: '1' }}
 */
function keysLower(obj) {
  let reg = new RegExp('([A-Z]+)', 'g')
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      let temp = obj[key]
      if (reg.test(key.toString())) {
        // 将修改后的属性名重新赋值给temp，并在对象obj内添加一个转换后的属性
        temp = obj[
          key.replace(reg, function (result) {
            return result.toLowerCase()
          })
        ] = obj[key]
        // 将之前大写的键属性删除
        delete obj[key]
      }
      // 如果属性是对象或者数组，重新执行函数
      if (typeof temp === 'object' || Object.prototype.toString.call(temp) === '[object Array]') {
        keysLower(temp)
      }
    }
  }
  return obj
}

keysLower({ NAME: 'APPLE', INFO: { ID: '1' } }) // { name: 'APPLE', info: { id: '1' }}
```

拓展：

* js 回调函数、闭包、递归、尾调用、尾递归：[https://blog.csdn.net/weixin\_42291794/article/details/107936451](https://blog.csdn.net/weixin_42291794/article/details/107936451)
  * 回调函数：一个函数，参数为另一个函数，当满足某个条件是执行该参数函数
  * 闭包：一个函数，return 返回另一个函数（不是调用），在里面的函数中引用外面函数的变量
  * 递归：函数自己调用自己
  * 尾调用：一个函数，最后一步执行的操作是调用另一个函数,不能有任何其他操作（正确为：`return fn()`），`return fn()+1` 后面有赋值操作，`fn()` 后面有 `return undefined` ，所以都不行。只能在严格模式生效，因为非严格模式有 `arguments` 、 `caller` 等保存参数和调用该函数的函数的信息，可以跟踪函数的调用栈
    * 函数内部使用严格模式：函数参数不能有默认值、解构赋值、`rest` 参数（扩展用算符…）
  * 尾递归：尾调用中最后一步调用的是自己
  * 柯里化：将多参数的函数转化成单参数形式，可以使用 ES6 的函数参数默认值，让默认只传一个参数
  * 蹦床函数：一个函数，接收另一个函数为参数（改参数一般为真正的逻辑代码），当该参数为函数时执行该函数。即返回一个函数，然后执行，不是在函数中调用函数。将递归执行转化为循环执行，可以减少调用帧。
    * 调用帧：保存着函数调用位置和内部变量等信息，当在 a 函数中调用 b 函数时，a 的调用帧上方就会产生 b 的调用帧
    * 调用栈：递归会产生调用帧，所有调用帧就形成调用栈，很容易产生“栈溢出（Stack Overflow）”。尾调用只存在一个调用帧，可以解决栈溢出

### BOM 对象

[BOM 对象](https://mp.weixin.qq.com/s/Kd1hDLS9MqWYSZU9H68wrg)

> 涉及：浏览器 API

BOM: Browser Object Model, 核心对象是 `window`

常用 API：`location`（路由），`navigator`（浏览器属性），`screen`（浏览器窗口信息），`history`（url 历史记录）

### DOM 对象

[DOM 对象](https://mp.weixin.qq.com/s/naODDoX2w_qTrmheISx3Dw)

> 涉及：操作 DOM

```markup
<div>
  <p title="标题">内容</p>
</div>
```

`div` 、`p` 是元素节点 `内容` 是文本节点 `title` 是属性节点

DOM 元素属性：父级元素节点`parentNode`, 孩子元素节点`childNodes`, 首个孩子元素节点`firstChild`, 最后一位的孩子元素节点`lastChild`, 相邻的下一个元素节点`nextSibling`, 相邻的上个元素节点`previousSibling`

操作 DOM：

* 创建节点

  ```javascript
  // 创建元素节点
  const divNode = document.createElement('div')

  // 创建文本节点
  const textNode = document.createTextNode('content')

  // 创建属性节点（可以是自定义属性），另外创建属性一般使用elementNode.setAttribute(name,value)
  const attributeNode = document.createAttribute('custom')

  // 创建文档碎片
  const fragment = document.createDocumentFragment()

  // 将文档碎片作为子节点插入到 content 元素节点上
  const contentElement = document.getElementsByClassName('content')[0] // <div class="content"></div>
  divNode.append(textNode) // 组合得到 <div> content </div>
  fragment.appendChild(divNode).setAttributeNode(attributeNode) // 组合得到 <div custom="">content</div>
  contentElement.appendChild(fragment) // <div class="content">  <div custom="">content</div> </div>
  ```

* 获取节点

  ```javascript
  // document/element.querySelector(任意css选择器)：获取单个DOM元素（从上至下优先匹配的首个）
  document.querySelector('.element')
  document.querySelector('#element')
  document.querySelector('div')
  document.querySelector('[name="username"]') // [任意属性="属性值"]
  document.querySelector('div + p > span') // 查找div节点的兄弟节点的子节点span

  // document/element.querySelectorAll(任意css选择器)：获取所有匹配的DOM元素节点列表（使用方法与querySelector一致）

  // document.getElementById('id值')：指定的id的对象引用

  // document.getElementByClassName('class属性值')：所有匹配的class的对象集合

  // document.getElementByTagName('html标签名')：所有匹配标签的对象集合

  // document.getElementsByName('name属性值')：所有匹配name=属性值的对象集合（注意Elements带s）

  // document.documentElement：返回html下的DOM元素节点（[html,head,script,body...]）

  // document.all：返回页面所有标签的集合 （<html><head></head><body></body>...）
  ```

* 更新节点
  * `innerHTML`：可以提供 HTML 片段修改 DOM 节点
  * `innerText`、`textContent`：自动对字符串进行 HTML 编码，保证无法设置任何 HTML 标签；innerText 读取的文本为无格式文本，textContent 读取的文本会包含文本节点的格式
  * `style`：操作节点的样式属性，遇到使用-连接符的属性需要转为驼峰命名，例如`font-size` =&gt; `fontSize`
* 添加节点
  * innerHTML：会替换原本的节点的元素
  * 父节点.appendChild\(子节点\)：把子节点添加到父节点上

    例如：

    ```markup
    <!-- 操作DOM前的DOM结构 -->
    <li id="js">JavaScript</li>
    <ul id="list">
      <li id="html">HTML</li>
    </ul>
    ```

    ```javascript
    const list = document.getElementById('list')

    // 移动标签
    const js = document.getElementById('js')
    list.appendChild(js) // 将id为js的标签移动到id为list的父节点下

    // 新增标签
    const li = document.createElement('li') // 创建新的标签
    li.id = 'css'
    li.innerText = 'CSS'
    list.appendChild(li)
    ```

    ```markup
    <!-- 操作DOM后的DOM结构 -->
    <ul id="list">
      <li id="html">HTML</li>
      <li id="js">JavaScript</li>
      <li id="css">CSS</li>
    </ul>
    ```

  * `父节点.insertBefore(子节点, 被插队的节点)`：将子节点插入到父节点下指定子节点前
  * `document.setAttribute('属性名', '属性值')`：给指定的元素添加属性节点，会覆盖已有的同名属性
* 删除节点

  ```markup
  <div id="container">
    <ul id="list">
      <li id="html">HTML</li>
      <li id="js">JavaScript</li>
    </ul>
  </div>
  ```

  ```javascript
  const js = document.getElementById('js')
  const parent = js.parentElement // 删除节点需要先获取待删节点的父节点，同等于document.getElementById('list')
  parent.removeChild(js) // 调用父节点的removeChild删掉对应的节点

  const container = document.getElementById('container')
  container.appendChild(js) // 被删除的节点虽然从文档树中被移除，但是还存在内存中，可以再次被使用
  ```

### 正则表达式

[正则表达式](https://mp.weixin.qq.com/s/ITri1T0EA7PlPIF6QTBHmw)

> 涉及：正则表达式

#### 创建

1. 字面量：

```javascript
const testReg = /\d+/g
```

1. 构造函数

```javascript
const rule = '\\d+' // 需要使用\\转义\
const testReg = new RegExp(rule, 'g')
```

#### 匹配规则

| 规则 | 描述 |  |
| :--- | :--- | :--- |
| `\` | 转义 |  |
| `^` | 匹配输入的开始 |  |
| `$` | 匹配输入的结束 |  |
| `*` | 匹配前一个表达式 0 次或多次 |  |
| `+` | 匹配前面一个表达式 1 次或者多次。等价于{1,} |  |
| `?` | 匹配前面一个表达式 0 次或者 1 次。等价于{0,1} |  |
| `.` | 默认匹配除换行符之外的任何单个字符 |  |
| `x(?=y)` | 匹配'x'仅仅当'x'后面跟着'y'。这种叫做先行断言 |  |
| `(?<=y)x` | 匹配'x'仅当'x'前面是'y'.这种叫做后行断言 |  |
| `x(?!y)` | 仅仅当'x'后面不跟着'y'时匹配'x'，这被称为正向否定查找 |  |
| `(?<!y)x` | 仅仅当'x'前面不是'y'时匹配'x'，这被称为反向否定查找 |  |
| \`x | y\` | 匹配‘x’或者‘y’ |
| `{n}` | n 是一个正整数，匹配了前面一个字符刚好出现了 n 次 |  |
| `{n,}` | n 是一个正整数，匹配前一个字符至少出现了 n 次 |  |
| `{n,m}` | n 和 m 都是整数。匹配前面的字符至少 n 次，最多 m 次 |  |
| `[xyz]` | 一个字符集合。匹配方括号中的任意字符 |  |
| `[^xyz]` | 匹配任何没有包含在方括号中的字符 |  |
| `\b` | 匹配一个词的边界，例如在字母和空格之间 |  |
| `\B` | 匹配一个非单词边界 |  |
| `\d` | 匹配一个数字 |  |
| `\D` | 匹配一个非数字字符 |  |
| `\f` | 匹配一个换页符 |  |
| `\n` | 匹配一个换行符 |  |
| `\r` | 匹配一个回车符 |  |
| `\s` | 匹配一个空白字符，包括空格、制表符、换页符和换行符 |  |
| `\S` | 匹配一个非空白字符 |  |
| `\w` | 匹配一个单字字符（字母、数字或者下划线） |  |
| `\W` | 匹配一个非单字字符 |  |

#### 匹配方法

| 方法 | 描述 |  |
| :--- | :--- | :--- |
| `regexp.exec(str)` | 一个在字符串中执行查找匹配的 RegExp 方法，它返回一个数组（未匹配到则返回 null）。 |  |
| `regexp.test(str)` | 一个在字符串中测试是否匹配的 RegExp 方法，它返回 true 或 false。 |  |
| `str.match(regexp)` | 一个在字符串中执行查找匹配的 String 方法，它返回一个数组，在未匹配到时会返回 null。 |  |
| `str.matchAll(regexp)` | 一个在字符串中执行查找所有匹配的 String 方法，它返回一个迭代器（iterator）。 |  |
| `str.search(regexp)` | 一个在字符串中测试匹配的 String 方法，它返回匹配到的位置索引，或者在失败时返回-1。 |  |
| `str.replace(regexp)` | 一个在字符串中执行查找匹配的 String 方法，并且使用替换字符串替换掉匹配到的子字符串。 |  |
| \`str.split\(regexp | string\)\` | 一个使用正则表达式或者一个固定字符串分隔一个字符串，并将分隔后的子字符串存储到数组中的 String 方法。 |

#### 拓展

[正则表达式在 ES2018 中的新写法](https://blog.51cto.com/15077562/2618812)

命名捕获组方法： `(?<组别>)`

例子：

组别会作为对象的键，匹配到的字符串则作为其的值

```javascript
const result = /(?<protocol>https?:)/.exec('https://localhost:8080/?a=b#xxxx')
console.log(result.groups) // { protocol: "https:" }
```

完整返参如下：

![](../../.gitbook/assets/2021-04-01-16-43-45.png)

#### 常用场景

```javascript
/**
 * 校验QQ合法性
 * 规则：5-15位数字，不以0开头
 */
const reg = /^[1-9][0-9]{4,14}$/
const isValid = reg.test('12345') // true
```

```javascript
/**
 * 校验用户账号合法性
 * 规则：5-20个以字母开头、可带数字、"_"、"."的字符串
 */
const reg = /^[a-zA-Z]{1}([a-zA-Z0-9] | [._]){4,19}$/
const isValid = reg.test('qwerty123')
```

```javascript
/**
 * 將url提取为对象
 */
// 匹配http或者https作为protocol的值
const protocol = '(?<protocol>https?:)'
// (?<hostname>[^/#?:]+) 匹配主机名 ； (?::) 匹配最少有一个:  ； (?<port>\\d+) 匹配端口号，使用\\d来匹配\d的类型
const host = '(?<host>(?<hostname>[^/#?:]+)(?::(?<port>\\d+))?)'
// 匹配路径  \\/ 用于匹配 / 第一个的\我为了使第二个\生效，第二个\则是为了使用/生效
const path = '(?<pathname>(?:\\/[^/#?]+)*\\/?)'
const search = '(?<search>(?:\\?[^#]*)?)'
const hash = '(?<hash>(?:#.*)?)'
const reg = new RegExp(`^${protocol}\/\/${host}${path}${search}${hash}$`)
function execURL(url) {
  const result = reg.exec(url)
  if (result) {
    return result.groups
  }
  return {
    protocol: '',
    host: '',
    hostname: '',
    port: '',
    pathname: '',
    search: '',
    hash: '',
  }
}
console.log(execURL('https://localhost:8080/?a=b#xxxx'))
// {
//  hash: "#xxxx"
//  host: "localhost:8080"
//  hostname: "localhost"
//  pathname: "/"
//  port: "8080"
//  protocol: "https:"
//  search: "?a=b"
// }
// 待分析
function execUrlParams(str) {
  str = str.replace(/^[#?&]/, '')
  const result = {}
  if (!str) {
    //如果正则可能配到空字符串，极有可能造成死循环，判断很重要
    return result
  }
  const reg = /(?:^|&)([^&=]*)=?([^&]*?)(?=&|$)/y
  let exec = reg.exec(str)
  while (exec) {
    result[exec[1]] = exec[2]
    exec = reg.exec(str)
  }
  return result
}
console.log(execUrlParams('#')) // {}
console.log(execUrlParams('##')) //{'#':''}
console.log(execUrlParams('?q=3606&src=srp')) //{q: "3606", src: "srp"}
console.log(execUrlParams('test=a=b=c&&==&a=')) //{test: "a=b=c", "": "=", a: ""}
```

### 事件循环

[事件循环](https://mp.weixin.qq.com/s/9iN7XR1PwXfua8SrabOi5w)

> 涉及：宏任务、微任务

JavaScript 由于早期设计为操作 DOM，因此使用单线程，为了解决单线程的堵塞，使用事件循环机制

事件循环分为：同步任务（主线程）、异步任务（网络请求，定时函数等）

异步任务：分为微任务和宏任务

```javascript
console.log(1)

setTimeout(() => {
  console.log(2)
}, 0)

new Promise((resolve, reject) => {
  console.log(3)
  resolve()
}).then(() => {
  console.log(4)
})

console.log(5)

/**
 * 执行顺序： 1 3 5 4 2
 * 分析： 1 3 5 为同步任务，在主线程中执行，顺序执行
 * 2 和 4 则是异步任务，其中 4 在异步任务中属于微任务优先执行，2 属于宏任务，在微任务执行后执行
 */
```

微任务（执行时机是在主函数执行结束之后、当前宏任务结束之前）：

* Promise.then
* MutaionObserver
* Object.observe（已废弃；Proxy 对象替代）
* process.nextTick（Node.js）

宏任务（宏任务的时间粒度比较大，执行的时间间隔是不能精确控制的，对一些高实时性的需求就不太符合）：

* script \(可以理解为外层同步代码\)
* setTimeout/setInterval
* UI rendering/UI 事件
* postMessage、MessageChannel
* setImmediate、I/O（Node.js）

async 异步与 await 等待

async 函数返回一个 promise 对象，下面两种方法等效

```javascript
function fn() {
  return Promise.resolve('test')
}

async function fn() {
  return 'test'
}
```

await 会阻塞后面的代码执行并压入微任务队列，await 后面可以是普通值或者 promise 对象

```javascript
async function fn1() {
  console.log(1)
  await fn2()
  console.log(3) // 阻塞，加入微任务队列
}

async function fn2() {
  console.log(2)
}

fn1()
console.log(4)

// 执行fn1 打印1 其后执行fn2 打印 2 fn2后续代码堵塞进入微任务队列 继续打印同步任务（主流程）的4 其后回到唯一的异步任务上执行微任务打印3
// 结果： 1 2 4 3
```

```javascript
async function async1() {
  console.log('async1 start')
  await async2()
  console.log('async1 end')
}
async function async2() {
  console.log('async2')
}
console.log('script start')
setTimeout(function () {
  console.log('settimeout')
})
async1()
new Promise(function (resolve) {
  console.log('promise1')
  resolve()
}).then(function () {
  console.log('promise2')
})
console.log('script end')

// script start、async1 start、async2、promise1、script end、async1 end、promise2、settimeout
```

### call、apply、bind

[call、apply、bind](https://mp.weixin.qq.com/s/jpnsDcfybw7h31WYv0ZClw)

> 涉及：this 指向

call、apply、bind 改变函数的执行时的上下文，即 this 指向

```javascript
// 调用对象不同的this指向

const name = 'a'
const obj = {
  name: 'b',
  say: function () {
    console.log(this.name)
  },
}

obj.say() // b ；因为this指向obj
setTimeout(obj.say, 0) // a ；因为this指向window

setTimeout(obj.say.bind(obj), 0) // b ；bind使用this指向了obj
```

```javascript
// apply、call、bind的参数形式

const obj = {
  name: 'a',
}

function fn(...args) {
  console.log(this, args)
}

fn.apply(obj, [1, 2, 3]) // this指向，参数数组
fn(1, 2, 3) // this指向window（不传，传null或者undefined的时候都指向window）

fn.call(obj, 1, 2, 3) // this指向，参数列表
fn(1, 2, 3) // this指向window

const bindFn = fn.bind(obj) // 与apply、call不同，bind执行后不会立即执行
bindFn(1, 2, 3) // this指向obj，除非重新bind，否则不会改变this指向
/**
 * bindFn(1, 2, 3) 等价于 fn.bind(obj)(1, 2, 3) 等价于 fn.bind(obj, 1)(2, 3) ； bind接受的参数格式相对宽容
 */
fn(1, 2, 3) // this指向window
```

```javascript
// 实现bind功能
Function.prototype.myBind = function () {
  let args = Array.prototype.slice.call(arguments) //  拷贝arguments
  let context = args.splice(0, 1)[0] // 将第一位参数作为上下文
  let fn = this // 当前函数的this指向
  let noop = function () {}

  let res = function () {
    let rest = Array.prototype.slice.call(arguments) // 拷贝arguments
    // this只和运行的时候有关系，所以这里的this和上面的fn不是一码事，new res()和res()在调用的时候，res中的this是不同的东西
    return fn.apply(this instanceof noop ? this : context, args.concat(rest))
  }

  if (this.prototype) {
    noop.prototype = this.prototype
  }

  res.prototype = new noop()

  return res
}

function foo(name) {
  this.name = name
}

var obj = {}

// 上下文 功能  done
var bar = foo.myBind(obj) // this指向obj
bar('jack') // jack赋给this.name,this指向obj，因此obj.name == 'jack'
console.log(obj.name) // 'jack'

// 参数 功能   done
var tar = foo.myBind(obj, 'rose')
tar()
console.log(obj.name) // 'rose'
// new 功能   error
var alice = new bar('alice')
console.log(obj.name) // 'rose'
console.log(alice.name) // 'alice'
```

### AJAX 原理

[AJAX](https://mp.weixin.qq.com/s/335AoHbNEcT76srafR9gqw)

> 涉及：

原理：通过 XmlHttpRequest 对象 向服务器发起异步请求，服务器接收 HttpRequest 的请求，返回请求数据

```javascript
/**
 * 实现AJAX的过程
 */
// 1. 创建XMLHttpRequest对象
const xhr = new XMLHttpRequest();
// 2. 通过open与服务器建立连接（method: 'GET'/'POST'; url: 服务器地址, async: 是否异步执行操作，默认true; user,password：可选的用户密码认证凭证，默认null）
xhr.open(method, url,  [async][, user][, password])
// 3. 发送数据给服务器（body：参数，GET请求设置为null）
xhr.send([body])
// 4. 绑定响应事件
xhr.onreadystatechange = function(e) {
  if (xhr.readyState === 4 ) { // 请求完毕
    if (xhr.status >= 200 && xhr.status <= 300) {
      console.log(xhr.responseText);
    } else {
      console.error(xhr.status)
    }
  }
}
```

```javascript
/**
 * 封装AJAX
 * @param options 请求参数
 */
function ajax(options) {
  // 1. 创建XMLHttpRequest对象
  const xhr = new XMLHttpRequest()

  // 2. 初始化参数的内容
  options = options || {}
  options.type = (options.type || 'GET').toUpperCase()
  options.dataType = options.dataType || 'json'
  const params = options.data

  // 3. 发送请求
  if (options.type === 'GET') {
    xhr.open('GET', options.url + '?' + params, true)
    xhr.send(null)
  } else if (options.type === 'POST') {
    xhr.open('POST', options.url, true)
    xhr.send(params)
  }

  // 4. 接收请求
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      let status = xhr.status
      if (status >= 200 && status < 300) {
        options.success && options.success(xhr.responseText, xhr.responseXML)
      } else {
        options.fail && options.fail(status)
      }
    }
  }
}

// 调用
ajax({
  type: 'post',
  dataType: 'json',
  data: {},
  url: 'https://xxxx',
  success: function (text, xml) {
    //请求成功后的回调函数
    console.log(text)
  },
  fail: function (status) {
    ////请求失败后的回调函数
    console.log(status)
  },
})
```

### new 操作符

[new 操作符](https://mp.weixin.qq.com/s/7XcetC-3ksYAl2OShuw7CA)

> 涉及：原型链

new 操作符用于创建构造函数的实例

* 创建一个新的对象 obj
* 将对象与构建函数通过原型链连接起来
* 将构建函数中的 this 绑定到新建的对象 obj 上
* 根据构建函数返回类型作判断，如果是原始值则被忽略，如果是返回对象，需要正常处理

![](../../.gitbook/assets/2021-04-07-11-48-44.png)

```javascript
/**
 * 实现new
 */
function myNew(Func, ...args) {
  // 1. 创建一个对象
  const obj = {}

  // 2. 新对象原型指向构造函数原型对象
  obj.__proto__ = Func.prototype

  // 3. 将构造函数的this所指向新对象
  let result = Func.apply(obj, args)

  // 4. 根据返回值判断
  return result instanceof Object ? result : obj
}

// 调用
function Person(name, age) {
  this.name = name
  this.age = age
}
Person.prototype.say = function () {
  console.log(this.name)
}
let p = myNew(Person, 'ashen', 12)
console.log(p) // Person { name: 'ashen', age: 12 }
p.say() // 'ashen'
```

### 事件委托

[事件委托](https://mp.weixin.qq.com/s/p9UEUN8GB2-kMRL52714Dg)

> 涉及：事件

将子元素的事件绑定到父级元素上

* 减少整个页面所需的内存，提升整体性能
* 动态绑定，减少重复工作

例如：

完整代码片段: [https://codepen.io/ashen114/pen/oNBoaZE](https://codepen.io/ashen114/pen/oNBoaZE)

```markup
<ul id="list">
  <li>1</li>
  <li>2</li>
  <li>3</li>
  <li>4</li>
  ...
</ul>
```

```javascript
/**
 * [错误：给每个li绑定onclick事件会导致内存消耗过大]
 */
const lis = document.getElementsByTagName('li')
Object.keys(lis).forEach((i) => {
  lis[i].onclick = (e) => {
    show.innerText = e.target.innerText
  }
})

/**
 * [正确：给父元素绑定点击事件，再匹配对应的子元素进行事件触发]
 */
document.getElementById('list').addEventListener('click', (e) => {
  // 兼容性处理
  let event = e || window.event
  let target = event.target || event.secElement

  // 判断和匹配目标元素
  if (target.nodeName.toLocaleLowerCase() === 'li') {
    show.innerText = target.innerText
  }
})
```

适合事件委托的事件有：`click`，`mousedown`，`mouseup`，`keydown`，`keyup`，`keypress`

* `focus`、`blur` 这些事件没有事件冒泡机制，所以无法进行委托绑定事件
* `mousemove`、`mouseout` 这样的事件，虽然有事件冒泡，但是只能不断通过位置去计算定位，对性能消耗高，因此也是不适合于事件委托的

### typeof 和 instanceof

[typeof 和 instanceof](https://mp.weixin.qq.com/s/6SIgXfAA8J98oQi1qEnXnA)

> 涉及：数据类型，类型判断

typeof 可以识别 number undefined boolean symbol object function（一般用于判断基本类型）

```javascript
typeof 1 // number
typeof '1' // string
typeof undefined // 'undefined'
typeof true // 'boolean'
typeof Symbol() // 'symbol'

// null [] {} console 都为 'object'
typeof null // 'object'
typeof [] // 'object'
typeof {} // 'object'
typeof console // 'object'

typeof console.log // 'function'
```

instanceof 用于检测构造函数的 prototype 属性是否出现在某个实例对象的原型链上（可以用来判断对象的原型）

```javascript
1 instanceof Number // false
new Number(1) instanceof Number // true

'1' instanceof String // false
new String(1) instanceof String // true

;[] instanceof Array // true
;[] instanceof Object // true

let obj = {}
obj instanceof Object // true

let Parent = () => {}
let child = new Parent()
child instanceof Parent // true
```

* typeof 会返回一个变量的基本类型，instanceof 返回的是一个布尔值
* instanceof 可以准确地判断复杂引用数据类型，但是不能正确判断基础数据类型

通用的数据类型判断方法：`Object.prototype.toString`

```javascript
Object.prototype.toString({}) // "[object Object]"
Object.prototype.toString.call({}) // "[object Object]" 同上结果，加上call也ok
Object.prototype.toString.call(1) // "[object Number]"
Object.prototype.toString.call('1') // "[object String]"
Object.prototype.toString.call(true) // "[object Boolean]"
Object.prototype.toString.call(function () {}) // "[object Function]"
Object.prototype.toString.call(null) // "[object Null]"
Object.prototype.toString.call(undefined) // "[object Undefined]"
Object.prototype.toString.call(/123/g) // "[object RegExp]"
Object.prototype.toString.call(new Date()) // "[object Date]"
Object.prototype.toString.call([]) // "[object Array]"
Object.prototype.toString.call(document) // "[object HTMLDocument]"
Object.prototype.toString.call(window) // "[object Window]"
```

```javascript
/**
 * 封装数据类型判断
 */
function getType(obj) {
  let type = typeof obj
  if (type !== 'object') {
    // 先进行typeof判断，如果是基础数据类型，直接返回
    return 'typeof ' + type
  }
  // 对于typeof返回结果是object的，再进行如下的判断，正则返回结果
  return Object.prototype.toString.call(obj).replace(/^\[object (\S+)\]$/, '$1')
  // 或者 return Object.prototype.toString.call(obj).slice(8, -1)
}
```

### 事件与事件流

[事件与事件流](https://mp.weixin.qq.com/s/avXtM79vyywVq6Gg6ui29A)

> 涉及：捕获、冒泡

事件流

* **从外到内**进行事件**捕获**
* **从内到外**进行事件**冒泡**

事件模型

* 原始事件模型（只支持冒泡，同一类型只能绑定一次）

  1. 在 html 标签上绑定

  ```markup
  <input id="btn" onclick="handler1()" />
  ```

  1. 在 DOM 节点上绑定

  ```javascript
  let btn = document.getElementById('btn')
  btn.onclick = handler2
  ```

* 标准事件模型（有捕获，处理和冒泡的阶段，可同时绑定多个事件，不冲突）

  ```javascript
  /**
   * 事件绑定监听
   * @param {string} eventType 指定事件类型，如 'click'
   * @param {function} handler 事件处理函数
   * @param {boolean} useCapture true就在捕获阶段执行，false就在冒泡阶段执行，一般设置为false与IE浏览器保持一致
   */
  DOM.addEventListener(eventType, handler, useCapture)

  /**
   * 事件移除监听
   * @params 参数同上
   */
  DOM.removeEventListener(eventType, handler, useCapture)
  ```

* IE 事件模型（只有处理和冒泡阶段）

  ```javascript
  /**
   * 事件绑定监听
   * @param {string} eventType 指定事件类型，如 'onclick' （注：IE的事件带on前缀）
   * @param {function} handler 事件处理函数
   */
  DOM.attachEvent(eventType, handler)

  /**
   * 事件移除监听
   * @params 参数同上
   */
  DOM.detachEvent(eventType, handler)
  ```

### 执行上下文与执行栈

[执行上下文与执行栈](https://mp.weixin.qq.com/s/FUYdVhz7KVCiSE_rDhVJUA)

> 涉及：执行栈

执行上下文

* 类型
* 全局执行上下文：只有一个，在浏览器指的是 window 对象
* 函数执行上下文：函数被调用就会被创建，每次调用就创建新的执行上下文
* `Eval` 函数执行上下文：运行在 `eval` 函数中的代码，不建议使用
* 生命周期
  * 创建阶段（函数被调用的时候）：确认 this，词法环境和变量环境
  * 执行阶段（执行变量赋值和代码执行）
  * 回收阶段（虚拟机回收执行上下文）

执行栈（调用栈）

特点：后进先出

```javascript
// 1. 首先创建全局上下文压入执行栈 [global]

function a() {
  console.log('1')
  b() // 3. 执行a函数的过程中，遇到b函数被调用，创建b函数的执行上下文并压入栈中 [b, a, global]
  // 4. b函数执行完毕后，被推出执行栈，继续执行a函数 [a, global]
  console.log('3')
}
function b() {
  console.log('2')
}

a() // 2. a函数被调用，创建a函数的执行上下文并压入栈中 [a, global]
// 4. a函数被执行完毕，被推出执行栈 [global]
// 5. 所有代码被执行完毕，全局上下文也被推出栈中，程序结束 []
```

### this 对象

[this 对象](https://mp.weixin.qq.com/s/_qwvmw34Hm6AZxJuIgHY6Q)

> 涉及：this

this 关键字是函数运行时自动生成的一个内部对象，只能在函数内部使用，总指向调用它的对象

例如：

```javascript
var name = 'window'
function baz() {
  // 当前调用栈是：baz
  // 因此，当前调用位置是全局作用域

  console.log('baz:', this.name)
  this.name = 'baz'
  bar() // <-- bar的调用位置
}

function bar() {
  // 当前调用栈是：baz --> bar
  // 因此，当前调用位置在baz中

  console.log('bar:', this.name)
  this.name = 'bar'
  foo() // <-- foo的调用位置
}

function foo() {
  // 当前调用栈是：baz --> bar --> foo
  // 因此，当前调用位置在bar中

  console.log('foo:', this.name)
}

baz() // <-- baz的调用位置

// baz: window
// bar: baz
// foo: bar
```

绑定规则

* 默认绑定（默认的 this 指向全局）

  在浏览器上的非严格模式下，默认 this 指向全局对象 window

* 隐式绑定（函数被调用时候的 this 指向）

  函数被调用的时候，this 指向其上级对象

  ```javascript
  function fn() {
    console.log(this.name)
  }

  var name = 'window'
  let obj = {}
  obj.name = 'obj'
  obj.getName = fn

  window.obj.getName() // 调用getName的上级是obj，因此this指向obj，输出'obj'

  let fn2 = obj.getName
  fn2() // 实际上是window调用的，因此this指向window，输出'window'
  ```

* new 绑定（this 指向实例对象）

  ```javascript
  function fn() {
    this.name = 'obj'
    // 若return 对象，则this指向该对象，如果不返回或者返回简单类型的时候，则this指向该实例对象
  }

  let obj = new fn()
  console.log(obj.name) // 输出'obj'
  ```

* 显式绑定

  使用 `apply` 、 `call` 和 `bind` 进行 `this` 的改变

this 指向的例子：

```javascript
function Parent() {
  this.a = 9
  this.b = [8, 2, this.a]
  this.c = { demo: 4 }
  this.show = function () {
    console.log(this.a, this.b, this.c.demo)
  }
}

function Child() {
  this.a = 2
  this.change = function () {
    this.b.push(this.a)
    this.a = this.b.length
    this.c.demo = this.a++ // 相当于 a = a + 1;c = a
  }
}

Child.prototype = new Parent() // 原型链继承

var parent = new Parent() // { a:9, b:[8, 2, 9], c.demo:4 }
// child1和child2实例了的Child在原型链上引用的是同一个Parent，因此内存共享
var child1 = new Child() // { a:2 }
var child2 = new Child() // { a:2 }

child1.a = 11 // { a: 11 }
child2.a = 12 // { a: 12 }

parent.show() // 9   [8, 2, 9]  4
child1.show() // 11  [8, 2, 9]  4
child2.show() // 12  [8, 2, 9]  4

// child1和child2没有this.b，因此修改的都是同一份原型链上的Parent的this.b
child1.change() // { b:[8, 2, 9, 11],     a:5, c.demo: 4}  在赋值c.demo时，a++了，因此a+1
child2.change() // { b:[8, 2, 9, 11, 12], a:6, c.demo: 5 }  此时，b和c因为都是引用Parent上的，因此都是 b:[8, 2, 9, 11, 12] c.demo:5

/**
 * 因为child1，child2继承的Parent实例和parent新建的Parent实例不是同一个，因此上述的change不会有影响，
 * 若为同一个，即 var parent = new Parent(); Child.prototype = parent; 则该处为  9 [8, 2, 9, 11, 12]  5
 */
parent.show() // 9 [8, 2, 9]         4
child1.show() // 5 [8, 2, 9, 11, 12]  5
child2.show() // 6 [8, 2, 9, 11, 12]  5
```

箭头函数（没有 this，内部 this 默认指向 window）

优先级：new 绑定优先级 &gt; 显示绑定优先级 &gt; 隐式绑定优先级 &gt; 默认绑定优先级

### 继承

[继承](https://mp.weixin.qq.com/s/mnQde8T6frvYautX4Ajdxg)

> 涉及：继承

* 原型链

  通过 prototype 继承

  ```javascript
  function Parent() {
    this.name = 'parent'
    this.arr = [1, 2, 3]
  }
  function Child() {
    this.name = 'child'
  }
  Child.prototype = new Parent()
  // 潜在问题：若实例使用的是同一个原型对象，则内存空间是共享的
  let child1 = new Child()
  let child2 = new Child()

  child1.arr.push(4)

  console.log(child1.arr) // [1,2,3,4]
  console.log(child2.arr) // [1,2,3,4]
  ```

* 构造函数继承（借助 call）

  通过在子类中使用 call 继承

  ```javascript
  function Parent() {
    this.name = 'parent'
  }
  Parent.prototype.getName = function () {
    return this.name
  }

  function Child() {
    Parent.call(this) // 父类借助call，绑定child的this
  }

  let child = new Child() // 没有原型链继承的内存共享问题

  console.log(child.name) // 'parent'
  console.log(child.getName()) // 报错，因为通过构造函数继承 *不能继承父级* 的 *原型链* 上的 *属性* 和 *方法*
  ```

* 组合继承（原型链继承 + 构造函数）

  保留了原型链继承的可继承父级原型链的属性和方法的优点，构造函数的内存不共享问题 不过需要继承两次，造成性能开销问题

  ```javascript
  function Parent() {
    this.name = 'parent'
    this.arr = [1, 2, 3]
  }
  Parent.prototype.getName = function () {
    return this.name
  }

  function Child() {
    // 2. 通过构造函数继承
    Parent.call(this)
    this.name = 'child'
  }

  // 1. 通过原型链继承
  Child.prototype = new Parent()
  Child.prototype.constructor = Child

  let child1 = new Child()
  let child2 = new Child()

  child1.arr.push(4)

  console.log(child1.arr) // [1,2,3,4]  不共享内存，因此两者不一样
  console.log(child2.arr) // [1,2,3]
  ```

* 原型式继承

  使用 Object.create 的方法实现普通对象的继承

  因为 Object.create 是浅拷贝，所以缺点和原型链继承一样，会共享内存

  ```javascript
  let parent = {
    name: 'parent',
    arr: [1, 2, 3],
    getName: function () {
      return this.name
    },
  }

  let child1 = Object.create(parent)
  child1.name = 'child1'
  child1.arr.push(4)

  let child2 = Object.create(parent)
  child2.name = 'child2'
  child2.arr.push(5)

  console.log(child1.name) // 'child1'
  console.log(child1.name === child1.getName()) // true
  console.log(child1.arr) // [1,2,3,4,5]

  console.log(child2.name) // 'child2'
  console.log(child2.name === child2.getName()) // true
  console.log(child2.arr) // [1,2,3,4,5]
  ```

* 寄生式继承

  在函数中使用 Object.create 进行父类继承，并返回该对象 缺点和上述的原型式一样，内存会共享

  ```javascript
  let parent = {
    name: 'parent',
    arr: [1, 2, 3],
    getName: function () {
      return this.name
    },
  }

  function clone(original) {
    let obj = Object.create(original)
    obj.getArr = function () {
      return this.arr
    }
    return obj
  }

  let child1 = clone(parent)
  child1.arr.push(4)

  let child2 = clone(parent)
  child2.arr.push(5)

  console.log(child1.arr) // [1,2,3,4,5]
  console.log(child1.arr === child1.getArr()) // true
  console.log(child2.arr) // [1,2,3,4,5]
  console.log(child2.arr === child2.getArr()) // true
  ```

* 寄生组合式继承（最优的继承方法：寄生式继承 + 构造函数继承）

  在子类上的原型链上使用 Object.create 继承父类的原型链，使其能继承原型链上的属性和方法 子类使用构造函数继承父类的属性和方法

  ```javascript
  function clone(parent, child) {
    // 此处不是使用new parent()，而是使用 Object.create 继承，避免多一次构造的内存开销
    child.prototype = Object.create(parent.prototype)
    child.prototype.constructor = child
  }

  function Parent() {
    this.name = 'parent'
    this.arr = [1, 2, 3]
  }
  Parent.prototype.getName = function () {
    return this.name
  }

  function Child() {
    // 使用构造函数继承
    Parent.call(this)
    this.name = 'child'
  }

  clone(Parent, Child)

  let child1 = new Child()
  child1.arr.push('child1')

  let child2 = new Child()
  child2.arr.push('child2')

  console.log(child1.arr) // [1,2,3,'child1']
  console.log(child2.arr) // [1,2,3,'child2']
  ```

  ```javascript
  class Parent {
    constructor(name, arr) {
      this.name = name
      this.arr = arr
    }
    // 相当于 Parent.prototype.getName = function() {}
    getName = function () {
      return this.name
    }
  }

  class Child extends Parent {
    constructor(name, arr) {
      super(name, arr)
    }
  }

  let child1 = new Child('child1', [1, 2, 3])
  child1.arr.push('child1')

  let child2 = new Child('child2', [1, 2, 3])
  child2.arr.push('child2')

  console.log(child1.arr) // [1,2,3, 'child1']
  console.log(child2.arr) // [1,2,3, 'child2']
  ```

  > 利用 `babel` 工具对`extends` 进行代码转换后，实际上也是使用的寄生组合式继承

### 原型和原型链（!）

[原型和原型链](https://mp.weixin.qq.com/s/Z4fs2MZKb6b_bIEukfLePg)

> 涉及：原型、原型链

每个对象都拥有一个原型对象 ，原型对象的 prototype 上都有一个自由属性 constructor 指向原型本身，原型对象拥有原型并可从中继承方法和属性

函数都有一个特殊的属性，叫做 prototype

一切的对象都继承自 Object 对象

一切的函数对象（包括 Object 对象），都继承自 Function 对象

Object 对象直接继承自 Function 对象

```javascript
function Person(name) {
  this.name = name
  this.age = 18
  this.sayName = function () {
    console.log(this.name)
  }
}

let person = new Person('person')
```

![](../../.gitbook/assets/2021-04-18-21-21-09.png)

![](../../.gitbook/assets/2021-04-26-14-48-31.png)

```javascript
// 每个对象的 __proto__ 都指向它的构造函数的原型对象prototype
person.__proto__ === Person.prototype // true
Person.prototype.__proto__ === Object.prototype // true

// 即是
person.__proto__.__proto__ === Object.prototype // true
```

```javascript
// 构造函数也是函数，函数对象都是由 Function 构造器产生的
Person.__proto__ === Function.prototype // true
Object.__proto__ === Function.prototype // true
```

```javascript
// Object的原型对象prototype指向内置对象，内置对象的__proto__属性指向原型链的顶端 null
Object.prototype.__proto === null // true
```

### JavaScript 作用域

作用域 = 变量（上下文） + 函数区域

* 全局作用域
* 函数作用域（局部作用域）
* 块级作用域（let、const）
* 词法作用域（静态作用域，指变量和函数在创建阶段就确定了，而非执行阶段）

```javascript
var a = 2
function foo() {
  console.log(a)
}
function bar() {
  var a = 3
  foo()
}
bar() // foo和bar在创建阶段时候为同层级，同层级的函数作用域无法访问彼此域内的变量，因此打印 2
```

```javascript
var a = 2
function bar() {
  var a = 3
  function foo() {
    console.log(a)
  }
  foo()
}
bar() // foo优先使用bar作用域内的变量，打印 3
```

```javascript
var a = 2
function bar() {
  function foo() {
    console.log(a)
  }
  foo()
}
bar() // foo及bar内没有变量a，根据作用域链往上找，打印 2
```

### 闭包

[闭包](https://mp.weixin.qq.com/s/QqnRoFqlWTrA_4PZPvsJEw)

闭包让你可以在一个内层函数中访问到其外层函数的作用域

使用场景：

* 创建私有变量
* 延长变量的生命周期

例子：

* 柯里化函数

  柯里化的目的在于避免频繁调用具有相同参数函数的同时，又能够轻松的重用

  ```javascript
  /**
   *  闭包处理面积计算函数
   */
  function getArea(width) {
    return (height) => {
      return width * height
    }
  }

  const getTenWidthArea = getArea(10)

  const area = getTenWidthArea(20) // 10 * 20 = 200
  ```

* 使用闭包模拟私有方法（模块方式）

  ```javascript
  const makeCounter = function () {
    let privateCounter = 0

    function changeBy(value) {
      privateCounter += value
    }

    return {
      increment: function () {
        changeBy(1)
      },
      decrement: function () {
        changeBy(-1)
      },
      value: function () {
        return privateCounter
      },
    }
  }

  const counter1 = makeCounter()
  const counter2 = makeCounter()

  console.log(counter1.value()) // 0
  counter1.increment()
  counter1.increment()
  console.log(counter1.value()) // 2
  counter1.decrement()
  console.log(counter1.value()) // 1

  console.log(counter2.value()) // 0
  ```

* 计数器、延迟调用、回调等闭包的应用，其核心思想还是创建私有变量和延长变量的生命周期

> 如果不是某些特定任务需要使用闭包，在其它函数中创建函数是不明智的，因为闭包在处理速度和内存消耗方面对脚本性能具有负面影响

### 浅拷贝和深拷贝

[浅拷贝和深拷贝](https://mp.weixin.qq.com/s/m0alHaSzbKr7BJCdakPuqQ)

* 基本数据类型
* 引用数据类型
