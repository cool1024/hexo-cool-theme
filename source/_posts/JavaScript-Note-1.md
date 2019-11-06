---
title: JavaScript 相等判断
date: 2018-07-25 08:35:20
tags: JavaScript
categories: Web开发
---

#### 相等
相等运算符有四种:==、===、!= 和 !==。! 形式显然是相应的“不等”版本;不要混淆了 不等关系和不相等。

== 和 === 的区别在于，== 检查的是允许类型转换情况下的值的相等性，而 === 检查不允许类型转换 情况下的值的相等性;因此，=== 经常被称为“严格相等”。
<!--more-->
```js
var a = '1';
var b = 1;
a == b; // true;
a === b; // false;
```

####   == 的比较规则

1. If Type(x) is the same as Type(y), then
 * If Type(x) is Undefined, return true.
 * If Type(x) is Null, return true.
 * If Type(x) is Number, then
  * If x is NaN, return false.
  * If y is NaN, return false.
  * If x is the same Number value as y, return true.
  * If x is +0 and y is −0, return true.
  * If x is −0 and y is +0, return true.
  * Return false.
 * If Type(x) is String, then return true if x and y are exactly the same sequence of characters (same length and same characters in corresponding positions). Otherwise, return false.
 * If Type(x) is Boolean, return true if x and y are both true or both false. Otherwise, return false.
 * Return true if x and y refer to the same object. Otherwise, return false.
2. If x is null and y is undefined, return true.
3. If x is undefined and y is null, return true.
4. If Type(x) is Number and Type(y) is String,
return the result of the comparison x == ToNumber(y).
5. If Type(x) is String and Type(y) is Number,
return the result of the comparison ToNumber(x) == y.
6. If Type(x) is Boolean, return the result of the comparison ToNumber(x) == y.
7. If Type(y) is Boolean, return the result of the comparison x == ToNumber(y).
8. If Type(x) is either String or Number and Type(y) is Object,
return the result of the comparison x == ToPrimitive(y).
9. If Type(x) is Object and Type(y) is either String or Number,
return the result of the comparison ToPrimitive(x) == y.
10. Return false.

#### === 的比较规则
1. If Type(x) is different from Type(y), return false.
2. If Type(x) is Undefined, return true.
3. If Type(x) is Null, return true.
4. If Type(x) is Number, then
 * If x is NaN, return false.
 * If y is NaN, return false.
 * If x is the same Number value as y, return true.
 * If x is +0 and y is −0, return true.
 * If x is −0 and y is +0, return true.
 * Return false.
5. If Type(x) is String, then return true if x and y are exactly the same sequence of characters (same length and same characters in corresponding positions); otherwise, return false.
6. If Type(x) is Boolean, return true if x and y are both true or both false; otherwise, return false.
7. Return true if x and y refer to the same object. Otherwise, return false.