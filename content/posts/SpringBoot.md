---
title: "SpringBoot"
description: "My notes about Spring Boot learing"
date: 2022-04-03T14:33:58+08:00
draft: false
type: "blog"
tags: [Java,Spring]
---

## 底层注解

### @SpringBootApplication

用于主程序类

相当于三个注解```@SpringBootConfiguration```,```@EnableAutoConfiguration```,```@CompontentScan("com.boot")```

### @Configuration

用于构造配置类

```java
/**
 * 1.配置类中使用@Bean标注在方法上给容器注册组件，默认为单实例
 * 2.配置类本身也是组件
 */
@Configuration //告诉SpringBoot这是一个配置类，即配置文件
public class MyConfig{

    /* 给容器中添加组件
	 * 方法名作为组件的id
	 * 返回类型为组件类型
	 * 返回值为组件在容器中的实例
	 */
    // @Component，@Service，@Controller，@Reposity也可以使用
    @Bean
    public User user01(){	
        return new User();
    }
}
```
#### proxyBeanMethods

代理bean的方法，默认为true

1. Full模式，如果```@Configuration(proxyBeanMethods=true)```，则由**代理对象调用方法**，保持组件**单实例**，可以保持**组件之间的依赖关系**
2. Lite模式，```@Configuration(proxyBeanMethods=false)```，则每次调用方法都会**new一个新的对象**，而不是从容器中取出，不能保持组件之间的依赖关系

### @ComponentScan
组件扫描，默认扫描该类所在包下所有配置类，也可指定要扫描的包使用**value**属性
### @Import
写在组件类上，给容器中导入组件，组件默认名为全类名

```java
// 括号内的值为数组
@Import({User.class})
```
### @Conditional
写在创建对象的注解或类上，条件装配：满足Conditional指定的条件，则进行组件注入
### @ImportResource
写在配置类上，导入spring的配置文件

```java
@ImportResource("classpath:beans.xml")
```
### @ConfigurationProperties
写在类上，用于配置属性

```java
// 将需要注入的属性写在application.properties中
mycar.price = 100000
mycar.brand = byd

//1.直接在组件类中注入属性
@Component
@ConfigurationProperties(prefix="mycar")
public class Car{
	
	private String brand;
	private Integer price;
}

//2.在配置类中注入属性
//不需要写@Component
@ConfigurationProperties(prefix="mycar")
public class Car{
	private String brand;
	private Integer price;
}
@EnableConfigurationProperties(Car.class)
// 写在配置类上，开启Car配置绑定功能，并注册这个组件
```

## 自动配置

1. SpringBoot先加载所有的自动配置类(xxxAutoConfiguration)
2. 配置类按照条件生效，默认绑定配置文件指定的值(xxxProperties)
3. 用户配置的内容，以用户优先(ConditionalOnMissingBean)

### 自动包规则原理

1. @SpringBootConfiguration:<br>代表当前是一个配置类
2. @EnableAutoConfiguration:<br>

     - @AutoConfigurationPackage:<br>利用Register给容器中导入一系列组件,将MainApplication所在包下的所有组件导入
     - @Import(AutoConfigurationImportSelector.class):<br>利用getAutoConfigurationEntry(annotationMetadata)给容器中批量导入组件,调用List configurations = getCandidateConfigurations(annotationMetadata,attributes)获取**所有**需要导入到容器中的**自动配置类**
3. @ComponentScan:<br>指定扫描Spring注解

### 按需开启自动配置项
按照条件装配规则(@Conditional)，最终按需配置
### 定制化配置

1. 使用@Bean替换底层组件
2. 查看组件获取的配置文件的值，修改```application.properties```配置文件

## 开发工具
### Lombok

1. 引入依赖

   ```xml
   <dependency>
       <groupId>org.projectlombok</groupId>
       <artifactId>lombok</artifactId>
   </dependency>
   ```

2. 安装lombok插件

3. 使用注解
    注解添加在类上

    1. @Data:
    
       为属性生成set和get方法
    
    2. @ToString:
    
       生成toString方法
    
    3. @AllArgsConstructor:
    
       生成一个**全参构造器**
    
    4. @NoArgsConstructor:
    
       生成一个**无参构造器**
    
    5. @Slf4j:
    
       注入一个log属性（日志）
    

### Dev-tools

1. 引入依赖

   ```xml
   <dependency>
       <groupId>org.springframework.boot</groupId>
       <artifactId>spring-boot-devtools</artifactId>
       <optional>true</optional>
   </dependency>
   ```

2. 快速重启
   ctrl + F9

### Spring Initializer
项目初始化工具

## yaml
### 基本语法

1. key: value，**有空格**
2. 大小写敏感
3. 使用缩进表示层级关系
4. 缩进不适用tab，只用空格
5. 缩进的空格数不重要，对齐即可
6. '#'表示注释
7. 字符串无需引号
8. 双引号不转义，单引号转义

### 数据类型

- 字面量:单个的，不可再分的值(date，boolean，string，number，null)

  - k:v

- 对象:键值对的集合(map，hash，set，object)<br>

  1. 行内写法

     k: {k1:v1,k2:v2}

  2. 分行写法

     k:
       k1: v1
       k2: v2

- 数组:一组按次序排列的值(array，list，queue)

  1. 行内写法

     k: [v1,v2]

  2.  分行写法

     k:

       \- v1

       \- v2

### 配置提示
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-configuration-processor</artifactId>
    <optional>true</optional>
</dependency>
```

### 关闭对配置处理器的打包(新版自带)
配置提示利于开发，但对项目没有影响，应该避免打包冗余

```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-maven-plugin</artifactId>

            <configuration>
                <excludes>
                    <exclude>
                        <groupId>org.springframework.boot</groupId>
                        <artifactId>spring-boot-configurationprocessor</artifactId>
                    </exclude>
                </excludes>
            </configuration>

        </plugin>
    </plugins>
    <configuration>
        <excludes>
            <exclude>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-configurationprocessor</artifactId>
            </exclude>
        </excludes>
    </configuration>

    </plugin>
</plugins>
</build>
```
## Web开发
### 静态资源
#### 静态资源目录
类路径下:```/static``` or ```/public``` or ```/resources``` or ```/META-INF/resources```

访问：当前项目根路径/静态资源名
#### 静态资源访问前缀

“static-path-pattern” 用于定义触发服务器为静态资源提供服务的**URL**路径模式

```yaml
spring:
  mvc:
    static-path-pattern: /res/**
#yaml格式
#访问:当前项目+static-path-pattern+静态资源名
```

#### 改变默认静态资源路径

“static-locations” 用于指定存储静态资源的服务器文件系统上的目录

```yaml
web:
  resources:
    static-locations: [classpath:/folder/]
```

### welcome page

1. 静态资源目录下的```index.html```文件
2. controller能处理/index

### Favicon - 网站图标
将图标命名为```favicon.ico```，放在静态资源路径下

### 请求处理
#### 请求映射
##### Rest风格
使用Http请求方式动词来表示对资源的操作

/user GET-获取用户 DELETE-删除用户 PUT-修改用户 POST-保存用户
##### 核心Filter

HiddenHttpMethodFilter
##### 用法
表单method=post，隐藏域_method=xxx

##### 代码实现

```java
@RestController
public class HelloController{
    //@RequestMapping(value="/user",method="RequestMethod.Get")
    @GetMapping("/user")
    public String getUser(){

    }

    ...
}
```


```html
<form action="/user" method="get">
    <input value="REST-GET t提交" type="submit"/>
</form>

<form action="/user" method="post">
    <input value="REST-POST t提交" type="submit"/>
</form>

<form action="/user" method="post">
    <!--隐式实现真正的请求方法-->
    <input name="_method" type="hidden" value="DELETE">
    <input value="REST-DELETE t提交" type="submit"/>
</form>

<form action="/user" method="post">
    <input name="_method" type="hidden" value="PUT">
    <input value="REST-PUT t提交" type="submit"/>
</form>

// 配置文件中开启页面表单的Rest功能
mvc:
hiddenmethod:	
filter:
enabled: true
```
##### Rest原理

1. REST风格表单提交

     - 表单提交中带上参数 ```_method```
     - 请求被HiddenHttpMethodFilter拦截
     	- 请求正常并且是POST请求
     	- 获取```_mthod```的值
     	- requestWrapper重写了getMethod方法，返回传入的值
     	- 过滤器放行Wrapper
2. Rest使用客户端工具
     - 直接发送PUT,DELETE等请求，无需Filter

##### 更改默认的_method
```java
@Configuration(proxyBeanMethods = false)
public class WebConfig{

    @Bean
    public HiddenHttpMethodFilter hiddenHttpMethodFilter(){
        HiddenHttpMethodFilter methodFilter = new HiddenHttpMethodFilter();
        methodFilter.setMethodParam("_m");
        return methodFilter;
    }
}
```

#### 普通参数和参数注解
##### 参数注解
###### @PathVaribale
路径变量

```java
@GetMapping("/car/{id}/owner/{username}")
public Map<String,Object> getCar(@PathVarible("id") Interger id,
                                 @PathVarible("username") String name
                                 @PathVarible Map<String,String>)
{
    Map<String,Object> map = new HashMap<>();
    map.put("id",id);
    map.put("name",name);
    map.put("pv",pv);
    return map;

}
```
###### @RequestHeader
获取请求头，可以用Map拿到所有信息
###### @RequestParam
获取请求参数，可以用Map拿到所有请求参数
###### @CookieValue
获取Cookie的值
###### @RequestBody
获取请求体(POST)
###### @RequestAttribute
获取request域属性
###### 参数处理原理

1. HandlerMapping中找到能处理请求的Handler(Controller.method())
2. 为当前Handler找一个适配器(HandlerAdapter)
3. 执行目标方法<br>DispatcherServlet.doDispatch() => invokeHandlerMethod(req,resp,handlerMethod)
4. 参数解析器，确定将要执行的目标方法的每一个参数的值
5. 返回值处理器

##### Servlet API
```WebRequest```，```ServletRequest```，```MultipartRequest```，```HttpSession```，
```javax.servlet.http.PushBuilder```，```principal```，```InputStream```，```Reader```，```HttpMethod```，
```Locale```，```TimeZone```，```Zoneld```
##### 复杂参数

```Map```,```Model```：放在req的请求域，request.setAttribute

```RedirectAttributes```：重定向携带数据

```ServletResponse```：response

##### 自定义对象参数
可以**自动**类型转换与格式化，可以**级联封装**

```java
/**
 * 姓名：<input name="userName"/><br>
 * 生日：<input name="birth"/><br>
 * 年龄：<input name="age"/><br>
 * 宠物姓名：<input name="pet.name"/><br>
 * 宠物年龄：<input name="pet.age"/><br>
 */

@Data
public class Person{

    private String userName;
    private Integer age;
    private Date birth;
    private Pet pet;
}

@Data
public class Pet{

    private String name;
    private Integer age;
}

@PostMapping("/saveuser")
public Person saveUser(Person person){
    return person;
}
```
##### 自定义Convert

```java
宠物: <input name="pet" value="阿猫,3">	

@Bean
public WebConfiguration webMvcConfigurer(){
	return new WebMvcConfigurer(){

		@Override
		public void addFormatters(FormatterRegistry registry){
			registry.addConvert(new Convert<String,Pet>){
				
				@Override
				public Pet convert(String source){
					//source="阿猫,3"
					if(!StringUtils.isEmpty()){
						Pet pet = new Pet();
						String[] split = source.split(",");
						pet.setName(split[0]);
						pet.setAge(Interger.parseInt(split[1]));
						return pet;
					}
					return null;
				}
			}
		}
	}
}
```

### 响应处理

1. @ResponseBody 响应数据出去，调用RequestResponseBodyMethodProcessor处理
2. Processor通过MessageConverter处理方法返回值
3. 所有MessageConverter合起来可以支持各种媒体类型数据的读写
4. 内容协商找到最终的messageConverter

#### 响应数据
##### JSON

1. web场景自动引入json依赖
2. 在方法上标注```@ResponseBody```
3. 给前端自动返回json数据

##### HttpMessageConverter
canRead(Class<?>,MediaType):boolean
canWrite(Class<?>,MediaType):boolean

看是否支持将此Class类型的对象，转为MediaType类型的数据
#### 内容协商
根据客户端接收能力不同，返回不同媒体类型数据

1. 引入xml依赖
2. 只需要改变请求头中Accept字段
3. 开启浏览器**基于请求参数**的内容协商功能
  - 配置文件：spring.contentnegotiation.favor-parameter:true
  - 请求参数：format=json

##### 内容协商原理

1. 判断当前响应头中是否已经有确定的媒体类型
2. 获取客户端支持接受的内容类型（客户端Accept请求字段）

     - contentNegotiationManager 内容协商管理器，默认使用基于请求头的策略
     - HeaderContentNegotiationStrategy 确定客户端可以接收的内容类型
3. 遍历循环所有的MessageConverter，看谁支持操作返回的对象
4. 找到支持操作对象的converter，统计converter支持的媒体类型
5. 对客户端需求和服务端能力进行最佳匹配媒体类型
6. 用支持将对象转为最佳匹配媒体类型的converter，调用它进行转换

##### 自定义MessageConverter

```java
@Configuration(proxyBeanMethods = false)
public class WebConfig{

    // WebMvcConfigurer定制化SpringMVC的功能
    @Bean
    public WebMvcConfigurer webMvcConfigurer(){
        return new WebMvcConfigurer(){

            @Override
            public void extendMessageConverters(List<HttpMessageConverter<?> converters>){
                converters.add(new CustomMessageConverter());
            }
        }
    }
}


// 自定义Converter
public class CustomMessageConverter implements HttpMessageConverter<Person>{

    @Override
    public boolean canRead(Class<?> clazz, MediaType mediaType){
        return false;
    }

    @Override
    public boolean canWrite(Class<?> clazz, MediaType mediaType){
        return clazz.isAssignableFrom(Person.class);
    }

    // 
    @Override
    public List<MediaType> getSupportedMediaTypes(){
        return MediaType.parseMediaTypes("application/x-custom");
    }

    @Override
    public Person read(Class<? extends Person> clazz,HttpInputMessage inputMessage){
        return null;
    }

    @Override
    public void write(Person person,MediaType contentType, HttpOutputMessage outputMessage){
        // 自定义协议数据的写出
        String data = person.getUserName()+";"+person.getAge()+";"+person.getBirth();

        OutputStream body = outputMessage.getBody();
        body.write(data.getBytes());
    }
}
```
### 视图解析与模板引擎
springboot默认不支持JSP，需要引入第三方模板引擎技术实现页面渲染
#### Thymeleaf

```xml
<!--引入依赖-->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-thymeleaf</artifactId>
</dependency>
```

##### 基本语法

```html
<html xmlns:th="http://www.thymeleaf.org">
```

###### 表达式

1. 变量取值：${...}<br>获取请求域，session域对象等
2. 选择变量：*{...}<br>获取上下文对象值
3. 消息：#{...}<br>获取国际化等值
4. 链接：@{...}<br>生成链接
5. 片段表达式：~{...}	<br>jsp:include作用，引入公共页面

###### 字面量

1. 文本值
2. 数字
3. 布尔值
4. 空值null
5. 变量

###### 文本操作

1. 字符串拼接：+
2. 变量替换：The name is ${name}

###### 数学运算

###### 布尔运算

1. and or
2. ！ not

###### 比较运算
###### 条件运算

1. If-then：(if)?(then)
2. If-then-else：(if)?(then):(else)
3. Default:(value)：?:(defaultvalue)

##### 设置属性值 - th:attr
###### 设置单个值

```html
<form action="subscribe.html" th:attr="action=@{/subscribe}">
    <fieldset>
        <input type="submit" value="Subscribe!" th:attr="value=#{subscribe.submit}">
    </fieldset>
</form>
```
###### 设置多个值
```html
<img src="../images/gtv.png" th:attr="src=@{/images/gtv.png},title=#{logo}">
```
###### 替代写法

```html
<input type="submit" value="Subscribe!" th:value="#{subscribe.submit}">
<form action="subscribe.html" th:action="@{/subscribe}">
```
##### 迭代

```html
<tr th:each="prod : ${prods}">
	<td th:text="${prod.name}">Onions</td>
	<td th:text="${prod.price}">2.41</td>
	<td th:text="${prod.inStock}?#{true}:#{false}">Onions</td>
</tr>
```

##### 条件运算
```html
<a href="comments.html"
th:href="@{/product/comments(prodId=${prod.id})}"
th:if="${not #lists.isEmpty(prod.comments)}">view</a>
```
#### 拦截器

1. 编写拦截器实现HandlerInterceptor接口

```java
// 配置拦截器
public class LoginInterceptor implements HandlerInterceptor{
    @Override
    public boolean preHandle(HttpServletRequest req,HttpServletResponse resp,Object handler){

        //登录检查逻辑
        HttpSession session = req.getSession();
        Object loginUser = session.getAttribute("loginUser");
        if(loginUser!=null){
            //放行
            return true;
        }else{
            resp.sendRedirect("/");
            return false;
        }
    }

    @Override
    public void postHandle(HttpServletRequest req,HttpServletResponse resp,Object handler){

    }

    @Override
    public void afterCompletion(HttpServletRequest req,HttpServletResponse resp,Object handler){

    }
}
```


2. 注册拦截器到容器中，WebMvcConfigurer.addInterceptors
   

```java
@Configuration
public class AdminWebConfig implements WebMvcConfigurer{
    @Override
    public void addInterceptors(InterceptorRegistry registry){
        registry.addInterceptor(new LoginInterceptor)
            .addPathPatterns("/**")
            .excludePathPatterns("/login","/css/**","/js/**");
        // 可以为静态资源添加前置路径来进行拦截
    }
}
```

#### 文件上传

1. 页面表单

```html
<form role="form" th:action="@{/upload}" method="post" enctype="multipart/form-data">
    <div>
        <label for="exampleInputEmail">Email</label>
        <input type="email" name="email" id="exampleInputEmail">
    </div>
    <div>
        <label for="exampleInputPassword">name</label>
        <input type="text" name="username" id="exampleInputPassword">
    </div>
    <div>
        <label for="exampleInputFile">头像</label>
        <input type="file" name="headerImg" id="exampleInputFile">
    </div>
    <div>
        <label for="exampleInputFile">生活照</label>
        <input type="file" name="photos" mutiple>
    </div>
</form>
```
2. 文件上传代码

```java
@Controller
public class FormController{
    @GetMapping("/form/form_layout")
    public String form/form_layout(){
        return "form/form_layout";
    }

    @PostMapping("/upload")
    public String upload(@RequestParam("email") String email,
                         @RequestParam("username") String userName,
                         @RequestPart("headerImg") MultipartFile headerImg,
                         @RequestPart("photos") MultipartFile[] photos){
        if(!headerImg.isEmpty()){
            //保存到文件服务器
            String filename = headerImg.getOriginFilename();
            headerImg.transferto(new File("E:\\cache\\" + filename));
        }

    }
}
```
3. 文件上传原理
   文件上传自动配置原理 - MultipartAutoConfiguration -> MultipartProperties

- 自动配置了 StandardServletMultipartResolver(文件上传解析器)
- 原理步骤
	1. 使用文件上传解析器判断(isMultipart)并封装(resolveMultipart返回MultipartHttpServletRequest)文件上传
	2. 参数解析器来解析请求的文件内容封装成MultipartFile
	3. 将request中文件信息封装成一个Map

#### 错误处理
##### 默认规则

- 默认情况下，SpringBoot提供```/error```处理所有错误的映射
- 对于机器客户端，生成JSON响应，包含错误，Http状态和异常消息的详细信息
- 对于浏览器客户端，响应一个"whitelabel"错误视图，以HTML形式呈现相同数据
- 对其进行自定义，添加View解析为error
- 完全替换默认行为，可以实现ErrorController并注册该类型的Bean定义，或添加ErrorAttributes类型的组件以使用现有机制但替换内容
- error/下的4xx，5xx页面会被自动解析

##### 定制错误处理逻辑

- 自定义错误页
  - error/404.html
  - error/5xx.html
- @ControllerAdvice + @ExceptionHandler 处理全局异常
  ```java
  @Slf4j
  @ControllerAdvice
  public class GlobalExceptionHandler{
  
      @ExceptionHandler({ArithmeticException.class,NullPointerException.class})	
      public String handleArithException(Exception e){
          log.error("异常是:{}",e)
              return "login"; // 视图地址
      }
  }
  ```
- @ResponseStatus + 自定义异常

  ```java
  // 自定义异常
  @ResponseStatus(value=HttpStatus.FORBIDDEN,reson = "用户数量太多")
  public class UserTooManyException extends RuntimeException{
      public UserTooManyException(){
      }
      public UserTooManyException(String message){
          super(message);
      }
  }
  ```
- ErrorViewResolver 实现自定义处理异常
- 自定义实现 HandlerExceptionResolver 处理异常

  ```java
  @Order(value=0) //优先级，数字越小，优先级越高
  @Component
  public class CustomerHandlerExceptionResolver implements HandlerExceptionResolver{
      @Override
      public ModelAndView resolveException(HttpServletRequest req,HttpServletResponse resp,Object handler,Exception ex){
          try{
              resp.sendError(404,"自定义错误");
          } catch (IOException e){
              e.printStackTrace;
          }
          return new ModelAndView();
      }
  }
  ```

##### 异常处理自动配置原理

- ErrorMvcAutoConfiguration
  - 类型:DefaultErrorAttributes -> id:errorAttributes
  	- public class DefaultErrorAttributes implements ErrorAttributes,HandlerExceptionResolver
  	- DefaultErrorAttributes：定义错误页面包含哪些数据
  - 类型:BasicErrorController -> id:basicErrorController(json+whitelabel 适配响应)
  	- 处理默认/error路径的请求；页面响应new ModelAndView("error",model);
  	- 容器中有组件View id:error(响应默认错误页)
  	- 容器中有组件BeanNameViewResolver(视图解析器)，按照返回的视图名作为组件的id去容器中寻找View对象
  - 类型:DefaultErrorViewResolver -> id:conventionErrorViewResolver
  	- 如果发生错误，会以HTTP的状态码作为视图页地址，找到真正的页面
  	- error/404、5xx.html

#### 原生组件注入

1. 使用Servlet API

```java
@ServletComponentScan(basePackages="com.boot")
//指定原生Servlet组件都放在哪里
// 效果直接响应，不经过Spirng的拦截器
@WebServlet(urlPatterns="/my")
@WebFilter(urlPatterns={"/css/*","/images/*"})
@WebListener
```
2. RegistrationBean
   ```ServletRegistrationBean``` ，```FilterRegistrationBean``` ，```ServletListenerRegistrationBean```

```java
@Configuration	
public class MyRegistrationConfig{

    @Bean
    public ServletRegistrationBean myServlet(){
        MyServlet myServlet = new MyServlet();
        return new ServletRegistrationBean(myServlet,"/my","/my1");
        // 映射的路径
    }
}
```

#### 定制化原理
##### 原理分析规则
场景stater -> xxxAutoConfiguration -> 导入xxx组件 -> 绑定xxxProperties -> 绑定配置文件项
##### 定制化常见方式

1. 修改配置文件
2. xxxCustomizer
3. 编写自定义配置类 xxConfiguration + @Bean 替换/增加容器中默认组件
4. *web应用实现WebMvcConfigurer定制化web功能
5. @EnableWebMvc + WebMvcConfigurer 全面接管SpirngMvc，所有规则都需要配置

## 数据访问
### SQL

1. 数据源的自动配置 - HikariDataSource

```xml
<!-- 导入JDBC场景 -->
	<dependency>
		<groupId>org.springframework.boot</groupId>
		<artifactId>spring-boot-starter-data-jdbc</artifactId>
	</dependency>
<!-- 导入Mysql驱动 -->
<dependency>
	<groupId>mysql</groupId>
	<artifactId>mysql-connector-java</artifactId>
</dependency>
```


```yaml
#修改配置项
spring:
  datasource:
    url:
	username:
	password:
	driver-class-name:
```
2. 使用Druid数据源
   官方github地址：https://github.com/alibaba/druid

```xml
<!--引入依赖-->
<dependency>
    <groupId>com.alibaba</groupId>	
    <artifactId>druid</artifactId>
</dependency>
```
```java
// 也可通过配置文件设置
@Configuration
public class MyDataSourceConfig{
    @ConfigurationProperties("spring.datasource")
    @Bean
    public DaraSource dataSource(){
        DruidDataSource druidDataSource = new DruidDataSource();
        return druidDataSource;
    }

    @Bean
    public ServletRegistrationBean statViewServlet(){
        StatViewServlet statViewServlet = new StatViewServlet();
        ServletRegistrationBean<StatViewServlet> registrationBean = new 		ServletRegistrationBean<StatViewServlet>(statViewServlet,"/durid/*");
        return registrationBean;
    }
}
```

3. 整合MyBaits

## 单元测试
### JUnit5常用注解
1. @Test
   表示方法是测试方法

2. @DisplayName
   为测试类/方法设置展示名称

3. @BeforeEach
   在每个单元测试之前执行

4. @AfterEach
   在每个单元测试之后执行

5. @BeforeAll
   在所有单元测试之前执行，静态方法

6. @AfterAll
   在所有单元测试之后执行，静态方法

7. @Disabled
   禁用测试方法

8. @Timeout
   设置限定时间，value和unit两个属性

9. @RepeatedTest
   设置测试重复次数

10. @SpringbootTest
    连接spring的容器功能

### 断言
断言失败，后面的代码都不执行

1. assertEquals(expected,actual，String message):<br>判断相等
2. assertNotEquals(expected,actual，String message):<br>判断不相等
3. assertSame():<br>判断是否指向同一个对象
4. assertNotSame():<br>判断是否指向不同对象
5. assertTrue():<br>判断布尔值是否为True
6. assertFalse():<br>判断布尔值是否为False
7. assertNull():<br>判断给定的对象引用是否为null
8. assertNotNull():<br>判断给定的对象引用是否不为null
9. assertThrows():<br>断定业务逻辑一定出现异常
10. fail():<br>快速失败

### 前置条件 - assumptions
用法同断言

不满足的断言使测试方法失败，不满足的前置条件只会使测试方法终止
### 嵌套测试

### 参数化测试

1. @ParameterizedTest:<br>声明该方法是一个参数化测试
2. @ValueSource(ints = {1,2,3}):<br>为参数化测试传值
3. @NullSource:<br>提供一个null的入参
4. @EnumSource:<br>提供一个枚举入参
5. @MethodSource:<br>表示读取指定方法的返回值为参数化测试入参(方法需要返回一个流)

## 指标监控
### Spring Boot Actuator

1. 引入依赖

   ```xml
   <dependency>
       <groupId>org.springframework.boot</groupId>
       <artifactId>spring-boot-stater-actuator</artifactId>
   </dependency>
   ```

2. 访问[localhost:8080/actuator/endpointName]()

3. 暴露所有监控信息为Http
   命令台打开jconsole默认暴露所有Endpoints

```yaml
management:
  endpoints:
	enabled-by-default:true #暴露所有端点信息
	web:
	  exposure:
	    include:'*' #以web方式暴露
```
### 常用端点

1. Health:监控状况
2. Metrics:运行时指标
3. Loggers:日志记录

### 开启禁用端点
managment.endpoint.<endpointName>.enabled = true
### 定制Endpoint
#### 定制info信息
1. 编写配置文件

   ```
   info:
     appName: boot-admin
     version: 2.0.1
     mavenProjectName: @poject.atifactId@	#使用@@获取maven的pom文件值
     mavenProjectVersion: @poject.version@
   ```

2. 编写infoContributor

   ```java
   @Compoent
   public class ExampleInfoContributor implements InfoContributor{
   	@Override
   	public void contribute(Info.Builder,builder){
   		builder.withDetail("example",Collections.singletonMap("key","value"));
   	}
   }
   ```

   

#### 定制metrics

```java
class MyService{
    Counter counter;
    public MyService(MeterRegistry meterRegistry){
        counter = meterRegistry.counter("myservice.method.running.counter");
    }
    public void hello(){
        counter.increment();
    }
}
```
```java
// 另一种方式
@Bean
MeterBinder queueSize(Queue queue){
    return (registry) -> Gauge.builder("queueSize",queue::size).register(registry);
}
```

#### 自定义Endpoint

```java
@Component
@Endpoint(id = "container")
public class DockerEndpoint{

    @ReadOperation
    public Map getDockerInfo(){
        return Collections.singletonMap("info","docker started..");
    }
    @WriteOperation
    private void restartDocker(){
        System.out.println("docker restarted..")
    }
}
```

### Spring Boot Admin Server - 可视化
1. 引入依赖

   ```xml
   <dependency>
   	<groupId>de.codecentric</groupId>
   	<actifactId>spring-boot-admin-starter-server</actifactId>
   </dependency>
   <dependency>
   	<groupId>org.springframework.boot</groupId>
   	<actifactId>spring-boot-starter-web</actifactId>
   </dependency>
   ```

   

2. 开启监控功能
   在主控制类上添加注解```@EnableAdminServer```

3. 注册客户端

   ```xml
   <dependency>
   	<groupId>de.codecentric</groupId>
   	<actifactId>spring-boot-admin-starter-client</actifactId>
   </dependency>
   <dependency>
   	<groupId>org.springframework.boot</groupId>
   	<actifactId>spring-boot-starter-security</actifactId>
   </dependency>
   ```

   ```yaml
   spring.boot.admin.client = http://localhost:8080
   
   #以web方式暴露所有端点
   management.endpoints.web.exposure.include=*
   ```

## 高级特性
### Profile功能
实现多环境适配
#### application-profile

- 默认配置文件 application.yaml 任何时候都会加载
- 指定环境配置文件 application-{env}.yaml
- 激活指定环境
  - 配置文件激活: spring.profiles.active=prod
  - 命令行激活: java -jar xxx.jar --spring.profiles.active=prod

#### @Profile
让类或方法只在限定环境下生效
### 外部化配置
#### 外部配置源
Java属性文件，yaml文件，环境变量，命令参数
#### 配置文件查找位置

1. classpath根路径
2. classpath根路径下config目录
3. jar包当前目录
4. jar包当前目录的config目录
5. /config子目录的直接子目录

### 自定义starter
#### starter启动原理
引入starter -> xxxAutoConfiguration -> 容器中放入组件 -> 绑定xxxProperties -> 配置项
#### 配置META-INF
autoconfigure包中配置使用 META-INF/spring.factories 中EnableAutoConfiguration 的值，使项目启动加载指定的自动配置类
#### 编写自动配置类

- @Configuration
- @Conditional
- @EnableConfigurationProperties
- @Bean
- ...

#### 自定义starter
hello-spring-boot-starter(启动器)

hello-spring-boot-starter-autoconfigure(自动配置包)

## SpringBoot原理
### SpringBoot启动过程

- 创建SpringApplication
	- 保存信息
	- ClassUtils - 判定当前应用的类型
	- bootstrapper - 初始启动引导器：去spring.factories找Bootstrapper
	- setInitializers - 找初始化器：去spring.factories找ApplicationContextInitializer
	- setListeners - 找监听器：去spring.factories找ApplicationListener
- 运行SpringApplication
	- stopWatch
	- 记录应用启动时间
	- createBootstrapContext - 创建引导上下文(Context环境)
		- 获取到所有之前的 bootstrapper 轮流执行 intitialize() 来完成对引导启动器上下文的配置
	- 让当前应用进入 headless 模式
	- 获取所有 RunListener(运行监听器)
		- getSpringFactoriesInstances 去spring.factories找SpirngApplicationRunListener
	- 遍历 SpirngApplicationRunListener 调用starting方法
	- 保存命令行参数 ApplicationArguments
	- 准备环境 prepareEnvironment()
		- 返回或创建基础环境信息对象 StandardServletEnvironment
		- 配置环境信息对象
			- 读取所有配置源的配置属性值
		- 绑定环境信息
		- 监听器调用environmentPrepared()
	- 创建IOC容器 createApplicationContext()
		- 根据项目类型(Servlet)创建容器
		- 当前会创建 AnnotationConfigServletWebServerAplicationContext
	- 准备ApplicationContext IOC容器的基本信息 prepareContext()
		- 保存环境信息
		- IOC容器的后置处理流程
		- 应用初始化器 applyInitializer
			- 遍历所有ApplicationContextInitializer 调用initialize()来对IOC容器初始化
			- 遍历所有的listener调用contextPrepared
		- 所有的监听器调用contextLoaded，
	- 刷新IOC容器 refreshContext
		- 创建容器中的所有组件(Spring注解)
	- 容器刷新完成后 afterRefresh
		- 所有监听器调用started
	- 调用所有runners - callRunners
		- 获取容器中的 ApplicationRunner
		- 获取容器中的 CommandLineRunner
		- 合并所有runner并且按照@Order排序
		- 遍历runner调用run方法
	- 如果出现异常
		- 调用listener的failed方法
	- 调用所有监听器的running方法
	- running如果出现问题，继续通知failed

### 自定义事件监听组件		
放在spring.factories

- ApplicationContextInitializer
- SpringApplicationRunListener
- SpringApplicationListener

放在容器中

- ApplicationRunner
- CommandLineRunner
