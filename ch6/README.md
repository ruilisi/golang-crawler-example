## 版本二

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