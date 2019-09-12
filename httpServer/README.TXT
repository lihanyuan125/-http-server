1. babel(@babel/cli,@babel/core,@babel/preset-env)
    node 不支持es6语法
        @babel/cli  解析core
        @babel/core   
        @babel/preset-env 将es6--->es5
    将src下面的文件自动转换为低级语法：npx babel src  -d dist --watch
2.commander  解析process，配置指令 eg：port
3.import mime from "mime"  根据不同的文件后缀添加类型
4.import chalk from "chalk"  粉筆浅



5. Content-Type: text/html;charset =utf-8  响应头，响应的文件类型
   res.setHeader("Cache-Control", "no-store");  //不緩存
6.mime头
    res.setHeader("Content-Type", mime.getType(filePath) + "; charset=utf8");
    根据不同的文件加上不同的响应头 Content-Type: application/javascript; charset=utf8
7.压缩
    fs.createReadStream("./a.txt").pipe(zlib.createGzip()).pipe(fs.createWriteStream("b.txt.gz"))
        響應頭 Accept-Encodeing : gzip  deflate  br   //客户端要支持压缩
        響應頭 Accept-Encodeing  //一个文件到底压不压缩，看请求头中有没有
8.缓存
    强制緩存
        res.setHeader(" Cache-Control", "max-age=10");//延時10s  格式化時間
        res.setHeader("Expires",new Date(Date.now()+1000*20).toGMTString()); //延長20s，格式化時間
    對比緩存(協商緩存)---時間不夠精確，極短的時間内改變，無法檢測到
        res.setHeader("Cache-Control", "no-cache");  //强制緩存，對比緩存要走網絡
        請求頭 req.headers["if-modified-since"];//上一次你修改的時間
        響應頭 res.setHeader("Last-Modified", lastModified) //最新的修改文件的時間
    對比緩存(摘要：不可逆，長度固定，内容相同摘要也相同)  //響應頭
        請求頭 let ifNoneMatch = req.headers["if-none-match"];
        let Etag = crypto.createHash("md5").update(fs.readFileSync(filePath)).digest("base64");
        res.setHeader("Last-Modified", lastModified);
        響應頭 res.setHeader("Etag", Etag);
9.User-Agent:判断是手机端项目还是pc端项目
  Location：重定向

10.獲取蕩鞦韆工作環境(路徑)
let filePath = path.join(process.cwd(),pathname);
    //process.cwd()获取当前的工作目录 C:\Users\Administrator\Desktop\httpServer

test.js   輸入轉換輸出流
test2.js  zlib壓縮
test3.js  crypto加密算法