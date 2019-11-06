---
title: RxJS笔记-观察对象的转换
date: 2019-07-24 19:21:07
tags: rxjs
categories: Web开发
---

#介绍
RxJS是一个使用可观察序列组成异步和基于事件进行编程的库。它提供了一种核心类型`Observable`，辅助类型（Observer，Schedulers，Subjects）和相当多的运算符（受到Array的拓展函数启发），允许将异步事件作为集合处理。ReactiveX将Observer模式与Iterator模式和函数编程与集合相结合，以满足管理事件序列的理想方式的需求。
> RxJS就如同对事件处理的[Lodash](https://www.lodashjs.com/)库(Lodash是一个一致性、模块化、高性能的 JavaScript 实用工具库。)

##Observable
