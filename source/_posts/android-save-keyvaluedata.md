---
title: 使用SharedPreferences保存键值对数据
date: 2019-07-01 09:03:42
tags: ["android"]
categories: Android开发
---

当我们不需要存储大量数据并且不需要特别的数据结构，则应使用SharedPreferences。SharedPreferencesAPI允许你读写基本数据类型的持久键值对：布尔型，浮点数，整型，长整型和字符串。

这些键值将写入到XML文件中，并且在用户会话中持续存在，即使应用程序被终止任然会保存。可以手动指定文件的名称，也可以基于活动（指定Activity）保存数据文件。

API名称“共享首选项”有点误导，API并不严格用于保存“用户首选项”，例如用户选择的铃声。您可以使用SharedPreferences 保存任何类型的简单数据，例如用户的高分。但是，如果您确实要为应用程序保存用户首选项，那么您应该阅读如何创建Setting UI，使用AndroidX Preference Library 构建设置屏幕并自动保留用户的设置。
<!-- more -->

# 简单的SharedPreferences使用

1. 获取SharedPreferences句柄（Handle）
 a. `getSharedPreferences()` --指定文件名称，在应用中任使用Context调用即可
 b. `getPreferences()` --基于当前活动，这样将检索属于该活动的默认共享首选项文件

```Kotlin
// 使用context，指定名称获取，使用MODE_PRIVATE只允许本APP使用
val sharedPreferencesOne = context?.getSharedPreferences("自定义名称，用于区分", Context.MODE_PRIVATE)

// 使用activity，指定活动获取，使用MODE_PRIVATE只允许本APP使用
val sharedPreferencesTwo  = activity?.getPreferences(Context.MODE_PRIVATE)
```
>注意： MODE_WORLD_READABLE和 MODE_WORLD_WRITEABLE从API17开始被废弃.从Android 7.0（API级别24）时使用它们将会抛出一 SecurityException（异常）。如果您的应用程序需要与其他应用共享的私人文件，可以使用FileProvider与FLAG_GRANT_READ_URI_PERMISSION。有关更多信息，[另请参阅共享文件](https://developer.android.com/training/secure-file-sharing/index.html)。

2. 写入数据

写入数据需要创建一个编辑对象（SharedPreferences.Editor），使用上面创建好的获取SharedPreferences句柄的`edit()`方法可以创建一个编辑对象。
编辑完成后使用`call()`或者`apply()`方法保存变更

```Kotlin
val sharedPreferences = context?.getSharedPreferences("自定义名称，用于区分", Context.MODE_PRIVATE)
sharedPreferences?.edit()?.apply {
    putInt("age", 18)
    putBoolean("isActive", true)
    apply()
}
```
> `commit()`是同步的并且会返回true/false告知是否写入成功，如果有多个编辑器对象同时执行commit操作，那么最后一次提交会生效（应该避免在主线程使用commit）
`apply()`会立即更改内存中的对象，但异步将更新写入磁盘，它不会返回更改结果，如果我们不关心操作结果并且在主线程进行生效操作，那么这个是不错的选择

3. 读取数据

```Kotlin
val sharedPreferences = context?.getSharedPreferences("自定义名称，用于区分", Context.MODE_PRIVATE)
val defaultValue = 10
val age = sharedPreferences.getInt("age", defaultValue)
```

# 使用Setting UI构建APP设置界面

Preference库允许您构建交互式设置屏幕，而无需处理与设备存储的交互或管理用户界面。[点击查看相关库组件说明](https://developer.android.com/reference/androidx/preference/package-summary.html)

1. Android Studio提供了快速创建的功能，如下图所示点击创建（File->New->Activity->Settings Activity）
![参考图片](/images/jetpack/settings.png)

2. 编写配置文件
```xml
<androidx.preference.PreferenceScreen
        xmlns:app="http://schemas.android.com/apk/res-auto">

    <PreferenceCategory
            app:title="@string/setting_play">

        <ListPreference
                app:key="setting_play_decode_method"
                app:title="@string/setting_play_decode_method"
                app:entries="@array/decode_entries"
                app:entryValues="@array/decode_values"
                app:defaultValue="hardware"
                app:useSimpleSummaryProvider="true"/>

    </PreferenceCategory>

    <PreferenceCategory
            app:title="@string/setting_message_title">

        <SwitchPreferenceCompat
                app:key="message_allow"
                app:title="@string/setting_message_allow"/>

        <SwitchPreferenceCompat
                app:key="message_allow_call"
                app:dependency="message_allow"
                app:title="@string/setting_message_allow_call"
                app:summary="@string/setting_message_allow_call_subject"/>

        <SwitchPreferenceCompat
                app:key="setting_message_allow_notify"
                app:dependency="message_allow"
                app:title="@string/setting_message_allow_notify"
                app:summary="@string/setting_message_allow_notify_subject"/>

    </PreferenceCategory>

</androidx.preference.PreferenceScreen>
```
3. SettingsActivity 相关代码
```Kotlin
package com.example.androidx_example

import android.os.Bundle
import android.view.MenuItem
import androidx.appcompat.app.AppCompatActivity
import androidx.preference.PreferenceFragmentCompat
import kotlinx.android.synthetic.main.settings_activity.*

class SettingsActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.settings_activity)
        supportFragmentManager
            .beginTransaction()
            .replace(R.id.settings, SettingsFragment())
            .commit()
        setSupportActionBar(setting_toolbar)
        supportActionBar?.title = "设置"
        supportActionBar?.setDisplayHomeAsUpEnabled(true)
    }

    override fun onOptionsItemSelected(item: MenuItem): Boolean {
        if (item.itemId == android.R.id.home) finish()
        return super.onOptionsItemSelected(item)
    }

    class SettingsFragment : PreferenceFragmentCompat() {
        override fun onCreatePreferences(savedInstanceState: Bundle?, rootKey: String?) {
            setPreferencesFromResource(R.xml.root_preferences, rootKey)
        }
    }
}
```

4. SettingsActivity布局文件
```xml
<LinearLayout
        xmlns:android="http://schemas.android.com/apk/res/android"
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:orientation="vertical">
    <com.google.android.material.appbar.AppBarLayout
            android:layout_width="match_parent"
            android:layout_height="wrap_content">
        <androidx.appcompat.widget.Toolbar
                android:id="@+id/setting_toolbar"
                android:layout_width="match_parent"
                android:layout_height="@dimen/actionbar_height"
                android:paddingStart="0dp"
                android:paddingEnd="@dimen/padding_lg"
                android:theme="@style/ActionBarStyle"/>
    </com.google.android.material.appbar.AppBarLayout>
    <FrameLayout
            android:id="@+id/settings"
            android:layout_width="match_parent"
            android:layout_height="0dp"
            android:layout_weight="1"/>
</LinearLayout>
```

5. 预览结果
![参考图片](/images/jetpack/setting-view.png)