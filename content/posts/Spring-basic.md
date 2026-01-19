---
title: "Spring"
description: "My notes about Spring learing"
date: 2022-04-01T14:33:58+08:00
draft: false
type: "blog"
tags: [Java,Spring]
---

## Spring框架概述

1. Spring是轻量级的开源的轻量级的开源的JavaEE框架
2. Spring可以解决企业应用开发的复杂性
3. Spring有两个核心部分：
	- IOC(控制反转,把创建对象的过程交给Spring管理)
	- Aop(面向切面,不修改源代码的情况下添加增强功能)
4. Spring特点
	- 方便解耦，简化开发
	- Aop编程支持
	- 方便程序的测试
	- 方便集成各种优秀框架
	- 降低Java EE API的使用难度
	- 方便进行事务操作

## IOC容器
Inversion of Control ， 控制反转

把对象的创建和调用过程交给Spring进行管理，目的：降低耦合度
### IOC底层原理

技术：xml解析，工厂设计模式，反射

1. xml配置文件

   ```java
   //配置创建的对象
   <bean id = "UserDao" class = "com.dao.UserDao"></bean>
   ```

2. 创建工厂类

```java
//创建工厂类
class UserFactory{
    public static UserDao getDao(){
        //1.xml解析
        String classValue = class属性值;
        //2.通过反射创建对象
        Class class = Class.forName(classValue);
        return (UserDao)class.newInstance();
    }
}
```
### IOC接口(BeanFactory)

1. IOC思想基于IOC容器完成，IOC容器底层就是对象工厂
2. Spring提供IOC容器实现两个接口：

     - *ApplicationContext
     	- BeanFactory的子接口，提供更多功能
     	- 加载配置文件时就创建对象
     - BeanFactory：
     	- IOC容器基本实现，Spring内部使用
     	- 加载配置文件时不创建对象，获取或使用对象时才创建
3. ApplicationContext接口实现类

     - FileSystemXmlApplicationContext

     - ClassPathXmlApplicationContext

### IOC操作-Bean管理
Bean管理：Spring创建对象，Spring注入属性<br>
Bean管理操作实现方式：基于xml配置文件方式，基于注解方式

#### 基于xml

1. 创建对象

   1. 在Spring配置文件中，使用bean标签，标签里添加对应属性，就可以实现对象创建
   2. bean标签的属性
      - id：对象的标识，别名
      - class：类全路径(包类路径)
   3. 创建对象时，默认执行**无参构造方法**完成对象创建

   ```xml
   <bean id = "UserDao" class = "com.dao.UserDao"></bean>
   ```

2. 注入属性(为属性赋值)

- 第一种注入方式：set方法注入

	```java
	public class Book{
	    // 1.创建类，定义属性和set方法
	    private String bname;
	    public void setBname(String bname){
	        this.bname = bname;
	    }
	}
	
	//2.在spring配置文件配置对象创建和属性注入
	<bean id = "book" class = "com.spring5.Book">
	    <!--使用property完成属性注入-->
	    <!--name：类中属性的名称-->
	    <!--value：向属性注入的值-->
	    <property name = "bname" value = ""></property>
	</bean>
	```
- 第二种注入方式：有参构造注入
	```java
	public class Book{
	    //1. 创建类，定义属性和构造器
	    private String bname;
	
	    public Book(String bname){
	        this.bname = bname;
	    }
	}
	//2.在spring配置文件配置对象创建和属性注入
	<bean id = "book" class = "com.spring5.Book">
	    <!--有一个属性index，代替name，表示有参构造中的第几个参数-->
	    <constructor-arg name = "bname" value = ""></constructor-arg>
	    </bean>
	```

**注入特殊值**

- null值

	```xml
	<property name = "address">
		<null/>
	</property>
	```
- 属性值包含特殊符号
	1. 把特殊字符进行转义
	2. 把带特殊符号内容写到CDATA

	  ```xml
	  <property name="address">
	  <value><![CDATA[<<南京>>]]></value>
	  </property>
	  <!--属性值为<<南京>>-->
	  ```
- 属性值为对象，外部bean

	```xml
	<bean id="userService" class="...">
		<!--注入userDao对象
			name：类中属性名称
			ref：创建userDao对象bean标签的id值
		-->
		<property name="userDao" ref="userDao">
	</bean>
	
	<bean id="userDao" class="..."></bean>
	```
- 属性值为对象，内部bean

	```xml
	<bean id="student" class="...">
	    <property name="school">
	        <bean id="school" class="...">
	            ...
	        </bean>	
	    </property>
	</bean>
	```
- 级联赋值，给属性的属性赋值

  ```xml
  <!--第一种实现方法-->
  <bean id="student" class="...">
  	<property name="school" ref="school">
  </bean>
  <bean id="school" class="...">
  	<property name="sname" value="xxx"></property>
  </bean>
  
  <!--第二种实现方法-->
  <bean id="student" class="...">
  	<property name="school.sname" value="xxx">
  	<!--需要在student类中加入school的get方法-->
  </bean>
  <bean id="school" class="..."></bean>
  ```
#### 基于注解

1. 注解是代码的特殊标记，@注解名称(属性名称 = 属性值)
2. 使用注解，作用在类/方法/属性上面
3. 使用注解目的：简化xml配置


##### Spring对Bean管理中创建对象提供注解
这四种注解的效果是相同的

1. @Component
2. @Service
3. @Controller
4. @Repository

##### 对象创建

1. 引入依赖
   导入aop.RELEASE.jar包

2. 开启组件扫描

```xml
<beans xmlns:context="http://www.springframework.org/schema/context"
       xsi:schemaLocation="..../context">
    <context:component-scan base-package="指定扫描包的路径"></context:component-scan>
    <!--1.扫描多个包，多个包之间用逗号隔开
 2.扫描包上层目录-->
</beans>
```
3. 创建类，在类上面添加创建对象注释

   ```java
   @Component(value = "userService")
   // 注解里面value属性值可以省略不写，默认为类名(首字母小写)
   ```

##### 开启扫描中细节配置

```xml
<!--示例1-->
<context:component-scan base-package="指定扫描包的路径" use-default-filters="false">
    <!--use-default-filters="false"表示现在不使用默认filter，自己配置filter
context:include-filter，设置扫描哪些内容
-->

    <context:include-filter type="annotation"
                            expression="org.springframework.stereotype.Controller"></context:component-scan>
    <!--示例2-->
    <context:component-scan base-package="...">
        <!--设置不扫描的内容-->

        <context:exclude-filter type="annotation"
                                expression="org.springframework.stereotype.Controller">
            </context:component-scan>
```

##### 属性注入

1. @Autowired：根据属性类型进行自动装配
2. @Qualifier：根据属性名称进行注入
3. @Resource：可以根据类型注入，也可以根据名称注入
4. @Value：注入普通类型属性


```java
//根据类型注入，不需要添加set方法
@Autowired
private UserDao userDao;


//value的值为使用注解创建对象时设置的对象名
//Qulifier必须与Autowired一起使用
@Autowired
@Qualifier(value="指定对象")
private UserDao userDao;

@Resource
private UserDao userDao1;
@Resource(name="指定对象")
private UserDao userDao2;

@Value(value="注入的属性值")
private Strng str;
```

##### 完全注解开发

```java
//1. 创建配置类，替代xml配置文件
@Configuration
@ComponentScan(basePackage={"com.xxx"})
public class SpringConfig{
}

//2.编写测试类
public class Test{
    public void testService(){

        //加载配置类从xml文件变成了配置类
        ApplicationContext context = new AnnotationConfigApplicationContext(SpringConfig.class);

        UserService userService = context.getBean("userService",UserService.class);
    }
}
```

## AOP
Aspect Oriented Programming , 面向切面编程 , **不修改源代码的条件下，添加新功能**
### AOP术语

1. 连接点：<br>类中可以被增强的方法
2. 切入点：<br>实际被增强的方法
3. 通知(增强)：实际增强的逻辑部分
  - 前置通知：方法之前执行
  - 后置通知：方法之后执行
  - 环绕通知：方法前后均执行
  - 异常通知：方法出现异常时执行
  - 最终通知：相当于finally
4. 切面：<br>把通知应用到切入点的过程

### 动态代理
AOP底层使用动态代理

- 有接口的情况:使用JDK动态代理，创建接口实现类代理对象
- 无接口的情况:使用CGLIB动态代理，创建子类的代理对象


#### JDK动态代理
调用Proxy类中的```static Object newProxyInstance(ClassLoader loader,类<?>[] interfaces,InvocationHandler h)```

- 第一个参数，类加载器；
- 第二个参数，增强方法所在的类，这个类实现的接口，支持多个接口；
- 第三个参数，实现这个接口InvocationHandler，创建代理对象，写增强的方法

```java
public class JDKProxy{
    public static void main(String[] args){

        //指定接口，此处为UserDao
        Class[] interfaces = {UserDao.class};

        //创建需要代理的类的对象，此处为UserDaoImpl
        UserDaoImpl userDao = new UserDaoImpl();

        UserDao dao = (UserDao)Proxy.newProxyInstance(JDKProxy.class.getClassLoader(),interfaces,new UserDaoProxy(userDao)){

        }
    }

    //创建代理对象
    class UserDaoProxy implements InvocationHandler{

        //创建的是谁的代理对象，把谁传递进来
        //有参构造的传递
        private Object obj;
        public UserDaoProxy(Object obj){
            this.obj = obj;
        }		
        //增强的逻辑
        @Override
        public Object invoke(Object proxy,Method method,Object[] args) throws Throwable{

            //方法之前执行

            //被增强的方法执行
            Object res = method.invoke(obj,args);

            //方法之后执行

            return res;
        }
    }
```

### AspectJ
Spring框架一般基于AspectJ实现AOP操作，独立AOP框架，不属于Spring
#### 引入依赖
导入```com.springsource.net.sf.cglib```, ```com.springsource.org.aopalliance```,
```com.springsource.org.aspect.weaver```, ```spring-aop```这四个jar包
#### 切入点表达式
知道对哪个类里面的哪个方法进行增强

	//语法结构
	execution([权限修饰符][返回类型][类路径][方法名]([参数列表]))
#### AOP操作
##### *基于注解

1. 创建类，在类中定义方法

```java
public class User{
    public void add(){

    }
}
```
2. 创建增强类(编写增强逻辑)

```java
public class UserProxy{
    public void before(){

    }
}
```
3.  进行通知的配置

```java
//1. 在Spring配置文件中开启注解扫描
// 同context，添加一个aop

//2. 使用注解创建User和UserProxy对象

//3. 在增强类上面添加注解@Aspect

//4. 在Spring配置文件中开启生成代理对象
<aop:aspectj-autoproxy></aop:aspectj-autoproxy>
```
4. 配置不同类型的通知
   在增强类中的通知方法上，添加通知类型注解，使用切入点表达式配置

```java
// 前置通知
@Before(value="execution(* com.spring5.User.add(..))")
public void before(){}

//环绕通知
@Around(value="execution(* com.spring5.User.add(..))")
public void around(ProceedingJoinPoint proceedJoinPoint){

    //环绕之前

    //被增强的方法执行
    proceedingJoinPoint.proceed();

    //环绕之后
}

//异常通知 - Afterthorw
//后置通知 - Atferreturning	
//最终通知 - After
```
5. 完全使用注解开发

```java
//创建配置类，不需要xml配置文件
@Configuration
@ComponentScan(basePackages={"com.spring5"})
@EnableAspectJAutoProxy(proxyTargetClass=true)
public class ConfigAop{

}
```
##### 基于xml配置文件

```xml
<!-- 1. 创建类和方法 
2. 在spring配置文件中创建类对象 -->
<!--创建对象-->

<bean id="book" class="...">
    <bean id="bookProxy" class="...">

        //3. 在spring配置文件中配置切入点
        <aop:config>
            <!--切入点-->
            <aop:pointcut id="x" expression="execution(* com.spring5.User.add(..))">

                <!--切面-->
                <aop:aspect ref="bookProxy">
                    <!--增强作用在具体的方法上-->
                    <aop:before method="before" pointcut-ref="x">
                        </aop:aspect>
                    </aop:config>
            </aop:pointcut>
        </aop:config>
    </bean>
</bean>
```
#### 相同切入点抽取

```java
@Pointcut(value="execution(* com.spring5.User.add(..))")
public void pointdemo(){

}

@Before(value="pointdemo()")
public void before(){
    System.out.println("before...")
}
```
#### 多个增强类增强同一个方法，设置增强类优先级
在增强类上面添加注解```@Order(int)```，数字值越小，优先级越高
	