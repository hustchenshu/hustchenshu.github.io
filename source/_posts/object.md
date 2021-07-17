---
title: JS当中的对象
date: 2021-07-17 22:01:02
tags: [javascript]
categories: [javascript]
---

# Object

- [Object](#object)
  - [对象的特征](#对象的特征)
  - [JavaScript中对象](#javascript中对象)
    - [独有的特色](#独有的特色)
    - [两类属性](#两类属性)
      - [数据属性](#数据属性)
      - [访问器属性](#访问器属性)
  - [面向对象还是基于对象](#面向对象还是基于对象)
    - [如何定义面向对象和基于对象](#如何定义面向对象和基于对象)
  - [原型](#原型)
    - [原型系统](#原型系统)
    - [类与原型](#类与原型)
      - [new](#new)
  - [对象分类](#对象分类)
    - [内置对象·原生对象](#内置对象原生对象)

## 对象的特征

+ 对象具有唯一标识性：及时完全相同的两个对象，也并非是同一个对象;（内存地址）

+ 对象有状态：独享具有状态，同意对象可能处于不用状态之下;

+ 对象具有行为：即对象的状态，可能因为他的行为产生变迁；

## JavaScript中对象

### 独有的特色

JavaScript 中对象独有的特色是：对象具有高度的动态性，这是因为 JavaScript 赋予了使用者在运行时为对象添改状态和行为的能力。

`人话：`不一定要在声明时确定对象的属性，可以动态添加；

### 两类属性

#### 数据属性

+ value：就是属性的值。
+ writable：决定属性能否被赋值。
+ enumerable：决定 for in 能否枚举该属性。
+ configurable：决定该属性能否被删除或者改变特征值。

#### 访问器属性

+ getter：函数或 undefined，在取属性值时被调用。
+ setter：函数或 undefined，在设置属性值时被调用。
+ enumerable：决定 for in 能否枚举该属性。
+ configurable：决定该属性能否被删除或者改变特征值。

## 面向对象还是基于对象

`“JavaScript 不是面向对象”？`

因为实际上 JavaScript 对象的运行时是一个“属性的集合”，由于 JavaScript 的对象设计跟目前主流基于类的面向对象差异非常大。
可事实上，这样的对象系统设计虽然特别，但是 JavaScript 提供了完全运行时的对象系统，这使得它可以模仿多数面向对象编程范式，所以它也是正统的面向对象语言。

`基于对象？基于类？`

在不同的编程语言中，设计者也利用各种不同的语言特性来抽象描述对象。最为成功的流派是使用“类”的方式来描述对象，这诞生了诸如 C++、Java 等流行的编程语言。这个流派叫做基于类的编程语言。

“基于类”并非面向对象的唯一形态，如果我们把视线从“类”移开，Brendan 当年选择的原型系统，就是一个非常优秀的抽象对象的形式。

还有一种就是基于原型的编程语言，它们利用原型来描述对象。我们的 JavaScript 就是其中代表。

### 如何定义面向对象和基于对象

+ 基于对象

语言和宿主的基础设施由对象来提供，并且 JavaScript 程序即是一系列互相通讯的对象集合

+ 面向对象

## 原型

### 原型系统

原型系统满足两条规则

+ 如果所有对象都有私有字段\[\[prototype]]，就是对象的原型
+ 读一个属性，如果过对象本身没有，则会继续访问对象的原型，知道原型为空或者找到为止；

### 类与原型

在早期版本的 JavaScript 中，“类”的定义是一个私有属性 \[\[class]]，语言标准为内置类型诸如 Number、String、Date 等指定了\[\[class]]属性，以表示它们的类。语言使用者唯一可以访问\[\[class]]属性的方式是 Object.prototype.toString。

`在 ES5 开始，[[class]] 私有属性被 Symbol.toStringTag 代替，可被覆盖`

```javascript
var o = { [Symbol.toStringTag]: "MyObject" };
console.log(o + "");
```

`es6 加入了新类型class`

ES6 中引入了 class 关键字，并且在标准中删除了所有\[\[class]]相关的私有属性描述，类的概念正式从属性升级成语言的基础设施。

#### new

new运算符实际操作：

+ 以构造器的prototype属性为原型，创建新对象；
+ 将this和调用参数传递给构造器，执行；
+ 如果构造器返回对象，则返回，否则返回第一步创建的对象；

所以可以这样模拟类：

```javascript
function c1(){
    this.p1 = 1;
    this.p2 = function(){
        console.log(this.p1);
    }
} 
var o1 = new c1;
o1.p2();

function c2(){
}
c2.prototype.p1 = 1;
c2.prototype.p2 = function(){
    console.log(this.p1);
}

var o2 = new c2;
o2.p2();
```

## 对象分类

+ 宿主对象：由 JavaScript 宿主环境提供的对象，它们的行为完全由宿主环境决定。
+ 内置对象：由 JavaScript 语言提供的对象。
  + 固有对象：由标准规定，随着 JavaScript 运行时创建而自动创建的对象实例。
  + 原生对象：可以由用户通过 Array、RegExp 等内置构造器或者特殊语法创建的对象。
  + 普通对象：由{}语法、Object 构造器或者 class 关键字定义类创建的对象，它能够被原型继承。

### 内置对象·原生对象

![native-objects](https://booker-17dbbd-1252444055.tcloudbaseapp.com/cdn/fe-cdn/native-objects.png)

