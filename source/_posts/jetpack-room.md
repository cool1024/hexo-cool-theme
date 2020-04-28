---
title: Android - JetPack Room
date: 2019-06-29 11:37:36
tags: ["Android","Jetpack"]
categories: Android开发
---

Room是一个数据持久化的库,它使您可以更轻松地在应用程序中使用SQLiteDatabase对象，减少样板代码的数量并在编译时验证SQL查询。Room在SQLite上提供了一个抽象层，提供了更强大的数据库访问，同时充分使用了SQLite能力。Room可帮助运行应用程序的设备上创建应用程序数据的缓存。此缓存对于应用程序是唯一的，允许用户在应用程序中查看数据的副本，无论用户是否连接到了网络。
<!-- more -->

# SQLite 概述
SQLite 是一个软件库，实现了自给自足的、无服务器的、零配置的、事务性的 SQL 数据库引擎。SQLite 是在世界上最广泛部署的 SQL 数据库引擎。SQLite 源代码不受版权限制。就像其他数据库，SQLite 引擎不是一个独立的进程，可以按应用程序需求进行静态或动态连接。SQLite 直接访问其存储文件。

# Android 中的 SQLite
在Android 系统内部集成了 SQLite，所以每个 Android 应用程序都可以使用 SQLite 数据库。对于熟悉 SQL 的开发人员来时，在 Android 开发中使用 SQLite 相当简单。通常情况，数据库文件存储在`data/< 项目文件夹 >/databases/`下。

## 基本用法

1. 使用context实例中的`openOrCreateDatabase`可以创建一个数据库连接对象；
2. 使用`execSQL`执行创建表的语句；
3. 使用`execSQL`执行插入语句；
4. 使用`rawQuery`执行查询。

**下面是一段使用SQLite的参考代码：**

```Kotlin
package com.example.androidx_example.until

import android.content.Context
import android.database.sqlite.SQLiteDatabase

object SQLiteUntil {

    // 数据的名称，这个名称会作为数据存储文件的名称
    private const val DATABASE_NAME = "www-cool1024-com.db"
    // 数据库实例
    private lateinit var db: SQLiteDatabase

    /**
     * 开启数据库连接
     */
    fun openDB(context: Context) {
        if (!this::db.isInitialized || !db.isOpen) {
            db = context.openOrCreateDatabase(
                DATABASE_NAME,
                Context.MODE_PRIVATE,
                null
            )
        }
    }

    /**
     * 关闭数据库连接
     */
    fun closeDB() {
        if (this::db.isInitialized) {
            db.close()
        }
    }

    /**
     * 创建API数据保存表
     */
    fun createApiDataTable() {
        db.execSQL(
            """
            create table if not exists api_data(
                id integer primary key autoincrement,
                api_name text,
                api_param_hash text,
                api_data text,
                save_time integer,
                lost_time integer
            )""".trimIndent()
        )
    }

    /**
     * 保存api数据到api_table中
     * @param apiName 接口的名称
     * @param hasCode 参数的hash码
     * @param dataStr 接口返回数据
     * @param effectiveTimeMillis 数据有效时间，毫秒
     */
    fun saveApiData(apiName: String, hasCode: Int, dataStr: String, effectiveTimeMillis: Long) {
        val nowMillis = System.currentTimeMillis()
        db.execSQL(
            "insert into api_data(api_name,api_param_hash,api_data,save_time,lost_time) values (?,?,?,?,?)",
            arrayOf(apiName, hasCode, dataStr, nowMillis, nowMillis + effectiveTimeMillis)
        )
    }


    /**
     * 获取保存的api数据
     * @param apiName 接口名称
     * @param hasCode 参数的hash码
     * @return 查询结果字符串，如果没有那么得到一个空String()
     */
    fun getSaveApiData(apiName: String, hasCode: Int): String {
        val nowMillis = System.currentTimeMillis()
        val cursor = db.rawQuery(
            "select api_data from api_data where api_name = ? and api_param_hash = ? and lost_time > ? order by id desc limit 1",
            arrayOf(apiName, hasCode.toString(), nowMillis.toString())
        )
        return (if (cursor.moveToNext()) {
            cursor.getString(cursor.getColumnIndex("api_data"))
        } else String()).also { cursor.close() }
    }
}
```

## 使用辅助工具类 SQLiteOpenHelper

**SQLiteOpenHelper**是用于管理数据库创建和版本管理的帮助程序类。您可以创建一个子类实现`onCreate(SQLiteDatabase)`，`onUpgrade(SQLiteDatabase, int, int)`,并且可以以根据具体需要实现`onOpen(SQLiteDatabase)`，如果数据库存在，则该类负责打开数据库，如果不存在则创建数据库，并根据需要进行更新。使用事务确保了数据库始终处于合理状态。

**下面是一段使用SQLiteOpenHelper的参考代码：**

```Kotlin
class AppSQLiteHelp(context: Context) :
    SQLiteOpenHelper(context, SQLiteUntil.DATABASE_NAME, null, SQLiteUntil.DATABASE_VERSION) {

    override fun onCreate(db: SQLiteDatabase) {
        db.execSQL(
            """
            create table if not exists api_data(
                id integer primary key autoincrement,
                api_name text,
                api_param_hash text,
                api_data text,
                save_time integer,
                lost_time integer
            )""".trimIndent()
        )
    }

    override fun onUpgrade(db: SQLiteDatabase, oldVersion: Int, newVersion: Int) {
        db.execSQL("drop table if exists api_data")
        onCreate(db)
    }

    companion object {

        private val db: AppSQLiteHelp by lazy {
            AppSQLiteHelp(App.instance)
        }

        /**
         * 保存api数据到api_table中
         * @param apiName 接口的名称
         * @param hasCode 参数的hash码
         * @param dataStr 接口返回数据
         * @param effectiveTimeMillis 数据有效时间，毫秒
         */
        fun saveApiData(apiName: String, hasCode: Int, dataStr: String, effectiveTimeMillis: Long) {
            val nowMillis = System.currentTimeMillis()
            val values = ContentValues().apply {
                put("api_name", apiName)
                put("api_param_hash", hasCode)
                put("api_data", dataStr)
                put("save_time", nowMillis)
                put("lost_time", nowMillis + effectiveTimeMillis)
            }
            db.writableDatabase.insert("api_data", null, values)
        }

        /**
         * 获取保存的api数据
         * @param apiName 接口名称
         * @param hasCode 参数的hash码
         * @return 查询结果字符串，如果没有那么得到一个空String()
         */
        fun getSaveApiData(apiName: String, hasCode: Int): String {
            val nowMillis = System.currentTimeMillis()
            val cursor = db.readableDatabase.query(
                "api_data",
                arrayOf("api_data"),
                "api_name = ? and api_param_hash = ? and lost_time > ?",
                arrayOf(apiName, hasCode.toString(), nowMillis.toString()),
                null, // 参考SQL--Group
                null, // 参考SQL--Having
                "id desc", // 参考SQL--Order By
                "1" // 参考SQL--Limit 限制查询结果数目
            )
            return cursor?.let {
                val dataStr = if (it.moveToNext()) it.getString(cursor.getColumnIndex("api_data"))
                else String()
                return dataStr.also { cursor.close() }
            } ?: String()
        }
    }
}
```

# Room
Room是一个数据持久化的库,它使您可以更轻松地在应用程序中使用SQLiteDatabase对象，减少样板代码的数量并在编译时验证SQL查询。Room在SQLite上提供了一个抽象层，提供了更强大的数据库访问，同时充分使用了SQLite能力。Room可帮助运行应用程序的设备上创建应用程序数据的缓存。此缓存对于应用程序是唯一的，允许用户在应用程序中查看数据的副本，无论用户是否连接到了网络。

## Room 相较于直接使用 SQLite 优势

1. 减少样板代码；
2. 编译时校验查询，生成对应的关系对象；
3. 轻松实现迁移；
4. 高度的可测试性；
5. 保持数据库远离主线程。

## 在项目中引入 Room

1. **在app/build.gradle中配置,此处为kotlin的导入，详情请查看** ：[Room版本库](https://developer.android.google.cn/jetpack/androidx/releases/room/)

```Gradle
def room_version = '2.1.0'
implementation "androidx.room:room-runtime:$room_version"
implementation "androidx.room:room-ktx:$room_version"
kapt "android.arch.persistence.room:compiler:$room_version"

```

2. 创建存储数据类**Entity**

```Kotlin
...

import androidx.room.ColumnInfo
import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "api_data")
data class ApiSaveData(

    // @ColumnInfo(name = "id")
    @PrimaryKey
    var id: Int? = null,

    @ColumnInfo(name = "api_name")
    val apiName: String?,

    @ColumnInfo(name = "api_param_hash")
    val paramHash: Int?,

    @ColumnInfo(name = "api_data")
    val apiData: String?,

    @ColumnInfo(name = "save_time")
    val saveTime: Long?,

    @ColumnInfo(name = "lost_time")
    val lostTime: Long?
)
```

3. 创建存数据访问对象**Dao**

```Kotlin
...

import androidx.room.Dao
import androidx.room.Query
import com.example.androidx_example.entity.ApiSaveData

@Dao
interface ApiSaveDataDao : BaseDao<ApiSaveData> {
    @Query("select api_data from  api_data where api_name = :apiName and api_param_hash = :hashCode and lost_time > :currentTime")
    fun findSaveData(apiName: String, hashCode: Int, currentTime: Long = System.currentTimeMillis()): String?
}

    /**
    * BaseDao 声明了一些常用的方法，避免重复写样板代码
 */
interface BaseDao<T> {

    /**
     * Insert an object in the database.
     *
     * @param obj the object to be inserted.
     */
    @Insert
    fun insert(obj: T)

    /**
     * Insert an array of objects in the database.
     *
     * @param obj the objects to be inserted.
     */
    @Insert
    fun insert(vararg obj: T)

    /**
     * Update an object from the database.
     *
     * @param obj the object to be updated
     */
    @Update
    fun update(obj: T)

    /**
     * Delete an object from the database
     *
     * @param obj the object to be deleted
     */
    @Delete
    fun delete(obj: T)

}
```

4. 创建数据库对象**RoomDatabase**

```Kotlin
...

import androidx.room.Database
import androidx.room.RoomDatabase
import com.example.androidx_example.entity.ApiSaveData

@Database(entities = [ApiSaveData::class], version = 1, exportSchema = false)
abstract class AppDatabase : RoomDatabase() {
    abstract fun apiSaveDataDao(): ApiSaveDataDao
}
```

5. 单例模式，获取数据库对象

```Kotlin
...

import androidx.room.Room
import com.example.androidx_example.App
import com.example.androidx_example.dao.AppDatabase

object RoomUntil {

    lateinit var db: AppDatabase
        private set

    fun initDB() {
        if (!this::db.isInitialized) {
            db = Room.databaseBuilder(
                App.instance,
                AppDatabase::class.java, SQLiteUntil.DATABASE_NAME
            ).build()
        }
    }
}
```

6. 开始使用Room

```Kotlin
RoomUntil.initDB()

// 查询指定接口的缓存数据
val saveDataStr = RoomUntil.db.apiSaveDataDao()
    .findSaveData("接口名称", 432143242134809)

// 保存缓存数据--这里的insert来自BaseDao
 RoomUntil.db.apiSaveDataDao()
    .insert(
        ApiSaveData(
            apiName = apiName,
            paramHash = params.hashCode(),
            apiData = it.getStringData(),
            saveTime = currentTime,
            lostTime = currentTime + (1000 * 60 * 60)
        )
    )
```

##### 相关参考
1. [IBM Developer-SQLite](https://www.ibm.com/developerworks/cn/opensource/os-cn-sqlite/index.html)；
2. [使用SQLite保存数据](https://developer.android.google.cn/training/data-storage/sqlite?hl=en)；
3. [使用Room保存数据到本地数据库](https://developer.android.google.cn/training/data-storage/room)；
4. [7步使用Room](https://medium.com/androiddevelopers/7-steps-to-room-27a5fe5f99b2)。