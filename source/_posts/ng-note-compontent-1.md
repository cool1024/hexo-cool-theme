---
title: angular component note-1
date: 2018-07-06 11:00:46
tags: Angular
categories: Web开发
---
#### 组件描述
1. 组件是Angular应用UI里面的最基本构造块，Angular应用就像一个组件树。

2. 组件是指令的子集。与指令不同, 组件始终具有模板, 并且每个模板中的元素只能实例化一个组件。（指令是可以共存的）

3. 组件必须属于 NgModule 才能由另一个组件或应用程序使用。若要指定组件是 NgModule 的成员, 应在该 NgModule 的可声明类中列出它（declarations）。

4. 注意使用场景，组件除了具有指令的能力还有自己更高级的拓展，但是组件通常是高度封装而且带有模版（类似自己的视图），而指令是轻量而且可以以一种依附的方式增强宿主的‘能力’；我们可以这么理解，在指令群体中，有些指令成长了（变成了组件），可以干很复杂很难的活（比如显示一个日历），有些指令只是专注与某些特定的领域（比如属性指令，给某个元素加个动画），这些指令可以用在组件上，可以任意组合同时在一个组件上。

<!--more-->
#### 一个比较好的关系
组件就是指令，但组件必须有视图。指令可以有视图，也可以没有。

#### 元数据
```typescript
@Component({ 
  changeDetection?: ChangeDetectionStrategy
  viewProviders?: Provider[]
  moduleId?: string
  templateUrl?: string
  template?: string
  styleUrls?: string[]
  styles?: string[]
  animations?: any[]
  encapsulation?: ViewEncapsulation
  interpolation?: [string, string]
  entryComponents?: Array<Type<any> | any[]>
  preserveWhitespaces?: boolean
 
  // inherited from core/Directive
  selector?: string
  inputs?: string[]
  outputs?: string[]
  host?: {...}
  providers?: Provider[]
  exportAs?: string
  queries?: {...}
})
```

animations - 组件动画列表
changeDetection - 此组件使用的更改检测策略，比如我们想行为不要更新视图（优化组件性能）
encapsulation - 此组件使用的样式封装策略（通常我们不会去改动，也不要改）
entryComponents - 动态插入此组件视图的组件列表
**exportAs** - 在模板中导出组件实例的名称
host - 绑定宿主元素的属性，事件（这个通常不建议写，应该直接写在组件类内部，而不是配置参数中）
inputs -  组件可以对外数据绑定的属性列表（这个通常不建议写，同上）
interpolation - 自定义模版输出的格式默认是['{{','}}'],一般没必要改
moduleId - 定义此组件的文件的 ES/CommonJS 模块 id，不写默认就好
outputs - 公开其他人可以订阅的输出事件的类属性名称列表（这个通常不建议写，应该在类内部中写）
**providers** - 组件和他的子级可以使用的服务注册列表
queries - 配置可插入到组件中的查询,对应的ViewChildren,ContentChildren（通常也不会在这里写，应该在类内部中写）
**selector** - 选择器,通常页面不需要选择器，选择器不要重名了
**styleUrls** - 要应用于此组件视图的样式文件url路径（是一个字符串数组）
styles - 组件样式，直接写（不能和styleUrls同时存在，是一个字符串数组）
template - 直接写组建的模版，（是一个字符串数）
**templateUrl** - 组件的模版url路径，（不能和template同时存在，是一个字符串）
viewProviders - 组件和他的 **子级视图** 可以使用的服务注册列表
**preserveWhitespaces** - 保留空格（默认不保留，boolean）

#### 一个简单的组件入门

1. 我们编写了一个进度条组件，它的选择器是app-progress

```typescript
// progress.component.ts

import { Component } from '@angular/core';

@Component({
    selector: 'app-progress',
    template: `
    <div class="progress">
        <div class="progress-bar" style="width:50%;"></div>
    </div>`,
    styles: [`
        .progress{
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            height: 1rem;
            overflow: hidden;
            font-size: .75rem;
            background-color: #e9ecef;
            border-radius: .25rem;
        }
        .progress-bar {
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            -webkit-box-orient: vertical;
            -webkit-box-direction: normal;
            -ms-flex-direction: column;
            flex-direction: column;
            -webkit-box-pack: center;
            -ms-flex-pack: center;
            justify-content: center;
            color: #fff;
            text-align: center;
            background-color: #007bff;
            transition: width .6s ease;
        }
    `]
})
export class ProgressComponent {
    
}
```

2. 在app.module.ts中引入这个组件

```typescript
// app.module.ts

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ProgressComponent } from './progress.component';

@NgModule({
    declarations: [
        AppComponent,
        ProgressComponent,
    ],
    imports: [
        BrowserModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
```

3. 在app.component.html中使用它

```html
<!-- app.component.html -->
<app-progress></app-progress>
```
![进度条](/images/ng-note-component/progress.png)

#### 使用@Input让组件可以通过属性进行数据绑定
上面写的进度条是固定50%的，然而实际使用我们需要不断的变化进度，这个时候就需要让组件可以接受外部传递的进度

a. 使用ngStyle指令绑定width样式，可以根据绑定的值不断变幻width
```html
<!-- progress.component.ts(template) -->
<div class="progress">
    <div class="progress-bar" [ngStyle]="{width: value + '%' }"></div>
</div>
```
```typescript
export class ProgressComponent {
    
    value:number;

    construct(){
        // 默认进度条进度为0
        this.value = 0;
    }
}
```

b. 这个时候我们在progress组件内部修改value的值（0-100）,进度条会跟着变化。

c. 给value加上@Input装饰器，让它可以进行属性的数据绑定
```typescript
export class ProgressComponent {

    @Input() value: number;

    construct() {
        // 默认进度条进度为0
        this.value = 0;
    }
}
```

d. 修改app.component.html,给进度条加上value属性并赋值50，我们可以看到和之前截图一样的进度条

```html
<!-- app.component.html -->
<app-progress value="50"></app-progress>
```

e. 把`value="50"`改为绑定模式，让进度条动起来
```html
<!-- app.component.html -->
<app-progress [value]="progressValue"></app-progress>
```
```typescript
// app.component.ts
export class AppComponent {

    progressValue: number;

    constructor() {
        this.progressValue = 0;
        setInterval(() => {
            if (++this.progressValue > 100) {
                this.progressValue = 0;
            }
        }, 100);
    }
}
```
![进度条](/images/ng-note-component/progress.gif)

#### 使用ng-content将宿主元素的子节点投影到模板中的指定位置
a. `<app-progress></app-progress>`就是组件的宿主元素
b. 通常我们在`<app-progress></app-progress>`标签内部写任何模版都是不能渲染出来的，如：
```html
<app-progress [value]="progressValue">
    {{progressValue}}%
</app-progress>
```
我们并不能看到进度条里面有显示progressValue的值
c. 在组件模版中加入`<ng-content>`标签，你将会发现progressValue出现了(要想让标签内的元素显示必须给它一个投影位置，这个位置就是`<ng-content>`所在的地方)
```html
<!-- progress.component.ts(template) -->
<div class="progress">
    <div class="progress-bar" [ngStyle]="{width: value + '%' }">
        <ng-content></ng-content>
    </div>
</div>
```
![进度条](/images/ng-note-component/progress-value.png)
<div class="tip">相关参考文档地址
https://angular.cn/api/core/Component
代码下载
<a href="/codes/component-simple-1.zip">component-simple-1.zip</a>
</div>

