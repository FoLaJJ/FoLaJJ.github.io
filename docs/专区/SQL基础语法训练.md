# SQL专区



# 鱼皮网站练习

鱼皮：

项目地址：https://sqlmother.yupi.icu/#/learn



## 全表查询

请编写 SQL 查询语句，从名为 `student` 的数据表中查询出所有学生的信息。

```sql
select * from student
```



## 选择查询

请编写一条 SQL 查询语句，从名为 `student` 的数据表中选择出所有学生的姓名（name）和年龄（age）信息。

注意，所有题目的 **数据列输出顺序必须和题目的要求保持一致** ！比如本题必须学生姓名（name）在前，年龄（age）在后。

```sql
select name,age from student 
```



## 查询-别名

请编写一条 SQL 查询语句，从名为 `student` 的数据表中选择出所有学生的姓名（name）和年龄（age）信息，并为它们取别名为 `学生姓名` 和 `学生年龄`。

```sql
select name as 学生姓名,age as 学生年龄 from student
```



## 查询 - 常量和运算

请编写一条 SQL 查询语句，从名为`student`的数据表中选择出所有学生的姓名（name）和分数（score），并且额外计算出分数的 2 倍（double_score）。

```sql
select name,score,score*2 as double_score from student
```



## 条件查询 - where

请编写一条 SQL 查询语句，从名为`student` 的数据表中选择出所有学生的姓名（name）和成绩（score），要求学生姓名为 '鱼皮'。

```sql
select name,score from student where name = "鱼皮"
```





## 条件查询 - 运算符

请编写一条 SQL 查询语句，从名为 `student` 的数据表中选择出所有学生的姓名（name）和年龄（age），要求学生姓名不等于 '热dog' 

```sql
select name,age from student where name != '热dog'
```





## 条件查询 - 空值

请编写一条 SQL 查询语句，从名为 `student` 的数据表中选择出所有学生的姓名（name）、年龄（age）和成绩（score），要求学生年龄不为空值。

```sql
select name,age,score from student where age is not null
```



## 条件查询 - 模糊查询

请编写一条 SQL 查询语句，从名为 `student` 的数据表中选择出所有学生的姓名（name）和成绩（score），要求姓名（name）不包含 "李" 这个字。

```sql
select name,score from student where name not like '%李%'
```



## 条件查询 - 逻辑运算

请编写一条 SQL 查询语句，从名为 `student` 的数据表中选择出所有学生的姓名（name）、成绩（score），要求学生的姓名包含 "李"，或者成绩（score）大于 500。

```sql
select name,score from student where name like '%李%' or score > 500
```



## 去重distinct

请编写一条 SQL 查询语句，从名为 `student` 的数据表中选择出所有不重复的班级 ID（class_id）和考试编号（exam_num）的组合。

```sql
select distinct class_id, exam_num from student
```



## 排序order by

请编写一条 SQL 查询语句，从名为 `student` 的数据表中选择出学生姓名（name）、年龄（age）和成绩（score），首先按照成绩从大到小排序，如果成绩相同，则按照年龄从小到大排序。

```sql
select name,age,score from student order by score desc,age asc
```



注意：asc升序，desc降序



## 截断和偏移limit

请编写一条 SQL 查询语句，从名为 `student` 的数据表中选择学生姓名（name）和年龄（age），按照年龄从小到大排序，从第 2 条数据开始、截取 3 个学生的信息。

```sql
select name,age from student order by age asc limit 1,3
```



如果只跟一个数字就默认从第0条开始截取



## 条件分支case when then

假设有一个学生表 `student`，包含以下字段：`name`（姓名）、`age`（年龄）。请你编写一个 SQL 查询，将学生按照年龄划分为三个年龄等级（age_level）：60 岁以上为 "老同学"，20 岁以上（不包括 60 岁以上）为 "年轻"，20 岁及以下、以及没有年龄信息为 "小同学"。

返回结果应包含学生的姓名（name）和年龄等级（age_level），并按姓名升序排序。

```sql
select 
	name,
	case 
		when(age>60) then "老同学"
		when(age>20) then "年轻"
		else "小同学"
	end as age_level
from 
	student 
order by
	name asc
```





## case的数值进行计数（牛客）

现在运营想要将用户划分为25岁以下和25岁及以上两个年龄段，分别查看这两个年龄段用户数量

```sql
select
    case 
        when(age<25 or age is null) then "25岁以下"
        when(age>=25) then "25岁及以上"
    end as age_cut,
    count(*) number
from 
    user_profile
group by 
    age_cut
```





## 时间函数date

假设有一个学生表 `student`，包含以下字段：`name`（姓名）、`age`（年龄）。

请你编写一个 SQL 查询，展示所有学生的姓名（name）和当前日期（列名为 "当前日期"）。

```sql
select name,date() as 当前日期 from student
```



tips:

有date当前日期，datetime当前日期时间，time当前时间



## 时间函数day（牛客）

现在运营想要计算出**2021年8月每天用户练习题目的数量**，请取出相应数据。

```sql
select
    day(date) as day,
    count(question_id) as question_cnt
from 
    question_practice_detail
where 
    month(date)=8 and year(date)=2021
group by 
    date
```



tips：

因为存进去是标准的日期格式，所以可以用内置函数进行取出，day，month，year分别是取出日，月，年





## 字符串处理

假设有一个学生表 `student`，包含以下字段：`id`（学号）、`name`（姓名）。请你编写一个 SQL 查询，筛选出姓名为 '热dog' 的学生，展示其学号（id）、姓名（name）及其大写姓名（upper_name）。

```sql
select id,name,upper(name) as upper_name from student where name = "热dog"
```



tips:

upper转换为大写，length计算长度，lower转换为小写



## 聚合函数sum，max，min，avg

假设有一个学生表 `student`，包含以下字段：`id`（学号）、`name`（姓名）、`class_id`（班级编号）、`score`（成绩）。请你编写一个 SQL 查询，汇总学生表中所有学生的总成绩（total_score）、平均成绩（avg_score）、最高成绩（max_score）和最低成绩（min_score）。

```sql
select 
	sum(score) as total_score,
	avg(score) as avg_score,
	max(score) as max_score,
	min(score) as min_score 
from 
	student
```



tips:

count计算列非空的行数，sum计算之和，avg计算平均值，max找到列最大值，min找到列最小值



## 聚合函数保留一位小数点（牛客）

现在运营想要看一下男性用户有多少人以及他们的平均gpa是多少，用以辅助设计相关活动，请你取出相应数据。

```sql
select
    count(gender) as male_num,
    round(avg(gpa),1) as avg_gpa
from 
    user_profile
where
    gender = "male";
```



## 单字段分组group by

假设有一个学生表 `student`，包含以下字段：`id`（学号）、`name`（姓名）、`class_id`（班级编号）、`score`（成绩）。请你编写一个 SQL 查询，统计学生表中的班级编号（class_id）和每个班级的平均成绩（avg_score）。

```sql
select 
	class_id,
	avg(score) as avg_score
from 
	student
group by 
	class_id
```



group by 分组聚合



## 多字段分组

假设有一个学生表 `student`，包含以下字段：`id`（学号）、`name`（姓名）、`class_id`（班级编号）、`exam_num`（考试次数）、`score`（成绩）。请你编写一个 SQL 查询，统计学生表中的班级编号（class_id），考试次数（exam_num）和每个班级每次考试的总学生人数（total_num）。

```sql
select
	class_id,
	exam_num,
	count(*) as total_num
from 
	student
group by
	class_id,
	exam_num
```



## having 子句

假设有一个学生表 `student`，包含以下字段：`id`（学号）、`name`（姓名）、`class_id`（班级编号）、`score`（成绩）。请你编写一个 SQL 查询，统计学生表中班级的总成绩超过 150 分的班级编号（class_id）和总成绩（total_score）。

```sql
select 
	class_id,
	sum(score) as total_score
from 
	student
group by 
	class_id
having sum(score) > 150
```



tips:

WHERE 子句用于在 **分组之前** 进行过滤

而 HAVING 子句用于在 **分组之后** 进行过滤。



## 关联查询 - cross join

假设有一个学生表 `student` ，包含以下字段：id（学号）、name（姓名）、age（年龄）、class_id（班级编号）；还有一个班级表 `class` ，包含以下字段：id（班级编号）、name（班级名称）。

请你编写一个 SQL 查询，将学生表和班级表的所有行组合在一起，并返回学生姓名（student_name）、学生年龄（student_age）、班级编号（class_id）以及班级名称（class_name）。

```sql
select 
	s.name  student_name,
	s.age student_age,
	s.class_id class_id,
	c.name  class_name
from 
	student s,
	class c
```



```sql
select 
	s.name  student_name,
	s.age student_age,
	s.class_id class_id,
	c.name  class_name
from 
	student s
cross join
	class c
```



tips:

`CROSS JOIN` 是一种简单的关联查询，不需要任何条件来匹配行，它直接将左表的 **每一行** 与右表的 **每一行** 进行组合，返回的结果是两个表的笛卡尔积。





## 关联查询 - inner join

假设有一个学生表 `student`，包含以下字段：`id`（学号）、`name`（姓名）、`age`（年龄）、`class_id`（班级编号）。还有一个班级表 `class`，包含以下字段：`id`（班级编号）、`name`（班级名称）、`level`（班级级别）。

请你编写一个 SQL 查询，根据学生表和班级表之间的班级编号进行匹配，返回学生姓名（`student_name`）、学生年龄（`student_age`）、班级编号（`class_id`）、班级名称（`class_name`）、班级级别（`class_level`）。

```sql
select
	s.name student_name,
	s.age student_age,
	s.class_id class_id,
	c.name class_name,
	c.level class_level
from 
	student s
inner join 
	class c
	on 
	s.class_id = c.id
```



tips:

INNER JOIN 只返回两个表中满足关联条件的交集部分，即在两个表中都存在的匹配行。





## 关联查询 - outer join

假设有一个学生表 `student`，包含以下字段：`id`（学号）、`name`（姓名）、`age`（年龄）、`class_id`（班级编号）。还有一个班级表 `class`，包含以下字段：`id`（班级编号）、`name`（班级名称）、`level`（班级级别）。

请你编写一个 SQL 查询，根据学生表和班级表之间的班级编号进行匹配，返回学生姓名（`student_name`）、学生年龄（`student_age`）、班级编号（`class_id`）、班级名称（`class_name`）、班级级别（`class_level`），要求必须返回所有学生的信息（即使对应的班级编号不存在）。



```sql
select
	s.name student_name,
	s.age student_age,
	s.class_id class_id,
	c.name class_name,
	c.level class_level
from
	student s
left outer join
	class c
	on s.class_id = c.id
```



tips:

在 OUTER JOIN 中，包括 LEFT OUTER JOIN 和 RIGHT OUTER JOIN 两种类型，它们分别表示查询左表和右表的所有行（即使没有被匹配），再加上满足条件的交集部分。





##  子查询

假设有一个学生表 `student`，包含以下字段：`id`（学号）、`name`（姓名）、`age`（年龄）、`score`（分数）、`class_id`（班级编号）。还有一个班级表 `class`，包含以下字段：`id`（班级编号）、`name`（班级名称）。

请你编写一个 SQL 查询，使用子查询的方式来获取存在对应班级的学生的所有数据，返回学生姓名（`name`）、分数（`score`）、班级编号（`class_id`）字段。

```sql
select 
	name,
	score,
	class_id
from 
	student
where 
	class_id in(
        select distinct
        	id
        from 
            class
)
```



tips:

基本上就是一个嵌套



## 子查询 - exists

假设有一个学生表 `student`，包含以下字段：`id`（学号）、`name`（姓名）、`age`（年龄）、`score`（分数）、`class_id`（班级编号）。还有一个班级表 `class`，包含以下字段：`id`（班级编号）、`name`（班级名称）。

请你编写一个 SQL 查询，使用 exists 子查询的方式来获取 **不存在对应班级的** 学生的所有数据，返回学生姓名（`name`）、年龄（`age`）、班级编号（`class_id`）字段。

```sql
select
	name,
	age,
	class_id
from
	student
where
	not exists(
    	select
        	class_id
        from 
        	class
        where
        	class.id = student.class_id
    )
```



tips:

其中，子查询中的一种特殊类型是 "exists" 子查询，用于检查主查询的结果集是否存在满足条件的记录，它返回布尔值（True 或 False），而不返回实际的数据。





## 组合查询union

假设有一个学生表 `student`，包含以下字段：`id`（学号）、`name`（姓名）、`age`（年龄）、`score`（分数）、`class_id`（班级编号）。还有一个新学生表 `student_new`，包含的字段和学生表完全一致。

请编写一条 SQL 语句，获取所有学生表和新学生表的学生姓名（`name`）、年龄（`age`）、分数（`score`）、班级编号（`class_id`）字段，要求保留重复的学生记录。

```sql
select
	name,
	age,
	score,
	class_id
from
	student
union all
select
	name,
	age,
	score,
	class_id
from
	student_new
```



tips:

UNION 操作：**去除重复的行** 

union all,不删除重复的行



## 开窗函数 - sum over

假设有一个学生表 `student`，包含以下字段：`id`（学号）、`name`（姓名）、`age`（年龄）、`score`（分数）、`class_id`（班级编号）。

请你编写一个 SQL 查询，返回每个学生的详细信息（字段顺序和原始表的字段顺序一致），并计算每个班级的学生平均分（class_avg_score）。



```sql
select
	id,
	name,
	age,
	score,
	class_id,
	avg(score) over (
        partition by 
        class_id
    ) as class_avg_score
from 
	student
```



## 开窗函数 - sum over order by

假设有一个学生表 `student`，包含以下字段：`id`（学号）、`name`（姓名）、`age`（年龄）、`score`（分数）、`class_id`（班级编号）。

请你编写一个 SQL 查询，返回每个学生的详细信息（字段顺序和原始表的字段顺序一致），并且按照分数升序的方式累加计算每个班级的学生总分（class_sum_score）。

```sql
select
	id,
	name,
	age,
	score,
	class_id,
	sum(score) over(
    	partition by
        class_id
        order by
        score asc
    ) as class_sum_score
from
	student
```



tips:

计算累积



## 开窗函数 - rank

假设有一个学生表 `student`，包含以下字段：`id`（学号）、`name`（姓名）、`age`（年龄）、`score`（分数）、`class_id`（班级编号）。

请你编写一个 SQL 查询，返回每个学生的详细信息（字段顺序和原始表的字段顺序一致），并且按照分数降序的方式计算每个班级内的学生的分数排名（ranking）。

```sql
select
  id,
  name,
  age,
  score,
  class_id,
  rank() over (
    partition by
      class_id
    order by
      score desc
  ) as ranking
from
  student
```





## 开窗函数 - row_number

假设有一个学生表 `student`，包含以下字段：`id`（学号）、`name`（姓名）、`age`（年龄）、`score`（分数）、`class_id`（班级编号）。

请你编写一个 SQL 查询，返回每个学生的详细信息（字段顺序和原始表的字段顺序一致），并且按照分数降序的方式给每个班级内的学生分配一个编号（row_number）。

```sql
select
  id,
  name,
  age,
  score,
  class_id,
  row_number() over (
    partition by
      class_id
    order by
      score desc
  ) as row_number
from
  student
```





tips:

编号





## 开窗函数 - lag / lead

假设有一个学生表 `student`，包含以下字段：`id`（学号）、`name`（姓名）、`age`（年龄）、`score`（分数）、`class_id`（班级编号）。

请你编写一个 SQL 查询，返回每个学生的详细信息（字段顺序和原始表的字段顺序一致），并且按照分数降序的方式获取每个班级内的学生的前一名学生姓名（prev_name）、后一名学生姓名（next_name）。

```sql
SELECT
  id,
  name,
  age,
  score,
  class_id,
  LAG (name) over (
    PARTITION BY
      class_id
    ORDER BY
      score DESC
  ) as prev_name,
  LEAD (name) OVER (
    PARTITION BY
      class_id
    ORDER BY
      score DESC
  ) AS next_name
FROM
  student;
```







tips:

Lag 函数用于获取 **当前行之前** 的某一列的值。它可以帮助我们查看上一行的数据。

Lead 函数用于获取 **当前行之后** 的某一列的值。它可以帮助我们查看下一行的数据。











腾讯pcg

```sql
WITH
-- 计算用户总点击页面数
user_summary AS (
    SELECT 
        user_id, 
        COUNT(DISTINCT page_id) AS total_unique_pages
    FROM 
        user_behavior
    GROUP BY 
        user_id
),
-- 计算用户前三点击页面
top_pages AS (
    SELECT 
        user_id, 
        page_id, 
        COUNT(*) AS page_click_count,
        ROW_NUMBER() OVER (
            PARTITION BY user_id 
            ORDER BY COUNT(*) DESC
        ) AS rank
    FROM 
        user_behavior
    GROUP BY 
        user_id, page_id
    HAVING 
        rank <= 3 
)
SELECT 
    u.user_id,
    u.total_unique_pages,
    JSON_AGG(  
        JSON_BUILD_OBJECT(
            'page_id', t.page_id,
            'click_count', t.page_click_count
        )
    ) AS top_3_pages
FROM 
    user_summary u
LEFT JOIN 
    top_pages t ON u.user_id = t.user_id
GROUP BY 
    u.user_id, u.total_unique_pages
ORDER BY 
    u.total_unique_pages DESC; 
```



