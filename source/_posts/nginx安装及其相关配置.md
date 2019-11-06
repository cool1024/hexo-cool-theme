---
title: nginx安装及其相关配置
date: 2018-08-08 17:36:54
tags: nginx
---

#### 安装nginx服务器

1.执行 `apt-get install nginx`

2.安装结束后：浏览器中可以访问 http://127.0.0.1(以服务器实际ip为准)) 出现nginx默认页面
> 注意：80号端口不能被占用，通常情况下，有的系统默认安装好了apache服务器，这会与nginx的端口产生冲突

3.常用操作

* 重启：`nginx -s reload`
* 关闭：`nginx -s stop`
* 启动：`nginx`

#### 配置参数(window系统)
```conf
    #使用CPU核心数目
    worker_processes  4;

    #错误日志存放目录
    error_log    logs/error.log;  

    #pid文件目录
    pid             logs/nginx.pid;       

    events {
        #最大并发连接数
        worker_connections  1024;             
    }

    #设置http服务器
    http{

        #include 指令为把文件包含进来，此处等价于直接把mime.types文件内容复制到此处,注意文件路径
        include mime.types;

        default_type  application/octet-stream;

        #访问记录配置
        access_log  logs/access.log  main;

        #开启sendfile功能，服务器协助推送文件
        sendfile on;

        #连接超时时间
        keepalive_timeout  65;

        #使用gzip压缩
        gzip  on;

        #http站点，一个http服务可以有多个server
        server{

            #监听80端口
            listen 80;

            #服务名称
            server_name  localhost;

            #服务器编码，影响页面访问编码，不设置为默认系统编码（一般不设置）
            charset utf-8;

            #默认请求设置
            location / {

                #网站根目录
                root   E:/www/html;

                #主页设置
                index  index.html index.htm;
            }
            #错误页面设置，可使用自定义错误页面
            error_page   404              /404.html;
            error_page   500 502 503 504  /50x.html;
            location = /50x.html {
                root   html;
            }

            #PHP 脚本请求配置，转发到FastCGI处理
            location ~ \.php$ {

                #网站根目录
                root                 E:/HTML/public;
                #默认配置，请确保系统安装好了PHP
                fastcgi_pass    127.0.0.1:9000;
                fastcgi_index   index.php;
                fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
                include            fastcgi_params;
            }
        }
        #第二个站点
         server{

             #使用8000端口
             listen       8000;

             #服务名称
             server_name  server_2;

            #默认请求设置
            location / {
                root   E:/www_2/html;
                index  index.html index.htm;
            }

            #其它配置可以参考第一个server
         }
    }
```

#### 查看访问日志文件: access.log（windows系统)

```conf
#所有对服务器的请求都会记录在access.log中

# 服务器IP--[访问时间] -“请求对象描述”
127.0.0.1 - - [17/Nov/2016:11:56:29 +0800] "GET / HTTP/1.1" 500 193 "-" ""
```

#### 查看error/notice日志文件: error.log（windows系统)

```
#失败的请求，服务器错误，启动记录都会在文件中记录
...内容略...
```

#### ubuntu16.04 环境配置
1. 站点配置目录`/etc/nginx/site-enable`
2. 全局配置 `/etc/nginx/nginx.conf`(开启gzip)
3. 其它相关公共配置`/etc/nginx/snippets/snakeoil.conf`(https)

##### https部署---默认http跳转到https
```conf
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name _;
    location / {
        rewrite ^(.*)$ https://$host$request_uri permanent;
    }
}
```
##### https部署---https服务器校验
```conf
location /.well-known/acme-challenge {
    alias /tmp/acme-wellknown;
}
```
##### https部署---克隆证书获取工具
1. [Let's Encrypt](https://letsencrypt.org)
2. [Dehydrated](https://github.com/lukas2511/dehydrated)