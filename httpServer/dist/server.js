"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _http = _interopRequireDefault(require("http"));

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var _url = _interopRequireDefault(require("url"));

var _crypto = _interopRequireDefault(require("crypto"));

var _zlib = _interopRequireWildcard(require("zlib"));

var _mime = _interopRequireDefault(require("mime"));

var _chalk = _interopRequireDefault(require("chalk"));

var _ejs = _interopRequireDefault(require("ejs"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//算法(摘要算法，加密算法，加鹽算法)
// 内置模块
let {
  readFile,
  writeFile,
  readdir,
  stat
} = _fs.default.promises; //解构赋值
// 第三方

let template = _fs.default.readFileSync(_path.default.resolve(__dirname, "../template.html"), "utf-8"); // console.log(template);


class Server {
  constructor(config) {
    //    console.log(config.port)   main.js   config  8080
    this.port = config.port;
    this.template = template; //将template属性挂到server实例上
  }

  async handleRequest(req, res) {
    // 输入一个/  pathname是 /
    let {
      pathname
    } = _url.default.parse(req.url, true); //true  直接將查詢字符串轉化爲路徑
    // let filePath = path.join(__dirname, pathname);//得到文件的绝对路径


    let filePath = _path.default.join(process.cwd(), pathname); //process.cwd()获取当前的工作目录 C:\Users\Administrator\Desktop\httpServer
    // 有中文字符时，浏览器会自动编码，所以需要手动解码


    pathname = decodeURIComponent(pathname); // console.log(__dirname);
    // console.log(filePath)  // C:\Users\Administrator\Desktop\myserver\dist
    // 捕获异常  try  catch

    try {
      let statObj = await stat(filePath); //stat   判断是文件还是文件夹

      if (statObj.isDirectory()) {
        //目录
        let dirs = await readdir(filePath); //即将要渲染的网页的数据
        // console.log(dirs);

        let templateStr = _ejs.default.render(this.template, {
          dirs,
          path: pathname === "/" ? "" : pathname
        });

        res.setHeader("Content-Type", "text/html;charset =utf-8");
        res.end(templateStr);
      } else {
        // 如果是文件，把文件的内容返回
        this.sendFile(filePath, req, res, statObj);
      }
    } catch (e) {
      this.sendError(e, req, res);
    }
  }
  /*-------------压缩-------------*/


  gzip(filePath, req, res, statObj) {
    let encoding = req.headers["accept-encoding"]; //如果需要压缩

    if (encoding) {
      if (encoding.match(/gzip/)) {
        //正则
        res.setHeader("Content-Encoding", "gzip");
        return _zlib.default.createGzip();
      } else if (encoding.match(/deflate/)) {
        res.setHeader("Content-Encoding", "deflate");
        return _zlib.default.createDeflate();
      }

      return false;
    }

    return false;
  }
  /*-------------缓存-------------*/


  cache(filePath, req, res, statObj) {
    let lastModified = statObj.ctime.toGMTString();
    let ifModifiedSince = req.headers["if-modified-since"];

    let Etag = _crypto.default // Etag是响应头
    .createHash("md5").update(_fs.default.readFileSync(filePath)).digest("base64");

    res.setHeader("Last-Modified", lastModified);
    res.setHeader("Etag", Etag); // if-none-match 当你修改服务器上的文件时，请求头上面会自动添加这个头
    // 如果if-none-match存在，说明你改动服务器上的文件中的内容

    let ifNoneMatch = req.headers["if-none-match"]; // 根据内容摘要判断是否需要缓存

    if (ifModifiedSince && ifNoneMatch) {
      if (ifNoneMatch !== Etag && ifModifiedSince !== lastModified) {
        return false;
      }
    } else {
      return false;
    }

    return true;
  }
  /*-------------响应文件-------------*/


  sendFile(filePath, req, res, statObj) {
    // 缓存
    res.setHeader("Cache-Control", "no-cache"); //强制緩存

    let cache = this.cache(filePath, req, res, statObj);

    if (cache) {
      res.statusCode = 304;
      return res.end();
    } // 响应数据前，压缩数据


    let flag = this.gzip(filePath, req, res, statObj);
    let type = _mime.default.getType(filePath) || "text/plain";
    res.setHeader("Content-Type", _mime.default.getType(filePath) + "; charset=utf8"); // 1.根据不同的文件加上不同的响应头 Content-Type: application/javascript; charset=utf8

    if (!flag) {
      //客户端不要求压缩or，客户端的压缩格式服务端处理不了
      _fs.default.createReadStream(filePath).pipe(res);
    } else {
      _fs.default.createReadStream(filePath).pipe(flag).pipe(res);
    }
  }

  sendError(e, req, res) {
    // console.log(e);
    res.statusCode = 404;
    res.end("Not Found");
  }

  start() {
    // 127.0.0.1 托管是dist文件夹
    let server = _http.default.createServer(this.handleRequest.bind(this));

    server.listen(this.port, () => {
      console.log(`${_chalk.default.yellow("Starting up http-server, serving ")} ${_chalk.default.blue("./")}
${_chalk.default.yellow(" Available on:")}
${_chalk.default.green("http://127.0.0.1:")} ${_chalk.default.green(this.port)}
Hit CTRL-C to stop the server
            `);
    });
  }

}

var _default = Server;
exports.default = _default;