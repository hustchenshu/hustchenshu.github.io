---
title: vue vs react
date: 2021-07-17 22:01:02
tags: [vue, react]
categories: [前端框架]
---

# vue vs react

## 用法
| 对比项| vue2  | vue3  | react15 | react16.8+ |
|---|---|---|---|---|
|api| options | composition | class | hooks |


### option优缺点

+ 优点
  + 便于理解
  + 数据方法划分明显

+ 缺点
  + 可维护性差，反复横跳
  + 可扩展性差，mixins有命名冲突问题，且以黑盒方式引入，不利于类型推断；


### composition优缺点

+ 优点
  + 功能分块，避免反复横跳
  + 对vue可以进行tree shaking
  + 方便组合，组合优于继承
  + 数据流清晰（定义、更新）
  + render函数只执行一次，后续靠的是响应式通知


+ 缺点
  + 难看，较难理解

### hooks优缺点

+ 优点


+ 缺点
  + render函数每次都会执行，hooks有顺序限制



## 数据流（mutable vs immutable）

**双向数据流**
代表：vue
可变数据，依赖收集，主动通知来驱动模板

**单向数据流**
代表：react
数据不可变，计算数据diff来驱动模板


## 模板语法

### jsx

jsx就是纯js，在react当中会被解析成`React.createElement`

+ 优点
  + 十分自由，js支持的jsx都支持


+ 缺点
  + 动态性强，可优化性弱（是我给你自由过了火）;

### template

特定语法，解析成`creatVNode`,变异过程当中会区分动态、静态节点，纯静态节点会跳过diff

+ 优点
  + 有限制，可遍历，可优化性强
  + 形式上更接近html，符合认知
+ 缺点
  + 不够动态，自由度小，有语法限制（仅能使用限定api）

## compiler

## vdom

使用js对象的形式来描述dom结构
+ 响应式：数据变更了通知订阅者，主动通知
+ vdom：不知道数据哪里变了，通过生成新vdom与旧的vdom进行diff才知道变化，被动计算;

### 性能瓶颈
+ 性能跟模板大小正相关，跟动态节点数量无关；
+ 

### vue = vdom + 响应式

vue1只有响应式，一旦响应式对象太多，导致卡顿；
vue2引入了vdom，使用的是snabbdom的代码，双端预判，较少循环次数；
vue3在vue2静态标记的基础上，动态标签内部的静态标签，使用block来标记；

**vue怎么区分使用vdom还是使用响应式呢？**
根据组件划分，组件之间通过响应式通知，组件内部，通过vdom计算diff；

fiber也就是说所谓的时间切片；
1、任务可以切开，利用空闲时间计算；
2、diff可以中断

原理，把树形结构转化成链表结构

### react 纯vdom
解析jsx，生成createElement，没有太多标记，所以能做的优化很少


**vdom杀手锏：**
+ 性能优化；
+ 跨端；