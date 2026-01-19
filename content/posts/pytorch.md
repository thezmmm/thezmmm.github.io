---
title: "PyTorch"
description: "Notes on learning pytorch"
date: 2022-07-15T13:01:27+08:00
draft: true
type: "blog"
tags: [Python, AI]
---

## Tensorboard

### Install

1. pip

   ```py
   pip install tensorboard
   ```

2. conda

   ```py
   conda install tensorboard
   ```

### 实例化对象

```py
from torch.utils.tensorboard import SummaryWriter

# param为文件存放的path
writer = SummaryWriter("logs")
```

### add方法

1. add_image()

   ```py
   # 绘制图片，可用于检查模型的输入，监测 feature map 的变化，或是观察 weight
   add_image(self, tag, img_tensor, global_step=None, walltime=None, dataformats=‘CHW’)
   ```

   - tag(String) ：Data identifier 
   - img_tensor : Image data(numpy or tensor)
   - global_step(int) :  step
   - dataformats : the shape of Image Data

2. add_scalar()

   ```py
   # 绘制单条曲线
   add_scalar(tag, scalar_value, global_step=None, walltime=None)
   ```

   - tag : string，图像名称，相同tag的不同文件结果会叠加
   - scalar_value : y轴的值
   - global_step : x轴的值

### Visualization

```py
tensorboard --logdir=logs --port=6006
# logdir的参数为logs的路径(创建SummaryWriter类时确定)
# port的参数为指定的端口号
```

### Read Image

1. numpy

   利用**Opencv**读取图片，获得**numpy**型图片数据

   ```py
   import numpy as np
   from PIL import image
   
   image_path = "..."
   img_PIL = Image.open(image_path)
   
   img_array = np.array(img_PIL)
   
   # dataformats 指定shape每个数字的含义，H-height，W-width，C-channel
   writer.add_image("tag", img_array, 1, dataformats="HWC")
   ```
   
2. tensor

   用 **transforms** 的工具类 **ToTensor** 实现转换 

   ```py
   from torchvision import transforms
   
   # 工具类实例化
   tensor_trans = transforms.ToTensor()
   # convert PIL, numpy to tensor
   img_tensor = tensor_trans(img_PIL)
   ```


3. numpy to tensor

   ```python
   import torch
   
   tensor_data = torch.from_numpy(numpy_data)
   ```

## torchvision

### Transforms

1. Compose

   串联多个图片变换的操作

   ```py
   # 初始化类时传入transforms, 即transform列表
   def __init__(self, transforms):
       if not torch.jit.is_scripting() and not torch.jit.is_tracing():
           _log_api_usage_once(self)
           self.transforms = transforms
   
   # 遍历 transforms
   def __call__(self, img):
       for t in self.transforms:
           img = t(img)
       return img
   ```

2. ToTensor

   将 Image Data 转换为 tensor型

   ```py
   from torchvision import transforms
   
   # 工具类实例化
   tensor_trans = transforms.ToTensor()
   # convert PIL, numpy to tensor
   img_tensor = tensor_trans(img_PIL)
   ```

3. Normalize

   将数据转换为标准高斯分布，即逐个channel的对图像进行标准化（均值变为0，标准差为1），可以加快模型的收敛

   ```py
   trans_norm = transforms.Normalize([0.5, 0.5, 0.5], [0.5, 0.5, 0.5])
   img_norm = trans_norm(img_tensor)
   ```

   - mean : 各通道的均值
   - std : 各通道的标准差
   - output = (input - mean)/std (标准正态分布公式)

4. Resize

   调整 **PIL Image Data** 的尺寸

   ```py
   # 指定缩放的长宽
   trans_resize = transforms.Resize([h, w])
   
   # 最短边缩放到x，长宽比不变
   trans_resize = transforms.Resize(x)
   
   img_resize = trans_resize(img)
   ```

5. RandomCrop

   从图片中随机裁剪出尺寸为size的图片

   ```py
   trans_random = transforms.RandomCrop(size)
   ```

### dataset

建立索引到样本的映射

[Datasets — Torchvision 0.13 documentation (pytorch.org)](https://pytorch.org/vision/stable/datasets.html)

params

- root(String) : dataset存放路径
- train(boolean) : True为训练集，False为测试集
- transform : 用于使用的将PIL图像数据转化为tensor类型的函数操作，可以自己定义操作内容
- download(boolean) :  True为当dataset不存在时，自动下载

```py
# 自定义 Dataset
class MyData(Dataset):

    def __init__(self, root_dir, label_dir):
        self.root_dir = root_dir
        self.label_dir = label_dir
        self.path = os.path.join(self.root_dir,self.label_dir)
        self.img_path = os.listdir(self.path)

    def __getitem__(self, idx):
        img_name = self.img_path[idx]
        img_item_path = os.path.join(self.root_dir, self.label_dir, img_name)
        img = Image.open(img_item_path)
        label = self.label_dir
        return img, label

    def __len__(self):
        return len(self.img_path)
```



## Dataloader

以特定的方式从数据集中迭代的产生 一个个batch的样本集合

params

- dataset(Dataset)
- batch_size(int) : 每次加载的样本数 (default : 1)
- shuffle(bool) : True 为每个时期打乱数据的顺序 (default : false)
- num_workers(int) : 进程数 , (default : 0, 主进程加载)
- drop_last(bool) : True 为舍去最后的数据(数据量 < batch_size) (default : false)

## 神经网络 - Neural Network

### Module

Base class for all neural network modules

### 卷积层 - Convolution Layers

#### 卷积操作

卷积通过使用输入数据的小方块学习图像特征来保留像素之间的空间关系

**卷积操作**就是**卷积核**（过滤器 / Filter）在原始图片中**进行滑动**得到**特征图（Feature Map）**的过程

![](https://img-blog.csdnimg.cn/20210116195533891.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3p6dDEyM3px,size_16,color_FFFFFF,t_70)

![](https://img-blog.csdnimg.cn/20210116201832354.gif)

#### Conv2d

params

- in_channels : 输入图片的通道数
- out_channels : 输出图片的通道数
- kernel_size : 卷积核的大小
- stride : 卷积操作时移动的步长 , default: 1
- padding : 边界填充的大小，default: 0

### 池化层 - Pooling Layers

#### 池化操作

​	在一定的区域内提出该区域的关键信息(一个亚采样过程)。其操作往往出现在卷积层之后，它能起到减少卷积层输出的特征量数目的作用，从而能减少模型参数同时能改善过拟合现象

1. 最大池化 - max pooling

   最大池化是保留模板内信息的最大值，这是在提取纹理特征，保留更多的局部细节

   ![](https://imgconvert.csdnimg.cn/aHR0cDovL2ltZy5ibG9nLmNzZG4ubmV0LzIwMTcxMTA5MTgyNTI4MTE4?x-oss-process=image/format,png)

2. 平均池化 - average pooling

   平均池化是对池化模板进行均值化操作，这能保留模板内的数据的整体特征从而背景信息

   ![](https://imgconvert.csdnimg.cn/aHR0cDovL2ltZy5ibG9nLmNzZG4ubmV0LzIwMTcxMTA5MTgyNDUxODQx?x-oss-process=image/format,png)

3. 随机池化 - random pooling

   ![](https://imgconvert.csdnimg.cn/aHR0cDovL2ltZy5ibG9nLmNzZG4ubmV0LzIwMTcxMTA5MTgzODUxMzQz?x-oss-process=image/format,png)

#### MaxPool2d

params

- kernal_size : 池化窗口的大小
- stride : 窗口移动的步长 , default: kernal_size
- padding : 边界填充的大小，default: 0
- ceil_mode : True时保留数目少于kernal_size的元素, default : false

### 非线性激活

给神经网络中加入一些非线性特征，非线性越多才能训练出符合各种特征的模型

#### 非线性操作

根据公式， 对tensor中的数据进行变换

#### ReLU

<img src="https://bkimg.cdn.bcebos.com/pic/d788d43f8794a4c25b5e4dd902f41bd5ac6e39c6?x-bce-process=image/watermark,image_d2F0ZXIvYmFpa2U5Mg==,g_7,xp_5,yp_5/format,f_auto" style="zoom: 67%;" />

params

- inplace : Ture时，直接在原输入上进行变换，default : False 时原输入不变，返回值为变换后的数据

### 线性层 - Linear Layers

params:

- in_features : 输入特征值
- out_features : 输出特征值
- bias : 偏置

### Flatten

将tensor转为一维

### Sequential

用于将函数组合成一个模块

```py
# Example of using Sequential
model = nn.Sequential(
    nn.Conv2d(1,20,5),
    nn.ReLU(),
    nn.Conv2d(20,64,5),
    nn.ReLU()
)

# Example of using Sequential with OrderedDict
model = nn.Sequential(OrderedDict([
    ('conv1', nn.Conv2d(1,20,5)),
    ('relu1', nn.ReLU()),
    ('conv2', nn.Conv2d(20,64,5)),
    ('relu2', nn.ReLU())
]))
```

## 损失函数 - Loss Function

计算预测值和真实值的差距的一类型函数

### 常用损失函数

1. L1Loss
   $$
   \ell(x, y)=L=\left\{l_{1}, \ldots, l_{N}\right\}^{\top}, \quad l_{n}=\left|x_{n}-y_{n}\right|
   \newline
   \ell(x, y)=\left\{\begin{array}{ll}
   \operatorname{mean}(L), & \text { if reduction }=\text { 'mean'; } \\
   \operatorname{sum}(L), & \text { if reduction }=\text { 'sum' }
   \end{array}\right.
   $$
   params

   - reduction : 值为 'sum' 时 结果为求和 ; 值为 'mean' 时结果为平均值

2. MSELoss
   $$
   \ell(x, y)=L=\left\{l_{1}, \ldots, l_{N}\right\}^{\top}, \quad l_{n}=\left(x_{n}-y_{n}\right)^{2},
   \newline
   \ell(x, y)=\left\{\begin{array}{ll}
   \operatorname{mean}(L), & \text { if reduction }=\text { 'mean'; } \\
   \operatorname{sum}(L), & \text { if reduction }=\text { 'sum' }
   \end{array}\right.
   $$
   
3. CrossEntropyLoss

   该函数主要用于分类问题
   $$
   \operatorname{loss}(x, \text { class })=-\log \left(\frac{\exp (x[\text { class }])}{\sum_{j} \exp (x[j])}\right)=-x[\text { class }]+\log \left(\sum_{j} \exp (x[j])\right)
   \newline 
   \operatorname{loss}(x, \text { class })=\text { weight }[\text { class }]\left(-x[\text { class }]+\log \left(\sum_{j} \exp (x[j])\right)\right)
   $$

### 反向传播

误差反向传播法（Back-propagation,BP）会计算神经网络中损失函数对各参数的**梯度**，配合**优化方法更新参数**，降低损失函数

定义好线性模型和损失函数，在计算完损失值后进行反向传播(backward)，并更新权重w即可

## 优化器 - Optimizer

采样梯度更新模型的可学习参数，使得损失减小

### 使用

```py
# new optimizer 
optim = torch.optim.SGD(Model.parameters(), lr=0.01)
# parameters: parameters of nn ; lr:  learning rate
# 清空所管理参数的梯度
optim.zero_grad()
# 获得参数的梯度
result_loss.backward()
# 执行优化
optim.step()
```

## 模型的保存与加载

1. ```py
   # save1
   # 保存模型的 结构 和 参数
   vgg16 = torchvision.models.vgg16(pretrained=False)
   torch.save(vgg16, "vgg16.pth")
   # param1: model param2: path
   # ps: 保存自定义模型 load时需有模型的定义来对照，否则报错
   
   # load1
   model = torch.load("vgg16.pth")
   # param: path
   ```
   
2. ```py
   # save2
   # 保存模型的 参数
   torch.save(vgg16.state_dict(), "vgg16.pth")
   
   # load2
   vgg16 = torchvision.models.vgg16(pretrained=False)
   vgg16.load_state_dict(torch.load("vgg16.pth"))
   ```

## 模型训练

```py
# 准备 dataset
train_data =  torchvision.datasets.CIFAR10(root="data", train=True, transform=torchvision.transforms.ToTensor(), Download=True)

test_data = torchvision.datasets.CIFAR10(root="data", train=False, transform=torchvision.transforms.ToTensor(), Download=True)

# 利用 DataLoader 加载 dataset
train_dataloader = DataLoader(train_data, batch_size=64)

test_dataloader = DataLoader(test_data, batch_size=64)

# 搭建 neural network
class Model(nn.Module):
	def __init__(self):
        super(Model, self).__init__()
        self.model = nn.Sequential(
        	nn.Conv2d(3, 32, 5, 1, 2),
            nn.MaxPool2d(2),
            nn.Conv2d(32, 32, 5, 1, 2),
            nn.MaxPool2d(2),
            nn.Conv2d(32, 64, 5, 1, 2),
            nn.MaxPool2d(2),
            nn.Flatten(),
            nn.Linear(64*4*4, 64),
            nn.Linear(64, 10),
        )
        
    def forward(self, x):
        x = self.model(x)
        return x
    
# 创建网络模型
model = Model()
 
# 损失函数
loss_fn = nn.CrossEntropyLoss()

# 优化器
learning_rate = 0.01
optimizer = torch.optim.SGD(model.parameters(), lr=learning_rate)

# 设置训练网络的参数
# 训练次数
total_train_step = 0
# 测试次数
total_test_step = 0
# 训练轮数
epoch = 10

# 添加tensorboard
writer = SummaryWriter("logs")

for i in range(epoch):
	print("------第 {} 轮------".format(i+1))
    
    # 开始训练
    model.train()
    for data in train_dataloader:
        imgs, targets = data
        outputs = model(imgs)
        loss = loss_fn(outputs, targets)
        
        # 优化器优化模型
        optimizer.zero_grad()
        loss.backward()
        optimizer.step()
        
        total_train_step += 1
        
        if total_train_step % 100 == 0:
        	print("训练次数:{}, loss:{}".format(total_train_step, loss.item()))
			writer.add_scalar("train_loss", loss.item(), total_train_step)
            
    # 开始测试
    model.eval()
    total_test_loss = 0
    total_accuracy = 0
    # 防止测试时影响模型梯度
    with torch.no_grad():
        for data in test_dataloader:
            imgs, targets = data
            outputs = model(imgs)
            loss = loss_fn(outputs, targets)
            # 记录损失
			total_test_loss += loss.item()
            # 记录精度
            accuracy = (outputs.argmax(1) == targets).sum()
            total_accuracy += accuracy
            
	print("整体测试集上的loss: {}".format(total_test_loss))
    print("整体测试集上的正确率: {}".format(total_accuracy / len(test_data)))
    writer.add_scalar("test_loss", total_test_loss, total_test_step)
    writer.add_scalar("test_accuracy", total_accuracy / len(test_data), total_test_step)
    total_test_step += 1
    
    # 保存每一轮优化后的模型
    torch.save(model, "model_{}.pth".format(i))
    print("第 {} 轮模型已保存".format(i+1))
    
writer.close()
```

### 利用 GPU 进行训练

1. ```py
   # 网络模型
   model = Model()
   if torch.cuda.is_available():
       model = model.cuda()
       
   # 损失函数
   if torch.cuda.is_available():
       loss_fn = loss_fn.cuda()
       
   # data
   if torch.cuda.is_available():
       imgs = imgs.cuda()
       targets = targets.cuda()
   ```

2. ```py
   # 定义训练设备
   device = torch.device("cuda")
   
   # 网络模型
   model = model.to(device)
   
   # 损失函数
   loss_fn = loss_fn.to(device)
   
   # data
   imgs = imgs.to(device)
   targets = targets.to(device)
   ```

   

## 模型验证

模型验证即是将模型放在实际情景下，看其是否能完成任务，以及其正确率如何

```py
img_path = "test.png"
image = Image.open(img_path)
transform = torchvision.transforms.Compose([torchvision.transforms.Resize(32, 32)
                                           torchvision.transforms.ToTensor()])
image = transform(image)

model = torch.load("model")
# 可以用 map-location = torch.device('cpu')，来调整模型在cpu上运行(GPU训练的模型)

# reshape 来给 image 一个 batch_size
image = torch.reshape(image, (1, 3, 32, 32))

model.eval()
with torch.no_grad():
    output = model(image)
print(output)
print(output.argmax(1))
```

### argmax

```torch.argmax(input, dim=None, keepdim=False)```

- dim : dim = 0求每一列的最大行标 ; dim = 1每一行最大的列标号
