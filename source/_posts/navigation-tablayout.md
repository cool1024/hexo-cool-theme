---
title: Android导航组件之TabLayout
date: 2019-06-05 11:27:36
tags: ['android','tablayout']
categories: Android开发
---

选项卡组织并允许在相关且处于相同层次结构的内容组之间进行导航。每个选项卡应包含与集合中其他选项卡不同的内容。例如，标签可以呈现新闻的不同部分，不同类型的音乐或不同的文档主题。
<!--more-->

## TabLayout——使用TabLayout与ViewPager进行页面切换

### 参考文档链接
* [Android TabLaout文档](https://developer.android.google.cn/reference/com/google/android/material/tabs/TabLayout?hl=en)
* [stackoverflow关于indicator(指示符，～～～下划线～～～)尺寸问题讨论](https://stackoverflow.com/questions/40480675/android-tab-layout-wrap-tab-indicator-width-with-respect-to-tab-title)

### 说明
使用TabLayout+ViewPager进行了两个页面之间的切换；怎么没有用到导航组件呢（[不是标题党,官方文档也放在导航里面）](https://developer.android.google.cn/guide/navigation/navigation-swipe-view?hl=en),好像没有必要。。

![效果图](/images/jetpack/tab-navigation.png)

### 代码参考

在PlayerFragment中进行Tab切换（DetailFragment,CommentFragment）

1. 在PlayerFragment对应的布局文件中引入TabLayout和ViewPager
```xml
<!-- 标准的做法 -->
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout
        xmlns:android="http://schemas.android.com/apk/res/android"
        xmlns:app="http://schemas.android.com/apk/res-auto" xmlns:tools="http://schemas.android.com/tools"
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:orientation="vertical"
        tools:context=".fragments.player.PlayerFragment">

    <!-- 其它布局代码省略 -->
    <androidx.viewpager.widget.ViewPager
            android:id="@+id/view_pager"
            android:layout_width="match_parent"
            android:layout_height="0dp"
            android:layout_weight="1">

        <com.google.android.material.tabs.TabLayout
                android:id="@+id/tab_layout"
                android:layout_width="match_parent"
                android:layout_height="@dimen/tab_height"
                app:tabIndicatorFullWidth="false"
                app:tabMaxWidth="0dp"
                app:tabGravity="fill"
                app:tabMode="fixed"
                app:tabTextColor="@color/primary_hover_color"/>

    </androidx.viewpager.widget.ViewPager>
</LinearLayout>

<!-- 下面的代码为其它例子 -->
<!-- 下面的代码为其它例子 -->
<!-- 下面的代码为其它例子 -->
<!-- 下面的代码为其它例子 -->
<!-- 需要使用自定义阴影@drawable/shadow_bottom适当调整了布局 -->
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout
        xmlns:android="http://schemas.android.com/apk/res/android"
        xmlns:app="http://schemas.android.com/apk/res-auto" xmlns:tools="http://schemas.android.com/tools"
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:orientation="vertical"
        tools:context=".fragments.player.PlayerFragment">

    <!-- 其它布局代码省略 -->

    <RelativeLayout
            android:layout_width="match_parent"
            android:layout_height="0dp"
            android:layout_weight="1">

        <androidx.viewpager.widget.ViewPager
                android:id="@+id/view_pager"
                android:layout_width="match_parent"
                android:layout_height="match_parent"/>

        <com.google.android.material.tabs.TabLayout
                android:id="@+id/tab_layout"
                android:layout_width="match_parent"
                android:layout_height="@dimen/tab_height"
                android:background="@drawable/shadow_bottom"
                app:tabIndicatorFullWidth="false"
                app:tabMaxWidth="0dp"
                app:tabGravity="fill"
                app:tabMode="fixed"
                app:tabTextColor="@color/primary_hover_color"/>

    </RelativeLayout>

</LinearLayout>
```

2. 几个使用的TabLayout属性介绍
    * `app:tabIndicatorFullWidth="false"` 指示符要不要布满TabItem,默认是true,设置为false后将会和TabItem的内部视图大小一致，如果没有设置自定义视图，那么就是和文字等宽
    * `app:tabMaxWidth="0dp"` 等待完善
    * `app:tabGravity="fill"` 单个tabite的受到的约束，fill为铺满，那么tabitem会按比例分配可用空间
    * `app:tabMode="fixed"` 整个tablayout的布局模式，fixed为固定在容器内部无法滑动，tabitem越多就会被挤压
    * `app:tabTextColor="@color/primary_hover_color"`e 设置每个tabitem的文字颜色（自定义视图后这个也没什意义了），我们可以使用ColorStateList对不同状态下的文字设置颜色，如果这么使用那么就不应该再使用` app:tabSelectedTextColor`这个属性了

3. tabTextColor颜色文件（@color/primary_hover_color）参考
```xml
<!-- color/primary_hover_color.xml -->
<?xml version="1.0" encoding="utf-8"?>
<selector xmlns:android="http://schemas.android.com/apk/res/android">
    <!-- 只有tabitem没有被按压，被选中的时候字体颜色是默认的文字颜色colorText，其它都为高亮colorPrimary -->
    <item android:state_pressed="false"
          android:state_selected="false"
          android:color="@color/colorText"/>
    <item android:state_pressed="true"
          android:state_selected="false"
          android:color="@color/colorPrimary"/>
    <item android:state_pressed="false"
          android:state_selected="true"
          android:color="@color/colorPrimary"/>
    <item android:state_pressed="true"
          android:state_selected="true"
          android:color="@color/colorPrimary"/>
</selector>
```

4. 将TabLayout与ViewPager关联起来
```kotlin
package com.example.androidx_example.fragments.player

import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import com.example.androidx_example.R
import kotlinx.android.synthetic.main.fragment_player.*

class PlayerFragment : Fragment() {

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        return inflater.inflate(R.layout.fragment_player, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        initTabs()
    }

    private fun initTabs() {
        // 使用setupWithViewPager进行关联
        tab_layout.setupWithViewPager(view_pager)
    }
}

```

5. 为ViewPager编写一个FragmentStatePagerAdapter
```kotlin
package com.example.androidx_example.fragments.player

import androidx.fragment.app.Fragment
import androidx.fragment.app.FragmentManager
import androidx.fragment.app.FragmentStatePagerAdapter

class TabPagerAdapter(fm: FragmentManager) : FragmentStatePagerAdapter(fm, BEHAVIOR_RESUME_ONLY_CURRENT_FRAGMENT) {

    private val tabTitles = listOf("简介", "评论")

    override fun getCount(): Int = tabTitles.size

    override fun getPageTitle(position: Int): CharSequence? = tabTitles[position]

    override fun getItem(position: Int): Fragment {
        return when (position) {
            // 第一页面显示DetailFragment
            0 -> DetailFragment()
            // 第二个页面显示CommentFragment
            else -> CommentFragment()
        }
    }
}
```

6. 修改之前PlayerFragment中的initTab方法，加入设置ViewPage适配器的代码
```kotlin
private fun initTabs() {
        val pagerAdapter = TabPagerAdapter(childFragmentManager)
        view_pager.adapter = pagerAdapter
        tab_layout.setupWithViewPager(view_pager)
}
```
7. 自定义tabitem中的内容（customView）
```kotlin
private fun initTabs() {
    val pagerAdapter = TabPagerAdapter(childFragmentManager)
    view_pager.adapter = pagerAdapter
    tab_layout.apply {
        setupWithViewPager(view_pager)

        // 再setupWithViewPager之后，给每一个tabitem设置customView
        val colorStates = ResourcesCompat.getColorStateList(context.resources, R.color.primary_hover_color, null)
        for (i in 0 until tabCount) {
            val text = TextView(context)
            val layoutParams =
                ViewGroup.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT)
            text.layoutParams = layoutParams
            text.text = pagerAdapter.getPageTitle(i)
            text.setTextColor(colorStates)
            getTabAt(i)?.customView = text
        }
    }
}
```
