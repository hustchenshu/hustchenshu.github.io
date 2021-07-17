---
title: 浏览器基础知识
date: 2021-07-17 22:01:02
tags: [浏览器]
categories: [浏览器]
---

# browser
- [browser](#browser)
  - [流程](#流程)
  - [HTTP](#http)
  - [构建dom树](#构建dom树)
  - [添加css样式，生成cssom](#添加css样式生成cssom)
  - [布局（reflow）](#布局reflow)
  - [paint](#paint)
  - [reference](#reference)
## 流程

对浏览器的实现者来说，他们做的事情，就是把一个 URL 变成一个屏幕上显示的网页。

![browser-pipeline](https://booker-17dbbd-1252444055.tcloudbaseapp.com/cdn/fe-cdn/browser-pipeline.jpg)

+ 浏览器首先使用 HTTP 协议或者 HTTPS 协议，向服务端请求页面；
+ 把请求回来的 HTML 代码经过解析，构建成 DOM 树；
+ 计算 DOM 树上的 CSS 属性；
+ 最后根据 CSS 属性对元素逐个进行渲染，得到内存中的位图；
+ 一个可选的步骤是对位图进行合成，这会极大地增加后续绘制的速度；
+ 合成之后，再绘制到界面上。

## [HTTP](./HTTP.md)

## 构建dom树

解析请求回来的 HTML 代码，构建dom树。

![dom-token-analyse](https://booker-17dbbd-1252444055.tcloudbaseapp.com/cdn/fe-cdn/dom-token-analyse.png)

+ 词法分析器接收到的字符流，通过分析（状态机/正则）被拆分为一个个token；

+ 语法分析器对解析得到的token分析，构建dom树；

## 添加css样式，生成cssom

在构建dom树的同时，浏览器也会流式的同步计算css属性：检查生成的dom节点匹配到了哪些规则，再根据规则的优先级，做覆盖和调整。

**cssom是有rule部分和view部分的，rule部分是在dom开始之前就构件完成的，而view部分是跟着dom同步构建的。**

## 布局（reflow）

构建 DOM 树和计算 CSS 属性这两个步骤，我们的产出都是一个一个的元素。等所有元素生成完成，计算每个元素的大小和位置信息。

## paint

将计算好的渲染树，最终显示到屏幕上，分为渲染、合成、绘制三个部分；

渲染过程把元素变成位图，合成把一部分位图变成合成层，绘制是把“位图最终绘制到屏幕上，变成肉眼可见的图像”的过程，在这之前可能还会有合成等优化步骤。

**合成（compositing）** 
合成是英文术语 compositing 的翻译，这个过程实际上是一个性能考量，它并非实现浏览器的必要一环。那么合成的目标就是提高性能，根据这个目标，我们建立的原则就是最大限度减少绘制次数原则。

最后的步骤：把模型变成位图的过程，就是根据这些样式信息和大小信息，为每个元素在内存中渲染它的图形，并且把它绘制到对应的位置。


## reference

+ https://stackoverflow.com/questions/598841/how-to-get-started-building-a-web-browser
+ https://limpet.net/mbrubeck/2014/08/08/toy-layout-engine-1.html 
+ https://github.com/joegesualdo/abbott 
+ https://github.com/cytle/toy-browser 
+ https://github.com/ryanmcdermott/dumbkit 
+ https://github.com/aimergenge/toy-html-parser 
+ https://github.com/mbrubeck/robinson
+ https://github.com/maekawatoshiki/naglfar 