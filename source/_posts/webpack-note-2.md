---
title: 使用SASS
date: 2018-11-21 16:48:24
tags: ['webpack','sass']
categories: Web开发
---

#### 概览
[参考文档](http://sass.bootcss.com/docs/sass-reference/)

Sass 是对 CSS 的扩展，让 CSS 语言更强大、优雅。 它允许你使用变量、嵌套规则、 mixins、导入等众多功能， 并且完全兼容 CSS 语法。 Sass 有助于保持大型样式表结构良好， 同时也让你能够快速开始小型项目， 特别是在搭配 Compass 样式库一同使用时。
<!--more-->

#### 特色

* 完全兼容 CSS3
* 在 CSS 语言基础上添加了扩展功能，比如变量、嵌套 (nesting)、混合 (mixin)
* 对颜色和其它值进行操作的{Sass::Script::Functions 函数}
* 函数库控制指令之类的高级功能
* 良好的格式，可对输出格式进行定制
* 支持 Firebug

#### 语法
1. 数据类型
    * 数字（例如 1.2、13、10px）
    * 文本字符串，无论是否有引号（例如 "foo"、'bar'、baz）
    * 颜色（例如 blue、#04a3f9、rgba(255, 0, 0, 0.5)）
    * 布尔值（例如 true、false）
    * 空值（例如 null）
    * 值列表，用空格或逗号分隔（例如 1.5em 1em 0 2em、Helvetica, Arial, sans-serif）
```scss
// example.scss
$primary: #04a3f9;
$default-font-size: 1rem;


body{
    font-size: $default-font-size;
}

.btn-primary{
    font-size: $default-font-size;
    background-color: $primary;
}
```
2. 支持 + - * / 计算
```scss
.p-one {
    font: 1rem + 1px; 
}
.p-two {
  color: rgba(255, 0, 0, 0.75) + rgba(0, 255, 0, 0.75);
}
```

3. 导入其它样式文件
```scss
@import "scss/variables";
```

4. 样式继承
```scss
.card{
    width: 100px;
    height: 200px;
}

.info-card{
    @extend .card;
    background-color: blue;
}

.warning-card{
    @extend .card;
    background-color: yellow;
}
```

5. 循环打印，批量生成主题对应的组件样式

```scss
// 可用的主题
$colors: (
        "primary": #aaa, 
        "info": #bbb,
        "warning": #ccc,
        "danger": #ddd,
    );

// 循环生成样式
@each $key, $value in $colors {
    .btn-#{$key} {
        background-color: $value;
    }
}
```

```css
/* 生成的css文件 */
.btn-primary{
    background-color: #aaa;
}
.btn-info{
    background-color: #bbb;
}
.btn-warning{
    background-color: #ccc;
}
.btn-danger{
    background-color: #ddd;
}
```

6. 引用父级
```scss
.btn{
    background-color: #aaa;

    &:hover{
        background-color: rgba(#aaa, 0.1)
    }

    &:active{
        background-color: rgba(#aaa, 0.8)
    }
}
```

#### 在webpack项目中添加sass支持

* `npm install sass-loader node-sass style-loader css-loader webpack --save-dev`
* 修改配置文件，添加下面加载器配置参数
```js
const path = require('path');

module.exports = {
    entry: {
        index: './src/index.js',
        scss: './src/index.scss'
    },
    output: {
        filename: '[name]-build.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [{
            test: /\.scss$/,
            use: [
                "style-loader", // creates style nodes from JS strings
                "css-loader", // translates CSS into CommonJS
                "sass-loader" // compiles Sass to CSS, using Node Sass by default
            ]
        }]
    }
};
* 在src目录下创建一个index.scss文件
```
#### 使用bootstrap

* [参考文档](http://getbootstrap.com/docs/4.1/getting-started/introduction/)
* `npm install bootstrap`
* 在index.sccs中引入bootstrap
```scss
// index.scss
@import "~bootstrap/dist/css/bootstrap";
```
* 在index.html引入scss.build.js
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
    <button class="btn btn-danger">Danger</button>

</body>
<script src="index-build.js"></script>
<script src="scss-build.js"></script>

</html>
```
* 按需使用比如我只要按钮样式
```scss
/* 使用scss,自定义主题 */
// @import "~bootstrap/dist/css/bootstrap";

/* 使用scss,自定义主题 */
@import "~bootstrap/scss/functions";

/* 你的变量设置，覆盖默认值-前置 */
$red: #ddd; // 我把danger的全局颜色改了

@import "~bootstrap/scss/variables";
@import "~bootstrap/scss/mixins";

/* 你的变量设置，覆盖默认值-后置 */

@import "~bootstrap/scss/buttons";

```


