## 版本四

crawlerv4.go
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

// use a boolean to avoid downloading the same CSS and JS files multiple times
// so the running time of the crawler will be reduced significantly
var isFirstTime = true

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

// helper function to make directory(folder)
func makeDir(dirPath string) {
	os.Mkdir(dirPath, 0777)
} // makeDir

// helper function to split the url
func splitUrl(givenUrl string) []string{
	// parse this url and make sure there is no error
	u, err := url.Parse(givenUrl)
	errCheck(err)
	h := strings.Split(u.Path, "/")
	return h
} // splitUrl

// helper function to save JS and CSS files
func saveJSAndCSS(e *colly.HTMLElement, attrName string) {
	// get the link using given attribute
	link := e.Attr(attrName)
	// get the absolute path of the JS/CSS file
	fullurl := e.Request.AbsoluteURL(link)
	// fmt.Println("JavaScript/CSS path is: " + fullurl)
	res, _ := http.Get(fullurl)
	// split the url
	h := splitUrl(fullurl)
	// if the JS/CSS file is in the sub-folder in gitbook folder
	// first make the sub-folder and save the file
	if h[len(h)-2] != "gitbook" {
		dirPath := "./Network-Programming-with-Go/gitbook/" + h[len(h)-2]
		makeDir(dirPath)
		savedPath := dirPath + "/" + h[len(h)-1]
		saveFile(savedPath, res)
	} else {
		// else, save the JS/CSS file directly in gitbook folder
		savedPath := "./Network-Programming-with-Go/gitbook/" + h[len(h)-1]
		saveFile(savedPath, res)
	}
} // saveJSAndCSS

func main() {
	// Instantiate default collector
	c := colly.NewCollector(
		// Visit only domains: tumregels.github.io
		colly.AllowedDomains("tumregels.github.io"),
		colly.MaxDepth(1),
	)
	// make folder Network-Programming-with-Go to save all the file copied
	makeDir("./Network-Programming-with-Go/")
	// make sub-folder assets in Network-Programming-with-Go to save all the images
	makeDir("./Network-Programming-with-Go/assets")
	// make sub-folder gitbook in Network-Programming-with-Go to save all the CSS and JS files
	makeDir("./Network-Programming-with-Go/gitbook")

	// mainly handle html pages
	c.OnResponse(func(r *colly.Response) {
		// get the absolute path
		fullurl := r.Request.URL.String()
		// fmt.Println(fullurl)
		res, _ := http.Get(fullurl)
		// split the url
		h := splitUrl(fullurl)
		// if the file is for icons save it to gitbook folder
		if h[len(h)-3] == "fonts" {
			// first make fonts folder in gitbook folder
			dirPath1 := "./Network-Programming-with-Go/gitbook/" + h[len(h)-3]
			makeDir(dirPath1)
			// then make a fontawesome folder in fonts folder
			dirPath2 := dirPath1 + "/" + h[len(h)-2]
			makeDir(dirPath2)
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
			makeDir(dirPath)
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
		// if it is the first time visiting this web
		// download the CSS files
		// since the web use the same CSS files for all the page
		if isFirstTime {
			saveJSAndCSS(e,"href")
		} // if
	})

	// search for all script tags with src attribute -- JS
	// Handle JavaScript files
	c.OnHTML("script[src]", func(e *colly.HTMLElement) {
		// if it is the first time visiting this web
		// download the JS files
		// since the web use the same JS files for all the page
		if isFirstTime {
			saveJSAndCSS(e,"src")
		} // if
	})

	// search for all img tags with src attribute -- Images
	// Handle images
	c.OnHTML("img[src]", func(e *colly.HTMLElement) {
		srcRef := e.Attr("src")
		// get the absolute path of the image
		fullurl := e.Request.AbsoluteURL(srcRef)
		// fmt.Println("Image path is: " + fullurl)
		res, _ := http.Get(fullurl)
		// split the url
		h := splitUrl(fullurl)
		// save the image to assets folder
		if h[1] == "Network-Programming-with-Go" {
			savedPath := "./Network-Programming-with-Go/assets/" + h[len(h)-1]
			saveFile(savedPath, res)
		} // if
	})

	// On every a element which has href attribute call callback
	c.OnHTML("a[href]", func(e *colly.HTMLElement) {
		// After the first web is visited and the CSS and JS files are saved we make
		// this bool false, so we will not download those files multiple times
		isFirstTime = false
		link := e.Attr("href")
		// Visit link found on page
		// Only those links are visited which are in AllowedDomains
		c.Visit(e.Request.AbsoluteURL(link))
	})

	// Before making a request print "Visiting ..."
	// Handler the saving of search_index.json in this function
	// since according to my several tests when visiting the json link
	// the OnRequest function sometimes was not been called
	c.OnRequest(func(r *colly.Request) {
		urlPath := r.URL.String()
		fmt.Println("Visiting", urlPath)
		// split the url
		h := splitUrl(urlPath)
		// if the url is the path for search_index.json, save it to the file
		if h[len(h)-1] == "search_index.json" {
			res, _ := http.Get(urlPath)
			// save the json file to the Network-Programming-with-Go folder
			savedPath := "./Network-Programming-with-Go/" + h[len(h)-1]
			saveFile(savedPath, res)
		} // if
	})

	// Start scraping on the given url
	// visit the icon urls
	c.Visit(iconUrl1)
	c.Visit(iconUrl2)
	// visit the jason url to save search_index.json
	c.Visit(jasonUrl)
	// visit the url of the web to save most of the stuff
	c.Visit(destUrl)
	// visit the url used for test
	// c.Visit(testUrl)
} // main
```