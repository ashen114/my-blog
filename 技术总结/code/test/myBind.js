/**
 * bind实现（兼容new）
 * @returns 
 */
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

let obj = {}

// 1. 上下文
let bar = foo.myBind(obj) // this指向obj
bar('jack') // jack赋给this.name,this指向obj，因此obj.name == 'jack'
console.log(obj.name) // 'jack'

// 2. 参数
let tar = foo.myBind(obj, 'rose')
tar()
console.log(obj.name) // 'rose'

// 3. new
let alice = new bar('alice')
console.log(obj.name) // 'rose'
console.log(alice.name) // 'alice'
