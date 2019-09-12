let zlib = require("zlib")
let fs = require("fs")

// 如果数据中重复性东西非常多，非常适合压缩
// 1.異步讀取，數據在回調中
// zlib.gzip(fs.readFileSync("./a.txt"),function(err,data){
//     fs.writeFileSync("abc.gz",data)
// })
// 2.同步讀取，數據會返回
// let data = zlib.gunzipSync(fs.readFileSync("./a.txt")

// 3.流的方式，创建一个可写流
fs.createReadStream("./a.txt").pipe(zlib.createGzip()).pipe(fs.createWriteStream("b.txt.gz"))
