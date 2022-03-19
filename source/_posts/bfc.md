---
title: BFC与清除浮动
date: 2022-03-19 13:55:02
tags: [css, bfc]
categories: [css]
---

# 什么是BFC

## 定义

`BFC(Block formatting context)直译为"块级格式化上下文"。它是一个独立的渲染区域，只有Block-level box参与， 它规定了内部的Block-level Box如何布局，并且与这个区域外部毫不相干。`

+ Box 是 CSS 布局的对象和基本单位，Box的类型由元素的类型和display属性决定。主要分为block-level box和inline-level box两种box类型：block/list/table等元素会生成box-level box，而inline/inline-blck/inline-table等生成inline-box；

## 条件（如何形成bfc）

+ 当前元素为根元素；
+ float属性不为none；
+ overflow不为visible；
+ position不为static或者relative；
+ display的值为flex/inline-block/inline-flex/table-cell/table-caption

## 特性

+ 内部的元素会在垂直方向，从顶部开始一个接一个地放置。 
+ 元素垂直方向的距离由margin决定。属于同一个BFC的两个相邻 元素的margin会发生叠加
+ 都是从最左边开始的。每个元素的margin box的左边，与包含块border box的左边(对于从左往右的格式化，否则相反)。即使存在浮动也是如此
+ BFC的区域不会与float box叠加。 
+ BFC就是页面上的一个隔离的独立容器，容器里面的子元素不会影响到外面的元素，反之亦然。 
+ 浮动元素也参与计算BFC的高度计算（当BFC内部有浮动时，为了不影响外部元素的布局，BFC计算高度时会包
括浮动元素的高度）；
+ 文字层不会被浮动层覆盖，环绕于周围；

## 应用

### 避免margin重叠
    两个元素在同一个bfc内且垂直相邻，那么两者之间的margin会相互重叠，可以让两个元素分别形成各自的bfc，避免margin重叠；

### 两栏自适应布局（float）
    bfc内左侧box使用float，此时左侧和右侧属于同一个bfc，两者左侧对其，要使得右侧box接在左侧box后面，需要右侧box形成单独bfc，这样右侧bfc不与左侧float box重叠，自然接在左侧box后面；

### 清除浮动 

+ 浮动带来的问题
    + 子容器浮动，父容器高度塌陷
    + 浮动元素脱离文档流，对后面元素布局产生影响；

+ 如何清除
    + clear，浮动元素前后的兄弟元素添加clear元素，强制规定其左右不能存在浮动元素，从而隔离float元素对其的影响[MDN:clear](https://developer.mozilla.org/zh-CN/docs/Web/CSS/clear)；
    + 形成父级bfc；包含浮动元素的父容器形成bfc，则父容器包含float box；
    + 设定父容器高度；          

