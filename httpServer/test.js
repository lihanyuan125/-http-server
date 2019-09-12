// console.log("ok") // 日志输出

/*--输入一个abc，通过转化流，把abc转化成ABC，输出,压缩就是使用的转换流--*/ 
const {Transform} = require("stream")      //引入轉換流
class MyTransform extends Transform{       //繼承轉換流
    _transform(chunk,encoding,callback){   //重写方法
        chunk = chunk.toString().toUpperCase()//buffer-->字符串  小寫-->大寫
        this.push(chunk)
        callback()
    }
}
let myTransform = new MyTransform() // 创建一个转化流
process.stdin.pipe(myTransform).pipe(process.stdout)
// 輸入流-->转换流-->输出流


/*------------标准输入------------*/ 
process.stdin.on("data",function(data){
    // 标准输出
    process.stdout.write(data)
})



// node test.js