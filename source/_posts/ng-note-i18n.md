---
title: Angular v6 国际化
date: 2018-09-06 10:51:35
tags: [i18n,Angular]
categories: Web开发
---
#### 给需要翻译的文件打上标记`i18n`
我们这里选取的是app.component.html中的几个菜单,账号信息，系统设置，退出（我们给这个文字所属的标签都加上了i18n记号）
```html
<div tsDropMenu [offsetX]="-100" [offsetY]="28" style="width:163px;">
    <div class="dropdown-item-title">{{auth.user?.role.roleName}}</div>
    <button class="dropdown-item pointer">
        <span class="iconfont icon-mobile mr-2"></span>
        <span>{{auth.user.account}}</span>
    </button>
    <button routerLink="/system/detail" class="dropdown-item pointer">
        <span class="iconfont icon-account mr-2"></span>
        <span i18n>账号信息</span>
    </button>
    <button class="dropdown-item pointer">
        <span class="iconfont icon-set mr-2"></span>
        <span i18n>系统设置</span>
    </button>
    <div class="dropdown-divider"></div>
    <button (click)="setOut()" class="dropdown-item pointer">
        <span class="iconfont icon-out mr-2"></span>
        <span i18n>退出</span>
    </button>
</div>
```
#### 生成翻译文件
1. 执行 `ng xi18n`

2. 我们发现项目目录中生成一个名叫 messages.xlf 的翻译文件

3. 复制文件到你的本地化翻译文件夹中（你自己随便创建的，比如src/locale目录）,并且重命名（比如你是翻译法语命名为message.fr.xlf，这个名字随便取，只要你能区分)

#### 编写翻译文件，把中文翻译成英语（我们创建了一个message.en-US.xlf）文件
我们只需要在每条需要翻译的文字source标签下面加上他的翻译target就好了
```xml
<?xml version="1.0" encoding="UTF-8" ?>
<xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2">
  <file source-language="en" datatype="plaintext" original="ng2.template">
    <body>
      <trans-unit id="fa5bd7e382b007dd58536547eaaf7e81c083f994" datatype="html">
        <source>账号信息</source>
        <target>Profile</target>
        <context-group purpose="location">
          <context context-type="sourcefile">app/app.component.html</context>
          <context context-type="linenumber">47</context>
        </context-group>
      </trans-unit>
      <trans-unit id="fa7a33c82917330e93ebb34fe5a0acd8f9784aa0" datatype="html">
        <source>系统设置</source>
        <target>Settings</target>
        <context-group purpose="location">
          <context context-type="sourcefile">app/app.component.html</context>
          <context context-type="linenumber">51</context>
        </context-group>
      </trans-unit>
      <trans-unit id="a6d6468c01f128e151d5423c7a5f662cf39d872d" datatype="html">
        <source>退出</source>
        <target>Logout</target>        
        <context-group purpose="location">
          <context context-type="sourcefile">app/app.component.html</context>
          <context context-type="linenumber">56</context>
        </context-group>
      </trans-unit>
    </body>
  </file>
</xliff>
```

#### 配置下打包语言
你还要指示 AOT 编译器使用你的翻译配置，要这么做，你就要在`angular.json`文件中使用三个选项来配置翻译信息。

i18nFile: 翻译文件的路径。
i18nFormat: 翻译文件的格式。
i18nLocale: 地区的 id

```
"build": {
  ...
  "configurations": {
    ...
    "en-US": {
        "aot": true,
        "outputPath": "dist/en-US/",
        "i18nFile": "src/locale/messages.en-US.xlf",
        "i18nFormat": "xlf",
        "i18nLocale": "en-US"
    }
  }
},
"serve": {
  ...
  "configurations": {
    ...
    "en-US": {
        "browserTarget": "example:build:en-US"
    }
  }
}
```
<div class="tip">相关参考文档地址
    https://angular.cn/guide/i18n#i18n-pipes
</div>