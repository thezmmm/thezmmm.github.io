---
title: "Matlab"
description: "The record of Matlab's usage"
date: 2022-06-01T13:01:27+08:00
draft: false
type: "blog"
tags: [other]
---

## Command Line Terminal
#### help
### format

```format dataType```指定数字的格式

### who

显示当前有哪些变量

### whos

显示当前变量的详细信息
### clear

清除所有变量，后加变量名则清除单个变量
### ;

句末加分号，不显示计算结果
### 方向键

显示历史命令

### clc

清屏

### time

```matlab
tic
command
toc
% count the time of runing command
```



## Matrix

### 矩阵的输入

	Row vector:
		a = [1 2 3]
	Column vector:	
		b = [1;2;3]
### Array Indexing
1. A(row.column)
	- A([row1 row2],[column1 column2]) 得到交集
2. A(index)
	- A([index1 index2 index3])
	- A([index1 index2;index3 index4])
### Replacing Entries

delete row: A(row,:) = []
### Colon Operator

	A = begin:end  => A=[begin begin+1 .... end]
	A = begin:i:end => A=[begin begin+i begin+2i ...]
Colon opertator 用作index时代表全部
### Array Concatenation
	F = [A B]
	F = [A;B]
### Array Manipulation
#### with Matirx
1. '+' : 同位置相加
2. '-' : 同位置相减
3. '*' : 前一个矩阵的行与后一个矩阵的列相乘
4. '/' : 相当于与逆矩阵做乘法
5. .*: 同位置相乘
6. ./: 同位置相除
7. A': A的转置
#### with number
1. '+' : 每个entry都加number
2. '-' : 每个entry都减number
3. '*' : 每个entry都乘number
4. '/' : 每个entry都除number
5. .*: 同 *
6. ./: 同 /
7. ^ : n个矩阵相乘
8. .^: 每个entry都求n次幂
### Special Matrix
1. eye(n): n*n **identity matrix**
2. zeros(n1,n2): n1*n2 **zero matrix**
3. ones(n1,n2): n1*n2 matirx with every entry as 1
4. diag(): diagonal matrix
5. linspace(): linearly spaced vectors
6. rand(): uniformly distributed random numbers
### Matrix Related Functions
1. max(A): find max entry in **every column**
2. max(max(A)):find max entry
3. min(A):find min entry in every column
4. sum(A):get sum in every column
5. mean(A):get average in every column
6. sort(A):sort every column of A
7. sortrows(A):sort A by first column and exchange rows
8. size(A): return row and column
9. length(A): vector's length 
10. find(A == num): return num's index

## Structured programming

### if elseif else

```matlab
if condition1
	statement1
elseif condition2
	statement2
else
	statement3
end
```

### switch

```matlab
switch expression
case value1
	statement1
case value2
	statement2
otherwise
	statement3
end
```

### while

```matlab
while condition
	statement
end
```

### for

```py
for variable = start : increment : end
	commands
end
```

### break

terminates the execution of for or while loops

### Tips

1. At the beginning of the script, use command
   - **clear all** to remove previous varibles
   - **close all** to close all figures
   - **clc** to clear history
2. Use semicolon **;** at the end of commands to inhibit unwanted output
3. Use ellipsis **...** to make scripts more readable
4. **Ctrl+C** to terminate the running script

## Function

### example

```matlab
% function name = file name 
function y = freebody(x0, v0, t)
x = x0 + v0.*t + 1/2*9.8*t.*t;
```

```matlab
function [a F] = acc(v2, v1, t2, t1, m)
a = (v2 - v1)./(t2 - t1);
F = m.*a;

[Acc Force] = acc(20, 10, 5, 4, 1)
```

### Function default variables

1. inputname

   Variable name of function input

2. mfilename

   File name of currently running function

3. nargin

   Number of function input arguments

4. nargout

   Number of function out arguments

5. varargin

   Variable length input argument list

6. varargout

   Variable length out argument list

### Function handles

A handle is a **pointer** to a function

A way to create anonymous function

```matlab
f = @(x) exp(-2*x);
x = 0:0.1:2;
% draw figure
plot(x, f(x))
```

## Variables

1. numeric

   1. int8, int16, int32, int64
   2. uint8, uint16, uint32, uint64
   3. single
   4. double

2. char

   ```matlab
   % char is represented in ASCII using a numeric code between 0 to 255
   a = 'c'
   % declare string variable
   str = 'abcdeabc'
   
   str(3)
   % print 'c' , 3 as index
   
   str == 'a'
   % print 1 0 0 0 1 0 0
   
   str(str == 'a') = 'Z'
   % a -> Z  print 'ZbcdZbc'
   ```

3. logical

4. cell

5. structure

6. function handle

### Structure

#### declare

```matlab
% 1
student.id = 'first';
student.name = 'first';
student.number = 123456;
student.grade = [100, 75, 73;...
				95, 91, 85.5;...
				100, 98, 72];
student

student(2).id = 'second';
student(2).name = 'second';
student(2).number = 123456;
student(2).grade = [100, 75, 73;...
                   95, 91, 85.5;...
                   100, 98, 72];

% 2
A = struct('data', [3 4 5;8 0 1],...
			'nest', struct('x', [1 2 3], ...
						   'y', [3 4 5]));
% A.data = [3 4 5;8 0 1]
% A.nest.x = [1 2 3]
% A.nest.y = [3 4 5]
```

#### Structure Function

1. fieldnames(S) : get all the fildnames of S 
2. rmfield(S, 'id') : remove the field 'id' of S

### Cell

#### delare

delared using **{}**

```matlab
% 1
A(1,1) = {[1 2;3 4]};
A(1,2) = {'string'};
A(2,1) = {3+7i};
A(2,2) = {-pi:pi:pi};
A

% 2
A{1,1} = [1 2;3 4];
A{1,2} = 'string';
A{2,1} = 3+7i;
A{2,2} = -pi:pi:pi;
A
```

#### Accessing cell array

```matlab
A(1,1)
% return a cell data

A{1,1}
% return the content in the cell
```

#### Cell Array Function

1. cell(row,column) : create cell array
2. cell2struct : convert cell array to structure
3. mat2cell : convert array to cell array with **different sized** cells
4. num2cell : convert array to cell array with **consistently sized** cells
5. cat(dimension,A,B) : concat cell array in different dimensions
6. reshape(A,row,column) : reshape cell array

### Type Convertion

1. double()
2. single()
3. int8() int16() int32() int64()
4. uint8() uint16() uint32() uint64()

## File Access

| File Content | Extension |       Description       | Import Function | Export Function |
| :----------: | :-------: | :---------------------: | :-------------: | :-------------: |
|              |    mat    | saved matlab work space |      load       |      save       |
|     Text     |           | space delimited numbers |      load       |      save       |
| SpreadSheet  | xls, xlsx |                         |     xlsread     |    xlswrite     |

### save

1. work space

   ```matlab
   save filename.mat
   % save workspace data in file
   
   save filename.mat -ascii
   % save readable workspace data in file 
   ```

2. xls

   ```matlab
   xlswrite('filename.xlsx', variable, sheet_page, location)
   
   % example
   xlswrite('filename.xlsx', M, 1, 'E2:E4') % M is a matrix
   xlswrite('filename.xlsx', {'Mean'}, 1, 'E1')
   ```

### load

1. work space

   ```matlab
   load ('filename.mat')
   
   load ('filename.mat', '-ascii')
   ```

2. xls

   ```matlab
   score = xlsread('filename.xlsx')
   
   score = xlsread('filename.xlsx', 'B2:D4')
   
   [score header] = xlsread('filename.xlsx')
   ```

### Low-level File I/O Functions

1. fopen
2. fclose
3. fscanf
4. fprintf
5. feof

```matlab
% example
x = 0:pi/10:pi;y = sin(x);
fid = fopen('filename.txt', 'w');
for i=1:11
	fprintf(fid, '%5.3f %8.4f\n', x(i), y(i));
end
fclose(fid);
```

## plot

### plot()

1. plot(x, y) : plot each vector pairs (x,y)
2. plot(y) : plot each vector pairs (x,y) where x = [1 ... n] ,n=length(y)

#### hold on/off

use ```hold on``` to have both plots in one figure

```matlab
hold on
plot(cos(0:pi/20:2*pi))
plot(sin(0:pi/20:2*pi))
hold off
```

#### plot style

```plot(x, y, 'str')```

[LineSpec (MATLAB Functions) (northwestern.edu)](http://www.ece.northwestern.edu/local-apps/matlabhelp/techdoc/ref/linespec.html)

1. Data markers 
   - dot : .
   - cross : X
   - circle : O
   - plus sign : +
2. Line types 
   - solid line : -
   - dashed line : --
   - dash-dotted line : -.
   - dotted line : :
3. Colors 
   - black : k
   - blue  : b
   - cyan : c
   - green : g
   - magenta : m
   - red : r
   - white : w
   - yellow : y

#### legend()

add legend to graph

![2019111612140211.jpg (560×420) (csdnimg.cn)](https://img-blog.csdnimg.cn/2019111612140211.jpg)

```matlab
plot(x,y,'bd-', x,h,'gp:')
legend('L1', 'L2')
```

#### title & label

1. title()
2. xlabel()
3. ylabel()
4. zlabel()

#### text & annotation

![2019111612145162.jpg (560×420) (csdnimg.cn)](https://img-blog.csdnimg.cn/2019111612145162.jpg)

```matlab
str = '$$ \int_{0}^{2} x^2\sin(x) dx $$';
text(x, y, str, 'Interpreter', 'latex');
annotation('arrow', 'X', [0.32,0.5], 'Y', [0.6,0.4]);
```

### figure adjustment

#### Identifying the handle of an object

1. h = plot(x,y);
2. Utility functions
   1. gca ： return the handle of the current **axes** 
   2. gcf ： return the handle of the current **figure** 
   3. allchild : Find all children of specified objects
   4. ancestor : Find ancestor of graphics object
   5. delete : delete an object
   6. findall : find all graphics objects

#### Fetching or Mordifying properties

1. fetch properties : **get()**

   ```matlab
   h = plot(x,y);
   % get line properties
   get(h);
   
   % get axes properties
   get(gca)
   
   % get figure properties
   get(gcf)
   ```

2. modify properties : **set()**

   ```matlab
   set(handle, property, value)
   ```

#### properties

1. Axes
   - FontSize
   - XTick
   - XTickLabel
   - FontName
2. Line
   - LineStyle
   - LineWidth
   - Color
3. Figure
   - Position : [left, bottom, width, height]

### Mutiple plots

1. serval plots in **different figures** 

   ```matlab
   figure, plot(x, y1);
   figure, plot(x, y2);
   ```

2. serval plots in **a figure ** 

   ```matlab
   % subplot(row, column, num)
   subplot(2,2,1); plot(x,y); axis normal
   subplot(2,2,2); plot(x,y); axis square
   subplot(2,2,3); plot(x,y); axis equal
   subplot(2,2,4); plot(x,y); axis equal tight
   ```

### Control of Grid, Box and Axis

1. grid on/off
2. box on/off
3. axis on/off
4. axis normal
5. axis square
6. axis equal
7. axis equal tight

### Save figures

1.  ```matlab
    saveas(gcf, 'filename', 'formattype')
    ```

2. print

#### Option

- Bitmap
  - jpeg
  - png
  - tiff
  - bmpmono
  - bmp
- Vector
  - pdf
  - eps
  - epsc
  - meta
  - svg
  - ps
  - psc

### Advanced 2D plots

#### Logarithm Plots

Take the logarithm of the axis

1. semilogx
2. semilogy
3. loglog

![20191116162419770.jpg (560×420) (csdnimg.cn)](https://img-blog.csdnimg.cn/20191116162419770.jpg)

#### plotyy

two y axis

![2019111616233152.jpg (560×420) (csdnimg.cn)](https://img-blog.csdnimg.cn/2019111616233152.jpg)

```matlab
[AX, H1, H2] = plotyy(x,y1,x,y2);
set(get(AX(1), 'Ylabel'), 'String','Left Y-axis');
set(get(AX(2), 'Ylabel'), 'String','Right Y-axis');
set(H1, 'LineStyle', '--'); set(H2, 'LineStyle', ':');
```

#### graph 

1. Histogram

   1. hist(y, bins)

   ![2019111621020318.jpg (560×420) (csdnimg.cn)](https://img-blog.csdnimg.cn/2019111621020318.jpg)

2. bar chart

   1. bar(y) : create a bar chart of y
   2. bar3(y) : create a 3D bar chart of y 
   3. bar(y, 'stacked') : create a stacked bar chart of y
   4. barh(y) : create a hrizontal bar chart of y

   ![20191116210529183.jpg (749×211) (csdnimg.cn)](https://img-blog.csdnimg.cn/20191116210529183.jpg)

3. pie chart

   1. pie(a) : create a pie chart
   2. pie(a,[0,0,0,1]) : create a pie chart and '1' is a separated section
   3. pie3(a) : create a 3d pie chart

   ![20191116212427140.jpg (760×231) (csdnimg.cn)](https://img-blog.csdnimg.cn/20191116212427140.jpg)

4. polar chart

   1. polar(theta, r)

   ![2019111616225430.jpg (1067×266) (csdnimg.cn)](https://img-blog.csdnimg.cn/2019111616225430.jpg)

5. stairs and stem chart

   1. staris(y)
   2. stem(y)

   ![20191116213416886.jpg (758×313) (csdnimg.cn)](https://img-blog.csdnimg.cn/20191116213416886.jpg)

6. boxplot

   1. boxplot(MPG, Origin)

   ![20191116213938244.jpg (560×420) (csdnimg.cn)](https://img-blog.csdnimg.cn/20191116213938244.jpg)

7. error bar

   1. errorbar(x,y,e)

   ![20191116214616238.jpg (560×420) (csdnimg.cn)](https://img-blog.csdnimg.cn/20191116214616238.jpg)

#### color

##### fill

```matlab
t = (1:2:15)*pi/8; x = sin(t); y = cos(t)
fill(x,y,'r'); axis square off;
text(0,0,'STOP','Color','w','FontSize',80 ...
	'FontWeight','bold','HorizontalAlignment','center');
```

##### color space

[R G B]

##### color bar

```colorbar;```

Display the color of the gradation

##### imagesc

Convert the element values in matrix A to different colors by size : ```imagesc(A)``` 

##### clormap

set the current colormap ```colormap([name])```

![](https://www.mathworks.com/matlabcentral/mlc-downloads/downloads/e586a587-4a80-11e4-9553-005056977bd0/27bfcffc-efd2-41b8-9bd6-9515d75f9afc/images/screenshot.jpg)

### 3D plots

#### plot3

```matlab
plot3(x,y1,z1,'r',x,y2,z2,'b');
```

#### meshgrid

create **two matrices** that satisfy the following conditions

	- the same for each row of x
	- the same for each column of y
	- The length of vector x is the number of **columns** of the new matrix
	- The length of vector y is the number of **rows** of the new matrix

```matlab
[X,Y] = meshgrid(x,y);
% x = [1 2 3]; y = [4 5]
% X = [1 2 3;1 2 3] y = [4 4 4;5 5 5]
```

#### Surface Plots

1. mesh()
2. surf()
3. mesh**c**() : add contour at the bottom
4. surf**c**()

```matlab
x = -3.5:0.2:3.5; y = -3.5:0.2:3.5;
[X,Y] = meshgrid(x,y);
Z = X.*exp(-X.^2-Y.^2);
subplot(1,2,1); mesh(X,Y,Z);
subplot(1,2,2); surf(X,Y,Z);
```

![20191116223947784.png (554×230) (csdnimg.cn)](https://img-blog.csdnimg.cn/20191116223947784.png)

#### contour

Draw contour lines of 3D graphics

1. contour()
2. Clabel() : Add elevation labels to contour plots
3. contourf() : fill color

#### view

vary the view angle

```view(Azimuth, Elevation)```

#### light

```matlab
% example

% provide a light
L1 = light('Position',[-1 -1 -1]);

% set the light that have been provided
set(L1, 'Position', [-1 -1 1]);

%set the color of light
set(L1, 'Color', 'g');
```

## Digital Image

### Type

1. Binary Image : 0 is balck and 1 is white
2. Greyscale Image : one channel , 0 to 255, black to white
3. Color Image : three channel , R G B

### Read and Show Image

- Read an image : imread()

- Show an image : imshow()

  ```matlab
  I = imread('file'); % I is an image matrix	
  imshow(I);
  ```

#### Image info

```imageinfo(file)```

### Write Image

```matlab
imwrite(I, 'filename.png')
```

### Image Processing

#### Image Arithmetic

1. imadd
2. imsubtract
3. immultiply
4. imdivide
5. imcoplement

#### Image Histogram

1. imhist

   ```imhist(I)``` Display the grayscale histogram of image i 

2. histeq

   ```I1 = histeq(I)``` histeq can produce an image with an average gray level distribution probability

#### Geometric Transformation

|  Transform  |                           Example                            |                     Transfomation Matirx                     |    command    |
| :---------: | :----------------------------------------------------------: | :----------------------------------------------------------: | :-----------: |
| Translation | ![2019111813242824.png (67×61) (csdnimg.cn)](https://img-blog.csdnimg.cn/2019111813242824.png) | ![1110317-20170511185113457-1101532350.png (164×75) (cnblogs.com)](https://images2015.cnblogs.com/blog/1110317/201705/1110317-20170511185113457-1101532350.png) | imtranslate() |
|    Scale    | ![20191118132831770.png (58×61) (csdnimg.cn)](https://img-blog.csdnimg.cn/20191118132831770.png) | ![231022082304239.gif (346×78) (cnblogs.com)](https://images0.cnblogs.com/blog/439761/201410/231022082304239.gif) |  imresize()   |
|    Shear    | ![20191118133317854.png (77×53) (csdnimg.cn)](https://img-blog.csdnimg.cn/20191118133317854.png) | <img src="https://www.thepythoncode.com/media/articles/image-transformations-using-opencv-in-python/shearing-matrix.png" style="zoom:50%;" /> |       -       |
|  Rotation   | ![20191118134626274.png (63×64) (csdnimg.cn)](https://img-blog.csdnimg.cn/20191118134626274.png) | ![231022174333160.png (578×126) (cnblogs.com)](https://images0.cnblogs.com/blog/439761/201410/231022174333160.png) |  imrotate()   |

### Image thresholding

if pixel < threshold ,

pixel = black, 

else pixel = white

1. graythresh() : computes an optimal **threshold**

2. im2bw() : converts an images into **binary** images

   ```matlab
   I = imread('file.png');
   level = graythresh(I);
   bw = im2bw(I,level);
   ```

### Background Estimation

Estimation for the gray level of the background

```matlab
BG = imopen(I,strel('disk',15));
imshow(BG);
```

#### Background subtraction

If thresholding the inital image, some item will be subtracted and some background will be remained as dot

So, subtract background to optimize the image thresholding

```matlab
I2 = imsubtract(I,BG);
```

### Connected-component labeling : bwlabel()

![](https://sciencetipsblog.files.wordpress.com/2017/06/ccl1.png)

```matlab
[labeled, numObjects] = bwlabel(BW);
[labeled, numObjects] = bwlabel(BW,n);
% n is the Connected search area, default: 8
```

### Color-coding Objects : label2rgb()

Convert a label matrix into an RGB color image

Visualize the labeled regions

```matlab
RGB_label = label2rgb(labeled);
imshow(RGB_label);
```

### Object Properties : regionprops()

Provides a set of properties for each connected component

```matlab
data = regionprops(labeled,'basic');
```

### Interactive Selection : bwselect()

Select objects using the mouse

```matlab
objI = bwselect(BW);
imshow(objI);
```

## Differentiation and integration

### Polynomial

$$
f(x)=a_{n} x^{n}+a_{n-1} x^{n-1}+\cdots+a_{1} x+a_{0},

\newline
differentiation:
f^{\prime}(x)=a_{n} n x^{n-1}+a_{n-1}(n-1) x^{n-2}+\cdots+a_{1}

\newline
integration: 
\int f(x)=\frac{1}{n+1} a_{n} x^{n+1}+\frac{1}{n} a_{n-1} x^{n}+\cdots+a_{0} x+k
$$

```matlab
% enter a polynomial to Matlab
p = [an, an-1, .... ,a0];
```

#### polyval()

return the value of polynomial in the x

```matlab
p = [1,2,3,4]; x = -2:0.01:5;
f = polyval(p, x);
plot(x,f);
```

#### polyder()

return the polynomial differentiation

```matlab
p = [1,2,3,4];
polyder(p);
```

#### polyint()

return the polynomial integration

```matlab
polyint(p, k);
```

### Numerical

$$
Differentiation:
f^{\prime}\left(x_{0}\right)=\lim _{h \rightarrow 0} \frac{f\left(x_{0}+h\right)-f\left(x_{0}\right)}{h}
\newline
integration:
s=\int_{a}^{b} f(x) d(x) \approx \sum_{i=0}^{n} f\left(x_{i}\right) \int_{a}^{b} L_{i}(x) d x
$$

#### diff()

calculates the differences between adjacent elements of a vector

```matlab
x = [1 2 5 2 1];
diff(x);
% return 1 3 -3 -1
```

```matlab
% Numerical differentiation using diff()
% at a point
x0 = pi/2; h = 0.1;
x = [x0,x0+h];
y = [sin(x0), sin(x0+h)];
m = diff(y)./diff(x);

% within a range
h = 0.1;
x = [0:h:2*pi];
```

#### integral()

caculate the numerical integration

```matlab
y = @(x) 1./(x.^3 - 2*x);
integral(y,0,2);
% caculate the integration from 0 to 2

% Double integral
integral2(f,begin1,end1,begin2,end2);
% two param: x from begin1 to end1 ; y from begin2 to end2

% Triple integral
integral3(f,begin1,end1,begin2,end2,begin3,end3);
```

#### integration

1. Midpoint rule

   ![](https://tutorial.math.lamar.edu/classes/calcii/ApproximatingDefIntegrals_Files/image001.png)
   $$
   \int_{x_{0}}^{x_{3}} f(x) d x \approx h f_{0}+h f_{1}+h f_{2}=h \sum_{i=0}^{n-1} f_{i}
   \newline
   f_{0} = f\left(\frac{x_{0}+x_{1}}{2}\right)
   $$

Midpoint Rule Using **sum()** 

```matlab
h = 0.05; x = 0:h:2;
midpoint = (x(1:end-1) + x(2:end))./2;
y = f(midpoint);
s = sum(h*y);
```

2. Trapezoid Rule

   ![](https://tutorial.math.lamar.edu/classes/calcii/ApproximatingDefIntegrals_Files/image002.png)
   $$
   \int_{x_{0}}^{x_{3}} f(x) d x \approx h \frac{f_{0}+f_{1}}{2}+h \frac{f_{1}+f_{2}}{2}+h \frac{f_{2}+f_{3}}{2}
   \newline
   f_{0}=\frac{f\left(x_{0}\right)+f\left(x_{1}\right)}{2}
   $$
   

Trapezoid Rule Using **trapz()**

```matlab
h = 0.05; x = 0:h:2;
y = f(x);
s = h*trapz(y);
```

3. Second-order Rule : 1/3 Simpson's

   ![](https://tutorial.math.lamar.edu/classes/calcii/ApproximatingDefIntegrals_Files/image003.png)
   $$
   \int_{x_{0}}^{x_{2}} f(x) d x \approx \frac{h}{3}\left(f_{0}+{4 f_{1}}+{{f_{2}}}\right)
   $$
   

## Equation rooting

### Symbolic Root Finding Approach

Using **sym** or **syms** to create symbolic variables

```matlab
syms x
x = sym('x')
```

Function **sovle** finds roots for equation

```matlab
syms x
y = x*sin(x)-x;
solve(y,x)
% return the ans of y = 0

% Solving Multiple Equations
syms x y
eq1 = x - 2*y + 5;
eq2 = x + y - 6;
A = solve(eq1,eq2,x,y);

% Solving Equations Expressed in Symbols
syms x a b
solve('a*x^2-b') % express x in terms of a and b
solve('a*x^2-b', 'b') % express b in terms of a and x
```

### Symbolic Differentation and Integration

1. Symbolic Differentation : **diff()**

   ```matlab
   syms x
   y = 4*x^5;
   yprime = diff(y) % 20*x^4
   ```

2. Symbolic Integration : **int()**

   ```matlab
   syms x;
   y = x^2*exp(x);
   z = int(y);
   z = z - subs(z, x, 0);
   % subs is substitue 0 for x in z
   ```

### Numeric root solver

**fsolve()**

```matlab
f = @(x) (2*x + sin(x));
fsolve(f,0);
% f is a function handle
% 0 is initial guess
```

**fzero()**

it ***can't*** solve **tangent curve** question

**options**

set params for fsolve or fzero

```matlab
f = @(x) x.^2
options = optimset('MaxIter', 1e3, 'TolFun', 1e-10);
% MaxIter is number of iterations
% TolFun is Tolerance
fsolve(f,0.1,options);
fzero(f,0.1,options);
```

### Finding Roots of Polynomials

Using **roots()**

roots **only work for  Polynomials**

```matlab
roots([1,2,3,4,5]);
```

## Linear equation

$$
\left\{\begin{array}{l}
3 x-2 y=5 \\
x+4 y=11
\end{array}\right.
\newline
\newline
\underbrace{\left[\begin{array}{cc}
3 & -2 \\
1 & 4
\end{array}\right]}_{A}\underbrace{\left[\begin{array}{c}
x \\
y
\end{array}\right]}_{x}
=\underbrace{\left[\begin{array}{c}
5 \\
11
\end{array}\right]}_{b}
$$



### Matrix Decomposition Factorization

1. qr : Orthogonal-triangular decomposition
2. ldl : Block LDL'factorization for Hermitian indefinite matrices
3. ilu : Sparse incompelete LU factorization
4. lu : LU matrix factorization
5. chol : Cholesky factorization
6. gsvd : Generalized singular value decomposition
7. svd : Singular value decomposition

### Matrix Left Division

Solving systems of linear equations **Ax = b** using factorization methods

Using **/** or **mldivide()**

```matlab
A = [1 2 1;2 6 1;1 1 4];
b = [2; 7 ; 3];
x = A/b;
```

<img src="https://www.mathworks.com/help/matlab/ref/mldivide_full.png" style="zoom:67%;" />

### Cramer's(Inverse) Method

$$
A A^{-1}=A^{-1} A=I
\newline
x=A^{-1} b
$$

#### Inverse Matrix

Using **inv()**

```matlab
A = [1 2 1;2 6 1;1 1 4];
b = [2; 7 ; 3];
x = inv(A)*b;
```

#### Functions to Check Matrix Condition

Inverse matrix maybe **not exist**

Using **cond()** : Matrix Condition number

```matlab
A = [1 2 3;2 4.0001 6;9 8 7];
cond(A);
```

## Linear System

$$
\left\{\begin{array}{l}
2 \cdot 2-12 \cdot 4=x \\
1 \cdot 2-5 \cdot 4=y
\end{array}\right.
\newline
\newline
\underbrace{\left[\begin{array}{cc}
2 & -12 \\
1 & -5
\end{array}\right]}_{A}\underbrace{\left[\begin{array}{c}
2 \\
4
\end{array}\right]}_{b}
=\underbrace{\left[\begin{array}{c}
x \\
y
\end{array}\right]}_{y}
$$

### Eigenvalues and Eigenvectors

$$
\boldsymbol{A} \boldsymbol{v}_{i}=\lambda_{i} \boldsymbol{v}_{i},\lambda_{i} \in \Re

\newline 

\boldsymbol{b}=\sum \alpha_{i} \boldsymbol{v}_{i}, \alpha_{i} \in \Re
\newline
\boldsymbol{A} \boldsymbol{b}=\sum \alpha_{i} \boldsymbol{A} \boldsymbol{v}_{i}=\sum \alpha_{i} \lambda_{i} \boldsymbol{v}_{i}
$$

Using **eig()** to get **v** and **λ** 

```matlab
[v, d] = eig(A);
% A = v*d*inv(v)
```

## Statistics

### Central Tendency

1. mean : Average or mean value of array
2. median : Median value of array
3. mode : Most frequent values in array
4. prctile : Percentiles of a data set

### Range

1. max : Largest elements in array
2. min : Smallest elements in array

### Variance

$$
Variance : s=\frac{\sum\left(x_{i}-\bar{x}\right)^{2}}{n-1}
\newline
Standard\;deviation:S=\sqrt{\frac{\sum\left(x_{i}-\bar{x}\right)^{2}}{n-1}}
$$

1. sld : Standard deviation
2. var : variance

### Skewness

A measure of distribution skewness

![](https://www.fromthegenesis.com/wp-content/uploads/2018/06/skewness-mean-median-mode.jpg)

Using **skewness()** to get skewness

```matlab
y = skewness(X)
```

### Kurtosis

A measure of distribution flatness

A Kurtosis of a normal distribution is zero

![](https://www.daytrading.com/wp-content/uploads/2021/09/Kurtosis.jpg)

### Hypothesis Test

#### Two-tailed Significance Test

![](https://i0.wp.com/www.real-statistics.com/wp-content/uploads/2012/11/two-tailed-significance-testing.png?resize=303%2C181)

#### One-tailed Significance Test

![](https://i0.wp.com/www.real-statistics.com/wp-content/uploads/2012/11/right-tailed-significance-testing.png?resize=309%2C185)

#### Common Hypothesis Test

1. ranksum() : Wilcoxon rank sum test
2. signrank() : Wilcoxon signed rank test
3. ttest() : One-sample and paired-sample t-test
4. ttest2() : Two-sample t-test
5. ztest() : z-test

## Polynomial Curve Fitting

Using **polyfit()** 

![](https://linuxhint.com/wp-content/uploads/2021/08/NumPy-Polyfit-5.png)

```matlab
x = [1 2 3 4 5];
y = [1 2 3 4 5];
fit = polyfit(x,y,1);
% return the confficients of f(x) = ax + b (order = 1)

% plot the f(x) and (x,y)
xfit = [x(1):0.1:x(end)]; yfit = fit(1)*xfit + fit(2);
plot(x,y,'bo',xfit,yfit);
```

### Linearly Correlated

1. scatter() : scatte plot
2. corrcoef() : correlation , [-1,1]

```matlab
x = [1 2 3 4 5];
y = [1 2 3 4 5];
scatter(x,y); box on; axis square;
corrcoef(x,y)
```

 ### Multiple Linear Regression

Using **regress()** 

```matlab
X = [ones(length(x1),1) x1 x2];
b = regress(y,x);
% y = a + bx1 + cx2
```

### Curve Fitting Toolbox

Using **cftool()** to open Toolbox

## Interpolation

1. Linear

   ![](http://paulbourke.net/miscellaneous/interpolation/linear.gif)

2. cosine

   ![](http://paulbourke.net/miscellaneous/interpolation/cosine.gif)

3. Cubic

   ![](http://paulbourke.net/miscellaneous/interpolation/cubic.gif)

4. Hermite

   ![](http://paulbourke.net/miscellaneous/interpolation/hermite.gif)

### Common Interpolation approaches

1. interp1() : 1-D data inerpolation
2. pchip() : Piecewise Cubic Hermite Interpolation Polymial
3. spline() : Cubic spline data interpolation
4. mkpp() : Make piecewise polynomial

```matlab
x_m = 0:0.5:2*pi;
y_m = cos(x);
x = 0:0.1:2*pi;
y = interp1(x_m,y_m,x);
plot(x_m,y_m,'.','color','g');
hold on;
plot(x,y,'.','color','r');
hold off;
```



(to be continued...)



