## 安装和快速使用

### 安装
colly的安装和其他的Go库安装一样，可以使用go get
```bash
go get -u github.com/gocolly/colly
```
### 快速使用
在使用时，我们首先需要在代码中导入colly
```go
import "github.com/gocolly/colly"
```
然后，我们创建collector
```go
c := colly.NewCollector()
```
第三步，事件监听，通过 callback 执行事件处理。
```go
// Find and visit all links
c.OnHTML("a[href]", func(e *colly.HTMLElement) {
    link := e.Attr("href")
    // Print link
    fmt.Printf("Link found: %q -> %s\n", e.Text, link)
    // Visit link found on page
    // Only those links are visited which are in AllowedDomains
    c.Visit(e.Request.AbsoluteURL(link))
})

c.OnRequest(func(r *colly.Request) {
    fmt.Println("Visiting", r.URL)
})
```
最后一步，c.Visit() 正式启动网页访问
```go
c.Visit("http://go-colly.org/")
```