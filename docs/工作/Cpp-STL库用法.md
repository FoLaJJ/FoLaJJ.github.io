# STL库用法

参考：

https://blog.csdn.net/qq_50285142/article/details/114026148

## vector

vector为可变长数组（动态数组），定义的vector的数组可以随时添加数值和删除元素。

**在局部区域中开vector数组，是在堆空间里面开的**

局部区域不可以开大长度数组，但是可以开大长度vector

```cpp
#include <vector>

int main(){
    // 1.一维初始化
    vector<int> a;
    vector<char> b;
    vector<ListNode*> c;
    
    // 2.指定长度和初始值的初始化
    vector<int> Ans(n);// Ans填充了n个0
    vector<int> Ans(n,1);// Ans填充了n个1
    
    // 3.初始化多元素
    vector<int> a{1,2,3,4,5};
    
    // 4.拷贝初始化
    vector<int> a(n+1,0);
    vector<int> b(a);
    
    // 5.二维初始化
    vector<int> v[5];//定义了一个第一维固定长度为5，第二维可变化的二维数组
    
    // 6.上述二维初始化可以进行的操作：
    v[1].push_back(2);
	v[2].push_back(3);
    
    // 7.初始化二维均可变长数组
    vector<vector<int>> v;
    
    // 8.定义行列长度固定n+1行m+1列的初始值为0
    vector<vector<int>> a(n+1,vector<int>(m+1,0));
    
}
```

方法函数：

| 代码                     | 含义                                                 |
| ------------------------ | ---------------------------------------------------- |
| v.front()                | 返回第一个数据O(1)                                   |
| v.pop_back()             | 删除最后一个数据O(1)                                 |
| v.push_back(*element)    | 在尾部加入一个数据O(1)                               |
| v.size()                 | 返回实际数据个数（unsigned类型）O(1)                 |
| v.clear()                | 清楚元素个数O(N)，N为元素个数                        |
| v.resize(n,num)          | 改变数组大小为n，n个空间赋值为num，没有就默认赋值为0 |
| v.insert(it,x)           | 向任意迭代器it插入一个元素x，O(N)                    |
| v.erase(first,last)      | 删除(first，last)的所有元素，O(N)  左闭右开          |
| v.begin()                | 返回首元素的迭代器O(1)                               |
| v.end()                  | 返回最后一个元素后一个位置的迭代器O(1)               |
| v.empty()                | 判断是否为空，为空返回true，反之返回false O(1)       |
| v.emplace_back(*element) | 在数组中加入一个数据，和pushback类似，但是更高效     |
|                          |                                                      |

用法：

```cpp
int main(){
    // 1.可以指定区间进行排序
    sort(v.begin(),v.end());
    sort(v.begin()+1,v.end());
    
    // 2.迭代器定义
    vector<int>::iterator it = v.begin();//声明一个迭代器指向vi的初始位置
    
    auto it =v.begin();
    
    // 3.迭代器遍历
    vector<int>::iterator it;
	for(it = vi.begin(); it != vi.end();it ++)
    cout << *it << " ";
    
    // 4.智能指针
    for(auto val:v){
        cout << val << " ";
    }
    
}
```



注意：

- end指针通常是最后一个元素后一个位置的地址，而不是最后一个元素的地址，stl库中的所有容器都是这样设定的
- vector中当长度大于容量时，会重新开辟新的内存空间，一般是初始设定的容量的两倍，并将原来空间内容先copy到新的地址空间，然后再销毁原来的地址空间
- 减少内存拷贝的思路就是提前分配固定的空间大小



## stack

先进后出，后进先出的容器

```cpp
#include <stack>
int main(){
    // 1.定义栈容器
    stack<int> stk;
    stack<string> stk;
    stack<ListNode*> stk;
    
    
}
```

方法函数：

| 代码              | 含义                              |
| ----------------- | --------------------------------- |
| stk.push(element) | 元素element入栈，增加元素O(1)     |
| stk.pop()         | 移除栈顶元素O(1)                  |
| stk.top()         | 取得栈顶元素，但不删除O(1)        |
| stk.empty()       | 检测栈内是否为空，空返回true O(1) |
| stk.size()        | 返回栈内元素的个数O(1)            |



## queue

队列，先进先出

```cpp
#include <queue>
int main(){
    queue<int> q;
    queue<ListNode*> q;
}
```

方法函数：

| 代码              | 含义                                            |
| ----------------- | ----------------------------------------------- |
| `q.front()`       | 返回队首元素O(1)                                |
| `q.back()`        | 返回队尾元素O(1)                                |
| `q.push(element)` | 尾部添加一个元素element 进队O(1)                |
| `q.pop()`         | 删除第一个元素 出队O(1)                         |
| `q.size()`        | 返回队列中元素个数，返回值类型unsigned int O(1) |
| `q.empty()`       | 判断是否为空，为空返回true O(1)                 |



## deque

首尾都可以插入和删除的队列称为双端队列

```cpp
#include <deque>
int main(){
    deque<int> dq;
}
```

方法函数：

| 代码                                | 含义                                            |
| ----------------------------------- | ----------------------------------------------- |
| push_back(x)/push_front(x)          | 把x插入队尾后/队首O(1)                          |
| back()/front()                      | 返回队尾/队首元素O(1)                           |
| pop_back()/pop_front()              | 删除队尾/队首元素O(1)                           |
| erase(iterator it)                  | 删除双端队列中的某一个元素                      |
| erase(iterator first,iterator last) | 删除双端队列中【first，last）中的元素，左闭右开 |
| empty()                             | 判断deque是否为空O(1)                           |
| size()                              | 返回deque的元素数量O(1)                         |
| clear()                             | 清空deque                                       |

deque可以进行排序：

```cpp
// 从小到大进行排序
sort(dq.begin(),dq.end());

// 从大到小排序
sort(dq.begin(),dq.end(),greater<int>());
sort(dq.begin(),dq.end(),greater());
```



## priority_queue

优先队列是在正常队列的基础上加了优先级，保证每次的队首元素都是优先级最大的。底层是通过堆来实现的。

```cpp
#include <queue>
int main(){
    priority_queue<int> pq;
}
```

函数方法：

| 代码                              | 含义                 |
| --------------------------------- | -------------------- |
| pq.top()                          | 访问队首元素         |
| pq.push()                         | 入队                 |
| pq.pop()                          | 堆顶（队首）元素出队 |
| pq.size()                         | 队列元素个数         |
| pq.empty()                        | 是否为空             |
| 优先队列没有clear()               | 不提供该方法         |
| 优先队列只能通过top()访问队首元素 | （优先级最高的元素） |

设置优先级：

```cpp
priority_queue<int> pq; // 默认大根堆, 即每次取出的元素是队列中的最大值
priority_queue<int, vector<int>, greater<int> > pq; // 小根堆, 每次取出的元素是队列中的最小值
```

参数：

- **第二个参数：**
  `vector< int >` 是用来承载底层数据结构堆的容器，若优先队列中存放的是`double`型数据，就要填`vector< double >`
  **总之存的是什么类型的数据，就相应的填写对应类型。同时也要改动第三个参数里面的对应类型。**

- **第三个参数：**
  `less< int >` 表示数字大的优先级大，堆顶为最大的数字
  `greater< int >`表示数字小的优先级大，堆顶为最小的数字
  **int代表的是数据类型，也要填优先队列中存储的数据类型**

- 第三个参数可以自定义排序：

  ```cpp
  struct cmp1
  {
      bool operator()(int x,int y)
      {
          return x > y;
      }
  };
  struct cmp2
  {
      bool operator()(const int x,const int y)
      {
          return x < y;
      }
  };
  priority_queue<int, vector<int>, cmp1> q1; // 小根堆
  priority_queue<int, vector<int>, cmp2> q2; // 大根堆
  ```


存储pair类型：默认先对pair的first进行降序排序，再对second进行降序排序

```cpp
#include<bits/stdc++.h>
using namespace std;
int main()
{
    priority_queue<pair<int, int> >q;
    q.push({7, 8});
    q.push({7, 9});
    q.push(make_pair(8, 7));
    while(!q.empty())
    {
        cout << q.top().first << " " << q.top().second << "\n";
        q.pop();
    }
    return 0;
}

// 输出：
// 8 7
// 7 9
// 7 8
```



## map（红黑树）

一个键对应一个值，和python的字典有点类似

红黑树是一个自平衡的二叉排序树：

特点如下：

- 每一个结点都有一个颜色，要么为红色，要么为黑色；
- 树的根结点为黑色；
- 树中不存在两个相邻的红色结点（即红色结点的父结点和孩子结点均不能是红色）；
- 从任意一个结点（包括根结点）到其任何后代 NULL 结点（默认是黑色的）的每条路径都具有相同数量的黑色结点。



map会按照键的顺序从小到大自动排序，键的类型必须可以比较大小

```cpp
#include <map>
int main(){
    map<string,string> mp;
    map<string,int> mp;
    map<ListNode*,int> mp;
}
```

函数方法：

| 代码                 | 含义                                                         |
| -------------------- | ------------------------------------------------------------ |
| mp.find(key)         | 返回键为key的映射的迭代器O(logN)。find函数定位数据，若存在，则返回一个迭代器，不存在，则返回mp.end() |
| mp.erase(it)         | 删除迭代器所对应的键和值O(1)                                 |
| mp.erase(key)        | 根据映射的键删除键和值O(logN)                                |
| mp.erase(first,last) | 删除左闭右开区间迭代器对应的键和值O(last-first)              |
| mp.size()            | 返回映射的对数O(1)                                           |
| mp.clear()           | 清空map中的所有元素O(N)                                      |
| mp.insert()          | 插入元素，插入时要构造键值对                                 |
| mp.empty()           | 如果map为空，则返回true，否则返回false                       |
| mp.begin()           | 返回指向map第一个元素的迭代器（地址）                        |
| mp.end()             | 返回指向map尾部的迭代器（最后一个元素的下一个地址）          |
| mp.rbegin()          | 返回指向map最后一个元素的迭代器地址                          |
| mp.rend()            | 返回指向map第一个元素前一个的逆向迭代器                      |
| mp.count(key)        | 查看元素是否存在，因为mao中键是唯一的，所以存在返回1，不存在返回0 |
| mp.lower_bound()     | 返回一个迭代器，指向键值>=key的第一个元素                    |
| mp.upper_bound()     | 返回一个迭代器，指向键值>key的第一个元素                     |

查找元素：

- mp.find()
- mp.count()
- mp[key]
- 第三种情况，如果不存在对应的key时，会自动创建一个键值对！！

插入方法：

```cpp
#include <map>
int main(){
    map<string,int> mp;
    mp['a']=1;
    mp['b']=3;
    mp.insert(make_pair("c",6));
    mp.insert(pair<string,string>("d",10));
    mp.insert({'e',29});
}
```

遍历：

```cpp
// 迭代器访问
for(it = mp.begin(); it != mp.end(); it++) {
    cout << it->first << " " << it->second 
}

// 智能指针访问
for(auto i:mp){
    cout << i.first << i.second << endl;
}

// 迭代器指定单个元素访问
map<char,int>::iterator it = mp.find('a');
cout<< it->first << it->second ;

// 新特性
for(auto [x,y]:mp){
    cout << x << y;
}
```



## set（红黑树）

set容器中的元素不会重复，当插入集合中已有的元素时，并不会插入进去，而且set容器里的元素自动从小到大排序（不重复，且有序）

```cpp
#include <set>
int main(){
    set<int> s;
    set<LisetNode*> ss;
}
```

方法和map差不多

排序改变：

```cpp
set<int> s1; // 默认从小到大排序
set<int, greater<int> > s2; // 从大到小排序
```

- `multiset`:元素可以重复，且元素有序
- `unordered_set` ：元素无序且只能出现一次
- `unordered_multiset` ： 元素无序可以出现多次





## unordered_set

```cpp
#include <unordered_set>               

int main() {
    // 1. 初始化哈希集
    unordered_set<int> hashset;   
    // 2. 新增键
    hashset.insert(3);
    hashset.insert(2);
    hashset.insert(1);
    // 3. 删除键
    hashset.erase(2);
    // 4. 查询键是否包含在哈希集合中
    if (hashset.count(2) <= 0) {
        cout << "键 2 不在哈希集合中" << endl;
    }
    // 5. 哈希集合的大小
    cout << "哈希集合的大小为: " << hashset.size() << endl; 
    // 6. 遍历哈希集合
    for (auto it = hashset.begin(); it != hashset.end(); ++it) {
        cout << (*it) << " ";
    }
    cout << "在哈希集合中" << endl;
    // 7. 清空哈希集合
    hashset.clear();
    // 8. 查看哈希集合是否为空
    if (hashset.empty()) {
        cout << "哈希集合为空！" << endl;
    }
}
```



## unordered_map（哈希表）

```cpp
#include <unordered_map>                

int main() {
    // 1. 初始化哈希表
    unordered_map<int, int> hashmap;
    // 2. 插入一个新的（键，值）对
    hashmap.insert(make_pair(0, 0));
    hashmap.insert(make_pair(2, 3));
    // 3. 插入一个新的（键，值）对，或者更新值
    hashmap[1] = 1;
    hashmap[1] = 2;
    // 4. 获得特定键对应的值
    cout << "The value of key 1 is: " << hashmap[1] << endl;
    // 5. 删除键
    hashmap.erase(2);
    // 6. 检查键是否存在于哈希表中
    if (hashmap.count(2) <= 0) {
        cout << "键 2 不在哈希表中" << endl;
    }
    // 7. 哈希表的大小
    cout << "哈希表的大小为: " << hashmap.size() << endl; 
    // 8. 遍历哈希表
    for (auto it = hashmap.begin(); it != hashmap.end(); ++it) {
        cout << "(" << it->first << "," << it->second << ") ";
    }
    cout << "在哈希表中" << endl;
    // 9. 清空哈希表
    hashmap.clear();
    // 10. 检查哈希表是否为空
    if (hashmap.empty()) {
        cout << "哈希表为空！" << endl;
    }
}
```



## pair

pair只含有两个元素，可以看作是只有两个元素的结构体

应用：

- 代替二元结构体
- 作为map键值对进行插入

```cpp
#include<utility>
int main(){
    map<string,int>mp;
    mp.insert(pair<string,int>("cc",1));
    
    pair<string,int> p;
    pair<string,int> p("ccd",2);
    p={"dd",13};
    mp.insert(p);
}
```



## list（双向链表）

list为双向链表容器，支持在任意位置快速插入和删除元素，但不支持随机访问。

```cpp
#include <list>

int main(){
    // 1.初始化
    list<int> a;
    list<char> b{1, 2, 3};
    list<int> c(b); // 拷贝初始化
    
    // 2.二维初始化
    list<list<int>> d;
}
```

方法函数：

| 代码                   | 含义                         |
| :--------------------- | :--------------------------- |
| front()                | 返回第一个元素O(1)           |
| back()                 | 返回最后一个元素O(1)         |
| push_back(element)     | 在尾部插入元素O(1)           |
| push_front(element)    | 在头部插入元素O(1)           |
| pop_back()             | 删除尾部元素O(1)             |
| pop_front()            | 删除头部元素O(1)             |
| size()                 | 返回元素个数O(1)             |
| clear()                | 清空链表O(N)                 |
| insert(it, element)    | 在迭代器it位置插入元素O(1)   |
| erase(it)              | 删除迭代器it位置的元素O(1)   |
| begin()                | 返回指向首元素的迭代器O(1)   |
| end()                  | 返回尾后迭代器O(1)           |
| empty()                | 判断是否为空O(1)             |
| splice(it, other_list) | 将other_list拼接到it位置O(1) |

用法：

```cpp
int main(){
    list<int> l{1, 2, 3};
    
    // 1.插入删除
    l.push_back(4);
    l.push_front(0);
    l.pop_back();
    
    // 2.迭代器遍历
    for(auto it = l.begin(); it != l.end(); ++it) {
        cout << *it << " ";
    }
    
    // 3.智能指针遍历
    for(auto val : l) {
        cout << val << " ";
    }
    
    // 4.插入元素
    auto it = l.begin();
    advance(it, 2); // 移动迭代器
    l.insert(it, 5);
}
```

注意：

- list不支持随机访问，不能使用[]或at()访问元素
- 插入和删除操作不会使迭代器失效（除非指向被删除元素）
- splice操作是list特有的高效操作，可以在常数时间内完成链表拼接



## 重写sort函数lambda表达式

经常需要自定义排序函数，有些情况也会涉及到pair的排序，根据其中某个元素进行排序

在现代C++中一般使用lambda表达式，但是也可以自定义函数等



**自定义比较函数**

```c++
bool myCompare(int a, int b) {
    return abs(a) < abs(b);
}

sort(nums.begin(), nums.end(), myCompare);
```



**lambda表达式**

const& 避免拷贝，提高效率

```c++
sort(nums.begin(), nums.end(), [](const auto& a, const auto& b) {
    return a>b;
});
```



对pair等这种容器比较时如下：

**lambda表达式**

```c++
sort(pairs.begin(), pairs.end(), [](const auto& a, const auto& b) {
    return a.first < b.first;
});
```

假设要更细化一点，就是第一个元素都相等，那就比较第二个

```c++
sort(pairs.begin(), pairs.end(),[](const auto& a, const auto& b) {
    if (a.first != b.first) {
        return a.first < b.first;  
    }
    return a.second < b.second;    
});
```



## string

string是一个字符串类，和char型字符串类似。

```cpp
//头文件
#include<string>

//1.
string str1; //生成空字符串

//2.
string str2("123456789"); //生成"1234456789"的复制品 

//3.
string str3("12345", 0, 3);//结果为"123" ，从0位置开始，长度为3

//4.
string str4("123456", 5); //结果为"12345" ，长度为5

//5.
string str5(5, '2'); //结果为"22222" ,构造5个字符'2'连接而成的字符串

//6.
string str6(str2, 2); //结果为"3456789"，截取第三个元素（2对应第三位）到最后
```

string可以拼接，通过+加号运算符进行拼接



C++ string和C-string的区别

- string 是C++的一个类，专门实现字符串的相关操作，数据类型为string，字符串结尾没有'\0' 字符
- C-string是C语言中的字符串，用char数组实现，类型为const char * ，字符串结尾以'\0' 结尾



c_str()可以实现string向char数组的转换

```cpp
string ss = "sdadasdasd";
char s2[] = ss.c_str();
```

函数方法：

**获取字符串长度**

| 代码                 | 含义                                                       |
| -------------------- | ---------------------------------------------------------- |
| s.size()和s.length() | 返回string对象的字符个数，二者执行效果相同                 |
| s.max_size()         | 返回string对象最多包含的字符数，超出会排除length_error异常 |
| s.capacity()         | 重新分配内存之前，string对象能包含的最大字符数             |

**插入元素**

| 代码                    | 含义                         |
| ----------------------- | ---------------------------- |
| s.push_back('a')        | 在末尾插入字符a              |
| s.insert(s.begin(),'1') | 在第一个位置插入字符1        |
| s.append('abc')         | 在s字符串末尾添加字符串”abc“ |

**删除元素**

| 代码                                | 含义                                            |
| ----------------------------------- | ----------------------------------------------- |
| erase(iterator p)                   | 删除字符串中p所指的字符                         |
| erase(iterator first,iterator last) | 删除字符串中迭代器区间【first，last）上所有字符 |
| erase(pos,len)                      | 删除字符串中从索引位置pos开始的len个字符        |
| clear()                             | 删除字符串中所有字符                            |

**字符替换**

| 代码                   | 含义                                                   |
| ---------------------- | ------------------------------------------------------ |
| s.replace(pos,n,str)   | 把当前字符串从索引pos开始的n个字符替换为str            |
| s.replace(pos,n,n1,c)  | 把当前字符串从索引pos开始的n个字符替换为n1个字符c      |
| s.replace(it1,it2,str) | 把当前字符串【it1，it2）区间替换为str it1，it2为迭代器 |

**大小写转换**

| 代码          | 含义       |
| ------------- | ---------- |
| tolower(s[i]) | 转换为小写 |
| toupper(s[i]) | 转换为大写 |



有4个参数，前2个指定要转换的容器的起止范围，第3个参数是结果存放容器的起始位置，第4个参数是一元运算。

```cpp
string s;
transform(s.begin(),s.end(),s.begin(),::tolower);//转换小写
transform(s.begin(),s.end(),s.begin(),::toupper);//转换大写
```



**分隔字符串**

| 代码            | 含义                       |
| --------------- | -------------------------- |
| s.substr(pos,n) | 截取从pos索引开始的n个字符 |

**查找**

| 代码            | 含义                                                         |
| --------------- | ------------------------------------------------------------ |
| s.find(str,pos) | 在当前字符串的pos索引位置（默认为0）开始，查找子串str，返回找到的位置索引，-1表示查找不到子串 |
| s.find(c,pos)   | 在当前字符串的pos索引位置（默认为0）开始，查找字符c，返回找到的位置索引，-1表示查找不到字符 |

**排序**

```cpp
sort(s.begin(),s.end());
// 按ASCII码排序
```



其中需要注意的就是输入输出，一般acm模式的笔试中就会遇到：

- 遇到空格，回车结束

```
cin >> s;
```

- 读入一行字符串，包括空格，回车结束。getline会获取前一个输入的换行符

```
getline(cin,s);
```

如果有两个输入的话，正确的做法应该如下：

```
int num;
string ss;
cin >> num;
getchar();
getline(cin,ss);
```



## 一些STL常用函数

atoi：将字符串转为int类型，只能转换char型数组

```cpp
string s = "1234";
int a = atoi(s.c_str());
cout << a << "\n"; // 1234
```



iota：让序列递增赋值

```cpp
vector<int> a(10);
iota(a.begin(), a.end(), 0);
for(auto i : a)
    cout << i << " ";
// 0 1 2 3 4 5 6 7 8 9
```



stoi：将字符串s转化为int类型

其他同理





lower_bound + upper_bound

二分查找

```cpp
//在a数组中查找第一个大于等于x的元素，返回该元素的地址
lower_bound(a, a + n, x);
//在a数组中查找第一个大于x的元素，返回该元素的地址
upper_bound(a, a + n, x);

//如果未找到，返回尾地址的下一个位置的地址

```



*max_element + *min_element

```cpp
//函数都是返回地址，需要加*取值
int max_num = *max_element(a, a + n);
int min_num = *min_element(a, a + n);
int max_num = *max_element(res.begin(),res.end());
```



max + min

找多个元素的最大值和最小值

```cpp
//找a，b的最大值和最小值
mx = max(a, b);
mn = min(a, b);

//找到a,b,c,d的最大值和最小值
mx = max({a, b, c, d});
mn = min({a, b, c, d});
```



reverse

对序列进行翻转

```cpp
string s = "abcde";
reverse(s.begin(), s.end());//对s进行翻转
cout << s << '\n';//edcba

//对a数组进行翻转
int a[] = {1, 2, 3, 4};
reverse(a, a + 4);
cout << a[0] << a[1] << a[2] << a[3];//4321

```



sort

对一个序列进行排序

```cpp
//对a数组的[1,n]位置进行从小到大排序
sort(a + 1, a + 1 + n);

//对a数组的[0,n-1]位置从大到小排序
sort(a, a + n, greater<int>());
//对a数组的[0,n-1]位置从小到大排序
sort(a, a + n, less<int>());

//自定义排序，定义比较函数
bool cmp(node a,node b)
{
    //按结构体里面的x值降序排列
    return a.x > b.x;
}
sort(node, node + n, cmp); // 只能接受 以函数为形式的自定义排序规则，无法接受以结构体为形式的自定义排序规则
```



to_string

将数字转化为字符串，支持小数（double）

```cpp
int a = 12345678;
cout << to_string(a) << '\n';
```



