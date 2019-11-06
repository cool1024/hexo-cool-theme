---
title: MySQL 8 Chapter 11 数据类型
date: 2018-11-13 11:10:49
tags: mysql
categories: 数据库
---

### 11.2 数值类型

MySQL支持所有的标准SQL数值数据类型。包括精确的类型（INTEGER，SMALLINT，DECIMAL 和 NUMERIC）,以及近似值（FLOAT，REAL和DOUBLE PRECISION）。关键词INT是INTEGER同义词，关键字DEC和FIXED是DECIMAL的同义词。MySQL将DOUBLE视为DOUBLE PRECISION（非标准扩展）的同义词。 除非启用REAL_AS_FLOAT SQL模式，否则MySQL还将REAL视为DOUBLE PRECISION（非标准变体）的同义词。
<!--more-->

BIT数据类型用于存储位值，并支持MyISAM，MEMORY，InnoDB和NDB表。 有关MySQL如何处理超出范围值到列和溢出的信息，请参见第11.2.6节“超出范围和溢出处理”。

有关数字类型存储要求的信息，请参见第11.8节“数据类型存储要求”。

用于计算数字操作数的结果的数据类型取决于操作数的类型和对它们执行的操作。 有关更多信息，请参见第12.6.1节“算术运算符”。

#### 11.2.1整数类型（精确值） - INTEGER，INT，SMALLINT，TINYINT，MEDIUMINT，BIGINT

MySQL支持SQL标准整数类型INTEGER（或INT）和SMALLINT。 作为标准的扩展，MySQL还支持整数类型TINYINT，MEDIUMINT和BIGINT。 下表显示了每种整数类型所需的存储和范围。

| 类型      | 存储（Bytes） | 最小值（有符号） | 最大值（有符号） | 最小值（无符号） | 最大值（无符号） |
|-----------|---------------|------------------|------------------|------------------|------------------|
| TINYINT   | 1             | -128             | 127              | 0                | 255              |
| SMALLINT  | 2             | -32768           | 32767            | 0                | 65535            |
| MEDIUMINT | 3             | -8388608         | 8388607          | 0                | 16777215         |
| INT       | 4             | -2147483648      | 2147483647       | 0                | 4294967295       |
| BIGINT    | 5             | -263             | 263-1            | 0                | 264-1            |

#### 11.2.2定点类型（精确值） - DECIMAL，NUMERIC

DECIMAL和NUMERIC类型存储精确的数字数据值。 在保持精确精度很重要时使用这些类型，例如使用货币数据。 在MySQL中，NUMERIC实现为DECIMAL，因此以下有关DECIMAL的备注同样适用于NUMERIC。
MySQL以二进制格式存储DECIMAL值。 请参见第12.23节“精确算术”。

在DECIMAL列声明中，可以（通常是）指定精度和标度; 对于
例：
```SQL
salary DECIMAL(5,2)
```
在这个例子中，5是精度，2是刻度。 精度表示为值存储的有效位数，刻度表示小数点后可存储的位数。

标准SQL要求DECIMAL(5,2)能够存储五位数和两位小数的任何值，因此可以存储在salary列中的值的范围是-999.99到999.99。

在标准SQL中，语法DECIMAL（M）等同于DECIMAL（M，0）。 类似地，语法DECIMAL等同于DECIMAL（M，0），其中允许实现决定M的值.MySQL支持这两种DECIMAL语法的变体形式。 M的默认值为10。

#### 11.2.3浮点类型（近似值） - FLOAT，DOUBLE

FLOAT和DOUBLE类型表示近似数值数据值。 MySQL对于单精度值使用四个字节，对于双精度值使用八个字节。

对于FLOAT，SQL标准允许在关键字FLOAT的括号中选择性地指定精度（但不是指数的范围）。 MySQL还支持此可选的精度规范，但精度值仅用于确定存储大小。 精度从0到23会产生一个4字节的单精度FLOAT列。 从24到53的精度产生8字节双精度DOUBLE列。

MySQL允许非标准语法：FLOAT（M，D）或REAL（M，D）或DOUBLE PRECISION（M，D）。 这里，（M，D）表示可以存储的值总共最多为M位，其中D位可以在小数点之后。 例如，定义为FLOAT（7,4）的列在显示时将显示为-999.9999。 MySQL在存储值时执行舍入，因此如果将999.00009插入FLOAT（7,4）列，则近似结果为999.0001。

由于浮点值是近似值而未存储为精确值，因此尝试在比较中将它们视为精确值可能会导致问题。 它们还受平台或实现依赖性的影响。 有关更多信息，请参见第B.5.4.8节“浮点值的问题”

为了获得最大的可移植性，需要存储近似数值数据值的代码应使用FLOAT或DOUBLE PRECISION，而不指定精度或位数。

#### 11.2.4比特值类型 - BIT

BIT数据类型用于存储位值。 BIT（M）指代允许存储M位值。 M的范围为1到64。

要指定位值，可以使用b'value'表示法。 value是使用零和1写的二进制值。 例如，b'111'和b'10000000'分别代表7和128。 请参见第9.1.5节“位值文字”。

如果为BIT（M）列分配一个小于M位长的值，则该值将在左侧用零填充。 例如，将b'101'的值分配给BIT（6）列实际上与分配b'000101'相同。

**NDB集群**。 给定NDB表中使用的所有BIT列的最大组合大小不得超过4096位。

#### 11.2.5 数字类型属性

MySQL支持扩展，可以选择在类型的base关键字后面的括号中指定整数数据类型的显示宽度。 例如，INT（4）指定显示宽度为四位的INT。 应用程序可以使用此可选显示宽度来显示宽度小于为列指定的宽度的整数值，方法是用空格填充它们。 （也就是说，此宽度存在于使用结果集返回的元数据中。是否使用它取决于应用程序。）


显示宽度不会限制可以存储在列中的值的范围。 它也不会阻止比列显示宽度更宽的值正确显示。 例如，指定为SMALLINT（3）的列的通常SMALLINT范围为-32768到32767，超过三位数允许的范围之外的值将使用三位数以上的方式完整显示。

与可选（非标准）属性ZEROFILL结合使用时，默认的空格填充将替换为零。 例如，对于声明为INT（4）ZEROFILL的列，将值5检索为0005。

<div class="tip">**注意**
当表达式或UNION查询中涉及列时，将忽略ZEROFILL属性。如果将大于显示宽度的值存储在具有ZEROFILL属性的整数列中，则在MySQL为某些复杂连接生成临时表时可能会遇到问题。 在这些情况下，MySQL假定数据值符合列显示宽度。
</div>

所有整数类型都可以具有可选（非标准）属性UNSIGNED。 无符号类型可用于仅允许列中的非负数或当您需要更大的列的上限数字范围时。 例如，如果INT列为UNSIGNED，则列的范围大小相同，但其端点从-2147483648和2147483647更改为0和4294967295。

浮点和定点类型也可以是UNSIGNED。 与整数类型一样，此属性可防止负值存储在列中。 与整数类型不同，列值的上限范围保持不变。

如果为数字列指定ZEROFILL，MySQL会自动将UNSIGNED属性添加到列中。

整数或浮点数据类型可以具有附加属性AUTO_INCREMENT。 将值NULL插入索引的AUTO_INCREMENT列时，该列将设置为下一个序列值。 通常，这是值+ 1，其中value是表中当前列的最大值。 （AUTO_INCREMENT序列以1开头。）

将0存储到AUTO_INCREMENT列与存储NULL具有相同的效果，除非启用了NO_AUTO_VALUE_ON_ZERO SQL模式。

插入NULL以生成AUTO_INCREMENT值需要将列声明为NOT NULL。 如果列声明为NULL，则插入NULL将存储NULL。 当您将任何其他值插入AUTO_INCREMENT列时，该列将设置为该值并重置序列，以便下一个自动生成的值从插入的值开始按顺序排列。

在MySQL 8.0中，不支持AUTO_INCREMENT列使用负值。

#### 11.2.6超出范围和溢出处理

当MySQL将值存储在超出列数据类型允许范围的数值列中时，结果取决于当时生效的SQL模式：
* 如果启用了严格的SQL模式，则MySQL会根据SQL标准拒绝带有错误的超出范围的值，并且插入失败。
* 如果未启用限制模式，MySQL会将值剪辑到列数据类型范围的相应端点，并存储结果值。
当超出范围的值分配给整数列时，MySQL会存储表示列数据类型范围的相应端点的值。
当为浮点或定点列分配的值超出指定（或默认）精度和比例所隐含的范围时，MySQL会存储表示该范围的相应端点的值。
假设表t1具有以下定义：
```sql
CREATE TABLE t1 (i1 TINYINT, i2 TINYINT UNSIGNED);
```
启用严格的SQL模式后，会发生超出范围的错误：
```sql
mysql> SET sql_mode = 'TRADITIONAL';
mysql> INSERT INTO t1 (i1, i2) VALUES(256, 256);
ERROR 1264 (22003): Out of range value for column 'i1' at row 1 mysql> SELECT * FROM t1;
Empty set (0.00 sec)
```

如果未启用严格的SQL模式，则会发生带有警告的剪切：
```sql
mysql> SET sql_mode = '';
mysql> INSERT INTO t1 (i1, i2) VALUES(256, 256);
mysql> SHOW WARNINGS; 
+---------+------+---------------------------------------------+ 
| Level | Code | Message | 
+---------+------+---------------------------------------------+ 
| Warning | 1264 | Out of range value for column 'i1' at row 1 | 
| Warning | 1264 | Out of range value for column 'i2' at row 1 | 
+---------+------+---------------------------------------------+ 
mysql> SELECT * FROM t1;
+------+------+
| i1   | i2   |
+------+------+
| 127  | 255  |
+------+------+
```

如果未启用严格SQL模式，则由于剪切而发生的列分配转换将报告为ALTER TABLE，LOAD DATA INFILE，UPDATE和多行INSERT语句的警告。 在严格模式下，这些语句失败，并且未插入或更改部分或全部值，具体取决于表是否为事务表和其他因素。 有关详细信息，请参见第5.1.11节“服务器SQL模式”。

数值表达式求值过程中的溢出会导致错误。 例如，最大的带符号BIGINT值为9223372036854775807，因此以下表达式会产生错误：
