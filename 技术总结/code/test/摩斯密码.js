/**
 * 摩斯密码 Morse Code
 */
class MorseCode{
    constructor(text){
        this.text = text;
        this.codeictionary = {
            'A': '.-',
            'B': '-...',
            'C': '-.-.',
            'D': '-..',
            'E': '.',
            'F': '..-.',
            'G': '--.',
            'H': '....',
            'I': '..',
            'J': '.---',
            'K': '-.-',
            'L': '.-..',
            'M': '--',
            'N': '-.',
            'O': '---',
            'P': '.--.',
            'Q': '--.-',
            'R': '.-.',
            'S': '...',
            'T': '-',
            'U': '..-',
            'V': '...-',
            'W': '.--',
            'X': '-..-',
            'Y': '-.--',
            'Z': '--..',
            '1': '.----',
            '2': '..---',
            '3': '...--',
            '4': '....-',
            '5': '.....',
            '6': '-....',
            '7': '--...',
            '8': '---..',
            '9': '----.',
            '0': '-----',
            '?': '..--..',
            '/': '-..-.',
            '()': '.-..-.',
            '-': '.----.',
            '.': '-.-.-.',
        }
    }
    // 加密
    encode(){
        let encodeStr = '/';
        this.text.split('').forEach((char) => {
            encodeStr += this.codeictionary[char] + '/';
        })
        return encodeStr;
    }
    // 解密
    decode(){
        let decodeStr = '';
        this.text.split('/').forEach((char) => {
            Object.entries(this.codeictionary).forEach(item => {
                if(char.toString() === item[1]){
                    decodeStr += item[0];
                }
            })
        });
        return decodeStr;
    }
}

let a = new MorseCode('ABC').encode();
console.log('a:',a)

let b = new MorseCode('/.--/..../.-/-/..../.-/-/..../--./---/-../.--/.-./---/..-/--./..../-/').decode();
console.log('b:',b)