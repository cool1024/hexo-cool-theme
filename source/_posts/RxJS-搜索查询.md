---
title: 使用RxJs创建响应式查询
date: 2019-07-14 10:21:40
tags: ["RxJs"]
categories: Web开发
---

## 描述
做一个类似百度搜索框的查询功能,[官方参考文档](https://rxjs-dev.firebaseapp.com/)

事件/数据流图
<img src="/images/rxjs/search.png" width="300">
<!--more-->

相关代码

```html
<input id="search_input" type="text">
<ul id="search_result"></ul>
```

```js
import { of, fromEvent } from 'rxjs';
import { map, switchMap, debounceTime, distinctUntilChanged, delay, tap } from 'rxjs/operators';


/**
 * 返回一个搜索观察对象
 * @param {string} key 搜索关键词
 * @return {Observable<String[]>}
 */
function doSearch(key) {
    return of(['Amsterdam', 'Antwerp', 'Athens', 'Barcelona',
        'Berlin', 'Birmingham', 'Bradford', 'Bremen', 'Brussels', 'Bucharest',
        'Budapest', 'Cologne', 'Copenhagen', 'Dortmund', 'Dresden', 'Dublin',
        'Düsseldorf', 'Essen', 'Frankfurt', 'Genoa', 'Glasgow', 'Gothenburg',
        'Hamburg', 'Hannover', 'Helsinki', 'Kraków', 'Leeds', 'Leipzig', 'Lisbon',
        'London', 'Madrid', 'Manchester', 'Marseille', 'Milan', 'Munich', 'Málaga',
        'Naples', 'Palermo', 'Paris', 'Poznań', 'Prague', 'Riga', 'Rome',
        'Rotterdam', 'Seville', 'Sheffield', 'Sofia', 'Stockholm', 'Stuttgart',
        'The Hague', 'Turin', 'Valencia', 'Vienna', 'Vilnius', 'Warsaw', 'Wrocław',
        'Zagreb', 'Zaragoza', 'Łódź'].filter(item => ~item.indexOf(key)))
        .pipe(
            delay(500), // 延迟半秒模拟网络请求
            tap(results => {
                console.log('接收到响应', results);
            })
        );
}

/**
 * 把查询结果添加到结果列表中
 *  @param {string} item
 */
function appendItem(item) {
    document.getElementById('search_result').innerHTML += '<li>' + item + '</li>';
}

const observable = fromEvent(document.getElementById('search_input'), 'keyup');

observable.pipe(
    // 格式化传递的数据
    map(event => event.target.value),
    // 300秒没有发送数据的化就发送
    debounceTime(300),
    // 忽略相同的数据
    distinctUntilChanged(),
    // 把搜索关键词的观察对象转化成搜索观察对象
    switchMap(value => doSearch(value))
).subscribe(results => {
    document.getElementById('search_result').innerHTML = '';
    results.forEach(item => {
        appendItem(item);
    })
});

```

## 相关函数介绍
* `of` 将参数转换为可观察序列,[详细文档](https://rxjs-dev.firebaseapp.com/api/index/function/of)
![of](/images/rxjs/of.png)
* `fromEvent`从给定事件目标的特定类型的事件创建一个可观察对象（这里使用了input的keyup事件创建）,[详细文档](https://rxjs-dev.firebaseapp.com/api/index/function/fromEvent)
![of](/images/rxjs/fromEvent.png)
**支持的类型事件目标**：
 * DOM EventTarget(addEventListener和removeEventListener)
 * Node.js EventEmitter(addListener和removeListener)
 * JQuery风格的事件目标(on和off)
 * DOM NodeList(DOM节点列表，例如由document.querySelectorAll或返回Node.childNodes)
 * DOM HtmlCollection(就像NodeList一样，它是DOM节点的集合。这里也在每个元素中安装和删除事件处理函数)