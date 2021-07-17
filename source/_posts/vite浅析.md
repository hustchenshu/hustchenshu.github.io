---
title: vite浅析
date: 2021-02-17 19:55:53
tags: [vite, vue]
categories: [前端框架, vue]
---

## 1. what

Vite，一个基于浏览器原生 ES imports 的开发服务器。利用浏览器去解析 imports，在服务器端按需编译返回，完全跳过了打包这个概念，服务器随起随用。同时不仅有 Vue 文件支持，还搞定了热更新，而且热更新的速度不会随着模块增多而变慢。针对生产环境则可以把同一份代码用 rollup 打包。虽然现在还比较粗糙，但这个方向我觉得是有潜力的，做得好可以彻底解决改一行代码等半天热更新的问题。

### 1.1 features

+ 快速的冷启动（跳过了打包流程，服务器随起随用）
+ 即时的热模块更新
+ 真正的按需编译

### 1.2 todos
+ 模块加载利用浏览器的es imports,自动发起模块请求，实现按需编译；
+ vue文件支持，直接返回vue文件无法当做esm模块直接使用，需要做一点编译工作适配esm；
+ node端对浏览器端发起的esm请求进行解析，返回可理解的esm模块，利用改造后的js完成代码功能；

## 2. Appearances

### 2.1 html
**source**
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <link rel="icon" href="/favicon.ico" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Vite App</title>
</head>
<body>
  <div id="app"></div>
  <script type="module" src="/src/main.js"></script>
</body>
</html>
```
**server response**
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <script type="module">import "/vite/client"</script>
    <meta charset="UTF-8">
    <link rel="icon" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Vite App</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.js"></script>
  </body>
</html>
```

### 2.2 main.js
**source**
```javascript
// file:  ./src/main.js
import { createApp } from 'vue'
import App from './App.vue'
import './index.css'
createApp(App).mount('#app')
```
**server response**
```javascript
// request: host/src/main.js
import { createApp } from '/@modules/vue.js'
import App from '/src/App.vue'
import '/src/index.css?import'

createApp(App).mount('#app')
```

### 2.3 App.vue
**source**
```js
<template>
  <img class="logo" alt="Vue logo" src="./assets/logo.png" />
  <HelloWorld msg="Hello Vue 3.0 + Vite" />
</template>

<script>
import HelloWorld from "./components/HelloWorld.vue";

export default {
  name: "App",
  components: {
    HelloWorld,
  },
};
</script>

<style scoped>
.logo {
  border: 1px solid greenyellow;
}
</style>
</script>
```

**server response[src/App.vue]**
```javascript
import HelloWorld from "/src/components/HelloWorld.vue";

const __script = {
  name: "App",
  components: {
    HelloWorld,
  },
};

import "/src/App.vue?type=style&index=0"
__script.__scopeId = "data-v-7ac74a55"
import { render as __render } from "/src/App.vue?type=template"
__script.render = __render
__script.__hmrId = "/src/App.vue"
__script.__file = "E:\\vite-demo\\demos\\demo0\\src\\App.vue"
export default __script
//# sourceMappingURL=data:application/json;base64,....
```

**server response[src/App.vue?type=style&index=0]**
```javascript
import { updateStyle } from "/vite/client"
const css = "\n.logo[data-v-7ac74a55] {\n  border: 1px solid greenyellow;\n}\n"
updateStyle("7ac74a55-0", css)
export default css
```

**server response[src/App.vue?type=template]**
```javascript
import { createVNode as _createVNode, resolveComponent as _resolveComponent, Fragment as _Fragment, openBlock as _openBlock, createBlock as _createBlock, withScopeId as _withScopeId, pushScopeId as _pushScopeId, popScopeId as _popScopeId } from "/@modules/vue.js"
const _withId = /*#__PURE__*/_withScopeId("data-v-7ac74a55")

_pushScopeId("data-v-7ac74a55")
const _hoisted_1 = /*#__PURE__*/_createVNode("img", {
  class: "logo",
  alt: "Vue logo",
  src: "/src/assets/logo.png"
}, null, -1 /* HOISTED */)
_popScopeId()

export const render = /*#__PURE__*/_withId(function render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_HelloWorld = _resolveComponent("HelloWorld")

  return (_openBlock(), _createBlock(_Fragment, null, [
    _hoisted_1,
    _createVNode(_component_HelloWorld, { msg: "Hello Vue 3.0 + Vite" })
  ], 64 /* STABLE_FRAGMENT */))
})
//# sourceMappingURL=data:application/json;base64,.....
```
## 3. code analysis

### 3.1 cli entry

**入口**
```javascript
// ./bin
#!/usr/bin/env node
require('../dist/node/cli')

// ./src/node/cli.ts
...
  const argv = require('minimist')(process.argv.slice(2)) // 取参数
  function logHelp() { ... } // help log
  const { help, h, mode, m, version, v } = argv

  if (help || h) {
    logHelp()
    return
  } else if (version || v) {
    // noop, already logged
    return
  }

  if (!options.command || options.command === 'serve') {
    runServe(options)
  } else if (options.command === 'build') {
    runBuild(options)
  } else if (options.command === 'optimize') {
    runOptimize(options)
  } else {
    console.error(chalk.red(`unknown command: ${options.command}`))
    process.exit(1)
  }
/*
开启开发服务器
*/
function runServe(options: UserConfig) {
  const server = require('./server').createServer(options)
  ...
}
/*
生产环境打包
*/
async function runBuild(options: UserConfig) { 
  try {
    await require('./build')[options.ssr ? 'ssrBuild' : 'build'](options)
    process.exit(0)
  } ... 
}
async function runOptimize(options: UserConfig) { ... }
```

**./src/node/server/index.ts**

```javascript
export function createServer(config: ServerConfig): Server {
  ......
  const app = new Koa<State, Context>()
  const server = resolveServer(config, app.callback())
  const watcher = chokidar.watch(root, {
    ignored: [/node_modules/, /\.git/]
  }) as HMRWatcher
  const resolver = createResolver(root, resolvers, alias)
  // 透传给插件的内容
  const context: ServerPluginContext = {
    root, // process.pwd(),当前工作目录
    app, // koa实例
    server, // http server
    watcher, // 文件变化监视器
    resolver, // 路径解析工具
    config, // 用户配置
    // port is exposed on the context for hmr client connection
    // in case the files are served under a different port
    port: config.port || 3000
  }

  // attach server context to koa context
  app.use((ctx, next) => {
    Object.assign(ctx, context)
    ctx.read = cachedRead.bind(null, ctx)
    return next()
  })

  const resolvedPlugins = [
    // rewrite and source map plugins take highest priority and should be run
    // after all other middlewares have finished
    sourceMapPlugin,
    moduleRewritePlugin,
    htmlRewritePlugin,
    // user plugins
    ...(Array.isArray(configureServer) ? configureServer : [configureServer]),
    envPlugin,
    moduleResolvePlugin,
    proxyPlugin,
    clientPlugin,
    hmrPlugin,
    ......
    vuePlugin,
    cssPlugin,
    enableEsbuild ? esbuildPlugin : null,
    jsonPlugin,
    assetPathPlugin,
    webWorkerPlugin,
    wasmPlugin,
    serveStaticPlugin
  ]
  resolvedPlugins.forEach((m) => m && m(context))

  const listen = server.listen.bind(server)
  server.listen = (async (port: number, ...args: any[]) => {
    if (optimizeDeps.auto !== false) {
      await require('../optimizer').optimizeDeps(config)
    }
    const listener = listen(port, ...args)
    context.port = server.address().port
    return listener
  }) as any

  return server
}
```

### 3.2 plugins


![enter image description here](https://booker-17dbbd-1252444055.tcloudbaseapp.com/cdn/anion.png)


核心功能通过plugin来实现，通过添加注册plugin来扩展完善生态；核心的几个基础组件在[v1.0.1](https://github.com/vitejs/vite/blob/26001044856d6e96f78217d23c5c6bba56a21e80/src/node/server.ts)已经编写完毕


![enter image description here](https://booker-17dbbd-1252444055.tcloudbaseapp.com/cdn/vite-server.png)

```javascript
const internalPlugins: Plugin[] = [
  moduleRewritePlugin,
  moduleResolvePlugin,
  vuePlugin,
  jsonPlugin,
  cssPlugin,
  hmrPlugin,
  serveStaticPlugin
]
```
+ ServerPluginContext[透传给插件的内容]


![enter image description here](https://booker-17dbbd-1252444055.tcloudbaseapp.com/cdn/vite-plugin.png)


一个简单的插件
**serverPluginWebWorker**
```javascript
import { ServerPlugin } from '.'

export const webWorkerPlugin: ServerPlugin = ({ app }) => {
  app.use((ctx, next) => {
    if (ctx.query.worker != null) {
      ctx.type = 'js'
      ctx.body = `export default function WrappedWorker() {
        return new Worker(${JSON.stringify(ctx.path)}, { type: 'module' })
      }`
      return
    }
    return next()
  })
}
```


## 4. core

### 4.1 [ES module](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Modules)

![enter image description here](https://booker-17dbbd-1252444055.tcloudbaseapp.com/cdn/caniuse-esmodule.png)

从上面可以看出，除IE之外的主流浏览器基本都支持使用export/import来导入导出js模块

```html
<script type="module">
    import { source } from './index.js'
</script>
```

如上，当html嵌入上述模块，浏览器发出http请求[http://host/index.js],服务器需要对该请求返回对应的js模块内容即可

### 4.2 SCF

![enter image description here](https://booker-17dbbd-1252444055.tcloudbaseapp.com/cdn/vite-vue-parse.png)

浏览器对SCF是不支持的，因为他不是符合标准的ESM模块，因此需要对vue单文件进行预处理，如同webpack在打包时需要vue-loader一样，这里通过`serverPluginVue`插件拆分为js、templete和style三个模块，通过请求路径的query来分别返回对应内容。

简化后的处理逻辑如下：
```javascript
// serverPluginVue.ts
function vuePlugin({app}){
  app.use(async (ctx, next) => {
    if (!ctx.path.endsWith('.vue') && !ctx.vue) {
      return next()
    }

    const query = ctx.query
    // 获取文件名称
    let filename = resolver.requestToFile(publicPath)

    // 解析器解析 SFC
    const descriptor = await parseSFC(root, filename, ctx.body)
    if (!descriptor) {
      ctx.status = 404
      return
    }
    // 第一次请求 .vue
    if (!query.type) {
      if (descriptor.script && descriptor.script.src) {
        filename = await resolveSrcImport(descriptor.script, ctx, resolver)
      }
      ctx.type = 'js'
      const { code, map } = await compileSFCMain(
        descriptor,
        filePath,
        publicPath,
        root
      )
      ctx.body = code
      ctx.map = map
      return etagCacheCheck(ctx)
    }
    // 请求/App.vue?type=template
    if (query.type === 'template') {
      // ...
    }
    // 请求/App.vue?type=style
    if (query.type === 'style') {
      // ...
    }
}
```

![enter image description here](https://booker-17dbbd-1252444055.tcloudbaseapp.com/cdn/vite-vue-split.png)

### 4.3 HMR

热更新一般分为以下四点：

+ 通过 watcher 监听文件改动
+ 通过 server 端编译资源，并推送新资源信息给 client 。
+ 需要框架支持组件 rerender/reload 
+ client 收到资源信息，执行框架 rerender 逻辑。

我们通过`serverPluginHmr`插件，收集文件变动，搭建ws server端，当文件变动，通知客户端进行更新；
同时加客户端所需的hmr框架`client.js`插入到html中，`client.js`将会建立与ws server的链接，接收文件变动信息，动态更新模块；

```javascript
// ----------------------serverPluginHmr.ts--------------------
  const wss = new WebSocket.Server({ noServer: true })
  ......
  watcher.on('change', (file) => {
    if (!(file.endsWith('.vue') || isCSSRequest(file))) {
      // everything except plain .css are considered HMR dependencies.
      // plain css has its own HMR logic in ./serverPluginCss.ts.
      handleJSReload(file)
    }
  })

// ------------------------client.js-------------------

// Listen for messages
const socket = new WebSocket(socketUrl, 'vite-hmr')
socket.addEventListener('message', async ({ data }) => {
  const payload = JSON.parse(data) as HMRPayload | MultiUpdatePayload
  if (payload.type === 'multi') {
    payload.updates.forEach(handleMessage)
  } else {
    handleMessage(payload)
  }
})

```


## 5. why && diff

![enter image description here](https://booker-17dbbd-1252444055.tcloudbaseapp.com/cdn/yyx-webpack.png)

### 5.1 advantages

+ 无打包环节

打包即通过webpack等工具将各个代码模块聚合在一起形成bundle文件，并且能够通过制定的规则读取调用模块代码。比如 webpack 使用 map 存放模块 id 和路径，使用 __webpack_require__  方法获取模块导出，因为浏览器支持了模块化，所以打包这一步就可以省略了。

+ 天然按需加载
上面说到通过打包工具会将源代码聚合成bundle，但是打包是提前进行，而且是静态的，无论是否执行都会打进来，当然现在可以通过import()、require.ensure等方法实现异步动态加载（被引入模块仍然需要打包），或者通过tree shaking减小体积，但是这些需要开发者通过评估进行优化，vite则能够让开发者只专注于code。

+ [es-dev-server](https://open-wc.org/developing/es-dev-server.html)
+ [rollup](https://rollupjs.org/guide/en/)
+ [snowpack](https://www.snowpack.dev/)

  + 两个工具都原生支持基于 ESM 的 HMR。 Vite 先一步支持， snowpack 在 v2 时也支持了。双方在基于 ESM 的 HMR 上合作过，尝试建立统一的 api， 但因为底层不同还是会略微不同。
  + vite 更加专注，自带更多功能，如 typescript 编译，css 导入， css 模块和 post css 的默然支持。
  + 生产环境打包， vite 使用 rollup， snowpack 使用 parcel/webpack

## code

### commit history
+ [first commit](https://github.com/vitejs/vite/commit/820c2cfbefd376b7be2d0ba5ad1fd39d3e45347e)
+ [v1.0.1](https://github.com/vitejs/vite/tree/26001044856d6e96f78217d23c5c6bba56a21e80)

## reference
+ [Vite 原理浅析](https://juejin.im/post/6844904146915573773)
+ [vite 如何做到让 vue 本地开发更快速？](https://developer.aliyun.com/article/761551)
+ [🤚手摸手带你实现Vite](https://juejin.im/post/6871081408815693837)

