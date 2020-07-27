var express = require("express");
var app = express();
// 以Network-Programming-with-Go文件夹作为根目录
// 网页打开访问localhost:3000
app.use(express.static("Network-Programming-with-Go")).listen(3000);
