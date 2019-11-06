---
title: JetPack-WorkManager预览
date: 2019-06-28 16:33:16
tags: ["android","jetpack"]
categories: Android开发
---

使用WorkManager，您可以轻松设置任务并将其交给系统，以便在您指定的条件下运行。
<!--more-->

##### 后台任务指南
每个Android应用程序都有一个主线程，负责处理UI（包括测量和绘图视图），协调用户交互和接收生命周期事件。如果此线程上发生了太多工作，则应用程序会出现挂起或减速等情况，这会给用户带来不良好体验。任何长时间运行的计算和操作（如解码位图，访问磁盘或执行网络请求）都应在单独的后台线程上完成。通常，任何花费超过几毫秒的事情都应该委托给后台线程。当用户主动与应用程序交互时，可能需要执行其中一些任务。要了解如何在应用程序正在使用时在后台线程和主UI线程上运行任务，请查看线程解决方案指南。

即使用户没有主动使用应用程序，应用程序也可能需要运行某些任务，例如定期与后端服务器同步或定期在应用程序中获取新内容。即使用户已完成与应用程序的交互，应用程序也可能要求服务立即运行完成。


**后台任务**：实际做法选择途径

1. 长时间运行的HTTP下载 --> DownloadManager
2. 刻不容缓的任务 --> Foreground service（你不应该在后台处理，这是一个前台服务）
3. 根据系统设备的状态触发执行 --> WorkManager
4. 在某个精确的时间段执行 --> AlarmManager
5. 如果以上都不是那么使用 WorkManager

**前台服务**：对于需要立即运行并且必须执行完成的用户启动的工作，请使用前台服务。使用前台服务告诉系统应用程序正在执行重要操作并且不应该被杀死。通过通知托盘中的不允许通知，用户可以看到前台服务。

##### WorkManager说明
推荐：WorkManager适用于可延迟的任务，即：不需要立即运行，即使应用程序退出或设备重新启动也需要可靠运行。例如：

1. 将日志或分析发送到后端服务
2. 定期将应用程序数据与服务器同步

注意：WorkManager不适用于在应用程序进程消失时可以安全终止的进程内后台工作，也不适用于需要立即执行的任务。请查看后台处理指南，了解哪种解决方案符合您的需求。

优势：
* 向后兼容API 14
* 添加网络可用性或计费状态等工作约束
* 设置异步一次性或定期任务
* 可以监控和管理计划任务
* 任务可以组合
* 保证执行，程序设备重启也能确保任务执行
* Adheres to power-saving features like Doze mode

##### 简单使用

0. 依赖包引入
```Groovy
def work_version = '2.1.0-beta02'
implementation "androidx.work:work-runtime-ktx:$work_version"
// implementation "androidx.work:work-rxjava2:$work_version"
```


1. 创建一个简单的Worker
```Kotlin
class ImageDownloadWorker(appContext: Context, workerParams: WorkerParameters) :
    Worker(appContext, workerParams) {

    override fun doWork(): Result {
        // 获取图片下载链接
        val imageUrl = inputData.getString(DOWNLOAD_IMAGE_URL)
        return imageUrl?.let {
            // 下载图片方法，下载成功返回true，失败返回false
            val result = downloadImage(imageUrl)
            // 如果下载失败，返回Result.retry()重试
            return if(result) Result.success() else Result.retry()
            Result.success()
        } ?: Result.failure()
    }

    companion object {

        private const val DOWNLOAD_IMAGE_URL = "DOWNLOAD_IMAGE_URL"

        /**
         * 执行图片下载任务，并返回任务信息的LiveData
         */
        fun execute(app: Application, imageUrl: String): LiveData<WorkInfo> {
            // 设置传递的参数，图片下载地址
            val inputData = Data.Builder()
                .putString(DOWNLOAD_IMAGE_URL, imageUrl)
                .build()
            // 设置Work执行约束
            val constraints = Constraints.Builder()
                .setRequiredNetworkType(NetworkType.CONNECTED) // 有网络才执行
                .build()
            // 创建work请求
            val workRequest = OneTimeWorkRequestBuilder<ImageDownloadWorker>()
                .setConstraints(constraints)
                .setInputData(inputData)
                .build()
            // 把work加入到队列中
            WorkManager.getInstance(app).enqueue(workRequest)
            // 返回work的livedata用于观察work的状态
            return WorkManager.getInstance(app).getWorkInfoByIdLiveData(workRequest.id)
        }
    }
}
```

2. 执行
```Kotlin
ImageDownloadWorker.execute(
    activity!!.application,
    "...一个图片URL..."
).observe(this, Observer {
    if (it != null && it.state == WorkInfo.State.SUCCEEDED) {
        showToast("图片下载成功")
    }
})
```
3. 行为分析
 * 网络断开时，如果调用了执行`ImageDownloadWorker.execute()`把worker加入到队列中，下载不会执行，如果之后网络恢复，worker会立即执行
 * 任务执行过程中，直接退出app，任务会被提前结束；如果下次再次进入应用，它会再次执行（如果网络连接正常的话)
 * 下载途中网络中断，导致下载终止；我们在代码里返回了Result.retry(),那么任务会在适当的时候再次执行（重新下载）

##### 概览图
![概览图](/images/jetpack/workmanager.png)

##### 请求类别（单次任务/重复执行任务）

1. OneTimeWorkRequest

2. PeriodicWorkRequest [参考文档](https://developer.android.google.cn/reference/androidx/work/PeriodicWorkRequest.Builder)

##### 任务约束 Constraints [参考文档](https://developer.android.com/reference/androidx/work/Constraints)

|方法名称|设置说明|
|--|--|
|requiresBatteryNotLow|需要当前电量充足|
|requiresCharging|正在充电|
|requiresDeviceIdle|设备空闲|
|requiresStorageNotLow|存储空间充足|
|setRequiredNetworkType|当前网络状态必须满足XX条件|

|网络状态|说明|
|--|--|
|NetworkType.CONNECTED|有有效的网络连接|
|NetworkType.METERED|要计量网络连接|
|NetworkType.NOT_ROAMING|非漫游网络|
|NetworkType.UNMETERED|要非计量网络连接|

```Kotlin
 val constraints = Constraints.Builder()
    .setRequiredNetworkType(NetworkType.CONNECTED) // 有网络才执行
    .setRequiresDeviceIdle(true) // 设备空闲
    .setRequiresCharging(true) // 设备充电
    .build()
```

##### 取消任务
```Kotlin
// 可以根据任务的requestId来取消
WorkManager.getInstance(appliction)
    .cancelByWorkId(workRequestId);

// 如果我们对任务分了组（addTag），我们可以就可以同时取消一个组的所有任务
// 注意一个request是可以添加多个Tag，也就是可以同时属于不同的组，只要它在的任何一个组要被取消，就会被取消
 val workRequest = OneTimeWorkRequestBuilder<ImageDownloadWorker>()
    .addTag("A GROUP")
    .build()

// 取消操作
WorkManager.getInstance(app).cancelAllWorkByTag("A GROUP")
```

##### 参数传递
WorkManager 为每个 WorkRequest 对象提供一个LiveData，LiveData持有一个WorkStatus对象，通过观察LiveData，我们可以确定任务的当前状态，并在任务完成后获取返回的任何值。

```Kotlin

// 在构件请求的时候使用setInputData把参数传人
val inputData = Data.Builder()
            .putString("downloadUrl", "https://www.xx.com/1.jpg")
            .build()
WorkRequestBuilder<XXXXXXWorker>().setInputData(inputData)


// 在Worker中使用Result.success(data)作为返回值
...
override fun doWork(): Result {
    // 获取图片下载链接
    val imageUrl = inputData.getString("downloadUrl")
    return imageUrl?.let {
        // 下载图片方法，下载成功返回true，失败返回false
        val result = downloadImage(imageUrl)
        // 如果下载失败，返回Result.retry()重试
        return if(result) Result.success(
            Data.Builder()
                .putString("xxxx参数名称", "xxxx参数的值")
                .build()
        ) else Result.retry()
        Result.success()
    } ?: Result.failure()
}
...

// 在状态监听中可以获取传出的值
ImageDownloadWorker.execute(
    activity!!.application,
    "...一个图片URL..."
).observe(this, Observer {
    if (it != null && it.state == WorkInfo.State.SUCCEEDED) {
        showToast("图片下载成功")
        // 获取传出的参数
        val param =  it.outputData.getString("xxxx参数名称")
    }
})
```

##### 任务链
1. A->B->C
```Kotlin
WorkManager.getInstance(app)
    .beginWith(A)
    .then(B)
    .then(C)
    .enqueue(workRequest)
```

2. 使用WorkContinuation进行任务组合 ((A->B) & (C->D)) -> E
```Kotlin
// A->B
val worksOne = WorkManager.getInstance(app)
            .beginWith(A)
            .then(B)
// C->D
val worksTwo = WorkManager.getInstance(app)
            .beginWith(C)
            .then(D)   

// (worksOne & worksTwo) -> E   worksOne组和wokrsTwo组结束后才会执行E
WorkContinuation.combine(listOf(worksOne, worksTwo))
            .then(E)
            .enqueue()         
```

详情参考源代码说明
```Java
/**
    * Combines multiple {@link WorkContinuation}s as prerequisites for a new WorkContinuation to
    * allow for complex chaining.  For example, to create a graph like this:
    *
    * <pre>
    *     A       C
    *     |       |
    *     B       D
    *     |       |
    *     +-------+
    *         |
    *         E    </pre>
    *
    * you would write the following:
    *
    * <pre>
    * {@code
    *  WorkContinuation left = workManager.beginWith(A).then(B);
    *  WorkContinuation right = workManager.beginWith(C).then(D);
    *  WorkContinuation final = WorkContinuation.combine(Arrays.asList(left, right)).then(E);
    *  final.enqueue();}</pre>
    *
    * @param continuations One or more {@link WorkContinuation}s that are prerequisites for the
    *                      return value
    * @return A {@link WorkContinuation} that allows further chaining
    */
public static @NonNull WorkContinuation combine(@NonNull List<WorkContinuation> continuations) {
    return continuations.get(0).combineInternal(continuations);
}
```

<div class="tip">WorkManager不保证worksOne 和 worksTwo中的任务同时执行；只能保证同一个组和中的任务按顺序执行（如A->B，必须A完成才执行B）；而One和Two都结束后就进入到E