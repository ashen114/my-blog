/**
 * 猴子爬山
 */
//  Scanner scanner = new Scanner(System.in);
//  int n = scanner.nextInt();
//  scanner.close();
//  long[] k = new long[10000];
//  k[1]=1;
//  k[2]=1;
//  k[3]=2;

//  for(int i=4;i<=n;i++){
//      k[i]=k[i-1]+k[i-3];
//  }
//  System.out.println(k[n]);
let result = [
  19,
  "grLaArEX",
  "B",
  "Gc",
  "MnuvCWc",
  "kOmHJX",
  "Qf",
  "gNI",
  "GRXvbgg",
  "gMojlYPCzL",
  "ToxnNKC",
  "p",
  "JG",
  "oqojpxLUF",
  "ZoTlmaSRT",
  "VZfrxw",
  "oBRWVGVN",
  "Y",
  "q",
  "RsnLwtcV",
]
  .filter((value) => /[a-zA-Z]/gim.test(value))
  .sort((a, b) => a.charCodeAt() - b.charCodeAt());

result.forEach((value) => {
  console.log(value);
});

/**
 * 汽水
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
 * 兔子
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
 * 数字颠倒
 */
function reverseArr(str) {
  if (!str) {
    return str;
  }
  return str.toString().split("").reverse().join("");
}

console.log(reverseArr(readline()));
/**
 * 字符串反转
 */
function reverseStr(str) {
  if (!str) {
    return str;
  }
  return str.toString().split("").reverse().join("");
}

console.log(reverseStr(readline()));
/**
 * 四则运算
 */
function fn(str) {
  if (!str || !/^[(0-9)+-/*/()]+$/gim.test(str)) {
    return 0;
  }
  return eval(str);
}

console.log(fn(readline()));

/**
 * 表达式
 */
function reverseStr(str) {
  if (!str || !/^[(0-9)+-/*/()]+$/gim.test(str)) {
    return 0;
  }
  return eval(str);
}

console.log(reverseStr(readline()));
/**
 * 放苹果
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
 * 二进制的1个数
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
 * 日期到天数
 */
while ((str = readline())) {
  let date = new Date(str.trim(" ").replace(" ", "-")).getTime();
  let yearStart = new Date(str.split(" ")[0] + "-01-01").getTime();
  let n = date - yearStart;
  console.log(n / (1000 * 60 * 60 * 24) + 1);
}

/**
 * 最长不重复子串
 */
var myString = "aaabcdeeeghhhffiooo";
function maxRepeactString(str) {
  //定义一个对象，对象的每个属性是出现连续重复的字符，属性的属性值是该字符重复的个数
  var res = {};
  for (var i = 0, j = i + 1; i < str.length; i++) {
    while (str[i] == str[j]) {
      j++;
      res[str[i]] = j - i + 1;
    }
  }
  return res;
}
var maxnum = 0,
  maxname;
var strmore = maxRepeactString(myString);
console.log(strmore);
//找出第一个最长重复字符的字符
for (var item in strmore) {
  if (strmore[item] > maxnum) {
    maxnum = strmore[item];
    maxname = item;
  }
}

//找出其他的重复出现maxnum次数的字符,存入nameStr中
var nameStr = [];
for (var i in strmore) {
  if (strmore[i] === maxnum) {
    var str = "";
    for (var k = 0; k < maxnum; k++) {
      str += i;
    }
    nameStr.push(str);
  }
}
console.log("存在最长的" + maxnum + "次重复的字符有" + nameStr);

/**
 * 有效括号
 */
arr = [];
num = 0;
str = "())(())";
for (let i = 0; i < str.length; i++) {
  if (str[i] == "(") {
    arr.push(str[i]);
  } else if (str[i] == ")" && arr.length > 0) {
    arr.pop();
    num += 2;
  }
}
