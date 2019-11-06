---
title: JetPack-Databinding简单数据绑定(一)
date: 2019-06-22 14:06:06
tags: ['android','jetpack']
categories: Android开发
---

数据绑定库是一种支持库，借助该库，您可以使用声明性格式（而非程序化地）将布局中的界面组件绑定到应用中的数据源。
<!--more-->

## 参考文档链接
* 中文官方网站 https://developer.android.google.cn/topic/libraries/data-binding/start
* 博客翻译版本 https://blog.gokit.info/post/android-data-binding/#6-binding%E7%94%9F%E6%88%90

## 相关配置
* 要使用数据绑定，请在项目app模块目录的`build.gradle`文件中添加相关配置参数，如以下示例所示：
```gradle
android {
    ...
    dataBinding {
        enabled = true
    }
}
```
* 使用新的数据绑定编译器生产数据绑定类文件(非必须，详情参考官方文档说明)，在项目的`gradle.properties`文件中加入下面代码
```gradle
android.databinding.enableV2=true
```

## 简单绑定
* 准备数据对象，这个数据将会在模版中使用
```Kotlin
package com.example.androidx_example.data

data class VideoInfo(
    val title: String,
    val author: String
)
```
* 修改布局文件，使用layout标签把之前的布局内容包裹起来（如下）
```xml
<!-- layout/fragment_player.xml 修改前-->
<LinearLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    tools:context=".PlayerFragment"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical">
    <TextView
        android:id="@+id/video_title"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:text="标题"/>
    <TextView
        android:id="@+id/video_author"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:text="作者"/>
</LinearLayout>

<!-- layout/fragment_player.xml 使用数据绑定修改后-->
<layout xmlns:android="http://schemas.android.com/apk/res/android"
        xmlns:tools="http://schemas.android.com/tools"
        xmlns:app="http://schemas.android.com/apk/res-auto"
        tools:context=".PlayerFragment">
    <data>
        <!-- 这里的name将作为编译对象对应属性的名称 -->
        <variable name="video" type="com.example.androidx_example.data.VideoInfo"/>
    </data>
    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:orientation="vertical">
        <!-- video.name,video为variable name="video"中定义的 -->
        <TextView
            android:id="@+id/video_title"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:text="@{video.title}"/>
        <TextView
            android:id="@+id/video_author"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:text="@{video.author}"/>
    </LinearLayout>
</layout>
```

* 对视图与数据进行数据绑定
```Kotlin
package com.example.androidx_example

...

class PlayerFragment : Fragment() {

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        return inflater.inflate(R.layout.fragment_player, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        // FragmentPlayerBinding为数据绑定编译器自动生成，默认为布局文件转大驼峰命名
        val viewDataBinding = FragmentPlayerBinding.bind(view)
        viewDataBinding.video = VideoDetail(
            title = "视频标题",
            author = "视频作者"
        )
    }
}
```

## 一些参考绑定模版语法
* 默认值
```xml
<data>
    <variable name="video" type="com.example.androidx_example.data.VideoInfo"/>
</data>
<TextView
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:text="@{video.title,default=`视频标题`}"/>
<!-- 我们也可以直接使用res中的string资源 -->
<TextView
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:text="@{video.title,default=@string/default_title}"/>
```
* 简单的表达式计算（我们最好应该使用编写好的相关转换方法，而不是直接在模版中编写复杂逻辑转换数据）
 * 数学 + - / * %
 * 字符串连接 +
 * 逻辑 && ||
 * 二进制 & | ^
 * 一元运算 + - ! ~
 * 移位 >> >>> <<
 * 比较 == > < >= <=
 * instanceof
 * 分组 ()
 * null
 * Cast
 * 方法调用
 * 数据访问 []
 * 三元运算 ?:

```xml
<data>
    <variable name="video" type="com.example.androidx_example.data.VideoInfo"/>
</data>
<TextView
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:text="@{`【` + video.title + `】`}"/>
<TextView
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:text="@{video.author == `某个条件` ? `输出结果-1` : `输出结果-2`}"/>
```
* 


## 从外部导入相关对象

* 简单例子
```xml
<data>
    <!-- 我们需要使用 View.VISIBLE,View.GONE -->
    <import type="android.view.View"/>
    <variable name="video" type="com.example.androidx_example.data.VideoInfo"/>
</data>
<TextView
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:visibility="@{video.title == `某个条件` ? View.VISIBLE : View.GONE}"/>
```

* 自定义相关工具方法
 * 工具类
```Kotlin
package com.example.androidx_example.data

import android.view.View

object BindingUntil{
    @JvmStatic fun booleanToVisibility(title: String): Int {
        return if (video.title == "某个条件") View.GONE else View.VISIBLE
    }
}
```
 * 模版中使用
 ```xml
 <data>
    <!-- 自行定义的一些相关格式化方法 -->
    <import type="com.example.androidx_example.data.BindingUntil"/>
    <variable name="video" type="com.example.androidx_example.data.VideoInfo"/>
 </data>
 <TextView
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:visibility="@{ConverterUtil.isZero(video.title)}"/>
 ```

 ## 指定数据绑定操作（自定义设置视图的相关操作@BindingAdapter）
 ```Kotlin
 package com.example.androidx_example.fragments.player

import android.widget.ImageView
import android.widget.TextView
import androidx.databinding.BindingAdapter
import com.example.androidx_example.R
import com.example.androidx_example.until.GlideApp
import com.example.androidx_example.until.debugInfo

object DetailBindingAdapter {

    // 使用BindingAdapter注解定义glideUrl属性绑定时的设置方法
    @BindingAdapter("glideUrl")
    @JvmStatic
    fun loadAvatarImage(imageView: ImageView, imageUrl: String?) {
        imageUrl?.run {
            GlideApp.with(imageView.context)
                .load(imageUrl)
                .placeholder(R.drawable.ic_avatar)
                .circleCrop()
                .into(imageView)
        }
    }
}
 ```
 ```xml
<data>
    <variable name="video" type="com.example.androidx_example.data.VideoDetail"/>
</data>
<ImageView
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    app:glideUrl="@{video.thumbImageUrl}"/>
 ```


