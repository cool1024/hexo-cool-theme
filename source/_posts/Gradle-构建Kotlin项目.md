---
title: Gradle-构建Kotlin项目
date: 2019-07-09 19:17:28
tags: Kotlin
categories: Android开发
---

## 下载与安装Gradle（Window10环境）

* 确保Java开发环境配置好了（JDK）
* [官方网站](https://gradle.org/)
* [下载地址](https://gradle.org/next-steps/?version=5.5&format=all)
* 解压文件到你想放在的地方（如图所示）
![变量配置](/images/kotlin/gradle-folder.png)
* 配置环境变量（以你gradle保存的地址为准，此处保存在D盘Gradle目录）
![变量配置](/images/kotlin/gradle-path.png)


## 创建项目
0. 手动创建参考[官方文档](https://www.kotlincn.net/docs/reference/using-maven.html)
1. gradle init --type=kotlin-application
2. 根据提示一步步创建即可
3. 创建例子

1. 创建一个项目文件夹（kotlin-examle）
2. 创建src/main/kotlin和src/main/java文件夹
3. 创建gradle构建文件(build.gradle)

```Groovy
apply plugin: 'java'
apply plugin: 'kotlin'

buildscript {
    ext.kotlin_version = '1.3.41'

    repositories {
        mavenCentral()
    }

    dependencies {
        classpath "org.jetbrains.kotlin:kotlin-gradle-plugin:$kotlin_version"
    }
}

repositories {
    maven { 
        url 'https://maven.aliyun.com/nexus/content/groups/public/' 
    }
    maven {
        url 'https://maven.aliyun.com/nexus/content/repositories/jcenter'
    }
}

dependencies {
    compile "org.jetbrains.kotlin:kotlin-stdlib"
}


jar {
    manifest {
        attributes 'Main-Class': 'com.cool1024.App'
    }
    from { configurations.compile.collect { it.isDirectory() ? it : zipTree(it) } }
}
```

4. 在kotlin目录中添加App.kt文件
```Kotlin
package com.cool1024

object App{
    @JvmStatic
    fun main(args: Array<String>) {
        println("Hello World")
    }
}
```

5. 执行Build命令`gradle build`

6. 运行结果`java -jar build/libs/kotlin-example.jar`
