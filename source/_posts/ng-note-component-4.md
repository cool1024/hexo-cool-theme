---
title: angular component note 4
date: 2018-07-13 17:11:00
tags: Angular
categories: Web开发
---
#### 获取模版上的组件实例
通常，在一个页面组件的模版中有使用了很多组件，我们只需要通过组件暴露的事件和属性来改变或监视它们。但是偶尔我们也或少会遇到需要直接操作这个组件的实例情况（调用组件内部的方法，获取dom节点）

#### 原生做法
在传统的html页面中我们可以通过使用`getElementBy[XXXX]`这类方法来获取页面上的元素节点
```html
<div id="dom"></div>
<script>
    document.getElementById('dom');
</script>
```

#### 使用@ViewChild
```html
<div #dom></div>
```
我们使用模版语法`#变量名`让dom变量和div绑定了（#dom类似id="dom"）
```typescript
import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {

    @ViewChild('dom') divElementRef: ElementRef;

    ngAfterViewInit() {
        // 我们可以从控制台看到这个div节点
        console.log(this.divElementRef.nativeElement);
    }
}
```
1.使用ViewChild装饰器修饰一个变量，装饰器内部提供一个从模版中获取组件的参照（这里使用了一个字符串‘dom’,代表从模版中找到被临时变量dom依附的组件）
2.只有在模版被成功渲染到页面的时候才能获取到这个div（视图加载完成）
3.得益于es6的set,get,我们不一定要在视图加载成功时获取这个节点，我们可以在`divElementRef`被设置的时候获取它
```typescript
import { Component, ViewChild, ElementRef } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {

    @ViewChild('dom')
    set divElementRef(elementRef: ElementRef) {
        console.log(elementRef.nativeElement);
    }

}
```

#### 获取模版中的子组件
我们写了一个简单的子组件
```typescript
import { Component, ViewChild, ElementRef } from '@angular/core';

@Component({
    selector: 'app-child',
    template: '<div>{{title}}</div>',
})
export class ChildComponent {
    title: string;
}

```
在app.compontent.html使用这个组件
```html
<!--app.component.html-->
<app-child></app-child>
```
在app.component.ts获取这个子组件的实例
```typescript
import { Component, ViewChild, ElementRef } from '@angular/core';
import { ChildComponent } from './child.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {

    @ViewChild(ChildComponent)
    set divElementRef(child: ChildComponent) {
        child.title = '我要给你设置标题';
    }

}
```
和上面获取`div`的方式有些不同,我们直接使用了`ChildComponent`指定我们要获取的是ChildComponent组件。当然我们依然可以使用获取`div`的方式捕获这个组件，代码如下
```html
<!--app.component.html-->
<app-child #dom></app-child>
```
```typescript
import { Component, ViewChild, ElementRef } from '@angular/core';
import { ChildComponent } from './child.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {

    @ViewChild('dom')
    set divElementRef(child: ChildComponent) {
        child.title = '我要给你设置标题';
    }

}
```

#### @ViewChildren获取多个组件
上面的例子是特别的，因为模版中只有一个这个组件。但是在很多情况下我们可能会使用大量的相同组件，这时候我们如果想批量操作这些组件，就需要使用`@ViewChildren`了。
修改子组件，把title变为可绑定的属性
```typescript
import { Component, ViewChild, ElementRef, Input } from '@angular/core';

@Component({
    selector: 'app-child',
    template: '<div>{{title}}</div>',
})
export class ChildComponent {
    @Input() title: string;
}
```
使用`ngFor`批量输出子组件
```html
<app-child *ngFor="let title of childrenTitle" [title]="title"></app-child>
```
```typescript
import { Component, ViewChildren, QueryList } from '@angular/core';
import { ChildComponent } from './child.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {

    childrenTitle: string[];

    @ViewChildren(ChildComponent)
    set children(queryList: QueryList<ChildComponent>) {
        console.log(queryList.length);
    }

    constructor() {
        this.childrenTitle = [];
        setInterval(() => {
            this.childrenTitle.push('标题');
        }, 1000);
    }
}
```
我们1秒给标题列表中新增一个元素，观察控制台`queryList`的长度一直在增长；这完全是set功劳（每次children的值改变了，它就会执行对应的方法体）。
为什么我们不直接通过`child.title='标题'`来设置子组件的标题呢？如果你那么做了，你可能会发现控制台出现这样的报错:
![viewchildren-error.png](/images/ng-note-component/viewchildren-error.png)
通常直接改组件实例来改变组件的试图输出不是一个特别好的习惯，我们应该是修改组件对外暴露的属性来改变组件的输出视图，至于这个报错，我们后面的文章再讨论。

#### @ContentChild获取组件内部包裹的内容
请注意`ContentChild`和`ViewChild`的区别，`ViewChild`获取的是组件视图模版中的元素，而`ContentChild`获取的是组件包裹的内容。我们重新观察下ChildComponent，如果我们想获取template中的div，我们需要使用`ViewChild`。
```typescript
import { Component, ViewChild, ElementRef, Input } from '@angular/core';

@Component({
    selector: 'app-child',
    template: '<div>{{title}}</div>',
})
export class ChildComponent {
    @Input() title: string;
}
```
而如果我们在app.component.html中使用了这个子组件，并且在标签中写了一个div，我们要在ChildComponent代码中获取它就需要使用`ContentChild`了
```html
<!--app.component.html-->
<app-child>
    <div #dom>你好我是ChildComponent的内容</div>
</app-child>
```
我们想在ChildComponent中获取这个div就使用`ContentChild`（注意这里是ChildCompontent，不是AppComponent）
```typescript
import { Component, ElementRef, Input, ContentChild } from '@angular/core';

@Component({
    selector: 'app-child',
    template: '<div>{{title}}</div>',
})
export class ChildComponent {
    @Input() title: string;
    @ContentChild('dom')
    set divElementRef(elementRef: ElementRef) {
        console.log(elementRef.nativeElement);
    }
}
```
控制台我们可以看到打印出了这个div
![viewchildren-error.png](/images/ng-note-component/child-content.png)

#### @ContentChildren
和@ViewChildren类似，是用于批量获取的，这里就不在说明了

<div class="tip">相关参考文档地址
https://angular.cn/api/core/ContentChild

1. 如果出现多个匹配的子组件`ViewChild`会如何抉择？
通常有多个我们使用`ViewChildren`,而`ViewChild`会获取最先遇到的那一个（通常是最前面的），为了避免得到错误的对象，我们使用`#变量`进行编号可以指定获取想要的。

代码下载
<a href="/codes/component-simple-4.zip">component-simple-4.zip</a>
</div>

