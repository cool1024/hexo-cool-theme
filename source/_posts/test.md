---
title: 前端测试笔记（一）
date: 2019-05-06 17:39:50
tags: ["JavaScript"]
categories: Web开发
---

## 断言
```js
const assert = require('assert');
const faker = require('faker');
const request = require('superagent')

// 简单测试
const now = Date.now();
console.log(now);
// assert.ok(now % 2 === 0, '时间戳必须是偶数');

// 接口测试
const limit = faker.random.number({ min: 1, max: 10 });
request.get('https://www.cool1024.com/store/goods/search?limit=' + limit + '&offset=0').end(function (err, res) {
    assert.ok(200 === res.status, '响应码必须是200');
    const json = JSON.parse(res.text);
    assert.ok(true === json.result, '接口调用必须成功');
    const data = json.datas;
    assert.ok(Array.isArray(data.rows), 'ROWS必须是数组');
    assert.ok(data.rows.length <= limit, '查询的数据量不能大于LIMIT');
    console.log(data);
});
```
## mocha
```js
const assert = require('assert');
const request = require('superagent')

describe('商品模块测试', function () {

    it('商品列表测试', function () {
        return request.get('https://www.cool1024.com/store/goods/search?limit=10&offset=0')
            .then(function (res) {
                assert.ok(200 === res.status, '响应码必须是200');
            });
    });

    it('商品详情测试', function () {
        return request.get('https://www.cool1024.com/store/goods/get?goodsId=4')
            .then(function (res) {
                assert.ok(200 === res.status, '响应码必须是200');
            });
    });
});
```

## selenium-webdriver
```js
require('chromedriver');
const { Builder, By, Key, until } = require('selenium-webdriver');
var driver = new Builder()
    .forBrowser('chrome')
    .build();
(async function () {
    try {
        await driver.get('https://search.jd.com');
        await driver.findElement(By.id('keyword')).sendKeys('键盘');
        await driver.findElement(By.className('input_submit')).click();
        const text = await driver.findElement(By.className('gl-warp'));
        console.log(text);
    } finally {
        await driver.quit();
    }
})();
```
