---
title: Web Audio (一) 
date: 2019-07-24 19:21:07
tags: ['AudioContext','JavaScript']
categories: WebAPI
---

现代Web浏览器提供了Web Audio API以应对用户对音频多样化的需求，让Web端具备了音频控制能力（音效，降噪，音频分析）;下面几篇文章将使用这些API来编写一些体验例子~
<!-- more -->

# 相关接口介绍

## AudioContext
音频上下文，所有的操作都是围绕这个音频上下文操作的，要使用Web Audio API，第一件事就是构建一个可用的音频上下文（AudioContext）。我们使用AudioContext去创建音频源，然后创建各种音频操作节点并将节点相互连接，组合成我们想要的音频处理方式。更多详情查看[MDN文档](https://developer.mozilla.org/zh-CN/docs/Web/API/AudioContext)

### 音频源
1. **AudioBufferSourceNode**
是存在内存里的音频数据构成的音频源（由一个或多个AudioBuffer构成），每段音频数据可以使用AudioContext.createBuffer()或AudioContext.decodeAudioData()去创建，这种音频源通常是我们自己编写代码进行获取，如获取网络推送的实时音频，出于保密需要播放时进行解析的音频。

2. **MediaElementAudioSourceNode**
由HTML5的`audio`或`video`元素生成的音频源，我们可以使用AudioContext.createMediaStreamSource()进行创建。

3. **MediaStreamAudioSourceNode**
由MediaStream（如网络摄像头或麦克风）生成的音频源。
