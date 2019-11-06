---
title: 端到端测试
date: 2018-12-12 16:02:14
tags: e2e
categories: Web开发
---

## 简介
端到端测试是一种用于测试应用程序流程是否按照设计从头到尾执行的方法。 执行端到端测试的目的是识别系统依赖性并确保在各种系统组件和系统之间传递正确的信息。

测试，尤其是自动化测试在现代 WEB 工程中有着非常重要的角色，与交付过程集成良好的自动化测试流程可以在新版发布时帮你快速回归产品功能，也可以充当产品文档。测试因粒度不同又可以分为单元测试、接口测试、功能测试。在 WEB 领域，功能测试亦称为端到端测试（End to End Test，简称 E2E 测试）
<!--more-->

## Node.js中常见的几种e2e测试工具

1. CasperJS [官网](http://casperjs.org/)
CasperJS允许您使用高级功能和直接界面构建完整的导航场景，以完成各种规模的任务。

2. Protractor [官网](http://www.protractortest.org)
Protractor是Angular和AngularJS应用程序的端到端测试框架。 Protractor针对在真实浏览器中运行的应用程序运行测试，并以用户的身份与其进行交互。

3. Nightwatch.js [官网](http://nightwatchjs.org/)
Nightwatch.js是一款易于使用的基于Node.js的端到端（E2E）测试解决方案，适用于基于浏览器的应用和网站。 它使用功能强大的W3C WebDriver API对DOM元素执行命令和断言。

4. TestCafe [官网](https://devexpress.github.io/testcafe/)
TestCafe 是非常年轻但很受开发者欢迎的测试框架，因为不需要依赖 WebDriver 之类的东西，TestCafe 环境只需一键即可完成，这也意味着，你可以在任何安装了浏览器应用的物理设备上运行测试。TestCafe 对 ES6/ES7 语法的天然支持让它更具前瞻性，命令行工具产生的测试报告简洁但不失完整。由于开源的时间较短，相比于其他测试框架 TestCafe 的社区和生态还不够成熟。尽管如此，不断出现的各种 TestCafe 功能扩展也证明了它的社区和生态在不断壮大。对于站在 WEB 技术风口浪尖的同学，TestCafe 无疑是非常值得留意的 E2E 测试解决方案，开箱即用的特性极大的降低了使用者的成本。

## 编写我的测试代码 CasperJS
1. 打卡我们之前创建的weapack-example项目
2. 安装casperjs `npm install casperjs`
3. 安装测试应用程序，下载地址：http://phantomjs.org/download.html
3. 在项目根目录中创建test文件夹，并创建一个测试文件index.js
4. 把测试脚本运行指令写入package.json文件中
```json
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "build": "npx webpack --mode production",
    "e2e": "node_modules/casperjs/bin/casperjs test test/index.js"
  },
```
5. 在index.js中写入下面测试代码
```js
casper.test.begin('测试查询结果是否有效', function (test) {
    casper.start('http://localhost', function () {
        test.assertVisible('#search_input', '我能看到搜索窗口');
        this.sendKeys("#search_input", 'A', { keepFocus: true });
        this.echo('第一个打开的页面的标题是: ' + this.getTitle());
    });

    casper.then(function () {
        var input = this.evaluate(function () {
            return document.querySelector('input');
        });
        this.echo('输入框的值:' + input.value)
    });

    casper.run(function () {
        test.done();
    });
});
```

## 编写我的测试代码 Protractor
1. 创建一个Angular项目，这里以ng-tui/dashboard项目为例子
2. 默认配置好了Protractor无需特别的配置
3. 编写测试文件 e2ea/app.e2e-spec.ts
4. 编写登入测试脚本
```typescript
import { browser, by, element } from 'protractor';

describe('workspace-project App', () => {

    it('登入成功', () => {
        browser.get('/').then(() => {
            // 获取账号输入框
            const accountInput = element(by.css('input[name="account"]'));
            // 获取密码输入框
            const passwordInput = element(by.css('input[name="password"]'));
            // 获取提交按钮
            const submitBtn = element(by.css('.btn-block'));
            // 自动输入账号密码
            accountInput.sendKeys('admin');
            passwordInput.sendKeys('123456789');
            // 按下提交按钮
            submitBtn.click();
            // 成功跳转到首页
            expect(browser.getCurrentUrl()).toBe('http://localhost:4200/home');000);
        });
    });
});

```

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