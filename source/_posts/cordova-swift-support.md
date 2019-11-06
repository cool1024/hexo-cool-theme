---
title: cordova-swift-support
date: 2018-09-27 11:35:55
tags: [cordova,swift]
categories: Web开发
---

#### Github地址
https://github.com/akofman/cordova-plugin-add-swift-support

#### 在插件的plugin.xml,ios平台配置中加入下面配置
`<dependency id="cordova-plugin-add-swift-support" spec="~1.7.1" />`

#### 参考cordova-plugin-qrscanner的配置文件
```xml
<platform name="ios">
    <config-file target="config.xml" parent="/*">
      <feature name="QRScanner">
        <param name="ios-package" value="QRScanner"/>
      </feature>
    </config-file>
    <dependency id="cordova-plugin-add-swift-support" spec="~1.7.1" />
    <source-file src="src/ios/QRScanner.swift"/>
    <config-file target="*-Info.plist" parent="NSCameraUsageDescription">
      <string>The camera is used to scan QR codes.</string>
    </config-file>
</platform>
```
https://github.com/bitpay/cordova-plugin-qrscanner