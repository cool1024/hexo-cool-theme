---
title: MySQL主从同步
date: 2018-09-28 15:54:03
tags: mysql
categories: 数据库
---

#### 主从同步

一个主数据库（Master），多个从数据库(Slave)。主数据库数据变更同步到下面所有的从服务器。
<!--more-->

#### Master配置--配置文件
1. 开启二进制日志文件(修改/etc/mysql/mysql.conf.d/mysqld.cnf)
2. 给数据库分配一个唯一id
3. 修改完成重启数据库

```conf
[mysqld]
log-bin=mysql-bin
server-id=1
```

#### Master配置--创建一个具有slave权限的远程账号
```sql
GRANT REPLICATION SLAVE ON *.* TO '账号'@'IP地址'
```

#### Master配置--查看Master状态
**注意：File和Position要用于Slave配置**

```sql
show master status;
```
![效果图](/images/mysql/mysql_master_status.png)

#### Slave配置--配置文件
1. 给数据库分配一个唯一id
2. 修改完成重启数据库
```conf
[mysqld]
server-id=2
```

#### Slave配置--设置同步对象（Master）参数
```sql
CHANGE MASTER TO
    MASTER_HOST='主数据库地址，一般为一个ip地址',
    MASTER_USER='Master的链接账号，之前创建好的',
    MASTER_PASSWORD='账号对应的密码',
    MASTER_LOG_FILE='recorded_log_file_name', // 这个就是上面Master查询到的File字段
    MASTER_LOG_POS=recorded_log_position; // 这个就是上面Master查询到的Position
```

#### Slave配置--开启同步
```sql
// 1. 开启
start slave;
// 2. 关闭
stop slave;
```

#### Slave配置--查看同步状态
```sql
show slave status;
```

<div class="tip">参考文档： https://dev.mysql.com/doc/refman/5.7/en/replication-howto-additionalslaves.html
</div>
