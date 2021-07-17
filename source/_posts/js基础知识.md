---
title: JS基础知识
date: 2021-07-17 22:01:02
tags: [javascript]
categories: [javascript]
---

- [JavaScript](#javascript)
  - [文法](#文法)
  - [语义](#语义)
  - [运行时](#运行时)
    - [数据结构](#数据结构)
      - [类型](#类型)
    - [**算法**](#算法)
    - [学习文献](#学习文献)

# JavaScript

![javascript](https://static001.geekbang.org/resource/image/6a/9b/6aec0a09381a2f74014ec604ef99c19b.png)

编程语言的一般规律：用一定的词法和语法，表达一定语义，从而操作运行时。

## 文法

## 语义

## 运行时

运行时分为数据结构和算法部分：数据结构包含类型和实例（JavaScript 的类型系统就是它的 7 种基本类型和 7 种语言类型，实例就是它的内置对象部分）。所谓的算法，就是 JavaScript 的执行过程。

### 数据结构

#### 类型

7种语言类型

+ Undefined
+ Null
+ Boolean
+ Number
+ String
+ Symbol
+ Object

**undefined 和 null**

Undefined 跟 Null 有一定的表意差别，Null 表示的是：“定义了但是为空”。所以，在实际编程时，我们一般不会把变量赋值为 undefined，这样可以保证所有值为 undefined 的变量，都是从未赋值的自然状态。Null 类型也只有一个值，就是 null，它的语义表示空值，与 undefined 不同，null 是 JavaScript 关键字，所以在任何代码中，你都可以放心用 null 关键字来获取 null 值。

**特殊情况**

+ null的类型是object，这是由于历史原因造成的。1995年的 JavaScript 语言第一版，只设计了五种数据类型（对象、整数、浮点数、字符串和布尔值），没考虑null，只把它当作object的一种特殊值。后来null独立出来，作为一种单独的数据类型，为了兼容以前的代码，typeof null返回object就没法改变了。
+ String 有最大长度是 2^53 - 1
+ JavaScript 中的 Number 类型有 18437736874454810627(即 2^64 - 2^53+3) 个值。
  + 例外情况1：Infinity，无穷大；
  + 例外情况2：-Infinity，负无穷大。
  + 例外情况3：NaN，占用了 9007199254740990，这原本是符合 IEEE 规则的数字；

![double-bit](https://booker-17dbbd-1252444055.tcloudbaseapp.com/cdn/fe-cdn/double-bit.png)

+ Number.MAX_SAFE_INTEGER === Math.pow(2, 53) - 1
+ Number.MIN_SAFE_INTEGER === 1 - Math.pow(2, 53)

```
三种例外情况：
无穷大： 符号位为0，指数位（阶码位）全为1,小数位全为0；（1种情况）
0111 1111 1111 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000
负无穷大： 符号位为1，指数位（阶码位）全为1,小数位全为0；（1种情况）
1111 1111 1111 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000
NaN: 符号位为0或者1，指数位（阶码位）全为1,小数位非全0；（2 * （2^52 - 1）种情况）
S111 1111 1111 XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX

所以最终Number的可取值为： 2^64 - 2^53 + 3
2^64： 总取值
2^53： 指数位（阶码位）全为1的情况
3：    指数位（阶码位）全为1总结为3个有效值；

或者这样算：
2^64 - （2 * （2^52 - 1） + 3
```

+ 区分 +0 和 -0 的方式，检测 1/x 是 Infinity 还是 -Infinity。
+ Number 类型中有效的整数范围是 -0x1fffffffffffff 至 0x1fffffffffffff，所以 Number 无法精确表示此范围外的整数。
+ 检查等式左右两边差的绝对值是否小于最小精度，才是正确的比较浮点数的方法

  ```javascript
  console.log( Math.abs(0.1 + 0.2 - 0.3) <= Number.EPSILON);
  ```

+ Symbol 是 ES6 中引入的新类型，它是一切非字符串的对象 key 的集合，在 ES6 规范中，整个对象系统被用 Symbol 重塑。\

+ 可以使用 Symbol.iterator 来自定义 for…of 在对象上的行为：
  
```javascript

    var o = new Object

    o[Symbol.iterator] = function() {
        var v = 0
        return {
            next: function() {
                return { value: v++, done: v > 10 }
            }
        }        
    };

    for(var v of o) 
        console.log(v); // 0 1 2 3 ... 9
```

+ Symbol 函数比较特殊，直接用 new 调用它会抛出错误，但它仍然是 Symbol 对象的构造器。
+ 运算符提供了装箱操作，它会根据基础类型构造一个临时对象，使得我们能在基础类型上调用对应对象的方法。
+ parseInt把字符串转为证书，遇到非数字时停止解析，第一个字符为零，则基于八进制求值；Number遇到非数字返回NaN；

**Object**
对象的定义是“属性的集合”。属性分为数据属性和访问器属性，二者都是 key-value 结构，key 可以是字符串或者 Symbol 类型。

**类型转换**
![transfer](https://booker-17dbbd-1252444055.tcloudbaseapp.com/cdn/fe-cdn/double-equal.jpg)

**装箱转换**

每一种基本类型 Number、String、Boolean、Symbol 在对象中都有对应的类，所谓装箱转换，正是把基本类型转换为对应的对象，它是类型转换中一种相当重要的种类。

Object.prototype.toString 是可以准确识别对象对应的基本类型的方法，它比 instanceof 更加准确。但需要注意的是，call 本身会产生装箱操作，所以需要配合 typeof 来区分基本类型还是对象类型。


**拆箱转换**

ToPrimitive 函数，它是对象类型到基本类型的转换（即，拆箱转换）。
对象到 String 和 Number 的转换都遵循“先拆箱再转换”的规则。通过拆箱转换，把对象变成基本类型，再从基本类型转换为对应的 String 或者 Number。

### **算法**

### 学习文献

[双精度浮点64位类型IEEE754标准](https://www.boatsky.com/blog/26)
[0.1 + 0.2 === 0.3问题](https://www.cnblogs.com/fsjohnhuang/p/5115672.html)