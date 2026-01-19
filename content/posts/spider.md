---
title: "Python爬虫"
description: "关于Python爬虫的一些笔记"
date: 2022-08-17T20:33:58+08:00
draft: false
type: "blog"
tags: [Python]
---

## conception

### Type

1. 通用爬虫

抓取一整张页面内容

2. 聚焦爬虫

通用爬虫基础之上，抓取页面特定的局部内容

3. 增量式爬虫

检测网站中数据更新的情况，只抓取网站中最新更新出来的数据
### 反爬机制

门户网站防止爬虫程序获取数据
### 反反爬机制
破解反爬机制

## 协议
### robots.txt协议
君子协议，规定网站中哪些数据可以被爬虫爬取，哪些不能，没有技术手段
### http协议

服务器和客户端进行数据交互的一种形式
#### 常用请求头信息
1. User-Agent

请求载体的身份标识

2. Connection

请求完毕后，是断开连接还是保持连接

#### 常用响应头信息

1. Content-Type

   服务器响应回客户端的数据类型

### https协议

安全(security)的http协议

#### 加密方式称密钥加密

1. 对称密钥加密

2. 非对称密钥加密

3. 证书密钥加密

## requests模块
### 概述
python原生的一款基于网络请求的模块
### function
模拟浏览器发送请求
### step

指定url -> 发起请求 -> 获取响应数据 -> 持久化存储

```python
import requests	#导入requests
# 指定url
url = 'url'	
# 进行UA伪装
headers = {'User-Agent':'xxx'}	
# 携带参数,post请求为data
params = {}
# 发起get请求，并用response接取返回的对象
response = requests.get(url=url, headers=headers,params=params)
# 获取响应数据
page_text = reponse.text #text(字符串),json(对象),content(二进制)
# 持久化存储
with open('fileName','w',encoding='utf-8') as fp:
	fp.write(page_text)
```
## UA
User-Agent(请求载体的身份标识)
### UA检测
门户网站的服务器检测载体的身份标识
### UA伪装
让爬虫对应的载体身份标识伪装成某一款浏览器

## 数据解析

聚焦爬虫，爬取页面中指定的页面内容
### Theory

1. 进行指定**标签的定位**

2. 标签或者标签对应的属性中存储的数据值进行提取(解析)

### Type

#### 正则

```python
import re
import requests
import os
#创建一个文件夹保存所有图片
if not os.path.exists('./img'):
	os.mkdir('./img')
#指定url
url = ''
#UA伪装
headers = {
    'User-Agent':''
}
#爬取整张页面
page_text = requests.get(url=url,headers=headers)
#使用聚焦爬虫将页面所有图片进行解析/提取
ex = '<div class="thumb">.*?<img src="(.*?)".*?</div>'
# re.S 单行匹配 re.M 多行匹配
img_src_list = re.findall(ex,page_text,re.S)
for src in img_src_list:
    #拼接出一个完整的图片url
    src = 'https:'+src
    #请求图片的二进制数据
    img_data = requests.get(url=src,headers=headers).content
    #生成图片名称
    img_name = src.split('/')[-1]
    #图片的存储路径
    imgPath = './img/'+img_name
    with open(imgPath,'wb') as fp:
        fp.write(img_data)
        print(img_name,'over')
```

#### bs4(python独有)

1. 实例化一个BeautifulSoup对象，并将页面源码加载到该对象

2. 调用beautifulSoup对象中相关的属性和方法进行数据解析和标签定位

```python
import bs4
#1.将本地的html文档数据加载到该对象中
fp = open(file,'r',encoding = 'utf-8')
soup = BeautifulSoup(fp,'lxml')
#2.从互联网上获取的页面源码加载到该对象
page_text = response.text
soup = BeautifulSoup(page_text,'lxml')
#标签定位
soup.tagName	#返回第一个指定标签的所有内容
soup.find(tagName)	#同上
soup.find(tagName,class_='')	#属性定位
soup.find_all()	#用法同上，用列表返回所有符合要求的标签
soup.select(选择器)	#可用类选择器，ID选择器等，返回列表
soup.select('.class'>ul a)	#层级选择，>一个层级，空格多个层级
#获取标签之间的文本数据
soup.a.text/string/get_text()	#string只获取直系内容
#获取标签中的属性值
soup.a['href']
```

#### xpath(main)

最常用，最高效，通用性最强的解析方式

1. 实例化一个etree对象，且将页面源码数据加载到该对象
2. 调用etree对象的xpath方法结合xpath表达式定位标签和内容

```python
from lxml import etree
# 实例化对象
# 1.将本地的html文档数据加载到该对象中
tree = etree.parse(fliePath)
# 2.从互联网上获取的页面源码加载到该对象
page_text = response.text
tree = etree.HTML(page_text)

# 标签定位
r = tree.xpath('/html//div') #返回Element对象列表
# /表示从根节点开始定位，表示一个层级
# //表示多个层级，可以表示从任意位置开始定位

# 属性定位
r = tree.xpath('//div[@class=""]')
# 索引定位，从 1 开始
tree.xpath('//div[@class=""]/p[3]')	

# 取文本
/text()	#获取直系文本
//text()	#获取全部文本
# 取属性
/@attrName
```

##### Question

1. 中文乱码的解决

   ```python
   text = text.encode('iso-8859-1').decode('gbk')
   or
   result = response.content.decode('utf-8')
   ```


## 登录模拟

爬取某些用户的**用户信息**

### 验证码识别

反爬机制

模拟登录需要**识别**验证码图片中的数据

使用库`ddddocr`，也可以用pytorch自己写神经网络

```python
import ddddocr

ocr = ddddocr.DdddOcr()

with open('img.png','rb') as img:
    img_bytes = img.read()
    
result = ocr.classification(img_bytes)
print(result)
```

### 模拟登录

1. 将验证码图片进行本地下载
2. 调用验证码处理库进行数据识别
3. 发送post请求，处理请求参数
4. 响应数据持久化存储

```python
# 获取验证码图片

# 识别验证码

# 发送post请求，模拟登录

# 验证登录是否成功
print(response.status_code)
```

### Cookie

让服务端记录客户端的相关状态

1. 手动Cookie处理

   ```python
   # 抓包获取Cookie值
   headers = {
       'Cookie':'xxx'
   }
   ```

2. 自动处理

   使用session会话对象，如果请求过程中产生了Cookie，则会被自动存储/携带在该session对象中

   ```python
   # 创建session对象
   session = requests.Session()
   
   # 使用session发送post请求
   response = session.post(url=url,headers=headers,data=data)
   
   # 使用携带cookie的session发送get请求
   page_text = session.get().text
   ```

## 代理

破解**封IP**的反爬机制

代理可以突破自身IP访问的限制，隐藏自身真实IP

```python
requests.get(url=url, headers=headers, proxies={'http':ip_address})
```

### 代理类型

协议类型

1. http ：应用于http协议对应的url
2. https ：应用于https协议对应的url

匿名度

1. 透明：服务器知道该次请求使用了代理，也知道请求对应的真实ip
2. 匿名：服务器知道使用了代理，但是不知道真实ip
3. 高匿：不知道使用了代理和真实ip

## 异步

1. 多线程 多进程 :x:

   为阻塞的操作单独开启线程或进程，

   但不能无限制的开启多线程或多进程

2. 线程池 进程池

   降低系统对进程或线程创建销毁的频率，从而降低系统开销

   池中线程或进程的数量有上限

   ```py
   # 导入线程池模块的类
   from multiprocessing.dummy import Pool
   
   # 实例化线程池对象
   pool = Pool(4)
   # 将list每一个元素传递给func进行处理
   pool.map(func, list)
   
   # pool不在接受新工作
   pool.close()
   # 当所有任务完成后，清空pool
   pool.join()
   ```

3. 单线程 + 异步协程 \*

   ```python
   
   # async 修饰函数, 调用后返回协程对象
   async def request(url):
       print('发起请求')
       return url
   
   c = request(url)
   
   # 创建一个事件循环对象
   loop = asyncio.get_event_loop()
   
   # 将协程对象注册到loop, 并且启动loop
   # loop.run_until_complete(c)
   
   # task的使用
   task = loop.create_task(c)
   loop.run_until_complete(task)
   # 多任务列表
   loop.run_until_complete(asyncio.wait(tasks))
   
   # future的使用
   task = loop.ensure_future(c)
   loop.run_until_complete(task)
   
   # 绑定回调
   def callback_func(task):
       # result返回 任务对象中封装的协程对象对应的函数的返回值
       print(task.result())
   # 将回调函数绑定到任务对象
   task.add_done_callback(callback_func)
   ```

### Question

1. 在异步协程中，如果出现**同步模块**相关的代码，那么就无法实现异步

   ```python
   # 基于同步
   response = requests.get(url=url)
   
   # 使用aiohttp: 基于异步网络请求模块
   async def get_page(url):
       async with aiohttp.ClientSession() as session:
           # get() post()
           # headers,data/params,proxy='http://ip:port'
           async with session.get(url=url) as response:
               # text() 返回字符串数据
               # read() 返回二进制数据
               # json() 返回json对象数据
               page_text = await response.text()
   ```

2. 当在 asyncio 中遇到阻塞操作必须手动挂起

   ```python
   page_text = await response.text()
   ```


### 异步协程的流程

1. 创建**异步请求模块**

   ```python
   # 调用该方法时返回协程对象
   async def get_page(url):
       async with aiohttp.ClientSession() as session: 
           async with session.get(url=url) as response:
               page_text = await response.text()
               # 返回值为任务对象的result()
               return page_text
   ```

2. 获取**协程对象**

   ```python
   c = get_page(url)
   ```

3. 获取**任务对象**

   ```python
   task = asyncio.ensure_future(c)
   ```

4. 为任务对象**绑定回调**函数

   ```python
   def callback_func(task):
       print(task.result)
   # 在task成功完成后，会自动触发回调函数
   task.add_done_callback(callback_func)
   ```

5. 创建**事件循环**对象，注册任务并启动

   ```python
   loop = asyncio.get_event_loop()
   loop.run_until_complete(asyncio.wait(tasks))
   ```

## Selenium

基于浏览器**自动化**的模块

### 优点

1. 便捷的获取网站中**动态加载的数据**
2. 便捷实现**模拟登录**

### 使用流程

1. 环境安装 ```pip install selenium```

2. 下载浏览器的驱动程序

3. 实例化一个浏览器对象

   ```python
   from selenium import webdriver
   bro = webdriver.Edge()
   ```

4. 编写自动化操作代码

### 操作代码

1. 让浏览器对url发起请求

   ```python
   bro.get(url)
   ```

2. 获取浏览器页面源码数据

   ```python
   page_text = bro.page_source
   ```

3. 标签定位

   ```python
   search_input = bro.find_element_by_id(id)
   ```

4. 标签交互

   ```python
   search_input.send_keys('xxx')
   ```

5. 点击事件

   ```python
   button = bro.find_element_by_css_selector('css')
   button.click()
   ```

6. 执行js代码

   ```py
   bro.execute_script('js')
   ```

7. 回退与前进

   ```python
   bro.back()
   bro.forward()
   ```

8. 关闭浏览器

   ```python
   bro.quit()
   ```

9. 切换浏览器标签定位的作用域

   ```python
   # 定位iframe中的标签
   bro.switch_to.frame('iframe')
   ```

### 动作链

```python
# 导入动作链对应的类
from selenium.webdriver import ActionChains
# 动作链
action = ActionChains(bro)
# 释放动作链
action.release()
```

### 无头浏览器

```python
from selenium.webdriver.edge.options import Options
 
# 无头浏览器，就是让浏览器在后台运行，不用弹出窗口。

opt = Options()
# 无头浏览器配置 
# 使用无头模式
opt.add_argument("--headless")
# 禁用GPU，防止无头模式出现莫名的BUG
opt.add_argument("--disbale-gpu")

# 反检测设置
# 开启开发者模式
opt.add_experimental_option('excludeSwitches', ['enable-automation'])
# 禁用启用Blink运行时的功能
opt.add_argument('--disable-blink-features=AutomationControlled')

# 创建浏览器对象,把参数配置设置到浏览器中
browser = webdriver.Edge(options=opt) 
```

## Scrapy框架

### 项目初始化

1. 创建项目

   ```shell
   scrapy startproject projectName
   ```

2. 进入工程目录

   ```shell
   cd projectName
   ```

3. 在`spiders`子目录中创建爬虫文件

   ```shell
   scrapy genspider spiderName url
   ```

4. 执行工程

   ```shell
   scrapy crawl spiderName
   ```

### 爬虫文件

```py
class NameSpider(scrapy.Spider):
    # 爬虫文件的名称，爬虫源文件的唯一标识
    name = 'name'
    # 允许的域名，用于限定start_urls列表中哪些url可以进行请求发送
    allowed_domains = ['www.xx.com']
    # 起始的url列表，该列表中的url会自动进行请求发送
    start_urls = ['https://www.xx.com/']
    
# 用作与数据解析，response参数表示请求成功后对应的响应对象
# 该方法调用的次数，为start_urls列表的长度
def parse(self, response):
    pass
```

### 数据解析

1. xpath提取内容

   ```python
   # xpath返回列表，且列表元素为 Selector 对象
   txt_list = response.xpath()
   for txt in txt_list:
       # extract可以将Selector对象中data参数存储的字符串提取出来
       print(txt.xpath()[0].extract())
       # 列表只有一个元素时，可以使用extract_first，等价于上句
       print(txt.xpath().extract_first())
       # 列表调用extract,将列表中的每一个Selector对象的data参数提取出来，并返回列表
       print(txt.xpath().extract())
   ```

2. 持久化存储

   - 基于终端命令

     只可以将`parse`方法的返回值存储到本地文本

     文件类型只可以为 `json` `jsonlines` `jl` `csv` `xml` `marshal` `pickle` 

     ```shell
     scrapy crawl spiderName -o filepath.csv
     ```

   - 基于管道

     在`item`类中定义相关属性

     ```python
     class NameItem(scrapy.Item):
         field = scrapy.Field()
     ```

     将解析的数据封装存到`item`类型对象中

     ```python
     # 封装解析的数据
     item = NameItem()
     item['field'] = value
     # 将item提交给管道
     yield item
     ```

     在管道类的`process_item`中将接受的`item`的数据进行持久化存储

     ```python
     class NamePipeline(object):
         fp = None
         # 重写父类方法，该方法只在爬虫开始时被调用一次
         def open_spider(self, spider):
             # 避免文件被多次打开
             self.fp = open(filepath, 'w', encoding)
         # 该方法只在爬虫结束时被调用一次
         def close_spider(self, spider):
             self.fp.close()
             
         # 该方法接收到一个item，调用一次
         def process_item(self, item, spider):
             field = item['field']
             self.fp.write(field)
             return item
     ```

     在配置文件中开启管道

     ```python
     ITEM_PIPELINES = {
         # 数字表示优先级，数字越小优先级越高
         'Name.pipelines.NamePipeline': 300
     }
     ```

3. 全站数据爬取

   将网站某板块下的**全部页码**对应的页面数据进行爬取

   ```python
   class NameSpider(scrapy.Spider):
       name = 'name'
       # 生成一个通用的url模板
       url = 'https://www.xx.com/page/%d'
       page_num = 1
       
       def parse(self, response):
           txt = response.xpath().extract_first()
           if(self.page_num < 11):
               self.page_num += 1
               new_url = format(self.url%self.pafe_num)
               # 手动发送请求,callback回调函数专门用作数据解析
               yield scrapy.Request(url=new_url, callback=self.parse)
   ```

4. 请求传参

   ```python
   # meta参数可以将字典传递给回调函数
   scrapy.Request(url=url, callback=self.parse, meta={'item':item})
   ```

5. ImagesPipeline

   只需要将img的`src`提交到管道，管道就会自动发起请求获取二进制数据，且持久化存储

   1. 解析图片地址
   2. 将存储图片地址的`item`递交给管道类
   3. 管道类中制定一个基于`ImagesPipeline`的类
      - get_media_requests
      - file_path
      - item_completed
   4. 配置文件
      - 指定图片存储目录 `IMAGES_STORE='path'`
      - 开启管道类 

   ```python
   item = imgItem()
   item['src'] = src
   yield item
   ```

   ```py
   from scrapy.pipelines.images import ImagesPipeline
   class ImgPipeline(ImagesPipeline):
       # 对图片地址请求
       def get_media_requests(self, item, info):
           yield scrapy.Request(item['src'])
       # 指定图片存储路径
       def file_path(self, request, response=None, info=None):
           imgName = request.url.split('/')[-1]
           return imgName
       # 将item返回给下一个即将被执行的管道类
       def item_completed(self, results, item, info):
           return item
   ```

   ```python
   # settings
   IMAGES_STORE = './imgs'
   ```

### 中间件

下载中间件

- file：middlewares.py

- 拦截整个工程所有的请求和响应
- 拦截请求
  - UA伪装
  - 代理IP
- 拦截相应
  - 篡改响应数据

#### 拦截请求

process_request

```python
class NameDownloaderMiddleWare(Object):
    # 封装UA池
    user_agent_list = []
    def process_request(self, request, spider):
        # UA伪装
        request.headers['User-Agent'] = random.choice(self.user_agent_list)
        return None
```



#### 拦截相应

process_response

#### 拦截异常

process_exception

```python
class NameDownloaderMiddleWare(Object):
    # 封装代理ip池
    proxy_http = []
    proxy_https = []
    def process_exception(self, request, exception, spider):
        # 代理
        if request.url.split(':')[0] == 'http':
       		request.meta['proxy'] = 'http://'+random.choice(self.proxy_http)
        else:
            request.meta['proxy'] = 'https://'+random.choice(self.proxy_https)
        # 将修正后的请求对象重新发送
        return request
```

### CrawlSpier

Spier的一个子类，用于全站数据爬取

#### 创建爬虫文件

`scrapy genspier -t crawl xxx www.xxx.com`

1. 链接提取器

   `link = LinkExtactor(allow=r'Items/')`

   根据指定规则，提取指定链接

   `allow`后为正则表达式

2. 规则提取器

   将链接提取器提取的链接，进行指定规则`callback`的解析操作

3. follow

   True 可以将链接提取器作用到新提取出的链接中(递归)
