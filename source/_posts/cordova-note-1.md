---
title: Cordova环境配置
date: 2018-08-31 15:17:04
tags: ['cordova','node.js']
categories: Web开发
---

#### 环境要求
1. node环境（包含npm）
2. java环境（JDK）
3. android环境 （Android SDK）
4. ios环境 （X-CODE）

#### 安装node环境
[中文网站下载](http://nodejs.cn)

##### Windows
如果是window那么使用安装包安装即可（安装成功后你就已经完成了node环境的安装，后面步骤不需要了）

##### Mac
如果是mac系统，也是同window一样双击按提示一步步安装，安装成功后即可

##### Linux
1. 如果是linux，我们使用的是一个编译好的压缩包，把压缩包放在你（当前用户，不是root）有权限访问的文件夹中（如你的home目录中）
2. 配置环境变量(下面两种方式二选一)
* `vi ~/.bash_profile`(当前用户)
* `vi /etc/profile`(全局，这个需要root全选才能打开)

3. 在打开的文件末尾追加环境变量(根据具体目录编写)
export NODE_HOME=/home/cool1024/DevTool/node
export PATH=$PATH:${NODE_HOME}/bin

#### npm换源
1. 安装nrm
`npm install -g nrm`
2. 查看当前的源
`nrm ls`
3. 使用淘宝镜像
`nrm use taobao`

#### npn修改相关缓存目录(这个很有必要，避免文件是没有权限的目录中)
1. `npm config set cache [目录]` // 设置缓存文件夹；
2. `npm config set prefix [目录]` // 设置全局模块存放路径；

#### node_sass在windows系统下无法编译安装问题
`npm config set sass_binary_site=https://npm.taobao.org/mirrors/node-sass/`

#### JDK安装

1. windows下的安装方法这里就不介绍了（网上一大把）
2. mac预安装了jdk(你可以安装其它版本的，cordova目前要JDK8)
3. linux下，去下载压缩包，解压到你有权限读写的目录下
 * 配置环境变量 
 ```conf
 #JAVA_HOME
export JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk1.8.0_181.jdk/Contents/Home
#CLASS_PATH
export CLASSPATH=.:$JAVA_HOME/lib/dt.jar:$JAVA_HOME/lib/tools.jar
#PATH
export PATH=$JAVA_HOME/bin:$PATH
 ```
#### ANDROID_SDK
1. [中文网下载](http://tools.android-studio.org)
2. 在有权限的目录下创建一个android-sdk目录，把下载的命令行工具解压到sdk目录中
3. 配置ANDROID_HOME
```conf
#ANDROID_HOME
export ANDROID_HOME=/Users/anasit/Documents/Android/android-sdk-macosx
#PATH
export PATH=$ANDROID_HOME/tools:$PATH
```
4. 配置好环境变量都要人工执行应用
 * `source ~/.bash_profile`(当前用户)
 * `source /etc/profile`(全局生效，要root权限)

#### Gradle
1. cordova目前使用了gradle构建项目


#### 使用sdkmanager安装需要的开发包（sdkmanager在tools/bin目录下，你需要自己配置环境变量）
1. `sdkmanager --list` 查看所有的开发包
2. `sdkmanager "build-tools;19.1.0"` 安装指定的开发包

#### 安装Cordova
1. `npm install cordova -g` 安装cordova命令行工具
2. `cordova create myApp` 创建项目
3. `cordova platform add android` 添加android平台
4. `cordova bulid android` 打包apk