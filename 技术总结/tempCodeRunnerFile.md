// Promise并发请求
class PromisePool{
  constructor(max, fn){
    this.max = max; // 最大并发量
    this.fn = fn; // 自定义的请求函数
    this.pool = []; // 请求池
    this.urls = []; // 剩余的请求地址
  }
  start(urls){
    this.urls = urls; 
    // 先循环把并发池塞满至最大并发量
    while(this.pool.length < this.max){
      let url = this.urls.shift(); // 每次取出一条url
      this.setTask(url); // 把url塞入请求任务队列
    }
    // 利用Promise.race方法来获取请求池中先完成的某任务
    let race = Promise.race(this.pool);
    // 任务完成后，则处理并发池
    return this.run(race);
  }
  run(race){
    race.then((res) => {
      // 每当并发池完成一个任务，就再塞入一个任务
      let url = this.urls.shift();
      this.setTask(url);
      return this.run(Promise.race(this.pool));
    })
  }
  setTask(url){
    if(!url) return;
    let task = this.fn(url); // 执行自定义的请求方法，作为一个任务存放
    console.log(`任务:${url}开始，当前并发量:${this.pool.length}`)
    task.then(res => {
      // 请求任务结束后，把当前的任务从并发池中移除
      this.pool.splice(this.pool.indexOf(task), 1);
      console.log(`任务:${url}结束，当前并发量:${this.pool.length}`)
    })
  }
}

// 测试运行
const urls = [
  'bytedance.com',
  'tencent.com',
  'alibaba.com',
  'microsoft.com',
  'apple.com',
  'hulu.com',
  'amazon.com'
]

// 自定义请求函数
let fn = url => {
  return new Promise((resolve)=>{
    setTimeout(()=>{
      resolve(`任务${url}完成`)
    },1000)
  }).then((res)=>{
    console.log('自定义处理：', res)
  })
}

const pool = new PromisePool(5, fn);
pool.start(urls);