# 使用Colly爬取网站并展示

## 目录
- [目标](https://github.com/ruilisi/golang-crawler-example#目录)
- [目标网站](https://github.com/ruilisi/golang-crawler-example#目标网站)
- [目标网站元素](https://github.com/ruilisi/golang-crawler-example#目标网站元素)
- [版本一](https://github.com/ruilisi/golang-crawler-example#版本一)
  - [代码](https://github.com/ruilisi/golang-crawler-example#代码)
  - [版本介绍](https://github.com/ruilisi/golang-crawler-example#版本介绍)
  - [运行结果展示](https://github.com/ruilisi/golang-crawler-example#运行结果展示)
- [版本二](https://github.com/ruilisi/golang-crawler-example#版本二)
  - [代码](https://github.com/ruilisi/golang-crawler-example#代码-1)
  - [版本介绍](https://github.com/ruilisi/golang-crawler-example#版本介绍-1)
  - [保存的目录结构](https://github.com/ruilisi/golang-crawler-example#保存的目录结构)
  - [运行结果展示](https://github.com/ruilisi/golang-crawler-example#运行结果展示-1)
- [版本三](https://github.com/ruilisi/golang-crawler-example#版本三)
  - [代码](https://github.com/ruilisi/golang-crawler-example#代码-2)
  - [版本介绍](https://github.com/ruilisi/golang-crawler-example#版本介绍-2)
  - [保存的目录结构](https://github.com/ruilisi/golang-crawler-example#保存的目录结构-1)
  - [Node js搭建本地服务器](https://github.com/ruilisi/golang-crawler-example#node-js搭建本地服务器)
  - [运行结果展示](https://github.com/ruilisi/golang-crawler-example#运行结果展示-2)
    - [运行](https://github.com/ruilisi/golang-crawler-example#运行)
    - [结果展示](https://github.com/ruilisi/golang-crawler-example#结果展示)
- [参考资料](https://github.com/ruilisi/golang-crawler-example#参考资料)

## 目标
使用colly爬取站点[http://tumregels.github.io/Network-Programming-with-Go/](http://tumregels.github.io/Network-Programming-with-Go/)所有页面(在本地打开页面后展开的效果和服务器上差不多)
## 目标网站
![aim_web_1.png](https://cdn.nlark.com/yuque/0/2020/png/1609946/1595588653790-177c8a3d-85a7-45bf-af9f-14680dd561dc.png#align=left&display=inline&height=900&margin=%5Bobject%20Object%5D&name=aim_web_1.png&originHeight=900&originWidth=1440&size=196088&status=done&style=none&width=1440)


![aim_web_2.png](https://cdn.nlark.com/yuque/0/2020/png/1609946/1595592514018-2fe37322-db54-44fd-9a8c-c92eb5cf87fd.png#align=left&display=inline&height=900&margin=%5Bobject%20Object%5D&name=aim_web_2.png&originHeight=900&originWidth=1440&size=186405&status=done&style=none&width=1440)
![aim_web_3.png](https://cdn.nlark.com/yuque/0/2020/png/1609946/1595592525624-7f79a7a0-88a6-4e0c-8132-0c8f5231eec5.png#align=left&display=inline&height=900&margin=%5Bobject%20Object%5D&name=aim_web_3.png&originHeight=900&originWidth=1440&size=216596&status=done&style=none&width=1440)
![aim_web_4.png](https://cdn.nlark.com/yuque/0/2020/png/1609946/1595588682586-7579ad39-6202-46af-9d8d-8131a6cd4fd5.png#align=left&display=inline&height=900&margin=%5Bobject%20Object%5D&name=aim_web_4.png&originHeight=900&originWidth=1440&size=176206&status=done&style=none&width=1440)
## 目标网站元素
![web_ele_1.png](https://cdn.nlark.com/yuque/0/2020/png/1609946/1595589011015-7c8b6086-ee4d-4625-b29b-048bc7ab6f24.png#align=left&display=inline&height=900&margin=%5Bobject%20Object%5D&name=web_ele_1.png&originHeight=900&originWidth=1440&size=286615&status=done&style=none&width=1440)
文件名称为xxx.html，如protocal_layers.xml
![web_ele_2.png](https://cdn.nlark.com/yuque/0/2020/png/1609946/1595589020995-06306679-0986-4a7d-a1e4-da91c3faa85b.png#align=left&display=inline&height=900&margin=%5Bobject%20Object%5D&name=web_ele_2.png&originHeight=900&originWidth=1440&size=217809&status=done&style=none&width=1440)
图片保存在../assets文件夹中
![web_ele_3.png](https://cdn.nlark.com/yuque/0/2020/png/1609946/1595589033645-342dd0c3-c255-4103-813a-688dc9f45385.png#align=left&display=inline&height=343&margin=%5Bobject%20Object%5D&name=web_ele_3.png&originHeight=343&originWidth=1113&size=118799&status=done&style=none&width=1113)
css和JavaScript文件放在../gitbook文件夹中
## 版本一
### 代码
crawlerv1.go
```go
package main

import (
	"fmt"
	"io"
	"net/http"
	"net/url"
	"strings"
	"os"

	"github.com/gocolly/colly"
)

var destUrl = "http://tumregels.github.io/Network-Programming-with-Go/"

func errCheck(err error) {
	if err != nil {
		panic(err)
	}
}

func main() {
	// Instantiate default collector
	c := colly.NewCollector(
		// Visit only domains: tumregels.github.io
		colly.AllowedDomains("tumregels.github.io"),
		colly.MaxDepth(1),
	)
	os.Mkdir("./downloaded/", 0777)
	os.Mkdir("./downloaded/assets", 0777)

	c.OnResponse(func(r *colly.Response) {
		// // 以下代码将打印得到的response body的全部内容
		// fmt.Println("body", string(r.Body))
		// 获取链接的绝对路径
		fullurl := r.Request.URL.String()
		fmt.Println(fullurl)
		res, _ := http.Get(fullurl)
		//解析这个 URL 并确保解析没有出错。
		u, err := url.Parse(fullurl)
		errCheck(err)
		h := strings.Split(u.Path, "/")
		if (h[len(h)-1]) == "" {
			dirPath := "./downloaded/" + h[len(h)-2]
			os.Mkdir(dirPath, 0777)
			// savedPath := "./downloaded/" + h[len(h)-2] + ".html"
			savedPath := "./downloaded/" + h[len(h)-2] + "/" + "index.html"
			f, err := os.Create(savedPath)
			errCheck(err)
			io.Copy(f, res.Body)
			// TODO create dirs before create file
		} else {
			savedPath := "./downloaded/" + h[len(h)-2] + "/" + h[len(h)-1]
			f, err := os.Create(savedPath)
			errCheck(err)
			io.Copy(f, res.Body)
		}
	})

	// serach for all img tags with src attribute -- Images
	c.OnHTML("img[src]", func(e *colly.HTMLElement) {
		srcRef := e.Attr("src")
		// 获取图片的绝对路径
		fullurl := e.Request.AbsoluteURL(srcRef)
		// fmt.Println("Image path is: " + fullurl)
		res, _ := http.Get(fullurl)
		//解析这个 URL 并确保解析没有出错。
		u, err := url.Parse(fullurl)
		errCheck(err)
		h := strings.Split(u.Path, "/")
		// fmt.Println(u)
		// fmt.Println(h[1])
		if (h[1] == "Network-Programming-with-Go") {
			savedPath := "./downloaded/assets/" + h[len(h)-1]
			f, err := os.Create(savedPath)
			errCheck(err)
			io.Copy(f, res.Body)
		} // if
	})

	// On every a element which has href attribute call callback
	c.OnHTML("a[href]", func(e *colly.HTMLElement) {
		link := e.Attr("href")
		// Print link
		// fmt.Printf("Link found: %q -> %s\n", e.Text, link)
		// fmt.Println(link)
		// Visit link found on page
		// Only those links are visited which are in AllowedDomains
		c.Visit(e.Request.AbsoluteURL(link))
	})

	// // Before making a request print "Visiting ..."
	// c.OnRequest(func(r *colly.Request) {
	// 	fmt.Println("Visiting", r.URL.String())
	// })

	// Start scraping on http://tumregels.github.io/Network-Programming-with-Go/
	c.Visit(destUrl)
}
```
### 版本介绍

- 如果downloaded文件夹不存在，会自动在当前文件夹中创建downloaded文件夹。
- 如果是章节如architecture，会创建architecture文件夹，并将章节首页以index.html形式保存在文件夹中
- 创建assets用来保存图片
- 由于没有爬取CSS和javaScript文件，所以页面仅有文字和图片部分
- 由于章节首页如architecture在网页上的相对路径就为architecture，但保存为了index.html所以点击打开章节首页无法成功，Safari会打开architecture文件夹

![v1_5.png](https://cdn.nlark.com/yuque/0/2020/png/1609946/1595589467610-531681f5-6a20-4f74-a740-39bd3423e563.png#align=left&display=inline&height=441&margin=%5Bobject%20Object%5D&name=v1_5.png&originHeight=441&originWidth=812&size=108501&status=done&style=none&width=812)
### 运行结果展示
![v1_1.png](https://cdn.nlark.com/yuque/0/2020/png/1609946/1595589353524-6b6d22f8-0e0a-46ba-8e06-a6c5a10eaff5.png#align=left&display=inline&height=900&margin=%5Bobject%20Object%5D&name=v1_1.png&originHeight=900&originWidth=1440&size=169792&status=done&style=none&width=1440)
![v1_2.png](https://cdn.nlark.com/yuque/0/2020/png/1609946/1595589364804-6b89d2eb-bcc0-49f0-ba97-b6c8023d5e81.png#align=left&display=inline&height=900&margin=%5Bobject%20Object%5D&name=v1_2.png&originHeight=900&originWidth=1440&size=151048&status=done&style=none&width=1440)
![v1_3.png](https://cdn.nlark.com/yuque/0/2020/png/1609946/1595589496482-0f13f410-89cf-43a5-a400-5a5ba5490ef5.png#align=left&display=inline&height=900&margin=%5Bobject%20Object%5D&name=v1_3.png&originHeight=900&originWidth=1440&size=194571&status=done&style=none&width=1440)
![v1_4.png](https://cdn.nlark.com/yuque/0/2020/png/1609946/1595589505983-d4af935e-b5d0-4ad1-8334-f755861ad483.png#align=left&display=inline&height=900&margin=%5Bobject%20Object%5D&name=v1_4.png&originHeight=900&originWidth=1440&size=227566&status=done&style=none&width=1440)
## 版本二
### 代码
crawlerv2.go
```go
package main

import (
	"fmt"
	"io"
	"net/http"
	"net/url"
	"strings"
	"os"

	"github.com/gocolly/colly"
)

var destUrl = "http://tumregels.github.io/Network-Programming-with-Go/"

func errCheck(err error) {
	if err != nil {
		panic(err)
	}
}

func main() {
	// Instantiate default collector
	c := colly.NewCollector(
		// Visit only domains: tumregels.github.io
		colly.AllowedDomains("tumregels.github.io"),
		colly.MaxDepth(1),
	)
	os.Mkdir("./downloaded/", 0777)
	os.Mkdir("./downloaded/assets", 0777)
	os.Mkdir("./downloaded/gitbook", 0777)

	c.OnResponse(func(r *colly.Response) {
		// // 以下代码将打印得到的response body的全部内容
		// fmt.Println("body", string(r.Body))
		// 获取链接的绝对路径
		fullurl := r.Request.URL.String()
		fmt.Println(fullurl)
		res, _ := http.Get(fullurl)
		//解析这个 URL 并确保解析没有出错。
		u, err := url.Parse(fullurl)
		errCheck(err)
		h := strings.Split(u.Path, "/")
		if (h[len(h)-1]) == "" {
			dirPath := "./downloaded/" + h[len(h)-2]
			os.Mkdir(dirPath, 0777)
			// savedPath := "./downloaded/" + h[len(h)-2] + ".html"
			savedPath := "./downloaded/" + h[len(h)-2] + "/" + "index.html"
			f, err := os.Create(savedPath)
			errCheck(err)
			io.Copy(f, res.Body)
			// TODO create dirs before create file
		} else {
			savedPath := "./downloaded/" + h[len(h)-2] + "/" + h[len(h)-1]
			f, err := os.Create(savedPath)
			errCheck(err)
			io.Copy(f, res.Body)
		}
	})

	// search for all link tags that have a rel attribute that is equal to stylesheet - CSS
	c.OnHTML("link[rel='stylesheet']", func(e *colly.HTMLElement) {
		// hyperlink reference
		link := e.Attr("href")
		// 获取css的绝对路径
		fullurl := e.Request.AbsoluteURL(link)
		// fmt.Println("CSS path is: " + fullurl)
		res, _ := http.Get(fullurl)
		//解析这个 URL 并确保解析没有出错。
		u, err := url.Parse(fullurl)
		errCheck(err)
		h := strings.Split(u.Path, "/")
		// fmt.Println(u)
		// fmt.Println(h[1])
		if (h[len(h)-2] != "gitbook") {
			dirPath := "./downloaded/gitbook/" + h[len(h)-2]
			os.Mkdir(dirPath, 0777)
			savedPath := "./downloaded/gitbook/" + h[len(h)-2] + "/" + h[len(h)-1]
			f, err := os.Create(savedPath)
			errCheck(err)
			io.Copy(f, res.Body)
		} else {
			savedPath := "./downloaded/gitbook/" + h[len(h)-1]
			f, err := os.Create(savedPath)
			errCheck(err)
			io.Copy(f, res.Body)
		}
	})

	// search for all script tags with src attribute -- JS
	c.OnHTML("script[src]", func(e *colly.HTMLElement) {
		// src attribute
		link := e.Attr("src")
		// 获取js的绝对路径
		fullurl := e.Request.AbsoluteURL(link)
		// fmt.Println("JavaScript path is: " + fullurl)
		res, _ := http.Get(fullurl)
		//解析这个 URL 并确保解析没有出错。
		u, err := url.Parse(fullurl)
		errCheck(err)
		h := strings.Split(u.Path, "/")
		// fmt.Println(u)
		// fmt.Println(h[1])
		if (h[len(h)-2] != "gitbook") {
			dirPath := "./downloaded/gitbook/" + h[len(h)-2]
			os.Mkdir(dirPath, 0777)
			savedPath := "./downloaded/gitbook/" + h[len(h)-2] + "/" + h[len(h)-1]
			f, err := os.Create(savedPath)
			errCheck(err)
			io.Copy(f, res.Body)
		} else {
			savedPath := "./downloaded/gitbook/" + h[len(h)-1]
			f, err := os.Create(savedPath)
			errCheck(err)
			io.Copy(f, res.Body)
		}
	})

	// serach for all img tags with src attribute -- Images
	c.OnHTML("img[src]", func(e *colly.HTMLElement) {
		srcRef := e.Attr("src")
		// 获取图片的绝对路径
		fullurl := e.Request.AbsoluteURL(srcRef)
		// fmt.Println("Image path is: " + fullurl)
		res, _ := http.Get(fullurl)
		//解析这个 URL 并确保解析没有出错。
		u, err := url.Parse(fullurl)
		errCheck(err)
		h := strings.Split(u.Path, "/")
		// fmt.Println(u)
		// fmt.Println(h[1])
		if (h[1] == "Network-Programming-with-Go") {
			savedPath := "./downloaded/assets/" + h[len(h)-1]
			f, err := os.Create(savedPath)
			errCheck(err)
			io.Copy(f, res.Body)
		} // if
	})

	// On every a element which has href attribute call callback
	c.OnHTML("a[href]", func(e *colly.HTMLElement) {
		link := e.Attr("href")
		// Print link
		// fmt.Printf("Link found: %q -> %s\n", e.Text, link)
		// fmt.Println(link)
		// Visit link found on page
		// Only those links are visited which are in AllowedDomains
		c.Visit(e.Request.AbsoluteURL(link))
	})

	// Start scraping on http://tumregels.github.io/Network-Programming-with-Go/
	c.Visit(destUrl)
}
```
### 版本介绍

- 此版本增加了对于CSS和JavaScript文件的保存，这些文件被保存在了gitbook文件夹中，保存的html打开展示和目标网站更加相近
- 由于theme.js的代码导致了跨域请求的失败，所以网页间无法通过点击导航栏链接进入，可以在导航栏链接处以新标签页打开(Open Link in New Tab)
- 上一版本中的章节首页点开有误还是没有解决

![v2_5.png](https://cdn.nlark.com/yuque/0/2020/png/1609946/1595590559326-d40eff90-b948-4dc5-9d06-84e01fb13f32.png#align=left&display=inline&height=470&margin=%5Bobject%20Object%5D&name=v2_5.png&originHeight=470&originWidth=822&size=109070&status=done&style=none&width=822)

- 此版本的保存还是有一些问题，导致indtroduction页面的css和js没有被找到

![v2_6.png](https://cdn.nlark.com/yuque/0/2020/png/1609946/1595664781574-be1f16cc-78e2-49bb-b3df-c0a1ffa7174c.png#align=left&display=inline&height=900&margin=%5Bobject%20Object%5D&name=v2_6.png&originHeight=900&originWidth=1440&size=169961&status=done&style=none&width=1440)

- 此外，左上角的搜索功能还不能使用

![v2_7.png](https://cdn.nlark.com/yuque/0/2020/png/1609946/1595678421909-8bf7428e-3017-4c8f-b5d7-061e4dd5aaeb.png#align=left&display=inline&height=900&margin=%5Bobject%20Object%5D&name=v2_7.png&originHeight=900&originWidth=1440&size=213307&status=done&style=none&width=1440)

- 此版本还存在页面的一些图标无法显示的问题
### 保存的目录结构

- 版本一和版本二保存的文件目录基本类似
- 下面是downloaded文件夹的结构示意图

![v1&2Folder.png](https://cdn.nlark.com/yuque/0/2020/png/1609946/1595673839028-9137cf1d-8459-4c97-b941-a295fdea65ca.png#align=left&display=inline&height=4230&margin=%5Bobject%20Object%5D&name=v1%262Folder.png&originHeight=4230&originWidth=936&size=354233&status=done&style=none&width=936)
### 运行结果展示
![v2_1.png](https://cdn.nlark.com/yuque/0/2020/png/1609946/1595589743498-bd4489b2-4ec1-4d05-96d0-6c201f1680d1.png#align=left&display=inline&height=900&margin=%5Bobject%20Object%5D&name=v2_1.png&originHeight=900&originWidth=1440&size=198377&status=done&style=none&width=1440)
![v2_2.png](https://cdn.nlark.com/yuque/0/2020/png/1609946/1595589752771-34f1fc82-09f7-47d0-a7ab-732e12e152a4.png#align=left&display=inline&height=900&margin=%5Bobject%20Object%5D&name=v2_2.png&originHeight=900&originWidth=1440&size=188558&status=done&style=none&width=1440)
![v2_3.png](https://cdn.nlark.com/yuque/0/2020/png/1609946/1595589761838-919cbf81-234a-4374-8efa-616b6c6124d7.png#align=left&display=inline&height=900&margin=%5Bobject%20Object%5D&name=v2_3.png&originHeight=900&originWidth=1440&size=228167&status=done&style=none&width=1440)
![v2_4.png](https://cdn.nlark.com/yuque/0/2020/png/1609946/1595681059573-bf3f60e2-e974-4eca-8b83-9a4713d27eea.png#align=left&display=inline&height=900&margin=%5Bobject%20Object%5D&name=v2_4.png&originHeight=900&originWidth=1440&size=235814&status=done&style=none&width=1440)
## 版本三
### 代码
crawlerv3.go
```go
package main

import (
	"fmt"
	"io"
	"net/http"
	"net/url"
	"os"
	"strings"

	"github.com/gocolly/colly"
)

// The url to get the main part of the web
var destUrl = "http://tumregels.github.io/Network-Programming-with-Go/"

// The url to get search_index.json used for search
var jasonUrl = "http://tumregels.github.io/Network-Programming-with-Go/search_index.json"

// The urls to get the icons
var iconUrl1 = "http://tumregels.github.io/Network-Programming-with-Go/gitbook/fonts/fontawesome/fontawesome-webfont.woff"
var iconUrl2 = "http://tumregels.github.io/Network-Programming-with-Go/gitbook/fonts/fontawesome/fontawesome-webfont.woff2"

// The url used for test
// var testUrl = "http://tumregels.github.io/Network-Programming-with-Go/gitbook/fonts/fontawesome/fontawesome-webfont.woff2"

// helper function for error check
func errCheck(err error) {
	if err != nil {
		panic(err)
	} // if
} // errCheck

// helper function to save the file given path and response
func saveFile(savedPath string, res *http.Response) {
	// create a file of the given name and in the given path
	f, err := os.Create(savedPath)
	errCheck(err)
	io.Copy(f, res.Body)
} // saveFile

func main() {
	// Instantiate default collector
	c := colly.NewCollector(
		// Visit only domains: tumregels.github.io
		colly.AllowedDomains("tumregels.github.io"),
		colly.MaxDepth(1),
	)
	// make folder Network-Programming-with-Go to save all the file copied
	os.Mkdir("./Network-Programming-with-Go/", 0777)
	// make sub-folder assets in Network-Programming-with-Go to save all the images
	os.Mkdir("./Network-Programming-with-Go/assets", 0777)
	// make sub-folder gitbook in Network-Programming-with-Go to save all the css and js files
	os.Mkdir("./Network-Programming-with-Go/gitbook", 0777)

  // mainly handle html pages
	c.OnResponse(func(r *colly.Response) {
		// // 以下代码将打印得到的response body的全部内容
		// fmt.Println("body", string(r.Body))
		// 获取链接的绝对路径
		fullurl := r.Request.URL.String()
		// fmt.Println(fullurl)
		// fmt.Println("Hello this is OnResponse")
		res, _ := http.Get(fullurl)
		//解析这个 URL 并确保解析没有出错。
		u, err := url.Parse(fullurl)
		errCheck(err)
		h := strings.Split(u.Path, "/")
		// if the file is for icons save it to gitbook folder
		if h[len(h)-3] == "fonts" {
			// first make fonts folder in gitbook folder
			dirPath1 := "./Network-Programming-with-Go/gitbook/" + h[len(h)-3]
			os.Mkdir(dirPath1, 0777)
			// then make a fontawesome folder in fonts folder
			dirPath2 := dirPath1 + "/" + h[len(h)-2]
			os.Mkdir(dirPath2, 0777)
			// finally save the file in the fontawesome folder
			savedPath := dirPath2 + "/" + h[len(h)-1]
			saveFile(savedPath, res)
		} else if (h[len(h)-2]) == "Network-Programming-with-Go" {
			// if the page is the introduction html page
			// name the introduction page index.html
			// and save in Network-Programming-with-Go folder
			savedPath := "./Network-Programming-with-Go/" + "index.html"
			saveFile(savedPath, res)
		} else if (h[len(h)-1]) == "" {
			// if the page is the chapter html page
			// make a folder of the chapter name
			// save the page in the folder with the name index.html
			dirPath := "./Network-Programming-with-Go/" + h[len(h)-2]
			os.Mkdir(dirPath, 0777)
			savedPath := dirPath + "/index.html"
			saveFile(savedPath, res)
		} else {
			// if the page is the content html page within each chapter
			// save the page to the corresponding chapter folder
			savedPath := "./Network-Programming-with-Go/" + h[len(h)-2] + "/" + h[len(h)-1]
			saveFile(savedPath, res)
		}
	})

	// search for all link tags that have a rel attribute that is equal to stylesheet - CSS
	// Handle CSS files
	c.OnHTML("link[rel='stylesheet']", func(e *colly.HTMLElement) {
		// hyperlink reference
		link := e.Attr("href")
		// 获取css的绝对路径
		fullurl := e.Request.AbsoluteURL(link)
		// fmt.Println("CSS path is: " + fullurl)
		res, _ := http.Get(fullurl)
		//解析这个 URL 并确保解析没有出错。
		u, err := url.Parse(fullurl)
		errCheck(err)
		// split the url according to "/"
		h := strings.Split(u.Path, "/")
		// if the css file is in the sub-folder in gitbook folder
		// first make the sub-folder and save the file
		if h[len(h)-2] != "gitbook" {
			dirPath := "./Network-Programming-with-Go/gitbook/" + h[len(h)-2]
			os.Mkdir(dirPath, 0777)
			savedPath := dirPath + "/" + h[len(h)-1]
			saveFile(savedPath, res)
		} else {
			// else, save the css file directly in gitbook folder
			savedPath := "./Network-Programming-with-Go/gitbook/" + h[len(h)-1]
			saveFile(savedPath, res)
		}
	})

	// search for all script tags with src attribute -- JS
	// Handle JavaScript files
	c.OnHTML("script[src]", func(e *colly.HTMLElement) {
		// src attribute
		link := e.Attr("src")
		// 获取js的绝对路径
		fullurl := e.Request.AbsoluteURL(link)
		// fmt.Println("JavaScript path is: " + fullurl)
		res, _ := http.Get(fullurl)
		//解析这个 URL 并确保解析没有出错。
		u, err := url.Parse(fullurl)
		errCheck(err)
		// split the url according to "/"
		h := strings.Split(u.Path, "/")
		// if the js file is in the sub-folder in gitbook folder
		// first make the sub-folder and save the file
		if h[len(h)-2] != "gitbook" {
			dirPath := "./Network-Programming-with-Go/gitbook/" + h[len(h)-2]
			os.Mkdir(dirPath, 0777)
			savedPath := dirPath + "/" + h[len(h)-1]
			saveFile(savedPath, res)
		} else {
			// else, save the css file directly in gitbook folder
			savedPath := "./Network-Programming-with-Go/gitbook/" + h[len(h)-1]
			saveFile(savedPath, res)
		}
	})

	// search for all img tags with src attribute -- Images
	// Handle images
	c.OnHTML("img[src]", func(e *colly.HTMLElement) {
		srcRef := e.Attr("src")
		// 获取图片的绝对路径
		fullurl := e.Request.AbsoluteURL(srcRef)
		// fmt.Println("Image path is: " + fullurl)
		res, _ := http.Get(fullurl)
		//解析这个 URL 并确保解析没有出错。
		u, err := url.Parse(fullurl)
		errCheck(err)
		// split the url according to "/"
		h := strings.Split(u.Path, "/")
		// save the image to assets folder
		if h[1] == "Network-Programming-with-Go" {
			savedPath := "./Network-Programming-with-Go/assets/" + h[len(h)-1]
			saveFile(savedPath, res)
		} // if
	})

	// On every a element which has href attribute call callback
	c.OnHTML("a[href]", func(e *colly.HTMLElement) {
		link := e.Attr("href")
		// Print link
		// fmt.Printf("Link found: %q -> %s\n", e.Text, link)
		// fmt.Println(link)
		// Visit link found on page
		// Only those links are visited which are in AllowedDomains
		c.Visit(e.Request.AbsoluteURL(link))
	})

	// Before making a request print "Visiting ..."
	// Handler the saving of search_index.json in this function
	// since according to my several tests when visiting the json link
	// the OnRequest function sometime was not been called
	c.OnRequest(func(r *colly.Request) {
		urlPath := r.URL.String()
		fmt.Println("Visiting", urlPath)
		//解析这个 URL 并确保解析没有出错。
		u, err := url.Parse(urlPath)
		errCheck(err)
		// split the url according to "/"
		h := strings.Split(u.Path, "/")
		// if the url is the path for search_index.json, save it to the file
		if h[len(h)-1] == "search_index.json" {
			res, _ := http.Get(urlPath)
			// save the json file to the Network-Programming-with-Go folder
			savedPath := "./Network-Programming-with-Go/" + h[len(h)-1]
			saveFile(savedPath, res)
		} // if
	})

	// Start scraping on the given url
	// c.Visit(testUrl)
	// visit the icon urls
	c.Visit(iconUrl1)
	c.Visit(iconUrl2)
	// visit the jason url to save search_index.json
	c.Visit(jasonUrl)
	// visit the url of the web to save most of the stuff
	c.Visit(destUrl)
} // main
```
### 版本介绍

- 此版本通过保存路径的合理调整，解决了introduction无法找到CSS和JavaScript的问题
- 调整后，所有爬取的文件被存在Network-Programming-with-Go文件夹中，introduction被以index.html的形式保存在Network-Programming-with-Go文件夹中，与章节的文件夹同级
- 为了解决搜索的问题，此版本中额外爬取了search_index.json，放在Network-Programming-with-Go文件夹中
- 为了解决图标无法显示的问题，此版本额外爬取了fontawesome-webfont.woff和fontawesome-webfont.woff2文件，存放在gitbook/fonts/fontawesome文件夹中
- 使用node js在Network-Programming-with-Go目录创建一个简单的server来打开保存的页面，解决了上一版本中章节首页点开有误、跨域请求失败的问题，并与search_index.json一起实现了查询功能
- 此外，此版本优化了代码并大幅增加了注释
### 保存的目录结构

- 版本三优化了保存的文件目录
- 下面是Network-Programming-with-Go文件夹的结构示意图

![v3Folder.png](https://cdn.nlark.com/yuque/0/2020/png/1609946/1595673877313-bc04c49c-f5df-4f40-93cb-a5d144bd411f.png#align=left&display=inline&height=4638&margin=%5Bobject%20Object%5D&name=v3Folder.png&originHeight=4638&originWidth=1146&size=414327&status=done&style=none&width=1146)
### Node js搭建本地服务器

- 为了能获得更好的浏览体验，决定使用Node js的express搭建服务器
- 首先要[下载Node js](https://nodejs.org/en/download/)并安装
- 然后在当前目录安装express库
```
$ npm install express
```

- 新建文件server.js
```jsx
var express = require("express");
var app = express();
// 以Network-Programming-with-Go文件夹作为根目录
// 网页打开访问localhost:3000
app.use(express.static("Network-Programming-with-Go")).listen(3000);
```
### 运行结果展示
#### 运行

- 首先在命令行中运行爬虫爬取网站数据
```
$ go run crawlerv3.go
```

- 待爬虫爬取结束后，运行server
```
$ node server.js
```

- 打开浏览器输入网址localhost:3000即可访问网站首页——introduction页面

![v3_5.png](https://cdn.nlark.com/yuque/0/2020/png/1609946/1595680924586-ef1f7c6d-0361-4ba0-9a69-23a15b373c67.png#align=left&display=inline&height=900&margin=%5Bobject%20Object%5D&name=v3_5.png&originHeight=900&originWidth=1440&size=145157&status=done&style=none&width=1440)
#### 结果展示
![v3_1.png](https://cdn.nlark.com/yuque/0/2020/png/1609946/1595681087910-b1e81e1b-0e20-487d-be28-13dac544b2bb.png#align=left&display=inline&height=900&margin=%5Bobject%20Object%5D&name=v3_1.png&originHeight=900&originWidth=1440&size=213841&status=done&style=none&width=1440)
![v3_2.png](https://cdn.nlark.com/yuque/0/2020/png/1609946/1595681102497-2ff22e28-2988-4d3d-b5e0-3a210db4b4f3.png#align=left&display=inline&height=900&margin=%5Bobject%20Object%5D&name=v3_2.png&originHeight=900&originWidth=1440&size=182817&status=done&style=none&width=1440)
![v3_3.png](https://cdn.nlark.com/yuque/0/2020/png/1609946/1595681111703-2ef3df29-697a-44db-a482-cd6116951f2b.png#align=left&display=inline&height=900&margin=%5Bobject%20Object%5D&name=v3_3.png&originHeight=900&originWidth=1440&size=229596&status=done&style=none&width=1440)
![v3_4.png](https://cdn.nlark.com/yuque/0/2020/png/1609946/1595681118650-49cdc3a7-f5b4-4157-8a52-31355be58ffe.png#align=left&display=inline&height=900&margin=%5Bobject%20Object%5D&name=v3_4.png&originHeight=900&originWidth=1440&size=236889&status=done&style=none&width=1440)
![v3_6.png](https://cdn.nlark.com/yuque/0/2020/png/1609946/1595681127446-4340473b-d6d0-4b74-b0fc-bd87b449ba59.png#align=left&display=inline&height=900&margin=%5Bobject%20Object%5D&name=v3_6.png&originHeight=900&originWidth=1440&size=237991&status=done&style=none&width=1440)

---

## 参考资料
go爬虫框架colly源码以及软件架构分析

[https://www.jianshu.com/p/93187b80541f](https://www.jianshu.com/p/93187b80541f)

Go 爬虫之 colly 从入门到不放弃指南

[https://cloud.tencent.com/developer/article/1480959](https://cloud.tencent.com/developer/article/1480959)

colly官网

[http://go-colly.org](http://go-colly.org)

go爬虫框架-colly实战(一)

[https://blog.csdn.net/qq_36659627/article/details/103671909](https://blog.csdn.net/qq_36659627/article/details/103671909)

Scraping the Web in Golang with Colly and Goquery

[https://benjamincongdon.me/blog/2018/03/01/Scraping-the-Web-in-Golang-with-Colly-and-Goquery/](https://benjamincongdon.me/blog/2018/03/01/Scraping-the-Web-in-Golang-with-Colly-and-Goquery/)

go-colly爬取图片-以基恩士网站为例

[https://www.jianshu.com/p/cda08dde65cd](https://www.jianshu.com/p/cda08dde65cd)

golang url 链接地址解析包

[https://www.jianshu.com/p/f5a6e39deaa5](https://www.jianshu.com/p/f5a6e39deaa5)

Package url

[https://golang.org/pkg/net/url/#URL](https://golang.org/pkg/net/url/#URL)

imthaghost/goclone/crawler/collector.go/

[https://github.com/imthaghost/goclone/blob/master/crawler/collector.go](https://github.com/imthaghost/goclone/blob/master/crawler/collector.go)

使用 Node.js 搭建 Web 服务器

[https://www.jianshu.com/p/c5fcef31707d](https://www.jianshu.com/p/c5fcef31707d)

使用nodejs搭建服务器显示HTML页面

[https://www.cnblogs.com/bossliu/p/5043631.html](https://www.cnblogs.com/bossliu/p/5043631.html)

