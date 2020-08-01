## 版本介绍

- 此版本通过保存路径的合理调整，解决了introduction无法找到CSS和JavaScript的问题
   - introduction页面寻找CSS和JS的路径和其他页面不同
   - 其应该与章节文件夹位于同一级

<div align=center><img src="../images/36.png"/></div>

- 调整后，所有爬取的文件被存在Network-Programming-with-Go文件夹中，introduction被以index.html的形式保存在Network-Programming-with-Go文件夹中，与章节文件夹同级
- 为了解决搜索的问题，此版本中额外爬取了search_index.json，放在Network-Programming-with-Go文件夹中
- 为了解决图标无法显示的问题，此版本额外爬取了fontawesome-webfont.woff和fontawesome-webfont.woff2文件，存放在gitbook/fonts/fontawesome文件夹中
- 使用node js在Network-Programming-with-Go目录创建一个简单的server来打开保存的页面，解决了上一版本中章节首页点开有误、跨域请求失败的问题，并与search_index.json一起实现了查询功能
- 此外，此版本优化了代码并大幅增加了注释