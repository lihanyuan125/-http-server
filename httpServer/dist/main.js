"use strict";

var _commander = _interopRequireDefault(require("commander"));

var _server = _interopRequireDefault(require("./server"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_commander.default.option('-p, --port<val>', 'set http-server port') // 自己配置  设置端口 
.parse(process.argv); //process   node全局
// 解析process,默认配置--help


let config = {
  port: 8080
};
Object.assign(config, _commander.default); //目标 源   program--->config

console.log(config.port); // 开启一个服务 

let server = new _server.default(config);
server.start(); // 启动服务