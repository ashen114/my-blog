/**
 * 最小正整数和
 */
// function minSum(str) {
//   if (!str || typeof str != "string") {
//     return 0;
//   }
//   // 1. 过滤数字类型
//   let numArr = str.toString().match(/(-)*\d+/gim);

//   // 2.把数字类型为正整数的再拆出来，以作为最小整数
//   let minNumArr = numArr
//     .map((value) => {
//       // 如果首位不是负数，则将其拆分
//       if (value.toString()[0] != "-") {
//         return value.split("");
//       } else {
//         return value;
//       }
//     })
//     .flat();
//   let result = minNumArr
//     .map((value) => +value)
//     .reduce((sum, value) => {
//       return (sum += value);
//     });
//   return result;
// }

// console.log(minSum("bb1234aa"));

/**
 * 最小正整数和
 */
// function minSum(str) {
//   if (!str || typeof str != "string") {
//     return 0;
//   }
//   // 1. 过滤数字类型
//   let numArr = str.toString().match(/(-)*\d+/gim);

//   if (!numArr || numArr.length <= 0) {
//     return 0;
//   }

//   // 2.把数字类型为正整数的再拆出来，以作为最小整数
//   let minNumArr = [];
//   numArr.forEach((value) => {
//     // 如果首位不是负数，则将其拆分
//     if (value.toString()[0] != "-") {
//       minNumArr = minNumArr.concat(value.split(""));
//     } else {
//       minNumArr.push(value);
//     }
//   });
//   console.log("minNumArr:", minNumArr);
//   if (minNumArr.length < 0) {
//     return 0;
//   }
//   let result = minNumArr
//     .map((value) => +value)
//     .reduce((sum, value) => {
//       return (sum += value);
//     });
//   return result;
// }

// console.log(minSum("bdfdfa"));

/**
 * 第n个最小ASC码的字符的索引值位置
 * @param str
 * @param k 第几小的字符串
 */
// function minCodeAtIndex(str, k) {
//   // 1. 按asc码排序（从小到大）
//   let strSortCode = str
//     .split("")
//     .sort((a, b) => a.charCodeAt() - b.charCodeAt());
//   console.log("strSortCode:", strSortCode);
//   // 2. 取出第k个字符，没有则取最后一个
//   let resultStr = strSortCode[k - 1] || strSortCode[strSortCode.length - 1];
//   // 3. 获取改字符在原字符串上的位置
//   let resultIndex = str.split("").findIndex((value) => resultStr === value);
//   return resultIndex;
// }

// console.log(minCodeAtIndex("AbCdeFG", 3));

/**
 * 元音字符子
 */
function findLongStr(flaw, str) {
  /**
   * 遇到元音则push到数组中，遇到非元音则统计次数++，更新指针位置，遇到元音则结束，再从指针位置重新开始
   */
  let aeiouArr = ["a", "e", "i", "o", "u"];
  let arr = []; // 存放元音子串
  let count = 0; // 计数，以匹配flaw
  let index = 0; // 指针
  // 1. 循环字符串
  let i = 0;
  while (i != str.length) {
    if (aeiouArr.includes(str[i])) {
      count = 0;
    } else {
      count++;
      index = i;
    }
    index++;
    if (count == flaw) {
      console.log("arr:", arr);
      arr.push(str[i]);
    } else {
      arr.push("__");
    }
    i = index;
  }
}

findLongStr(0, "asdbuiodevauufgh");

/**
 * 模拟大数
 */
"4442223323234213123124324236748723460283460",
  "748239065024781678026187457016471";
