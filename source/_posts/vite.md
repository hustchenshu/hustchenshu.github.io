
## 新特性

### 插件机制和API

### 多框架支持

+ Vue 3 单文件组件支持：@vitejs/plugin-vue
+ Vue 3 JSX 支持：@vitejs/plugin-vue-jsx
+ Vue 2 支持：underfin/vite-plugin-vue2

### 基于esbuild的依赖预打包

+ 原因

Vite 以 原生 ESM 方式服务源码。这实际上是让浏览器接管了打包程序的部分工作：Vite 只需要在浏览器请求源码时进行转换并按需提供源码。根据情景动态导入的代码，即只在当前屏幕上实际使用时才会被处理。如下是浏览器支持的导入：

```javascript

```

如下的裸模块导入：

```javascript
import { a } from 'b';
```

`'b'` 这个esm模块在浏览器中是无法获取到的，这个包可能是node_modules当中的依赖，而且`b`模块可能是commomjs/UMD模块，所以首先我们需要将其转化为ESM格式，而且需要将这个导入语法重写：

```javascript
import { a } from '/node_modules/.vite/b.js';
```

+ 优势
  + 预先转化成esm，可利用esm模块的所有优势；
  + 一次转化，终身适用，仅在依赖变更的时候触发重建；
  + 采用强缓存，减少不必要请求（一般情况下依赖包不会变动）
  + 开箱支持ts，预编译阶段将ts编译成js，且速度是`tsc`的`20~30`倍开箱即用

+ 不足
  + 功能不够完善，特别是代码分割和 CSS 处理方面；
  + 对ts只执行转移，不含类型信息，丢失类型推到；

### 更好的css支持

+ CSS Modules

导入 .css 文件将会把内容插入到 <style> 标签中，同时也带有 HMR 支持。
任何以 .module.css 为后缀名的 CSS 文件都被认为是一个 CSS modules 文件。导入这样的文件会返回一个相应的模块对象：

```css
/* example.module.css */
.red {
  color: red;
}
```

```javascript
import classes from './example.module.css'
document.getElementById('foo').className = classes.red
```

+ CSS 预处理器

Vite 也提供了对 .scss, .sass, .less, .styl 和 .stylus 文件的内置支持,只需要安装特定的预处理器依赖本身即可获得支持；


### ssr支持



### 旧浏览器支持

Vite 默认只支持原生支持 ESM 的现代浏览器，但可以通过官方的 @vitejs/plugin-legacy 来支持旧浏览器。legacy 插件会自动额外生成一个针对旧浏览器的包，并且在 html 中插入根据浏览器 ESM 支持来选择性加载对应包的代码
