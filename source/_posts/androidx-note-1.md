---
title: AndroidX记录
date: 2019-02-02 18:11:53
tags: androidx
---

AndroidX是Android团队为Android Jetpack开发，测试，打包，发布和发布库的开源项目 。

AndroidX是对原始Android支持库的重大改进 。与支持库一样，AndroidX与Android操作系统分开提供，并提供跨Android版本的向后兼容性。AndroidX通过提供功能奇偶校验和新库完全取代了支持库。此外，AndroidX还包括以下功能：

* AndroidX库中的所有包都以字符串androidx开头。原先的支持库在androix中都有对应的包，详情查看[支持库与androidx的包名映射表](https://developer.android.com/jetpack/androidx/migrate)

* 与支持库不同，AndroidX软件包是**单独维护和更新**的。这些androidx包使用严格的语义版本控制， 从版本1.0.0开始。您可以单独更新项目中的AndroidX库。

所有新的支持库开发都将在AndroidX库中进行。这包括维护原始支持库工件和引入新的Jetpack组件。

> 相比之前的support的混乱局面，升级牵一发而动全身，androidx的使用更简单



