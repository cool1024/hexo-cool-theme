---
title: nginx flv 支持
date: 2019-01-03 14:21:50
tags: ['nginx','flv']
---

### 中文文档地址
http://www.nginx.cn/doc/optional/flv.html

### nginx更高版本安装
1. 添加源
```sh
echo deb http://nginx.org/packages/ubuntu/ trusty nginx >> /etc/apt/sources.list

echo deb-src http://nginx.org/packages/ubuntu/ trusty nginx >> /etc/apt/sources.list
```
2. 添加key
```sh
wget http://nginx.org/keys/nginx_signing.key && apt-key add nginx_signing.key
```

3. 更新并安装
```sh
apt-get update

apt-get install nginx
```

### nginx配置（1.4.2版本及以上)

说明: 本模块必需在编译nginx时加上--with-http_flv_module.

```conf
location ~ \.flv$ {
    flv;
}
```

### 测试
1. flv.js [github地址](https://github.com/Bilibili/flv.js) [测试地址](http://bilibili.github.io/flv.js/demo/)
需要注意浏览器的跨域问题，可以在safari开发者选项设置关闭跨域检查
2. ijkplayer [GitHub地址](https://github.com/Bilibili/ijkplayer)
Android参考代码
```java
package com.example.cool1024.android_example.fragments;


import android.app.Activity;
import android.os.Bundle;
import android.support.annotation.NonNull;
import android.support.v4.app.Fragment;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.SurfaceHolder;
import android.view.SurfaceView;
import android.view.View;
import android.view.ViewGroup;

import com.example.cool1024.android_example.R;

import java.io.IOException;

import tv.danmaku.ijk.media.player.IMediaPlayer;
import tv.danmaku.ijk.media.player.IjkMediaPlayer;

/**
 * B站播放器演示.
 */
public class FlvFragment extends Fragment implements SurfaceHolder.Callback{

    public final static String TAG = "FlvFragmentLog";
    private IjkMediaPlayer mIjkMediaPlayer;
    private SurfaceView mPlayView;
    private PlayListener mPlayListener = new PlayListener();

    private void preparePlayer() {
        mIjkMediaPlayer = new IjkMediaPlayer();
        IjkMediaPlayer.native_setLogLevel(IjkMediaPlayer.IJK_LOG_DEBUG);
        mIjkMediaPlayer.setOnPreparedListener(mPlayListener);
        mIjkMediaPlayer.setOnSeekCompleteListener(mPlayListener);
        mIjkMediaPlayer.setOnBufferingUpdateListener(mPlayListener);

        try {
            mIjkMediaPlayer.setDataSource("http://192.168.1.117/live.flv");
            mIjkMediaPlayer.setDisplay(mPlayView.getHolder());
            mIjkMediaPlayer.prepareAsync();
        } catch (IOException e) {
            e.printStackTrace();
            Log.d(TAG, "视频取流失败");
        }
    }

    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        View mainView = inflater.inflate(R.layout.fragment_flv, container, false);
        mainView.findViewById(R.id.log_btn).setOnClickListener(FlvFragment.this);
        mPlayView = mainView.findViewById(R.id.play_view);
        mPlayView.getHolder().addCallback(FlvFragment.this);
        return mainView;
    }

    // 
    // SurfaceHolder.Callback
    //

    @Override
    public void surfaceCreated(SurfaceHolder holder) {

    }

    @Override
    public void surfaceChanged(SurfaceHolder holder, int format, int width, int height) {
        preparePlayer();
    }

    @Override
    public void surfaceDestroyed(SurfaceHolder holder) {

    }

    // 
    // 播放器相关回调监听
    //


    class PlayListener implements IMediaPlayer.OnPreparedListener,
            IMediaPlayer.OnSeekCompleteListener, IMediaPlayer.OnBufferingUpdateListener {
        @Override
        public void onPrepared(IMediaPlayer iMediaPlayer) {
            Log.d(TAG, "视频准备就绪，开始播放");
            iMediaPlayer.start();
        }

        @Override
        public void onSeekComplete(IMediaPlayer iMediaPlayer) {
            Log.d(TAG, "视频跳转成功");
        }

        @Override
        public void onBufferingUpdate(IMediaPlayer iMediaPlayer, int i) {
            Log.d(TAG, "缓冲更新");
        }
    }
}

```

### 总结
1. 视频可以随意切换播放进度，但是大视频会卡顿，切换进度过大也会卡顿。
2. 需要事先把媒体文件转换为flv格式，可以使用ffmpeg
`ffmpeg -i live.mp4 -vcodec libx264 -c:a aac live.flv`
3. 需要关键帧数据
`ffmpeg -i live.mp4 -vcodec libx264 -c:a aac -flvflags add_keyframe_index live.flv`
4. ffserver也支持，当是这个模块已经从ffmpeg仓库中移除