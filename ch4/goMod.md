## 使用go mod

go modules是一种新型的包管理工具。我们可以在项目文件夹内通过如下代码初始化go modules
```bash
go mod init <package name>
```

- 初始化后系统会生成一个go.mod文件
- 然后执行go build或者运行写的程序，再次查看go.mod文件发现多了一些内容(依赖包列表以及版本)，同时生成go.sum文件
- go.sum是一个模块版本内容的校验值，用来验证当前缓存的模块。go.sum包含了直接依赖和间接依赖的包的信息，比go.mod要多一些。

### go mod常用指令
| go mod 命令 | 作用 |
| :---: | :---: |
| go mod init <项目名> | 在当前目录初始化mod |
| go mod help | 查看帮助 |
| go mod tidy | 拉取缺少的模块，移除不用的模块 |
| go mod graph | 打印模块依赖图 |
| go mod download | 下载依赖包 |
| go list -m all | 显示依赖关系 |