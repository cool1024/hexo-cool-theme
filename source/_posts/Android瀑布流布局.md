---
title: 使用瀑布流布局显示我的相册
date: 2018-08-14 15:04:35
updated: 2019-9-26 09:58:12
tags: [android]
categories: Android
thumb: /image/picture.jpg
---

瀑布流，又称瀑布流式布局。是比较流行的一种网站页面布局，视觉表现为参差不齐的多栏布局，随着页面滚动条向下滚动，这种布局还会不断加载数据块并附加至当前尾部。最早采用此布局的网站是Pinterest，逐渐在国内流行开来。国内大多数清新站基本为这类风格。
<!-- more -->

# 相关类介绍

## StaggeredGridLayoutManager

交错网格布局管理器，它支持水平和垂直布局以及反向布局。在RecyclerView中使用这个布局管理器可以得到一个简单的瀑布流布局。[参考文档](https://developer.android.com/reference/androidx/recyclerview/widget/StaggeredGridLayoutManager)

## RecyclerView.ItemDecoration

RecyclerView中的Item装饰类，类似给每个子视图加上相框，我们也可以根据具体需求给满足某些特定条件的视图加上特别的'装饰'。ItemDecoration通常被用于设置视图边界，绘制分割符。[参考文档](https://developer.android.com/reference/androidx/recyclerview/widget/RecyclerView.ItemDecoration)

# 一个简单的相册例子

## PhotoPreviewFragment
这是一个用于测试的Fragment，代码中我们给photo_recycler_view设置的layout为StaggeredGridLayoutManager 对于adapter和一般的配置大致相同。

```Kotlin
package com.example.androidx_example.fragments.album

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.recyclerview.widget.StaggeredGridLayoutManager
import com.example.androidx_example.R
import com.example.androidx_example.fragments.BaseFragment
import com.example.androidx_example.until.getPxFromDpIntegerId
import kotlinx.android.synthetic.main.fragment_photo_preview.*

class PhotoPreviewFragment : BaseFragment() {

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View? {
        return inflater.inflate(R.layout.fragment_photo_preview, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        photo_recycler_view.apply {
            layoutManager = StaggeredGridLayoutManager(2, StaggeredGridLayoutManager.VERTICAL)
            adapter = AlbumAdapter()
            // 设置间距为10
            addItemDecoration(PhotoItemDecoration(10))
        }
    }
}
```

在PhotoPreviewFragment对应的布局文件fragment_photo_preview.xml中我们只添加一个RecyclerView即可。
```xml
<?xml version="1.0" encoding="utf-8"?>
<androidx.recyclerview.widget.RecyclerView
        android:id="@+id/photo_recycler_view"
        xmlns:android="http://schemas.android.com/apk/res/android"
        xmlns:tools="http://schemas.android.com/tools"
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:padding="@dimen/padding_sm"
        tools:context=".fragments.album.PhotoPreviewFragment">

</androidx.recyclerview.widget.RecyclerView>
```

## AlbumAdapter

这里的适配器和大多数适配器代码一样，使用的PhotoData是一个简单的数据类，里面包含了一个图片的尺寸与访问链接

```Kotlin
package com.example.androidx_example.fragments.album

import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.example.androidx_example.data.PhotoData

class AlbumAdapter() : RecyclerView.Adapter<AlbumViewHolder>() {

    private var photos: Array<PhotoData> = arrayOf()

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): AlbumViewHolder {
        AlbumViewHolder.containerViewWidth = containerWidth
        return AlbumViewHolder.create(parent)
    }

    override fun getItemCount(): Int {
        return photos.size
    }

    override fun onBindViewHolder(holder: AlbumViewHolder, position: Int) {
        holder.bind(photos[position])
    }
}
```

## AlbumViewHolder

布局文件中我们添加了一个ImageView用于显示相册图片。
```xml
<?xml version="1.0" encoding="utf-8"?>
<androidx.cardview.widget.CardView
        xmlns:android="http://schemas.android.com/apk/res/android"
        android:id="@+id/photo_card"
        android:layout_width="match_parent"
        android:layout_height="wrap_content">

    <ImageView
            android:id="@+id/photo_view"
            android:layout_width="match_parent"
            android:layout_height="match_parent"
            android:layout_margin="@dimen/margin_sm"
            android:scaleType="fitXY"
            android:contentDescription="@string/thumb"/>

</androidx.cardview.widget.CardView>
```
```Kotlin
package com.example.androidx_example.fragments.album

import android.util.Size
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import androidx.cardview.widget.CardView
import androidx.recyclerview.widget.RecyclerView
import com.example.androidx_example.R
import com.example.androidx_example.data.PhotoData
import com.example.androidx_example.data.PhotoSize
import com.example.androidx_example.until.GlideApp

class AlbumViewHolder(view: View) : RecyclerView.ViewHolder(view) {

    private val cardView = view.findViewById<CardView>(R.id.photo_card)
    private val imageView = view.findViewById<ImageView>(R.id.photo_view)


    fun bind(photo: PhotoData) {
        val lp = cardView.layoutParams
        lp.width = photo.size.width
        lp.height = photo.size.height
        cardView.layoutParams = lp
        GlideApp.with(itemView)
            .load(photo.src)
            .into(imageView)
    }

    companion object {
        fun create(parentView: ViewGroup): AlbumViewHolder {
            val view = LayoutInflater.from(parentView.context).inflate(R.layout.photo_item, parentView, false)
            return AlbumViewHolder(view)
        }
    }
}
```

## PhotoItemDecoration

使用PhotoItemDecoration调整每个图片之间的间距。

```Kotlin
package com.example.androidx_example.fragments.album

import android.graphics.Rect
import android.view.View
import androidx.recyclerview.widget.RecyclerView

class PhotoItemDecoration(private val spaceValue: Int) : RecyclerView.ItemDecoration() {
    override fun getItemOffsets(
        outRect: Rect,
        view: View,
        parent: RecyclerView,
        state: RecyclerView.State
    ) {
        super.getItemOffsets(outRect, view, parent, state)
        outRect.set(spaceValue, spaceValue, spaceValue, spaceValue)
    }
}
```

# 说明

1. 我们需要预先计算好自己的图片显示大小，如果不计算那么StaggeredGridLayoutManager会自行计算，这样导致每次滚动列表都会重新排版。
2. 瀑布流我们使用的是竖直方向的StaggeredGridLayoutManager.VERTICAL,根据需要可以修改水平展示的元素个数此处代码为2 (`StaggeredGridLayoutManager(2, StaggeredGridLayoutManager.VERTICAL)`)。

![预览](/image/Android瀑布流布局图片.jpg)


