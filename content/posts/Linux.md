---
title: "Linux"
description: "Linux的一些命令记录"
date: 2023-03-21T14:33:58+08:00
draft: false
type: "blog"
tags: [other]
---

## 系统目录结构

- /
	- **/bin** 存放最常使用的命令
	- /sbin s为super user，存放系统管理员使用的系统管理程序
	- **/home** 存放普通用户的主目录
	  - /alice
	  - /bob
	  - /eve
	- **/root** 系统**管理员**的用户主目录
	- /lib 动态链接共享库
	- /lost+found 系统非法关机后存放一些文件，一般为空
	- **/etc** **配置文件**目录
	- **/usr** 应用程序和文件存放目录
	  - **/local** 给主机额外安装软件所**安装的目录**
	- **/boot** **启动**Linux使用的一些核心文件，包括一些链接文件及镜像文件
	- /proc **系统内存**的映射
	- /srv service，服务启动之后需要提取的数据
	- /sys 
	- /tmp 存放**临时文件**
	- /dev 把所有**硬件(device)**用文件的形式存储
	- **/media** 把识别的设备(如U盘，光驱等)挂载到此目录下
	- **/mnt** 让用户临时挂载别的文件系统，可以将外部存储挂载在/mnt/上
	- /opt 给主机额外**安装软件**所摆放的目录 
	- **/var** 存放不断被扩充的内容，包括各种**日志文件**
	- /selinux security-enhanced linux 安全子系统

## 系统重要文件

### 系统网卡配置文件

#### 文件路径

系统网卡文件默认名称 /etc/sysconfig/network-scripts/ifcfg-ens33

系统网卡文件常用名称 /etc/sysconfig/network-scripts/ifcfg-eth0

#### 文件介绍

这是Linux系统第一块网卡的配置文件所在路径，其中第一块网卡配置文件的结尾标识为eth0(ens33)，第二块为eth1(ens34)，以此类推

执行 **nmtui** 命令来修改网卡配置时，实际上是在编辑 /etc/sysconfig/network-scripts/ifcfg-eth0 这个文件

#### 文件信息

```shell
TYPE=Ethernet
-- 上网类型，目前都是以太网

BOOTPROTO=none
-- 启动协议，获取配置方式，有none|bootp|dhcp三种配置

DEFROUTE=yes
-- 使用默认路由(可以保证主机正常访问互联网)

NAME=eth0
-- 第一块网卡的逻辑别名，第二块为eth1

UUID=xxxxxxxxxxxxxx
-- 通用唯一标识码

ONBOOT=yes
-- 保证下次开机启动时激活网卡设备

IPADDR=10.0.0.0
-- IP地址

PREFIX=24
-- 子网掩码数，这里是24位

GATEWAY=10.0.0.254
-- 网关地址

DNS1=223.5.5.5
DNS2=223.6.6.6
-- 主DNS，默认覆盖以及优先于/etc/resolv.conf的配置生效
```

#### 文件生效

1. 重启网络服务，使**所有网卡**的配置文件生效

   ```shell
   systemctl restart network
   or
   service restart network
   ```

2. 只需让单独的ethX网卡配置生效

   ```shell
   #常规用法
   ifdown eth0 && ifup eth0
   ## && 前一条命令操作成功后，操作后一条命令
   
   #扩展用法
   nmcli con down eth0 && nmcli con up eth0
   ```

### 域名解析文件

#### DNS客户端配置文件

path /etc/resolv.conf

负责将网站域名解析为对应的IP地址

```shell
nameserver 223.5.5.5
nameserver 223.6.6.6
-- 表明DNS服务器的IP地址
-- 查询时按照nameserver在本文件的顺序进行，且只有当第一个nameserver没有反应时，才查询下面的nameserver
```

#### DNS客户端解析文件

path /etc/hosts

此文件设定IP与域名的对应解析表

```shell
127.0.0.1 xxx.com
```

### 系统主机名称配置文件

path /etc/hostname

此文件为CentOS7系统主机名称的永久配置文件，可以实现主机名称的修改调整

```shell
name.linux
```

需要重新启动，才能使配置生效

### 变量配置文件

#### 文件路径

```shell
# 全局配置文件
/etc/profile
/etc/bashrc

# 局部配置文件
~/.bash_profile
~/.bashrc
```

#### 文件介绍

系统变量，系统环境变量，以及系统别名功能进行永久配置生效的文件

全局配置文件：对系统中**所有**用户生效

局部配置文件：对系统中**指定**用户生效

#### 文件加载的优先顺序

1. 用户家目录中的.bash_profile
2. 用户家目录中的.bashrc
3. /etc/bashrc
4. /etc/profile

#### 文件生效

1. 重新连接系统主机

2. 操作命令

   ```shell
   source /etc/profile
   or
   . /etc/profile
   ```

#### 设置变量

```shell
# 普通变量
name = Linux
变量名 = 变量值

# 环境变量
export NAME = Linux
声明 变量名 = 变量值
```

注：只有编辑配置文件才会永久生效，以上的操作方法是**临时生效**

#### 调用变量

```shell
# 普通变量
echo $NAME

# 环境变量
env
or
set
```

### 系统别名配置

系统中的别名就是将比较复杂或参数信息繁琐的命令，进行简化输入的方式

- 将危险的命令加一些保护参数，防止误操作
- 将很多复杂的字符串或命令变为一个简单的字符串或命令

#### 设置系统别名

```shell
# 临时配置别名
alias ipinfo01='grep "IPADDR" /etc/sysconfig/network-scripts/ifcfg-eth0'

# 永久配置别名
将上面的信息配置在环境变量配置文件中

# 临时取消别名功能
# 1. 使用绝对路径执行命令
/bin/cp xx xx
# 2. 使用转义符来执行命令
\cp xx xx

# 永久取消别名功能
unalias ipinfo01

```

### 信息提示文件

#### 登录终端前的信息提示

path：/etc/issue /etc/issue.net

此文件的作用是显示用户登录真实终端前的提示信息

企业环境中为了防止服务器版本泄露，一般会将其中的内容情况

#### 登录终端后的信息提示

path：/etc/motd

### 系统内核配置文件

path：/etc/sysctl.conf

设置Linux内核参数，可以用来替代系统默认运行的内核参数，让系统运行得更高效

#### 查看文件内容

```shell
sysctl -a
```

#### 文件生效

```shell
sysctl -p
```

### 日志文件存放目录

path：/var/log

此目录包含了记录系统及软件服务运行的日志文件，可以知道系统的运行情况以及故障原因

#### 目录信息

1. /var/log/message

   默认日志文件，系统及服务运行故障时，可以查看这个文件获取故障信息

2. /var/log/secure

   系统安全的日志文件，会记录“谁，什么时候，从哪，登录系统，是否成功”

3. /var/log/dmesg

   硬件及系统内核出现问题时，可以查看这个日志文件

### 系统硬件信息加载与存放目录

path：/proc

#### 目录信息

1. /proc/cpuinfo

   ```shell
   # 当前CPU信息文件(cat /proc/cpuinfo or lscpu)
   
   physical id :0
   -- cpu个数
   
   cpu cores :1
   -- 一个cpu的核数
   ```

2. /proc/meminfo

   ```shell
   # 当前内存信息(cat /proc/meminfo or free)
   
   MemTotal: xxx kB
   -- 系统总内存容量
   
   MemAvailable: xxx kB
   -- 系统可用内存容量
   ```

3. /proc/loadavg

   ```shell
   # 当前系统的平均负载情况(cat /proc/loadavg or uptime)
   
   0.00 0.01 0.05 2/114 1680
   -- 前三个数字分别是1，5，15分钟内的平均进程数
   -- 分子是正在运行的进程数，分母是进程总数
   -- 最近运行的进程ID
   ```

   

### 用户登录后执行脚本所在目录

path：/etc/profile.d/

**加载系统登录程序**的目录，也是用户**登录后执行的脚本**所在的目录，目录内的程序以文件的形式存在(一般以**sh**为扩展名)

## 远程操作

### 远程登录 - XShell
需要Linux启用SSHD服务，该服务会监听22端口 
### 上传下载 - XFtp

## vi和vim编辑器

### 三种常见模式

1. 正常模式
	- #vim xxx 使用vim打开一个文件时默认模式，也叫命令模式，允许用户通过各种命令浏览代码、滚屏等操作
2. 插入/编辑模式
	- 使用vim打开一个文件时默认模式，也叫命令模式，允许用户通过各种命令浏览代码、滚屏等操作
3. 命令模式
	- 在普通模式下，先输入冒号:，接着输入命令，就可以通过配置命令对vim进行配置了，如改变颜色主题、显示行号等
4. 可视化模式
	- 在普通模式下敲击前盘上的 v 键，就进入可视化模式，然后移动光标就可以选中一块文本，常用来完成文本的复制、粘贴、删除等操作
5. 替换模式
	- 如果我们想修改某个字符，不需要先进入插入模式，删除，然后再输入新的字符，直接在普通模式下，敲击R键就可以直接替换

### vim命令

![vim键盘命令图](https://pic2.zhimg.com/v2-f796a4d852827d7d2883b9a6ed3f7a49_b.jpg)

#### 光标移动命令

1. 单个字符移动
   1. h：左移
   2. l：右移
   3. j：下移
   4. k：上移
   5. xh：左移x个字符

2. 单词移动
   1. w：光标移动到下个单词的开头
   2. b：光标移动到前一个单词的开头
   3. e：光标移动到下一个单词的末尾
   4. E：移动到单词的结尾
   5. ge：移动到上个单词的词末
   6. 2w：指定移动的次数

3. 行移动
   1. $：光标移动到当前行的行末
      - :set list 打开末尾行号$
   2. 0：光标移动到当前行的行首
   3. ^：光标移动到当前行的第一个**非空**字符
   4. 2|：移动到当前行的第2列
   5. fx：光标移动到当前行的第1个字符x上
   6. 3fx：光标移动到当前行的第3个字符x上
   7. tx：光标移动到目标字符x的前一个字符上
   8. fx和tx可以通过 ; 和 , 进行重复移动，一个正向一个反向
   9. %：用于符号间的移动，它会在一对括号间跳跃

4. 文本块移动：
   1. (：  移到当前句子的开头
   2. ):  移到下一个句子的开头
   3. {:  移到当前一段的开头
   4. }:  移到下一段的开头
   5. [[:  移到当前这一节的开头
   6. ]]:  移到下一节的开头

5. 在屏幕中移动
   1. xG:  跳转到指定的第x行，G移动到文件按末尾，``（2次单引号)返回到跳转前的位置
   2. gg:  移动到文件开头
   3. x%:  移动到文件中间，就使用50%
   4. H:  移动到home
   5. M:  移动到屏幕中间
   6. L:  移动到一屏末尾

6. ctrl+G:  查看当前的位置状态

#### 滚屏与跳转

1. 半屏滚动:  ctrl+u/ctrl+d
2. 全屏滚动:  ctrl+f/ctrl+b
3. 定位光标的位置
  1. zz:  将光标置于屏幕的中间
  2. zt:  将光标移动到屏幕的顶部
  3. zb:  将光标移动到屏幕的底部
4. 设置跳转标记
  - mx,my,mz设置三个位置
  - `x, `y,`z跳转到设置

#### 文本插入操作

5. i:  在当前光标的前面插入字符
6. a:  在当前光标的后面追加字符
7. o:  在当前光标的下一行行首插入字符
8. I:  在一行的开头添加文本
9. A:  在一行的结尾处添加文本
10. O:  在光标当前行的上一行插入文本
11. s:  删除当前光标处的字符并进入到插入模式
12. S:  删除光标所在处的行，并进入到插入模式
13. u:  撤销修改

#### 文本删除操作

1. 字符删除
	1. x:  删除当前光标所在处的字符
	2. X:  删除当前光标左边的字符
2. 单词删除
	1. dw:  删除一个单词(从光标处到空格)
	2. daw:  无论光标在什么位置，删除光标所在的整个单词(包括空白字符)
	3. diw:  删除整个单词文本，但是保留空格字符不删除
	4. d2w:  删除从当前光标开始处的2个单词
	5. d$:  删除从光标到一行末尾的整个文本
	6. d0:  删除从光标到一行开头的所有单词
	7. dl:  删除当前光标处的字符=x
	8. dh:  删除当前光标左边的字符=X
3. 行删除
	1. dd:  删除当前光标处的一整行=D
	2. 5dd:  删除从光标开始处的5行代码
	3. dgg:  删除从光标到文本开头
	4. dG:  删除从光标到文本结尾
4. 行合并
	1. J:  删除一个分行符，将当前行与下一行合并

#### 文本复制、剪切与粘贴

1. y:  复制，p:粘贴
2. yw:  复制一个单词
3. y2w:  复制2个单词
4. y$:  复制从当前光标到行结尾的所有单词
5. y0:  复制从当前光标到行首的所有单词
6. yy:  复制一整行
7. 2yy:  复制从当前光标所在行开始的2行
8. p :  粘贴

- 复制文本块
  1. 首先进入visual模式：v
    2. 移动光标选择文本
    3. 复制与粘贴的操作

#### 文本的修改与替换

1. cw:  删除从光标处到单词结尾的文本并进入到插入模式
2. cb:  删除从光标处到单词开头的文本并进入到插入模式
3. cc:  删除一整行并进入到插入模式
4. ~： 修改光标下字符的大小写
5. r:  替换当前光标下的字符
6. R:  进入到替换模式
7. xp:  交换光标和下一个字符

#### 文本的查找与替换

1. /string   正向查找
    - /string\c 查找且忽略大小写
    - :set ic 开启忽略大小写功能
    - :set noic 取消忽略大小写
2. ?string   反向查找
3. 设置高亮显示
    - :set hls
    - :set noh 取消高亮
    - *按键将当前光标处的单词高亮显示，使用n浏览下一个查找高亮的结果
4. :s/old/new   将当前行的第一个字符串old替换为new
5. :s/old/new/g   将当前行的所有字符串old替换为new
6. :90s/old/new/g  将指定行的所有字符串old替换为new
7. :90,93s/old/new/g  将指定范围的行的所有字符串old替换为new
8. :%s/old/new/g   将文本中所有的字符串old替换为new
9. :%s/old/new/gc  依次替换每个字符串关键字
10. :%s/^struct/int/g   将所有以struct开头的字符串替换为int

#### 撤销修改、重做与保存

1. u:  撤销上一步的操作。
2. Ctrl+r:  将原来的插销重做一遍
3. U：  恢复一整行原来的面貌（文件打开时的文本状态）
4. q:  若文件没有修改，直接退出
5. q!:  文件已经被修改，放弃修改退出
6. wq:  文件已经被修改，保存修改并退出
7. e!:  放弃修改，重新回到文件打开时的状态

#### 编辑多个文件
文件和缓冲区的区别:

文件是保存在磁盘上的，而打开的文件的文件是在内存中，在内存中有一个缓冲区，用来存放打开的文件。vim每次打开文件时都会创建一个缓冲区，vim支持打开多个文件

1. :buffers   查看缓冲区列表==ls
2. :buffer N  根据缓冲区列表的编号跳转到指定缓冲区
3. :bnext/bprev  遍历缓冲区列表
4. :bfirst/blast  分别调到缓冲区列表的开头和结尾
5. :write   将缓冲区的修改保存到磁盘上
6. :edit! e!  放弃缓冲区的修改，恢复到文件打开时的状态
7. :edit file  编辑另一个文件
8. :wnext   保存当前缓冲区的修改并跳转到缓冲区列表中的下一个文件
9. :set autowrite

#### 标签页与折叠栏

1. 标签页的新建：tabedit file/tab split
2. 标签页的切换: tabn/tabp
3. 按键：gt/gT
4. 标签页的关闭：tabclose 
5. 关闭当前的标签页: tabonly
6. 创建一个折叠：zf200G:将光标和200行之间的代码折叠起来
7. 折叠的打开与关闭
    1. za:  打开和关闭折叠
    2. zr/zm: 一层一层地打开和关闭折叠
    3. zR/zM: 分别打开和关闭所有的折叠
8. 折叠键的光标移动
    1. zj: 跳转到下一个折叠处
    2. zk: 跳转到上一个折叠处
9. 删除折叠
    1. zd: 删除光标下的折叠
    2. zD: 删除光标下的折叠以及嵌套的折叠
    3. zE: 删除所有的折叠标签
    4. 创建的折叠当退出vim之后就失效了。

#### 多窗口操作

1. 分割窗口
    1. split/vsplit filename
2. 窗口间跳转
    1. ctrl+w hjkl
    2. ctrl+w w
3. 移动窗口
    1. ctrl+w HJKL
4. 调整窗口尺寸
    1. ctrl+w +/-  调整窗口的高度
    2. ctrl+w </>  调整窗口的宽度
    3. ctrl+w = 所有的窗口设置相同的尺寸
    4. :resize n将当前窗口尺寸调整为N行
5. 关闭窗口
    1. close: 关闭一个窗口
    2. qall: 退出所有窗口
    3. qall!: 放弃修改，退出所有窗口
    4. wqall: 保存并退出所有窗口
    5. wall: 保存所有窗口

## 关机重启

1. shutdown
  1. shutdown -h now： 立即关机
  2. shutdown -h 1： 一分钟后关机
  3. shutdown -r now： 立即重启
  4. shutdown -c：取消正在执行的shutdown命令
2. halt：关机
3. reboot：重启
4. sync：关机和重启时，先执行sync，将内存的数据写入磁盘

## 用户管理

### 家目录

/home/目录下有各个用户对应的家目录，登陆后会自动进入自己的家目录
### 指令
#### 添加用户
​	`useradd [选项] usename`

创建用户成功后，会自动创建和用户同名的家目录，也可以通过`useradd -d 指定目录 username`指定家目录

#### 指定密码

​	`passwd username` // 给username修改密码
#### 删除用户

​	`userdel username`	// 删除用户但保留家目录

	userdel -r username // 删除用户及家目录，一般不删家目录
#### 查询用户信息
​	`id username`
#### 切换用户
​	`su - username`

权限高切到权限低无需密码，反之需要，返回原来用户使用exit指令
#### 查看当前用户
​	`whoami/who am i`
### 用户组
系统可以对有共性的多个用户进行统一管理
#### 增加组
​	`groupadd groupname`
#### 删除组
​	`groupdel groupname`
#### 增加用户时指定组
​	`useradd -g groupname username`
#### 修改用户的组
​	`usermod -g groupname username`
### 用户和组的相关文件

#### /etc/passwd
用户配置文件，记录用户的各种信息

每行的含义：用户名(username):口令(passwd):用户标识号(uid):组标识号(gid):注释性描述:主目录(家目录):登录shell
#### /etc/shadow
口令配置文件

每行含义：登录名:加密口令:最后一次修改时间:最小时间间隔:最大时间间隔:警告时间:不活动时间:失效时间:标志
#### /etc/group
组配置文件

每行含义：组名:口令:组标识号(gid):组内用户列表

## 组管理
### 查看文件/目录所在组
​	ls -ahl
### 修改文件所有者
​	chown user file
### 修改文件所在组
​	chgrp group file

## 文件

### 基本介绍

![](https://img-blog.csdnimg.cn/2c84666be08b433081c9abe8b5efa211.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAc3FqZGRi,size_20,color_FFFFFF,t_70,g_se,x_16)

1. 第0位确定文件类型
2. 第1-3位确定所有者的权限
3. 第4-6位确定所属组的权限
4. 第7-9位确定其他用户的权限

### 索引节点 -inode

用于定位文件数据存储到磁盘的位置

系统读取文件首先通过文件名找到inode号码，然后才能读取到文件

### 文件的类型

#### 扩展名

Linux不通过扩展名来区分文件类型，而是通过设置文件属性的方式确定文件类型，扩展名是为了让用户区分文件类型

- .rpm CentOS/Redhat版本系统二进制软件程序包文件

- .tar.gz 压缩包文件

- .sh shell脚本文件

- .conf 服务系统的配置文件

- .log 系统或服务程序的配置文件

####  文件类型分类

1. \- regular file ，普通文件，包含纯文本，二进制文件，数据文件
2. d directory，目录
3. l link，符号链接或软连接，相当于快捷方式
   - 创建软链接 ln -s source linkedfile
4. c character，字符设备文件
5. b block，块设备文件，如硬盘，光驱
6. s socket，套接字文件，进程通信时会使用
7. p named pipe，管道文件

#### 文件类型查看命令

```shell
file [option] [file]
```

### 文件数据检索

1. which

   此命令用于显示命令的全路径，查找范围是PATH环境变量的路径

   ```shell
   which [option] [programname]
   ```

2. whereis

   此命令用于定位指定命令的的可执行文件，源代码以及man帮助文件的路径

   ```shell
   whereis [option] [filename]
   ```

   - -b 查找可执行文件
   - -m 查找man帮助文件
   - -s 查找源代码文件

3. locate

   linux系统中有一个名为```mlocate.db```的数据文件，包含系统文件的文件名以及对应的路径信息

   locate命令直接查找该文件，而非遍历磁盘

   新添加的文件可能没有记录，需要使用```updatedb```命令更新该文件

   ```shell
   # install
   yum install mlocate
   
   # locate [option] [file]
   ```

   - -c 不显示匹配内容，只显示**匹配数量**
   - -i 忽略大小写
   - -r 支持基本正则表达匹配
   - --regex 支持扩展正则表达匹配

4. find

   用于查找目录下的文件，同时可以调用其他命令执行操作

   ```shell
   find [pathname] [option] [expression]
   ```

   **Option**

   - -depth 从指定目录下最深层的子目录开始查找
     - -maxdepth levels 查找的最大目录级数，levels为自然数
     - -mindepth levels 查找的最小目录级数，levels为自然数
   - -mtime [-n|n|+n] 按照文件的**修改时间**来查找文件
     - -n 表示文件更改时间距现在n天以内
     - +n 表示文件更改时间距现在n天以前
     - n 表示距现在第n天
     - -atime [-n|n|+n]根据文件的**访问时间**查找文件
     - -ctime [-n|n|+n]根据文件的**状态改变时间**来查找文件
     - -amin 同上，单位为分钟
     - -cmin
     - -mmin
   - -group 根据文件所属的**组**查找文件
   - -name 根据**文件名**查找，只支持```*,?,[]```等特殊通配符
   - -newer 查找更改时间比指定文件新的文件
   - -path pattern 指定路径样式，配合-prune参数排除指定目录
   - -perm 按照**文件权限**来查找文件
   - -size n[cwbkMG] 查找**文件长度**为n大小的文件
   - -type 根据**文件类型**查找文件

   **Action**

   - -delete 删除查找出的文件**(慎用)**
   - -exec 对匹配的文件执行该参数给出的执行命令
   - -ok 同-exec，但执行前会让用户来确认
   - -prune 排除特殊指定目录
   - -print 将匹配的文件输出到标准输出(默认功能)

   **Operators**

   - ! 取反进行查找数据
   - -a 取交集，and
   - -o 取并集，or

### 文件数据压缩

```tar```命令是linux系统中将多个文件打包在一起并实现将打包文件解压的命令

```shell
tar [option] [file]
tar 参数 数据包.tar.gz 需要打包的数据
```

tar命令的参数前面不加```-```也可正常使用

- 方式

  - z 通过**gzip**方式压缩或解压

  - j 通过**bzip2**方式压缩或解压

- 查看内容

  - v 显示详细的数据内容
  - t **不解压只查看**tar包内的数据信息

- 压缩解压

  - x **解压**tar包
  - c **创建**新的tar包

- 路径

  - f 指定压缩文件的名字和路径信息
  - -C 指定解压的**目录路径**(不加C解压到当前目录)

- p 保持文件的原有属性
- P 以绝对路径打包，危险参数
- 排除
  - --exclude=PATTERN 排除不需要处理的目录或文件
  - -X 文件名 从指定文件读取不需要处理的文件或目录列表
  - -N 时期 仅打包比指定日期新的文件
- h 打包链接文件时，将打包源文件，而非链接文件

### 文件的权限

![](https://img-blog.csdnimg.cn/9e83b1482ea34370b3823bf84baa8e0b.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAc3FqZGRi,size_16,color_FFFFFF,t_70,g_se,x_16)

1. r 读，数值标识为4，可以读取查看文件或目录内容
2. w 写，数值标识为2，可以修改文件(不代表可以删除文件)，目录内可以创建删除重命名目录
3. x 执行，数值标识为1，可以被执行/可以进入该目录

### 文件的大小

如果是目录，则为4096

### 文件用户

用户信息：作为系统数据或程序进程的操作管理者，一半不同用户会有不同的操作能力

用户组信息：可以将多个系统用户进行整合，方便对多个用户的权限进行管理

系统识别用户不依赖于名称，而是依赖于用户或用户组的编号id

- 管理用户 root uid=0
- 虚拟用户 nobody uid=1-999 Linux下每个程序/进程需要有一个用户和用户组管理，无法登录Linux
- 普通用户 uid=1000+

### 文件时间

1. **文件修改时间 mtime** 

   modified time 当文件信息内容发生变动时，会调整此信息

2. 文件访问时间 atime

   access time 当文件信息访问读取时，会调整此信息

3. 文件改变世界 ctime

   change time 当文件属性状态改变时，调整此信息

### 查看文件详细信息

```shell
stat file
```

### 文件存储

每个Linux存储设备进行格式化操作(创建文件系统)后，都会创建两个部分内容

- inode 默认大小为128/256byte

  一小块具备**唯一数字编号**的存储空间，主要用来存放文件/目录**属性信息，以及指针信息**

  inode里不包含文件名称信息，文件名不属于属性

  inode相同的文件，互为**硬链接文件**

- block 默认大小为1-4kb

  磁盘块，存放**实际数据**，磁盘读取数据时以block为单位

  单个的大文件占用多个block，单个小文件不能占满block时，剩余的空间也无法使用

### 文件链接

在Linux系统中，链接分为两种

- 硬链接 hard link ```ln source destination  ```

  - 通过**索引节点**进行的链接，多个文件名指向同一个索引节点，则互为硬链接文件

  - 作用：允许一个文件拥有多个有效的文件名，可以为重要文件创建硬链接，避免误删

  - 不能为目录创建硬链接，但目录的硬链接数，决定了目录下有多少个子目录
  - 类型为普通文件
  - 硬链接文件为**同一个文件**，inode相同，只是不同的访问入口

- 软链接 soft link ```ln -s source destination  ```

  - 相当于快捷方式

  - 软链接实际上是一个特殊的文件，通过**逻辑指针**，指到真实的文件上

  - 利用软链接可以快速定位指定数据信息，也可以解决因为名称改动造成的异常情况
  - 针对**path**，而不是inode
  - 类型为l
  - 软链接与源文件为不同文件，inode不同

### 修改权限 - chmod

1. \- =

​	// u所有者，g所有组，o其他人，a所有人
​	chmod u=rwx,g=rx,o=x 文件/目录名
​	chmod o+w 文件/目录名	// 增加权限
​	chmod a-x 文件/目录名	// 删除权限

2. 通过数字变更权限

​	规则：r=4，w=2，x=1

​	chmod 751 name
​	相当于 chmod u=rwx,g=rx,o=x

### 修改文件所有者

chown newowner file
chown newowner:newgroup file
-R 如果是目录，则使其下所有子文件或目录递归生效
### 修改文件所在组

chgrp newgroup file 
-R 如果是目录，则使其下所有子文件或目录递归生效

## 命令行快捷键

### 最常用的快捷键

1. tab：命令，路径，以及文件信息等的补全

### 移动光标

1. ctrl A ：光标回到行首
2. ctrl E ：光标回到行尾
3. ctrl 方向键右 ：以字符串为单位向右快速移动光标
4. ctrl 方向键左 ：以字符串为单位向左快速移动光标

### 剪切、粘贴、清除

1. ctrl K ：剪切(删除)光标处到行尾的字符
2. ctrl U ：剪切(删除)光标处到行首的字符
3. ctrl W：剪切(删除)光标前的一个单词
4. ctrl Y：粘贴剪切删除的文本

### 系统管理控制

1. ctrl C ：中断终端正在执行的任务 或者 取消整行命令的输入
2. ctrl L ：清除屏幕上的所有内容，相当于clear
3. ctrl D ：退出当前shell命令行
4. ctrl Z ：暂停执行在终端运行的任务
5. ctrl S ：锁定终端，使之无法输入内容
6. ctrl Q ：解锁ctrl s的锁定

### 重复执行命令

1. ctrl R ：搜索命令行使用过的命令
2. Esc . ：获取上一条命令的最后部分(空格分隔)

## 命令

命令语法格式：

- 中括号[]表示**可选**
- 参数选项表示使用一个命令的具体功能
- 命令，参数选项和文件路径之间至少要有一个**空格**

```shell
命令 [参数选项] [文件或路径]
// rm -f /tmp/test.txt
```

### Linux运行级别

1. 0：关机
2. 1：单用户(找回密码)
3. 2：多用户无网络服务
4. **3**：多用户有网络服务
5. 4：保留
6. 5：图形界面
7. 6：重启

系统运行级别的配置文件`/etc/inittab`

命令：`init [0123456]` 切换到指令运行级别

#### 找回root密码

进入单用户模式，修改root密码，因为进入单用户模式，root无需密码即可登录

### 帮助指令

1. man

​	man [命令或配置文件]

2. help

​	help 命令

3. history

   查看已经执行的历史命令，也可以执行历史命令

   	history		//查看所有执行过的指令
   	! num		//执行history中编号为num的指令


### 文件目录指令
1. pwd

​		print working directory 显示当前工作目录的绝对路径

2. ls

   查看目录的内容信息

   1. -a：显示当前目录所有文件和目录(包括隐藏的) 
   2. -l：以列表的方式显示信息
   3. -h：查看所有者


```
ls [选项] [目录/文件]
```

3. cd

   切换目录 cd [参数]

   1. cd ..：回到当前目录的上一级目录
   2. cd ~ 或者 cd ：回到自己的家目录

4. mkdir

   创建目录

   ```shell
   mkdir [选项] 目录名
   
   // 创建多个有规则的目录
   mkdir test{1..3}
   // mkdir test1 test2 test3
   ```

​		-p ：创建多级目录

5. rmdir

   删除空目录

   1. -r 递归删除 (删除目录时必带参数，默认rm只能删除文件)
   2. -f 强制删除，不需要确认


	rmdir [选项] 要删除的目录

6. touch

   创建空文件

	touch 文件名
7. cp

   拷贝文件到指定目录

   1. -r 递归复制整个文件夹
   2. -p 复制时保存源文件的所有者，权限，以及时间等信息


	cp [选项] source dest

8. rm

   移除文件或目录

   1. -r：递归删除整个文件夹
   2. -f：强制删除

   rm [选项] 要删除的文件或目录

9. mv

   移动文件和目录或者重命名

   1. -f : 若目标文件已存在，则不询问直接覆盖
   2. -n：不覆盖已经存在的文件(安全)
   3. -t ：指定mv的目标目录，移动多个文件到一个目录

   ```shell
   mv oldName newName	//重命名
   mv file path		//移动文件(优先级高于重命名)
   mv -t path file1 file2 //移动多个文件
   ```

### 查看文件内容

1. cat

   查看文件内容

   ```shell
   cat [选项] 要查看的文件
   ```

   1. -n： 显示行号
   2. -b： 显示行号，但忽略空行
   3. -s ：连续两行以上的空行，替换为一行空白行
   4. -E ：在每一行的行尾显示$符号

2. more

   基于vi编辑器的文本过滤器，以全屏幕的方式按页显示文本文件的内容

   内置快捷键

   1. space：向下翻一页
   2. Enter：向下翻一行
   3. q：退出more
   4. b：返回上一屏
   5. v：调用vi编辑器

3. less

   用来分屏查看文件的内容，显示文件内容时并不一次将整个文件加载，而是根据显示需要加载内容

   内置快捷键

   1. space：向下翻一页
   2. [pagedown]：向下翻一页
   3. [pageup]：向上翻一页
   4. q：退出

4. \>和>>

​	\> 输出重定向，>> 追加

	ls -l >filename	// 将ls -l这个指令显示的内容，覆盖到文件中
	ls -l >>filename	//将指令显示的内容，追加到文件末尾
5. echo

   输出内容到控制台

   1. -n: 不要自动换行
   2. 


	echo [选项] [输出内容]
6. head

​	用于显示文件的开头部分内容

	head file 查看文件前10行内容
	head -n 5 file 查看文件前5行内容
7. tail

​	输出文件中尾部的内容

	tail file 查看文件后10行内容
	tail -n 5 file 查看文件后5行内容
	tail -f file 实时追踪文档的所有更新
8. ln

​	软连接，相当于快捷方式

	ln -s [原文件或目录] [软链接名]	// 创建软链接
	rm -rf 软链接名 				// 删除软链接
### 时间日期类
1. 显示时间

​	date 显示当前时间
​	date +%Y 显示年份
​	date +%m 显示月份
​	date +%d 显示天
​	date "+%Y-%m-%d %H:%M:%S" 显示2022-4-9 20:05:00

2. 设置日期

​	date -s 字符串时间

3. cal

​	查看日历	

	cal [选项]
### 搜索查找
1. find

   find指令将从指定目录向下递归的遍历各个目录，将满足条件的文件或目录显示在终端

   1. -name<查询方式> 按照指定的文件名查找文件
   2. -user<用户名> 查找属于指定用户名的所有文件
   3. -size<文件大小> 根据文件大小查找文件

	find [搜索范围] [选项]

2. locate

   快速定位文件路径，利用事先建立的系统中所有文件名以及路径的locate数据库实现快速定位给定的文件

​		updatedb	//创建locate数据库
​		locate file //搜索文件

3. grep

   过滤查找，可用于文件信息处理，可以使用正则表达式 	

   ```shell
   grep [选项] [pattern] [file]
   ```
   
   1. -n 显示匹配的行及行号
   2. -i 忽略字母大小写，默认区分大小写
   3. -v 排除pattern对应的信息
   4. -w 以单词为单位进行过滤

### 压缩和解压

1. gzip和gunzip

​		gzip file 压缩文件为*.gz文件
​		gunzip *.gz 解压文件

2. zip

​		zip [选项] name.zip		压缩文件
​		-r 递归压缩，即压缩目录

3. unzip

​		unzip [选项] name.zip	解压文件 
​		-d<目录>，指定解压后文件的存放目录

4. tar

   打包指令，最后打包的文件时.tar.gz文件

   tar [选项] name.tar.gz 打包的内容

   1. -c 产生.tar打包文件
   2. -v 显示详细信息
   3. -f 指定压缩后的文件名
   4. -z 打包同时压缩
   5. -x 解包.tar文件

## 任务调度
指系统在某个时间执行的特定命令或程序
### 任务分类

1. 系统工作：有些工作需要周而复始的进行，如病毒扫描
2. 个别用户工作：个别用户可能希望按时执行某些程序，如数据库备份


### 命令

crontab [选项]

1. -e 编辑crontab定时任务
2. -l 查询crontab任务
5. -r 删除当前用户所有的crontab任务

### 参数说明

\*/1\**** ls -l /etc >> /tmp/test.txt 

设置每分钟执行一次，遍历目录并将详细信息写入/tmp/test.txt中
#### 五个`*`占位符的含义

<table><thead><tr><th>项目</th><th>含义</th><th>范围</th></tr></thead><tbody><tr><td>第一个“*”</td><td>一小时当中的第几分钟</td><td>0~59</td></tr><tr><td>第二个“*”</td><td>一天当中的第几小时</td><td>0~23</td></tr><tr><td>第三个“*”</td><td>一个月当中的第几天</td><td>1~31</td></tr><tr><td>第四个“*”</td><td>一年当中的第几个月</td><td>1~12</td></tr><tr><td>第五个“*”</td><td>一周当中的星期几</td><td>0~7（0和7都代表星期日）</td></tr></tbody></table>
#### 时间特殊符号

<table><thead><tr><th>特殊符号</th><th>含义</th></tr></thead><tbody><tr><td>*（星号）</td><td>代表任何时间。比如第一个"*"就代表一小时种每分钟都执行一次的意思。</td></tr><tr><td>,（逗号）</td><td>代表不连续的时间。比如"0 8，12，16***命令"就代表在每天的 8 点 0 分、12 点 0 分、16 点 0 分都执行一次命令。</td></tr><tr><td>-（中杠）</td><td>代表连续的时间范围。比如"0 5 ** 1-6命令"，代表在周一到周六的凌晨 5 点 0 分执行命令。</td></tr><tr><td>/（正斜线）</td><td>代表每隔多久执行一次。比如"<em>/10</em>***命令"，代表每隔 10 分钟就执行一次命令。</td></tr></tbody></table>
### 通过脚本执行

1. 先编写一个文件 /home/mytask.sh：date>>/tmp/mydate
2. 给mytask.sh一个可执行权限(chmod 744 /home/mytask.sh)
3. crontab -e
4. \*/1\**** /home/mytask.sh

## 磁盘分区
### 分区

1. mbr分区
	1. 最多支持四个主分区
	2. 系统只能按照在主分区
	3. 扩展分区要占一个主分区
	4. MBR最大支持2TB，但兼容性良好
2. gtp分区
	1. 支持无限多个主分区(但操作系统可能限制，windows下最多128个分区)
	2. 最大支持18EB容量(EB = 1024PB，PB=1024TB)
	3. windows7 64位以后支持gtp

### Linux分区原理

1. Linux无论几个分区，分给哪一目录使用，总之它只有一个根目录，一个独立且唯一的文件结构，Linux中每个分区都是用来组成整个文件系统的一部分
2. Linux采用一种叫"载入"的处理方法，它的整个文件系统包含了一整套的文件和目录，且将一个分区和一个目录联系起来，这时要载入的一个分区将使它的存储空间在一个目录下获得
###硬盘说明
1. Linux硬盘分IDE硬盘和SCSI硬盘，目前基本上是SCSI硬盘
2. 对于IDE硬盘，驱动器标识符为"hdx~"，其中"hd"表示分区所在设备类型，"x"表示盘号(a为基本盘，b为基本从属盘，c为辅助主盘，d为辅助从属盘)，"~"代表分区，前四个分区用数字1到4表示，它们是主分区或扩展分区，从5开始就是逻辑分区
5. 对于SCSI硬盘则标识为"sdx~"，SCSI硬盘用"sd"来表示分区所在设备的类型的，其余同IDE硬盘

### 查看分区和挂载指令

lsblk -f

### 添加一块新硬盘

1. 虚拟机添加硬盘
2. 分区<br> 
	分区命令： fdisk /dev/sdb<br>
	开始对/sdb分区：
	- m 显示命令列表
	- p 显示磁盘分区，同fdisk -l
	- n 新增分区
	- d 删除分区
	- w 写入并退出
3. 格式化<br> mkfs -t ext4 /dev/sdb1
4. 临时挂载(重启后挂载取消)
	1. 挂载：mount 设备名称 挂载目录
	2. 卸载：umount 设备名称或挂载目录
5. 设置自动挂载(永久挂载)<br>
    vim /etc/fsta<br>
    /dev/sdb1 /home/newdisk ext4 defaults 0 0<br>
    mount -a 使修改生效


### 磁盘情况查询

#### 查询系统整体磁盘使用情况
df -h
#### 查询指定目录的磁盘占用情况
du -h /目录 //默认为当前目录

1. -s 指定目录占用大小汇总
2. -h 带计量单位
3. -a 含文件
4. --max-depth=1 子目录深度
5. -c 列出明细的同时，增加汇总值

### 目录统计

1. 统计/home文件夹下文件的个数

  ls -l /home | grep "^-" | wc -l

2. 统计/home文件夹下目录的个数

  ls -l /home | grep "^d" | wc -l

3. 统计/home文件夹及其子文件夹下的文件个数

  ls -lR /home | grep "^-" | wc -l

4. 以树状显示目录结构

  tree [option] [目录]

  - -a: 显示所有文件，包括隐藏文件
  - -d: 只显示目录结构中的目录
  - -L：遍历目录的最大层数，level为大于0的正整数

## 网络配置

### 测试连通性
​	ping 目的主机
### 网络环境配置
#### 1. 自动获取
#### 2. 指定固定ip
直接修改配置文件来指定IP，并可以连接到外网 

	vi /etc/sysconfig/network-scripts/ifcfg-eth0
	//ONBOOT=yes
	//BOOTPROTO=static 以静态方式获取ip
	//IPADDR 指定ip地址
	//GATEWAY 网关
	//DNS dns和网关保持一致即可
	
	//重启网络服务
	service network restart 或者 reboot

## 进程管理
### 显示系统执行的进程
​	ps -aux
​	ps -aux | grep xxx
​	ps -ef 		

1. -a：显示当前终端所有进程信息
2. -u：以用户的格式显示进程信息
3. -x：显示后台进程运行的参数
4. -e：显示所有进程
5. -f：全格式

#### 字段

1. USER：用户
2. PID：进程id
	- PPID：副进程
3. %CPU：占用cpu情况
4. %MEM：占用内存情况
5. VSZ：占用虚拟内存情况
6. RSS：占用物理内存情况
7. TTY：使用的终端
8. STAT：进程运行的状态(s休眠，r运行)
9. START：启动时间
10. TIME：占用CPU的总时间
11. COMMAND：进程执行时的命令行

### 终止进程

kill [选项] 进程号	//通过进程号杀死进程
killall 进程名称		//通过进程名称杀死进程，支持通配符

-9：强迫进程立即停止
### 查看进程树
​	pstree [选项]

1. -p：显示进程的pid
2. -u：显示所属用户

### 服务管理

服务本质就是进程，但是运行在后台，通常都会监听某个端口，等待其他程序的请求，如mysql，sshd，iptables(防火墙)等，因此又称为守护进程
#### service管理指令
service 服务名 [start | stop | restart | reload | status]
#### 查看服务名

1. setup -> 服务名称
2. ls -l /etc/init.d/


#### 服务的运行级别

vi /etc/inittab		//查看或者修改默认级别
#### chkconfig指令
通过chkconfig命令可以给各个运行级别的每个服务设置自启动/关闭

chkconfig --list | grep xxx
chkconfig 服务名 --list
chkconfig --level 5 服务名 on/off
### 动态监控进程
top与ps命令相似，但top在执行一段时间后可以更新正在运行的进程

top [选项]
k 	//输入pid杀死进程
u	//查看某个用户的进程
P	//按照CPU使用率排序(默认)
M	//按照内存的使用率排序
N	//以PID排序
q 	//退出top

1. -d：秒数，指定top命令每隔几秒更新，默认为3
2. -i：使top不显示任何闲置或僵死进程
3. -p：通过指定监控进程id来仅仅监控某个进程的状态


### 监控网络状态

netstat [选项]

1. -an：按一定顺序排列输出
2. -p：显示哪个进程在调用

## 软件包管理
### RPM包
一种用于互联网下载包的打包及安装工具，生成具有.RPM扩展名的文件，RPM使RedHat Package Manager的缩写，相当于windows的setup.exe
#### RPM包的查询指令
​	rpm -qa 			//查询已安装的所有rpm软件包
​	rpm -q 软件包名		//查询软件包是否安装
​	rpm -qi 软件包名		//查询软件包信息
​	rpm -ql 软件包名		//查询软件包中的文件
​	ron -qf 文件全路径名	//查询文件所属的软件包
#### rpm包名的基本格式
​	firefox-45.0.1-1.el6.centos.x86_64.rpm

1. 名称：firefox
2. 版本：45.0.1-1
3. 适用操作系统：el6.centos.x86_64


#### 卸载rpm包

rpm -e rpm包名				//如果其他包依赖于要卸载的包，则报错
rpm -e --nodeps rpm包名		//强制删除
#### 安装rpm包
rpm -ivh rpm包全路径名称

1. i：install
2. v：verbose 提示
3. h：hash 进度条

### yum

yum是一个shell前端软件包管理器，基于rpm包管理，能够从指定的服务器自动下载rpm包并安装，可以自动处理依赖关系，并且一次安装所有依赖的软件包
#### 基本指令

```shell
yum list | grep xx	//查询yum服务器是否有需要安装的软件
yum install xxx		//安装指定yum包
```

### 软件安装查看

```shell
rpm -qa httpd
-- 查看指定软件程序是否已经成功安装

rpm -ql httpd
-- 查看指定软件安装的所有数据信息

rpm -qc httpd
-- 查看指定软件安装后的配置文件

which httpd
-- 查看命令的绝对路径

rpm -qf `which httpd`
-- 查看指定操作命令或文件数据属于哪个安装包
```

注：利用rpm命令只能查看rpm和yum方式安装的程序

## 系统优化

### 系统主机名称优化

hostname命令用于显示和设置系统主机名称

```shell
hostname [参数] [主机名称]
# 该方法为临时设置主机名称，永久修改需在/etc/hostname中配置
```

- -s：显示短主机名称，在第一个点处截断
- -i：显示网卡的IP地址信息，默认包含IPv6和IPv4
- -I：显示网卡的IP地址信息，默认包含IPv4

```shell
hostnamectl [参数] [主机名称]
# 可用于查询和修改主机名称，并且可以永久修改
```

- status：显示当前主机名设置与详细信息
- set-hostname：设置系统主机名称

### 系统提示符号优化

#### 系统命令提示信息符

系统命令提示信息符主要提示操作**可以开始输入命令**作用

```shell
# 管理员
[root@linux ~]#
登录用户 主机名 所在目录 #(管理员登录)

# 普通用户
[name@linux ~]$
登录用户 主机名 所在目录 $(普通用户登录)
```

#### 系统命令提示信息优化

需要调整系统环境变量 PS1

```shell
echo $PS1
[\u@\h \W]\$
```

配置参数：

1. \d :日期，格式为weekday month date
2. \t :时间为24小时格式，HH:MM:SS
3. \T :时间为12小时格式
4. \A :时间为24小时格式，HH:MM
5. \h :主机名称的短格式
6. \H :主机名称的长格式
7. \u :当前登录主机的用户名
8. \w :显示完整路径，家目录用~代替
9. \W :利用basename获取工作目录名称，只列出最后一个目录
10. $ :提示字符，管理员为#，普通用户为$

#### 提示符信息修改

```shell
# 临时修改，临时修改PS1环境变量
export PS1='[\u@\h \W]\$'

# 永久修改，修改环境变量配置文件\etc\profile
```

#### 系统信息添加颜色

```shell
echo -e "\e[32;1m test \e[0m"
# \e[32;1m 颜色添加
# \e[0m 颜色结束

# 对提示符信息上色
export PS1='\[\e[32;1m\][\u@\h \W]\$\[\e[0m\]'
# 需要额外添加转义[]，来包裹颜色命令
# 可以为颜色命令设置变量来优化命令
```

### 系统时间优化

#### 系统时间设置作用

1. 系统日志的准确性
2. 服务网络通讯的可靠性
3. 系统服务自动化操作的严谨性

#### 系统时间同步

```shell
timedatectl [参数] [时间信息]
```

1. status 显示当前系统时间和配置
2. set-time TIME 手工设置时间
3. set-timezone ZONE 设置系统的时区信息
4. list-timezones 显示已知可以配置的时区
5. set-local-rtc BOOL 是否控制本地的硬件时间信息
6. set-ntp BOOL 是否开启本地的网络时间同步

#### 系统时间信息

```shell
# timedatectl status
Local time		--本地时间
Universal time	--国际标准时间
RTC time		--系统硬件环境时间
Time zone		--所在时区
NTP enabled		--网络同步时间功能是否启动
NTP synchronized--网络时间服务是否正常工作
```

### 系统字符编码优化

#### 字符编码优化作用

1. 避免中文乱码
2. 数据存储大小

#### 调整系统字符编码

```shell
localectl [参数] [字符编码]
```

1. status 查看目前的字符编码设置
2. set-locale LANG=... 设置系统字符编码
3. list-locales 列出系统已知的字符编码

### 系统下载优化

#### 软件程序下载原理

1. 执行软件下载命令后，加载```/etc/yum.repos.d/```中的配置文件
2. 根据配置文件，确定访问的yum仓库
3. 网络连接到仓库后，检索是否存在指定的软件
4. 检索到指定软件后，会从仓库下载并安装软件到系统
5. 安装完毕后，默认删除软件包，可以调整配置避免删除软件包

#### 下载优化

调整下载源信息(选择更加合理的仓库)

- 基础软件的配置文件：CentOS-Base.repo
- 扩展程序的配置文件：epel.repo

#### 软件下载源的检查

```shell
yum repolist
```

### 系统安全程序优化

#### 防火墙

扫描传入的网络流量，确保未包含列入黑名单的数据

部署服务应用初期，防火墙的一些配置，会影响服务

- 不能进行网络数据传输
- 不能和其他主机连接

因此很多服务器要求将系统防火墙程序关闭

#### 防火墙优化

```shell
# 临时关闭
systemctl stop firewalld
# 永久关闭
systemctl disable firewalld

# 查看状态
systemctl status firewalld
systemctl is-active firewalld
systemctl is-enabled firewalld
```

#### seLinux

安全增强型Linux，是Linux的一个内核模块，也是安全子系统

主要作用是，最大限度地减小系统中服务进程可访问的资源(某些情况可以限制root)

```shell
# 临时关闭
setenforce 0
# 查看状态
getenforce
# 永久关闭
vim /etc/selinux/config
SELINUX=disabled
```

### 系统远程连接优化

Linux远程连接时默认使用SSH服务

SSH服务的安全以及功能方面都需要一些优化

#### 系统远程配置文件

```shell
# /etc/ssh/sshd_config
GSSAPIAuthentication no
-- SSH服务自带的远程连接安全认证，默认开启影响连接效率
UseDNS no
-- SSH服务里实现DNS反向解析的功能，影响连接效率

systemctl restart sshd
```



## JAVAEE开发

### 安装JDK

1. 将软件通过 xftp 上传到/opt
2. 解压缩到 /opt
3. 配置环境变量的配置文件 vim /etc/profile
	- JAVA_HOME = /opt/jdk1.7
	- PATH = /opt/jdk1.7/bin:$PATH
	- export JAVA_HOME PATH
4. 注销用户后生效

### tomcat安装

1. 解压缩到 /opt
2. 进入tomcat的bin目录，启动tomcat ./startup.sh
3. 开放端口8080 使外网可以访问tomcat
	- vim /etc/sysconfig/iptables
	- -A INPUT -m state NEW -m tcp -p tcp --dport 8080 -j ACCEPT
4. 重启防火墙

### Eclipse安装

1. 解压缩到 /opt
2. 启动eclipse 配置jre和server
3. 编写测试程序

### mysql的安装

1. 卸载旧版本 
	- rpm -qa | grep mysql 检查是否安装有mysql
	- rpm -e mysql
2. 安装编译代码需要的包 
	- yum -y install make gcc-c++ cmake bison-devel ncurses-devel
3. 下载并解压mysql
4. 进入MySQL 
	- cd mysql
5. 编译安装
	- cmake -DCMAKE_INSTALL_PREFIX=/user/local/mysql
	- -DMYSQL_DATADIR=/user/local/mysql/data -DSYSCONFDIR=/etc
	- -DWITH_MYISAM_STORAGE_ENGINE=1 -DWITH_INNOBASE_STORAGE_ENGINE=1
	- -DWITH_MEMORY_STORAGE_ENGINE=1 -DWITH_READLINE=1
	- -DMYSQL_UNIX_ADDR=/var/lib/mysql/mysql.sock -DMYSQL_TCP_PORT=3306
	- -DENABLED_LOCAL_INFILE=1 -DWITH_PARTITION_STORAGE_ENGINE=1
	- -DEXTRA_CHARSETS=all -DDEFAULT_CHARSET=utf8
	- -DDEFAULT_COLLATION=utf8_general_ci 
	- mark && make install
6. 配置mysql
	1. 设置权限
		- cat /etc/passwd 查看用户列表
		- cat /etc/group 查看用户组列表
		- 如果没有就创建
			- groupadd mysql
			- useradd -g mysql mysql
		- 修改/user/local/mysql权限
			- chown -R mysql:mysql /user/local/mysql
7. 初始化配置
	- 进入安装路径 cd /user/local/mysql/
	- scripts/mysql_install_db --basedir=/usr/local/mysql --datadir=/user/local/mysql/data --user=mysql
8. 启动mysql
	- 进入 /user/local/mysql
	- cp support -files/mysql.server /etc/init.d/mysql
	- chkconfig mysql on
	- service mysql start
	- 修改root密码
		- cd /user/local/mysql/bin
		- ./mysql -uroot
		- SET PASSWORD = PASSWORD('root');



