---
title: JavaScript值类型
date: 2019-06-14 20:12:56
tags: ["JavaScript"]
categories: Web开发
---

# 内置类型(ES6七种)
* 空值 `null`
* 未定义 `undefined`
* 布尔值 `boolean`
* 数字 `number`
* 字符串 `string`
* 对象 `object`
* 符号 `symbol`

使用typeof运算符查看结果，并非一一对应

```js
console.log(typeof null === 'null') // false,typeof的结果为‘object’
console.log(typeof undefined === 'undefined') // true
console.log(typeof true === 'boolean') // true
console.log(typeof 2233 === 'number') // true
console.log(typeof '2233' === 'string') // true
console.log(typeof { name: 'cool1204' } === 'object') // true
console.log(typeof Symbol() === 'symbol') // true
```
> `null`并没得到对应的字符串，这是js中存在已久的bug，也许永远不会被修复,可以使用`!a && typeof a ==='object'`来判断变量的值是不是null

### function是什么类型？
```js
typeof function(){} === 'function' // true
```
虽然测试结果是function，但文档规范中说明了函数是object的'子类型'，是一个'可调用对象',内部有一个Call属性，使其可以调用；函数不仅是对象，还有属性
```js
function a(b, c) { }
console.log(a.length) // 2,打印的是函数声明的参数个数
```

### 数组是什么类型？
数组也是对象，数组元素按数字顺序来进行所言，而不是普对象那样通过字符串进行索引，其length是属性元素个数
```js
typeof [1,2,3] === 'object' // true
```

> 只有值才有类型，变量可以随时持有任何类型的值