---
title: angular component note-3
date: 2018-07-11 09:26:34
tags: Angular
categories: Web开发
---

##### 组件递归
当我们在组件的模版中写了符合组件本身选择器的元素时，组件就会出现递归
```typescript
@Component({
    selector: 'app-ul',
    template: `
    <ul>
        <li>
            节点标题
            <app-ul></app-ul>
        </li>
    </ul>
    `
})
```
我们观察上面组件的元数据，其中模版出现了app-department-ul节点，这个符合组件本身的选择器，这里出现了递归了，如果运行代码，我们会发现浏览器很多嵌套的输出（出现无限递归，angular自带的模版解析器会终止这种行为，大部分浏览器也会终止递归调用，都设置有最大嵌套数量）
![效果图](/images/ng-note-component/app-ul.png)
![效果图](/images/ng-note-component/app-ul-error.png)

##### 设计递归数据结构-节点

```typescript
/**
 * 一个节点
 */
export interface Node {
    // 节点数据
    data: any;
    // 子级节点（多个）
    childNodes: Node[];
}
```

##### 把节点作为组件的数据绑定
```typescript
import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-ul',
    template: `
    <ul>
        <li>
            {{node.data | json}}
            <app-ul *ngFor="let item of node.childNodes" [node]="item"></app-ul>
        </li>
    </ul>
    `
})
export class AppUlComponent {

    @Input() node: Node;
}
```
在app.component.ts中定义一个根结点，然后使用`<app-ul></app-ul>`;
```typescript
import { Component } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {

    rootNode = {
        data: { title: '根节点' },
        childNodes: [
            {
                data: { title: '一级节点-1' },
                childNodes: [
                    {
                        data: { title: '二级节点-1-1' },
                        childNodes: []
                    }
                ]
            },
            {
                data: { title: '一级节点-2' },
                childNodes: [
                    {
                        data: { title: '二级节点-2-1' },
                        childNodes: []
                    },
                    {
                        data: { title: '二级节点-2-2' },
                        childNodes: [
                            {
                                data: { title: '三级节点-2-2-1' },
                                childNodes: []
                            }
                        ]
                    }
                ]
            }
        ]
    };
}
```
```html
<!--app.component.html-->
<app-ul [node]="rootNode"></app-ul>
```
![效果图](/images/ng-note-component/app-ul-res.png)

##### 事件传递
上面的组件只能显示一个列表，通常情况我们都需要一些其它的操作，比如删除添加修改，这个时候需要让组件可以触发事件如点击
```typescript
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-ul',
    template: `
    <ul>
        <li>
            <div (click)="sendClickEvent(node)">{{node.data | json}}</div>
            <app-ul *ngFor="let item of node.childNodes" [node]="item" (clickEvent)="sendClickEvent($event)"></app-ul>
        </li>
    </ul>
    `
})
export class AppUlComponent {

    @Input() node: Node;

    @Output() clickEvent = new EventEmitter(false);

    /**
     * 发射触发事件的节点
     * @param node 触发点击事件的节点
     */
    sendClickEvent(node: Node) {
        this.clickEvent.emit(node);
    }
}
```
上面代码我们给组件暴露了一个发射事件的属性clickEvent,每次节点的内容被点击的时候就会通过`this.clickEvent.emit(node)`发射事件数据。而为了然递归的组件也可以发送，我们通过他的上级代理发送,上级通过和子节点的clickEvent绑定，发送子节点传递过来的`$event`代理发送数据，如下：
```html
<!-- 这里的node是当前节点自己的node，每次div被点击的时候发射出去 -->
<div ... (click)="sendClickEvent(node)"></div>
<!-- 这里的$event是当子节点自己传过来的数据，每次子节点被点击的时候会传过来，然后被当前节点代理发送出去 -->
<app-ul ... (clickEvent)="sendClickEvent($event)"></app-ul>
```
下面是在app.component.ts中使用代码
```typescript
import { Component } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {

    rootNode = {
        data: { title: '根节点' },
        childNodes: [
            {
                data: { title: '一级节点-1' },
                childNodes: [
                    {
                        data: { title: '二级节点-1-1' },
                        childNodes: []
                    }
                ]
            },
            {
                data: { title: '一级节点-2' },
                childNodes: [
                    {
                        data: { title: '二级节点-2-1' },
                        childNodes: []
                    },
                    {
                        data: { title: '二级节点-2-2' },
                        childNodes: [
                            {
                                data: { title: '三级节点-2-2-1' },
                                childNodes: []
                            }
                        ]
                    }
                ]
            }
        ]
    };

    // 被点击的节点
    activeNode: Node;
}
```
```html
<!--app.component.html-->
<app-ul [node]="rootNode" (clickEvent)="activeNode = $event"></app-ul>
<pre>{{activeNode | json}}</pre>
```
![效果图](/images/ng-note-component/app-ul.gif)

<div class="tip">
1. 使用递归组件要注意何时终止递归（不要出现死循环）
2. 递归可以传递事件，但是我们要阻止冒泡，避免传递的事件无限膨胀（越来越多）
代码下载
<a href="/codes/component-simple-3.zip">component-simple-3.zip</a>
</div>
