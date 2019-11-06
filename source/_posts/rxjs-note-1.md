---
title: RxJS笔记
date: 2018-11-28 16:32:00
tags: rxjs
categories: Web开发
---

#### 概览
RxJS 是使用 Observables 的响应式编程的库，它使编写异步或基于回调的代码更容易。
[官方文档](https://rxjs-dev.firebaseapp.com)
<!-- more -->

#### 安装
1. `npm install rxjs`
2. 我们在之webpack-example前项目中安装它

#### 可观察对象（Observable）
1. 很多第三方库可能会在自己的异步耗时方法中返回一个可观察对象用来实时监听完成的进度

####  订阅对象 (Subscription)
什么是订阅？ 订阅是表示可支配资源的对象，通常是Observable的执行。 订阅有一个重要的方法，取消订阅，不带参数，只是处理订阅所持有的资源。 在以前版本的RxJS中，Subscription被称为“Disposable”。

```typescript

// subscription 就是一个返回的订阅对象
const subscription = this.request.get('/user/detail').subscrible(res=>{
    console.log('打印用户信息', res);
});

// 如果我不需要获取消息了，我可以通过使用订阅对象中的unsubscrible()方法取消订阅(如果取消订阅时请求还没完成，那么这个请求如果完成了，我们也收不到消息了)
subscription.unsubscrible();
```

#### 观察者（Observer）
用来接受数据的对象，里面有成功方法（complete），错误方法(error)，接受方法(next)

```typescript
const observer = {

    next : (res) => {
        // 当执行next的时候执行
    }，
    complete : () => {
        // 当执行complete的时候执行
    }，
    error : (errorMsg) => {
        // 当执行error的时候执行
    }
}
};
// 可以作为subscribe的传入参数，作为监听next,complete,error回调通知
this.request.get('/user/detail').subscrible(observer);

// subscribe方法可以有很多写法
this.request.get('/user/detail').subscrible({
    next : (res) => {
        // 当执行next的时候执行
    }，
    complete : () => {
        // 当执行complete的时候执行
    }，
    error : (errorMsg) => {
        // 当执行error的时候执行
    }
});

this.request.get('/user/detail').subscrible(res=>{
    // 这里对应的是next方法内容
});

this.request.get('user/detail').subscrible(
    (res)=>{
        // next 消息
    },
    (errorMsg)=>{
        // error 消息
    },
    ()=>{
        // complete 消息
    }
)
```

#### 内置的生产观察者的方法

1. of 立即执行的观察对象
`of( 要发送的数据：any )`

2. interval 定时发送信号
`intervel( 间隔的毫秒数：number )`
```typescript
intervel(1000).subscrible(res=>{
    // 每秒打印一次，依次从0,1,2,3，开始
    console.log(res);
});

// 取消订阅可以终止打印
const subscription = intervel(1000).subscrible(res=>{
    // 每秒打印一次，依次从0,1,2,3，开始
    console.log(res);

    if(满足某种条件时){
        // 如果要取消订阅（终止打印执行了）
        subscription.unsubscrible();
    }
});
```

3. timeout 等待一定时间发送一个数据
`timeout( 等待的毫秒数：number )`
```typescript
timeout(1000).subscrible(res=>{
    // 一秒后输出0
    console.log(res);
});
```

#### 操作符（工具方法）

1. skip(跳过的次数：number) 忽略指定次数的消息
```typescript
intervel(1000).pipe(

    skip(1)

).subscrible(res=>{
    // 第一次输出的0被跳过了
    // 每秒打印一次，依次从1,2,3，开始
    console.log(res);
});
```

2. skipWhile(res=>{ 返回一个true：确认要跳过这个消息,false：不要跳过这个消息 }) 忽略掉我不要的消息
```typescript
this.activatedRoute.paramMap.
        pipe(
            skipWhile(params => !params.has('id'))
        )
        .subscribe(params => {
            // 打印参数id
            console.log(params.key('id'));
        });

```

3. 把当前可观察对象转化成另一个观察对象（替换了之前的可观察对象）
```typescript
this.activatedRoute.paramMap.
        pipe(
            skipWhile(params => !params.has('id')),
            switchMap(params=>{
                const id = params.get('id');
                return this.goodsService.getGoods(id)
            })
        )
        .subscribe(goods => {
            // 打印参数id
            console.log(goods);
        });

```


3. tap(res=>{ 要做的操作，不用返回任何值 }) 
```typescript
intervel(1000).pipe(
    // 我要跳过第一条消息
    skip(1),
    // 每次我这里接受到一条消息我都会做一些事情，不会干扰后面的人
    tap(res=>{

    })
)
.subscrible(res=>{
    // 第一次输出的0被跳过了
    // 每秒打印一次，依次从1,2,3，开始
    console.log(res);
});
```

4. map(res=>{  返回转换好的数据 })  格式化消息内容
```typescript
of({id: 0, name: '张三'}).pipe(

    map(res=>{
        return {
            uid: res.id,
            userName: res.name
        };
    })

).subscrible(res=>{
    // 打印用户信息
    console.log(res);
});
```

5. filter(res=>{ 返回一个true：确认要跳过这个消息,false：不要跳过这个消息 }) 过滤掉不要的消息
```typescript
intervel(1000)
.pipe(
    
    // 我只要大于100的值
    filter(res => {
        return res>=100;
    })

)
.subscrible(res=>{
    // 100,101,102.。。
    console.log(res);
});
```
