## Node js搭建本地服务器

- 为了能获得更好的浏览体验以及达到目标网站的功能，我们使用Node js的express搭建服务器
- 首先要[下载Node js](https://nodejs.org/en/download/)并安装
- 然后在当前目录安装express库
```bash
npm install express
```

- 新建文件server.js
```jsx
var express = require("express");
var app = express();
// 以Network-Programming-with-Go文件夹作为根目录
// 网页打开访问localhost:3000
app.use(express.static("Network-Programming-with-Go")).listen(3000);
```