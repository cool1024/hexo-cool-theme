---
title: Html Canvas 记录
date: 2019-04-24 16:57:21
tags: canvas
categories: Web开发
---

#### 绘画
```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>画布</title>
</head>

<body>
    <canvas id="canvas" width="600" height="400" style="border:1px solid black;"></canvas>
    <button onclick="unDo()">撤销</button>
</body>
<script>

    // 当前允不允许进行绘画
    var canDraw = false;
    // 记录上一次画笔的坐标
    var panPoint = { x: 0, y: 0 };
    // 历史记录保存数组
    var cacheArray = [];
    // 画布上下文，用于绘画
    var context;

    function initDrawPad() {

        const canvas = document.getElementById('canvas');
        context = this.canvas.getContext('2d');

        // 鼠标按下时，开始绘画
        canvas.addEventListener('mousedown', (event) => {
            canDraw = true;
            panPoint = { x: event.offsetX, y: event.offsetY };
            // 绘画前保存当前的数据
            cacheArray.push(this.canvas.toDataURL());
        });

        canvas.addEventListener('mousemove', (event) => {
            drawLine(panPoint, { x: event.offsetX, y: event.offsetY });
        });

        canvas.addEventListener('mouseup', (event) => {
            this.canDraw = false;
        });

        canvas.addEventListener('mouseleave', (event) => {
            this.canDraw = false;
        });
    }

    function drawLine(startPoint, endPoint) {
        if (canDraw) {
            context.beginPath();
            context.lineJoin = 'round';
            this.context.strokeStyle = '#000000';
            this.context.moveTo(startPoint.x, startPoint.y);
            this.context.lineTo(endPoint.x, endPoint.y);
            this.context.closePath();
            this.context.stroke();
            // 记住画笔的位置
            panPoint = endPoint;
        }
    }

    function unDo() {
        if (cacheArray.length > 0) {
            // 清空画笔
            context.clearRect(0, 0, 600, 400);
            const image = new Image();
            image.src = this.cacheArray.pop();
            image.onload = () => this.context.drawImage(image, 0, 0);
        }
    }

    initDrawPad();

</script>

</html>
```
#### 裁剪
```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>画布-裁剪</title>
</head>

<body>

</body>
<script>

    // {x:0, y:0, w:600, h:400 }
    function clipImage(rect, src, callback) {
        const img = new Image();
        img.src = src;

        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = rect.w;
            canvas.height = rect.h;
            ctx.drawImage(img, -rect.x, -rect.y, img.naturalWidth, img.naturalHeight);
            callback(canvas.toDataURL());
        };
    }

    // {x:0, y:0, w:600, h:400 }
    function clipEllipse(rect, src, callback) {
        const img = new Image();
        img.src = src;

        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = rect.w;
            canvas.height = rect.h;
            const a = rect.w / 2;
            const b = rect.h / 2;
            const r = Math.max(a, b);
            const ratioX = a / r;
            const ratioY = b / r;
            ctx.save();
            ctx.beginPath();
            ctx.arc(a / ratioX, b / ratioY, r, 0, 2 * Math.PI, false);
            ctx.closePath();
            ctx.clip();
            ctx.drawImage(img, -rect.x, -rect.y, img.naturalWidth, img.naturalHeight);
            ctx.restore();
            callback(canvas.toDataURL());
        }
    }

    clipImage(
        { x: 200, y: 200, w: 400, h: 400 },
        'source.jpg',
        (url) => {
            const img = new Image();
            img.src = url;
            document.body.appendChild(img);
        }
    );

    clipEllipse(
        { x: 200, y: 200, w: 400, h: 400 },
        'source.jpg',
        (url) => {
            const img = new Image();
            img.src = url;
            document.body.appendChild(img);
        }
    );




</script>

</html>
```
#### 图片清晰度处理
```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>画布</title>
</head>

<body>
    <img src="source.jpg">
</body>
<script>

    function saveQto(k, src, callback) {
        const img = new Image();
        img.src = src;

        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight);
            callback(canvas.toDataURL('image/jpeg', k));
        };
    }

    saveQto(
        0.01,
        'source.jpg',
        (url) => {
            const img = new Image();
            img.src = url;
            document.body.appendChild(img);
        }
    );

</script>

</html>
```

<!-- #### Live2d
Live2D是一种应用于电子游戏的绘图渲染技术，技术由日本Cybernoids公司开发。通过一系列的连续图像和人物建模来生成一种类似三维模型的二维图像，对于以动画风格为主的冒险游戏来说非常有用，缺点是Live 2D人物无法大幅度转身，开发商正设法让该技术可显示360度图像。 -->