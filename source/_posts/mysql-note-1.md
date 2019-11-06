---
title: mysql基础配置
date: 2018-08-13 11:44:30
tags: mysql
categories: 数据库
---

#### MySQL  日常操作 (Linux) - 测试环境 Ubuntu 16.0.4 - 版本 mysql  Ver 14.14 Distrib 5.5.54

1.查看 MySQL 版本 ，执行： mysql -V

2.关闭 mysql，可用下列2种方法 
a. 执行： msyqladmin stop -u root -p 然后输入密码即可
b. 执行 ：/etc/init.d/mysql stop

3.启动 mysql 执行： /etc/init.d/mysql start

4.重启 mysql 执行：/etc/init.d/mysql reload --好像没用了
   或者 /etc/init.d/mysql restart (注意，重启要几秒时间)

5.查看 mysql 监听的端口&地址
执行：netstat   -nutlp|grep mysql

（允许外网访问-所有ip）:监听了本机所有的IP
`tcp         0          0.0.0.0:3306          0.0.0.0:*            LISTEN`

（允许内网访问-所有ip）:仅监听本地端口，外网无法访问
`tcp         0          127.0.0.1:3306          0.0.0.0:*          LISTEN`

（允许外网访问-指定ip）:只允许指定的 IP 192.168.0.111 访问数据库
`tcp         0          0.0.0.0:3306          192.168.0.111:*      LISTEN`

6.修改mysql监听端口&地址---运行外网访问--远程访问数据库第一步
a.mysql 配置文件 /etc/mysql/my.cnf	
b.编辑此文件 vi /etc/mysql/my.cnf
找到此行
bind-address           =127.0.0.1
修改为
bind-address           =0.0.0.0
或注释
#bind-address          =127.0.0.1

7.添加一个可以远程连接的账号
a.root身份登入： mysql -u root -p ，然后输入密码
b.创建用户格式：grant 权限 on 数据库名称.表名称 to 用户名@'%' identified by '密码';
c.立即刷新权限表：flush privileges

例子：
a.添加|覆盖|修改zhangsan用户（可远程访问）,给予他所有数据库的所有权限,并设置其密码为				123456789
grant all on \*.\* to zhangsan@'%' identified by '123456789';
      
b.常用权限 select,update,delete, ,create,drop,index,alter,grant,references特殊权限，一般不赋予(FILE、PROCESS、RELOAD和SHUTDOWN)

c.移除权限：remove 权限 on 数据库名称.表名称 from 用户名称

8.常用数据库管理工具 MySQL  Workbeach

