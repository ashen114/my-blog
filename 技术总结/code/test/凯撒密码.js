/**
 * 凯撒密码 Caesar cipher
 * @param text 待处理文本
 * @param offset 偏移量
 */
class CaesarCipher{
    constructor(text, offset){
        this.text = text;
        this.offset = offset;
    }
    // 解密
    decodeCipher(){
        let tempChar = '', encodeTextList = [];
        this.text.split('').forEach((item, index) => {
            let currentChar = item.toUpperCase().charCodeAt(0); // 当前字符code
            let startCharCode = 'A'.charCodeAt(0), endCharCode = 'Z'.charCodeAt(0);
            if(currentChar <= endCharCode && currentChar >= startCharCode){
                tempChar = startCharCode + (currentChar + startCharCode - this.offset) % 26;
                encodeTextList[index] = /[A-Z]/.test(item) ? String.fromCharCode(tempChar) : String.fromCharCode(tempChar).toLowerCase();
            }else{
                encodeTextList[index] = item;
            }
        })
        return encodeTextList.join('');
    }
    // 加密
    encodeCipher(){
        let tempChar = '', encodeTextList = [];
        this.text.split('').forEach((item, index) => {
            let currentChar = item.toUpperCase().charCodeAt(0); // 当前字符code
            let startCharCode = 'A'.charCodeAt(0), endCharCode = 'Z'.charCodeAt(0);
            if(currentChar <= endCharCode && currentChar >= startCharCode){
                tempChar = startCharCode + (currentChar - startCharCode + this.offset) % 26;
                encodeTextList[index] = /[A-Z]/.test(item) ? String.fromCharCode(tempChar) : String.fromCharCode(tempChar).toLowerCase();
            }else{
                encodeTextList[index] = item;
            }
        })
        return encodeTextList.join('');
    }
}

let a = new CaesarCipher('ABC abc', 3).encodeCipher();
console.log('a:',a)
let b = new CaesarCipher('DEF def', 3).decodeCipher();
console.log('b:',b)