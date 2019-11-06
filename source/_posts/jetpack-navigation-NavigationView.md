---
title: JetPack导航组件之抽屉导航
date: 2019-05-25 17:04:34
tags: ['android','jetpack']
categories: Android开发
---

<!--more-->

## Jetpack导航-侧边抽屉导航
![效果图](/images/jetpack/side-navigation.png)

## 1. 在MainActivity的布局文件中使用抽屉布局
```xml
<?xml version="1.0" encoding="utf-8"?>
<androidx.drawerlayout.widget.DrawerLayout
        xmlns:android="http://schemas.android.com/apk/res/android"
        xmlns:app="http://schemas.android.com/apk/res-auto"
        xmlns:tools="http://schemas.android.com/tools"
        android:id="@+id/drawer"
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        tools:context=".MainActivity">

    <!-- 主体内容 -->
    <androidx.constraintlayout.widget.ConstraintLayout
            android:layout_width="match_parent"
            android:layout_height="match_parent">

        <!-- 导航根视图预留 -->
        <!-- ... 页面将会在此处显示 ... -->

    </androidx.constraintlayout.widget.ConstraintLayout>

    <!-- 侧边导航组件 -->
    <!-- app:menu 绑定菜单文件，后面将会创建  -->
    <!-- app:headerLayout 绑定头部视图布局，此文章不与介绍 -->
    <com.google.android.material.navigation.NavigationView
            android:id="@+id/navigation_side"
            android:layout_width="wrap_content"
            android:layout_height="match_parent"
            android:layout_gravity="start"
            android:background="@color/colorWhite"
            android:clickable="true"
            android:focusable="true"
            android:focusableInTouchMode="true"
            app:headerLayout="@layout/app_side_tool_header"
            app:itemBackground="@drawable/app_drawer_item_bg"
            app:itemTextColor="@color/colorText"
            app:menu="@menu/main_side_menu"/>

</androidx.drawerlayout.widget.DrawerLayout>
```

## 2.创建若干个用于切换的页面碎片（androidx.fragment.app.Fragment）
* 如：HomeFragment,CenterFragment,DashboardFragment
```kotlin
/**
 * 首页
 */
class HomeFragment : Fragment() {

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        return inflater.inflate(R.layout.fragment_home, container, false)
    }

}

/**
 * 中心
 */
class CenterFragment : Fragment() {

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        return inflater.inflate(R.layout.fragment_center, container, false)
    }

}

/**
 * 仪表盘
 */
class DashboardFragment : Fragment() {

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        return inflater.inflate(R.layout.fragment_dashboard, container, false)
    }

}
```

## 创建导航图（main_navigation.xml）
```xml
<!-- main_navigation.xml -->
<?xml version="1.0" encoding="utf-8"?>
<navigation xmlns:android="http://schemas.android.com/apk/res/android"
            xmlns:app="http://schemas.android.com/apk/res-auto"
            xmlns:tools="http://schemas.android.com/tools" 
            android:id="@+id/main_navigation"
            app:startDestination="@+id/homeFragment" 
            android:label="home">

    <fragment android:id="@+id/homeFragment" 
              android:name="com.example.androidx_example.fragments.HomeFragment"
              android:label="home" 
              tools:layout="@layout/fragment_home">
    </fragment>

    <fragment android:id="@+id/centerFragment" 
                android:name="com.example.androidx_example.fragments.CenterFragment"
              android:label="center" 
              tools:layout="@layout/fragment_center"/>
    </fragment>

    <fragment android:id="@+id/dashboardfragment" 
                android:name="com.example.androidx_example.fragments.DashboardFragment"
              android:label="dashboard" 
              tools:layout="@layout/fragment_dashboard"/>
    </fragment>

</navigation>
```

## 4.在MainActivity的布局文件中添加导航根视图
```xml
<?xml version="1.0" encoding="utf-8"?>
<androidx.drawerlayout.widget.DrawerLayout
        xmlns:android="http://schemas.android.com/apk/res/android"
        xmlns:app="http://schemas.android.com/apk/res-auto"
        xmlns:tools="http://schemas.android.com/tools"
        android:id="@+id/drawer"
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        tools:context=".MainActivity">

    <!-- 主体内容 -->
    <androidx.constraintlayout.widget.ConstraintLayout
            android:layout_width="match_parent"
            android:layout_height="match_parent">

        <!-- 导航根视图 -->
        <!-- navGraph 绑定之前的导航图 main_navigation -->
        <fragment
                android:id="@+id/nav_host"
                android:name="androidx.navigation.fragment.NavHostFragment"
                android:layout_width="0dp"
                android:layout_height="0dp"
                app:layout_constraintStart_toStartOf="parent"
                app:layout_constraintEnd_toEndOf="parent"
                app:layout_constraintTop_toTopOf="parent"
                app:layout_constraintBottom_toTopOf="@+id/main_bottom_navigation"
                app:defaultNavHost="true"
                app:navGraph="@navigation/main_navigation"/>

    </androidx.constraintlayout.widget.ConstraintLayout>

    <!-- 侧边导航组件 -->
    <com.google.android.material.navigation.NavigationView
            android:id="@+id/navigation_side"
            android:layout_width="wrap_content"
            android:layout_height="match_parent"
            android:layout_gravity="start"
            android:background="@color/colorWhite"
            android:clickable="true"
            android:focusable="true"
            android:focusableInTouchMode="true"
            app:headerLayout="@layout/app_side_tool_header"
            app:itemBackground="@drawable/app_drawer_item_bg"
            app:itemTextColor="@color/colorText"
            app:menu="@menu/main_side_menu"/>

</androidx.drawerlayout.widget.DrawerLayout>
```

## 5.为抽屉导航添加菜单（main_side_menu.xml）
```xml
<?xml version="1.0" encoding="utf-8"?>
<menu xmlns:android="http://schemas.android.com/apk/res/android"
      xmlns:tools="http://schemas.android.com/tools"
      android:checkableBehavior="single"
      tools:showIn="navigation">
    <!-- 分组要给予一个id才会出现分割线 -->
    <group android:id="@+id/group_one">
        <!-- 每一个菜单项的id需要和导航目的地的id一致 -->
        <!-- <fragment android:id="@+id/homeFragment" 
              android:name="com.example.androidx_example.fragments.HomeFragment"
              android:label="home" 
              tools:layout="@layout/fragment_home">
        </fragment> -->
        <!-- checkable设置为true，才能让每一项可以被选中（添加选中效果） -->
        <item android:id="@+id/homeFragment"
              android:checkable="true"
              android:icon="@drawable/ic_home"
              android:title="首页"/>
        <item android:id="@+id/centerFragment"
              android:checkable="true"
              android:icon="@drawable/ic_center"
              android:title="中心"/>
    </group>
    <group android:id="@+id/group_two">
        <item android:id="@+id/dashboardFragment"
              android:checkable="true"
              android:icon="@drawable/ic_dashboard"
              android:title="仪表盘"/>
    </group>
</menu>
```

## 6.选中后的效果-----菜单背景切换，图标切换
* 使用selector来添加两种状态下的图标(drawable/ic_home.xml)
```xml
<?xml version="1.0" encoding="utf-8"?>
<selector xmlns:android="http://schemas.android.com/apk/res/android">
    <item android:state_selected="false" android:drawable="@drawable/ic_home_default"/>
    <item android:state_selected="true" android:drawable="@drawable/ic_home_selected"/>
</selector>
```
* 同理使用selector来添加两种状态下的背景(drawable/app_drawer_item_bg.xml)
```xml
<!-- 我们在NavigationView标签中使用了app:itemBackground设置了此背景 -->
<selector xmlns:android="http://schemas.android.com/apk/res/android">
    <item android:state_checked="false">
        <shape>
            <solid android:color="#FFFFFF"/>
        </shape>
    </item>
    <item android:state_checked="true">
        <shape>
            <solid android:color="#EEEEEE"/>
        </shape>
    </item>
</selector>
```

## 7.将NavigationView与导航控制器绑定在一起
```kotlin
class MainActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        initNav()
    }

    private fun initNav() {
        // 我们使用导航根视图的findNavController方法可以快速获取当前导航
        val navCtrl = nav_host.findNavController().apply {
            // 我们监听导航事件，每次发生导航，把对应的菜单项设置为选中状态（这个不是必要的，根据需求）
            addOnDestinationChangedListener { _, destination, _ ->
                navigation_side?.setCheckedItem(destination.id)
            }
        }
        navigation_side.apply {
            // 使用NavigationUI给Navigation拓展的setupWithNavController方法然导航控制器管理Navigation
            setupWithNavController(navCtrl)
            // 如果需要使用图标原有的色彩（彩色），那么把iconTint全部设为空（这个不是必要的，根据需求）
            itemIconTintList = null
        }
    }
}
```

## 8.其它
* 分割线颜色调整,通过设置应用主题listDivider可以修改分割线的颜色
```
<!-- Base application theme. -->
<style name="AppTheme" parent="Theme.AppCompat.Light.NoActionBar">
    <item name="colorPrimary">@color/colorPrimary</item>
    <item name="colorPrimaryDark">@color/colorPrimaryDark</item>
    <item name="colorAccent">@color/colorAccent</item>
    <!-- 分割线颜色 -->
    <item name="android:listDivider">@color/colorLine</item>
</style>
```
* 配置底部导航时，需要对某些特别菜单单独处理，可以自行在导航事件中处理
如：某些侧边导航的页面会导航到一个不在底部导航的目的地（页面碎片），我们需要隐藏底部导航，而有些页面又需要显示底部导航
```kotlin
class MainActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        initNav()
    }

    private fun initNav() {
        val navCtrl = nav_host.findNavController().apply {
            addOnDestinationChangedListener { _, destination, _ ->
                navigation_side?.setCheckedItem(destination.id)
                // home,center,dashboard可以用底部导航切换，也可以用侧边导航切换，其它页面都隐藏掉底部导航
                main_bottom_navigation?.visibility = when (destination.id) {
                    R.id.homeFragment, R.id.centerFragment, R.id.dashboardFragment -> View.VISIBLE
                    else -> View.GONE
                }
            }
        }
        main_bottom_navigation.setupWithNavController(navCtrl)
        navigation_side.apply {
            setupWithNavController(navCtrl)
            itemIconTintList = null
        }
    }
}
```


