---
title: FFMPEG视频切割/按碎片进行播放
date: 2019-01-21 15:38:16
tags: ffmpeg
---
#### 视频切割
1. 按时间间隔进行切割（由于关键帧的问题，每个碎片的时间不会完全一样）
参考格式
`ffmpeg -i 要切割的视频.flv -threads [线程数量] -vcodec copy -f segment -segment_time [片段时间-秒] [输出文件]`
例子，我们把origin.flv文件按60秒间隔进行切割，结果输出到output文件夹中，%04d为4位数（如果不够会补0，如0001）,使用了4个线程，注意output这个目录必须先创建
`ffmpeg -i origin.flv -threads 4 -vcodec copy -f segment -segment_time 60 ./output/%04d.flv`

2. 碎片信息获取
每个视频的时间长度是不一样的，跳转进度的时候需要根据具体时间推算出应该加载的碎片
参考格式
`ffprobe -v quiet -print_format json -show_format [视频文件]`
例子，我们获取了0000.flv视频碎片的信息
`ffprobe -v quiet -print_format json -show_format 0000.flv`
测试结果
```json
{
    "format": {
        "filename": "0000.flv",
        "nb_streams": 2,
        "nb_programs": 0,
        "format_name": "flv",
        "format_long_name": "FLV (Flash Video)",
        "start_time": "0.000000",
        "duration": "61.108000",
        "size": "24466108",
        "bit_rate": "3202999",
        "probe_score": 100,
        "tags": {
            "major_brand": "isom",
            "minor_version": "1",
            "compatible_brands": "isom",
            "lastkeyframelocation": "425679152",
            "canSeekToEnd": "true",
            "videosize": "402910584",
            "audiosize": "23709850",
            "lastkeyframetimestamp": "1411",
            "encoder": "Lavf58.25.100"
        }
    }
}
```

3. 批量获取（使用脚本）
这里使用的是php编写的脚本，并把结果输出到segment.json文件中
```php
<?php

// 这个方法是用来获取一个目录下指定拓展名称的所有文件
function list_files($path, $ext)
{
    $tree = array();
    $temp = glob($path . "/*" . $ext);
    if ($temp) $tree = array_merge($tree, $temp);
    foreach (glob($path . "/*", GLOB_ONLYDIR) as $dir) {
        $temp = list_files($dir, $ext);
        if ($temp) $tree = array_merge($tree, $temp);
    }
    return $tree;
}


// 第一个是视频碎片的文件夹，第二个是视频的拓展名
$flvs = list_files('/usr/local/var/www/html/output', 'flv');
$segments = [];
$count = 0;

foreach ($flvs as $flv) {
    $result = shell_exec('ffprobe -v quiet -print_format json -show_format ' . $flv);
    $result = json_decode($result, true);
    $result = $result['format'];
    $count += $result['duration'] * 1000;
    $segments[] = [
        'duration' => $result['duration'] * 1000, // 时长（这里*1000转换为毫秒）
        'filesize' => (int)$result['size'], // 文件大小
        'url' => '/html/output/' . array_pop(explode('/', $result['filename'])) // 碎片访问路径
    ];
}
// 输出总时长
echo ($count);

// 把结果写入到segment.json中
file_put_contents('segment.json', json_encode($segments));
```

4. 生成关键帧快照，用于视频缩略图预览
参考格式
`ffmpeg -i [原始视频] -vf select='eq(pict_type\,I)' -vsync 2 -s [分辨率] -f image2 core-%02d.jpg`
例子,注意snapshot这个目录必须先创建
`ffmpeg -i live.mp4 -threads 8 -vf select='eq(pict_type\,I)' -vsync 2 -s 960*540 -f image2 ./snapshot/%02d.jpg`
* -i :输入文件，这里的话其实就是视频, 
* -vf:是一个命令行，表示过滤图形的描述, 选择过滤器select会选择帧进行输出：包括过滤器常量 
* pict_type和对应的类型:PICT_TYPE_I 表示是I帧，即关键帧。 
* -vsync 2:阻止每个关键帧产生多余的拷贝 
* -f image2 name_%02d.jpeg:将视频帧写入到图片中，样式的格式一般是: 
* -s:分辨率，1920*1080

5. 生成对应关键帧的参数记录文件(等待完善)
参考格式
`ffprobe -print_format json -show_frames [视频文件] > [保存文件]`
例子
`ffprobe -print_format json -show_frames live.mp4 > index.json`