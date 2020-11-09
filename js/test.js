function fn(){
    this.name = 'a'
    getName = function(){
      console.log('a:', name)
    }
    return this;
  }
  let mame = 'c';
  fn().getName();
  fn.getName = function(){
    console.log('b:', name)
  }
  fn().getName();