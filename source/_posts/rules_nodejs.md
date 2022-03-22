---
title: rules_nodejs
date: 2022-03-19 15:01:02
tags: [工程实践, bazel, rules_nodejs, api翻译]
categories: [实践, 仓库管理， bazel]
---

# rules_nodejs

[原文](https://bazelbuild.github.io/rules_nodejs/Built-ins.html)

## Bazel js 规则集
Bazel js 规则集用于构建和测试js项目，包括nodejs和浏览器端；

### 概览
规则集主要包含三个层：
+ 1.@rules_nodejs 模块，也是本规则集的核心模块（core），他包含了一个能够拉取独立的node/npm/yarn（取决于你的开发机器）环境的工具链，同时，也允许js规则之间的一些交互操作。这个对想要制作自己的的js环境的bazel rules开发人员是很有用的；
+ 2.build_bazel_rules_nodejs模块，这个模块依赖于@rules_nodejs模块，在未来发布的版本中，这个模块的所有内容都将迁移到@rules_nodejs模块当中，移动到另一个仓库中，或者被废弃掉。这个模块提供了通过npm或者yarn安装第三方包的能力，BUILD文件将生成，以便于bazel可以加在第三方包的依赖图，并调用已安装工具的命令行。同时，本模块也支持运行nodejs程序等其他有用的规则。
+ 3.一些自定义规则，通过名为@bazel的npm包发布。当规则集需要从peerDependency当中require包含js代码的包时，这些自定义规则是必须的，因为node的解析算法要求require的调用点必须在node_modules树当中。注意，我们不在接受新的npm包，建议这样的自定义规则放在独立的仓库当中。
  + [concatjs](https://www.npmjs.com/package/@bazel/concatjs)
  + [Cypress](https://www.npmjs.com/package/@bazel/cypress)
  + [esbuild](https://www.npmjs.com/package/@bazel/esbuild)
  + [Jasmine](https://www.npmjs.com/package/@bazel/jasmine)
  + [Karma](https://www.npmjs.com/package/@bazel/karma)
  + [Labs](https://www.npmjs.com/package/@bazel/labs)
  + [Protractor](https://www.npmjs.com/package/@bazel/protractor)
  + [Rollup](https://www.npmjs.com/package/@bazel/rollup)
  + [Terser](https://www.npmjs.com/package/@bazel/terser)
  + [TypeScript](https://www.npmjs.com/package/@bazel/typeScript)

### 设计理念
我们的目标是是bazel成为现有npm工具上的最小分层，并且与这些工具做到最大兼容。

这意味着我们不会争论webpack还是Rollup，你可以通过bazel使用任何你喜欢的工具，实际上，我们推荐你保持现有的工具，那样你就只需要专注于做bazel迁移的工作了。

在很多情况下，我们需要权衡取舍，我们不会为开发者做任何决策，因为我们提供给了许多方式，而不是像许多其他js打包工具一样指定某个“最好”的方式。当然，这会增加这些规则的理解难度和复杂度，但是也避免了选择错误的“赢家”。例如，你可以自己安装依赖，或者让bazel管理依赖项副本，或者让bazel链接到项目中的项目。

js生态系统充满了错误等价观点，我们经常遇到的就是webpack和bazel那个更好？这都是可以理解的，毕竟大多数js工具都被迫搭建一个孤立的插件系统提供一条龙服务，而且人类喜欢争锋相对的竞争。相反的，bazel只是编排调用这些方法。

### 快速上手

首先，我们闯将一个工作区（workspace），其实也就是一个目录，我们可以通过@bazel/create的npm包来创建，这对于我们大多数人来说是最快的方式。

```js
// npm
npm init @bazel my_workspace
cd my_workspace

// yarn
yarn create @bazel my_workspace
cd my_workspace

// 这些指令等同于npx @bazel/create，将会下载最新的@bazel/create包并运行其中的程序
```
接下来，我们安装一些开发工具。比如我们需要babel来转译我们的js代码，需要mocha来跑单元测试，需要http-server来启动我们的应用，这些都是任意可选的，你可以使用你喜欢的任何东西。

```js
npm install @babel/core @babel/cli @babel/preset-env http-server mocha domino
```

让我们用bazel来运行这些工具，有两种运行工具的方法：
+ 通过导入npm包当中的index.bzl自动生成bazel rule；
+ 自己编写或者使用rule_nodejs当中的自定义规则；
  
在当前这个例子当中，我们使用自动生成的方法。首先我们需要导入他们，使用load描述，在BUILD.bazel中编辑添加如下代码；

```Starlark
load("@npm//@babel/cli:index.bzl", "babel")
load("@npm//mocha:index.bzl", "mocha_test")
load("@npm//http-server:index.bzl", "http_server")
```
`这向我们展示了rules_nodejs已经告诉bazel一个名为@npm的工作空间是可用的，rules_nodejs将添加index.bzl暴露出该npm包安装的所有二进制文件，我们安装的三个工具都在@npm范围内，每个工具包都有一个扩展名为.bzl的文件`

接下来，我们教bazel如何将我们的js输入代码转译成需要的输出文件。这里我们假设你的项目里有app.js、es5.babelrc文件，请参阅我们的示例[webapp](https://github.com/bazelbuild/rules_nodejs/tree/1.4.0/examples/webapp),现在我们想要babel生成app.es5.js，所以我们添加BUILD.bazel如下：

```bazel
babel(
    name = "compile",
    data = [
        "app.js",
        "es5.babelrc",
        "@npm//@babel/preset-env",
    ],
    outs = ["app.es5.js"],
    args = [
        "app.js",
        "--config-file",
        "./$(execpath es5.babelrc)",
        "--out-file",
        "$(execpath app.es5.js)",
    ],
)
```

`这里仅仅调用了babel的命令行工具，你可以查看他们的文档了解需要传递的参数，我们在bazel中使用$(execpath)来帮助我们标识路径，这样便不需要硬编码我们的输入输出路径了。`

现在我们可以通过运行`npm run build`来构建我们的应用了。
我们可以看到babel的.js输出出现在dist/bin文件夹中。
让我们通过添加以下内容到BUILD.bazel来看看我们的页面长什么样：

```js
http_server(
    name = "server",
    data = [
        "index.html",
        "app.es5.js",
    ],
    args = ["."],
)
```
在package.json当中添加一个serve脚本：

```json
{
  "scripts": {
    "serve": "ibazel run :server"
  }
}
```

`ibazel是bazel的watch模式，注意，在windows上，你需要添加--enable_runfile参数给bazel，因为bazel会创建一个目录用来方便统一存放输入和输出文件`

现在我们可以启动serve了： `npm run serve`

最后，我们将使用mocha并添加测试，添加dimino包这样就不用浏览器环境了，在BUILD.bazel添加如下：

```js
mocha_test(
    name = "unit_tests",
    args = ["*.spec.js"],
    data = glob(["*.spec.js"]) + [
        "@npm//domino",
        "app.es5.js",
    ],
)
```

运行测试： `npm test`；


## @rules_nodejs
这是核心模块，被内部的build_bazel_rules_nodejs模块引用，许多用户应该继续使用后者，忽略这个核心模块。

他们的依赖图是`build_bazel_rules_nodejs -> rules_nodejs -> bazel_skylib`

特点：
+ 一个能根据开发者的机器拉取独立node、npm、yarn副本的工具链；
+ 核心模块提供js规则之间交互的能力；

### directory_file_path

#### 用法

```js
directory_file_path(name, directory, path)
```
提供文件目录路径信息来引用指定文件下的文件（否则没有办法给他一个bazel标签）

#### 属性

`name`
当前target中唯一的一个名字

`directory`
一个目录

`path`
目录下的路径

### node_repositories

#### 用法

```js
node_repositories(name, node_download_auth, node_repositories, node_urls, node_version, platform,
                  repo_mapping, use_nvmrc)
```
在用户的WORKSPACWE当中运行，安装rules_nodejs依赖项。

此规则用于设置node、npm和npx，他们的版本号可以通过以下三种方法设置：

+ 最简单的用法

不指定显式版本。这将会下载并使用当前使用的rules_nodejs可用的最新的nodejs版本。请注意，如果你稍后会使用yarn_install或者npm_install，你可以跳过node_repositories的调用，我们会为你自动选择最简单的用法。

+ 强制指定版本

你可以通过在调用时传入与已知版本匹配的值，来指定nodejs的下载版本。

+ 使用自定义版本
  
你可以传入nodejs版本的库和下载地址列表来指定要使用的node环境。

你可以使用如下方式指定自定义nodejs版本：
```js
node_repositories(
    node_repositories = {
        "10.10.0-darwin_amd64": ("node-v10.10.0-darwin-x64.tar.gz", "node-v10.10.0-darwin-x64", "00b7a8426e076e9bf9d12ba2d571312e833fe962c70afafd10ad3682fdeeaa5e"),
        "10.10.0-linux_amd64": ("node-v10.10.0-linux-x64.tar.xz", "node-v10.10.0-linux-x64", "686d2c7b7698097e67bcd68edc3d6b5d28d81f62436c7cf9e7779d134ec262a9"),
        "10.10.0-windows_amd64": ("node-v10.10.0-win-x64.zip", "node-v10.10.0-win-x64", "70c46e6451798be9d052b700ce5dadccb75cf917f6bf0d6ed54344c856830cfb"),
    },
)
```
这些将被映射成下面的使用node_urls表示的自定义下载url：
```js
node_repositories(
    node_version = "10.10.0",
    node_repositories = {"10.10.0-darwin_amd64": ("node-v10.10.0-darwin-x64.tar.gz", "node-v10.10.0-darwin-x64", "00b7a8426e076e9bf9d12ba2d571312e833fe962c70afafd10ad3682fdeeaa5e")},
    node_urls = ["https://mycorpproxy/mirror/node/v{version}/{filename}"],
)
```
那么，mac客户端将尝试从下载节点：`https://mycorpproxy/mirror/node/v10.10.0/node-v10.10.0-darwin-x64.tar.gz`进行下载，并期望该文件具有的sha256sum为：`00b7a8426e076e9bf9d12ba2d571312e833fe962c70afafd10ad3682fdeeaa5e`

+ 使用自定义node.js

为避免下载，你可以使用构建好的二进制包，或者直接从源代码构建，可以参看[工具链](https://bazelbuild.github.io/rules_nodejs/toolchains.md)和examples/vendored_node_and_yarn.


#### 属性

`name`
当前target中唯一的一个名字

`node_download_auth`
用于所有url请求的身份验证，示例：` {“type”: “basic”, “login”: “", "password": "" }`
默认为：`{}`

`node_repositories`
要使用的node仓库
默认为：`{}`

`node_urls`


`node_version`


`platform`


`repo_mapping`


`use_nvmrc`



## @build_bazel_rules_nodejs

## @bazel npm扩展包