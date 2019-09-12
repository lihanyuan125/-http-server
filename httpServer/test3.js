const crypto = require("crypto")


let r = crypto.createHash("md5").update("123456").digest("base64")
// console.log(r)  // 4QrcOUm6Wau+VuBX8g+IPg==      3*8 == 4*6

let r2 = crypto.createHash("md5").update(r).digest("base64")
// console.log(r2)   // DIjVZpTC+zvMQW4SLBBy6w==

let r3 = crypto.createHash("md5").update(r2).digest("base64")
console.log(r3)   // b4rIw1jjpLVbp5v8AbBBag==
