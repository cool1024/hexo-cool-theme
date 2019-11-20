---
title: Web Audio (一) 
date: 2019-07-24 19:21:07
tags: ['AudioContext','JavaScript']
categories: WebAPI
---

现代Web浏览器提供了Web Audio API以应对用户对音频多样化的需求，让Web端具备了音频控制能力（音效，降噪，音频分析）;下面几篇文章将使用这些API来编写一些体验例子~
<!-- more -->



# AudioContext
音频上下文，所有的操作都是围绕这个音频上下文操作的，要使用Web Audio API，第一件事就是构建一个可用的音频上下文（AudioContext）。我们使用AudioContext去创建音频源，然后创建各种音频操作节点并将节点相互连接，组合成我们想要的音频处理方式。更多详情查看[MDN文档](https://developer.mozilla.org/zh-CN/docs/Web/API/AudioContext)

## 音频源

1. **AudioBufferSourceNode**
是存在内存里的音频数据构成的音频源（由一个或多个AudioBuffer构成），每段音频数据可以使用AudioContext.createBuffer()或AudioContext.decodeAudioData()去创建，这种音频源通常是我们自己编写代码进行获取，如获取网络推送的实时音频，出于保密需要播放时进行解析的音频。
```js
let audioContext = new AudioContext();
// 声道数，样本帧数（此处x2为两秒的大小），采样率
let buffer = audioContext.createBuffer(2, audioContext.sampleRate * 2, audioContext.sampleRate);
// 随机填充一些数据
for(let channel = 0; channel < 2; channel++){
    bufferData = buffer.getChannelData(channel);
    for(let i = 0; i < (audioContext.sampleRate * 2); i++){
        // 随机填充范围[-1.0; 1.0]的数据
        bufferData[i] = Math.random() * 2 - 1;
    }
}
let audioSource = audioContext.createBufferSource();
audioSource.buffer = buffer;
audioSource.connect(audioCtx.destination);
audioSource.start();
```

2. **MediaElementAudioSourceNode**
由HTML5的`audio`或`video`元素生成的音频源，我们可以使用AudioContext.createMediaStreamSource()进行创建。
```html
<audio id="audio" src="https://wavesurfer-js.org/example/media/demo.wav" controls crossorigin="anonymous"></audio>
<script>
    let audioContext = new AudioContext();
    let audioElement = document.getElementById('audio');
    let audioSource = audioContext.createMediaElementSource(audioElement);
    audioSource.connect(audioContext.destination);
</script>
```

3. **MediaStreamAudioSourceNode**
由MediaStream（如网络摄像头或麦克风）生成的音频源。
```js
navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then(function(stream){
    let audioContext = new AudioContext();
    let audioSource = audioContext.createMediaStreamSource(stream);
    audioSource.connect(audioContext.destination);
    audioSource.start();
}).catch(function(error){
    // error do
});
```

4. **OscillatorNode**
一种随时间变化的波形，比如正弦波形或三角波形。类型是AudioNode，功能是音频处理模块，可以产生指定频率的波形。

## 音效节点

1. **GainNode**
一个音量调节节点，音频输入进入节点可以改变音量，然后输出。

2. **BiquadFilterNode**
一个简单的低频滤波器，可以表示不同种类的滤波器、调音器或图形均衡器，总是只有一个输入和一个输出。

3. **ConvolverNode**
对给定的 AudioBuffer 执行线性卷积，通常用于实现混响效果。

4. **DelayNode**
延迟输出音频。

5. **DynamicsCompressorNode**
提供压缩效果，当多个音频在同时播放并且混合的时候，可以通过它降低音量最大的部分的音量来帮助避免发生削波和失真。

6. **StereoPannerNode**
简单立体声控制节点，用来左右移动音频流。

7. **WaveShaperNode**
对音频进行非线性的扭曲，可以利用曲线来对信号进行扭曲。除了一些效果明显的扭曲，还常被用来给声音添加温暖的感觉。

8. **PeriodicWave**
用来定义周期性的波形，可被用来重塑 OscillatorNode的输出.

### 音频目的地

1. **AudioDestinationNode**
定义了最后音频要输出到哪里，通常是输出到你的扬声器。

2. **MediaStreamAudioDestinationNode**
MediaStream类型的目的地（一个虚拟的输出），我们可以这个接口进行录音或结合WebRTC进行远程通话（可以魔改通话音效）
```js
let audioContext = new AudioContext();
...
...
...
// 创建一个MediaStream目的地
let dest = audioContext.createMediaStreamDestination();
// audioSource是创建的一个麦克风音频源MediaStreamAudioSourceNode
audioSource.connect(dest);
// 执行相关录音操作
let mediaRecorder = new MediaRecorder(dest.stream);
...
...
```

## 数据分析

**AnalyserNode**
我们可以创建一个AnalyserNode来进行实时频率分析与时域分析，这些分析数据可以用做数据分析和可视化。

## 分离、合并声道

**ChannelSplitterNode**
把输入流的每个声道输出到一个独立的输出流。

**ChannelMergerNode**
把一组输入流合成到一个输出流。输出流的每一个声道对应一个输入流。

# AudioNode
处理音频的通用模块，在音频上下文中处理，可以使音源结点（提供声音数据），音频输出（音频目的地），中间处理模块（音效，分析器）；一个AudioNode 既有输入也有输出。输入与输出都有一定数量的通道。只有一个输出而没有输入的 AudioNode 叫做音频源。更多详情查看[MDN文档](https://developer.mozilla.org/zh-CN/docs/Web/API/AudioNode)


# 使用例子
1. 结合WebGL技术实现音频可视化
2. 播放器
3. 语音推送
4. 录音机