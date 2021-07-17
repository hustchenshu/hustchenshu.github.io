---
title: css
date: 2021-07-17 22:01:02
tags: [css]
categories: [css]
---

# CSS

CSS 的顶层样式表由两种规则组成的规则列表构成，一种被称为 at-rule，也就是 at 规则，另一种是 qualified rule，也就是普通规则。

at-rule 由一个 @ 关键字和后续的一个区块组成，如果没有区块，则以分号结束。

qualified rule 则是指普通的 CSS 规则，也就是我们所熟识的，由选择器和属性指定构成的规则。

### at 规则

+ [@charset](https://www.w3.org/TR/css-syntax-3/)
  
@charset 用于提示 CSS 文件使用的字符编码方式，它如果被使用，必须出现在最前面。这个规则只在给出语法解析阶段前使用，并不影响页面上的展示效果。

```css
@charset "utf-8";
```

+ [@import](https://www.w3.org/TR/css-cascade-4/)

@import 用于引入一个 CSS 文件，除了 @charset 规则不会被引入，@import 可以引入另一个文件的全部内容。

```css
@import "mystyle.css";
@import url("mystyle.css");
```

+ [@media](https://www.w3.org/TR/css3-conditional/)

media 就是大名鼎鼎的 media query 使用的规则了，它能够对设备的类型进行一些判断。在 media 的区块内，是普通规则列表。

```css
@media print {
    body { font-size: 10pt }
}
```

+ [@page](https://www.w3.org/TR/css-page-3/)

page 用于分页媒体访问网页时的表现设置，页面是一种特殊的盒模型结构，除了页面本身，还可以设置它周围的盒。

+ [@counter-style](https://www.w3.org/TR/css-counter-styles-3)

counter-style 产生一种数据，用于定义列表项的表现。

```css
@counter-style triangle {
  system: cyclic;
  symbols: ‣;
  suffix: " ";
}
```

+ [@keyframes](https://www.w3.org/TR/css-animations-1/)

keyframes 产生一种数据，用于定义动画关键帧。

```css
@keyframes diagonal-slide {

  from {
    left: 0;
    top: 0;
  }

  to {
    left: 100px;
    top: 100px;
  }

}

```

+ [@fontface](https://www.w3.org/TR/css-fonts-3/)

fontface 用于定义一种字体，icon font 技术就是利用这个特性来实现的。

```css
@font-face {
  font-family: Gentium;
  src: url(http://example.com/fonts/Gentium.woff);
}

p { font-family: Gentium, serif; }
```

+ [@supports](https://www.w3.org/TR/css3-conditional/)

support 检查环境的特性，它与 media 比较类似。

+ [@namespace](https://www.w3.org/TR/css-namespaces-3/)

用于跟 XML 命名空间配合的一个规则，表示内部的 CSS 选择器全都带上特定命名空间。

### 普通规则

+ 普通规则
  + 选择器
  + 声明列表
    + 属性
    + 值
      + 值的类型
      + 函数

#### [选择器](https://www.w3.org/TR/selectors-4/)

![selector](https://booker-17dbbd-1252444055.tcloudbaseapp.com/cdn/fe-cdn/css-selector.png)

+ **简单选择器**

![simple](https://booker-17dbbd-1252444055.tcloudbaseapp.com/cdn/fe-cdn/simple-selector.png)

+ **选择器的组合**

选择器列表是用逗号分隔的复杂选择器序列；复杂选择器则是用空格、大于号、波浪线等符号连接的复合选择器；复合选择器则是连写的简单选择器组合。

根据选择器列表的语法，选择器的连接方式可以理解为像四则运算一样有优先级。

+ 第一优先级
  + 无连接符号
+ 第二优先级
  + “空格”
  + “~”
  + “+”
  + “>”
  + “||”
+ 第三优先级
  + “,”

+ **选择器的优先级**
  
CSS 标准用一个三元组 (a, b, c) 来构成一个复杂选择器的优先级。

+ id 选择器的数目记为 a；
+ 伪类选择器和 class 选择器的数目记为 b；
+ 伪元素选择器和标签选择器数目记为 c；
+ “*” 不影响优先级。

CSS 标准建议用一个足够大的进制，获取“ a-b-c ”来表示选择器优先级。


```javascript
specificity = base * base * a + base * b + c
```

**行内属性的优先级永远高于 CSS 规则，浏览器提供了一个“口子”，就是在选择器前加上“!import”。**

**同一优先级的选择器遵循“后面的覆盖前面的”原则**



#### 声明

声明部分是一个由“属性: 值”组成的序列。

**属性是由中划线、下划线、字母等组成的标识符，CSS 还支持使用反斜杠转义。我们需要注意的是：属性不允许使用连续的两个中划线开头，这样的属性会被认为是 CSS 变量。**

```css
:root {
  --main-color: #06c;
  --accent-color: #006;
}
/* The rest of the CSS file */
#foo h1 {
  color: var(--main-color);
}
```


### 排版

#### 正常流

我们要把正常流中的一个盒或者文字排版，需要分成三种情况处理：

+ 当遇到块级盒：排入块级格式化上下文。
+ 当遇到行内级盒或者文字：首先尝试排入行内级格式化上下文，如果排不下，那么创建一个行盒，先将行盒排版（行盒是块级，所以到第一种情况），行盒会创建一个行内级格式化上下文。
+ 遇到 float 盒：把盒的顶部跟当前行内级上下文上边缘对齐，然后根据 float 的方向把盒的对应边缘对到块级格式化上下文的边缘，之后重排当前行盒。

一些元素会在其内部创建新的块级格式化上下文，这些元素有：

+ 浮动元素；
+ 绝对定位元素；
+ 非块级但仍能包含块级元素的容器（如 inline-blocks, table-cells, table-captions）；
+ 块级的能包含块级元素的容器，且属性 overflow 不为 visible。