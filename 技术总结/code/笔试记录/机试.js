/**
 *  HJ1	字符串最后一个单词的长度
 */
function lastStr(str) {
  if (!str || typeof str != "string") {
    return 0;
  }
  let result = str.split(" ");
  return result[result.length - 1].length;
}

console.log(lastStr(readline()));

/**
 *  HJ2	计算字符个数
 */
function countStr(str, char) {
  let result = 0;
  if (!str || !char || typeof str != "string") {
    return result;
  }
  Object.values(str).forEach((value) => {
    if (
      /[a-zA-Z]/gim.test(value) &&
      value.toLocaleLowerCase() === char.toLocaleLowerCase()
    ) {
      result++;
    }
  });
  return result;
}
let first = readline();
let second = readline();
console.log(countStr(first, second));

/**
 *  HJ3	明明的随机数
 */
while ((line = readline())) {
  let arr = [];
  for (let i = 0; i < line; i++) {
    arr.push(readline());
  }
  let result = [...new Set(arr)].sort((a, b) => a - b);
  result.forEach((value) => {
    console.log(value);
  });
}
/**
 *  HJ4	字符串分隔
 */
while ((line = readline())) {
  for (let i = 0; i < line.length; i += 8) {
    console.log(line.slice(i, i + 8).padEnd(8, 0));
  }
}
/**
 *  HJ5	进制转换
 */
while ((line = readline())) {
  console.log(parseInt(line, 16));
}
/**
 *  HJ6	质数因子
 */
while ((line = readline())) {
  var num = parseInt(line);
  var arr = [];
  for (var i = 2; i <= num; i++) {
    if (num % i == 0) {
      num /= i;
      arr.push(i);
      i = 1;
    }
  }
  var result = arr
    .sort(function (v1, v2) {
      return v1 - v2;
    })
    .join(" ");
  //注意题目要求最后一个数后面也要有空格
  print(result + " ");
}

/**
 *  HJ7	取近似值
 */
function roundNum(num) {
  console.log(Math.round(num));
}

roundNum(readline());

/**
 * HJ8	合并表记录
 */
let obj = {};
let arr = [];
let key = parseInt(readline());
for (let i = 0; i < key; i++) {
  arr = readline()
    .split(" ")
    .map(function (item) {
      return parseInt(item);
    });
  if (arr[0] in obj) {
    obj[arr[0]] += arr[1];
  } else {
    obj[arr[0]] = arr[1];
  }
}
let newarr = Object.keys(obj);
for (var i = 0; i < newarr.length; i++) {
  console.log(newarr[i] + " " + obj[newarr[i]]);
}
/**
 * HJ9	提取不重复的整数
 */
function reverseFilterArr(str) {
  if (!str || str.toString().split("")[str.length - 1] == 0) {
    return str;
  }
  return [...new Set(str.toString().split("").reverse())].join("");
}

console.log(reverseFilterArr(readline()));
/**
 *  HJ10	字符个数统计
 */
function strCodeLength(str) {
  if (!str || str.charCodeAt() < 0 || str.charCodeAt() > 127) {
    return 0;
  }
  return [...new Set(str.split(""))].join("").length;
}

console.log(strCodeLength(readline()));
/**
 *  HJ11	数字颠倒
 */
function reverseArr(str) {
  if (!str) {
    return str;
  }
  return str.toString().split("").reverse().join("");
}

console.log(reverseArr(readline()));
/**
 * HJ12	字符串反转
 */
function reverseStr(str) {
  if (!str) {
    return str;
  }
  return str.toString().split("").reverse().join("");
}

console.log(reverseStr(readline()));
/**
 *  HJ13	句子逆序
 */
function reverseArr(str) {
  if (!str) {
    return str;
  }
  return str.toString().split(" ").reverse().join(" ");
}

console.log(reverseArr(readline()));
/**
 * HJ14	字符串排序
 */
while ((line = readline())) {
  let arr = [];
  for (let i = 0; i < line.length; i++) {
    arr.push(readline());
  }
  let result = arr
    .filter((value) => /[a-zA-Z]/gim.test(value))
    .sort((a, b) => a.charCodeAt() - b.charCodeAt());

  result.forEach((value) => {
    console.log(value);
  });
}
/**
 * HJ15	求int型数据在内存中存储时1的个数
 */
function reverseStr(str) {
  if (!str) {
    return 0;
  }
  return parseInt(str)
    .toString(2)
    .split("")
    .filter((value) => value == 1).length;
}

console.log(reverseStr(readline()));

/** .... */

/**
 *  HJ22	汽水瓶
 */
while ((line = readline())) {
  function fn(n) {
    if (n == 1) return 0;
    if (n == 2) return 1;
    return fn(n - 2) + 1;
  }
  console.log(fn(line));
}
/**
 *  HJ37	统计每个月兔子的总数
 */
while ((num = parseInt(readline()))) {
  let a = 1,
    b = 0,
    c = 0;
  while (--num) {
    c += b;
    b = a;
    a = c;
  }
  console.log(a + b + c);
}
/**
 *  HJ50	四则运算
 */
function fn(str) {
  if (!str || !/^[(0-9)+-/*/()]+$/gim.test(str)) {
    return 0;
  }
  return eval(str);
}

console.log(fn(readline()));
/**
 * ! HJ53	iNOC产品部-杨辉三角的变形
 */
while ((line = readline())) {
  let arr = line.split(" ");
  function fn(row) {
    if (row === 1) return [1];
    if (row === 2) return [1, 1, 1];
    let currentRow = [];
    let preRow = fn(row - 1);
    for (let i = 0; i < 2 * row - 1; i++) {
      currentRow[i] =
        (preRow[i] || 0) + (preRow[i - 1] || 0) + (preRow[i - 2] || 0);
    }
    return currentRow;
  }

  let lineNum = arr[0];
  let thatLineArr = fn(lineNum);

  for (let i = 0; i < 2 * Number(lineNum) - 1; i++) {
    if (thatLineArr[i] % 2 === 0) {
      console.log(i + 1);
      return;
    }
  }
  console.log(-1);
}
/**
 *  HJ54	表达式求值
 */
function reverseStr(str) {
  if (!str || !/^[(0-9)+-/*/()]+$/gim.test(str)) {
    return 0;
  }
  return eval(str);
}

console.log(reverseStr(readline()));
/**
 * HJ55	（练习用）挑7
 */
while ((line = readline())) {
  let count = 0;
  for (let i = 1; i <= line; i++) {
    if (i.toString().includes(7) || +i % 7 == 0) {
      count++;
    }
  }
  console.log(count);
}
/**
 *  HJ56	iNOC产品部--完全数计算
 */
while ((num = parseInt(readline()))) {
  var count = 0;
  for (let i = 1; i < num; i++) {
    var arr = [];
    for (let j = 1; j <= i; j++) {
      if (i % j == 0) {
        arr.push(j);
      }
    }
    if (eval(arr.join("+")) === 2 * i) {
      count++;
    }
  }
  console.log(count);
}

/** ... */

/**
 * HJ61	放苹果
 */
function count(m, n) {
  let sum = 0;

  if (m < 0) sum = 0;
  else if (n == 1) sum = 1;
  else if (n >= 2) {
    sum = count(m, n - 1) + count(m - n, n);
  }
  return sum;
}

while ((line = readline())) {
  let [m, n] = line.split(" ");
  console.log(count(+m, +n));
}
/**
 *  HJ62	查找输入整数二进制中1的个数
 */
while ((num = parseInt(readline()))) {
  console.log(
    num
      .toString(2)
      .split("")
      .filter((value) => value == 1).length
  );
}
/**
 *  HJ73	计算日期到天数转换
 */
while ((str = readline())) {
  let date = new Date(str.trim(" ").replace(" ", "-")).getTime();
  let yearStart = new Date(str.split(" ")[0] + "-01-01").getTime();
  let n = date - yearStart;
  console.log(n / (1000 * 60 * 60 * 24) + 1);
}
