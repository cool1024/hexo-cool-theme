---
title: angular component note-2
date: 2018-07-06 14:06:49
tags: Angular
categories: Web开发
---

##### 制作一个简单的开关组件

1. 使用`status`保存开关的状态(true:开，false:关)

2. 使用`ngClass`指令切换开关状态下的不同样式`switch-open`和`switch-close`;

3. 组件代码如下

```typescript
import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-switch',
    template: `
        <span class="switch" [ngClass]="{'switch-open':status,'switch-close':!status}">
            <span class="switch-bar"></span>
        </span>
    `,
    styles: [`
        .switch {
            display: inline-block;
            height: 30px;
            width: 60px;
            border-radius: 18px;
            padding: 2px;
        }
        .switch-bar {
            display: inline-block;
            height: 30px;
            width: 30px;
            border-radius: 15px;
            background-color: white;
        }
        .switch-open {
            background-color: #1f7bfb;
        }
        .switch-close {
            background-color: #ccc;
        }
        .switch-open .switch-bar {
            transition: margin 0.3s linear;
            margin-left: 30px;
        }
        .switch-close .switch-bar {
            transition: margin 0.3s linear;
            margin-left: 0px;
        }
    `]
})
export class SwitchComponent {

    @Input() status: boolean;

    construct() {
        // 默认状态为false，关闭状态
        this.status = false;
    }
}
```
4. 在app.module.ts中引入这个组件

```typescript
// app.module.ts

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { SwitchComponent } from './switch.component';

@NgModule({
    declarations: [
        AppComponent,
        SwitchComponent,
    ],
    imports: [
        BrowserModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
```

5. 在app.component.html中使用它

```html
<!-- app.component.html -->
<app-switch [status]="false"></app-switch>
```
<img src="/images/ng-note-component/switch.png" style="height:40px">

##### 使用click事件绑定，让开关可以点击进行开/关的转换

```html
<!-- switch.component.ts(template) -->
<span class="switch" 
     (click)="changeStatus()" 
     [ngClass]="{'switch-open':status,'switch-close':!status}">
    <span class="switch-bar"></span>
</span>
```
```typescript
export class SwitchComponent {

    @Input() status: boolean;

    construct() {
        // 默认状态为false，关闭状态
        this.status = false;
    }

    /**
     * 变更开关状态
     */
    changeStatus() {
        this.status = !this.status;
    }
}
```
<img src="/images/ng-note-component/switch.gif" style="height:40px">

##### 使用@Output让状态变化传递出去
a. 很多情况，我们希望在开关开启的时候做一些其它相关操作

b. 给组件定义一个输出属性`statusChange`(子组件暴露一个 `EventEmitter` 属性，当事件发生时，子组件利用该属性 `emits`(向上弹射)事件。父组件绑定到这个事件属性，并在事件发生时作出回应。)

```typescript
export class SwitchComponent {

    @Input() status: boolean;

    @Output() statusChange = new EventEmitter<boolean>(false);

    construct() {
        // 默认状态为false，关闭状态
        this.status = false;
    }

    /**
     * 变更开关状态
     */
    changeStatus() {
        this.status = !this.status;

        // 每次状态被改变的时候，我们把状态发射出去
        this.statusChange.emit(this.status);
    }
}
```

c. 修改app.component.html,给开关加上`statuChange`的事件处理方法,$event是关键词指代组件发射过来的值（这里发射过来的是开关的状态false|true）

```html
<!-- app.component.html -->
<app-switch [status]="false" (statusChange)="showMessage($event)"></app-switch>
```
```typescript
// app.component.ts
import { Component } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {

    /**
     * 显示一条消息
     * @param {boolean} status 开关状态
     */
    showMessage(status: boolean) {
        alert(status ? '开灯' : '关灯');
    }
}
```
![进度条](/images/ng-note-component/switch-event.png)

d. 当@Output输出属性名是@Input输入属性+Change时，就会默认组成一对（双向绑定），status和statusChange是一对，那么它们组成了一个双向绑定,可以使用`[(status)]`的形式。当然statusChange依然保留，可以独立使用。
```html
<!-- app.component.html -->
<app-switch [(status)]="switchStatus" (statusChange)="showMessage($event)"></app-switch>
<p>开关状态:{{switchStatus}}</p>
```
```typescript
// app.component.ts
import { Component } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {

    // 开关状态
    switchStatus = false;
    /**
     * 显示一条消息
     * @param {boolean} status 开关状态
     */
    showMessage(status: boolean) {
        alert(status ? '开灯' : '关灯');
    }
}
```
![双向绑定](/images/ng-note-component/switch-event.gif)

<div class="tip">相关参考文档地址
    https://angular.cn/guide/component-interaction
代码下载
<a href="/codes/component-simple-2.zip">component-simple-2.zip</a>
</div>

