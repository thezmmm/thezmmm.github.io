---
title: "Spring MVC"
description: "My notes about Spring MVC learing"
date: 2022-04-08T14:33:58+08:00
draft: false
type: "blog"
tags: [Java,Spring]
---

## 简介

1. M：Model，模型层，指工程中的JavaBean，作用为处理数据
2. V：View，视图层，指html或jsp页面，作用是与用户进行交互
3. C：Controller，控制层，指servlet，作用是接收请求和响应浏览器

### 工作流程

用户通过视图层发送请求到服务器，在服务器中请求被Controller接收，Controller调用响应的Model层处理请求，处理完毕后将结果返回到Controller，Controller再根据请求处理的结果找到响应的View视图，渲染数据后最终响应给浏览器

## @RequestMapping注解
### @RequestMapping注解功能
将请求和处理请求的控制器方法关联起来，建立映射关系
### @RequestMapping注解的位置

1. 标识一个类：设置映射请求路径的初始信息
2. 标识一个方法：设置映射请求路径的具体信息

### @RequestMapping注解的value属性

1. value:String[] :设置请求路径，必须设置
2. method:RequestMethod[] :设置请求方式(GET或POST)，无法匹配报错405

#### params属性

属性值为字符串数组，请求必须携带所有声明的参数，参数前有！表示不能有该参数，若请求不满足要求报错400
#### headers属性
同params，报错404
#### ant风格路径 - 模糊匹配

1. ? :表示任意单个字符
2. \* :表示任意0或多个字符
3. \*\* :表示任意的一层或多层目录

### 派生注解

1. @GetMapping
2. @PostMapping
3. @PutMapping
4. @DeleteMapping

### SpringMvc支持路径中的占位符
原始方式：/deleteUser?id=1

rest方式：/deleteUser/1

	@RequestMapping("/testPath/{id}")
	public String testPath(@PathVarible("id") Integer id){
		System.out.println("id:" + id)
		return "success";
	}

## SpringMVC获取请求参数
1. 通过ServletAPI获取

将HttpServletRequest作为控制器方法的形参，此时HttpServletRequest类型的参数封装了当前请求的请求对象

2. 通过控制器方法的形参获取参数

将请求参数名作为控制器方法的形参，此时会自动为参数赋值

存在多个值时，每个值以```，```作为分隔符，也可以作为数组

```java
@RequestMapping("/test")
public String test(String username){
	System.out.println("username:" + username);
	return "success";
}
```
3. @RequestParam

将请求参数和控制器方法的形参创建映射关系

@RequestParam注解一共有三个属性：

1. value：指定为形参赋值的请求参数名
2. required：设置是否必须传输此请求参数，默认为true
3. defaultValue：当value所指定的请求参数没有传输时，指定默认值

4. @PathVarible
5. @RequestHeader

将请求头信息和控制器方法的形参创建映射关系，三个属性同```@RequestHeader```

6. @CookieValue

将cookie数据和控制器方法的形参创建映射关系，三个属性同```@RequestParam```

7. 通过POJO获取请求参数

**自动装配实体类对象**，在控制器方法的形参设置一个实体类类型的形参，若浏览器传输的请求参数的参数名和实体类中的属性名一致，那么请求参数就会为此属性赋值

### 通过CharacterEncodingFilter处理请求参数乱码
```xml
<!-- web.xml -->
<filter>
	<filter-name>CharacterEncodingFilter</filter-name>
	<filter-class>org.springframework.web.filter.characterEncodingFilter</filter-class>
<!-- 设置请求的编码 -->
	<init-param>
		<param-name>encoding</param-name>
		<param-value>UTF-8</param-value>
	</init-param>
<!-- 设置响应的编码 -->
	<init-param>
		<param-name>forceResponseEncoding</param-name>
		<param-value>true</param-value>
	</init-param>
</filter>
```

## 域对象共享数据

1. 通过servletAPI向request域对象共享数据

```java
@RequestMapping("/testServletAPI")
public String testServletAPI(HttpServletRequest req){
    req.setAttribute("key","value");
    return "success";
}
```

2. 使用ModelAndView向request域对象共享数据

```java
@RequestMapping("/testModelAndView")
public ModelAndView testModelAndView(){
    /* 
	* ModelAndView有Model和View功能
  	* Model用于向请求域共享数据
	* View用于设置视图，实现页面跳转
	*/
    ModelAndView mav = new ModelAndView();
    // 处理模型数据，即向请求域request共享数据
    mav.addObject("key","value");
    // 设置视图名称
    mav.setViewName("success");
    return mav;
}
```

3. 使用Model向request域对象共享数据

```java
@RequestMapping("/testModel")
public String testModel(Model model){
    model.addAttribute("key","value");
    return "success";
}
```

4. 使用Map向request域对象共享数据

```java
@RequestMapping("/testMap")
public String testMap(Map<String,Object> map){
    map.put("key","value");
    return "success";
}
```

5. 使用ModelMap向request域对象共享数据

```java
@RequestMapping("/testModelMap")
public String testModelMap(ModelMap modelMap){
    model.addAttribute("key","value");
    return "success";
}
```

6. 向session域共享数据

HttpSession 对象来存储和检索来自**同一个客户端**的**多个HTTP请求**中的数据

```java
@RequestMapping("/testSession")
public String testSession(HttpSession session){
    
    session.addAttribute("key","value");
    
    value = session.getAttribute("key");
    
    // 清除session
    session.invalidate();
    
    return "success";
}
```

7. RedirectAttributes

在两个不同请求之间传参，用于重定向传参

```java
@Controller
public class MyController {
    @RequestMapping("/myPage")
    public String myPage(RedirectAttributes redirectAttributes) {
        String message = "Hello, world!";
        redirectAttributes.addFlashAttribute("message", message);
        return "redirect:/nextPage";
    }
}
```

8. 向application域(ServletContext)共享数据

ServletContext是一个**全局对象**，可以被Web应用程序中的所有Servlet和JSP页面访问。它提供了一种在应用程序的不同部分之间共享数据和资源的方法，它通常被用于配置和管理任务，**被多个用户共享**

```java
@RequestMapping("/testApplication")
public String testApplication(HttpSession session){
    ServletContext application = session.getServletContext();
    application.addAttribute("key","value");
    return "success";
}
```



## SpringMVC的视图
SpringMVC的视图是View接口，作用为渲染数据，将模型Model中的数据展示给用户

默认有转发视图InternalResourceView和重定向视图RedirectView
### ThymeleafView
当控制器方法中所设置的名称**没有任何前缀**时，此时的视图名称会被SpirngMvc配置文件中配置的视图解析器解析，视图名称拼接视图前缀和视图后缀得到最终路径，通过**转发**方式跳转

- 转发视图

SpringMVC默认转发视图为InternalResourceView

```java
return "forward:/path";
```
- 重定向视图

SpringMVC默认重定向视图RedirectView

```java
return "redirect:/";
```
### 转发和重定向的区别

重定向，服务器传递给客户端一个带有url的response，让客户端对这个url发起请求

转发，服务器将这个请求在**服务器内部**进行传递

1. 请求次数：转发请求一次，重定向请求两次
2. 地址栏：转发地址栏不变，重定向地址栏改变
3. 数据共享：转发共享数据，重定向不共享数据
4. 跳转限制：转发只能跳转本站资源，重定向可以跳转到任意url
5. 发生行为：转发是服务端行为，重定向是客户端行为

### 视图控制器 - view-controller
当控制器方法中，仅仅用来实现页面跳转，即只需要设置视图名称时，可以将处理器方法使用view-controller表示

```xml
<!--
 path: 设置处理的请求地址
 view-name: 设置请求地址所对应的视图名称
-->
<mvc:view-controller path="" view-name=""></mvc:view-controller>
```

## RESTFul
### RESTFul简介
REST:Representational State Transfer 表现层状态转移
### RESTFul的实现
相同请求路径，不同请求方式表示不同操作

1. GET：获取资源
2. POST：新建资源
3. PUT：更新资源
4. DELETE：删除资源

### HiddenHttpMethodFilter处理PUT和DELETE请求
```html
<from method="post">
	<input type="hidden" name="_method" value="put">
</from>

<!--开放对静态资源的访问-->
<mvc:default-servlet-handler />

<!--开启mvc注解驱动-->
<mvc:annotation-driven></mvc:annotation-driven>
```



## HttpMessageConverter

报文信息转换器，将请求报文转换为Java对象，或将Java对象转换为响应报文

HttpMessageConverter提供了两个注解和两个类型：@RequestBody，@ResponseBody，RequestEntity，ResponseEntity
### @RequestBody
获取请求体，在控制器方法设置一个**形参**，使用@RequestBody标注，当前请求体就会为当前注解所标识的形参赋值

	@RequestBody String requestBody
### RequestEntity
封装请求报文的一种类型，需要在控制器方法的形参中设置该类型的形参，当前请求报文就会赋值给该形参，可以用getHeaders()获取请求头信息，通过getBody()获取请求体信息

	RequestEntity<String> requestEntity
### @ResponseBody
用于标识一个控制器方法，将该方法的返回值直接作为响应报文的响应体响应到浏览器

```java
// 通过HttpServletResponse响应浏览器数据
@RequestMapping("/testResponse")
public void testResponse(HttpServletResponse resp){
	resp.getWriter().print("hello,response");
}

@RequestMapping("/testResponseBody")
@ResponseBody
public String testResponseBody(){
	return "success";
}
```
### SpringMvc处理json
1. 导入jackson依赖

```xml
<dependency>
    <groupId>com.fasterxml.jackson.core</groupId>
    <artifactId>jackson-databind</artifactId>
</dependency>
```

2. 开启mvc注解驱动

​	<mvc:annotation-driven />

3. 处理器方法上用@ResponseBody标识
4.  将Java对象作为返回值返回

### SpringMvc处理Ajax

### @RestController
相当于在类上添加```@RestController```并为每个方法添加```@ResponseBody```注解
### ResponseEntity
用于控制器方法的**返回值类型**，相当于自定义响应报文

## 文件上传和下载

### 文件下载

```java
// 使用ResponseEntity实现下载文件的功能
@RequestMapping("/testDown")
public ResponseEntity<byte[]> testResponseEntity(HttpSession session){
    // 获取ServletContext对象
    ServletContext servletContext = session.getServletContext();
    // 获取服务器种文件的真实路径
    String realPath = servletContext.getRealPath("/static/img/1.jpg");
    // 创建输入流
    InputStream is = new FileInputStream(realPath);
    // 创建字节数组
    byte[] bytes = new byte[is.available()];
    // 将流读到字节数组中
    is.read(bytes);
    // 创建HttpHeaders对象设置响应头信息
    MultiValueMap<String,String> headers = new HttpHeaders();
    // 设置下载方式和文件名
    headers.add("Content-Disposition"，"attachment;filename=1.jpg");
    // 设置响应状态码
    HttpStatus statusCode = HttpStatus.OK;
    // 创建ResponseEntity对象
    ResponseEntity<byte[]> responseEntity = new ResponseEntity<>(bytes,headers,statusCode);
    // 关闭输入流
    is.close();
    return responseEntity;
}
```
### 文件上传
#### 引入依赖

```xml
<dependency>
    <groupId>commons-fileupload</groupId>
    <artifactId>commons-fileupload</artifactId>
</dependency>
<dependency>
    <groupId>commons-io</groupId>
    <artifactId>commons-io</artifactId>
</dependency>
```

#### 配置文件上传解析器

```xml
<bean id="multipartResolver" class="org.springframework.web.multipart.commons.CommonsMultipartResolver"></bean>
```

#### 代码实现

```html
<form th:action="@{/testUp}" method="post" enctype="multipart/form-data">
    <input type="file" name="photo">
    <input type="submit" value="上传">
</form>
```

```java
@RequestMapping("/testUp")
public String testUp(MultipartFile photo，HttpSession session){

    // 获取上传的文件的文件名
    String fileName = photo.getOriginalFilename();
    // 获取上传的文件的后缀名
    String suffixName = fileName.substring(fileName.lastIndexOf("."));	
    // 将UUID作为文件名
    String uuid = UUID.randomUUID().toString();
    // 将uuid和后缀名拼接后的结果作为最终文件名
    fileName = uuid + suffixName;

    // 通过ServletContext获取服务器中photo目录的路径
    ServletContext servletContext = session.getServletContext();
    String photoPath = servletContext.getRealPath("photo");
    File file = new File(photoPath);
    // 判断photoPath对应路径是否存在
    if(!file.exists()){
        // 若不存在，则创建目录
        file.mkdir();
    }
    String finalPath = photoPath + File.separator + fileName;
    photo.transferTo(new File(finalPath));
    return "success";
}
```

## 拦截器
SpringMVC拦截器用于拦截控制器方法的执行，拦截器需要实现HandlerInterceptor或者继承HandlerIntercepterAdapter类
### 拦截器的配置
SpiringMVC的拦截器必须在SpirngMVC的配置文件中配置

```xml
<mvc:interceptors>
    <mvc:interceptor>
        <mvc:mapping path="" />
        <mvc:exclude-mapping path="" />
        <!-- 第一种方式 -->
        <!--<bean class="com.xxx.interceptor"></bean>-->
        <!-- 第二种方式 -->
        <!--<ref bean="interceptor"></ref>-->
    </mvc:interceptor>
</mvc:interceptors>
```
### 拦截器的抽象方法

1. preHandle：

   控制器方法执行之前执行，boolean返回值表示拦截或放行，true为放行

2. postHandle：

   控制器方法执行后执行

3. afterComplation：

  处理完视图和模型数据，渲染完毕后执行

### 拦截器执行顺序

1. 若每个拦截器的preHandle()都返回true
    此时preHandle()按照配置的顺序执行，而postHandle()和afterComplation()反序执行
2. 若每个拦截器的preHandle()都返回false
    preHandle()返回false和它之前的拦截器的preHandle()都会执行，postHandle()都不执行，返回false之前的拦截器的afterComplation()会执行

## SpringMVC执行流程
### SpringMVC常用组件

- DispatcherServlet:**前端控制器**，由框架提供
	- 作用：统一处理请求和响应，整个流程控制的中心，由它调用其他组件处理用户的请求
- HandlerMapping：**处理映射器**，框架提供
	- 作用：根据请求的url，method查找Handler，即控制器方法
- Handler：**处理器**，工程师开发
	- 作用：在DispatcherServlet的控制下，对具体的用户请求进行处理
- HandlerAdapter：**处理器适配器**，框架提供
	- 作用：通过HandlerAdapter()对处理器进行执行
- ViewResolver：**视图解析器**，框架提供
	- 作用：进行视图解析，得到相应的视图，如ThymeleafView等
- View：**视图**，框架提供
	- 作用：将模型数据通过页面展示给用户
	###DispatcherServlet初始化流程

### SpringMVC的执行流程

1. 用户向服务器发送请求，请求被SpringMVC前端控制器DispatcherServlet捕获
2. DispatcherServlet对请求url解析，得到请求资源标识符(uri)，判断请求uri对应的映射
	- 不存在
		1. 判断是否配置了mvc:default-servlet-handler
		2. 如果没配置，客户端报错404
		3. 如果有配置，则访问目标资源，找不到报错404
	- 存在
		1. 根据URI，调用HandlerMapping获得该Handler配置的所有相关的对象(Handler对象以及相关拦截器)，最后以HandlerExecutionChain执行链对象的形式返回
		2. DispatcherServlet根据Handler，选择一个合适的HandlerAdapter
		3. 如果成功获得HandlerAdapter，执行拦截器的preHandler()
		4. 提取Request中的模型数据，填充Handler形参，开始执行Handler(Controller)方法，处理请求
			- 填充过程中，根据配置，Spring将做一些额外工作
				1. HttpMessageConveter：将请求消息(如Json，xml等数据)转换成一个对象，将对象转换为指定的响应信息
				2. 数据转换：对请求消息进行数据转换
				3. 数据格式化：对请求消息进行数据格式化
				4. 数据验证：验证数据的有效性(长度，格式)，验证结果存储到BindingResult或Error中
		5. Handler执行完成后，向DispatcherServlet返回一个ModelAndView对象
		6. 此时开始执行拦截器的postHandle()方法
		7. 根据返回的ModelAndView(此时会判断异常，并进行处理)，选择一个合适的ViewResolver进行视图解析，根据Model和View渲染视图
		8. 渲染视图完毕后执行拦截器的afterCompletion()方法
		9. 将渲染结果返回给客户端