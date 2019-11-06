---
title: animate.css
date: 2018-07-10 20:26:55
tags: css
categories: Web开发
---
#### 描述（来源animate.css github 说明）
animate.css 是一个非常强大，有趣，兼容性很好动画库。适合用在需要给死气沉沉的页面添上活力，更引人注目！
<div class="tip">animate.css github 地址 
https://github.com/daneden/animate.css
</div>

#### 安装
1.我们可以直接使用npm安装
`npm install animate.css`
2.当然，你可以选择直接下载animate.css文件，然后在html页面中添加这样的代码
```html
<head>
  <link rel="stylesheet" href="animate.min.css">
</head>
```

#### 使用
这里我们以sass引用为例，在你需要用的页面对应的scss文件使用import引入需要用到的动画css（不要全部引入，只需要加需要用到的哦）
```scss
@import "~animate.css/source/fading_entrances/fadeInUp";

// 编写你自己的样式,继承aniamte和自己需要的动画样式（animate）
.myclass {
    @extend .animate;
    @extend .fadeInUp;
}
```
这样我们可以看到页面带有.myclass的标签出现了对应的动画效果
```html
<div class="myclass"></div>
```
