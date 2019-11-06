---
title: 使用webpack构建一个简易的web项目
date: 2018-11-21 15:46:26
tags: webpack
categories: Web开发
---

#### 1.创建一个空的npm项目
* 创建项目目录文件夹webpack-example
* 执行`npm init`初始化项目,根据提示输入项目的相关信息即可
![图片](/images/webpack/npm-init.png)
* 我们可以观察到目录中多了一个package.json文件

#### 2.安装webpack-不是全局安装，是项目本地安装
* [参考文档](https://www.webpackjs.com/guides/installation/)
* 安装webpack`npm install --save-dev webpack`
* 安装webpack-cli`npm install --save-dev webpack-cli`

#### 3.创建项目的webpack配置文件webpack.config.js
* [参考文档](https://www.webpackjs.com/guides/getting-started/#%E4%BD%BF%E7%94%A8%E4%B8%80%E4%B8%AA%E9%85%8D%E7%BD%AE%E6%96%87%E4%BB%B6)
* 配置文件写入下面代码
```js
// webpack.config.js
const path = require('path');

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'index-build.js',
        path: path.resolve(__dirname, 'dist')
    }
};
```
* entry是入口文件路径配置，这里写的是当前目录下的src目录中的index.js
* output是出口文件，index.js文件打包后会保存为dist目录中的index-build.js

#### 4.创建index.js并写入一段简单的代码
```js
// src/index.js
alert('webpack example');
```

#### 5.创建项目的dist/index.html
```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Webpack Example</title>
</head>

<body>

</body>
<!-- 引入打包好的js -->
<script src="index-build.js"></script>

</html>
```
#### 6.打包项目
* npx webpack --mode production
* dist目录出现了index-build.js
* 用浏览器打开index.html查看结果


#### 7.简化命令
* 在package.json文件的script数组中添加下面命令代码
```json
{
  "name": "webpack-example",
  "version": "1.0.0",
  "description": "我的测试项目",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    // 我们新增了build快捷脚本命令
    "build": "npx webpack --mode production"
  },
  "author": "cool1024",
  "license": "ISC",
  "devDependencies": {
    "webpack": "^4.26.0",
    "webpack-cli": "^3.1.2"
  }
}
```
* 执行`npm run build`即可打包项目



