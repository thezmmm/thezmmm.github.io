---
title: "MYSQL"
description: "My notes about MYSQL learing"
date: 2022-05-13T14:33:58+08:00
draft: false
type: "blog"
tags: [database]
---

## 数据库基础

### table - 表

某种特定类型数据的结构化清单

#### column - 列

相当于类的属性，表中的一个字段。所有表都是由一个或多个列组成的

#### row - 行

相当于类的一个对象，表中的数据是按行存储的，所保存的每个记录存储在自己的行内

#### datatype - 数据类型

所容许的数据的类型。每个表列都有相应的数据类型，它限制（或容许）该列中存储的数据

#### primary key - 主键

相当于ID，表中每一行都应该有可以**唯一标识**自己的一列（或一组列）

##### foreign key - 外键

外键为某个表中的一列，它包含另一个表的主键值，定义了两个表之间的关系

##### 主键的条件

1. 任意两行都不具有相同的主键值
2. 每个行都必须有一个主键值(不为NULL)

## 命令行

### 登录

mysql -uroot -p;

自动补全参数 --auto-rehash

### 选择数据库

​	use baseName

### 显示数据库列表

​	show databases

### 显示表的列表

​	show tables

### 显示表列

show columns from tableName
对每个字段返回一行，行中包含字段名、数据类型、是否允许NULL、键信息、默认值以及其他信息

### Others

#### 显示服务器状态信息

​	show status

#### 显示创建特定数据库/表的MySQL语句

​	show create database/table

#### 显示授予用户的安全权限

​	show grants

#### 显示报错/警告信息

​	show errors/warnings

## SELECT语句

### 检索单个列

```mysql
SELECT columnName FROM tableName
```

### 检索多个列

```mysql
SELECT columnName1,columnName2,columnName3
FROM tableName;
```

### 检索所有列

```mysql
SELECT *
FROM tableName;
-- 开销大，但是便于检索到未知列
```

### 检索不同的行

```mysql
SELECT DISTINCT columnName
FROM tableName;
-- 应用于所有列，而不仅仅是前置列
-- 检索出有不同值的列表
```

### 限制结果

```mysql
SELECT columnName
FROM tableName
LIMIT number;
-- 限制返回的行数不多于number
SELECT columnName
FROM tableName
LIMIT number1,number2;
-- 从number1开始，返回number2行
-- 行下标从0开始
```

### 完全限定的表名

```mysql
SELECT tableName.columnName
FROM DBName.tableName
```

### 测试和试验函数与计算

```mysql
SELECT Now()
-- 返回当前日期和时间
```

### SELECT子句

按**次序**使用

1. SELECT

   要返回的列或表达式

2. FROM
   从中检索数据的表

3. WHERE
   行级过滤

4. GROUP BY
   分组说明

5. HAVING
   组级过滤

6. ORDER BY
   输出排序顺序

7. LIMIT
   要检索的行数

## sort - 排序

### 按列排序

```mysql
SELECT columnName1,columnName2,columnName3
FROM tableName
ORDER BY columnName1,columnName2;
```

### 指定排序方向

```mysql
SELECT columnName1,columnName2,columnName3
FROM tableName
ORDER BY columnName1 DESC;
-- 降序(Descending)排序，默认为升序(ASC)
```

### Attention

1. 如果想在多个列上进行降序排序，必须对每个列指定DESC关键字
2. DESC关键字只应用到直接位于其前面的列名
3. ORDER BY子句，应该位于FROM子句之后
4. LIMIT，必须位于ORDER BY之后

## filter - 过滤

### WHERE子句

```mysql
SELECT columnName1
FROM tableName
WHERE 条件
-- ORDER BY应位于WHERE之后
```

#### WHERE子句操作符

1. =

2. <> 和 !=

3. < <=

4. \> \>=

5. BETWEEN a AND b 

   在指定的两个值a,b之间,含a，b

6. IS NULL 空值检查

#### 组合WHERE子句

1. AND

   WHERE 条件a AND 条件b

2. OR

   WHERE 条件a OR 条件b

3. IN

   IN操作符用来指定条件范围，范围中的每个条件都可以进行匹配

```mysql
WHERE number IN (1,2)
```

4. NOT

   否定它之后所跟的任何条件

5. 括号

   使用具有AND和OR操作符的WHERE子句，应该使用圆括号明确地分组操作符

### Wildcard - 通配符

用来匹配**值的一部分**的特殊字符

1. % 百分号

   %代表搜索模式中，给定位置的0个，1个或多个字符，无法匹配NULL

   > search pattern - 搜索模式, 由字面值、通配符或两者组合构成的搜索条件

2. _ 下划线

   与%相同，但只匹配单个字符

```mysql
SELECT colomnName1
FROM tableName
WHERE colomnName2 LIKE 'head%';
-- 检索以head起头的词

SELECT colomnName1
FROM tableName
WHERE colomnName2 LIKE '%body%';
-- 匹配任何位置包含文本body的值

SELECT colomnName1
FROM tableName
WHERE colomnName2 LIKE 's%e';
-- 检索以s开头，e结束的
```

**Attention**

1. 通配符不优先使用
2. 除非必要，不用于搜索模式的开始处

### REGEXP

在REGEXP后使用正则表达式，位置同LIKE

## 计算字段

### concat - 拼接字段

将值联结到一起构成单个值,在select语句中使用

```mysql
concat(vend_name,'(',vend_country,')')
```

#### 使用别名

字段或值的替换名

```mysql
concat(vend_name,'(',vend_country,')') AS vend_title
```

### 算术计算

可将计算的内容当作一列，并用AS起别名

```mysql
SELECT 	prod_id,
		quantity,
		item_price,
		quantity*item_price AS expanded_price
FROM	orderitems
WHERE	order_num = 20005;
```

## 数据处理函数

函数可移植性(portable)较差

### 文本处理函数

1. Left() 
   返回串左边的字符
2. Length() 
   返回串的长度
3. Locate() 
   找出串的一个子串
4. Lower() 
   将串转换为小写
5. LTrim() 
   去掉串左边的空格
6. Right() 
   返回串右边的字符
7. RTrim() 
   去掉串右边的空格
8. Soundex() 
   返回串的SOUNDEX值，SOUNDEX是一个将任何文本串转换为描述其语音表示的字母数字模式的算法
9. SubString() 
   返回子串的字符
10. Upper() 
    将串转换为大写

### 数值处理函数

1. Abs() 
   返回一个数的绝对值
2. Exp() 
   返回一个数的指数值
3. Mod() 
   返回除操作的余数
4. Pi() 
   返回圆周率
5. Rand() 
   返回一个随机数
6. Sqrt() 
   返回一个数的平方根
7. Sin() 
   返回一个角度的正弦
8. Cos() 
   返回一个角度的余弦
9. Tan() 
   返回一个角度的正切

## 汇总数据

### aggregate function - 聚集函数

1. AVG() 
   返回某列的平均值，参数为列名
2. COUNT() 
   返回某列的行数

```mysql
COUNT(*)	
-- 对表中行的数目进行计数，不管表列的是否为NULL
COUNT(columnName)	
-- 对该列中有值的进行计数，忽略NULL
```

3. MAX() 
   返回某列的最大值，对文本数据，按相应的列排序，返回最后一行
4. MIN() 
   返回某列的最小值
5. SUM() 
   返回某列值之和
6. DISTINCT
   在函数的参数前加上DISTINCT，不重复计算相同的值

## 分组数据

在SELECT子句GROUP BY和HAVING中完成

### 创建分组

GROUP BY

```mysql
SELECT vend_id,COUNT(*) AS num_prods
FROM products
GROUP BY vend_id;
```

WITH ROLLUP
对列中所有值求和得到一行

```mysql
SELECT vend_id,COUNT(*) AS num_prods
FROM products
GROUP BY vend_id WITH ROLLUP;
```

### 过滤分组

HAVING

```mysql
SELECT vend_id,COUNT(*) AS num_prods
FROM products
GROUP BY vend_id WITH ROLLUP
HAVING COUNT(*) >= 2;
```

**Attention**

1. WHERE在数据分组前过滤，HAVING在数据分组后进行过滤
2. HAVING支持所有WHERE操作符

## Subquery - 子查询

### 利用子查询过滤

将一条SELECT语句返回的结果用于另一条SELECT语句的WHERE语句

```mysql
SELECT cust_id
FROM orders
WHERE order_num IN (SELECT order_num
					FROM orderitems
					WHERE prod_id = 'TNT2');
```

### 作为计算字段使用子查询

```mysql
SELECT cust_name,
			cust_state,
		   (SELECT COUNT(*)
			FROM orders
			WHERE orders.cust_id = customers.cust_id) AS oders
FROM customers
ORDER BY cust_name;
-- 这里使用了相关子查询：涉及外部查询的子查询
-- 在使用列名时有多义性，则使用表名.列名
```

## Join - 联结表

### 创建联结

```mysql
SELECT vend_name,prod_name,prod_price
FROM vendors,products
WHERE vendors.vend_id = products.vend_id
ORDER BY vend_name,prod_name;
-- 完全限定列名
```

使用where来对两个表配对

> 笛卡尔积
> 由**没有联结条件**的表关系返回的结果为笛卡尔积，检索的数目是第一个表的行数乘以第二个表的行数

### Equijoin - 等值联结/内部联结

基于两个表之间的相等测试

```mysql
SELECT vend_name,prod_name,prod_price
FROM vendors INNER JOIN products
ON vendors.vend_id = products.vend_id;
-- 使用了规范的联结语法，INNER JOIN语法,联结条件用ON子句
```

### 高级联结

#### 表别名

为表起别名，缩短SQL语句，允许在单条SELECT语句中多次使用相同的表

```mysql
SELECT cust_name,cust_contact
FROM customers AS c,orders AS o,orderitems AS oi
WHERE c.cust_id = o.cust_id
	  AND oi.order_num = o.order_num
	  AND prod_id = 'TNT2';
```

#### 自联结

利用别名，使自己与自己联结
	

```mysql
-- Question:假如你发现某物品（其ID为DTNTR）存在问题，因此想知道生产该物品的供应商生产的其他物品是否也存在这些问题
SELECT p1.prod_id,p1.prod_name
FROM products AS p1,products AS p2
WHERE p1.vend_id = p2.vend_id
	AND p2.prod_id = 'DTNTR';
-- 此例中的两个products是相同的表，但是使用了不同的别名
```

#### 自然联结

自然联结排除多次出现，使每个列只返回一次

```mysql
SELECT c.*,o.order_num,o.order_date,
	   oi.prod_id,oi.quantity,oi.itemprice
FROM  customers AS c,orders AS o,orderitems AS oi
WHERE c.cust_id = o.cust_id
 AND oi.order_num = o.order_num
 AND prod_id = 'FB';
-- 对第一个表使用通配符，所有其他列明确给出，无重复列被检索
```

#### 外部联结

联结包含了那些在相关表中没有关联行的行。这种类型的联结称为外部联结，即是包含了为空值的行

```mysql
SELECT customers.cust_id,orders.order_num
FROM customers LEFT OUTER JOIN orders
ON customers.cust_id = orders.cust_id;
-- RIGHT/LEFT OUTER JOIN	
```

## Union - 组合查询

执行多个查询（多条SELECT语句），并将结果作为单个查询结果集返回，用于将不同表中相同列中查询的数据展示出来

### 创建组合查询

使用UNION操作符组合数条SQL查询，可将它们的结果合成单个结果集
**Attention**

1. UNION必须由两条或两条以上的SELECT语句组成，语句之间用关键字UNION分隔（因此，如果组合4条SELECT语句，将要使用3个UNION关键字）。
2. UNION中的每个查询必须包含相同的列、表达式或聚集函数（不过分析各个列不需要以相同的次序列出）。
3. 列数据类型必须兼容：类型不必完全相同，但必须是DBMS可以隐含地转换的类型（例如，不同的数值类型或不同的日期类型）。
4. UNION自动去除重复的行，使用UNION ALL可以包含重复的行

## 全文本搜索

### 启动全文本搜索

创建的表内加入```FULLTEXT(note_text)```

不要再导入数据时使用FULLTEXT，应该首先导入所有数据，然后再修改表定义FULLTEXT

### 进行全文本搜索

使用两个函数Match()和Against()，Match()指定被搜索的列，Against()指定要使用的搜索表达式

```mysql
WHERE Match(note_text) Against('rabbit')
-- 传递给 Match() 的值必须与FULLTEXT()定义中的相同
```

### 使用查询扩展

设法放宽所返回的全文本搜索结果的范围

1. 首先，进行一个基本的全文本搜索，找出与**搜索条件**匹配的所有行；

2. 其次，MySQL检查这些匹配行并**选择所有有用的词**

3. 再其次，MySQL再次进行全文本搜索，这次不仅使用原来的条件，而且还**使用所有有用的词**。

   ```mysql
   WHERE Match(note_text) Against('rabbit' WITH QUERY EXPANDSION)
   ```


### 布尔文本搜索

可以提供如下内容的细节：

1. 要匹配的词；
2. 要排斥的词（如果某行包含这个词，则不返回该行，即使它包含其他指定的词也是如此）；
3. 排列提示（指定某些词比其他词更重要，更重要的词等级更高）；
4. 表达式分组；
5. 另外一些内容。

即使没有FULLTEXT索引也可以使用，但是运行效率低

```mysql
WHERE Match(note_text) Against('rabbit' IN BOOLEAN MODE) 
```

#### 布尔操作符

1. \+ 包含，词必须存在
2. \- 排除，词必须不出现
3. \> 包含，而且增加等级值
4. < 包含，且减少等级值
5. () 把词组成子表达式（允许这些子表达式作为一个组被包含、排除、排列等）
6. ~ 取消一个词的排序值
7. \* 词尾的通配符
8. "" 定义一个短语（与单个词的列表不一样，它匹配整个短语以便包含或排除这个短语）

### 全本文搜索的使用说明

1. 忽略短词(3个或3个以下字符的词，可更改)
2. MySQL有一个内建的非用词(stopword)列表，这些词总被忽略
3. 一个词出现在50%以上的行中，则将它作为非用词忽略
4. 表中行数少于3行，不返回结果(因为每个词或者不出现，或者至少出现在50%的行中)
5. 忽略词中的单引号
6. 不具词分隔符的语言(日语和汉语)不能恰当地返回结果

## 插入数据

INSERT语句，INSERT语句一般不会产生输出

### 插入方式

1. 插入完整的行
   插入新的一行，对于每列必须提供一个值，如果没有值使用NULL，不安全

```mysql
INSERT INTO Customers
VALUES(NULL,
	   'Alex'
	   'CN');
```

一般不要使用没有明确给出列的列表的INSERT语句,避免表的结构改变造成错误

2. 插入行的一部分

   ```mysql
   -- 安全但是繁琐的语句
   INSERT INTO Customers(cust_id,
                         cust_name,
                         cust_country)
   VALUES(NULL,
          'Alex'
          'CN');
   ```

3. 插入多行
   
   ```mysql
   INSERT INTO Customers(cust_id,
                         cust_name,
                         cust_country)
   VALUES(NULL,
          'Alex'
          'CN'),
   		   (NULL,
               'Kit'
               'US');
   ```
   
4. 插入某些查询的结果

   ```mysql
   INSERT INTO Customers(cust_id,
                         cust_name,
                         cust_country)
   SELECT cust_id,
           cust_name,
           cust_country
   FROM custnew
   ```

## 操作数据

WHERE子句十分重要，以免更新或删除所有数据

### Update

1. 要更新的表

2. 列名与新值

3. 过滤条件

   ```mysql
   UPDATE customers
   SET cust_emali = '1563081082@qq.com'
   	cust_name = 'theZmmm'
   WHERE cust_id = 15638;
   ```

​	UPDATE语句更新多行时出现错误，则整个UPDATE操作取消(错误发生前更新的值恢复)，若即使发生错误也要更新则使用IGNORE关键字```UPDATE IGNORE customers```

### 删除数据

```mysql
-- 删除整行，删除整列用UPDATE
DELETE FROM customers
WHERE cust_id = 15638;
```

#### TRUNCATE TABLE

从表中删除所有行(删除原来的表并重新创建一个表)，速度更快
**Attention**

1. 除非确实打算更新和删除每一行，否则绝对不要使用不带WHERE子句的UPDATE或DELETE语句
2. 保证每个表都有主键，并尽可能使用
3. 对UPDATE和DELETE使用WHERE子句前，先用SELECT测试是否正确
4. 使用强制实施引用完整性的数据库，这样MySQL将不允许删除具有与其他表相关联的数据的行

## 创建与操纵表

### 创建表

CREATE TABLE

```mysql
-- CREATE TABLE后给出新表的名字，表列的名字和定义用逗号分隔

CREATE TABLE customers
(
	cust_id	int	NOT NULL AUTO_INCREMENT,
	cust_address char(50) NOT NULL,
	quantity int NOT NULL DEFAULT 1,
	PRIMARY KEY(cust_id)
)ENGINE = InnoDB;
```

在创建新表时，指定的表名必须不存在，否则将出错。

若要防止意外覆盖已有的表，先删除，再重建。

如果仅想在一个表不存在时创建它，在表名后给出```IF EXISTS```

1. NULL值

   不允许NULL值的列，在插入和更新时必须有值

2. primary key

   主键可以在创建表时和创建表后定义，不允许空值

3. AUTO_INCREMENT

   每创建一行时，递增1

   覆盖AUTO_INCREMENT:在INSERT语句中指定一个值(未使用过的)即可，该值将被用来替代自动生成的值。后续的增量将开始使用该手工插入的值

   确定AUTO_INCREMENT的值:```SELECT last_insert_id()```

4. DEFAULT

   指定默认值，可以代替NULL值

5. ENGINE - 引擎类型

   省略ENGINE=语句，则使用默认引擎（很可能是MyISAM）

   1. InnoDB

      是一个可靠的事务处理引擎，它不支持全文本搜索；

   2. MEMORY

      在功能等同于MyISAM，但由于数据存储在内存（不是磁盘）中，速度很快（特别适合于临时表）；

   3. MyISAM

      是一个性能极高的引擎，它支持全文本搜索（参见第18章），但不支持事务处理。

### 更新表

#### ALTER TABLE

1. ADD

增加一列

```mysql
ALTER TABLE customers
ADD cust_country CHAR(20);
```

2. DROP

删除一列

```mysql
ALTER TABLE customers
DROP cust_country;
```

3. FOREIGN KEY

定义外键

```mysql
ALTER TABLE orders,
ADD CONSTRAINT fk_orders_customers FOREIGN KEY (cust_id)
REFERENCES customers (cust_id);
```

### 删除表

```mysql
DROP TABLE customers;
```

### 重命名表

```mysql
RENAME TABLE old TO new;
```

## 视图
视图是虚拟的表。与包含数据的表不一样，视图只包含使用时动态检索数据的**查询**(SELECT)
### 使用视图
视图一般用于检索(SELECT),而不用于更新(INSERT,UPDATE,DELETE)

1. 创建视图和更新覆盖视图

```mysql
CREATE VIEW productcustomers AS
SELECT cust_name,cust_contact,prod_id
FROM customers,orders,orderitems
WHERE customers.cust_id = orders.cust_id
 AND orderitems.order_num = orders.order_num;
```

2. SHOW CREATE VIEW viewname

   查看创建视图的语句

3. DROP VIEW viewname

   删除视图

### 优点

1. 重用SQL语句。
2. 简化复杂的SQL操作。在编写查询后，可以方便地重用它而不必知道它的基本查询细节。
3. 使用表的组成部分而不是整个表。
4. 保护数据。可以给用户授予表的特定部分的访问权限而不是整个表的访问权限。
5. 更改数据格式和表示。视图可返回与底层表的表示和格式不同的数据

### 规则

1. 唯一命名(不与其他视图和表的名字相同)
2. 数目没有限制
3. 创建视图需要具有足够访问权限
4. 可以嵌套
5. 无法索引
6. 可以和表一起使用

## 存储

存储过程，为以后的使用而保存一条或多条MySQL语句的集合,相当于一个函数

### 执行(调用)存储过程

CALL接受存储过程的名字以及需要传递给它的任意参数

```mysql
CALL productpricing(@pricelow
					@pricehigh);
//MySQL变量以@开始
```

### 创建存储过程

```mysql
CREATE PROCEDURE productpricing()
BEGIN
	SELECT Avg(prod_price) AS priceaverage
	FROM products;
END;
-- 使用命令行，则输入第一个分号后语句就会被执行
```

#### MySQL分隔符

用命令行操作MySQL则遇到;号就会执行命令，无法完整执行上方的创建过程，解决办法：更换分隔符

```mysql
DELIMITER //
CREATE PROCEDURE productpricing()
BEGIN
	SELECT Avg(prod_price) AS priceaverage
	FROM products;
END//

DELIMITER ;
```

```DELIMITER //```告诉命令行实用程序使用 **//** 作为新的语句结束分隔符

### 删除存储过程

```mysql
DROP PROCEDURE productpricing;
```

 **仅当存在时删除**

如果指定的过程不存在，则```DROP PROCEDURE```将产生一个错误。当过程存在想删除它时（如果过程不存在也不产生错误）可使用```DROP PROCEDURE IF EXISTS```。

### 使用参数

```mysql
CREATE PROCEDURE ordertotal(
    OUT ototal DECIMAL(8,2)
    IN onumber INT)
BEGIN
	SELECT Sum(item_price*quantity)
	FROM orderitems
	WHERE order_num = onumber;
	INTO ototal;
END;
-- 关键字IN 和 OUT(对存储过程传入和传出)
```

### COMMENT

在创建存储时使用COMMENT，它将在```SHOW PROCEDURE STATUS```的结果中显示

```mysql
CREATE PROCEDURE ordertotal(
)COMMENT 'theZmmm'
```

## Cursor - 游标
用于遍历，只读，只用于存储过程
### 创建游标
DECLARE语句用来定义和命名游标

```mysql
CREATE PROCEDURE processorders()
BEGIN
	DELARE cursor_name CURSOR
	FOR
	SLECT order_num FROM orders;
END;
```

### 打开和关闭游标

```mysql
OPEN cursor;
CLOSE cursor;
-- MySQL将会在到达END语句时自动关闭它
```

### 使用游标数据

```mysql
FETCH cursor_name INTO variables list;
CREATE PROCEDURE processorders()
BEGIN

	-- 声明两个变量
	DECLARE donw BOOLEAN DEAULT 0;
	DECLARE o INT;

	-- 声明游标
	DECLARE ordernumbers CURSOR
	FOR
    SELECT order_num FROM orders;

	-- CONTINUE HANDLER当条件出现时被执行
	-- SQLSTATE '02000' 是一个未找到条件
	DECLARE CONTINUE HANDLER FOR SQLSTATE '02000' SET done = 1;
	
	OPEN cursor;
	
	-- 循环语句
	REPEAT
		FETCH ordernumbers INTO o;
	UNTIL done END REPEAT;

	CLOSE ordernumbers;

END;
```

## 触发器

某条语句（或某些语句）在事件(DELETE,INSERT,UPDATE)发生时自动执行

### 创建触发器

1. 唯一的触发器名

2. 触发器关联的表

3. 触发器应该响应的活动(DELETE,INSERT,UPDATE)

4. 触发器该何时执行(处理之前或之后)

   ```mysql
   CREATE TRIGGER newproduct AFTER INSERT ON products
   FOR EACH ROW SELECT 'Product added'
   ```

### 删除触发器
DROP TRIGGER newproduct;
### 使用触发器

1. INSERT触发器
   INSERT触发器内可以引用一个名为NEW的虚拟表，访问被插入的行
2. DELETE触发器
   DELETE触发器内可以引用一个名为OLD的虚拟表，访问被删除的行
3. UPDATE触发器
   UPDATE触发器中可以引用一个名为OLD的虚拟表访问以前（UPDATE语句前）的值，引用一个名为NEW的虚拟表访问新更新的值

## Transaction processing - 事务处理

用来维护数据库的完整性，它保证成批的MySQL操作要么完全执行，要么完全不执行

事务处理用来管理INSERT、UPDATE和DELETE语句，不能回退SELECT,CREATE和DROP语句

### 内容结构

1. 事务（transaction）指一组SQL语句；
2. 回退（rollback）指撤销指定SQL语句的过程；
3. 提交（commit）指将未存储的SQL语句结果写入数据库表；
4. 保留点（savepoint）指事务处理中设置的临时占位符（placeholder），你可以对它发布回退（与回退整个事务处理不同）。

### 控制事务处理

1. ROLLBACK

   回退（撤销）MySQL语句

```mysql
START TRANSACTION;
DELETE FROM ordertotals;
SELECT * FROM ordertotals;
ROLLBACK;
```

2. COMMIT
   在事务处理块中，提交不会隐含地进行(自动提交)。为进行明确的提交，使用COMMIT语句

```mysql
START TRANSACTION;
DELETE FROM orderitems;
COMMIT;
```

3. savepoint - 保留点

   ```mysql
   SAVEPOINT delete1;
   ROLLBACK TO delete1;
   ```

## 全球化和本地化

### 字符集和校对顺序

数据库表被用来存储和检索数据。**不同的语言和字符集**需要以不同的方式存储和检索。因此，MySQL需要适应不同的字符集（不同的字母和字符），适应不同的排序和检索数据的方法。

1. 字符集，字母和符号的集合
2. 编码，某个字符集成员的内部表示
3. 校对，规定字符如何比较的指令

### 显示字符集和校对顺序

1. SHOW CHARACTER SET

   显示所有可用的字符集以及每个字符集的描述和默认校对

2. SHOW COLLATION

   显示所有可用的校对，以及它们适用的字符集

3. 使用字符集和校对顺序

```mysql
CREATE TABLE mytable(
)DEFAULT CHARACTER SET hebrew
 COLLATE hebrew_qeneral_ci;
```

## 安全管理

### 显示所有用户

```mysql
USE mysql;
SELECT user FROM user;
```

### 创建用户账号

```mysql
CREATE USER name IDENTIFIED BY 'p@$$wOrd';
```

```IDENTIFIED BY```指定了密码，可无

### 修改用户名称

```mysql
RENAME USER name1 TO name2;
```

### 删除用户账号

```mysql
DROP USER name;
```

### 设置访问权限

```mysql
SHOW GRANTS FOR name;
-- 显示用户的访问权限

GRANT SELECT ON databaseName.* TO name;
-- 允许用户在database数据库的所有表，执行SELECT访问权限

REVOKE SELECT ON databaseName.* FROM name;
-- 取消权限(被取消的权限必须存在)
```

### 更改密码

```mysql
SET PASSWORD FOR name = Password('newPw');

SET PASSWORD = Password('newPw');
-- 不指定用户名时，更改当前用户的密码
```

## 数据库维护

### 备份数据
1. mysqldump

命令行实用程序mysqldump转储所有数据库内容到某个外部文件
2. mysqlhotcopy

命令行实用程序mysqlhotcopy从一个数据库复制所有数据（并非所有数据库引擎都支持这个实用程序）

3. BACKUP TABLE 或 SELECT INTO OUTFILE

转储所有数据到某个外部文件，这两条语句都接受将要创建的系统文件名，此系统文件必须不存在，否则会出错

数据可以用```RESTORETABLE```来复原

4. FLUSH TABLES

备份前使用```FLUSH TABLES```，刷新未写数据，保证所有数据被写到磁盘
### 进行数据库维护
1. ANALYZE TABLE

检查表键是否正确

2. CHECK TABLE

发现和修复问题

1. CHANGED检查自最后一次检查以来改动过的表
2. EXTENDED执行最彻底的检查
3. FAST只检查未正常关闭的表
4. MEDIUM检查所有被删除的链接并进行键检验
5. QUICK只进行快速扫描

### 诊断启动问题
在命令行上执行mysqld启动

1. --help
   显示帮助——一个选项列表
2. --safe-mode
   装载减去某些最佳配置的服务器；
3. --verbose
   显示全文本消息（为获得更详细的帮助消息与--help联合使用）；
4. --version
   显示版本信息然后退出

### 查看日志文件
1. 错误日志

它包含启动和关闭问题以及任意关键错误的细节。此日志通常名为hostname.err，位于data目录中。此日志名可用--log-error命令行选项更改

2. 查询日志

它记录所有MySQL活动，在诊断问题时非常有用。此日志文件可能会很快地变得非常大，因此不应该长期使用它。此日志通常名为hostname.log，位于data目录中。此名字可以用--log命令行选项更改
3. 二进制日志

它记录更新过数据（或者可能更新过数据）的所有语句。此日志通常名为hostname-bin，位于data目录内。此名字可以用--log-bin命令行选项更改

4. 缓慢查询日志

此日志记录执行缓慢的任何查询。这个日志在确定数据库何处需要优化很有用。此日志通常名为hostname-slow.log ，位于 data 目录中。此名字可以用--log-slow-queries命令行选项更改



