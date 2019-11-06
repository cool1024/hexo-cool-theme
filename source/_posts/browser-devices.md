---
title: 几种浏览器能力记录
date: 2019-04-22 17:21:12
tags: html
categories: Web开发
---

#### 音频播放
```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>媒体播放</title>
</head>

<body>
    <button onclick="play()">播放</button>
</body>
<script>

    const audio = new Audio();

    function play() {
        audio.pause();
        audio.src = 'https://hello1024.oss-cn-beijing.aliyuncs.com/mssage.mp3';
        audio.play();
    }

</script>

</html>
```

#### 录音
```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>录音</title>
</head>

<body>
    <button onclick="startRecord()">录音</button>
    <button onclick="endRecord()">结束</button>
</body>
<script>

    const constraints = {
        audio: true,
    };

    const recordDatas = [];

    let mediaRecorder;

    navigator.mediaDevices.getUserMedia(constraints)
        .then(function (stream) {

            mediaRecorder = new MediaRecorder(stream);

            // 每次录到数据执行
            mediaRecorder.ondataavailable = function (e) {
                recordDatas.push(e.data);
            }

            // 录音结束，生成录音数据对象
            mediaRecorder.onstop = function () {
                const blob = new Blob(recordDatas, { 'type': 'audio/ogg; codecs=opus' });
                console.log(blob);
            }
        })
        .catch(function (err) {
            console.log('The following error occurred: ' + err);
        });

    function startRecord() {
        mediaRecorder && mediaRecorder.start();
    }

    function endRecord() {
        mediaRecorder && mediaRecorder.stop();
    }
</script>

</html>
```

#### 摄像头获取

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>媒体播放</title>
</head>

<body>

</body>
<script>

    const constraints = {
        audio: true,
        video: { width: 1280, height: 720 }
    };

    navigator.mediaDevices.getUserMedia(constraints)
        .then(function (stream) {
            const video = document.createElement('video');
            video.srcObject = stream;
            video.width = 600;
            video.controls = true;
            document.body.appendChild(video);
        })
        .catch(function (err) {
            console.log('The following error occurred: ' + err);
        });
</script>

</html>
```

#### 打印
```js
doPrint() {
    const htmlStr = document.querySelector('.table').parentElement.innerHTML;
    const htmlStr = `<div>...</div>`;
    const frame = window.document.createElement('iframe');
    frame.style.display = 'none';
    window.document.body.appendChild(frame);
    frame.contentWindow.document.write(htmlStr);
    frame.contentWindow.print();
    window.document.body.removeChild(frame);
}
```
#### 音频解析
```js
// 音频播放相关数据对象
const audioContext = new AudioContext();
const audioSource = audioContext.createBufferSource();
const audioAnalyser = audioContext.createAnalyser();

// 读取音频文件为ArrayBuffer
const file = ....音频文件...;
const reader = new FileReader();
reader.readAsArrayBuffer(file);
reader.onload = function(){
    byteToAudio(event.target.result)
}

// 把ArrayBuffer转换为音频数据
function byteToAudio(byteArrys) {
    audioContext.decodeAudioData(byteArrys, startPlay, errorFunc);
}

// 开始播放
function startPlay(buffer){
    audioSource.buffer = buffer;
    audioSource.connect(audioAnalyser);
    audioAnalyser.connect(audioContext.destination);
    audioSource.start();
    setTimout(()=>{
        const array = new Uint8Array(audioAnalyser.frequencyBinCount);
        audioAnalyser.getByteFrequencyData(array);
        // 打印音频数据
        console.log(array);
    },1000);
  }
}
```
