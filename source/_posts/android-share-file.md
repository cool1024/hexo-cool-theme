---
title: Android共享文件
date: 2019-06-30 19:05:35
tags: ["android"]
categories: Android开发
---

应用程序通常需要将一个或多个文件提供给另一个应用程序。例如，图库可能希望向图像编辑器提供文件，或者文件管理应用允许用户在外部存储区域之间复制和粘贴文件。

在任何情况下，从您的应用程序向另一个应用程序提供文件的唯一安全方法是向接收应用程序发送文件的内容URI，并授予该URI的临时访问权限。具有临时URI访问权限的内容URI是安全的，因为它们仅适用于接收URI的应用程序，并且它们会自动过期。Android FileProvider组件提供了 getUriForFile()生成文件内容URI的方法。
<!-- more -->

注意：如果要在应用程序之间共享少量文本或数字数据，则应在发送的Intent中包含文本或数字数据即可。

1. 设置文件共享,指定可共享的目录
```xml
<!-- xml/paths.xml -->
<paths>
<!-- context.getFilesDir() + "/images/" -->
<files-path path="images/" name="myimages"/>
<cache-path path="files" name="cache" /> 
<external-path path="files" name="external" />
<external-files-path path="files" name="externalfiles"/>
<!-- 此标签需要 support 25.0.0以上才可以使用-->
<external-cache-path  path="files" name="externalcache"/> 
<root-path name="name" path="path" /> 
</paths>
```
 file-path	物理路径为Context.getFilesDir() + /files/*
 cache-path	物理路径为Context.getCacheDir() + /files/*
 external-path	物理路径为Environment.getExternalStorageDirectory() + /files/*
 external-files-path	物理路径为Context.getExternalFilesDir(String) + /files/*
 external-cache-path	物理路径为Context.getExternalCacheDir() + /files/*
 root-path	物理路径相当于 /path/*

2. 在AndroidManifest.xml文件中添加FileProvider
```xml
<application
  ...
  ...>
    <provider
        android:authorities="com.example.cool1024.file"
        android:name="androidx.core.content.FileProvider"
        android:grantUriPermissions="true"
        android:exported="false">
        <meta-data 
            android:name="android.support.FILE_PROVIDER_PATHS"
            android:resource="@xml/paths"/>
    </provider>
</application>
 ```
android:authorities属性指定要用于生成的内容URI的URI权限FileProvider。这里权限是com.example.cool1024.file；这样生成content uri是`content://com.example.cool1024.file/myimages`,myimages是上面xml配置的`<files-path path="images/" name="myimages"/>`

如果外部应用访问`content://com.example.cool1024.file/myimages/xxx.jpg`就会对应访问到文件`context.getFilesDir() + "/images/xxx.jpg"`

3. 使用例子-图片分享
```Kotlin
val bitmap = BitmapFactory.decodeResource(resources, R.drawable.share_image);
val intent = Intent(Intent.ACTION_SEND).apply {
    type = "image/*"
    putExtra(Intent.EXTRA_STREAM, getTempBitmapUri(context, bitmap))
}
context.startActivity(Intent.createChooser(intent, "图片分享到"))
```

#### 参考文档
* https://developer.android.com/training/secure-file-sharing