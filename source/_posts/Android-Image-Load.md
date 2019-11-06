---
title: Android-有效的加载大图
date: 2019-06-26 08:48:31
tags: ["android","Image"]
---

有时我们需要显示一张很大的图片，按常规的方式直接载入很容易出现OOM(out of  memory);这是由于Android系统对内存的使用有严格的限制（就那么点可怜的内存）
<!-- more -->

<div class="tip tip-info">为了维持多任务的功能环境，Android为每一个app都设置了一个硬性的heap size限制。准确的heap size限制会因为不同设备的不同RAM大小而各有差异。如果你的app已经到了heap的限制大小并且再尝试分配内存的话，会引起OutOfMemoryError的错误。
</div>

1.使用adb查看设备对内存的限制

// 单个应用可用最大内存主要对应的是这个值,如果值是0代表无限制（（仅仅针对dalvik堆，不包括native堆））
`adb shell getprop dalvik.vm.heapgrowthlimit`

// 表示单个进程可用的最大内存，但如果存在heapgrowthlimit参数，则以heapgrowthlimit为准；heapsize表示不受控情况下的极限堆，表示单个虚拟机或单个进程可用的最大内存。而android上的应用是带有独立虚拟机的，也就是每开一个应用就会打开一个独立的虚拟机（这样设计就会在单个程序崩溃的情况下不会导致整个系统的崩溃）。
`adb shell getprop dalvik.vm.heapsize`

// 应用启动时申请的初始内存空间大小
`adb shell getprop dalvik.vm.heapstartsize`

<img width="400" src="/images/jetpack/adb-memory.png">

2.突破内存限制
heapsize表示不受控情况下的极限堆，表示单个虚拟机或单个进程可用的最大内存。而android上的应用是带有独立虚拟机的，也就是每开一个应用就会打开一个独立的虚拟机（这样设计就会在单个程序崩溃的情况下不会导致整个系统的崩溃）。在android开发中，如果要使用大堆，需要在manifest中指定android:largeHeap为true，这样dvm heap最大可达heapsize。

3.使用android studio中的profiler查看当前应用的内存使用情况
<img width="200" src="/images/jetpack/adb-memory-profiler.png">

Native表示C或C++代码分配的内存(即使App没有native层，调用framework代码时，也有可能触发分配native内存)；

Graphics表示图像相关缓存队列占用的内存；

Stack表示native和java占用的栈内存；

Code表示代码、资源文件、库文件等占用的内存；

Others表示无法明确分类的内存；

Allocated表示Java或Kotlin分配对象的数量(Android8.0系统内置了统计工具，Memory Profiler可以得到整个app启动后分配对象的数量）

##### 将位图加载到内存中
```kotlin
val bmp = BitmapFactory.decodeResource(resources, R.drawable.splash)
debugInfo("内存大小", bmp.byteCount)
```

我们可以发现使用的内存明显大于图片在磁盘中的大小，这是因为当图像在磁盘上时（以JPG，PNG或类似格式存储），图像将被压缩。将图像加载到内存后，它不再被压缩，占用所有像素所需的内存。

获取图像信息（尺寸）而不加载图像本身
```Kotlin
val options = BitmapFactory.Options().apply {
    // 设置这个参数为true,代表我们不需要加载图片到内存，而只获取它的基本信息
    inJustDecodeBounds = true,
    inS
}
BitmapFactory.decodeResource(
    resources,
    R.drawable.splash,
    options
)
debugInfo("图片尺寸:${options.outWidth},${options.outHeight}")// 图片尺寸:900,1464
```

缩小图片的尺寸来减少内存的使用，很多时候我们不需要使用原始图片（如列表显示缩略图,用户设备分辨率较低,视图尺寸很小)，我们可以根据具体情况缩小图片的尺寸
```Kotlin
val options = BitmapFactory.Options().apply {
    // 设置这个参数为true,代表我们不需要加载图片到内存，而只获取它的基本信息
    inJustDecodeBounds = true
    // 比例因子，2代表尺寸会被缩小2倍，1000x1000 -> 500x500
    inSampleSize = 2
}
BitmapFactory.decodeResource(
    resources,
    R.drawable.splash,
    options
)
debugInfo("图片尺寸:${options.outWidth},${options.outHeight}") // 图片尺寸:450,732

```

计算一个合适的inSampleSize,来自 [android官方文档](https://developer.android.com/topic/performance/graphics/load-bitmap.html#load-bitmap)
```Kotlin
fun calculateInSampleSize(options: BitmapFactory.Options, reqWidth: Int, reqHeight: Int): Int {
    // Raw height and width of image
    val (height: Int, width: Int) = options.run { outHeight to outWidth }
    var inSampleSize = 1

    if (height > reqHeight || width > reqWidth) {

        val halfHeight: Int = height / 2
        val halfWidth: Int = width / 2

        // Calculate the largest inSampleSize value that is a power of 2 and keeps both
        // height and width larger than the requested height and width.
        while (halfHeight / inSampleSize >= reqHeight && halfWidth / inSampleSize >= reqWidth) {
            inSampleSize *= 2
        }
    }

    return inSampleSize
}
```

##### 减小图片占用的存储空间
如果图片存储在手机本地，过多的图片图片缓存资源会很快让手机空间不足。我们应该尽量使用压缩效果较好的图片格式，如webp,jpeg。
```Kotlin
ByteArrayOutputStream bos = new ByteArrayOutputStream（）; 
// 我们设置图片质量为100，与原图相同质量
bitmap.compress（Bitmap.CompressFormat.JPEG，100，bos）; 
byte [] bitmapdata = bos.toByteArray（）;
...保存文件相关代码略...
```

##### 尺寸巨大的图片（地图，星空图）
这类图片不可能通过缩小尺寸显示来减少内存的时候，此时我们可以尝试使用加载部分区域显示详情
1. 多个等级的缩略图
在显示图片全貌的时候（用户屏幕就那么大，直接显示全貌无法查看细节），我们可以根据用户手机的分变率加载对应清晰度的缩略图进行显示而不是原图（如x1,x2,x3...多个级别的全景缩略），缩略图应该和原图一起下载，而不是在显示的时候通过原图生成（耗费大量时间，造成设备卡顿，闪退）
2. 查看局部细节
用户放大图片局部查看细节时，如果使用缩略图不能满足细节显示时，开始使用原图进行局部加载
``` 
val imageInputStream = ....
val brd = BitmapRegionDecoder.newInstance(imageInputStream, false)

// 更具要显示的区域获取局部Bitmap，一个Rect区域，options根据显示要求设置,同上的BitmapFactory.Options
val bmp = bitmapRegionDecoder.decodeRegion(Rect(0, 0, 40, 40), options)

```

<div class="tip tip-info">注意：有几个库遵循加载图像的最佳实践。您可以在应用中使用这些库以最优化的方式加载图像。我们建议使用 Glide 库，尽可能快速，平稳地加载和显示图像。其他受欢迎的图像加载库包括Square的Picasso和 Facebook的Fresco。这些库简化了与Android上的位图和其他类型图像相关的大多数复杂任务。
</div>