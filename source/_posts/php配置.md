---
title: php配置
date: 2018-08-13 11:51:31
tags: php
---
#### Nginx与PHP常用配置 (Linux) - 测试环境 Ubuntu 16.0.4 -新版本 php7.0


1.新安装的Nginx配置文件 /etc/nginx/site-enbale/default
a.编辑此文件，去掉若干#注释并修改：vi /etc/nginx/site-enable/default
b.结果如下
```conf
server {

    listen 80;

    #网站更目录，存放网页
    root /var/www/html;

    index index.html index.htm index.php;

    server_name localhost;

    location / {

            try_files $uri $uri/ =404;
            #客户端连时可以交互数据的大小
            #主要影响了提交的表单数据量大小，如上传文件，POST大量数据
            #默认为1M,如需要上传大文，可以设为更大
            client_max_body_size    1m;
    }
    location ~ \.php$ {
            #此处默认安装的为php7.0
            #如果安装的是php5，此处改为  fastcgi_pass unix:/var/run/php5-fpm.sock;
            #这只是参考，请注意确认在/var/run/能够看到这个文件php5-fpm.sock
            fastcgi_pass unix:/var/run/php7.0-fpm.sock;

            fastcgi_index index.php;

            fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;

            include fastcgi_params;
    }
}
```

2.php配置文件 /etc/php7.0/fpm/php.ini(根据版本不同有差异，也许是/etc/php5/fpm/php.ini)
a.编辑此文件（如果有必要的，一般不修改）
b.修改示例
// post请求数据最大量，一般的默认为8M，如果需要上传大文件则设置更大
`post_max_size = 20M`

#允许上传文件的最大尺寸，修改此处后必须(post_max_size>upload_max_filesize)
#文件也是POST请求上传的，所以如果post_max_size太小，第一关卡都过不了
`upload_max_filesize = 20M`

#允许上传的最大文件数，一般不修改
`max_file_uploads = 20`
