---
title: MySQL 8
date: 2018-08-21 22:29:44
tags: mysql
categories: 数据库
---

#### MySQL文档存储
MySQL文档存储允许开发人员同时使用关系型数据表结构和不带表结构的JSON数据。为了实现这个功能MySQL提供了X Dev API, 使您能够以快速且自然的使用JSON文档, 从而将一个强大的焦点放在 CRUD 上。这个X协议具有高度可伸缩性, 并针对 CRUD 和 SQL API 操作进行了优化。【CRUD-创建，读取，更新，删除】

##### 灵活
MySQL 文档存储为用户提供了开发传统 SQL 关系应用程序和 NoSQL 无架构文档数据库应用程序的最大灵活性。这样消除了对单独的 NoSQL 文档数据库的需要。开发人员可以在同一数据库中混合和匹配关系数据和 JSON 文档以及相同的应用程序。例如, 可以在同一应用程序中查询两个数据模型, 结果可以是表、表格或 JSON 格式。
![](/images/mysql/mysql_document_store_architecture.png)

##### 高度可靠, 完全一致
MySQL 文档存储为无架构的 JSON 文档提供多文档事务支持和完全 ACID 遵从性。随着 InnoDB 作为文档存储背后的存储引擎, 您可以获得与关系数据相同的数据保证和性能优势。这保证了用户获得数据的可靠性与完整的数据一致性。这也使得 MySQL 文档存储易于管理。

##### 高可用性
mysql 文档存储利用 mysql 组复制和 InnoDB 集群的所有优点来扩展应用程序并实现高可用性。文档在高可用性组的所有成员之间复制, 事务可以跨主机同步。任何一个主机都可以从另一台组件立刻接管事务, 如果失败, 几乎不需要多少响应时间。

##### 在线热备份
正如文档存储利用了组复制和 InnoDB 群集一样, 它也可以透明地与 MySQL 企业备份一起工作。用户可以对文档进行完整、增量和部分备份。所有文档数据都与备份完成时的时间点一致。用户还可以灵活地执行时间点恢复, 以使用 MySQL binlog 恢复到特定事务。

##### 安全
MySQL 和文档存储区是安全的。此外, MySQL 企业版的所有高级安全功能 (如透明数据加密 (TDE)、审核、高级身份验证和防火墙) 都有助于最大限度地提高安全性。

##### 报告和分析
MySQL 文档存储为您提供了执行 CRUD 操作的简单性以及 SQL 从 JSON 文档中提取数据的能力。有关SQL以及所有流行的报告和分析工具都可用。

##### 使用简单
MySQL 文档存储提供了支持多种语言支持的简单且流畅的 CRUD api, 方便开发不同语言的应用程序。

##### 体系结构
MySQL 文档存储体系结构由以下组件组成:

* **Native JSON Document Storage** - MySQL provides a native JSON datatype is efficiently stored in binary with the ability to create virtual columns that can be indexed. JSON Documents are automatically validated.
* **X Plugin** - The X Plugin enables MySQL to use the X Protocol and uses Connectors and the Shell to act as clients to the server.
* **X Protocol** - The X Protocol is a new client protocol based on top of the Protobuf library, and works for both, CRUD and SQL operations.
* **X DevAPI** - The X DevAPI is a new, modern, async developer API for CRUD and SQL operations on top of X Protocol. It introduces Collections as new Schema objects. Documents are stored in Collections and have their dedicated CRUD operation set.
* **MySQL Shell** - The MySQL Shell is an interactive Javascript, Python, or SQL interface supporting development and administration for the MySQL Server. You can use the MySQL Shell to perform data queries and updates as well as various administration operations.
* **MySQL Connectors** - The following MySQL Connectors support the X Protocol and enable you to use X DevAPI in your chosen language.
    * MySQL Connector/Node.js
    * MySQL Connector/PHP
    * MySQL Connector/Python
    * MySQL Connector/J
    * MySQL Connector/NET
    * MySQL Connector/C++