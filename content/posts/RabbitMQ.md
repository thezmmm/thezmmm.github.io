---
title: "RabbitMQ"
description: "My notes about RabbitMQ learing"
date: 2024-05-14T14:33:58+08:00
draft: false
type: "blog"
tags: [other]
---

## Component

- *Producing* means nothing more than sending. A program that sends messages is a *producer* :

  ![A producer sends messages to a queue.](https://www.rabbitmq.com/img/tutorials/producer.png)

  

- *A queue* is the name for the post box in RabbitMQ. Although messages flow through RabbitMQ and your applications, they can only be stored inside a *queue*. A *queue* is only bound by the host's memory & disk limits, it's essentially a large message buffer. Many *producers* can send messages that go to one queue, and many *consumers* can try to receive data from one *queue*. This is how we represent a queue:

  ![A queue is the name for the post box in RabbitMQ.](https://www.rabbitmq.com/img/tutorials/queue.png)

  

- *Consuming* has a similar meaning to receiving. A *consumer* is a program that mostly waits to receive messages:

  ![A consumer receives messages.](https://www.rabbitmq.com/img/tutorials/consumer.png)

## First Example

### Send Process

1. Import package

    ```java
    import com.rabbitmq.client.ConnectionFactory;
    import com.rabbitmq.client.Connection;
    import com.rabbitmq.client.Channel;
    ```

2. Set up class and name queue

    ```java
    public class Send {
      private final static String QUEUE_NAME = "hello";
      public static void main(String[] argv) throws Exception {
          ...
      }
    }
    ```

3. Create connection

    ```java
    ConnectionFactory factory = new ConnectionFactory();
    factory.setHost("localhost");
    try (Connection connection = factory.newConnection();
         Channel channel = connection.createChannel()) {
    
    }
    ```

4. Declare queue and send message

    ```java
    channel.queueDeclare(QUEUE_NAME, false, false, false, null);
    String message = "Hello World!";
    // String exchange, String routingKey, AMQP.BasicProperties props, byte[] body
    channel.basicPublish("", QUEUE_NAME, null, message.getBytes());
    System.out.println(" [x] Sent '" + message + "'");
    ```

### Receive Process

1. Import package

   ```java
   import com.rabbitmq.client.Channel;
   import com.rabbitmq.client.Connection;
   import com.rabbitmq.client.ConnectionFactory;
   import com.rabbitmq.client.DeliverCallback;
   ```

2. Setting up is the same as the publisher

   ```java
   public class Recv {
   
     private final static String QUEUE_NAME = "hello";
   
     public static void main(String[] argv) throws Exception {
       ConnectionFactory factory = new ConnectionFactory();
       factory.setHost("localhost");
       Connection connection = factory.newConnection();
       Channel channel = connection.createChannel();
   
       channel.queueDeclare(QUEUE_NAME, false, false, false, null);
       System.out.println(" [*] Waiting for messages. To exit press CTRL+C");
   
     }
   }
   ```

3. Buffer the messages and use

   ```java
   DeliverCallback deliverCallback = (consumerTag, delivery) -> {
       String message = new String(delivery.getBody(), "UTF-8");
       System.out.println(" [x] Received '" + message + "'");
   };
   // String queue, boolean autoAck, DeliverCallback deliverCallback, CancelCallback cancelCallback
   channel.basicConsume(QUEUE_NAME, true, deliverCallback, consumerTag -> { });
   ```

### Launch

## Work Queue

we'll create a *Work Queue* that will be used to **distribute time-consuming tasks among multiple workers.**

![Producer -> Queue -> Consuming: Work Queue used to distribute time-consuming tasks among multiple workers.](https://www.rabbitmq.com/img/tutorials/python-two.png)

### Message Acknowledgements

In order to **make sure a message is never lost**, RabbitMQ supports [message *acknowledgments*](https://www.rabbitmq.com/confirms.html). 

An acknowledgement is sent back by the consumer to tell RabbitMQ that a particular message has been received, processed and that RabbitMQ is free to delete it.

If a consumer dies (its channel is closed, connection is closed, or TCP connection is lost) without sending an ack, RabbitMQ will understand that a message wasn't processed fully and will re-queue it. If there are other consumers online at the same time, it will then quickly redeliver it to another consumer.

```java
// default true, don't care whether the message is proceed
boolean autoAck = false;
channel.basicConsume(QueueName,autoAck,deliverCallback,consummerTag->{})
```

### Message Durability

When RabbitMQ quits or crashes it will forget the queues and messages unless you tell it not to. 

Two things are required to make sure that messages aren't lost: we need to mark both the queue and messages as durable.

1. Make sure that the **queue** will survive a RabbitMQ node restart

   ```java
   // This queueDeclare change needs to be applied to both the producer and consumer code.
   boolean durable = true;
   channel.queueDeclare("task_queue", durable, false, false, null)
   ```

2. Mark **message** as persistent

   ```java
   import com.rabbitmq.client.MessageProperties;
   
   // mark by setting MessageProperties to the value PERSISTENT_TEXT_PLAIN
   channel.basicPublish("", "task_queue",
               MessageProperties.PERSISTENT_TEXT_PLAIN,
               message.getBytes());
   ```

### Fair Dispatch

To avoid that one worker will be constantly busy and the other one will do hardly any work.

use the `basicQos` method with the `prefetchCount = 1` setting. This tells RabbitMQ **don't dispatch a new message to a worker until it has processed and acknowledged the previous one**. Instead, it will dispatch it to the next worker that is not still busy.

```java
int prefetchCount = 1;
channel.basicQos(prefetchCount);
```

## Publish/Subscribe

deliver a message to multiple consumers.

### Exchanges

On one side exchange receives messages from producers and the other side it pushes them to queues.

The delivery rules for that are defined by the *exchange type*.

![An exchange: The producer can only send messages to an exchange. One side of the exchange receives messages from producers and the other side pushes them to queues.](https://www.rabbitmq.com/img/tutorials/exchanges.png)

There are a few exchange types available:

1. direct 

2. topic 

3. headers

4. fanout

   it just broadcasts **all** the messages it receives to **all** the queues it knows

Create an exchange

```java
channel.exchangeDeclare("logs", "fanout");
```

Publish to our named exchange

```java
channel.basicPublish( "logs", "", null, message.getBytes());
```

### Temporary queues

We want to **hear about all messages**, not just a subset of them.

Create a non-durable, exclusive, autodelete queue with **a generated name** (random name)

```java
// queueName is a random name, for example 'amq.gen-JzTY20BRgKO-HjmUJj0wLg'
String queueName = channel.queueDeclare().getQueue();
```

### Bindings

A binding is a relationship between an exchange and a queue. This can be simply read as: **the queue is interested in messages from this exchange**.

![The exchange sends messages to a queue. The relationship between the exchange and a queue is called a binding.](https://www.rabbitmq.com/img/tutorials/bindings.png)

```java
channel.queueBind(queueName, "logs", "");
```

Bindings can take an extra `routingKey` parameter. The meaning of a binding key depends on the exchange type.

This is how we could create a binding with a key

```java
channel.queueBind(queueName, EXCHANGE_NAME, "black");
```

## Routing

### Direct Exchange

The routing algorithm behind a **direct exchange** is simple - a message goes to the queues whose **binding key exactly matches the routing key** of the message.

![Direct exchange routing](https://www.rabbitmq.com/img/tutorials/direct-exchange.png)

### Multiple Bindings

In that case, the direct exchange will behave like fanout and will broadcast the message to all the matching queues.

![Multiple Bindings](https://www.rabbitmq.com/img/tutorials/direct-exchange-multiple.png)

## Topic Exchange

Messages sent to a topic exchange can't have an arbitrary `routing_key` - it must be a list of words, delimited by dots.

There are two important special cases for binding keys:

- \* (star) can substitute for exactly one word.
- \# (hash) can substitute for zero or more words.

![Topic Exchange illustration, which is all explained in the following text.](https://www.rabbitmq.com/img/tutorials/python-five.png)

## Remote Procedure Call

Run a function on a remote computer and wait for the result.

![Summary illustration, which is described in the following bullet points.](https://www.rabbitmq.com/img/tutorials/python-six.png)

### Client Interface

It's going to expose a method named `call` which sends an RPC request and blocks until the answer is received:

```java
FibonacciRpcClient fibonacciRpc = new FibonacciRpcClient();
String result = fibonacciRpc.call("4");
System.out.println( "fib(4) is " + result);
```

### Callback Queue

 In order to receive a response we need to send a 'callback' queue address with the request. 

```java
callbackQueueName = channel.queueDeclare().getQueue();

BasicProperties props = new BasicProperties
                            .Builder()
                            .replyTo(callbackQueueName)
                            .build();

channel.basicPublish("", "rpc_queue", props, message.getBytes());

// ... then code to read a response message from the callback_queue ...
```

### Correlation Id

We can **create a single callback queue per client** instead of per RPC request.

That raises a new issue, having received a response in that queue it's not clear to which request the response belongs. That's when the `correlationId` property is used. We're going to set it to a **unique value for every request**.

## Publisher Confirms

[Publisher confirms](https://www.rabbitmq.com/confirms.html#publisher-confirms) are a RabbitMQ extension to implement reliable publishing. When publisher confirms are enabled on a channel, messages the client publishes are confirmed asynchronously by the broker, meaning they have been taken care of on the server side.

### Enabling Publisher Confirms on a Channel

```java
Channel channel = connection.createChannel();
channel.confirmSelect();
```

### Publishing Messages Individually

```java
while (thereAreMessagesToPublish()) {
    byte[] body = ...;
    BasicProperties properties = ...;
    channel.basicPublish(exchange, queue, properties, body);
    // uses a 5 second timeout
    channel.waitForConfirmsOrDie(5_000);
}
```

`Channel#waitForConfirmsOrDie(long)`returns as soon as the message has been confirmed. If the message is not confirmed within the timeout or if it is nack-ed (meaning the broker could not take care of it for some reason), the method will throw an exception.

Drawback: it **significantly slows down publishing**, as the confirmation of a message blocks the publishing of all subsequent messages.

### Publishing Messages in Batches

We can publish a batch of messages and wait for this whole batch to be confirmed.

```java
int batchSize = 100;
int outstandingMessageCount = 0;
while (thereAreMessagesToPublish()) {
    byte[] body = ...;
    BasicProperties properties = ...;
    channel.basicPublish(exchange, queue, properties, body);
    outstandingMessageCount++;
    if (outstandingMessageCount == batchSize) {
        channel.waitForConfirmsOrDie(5_000);
        outstandingMessageCount = 0;
    }
}
if (outstandingMessageCount > 0) {
    channel.waitForConfirmsOrDie(5_000);
}
```

Waiting for a batch of messages to be confirmed **improves throughput** drastically over waiting for a confirm for individual message (up to 20-30 times with a remote RabbitMQ node). 

One drawback is that **we do not know exactly what went wrong in case of failure**, so we may have to keep a whole batch in memory to log something meaningful or to re-publish the messages. And this solution is still synchronous, so it blocks the publishing of messages.

### Handling Publisher Confirms Asynchronously

The broker confirms published messages asynchronously, one just needs to register a callback on the client to be notified of these confirms:

```java
Channel channel = connection.createChannel();
channel.confirmSelect();
channel.addConfirmListener((sequenceNumber, multiple) -> {
    // code when message is confirmed
}, (sequenceNumber, multiple) -> {
    // code when message is nack-ed
});
```

There are 2 callbacks: one for confirmed messages and one for nack-ed messages (messages that can be considered lost by the broker). Each callback has 2 parameters:

- sequence number

  a number that identifies the confirmed or nack-ed message. 

  ```java
  int sequenceNumber = channel.getNextPublishSeqNo());
  ch.basicPublish(exchange, queue, properties, body);
  ```

  The sequence number can be obtained with Channel#getNextPublishSeqNo() before publishing

- multiple

  this is a boolean value. If false, only one message is confirmed/nack-ed, if true, all messages with a lower or equal sequence number are confirmed/nack-ed.

#### Correlate messages with sequence number

A simple way to correlate messages with sequence number consists in **using a map**.

```java
ConcurrentNavigableMap<Long, String> outstandingConfirms = new ConcurrentSkipListMap<>();
// ... code for confirm callbacks will come later
String body = "...";
outstandingConfirms.put(channel.getNextPublishSeqNo(), body);
channel.basicPublish(exchange, queue, properties, body.getBytes());
```

The publishing code now tracks outbound messages with a map. We need to clean this map when confirms arrive and do something like logging a warning when messages are nack-ed:

```java
ConcurrentNavigableMap<Long, String> outstandingConfirms = new ConcurrentSkipListMap<>();
ConfirmCallback cleanOutstandingConfirms = (sequenceNumber, multiple) -> {
    if (multiple) {
        ConcurrentNavigableMap<Long, String> confirmed = outstandingConfirms.headMap(
          sequenceNumber, true
        );
        confirmed.clear();
    } else {
        outstandingConfirms.remove(sequenceNumber);
    }
};

channel.addConfirmListener(cleanOutstandingConfirms, (sequenceNumber, multiple) -> {
    String body = outstandingConfirms.get(sequenceNumber);
    System.err.format(
      "Message with body %s has been nack-ed. Sequence number: %d, multiple: %b%n",
      body, sequenceNumber, multiple
    );
    cleanOutstandingConfirms.handle(sequenceNumber, multiple);
});
// ... publishing code
```

#### Sum up

To sum up, handling publisher confirms asynchronously usually requires the following steps:

- provide a way to correlate the publishing sequence number with a message.
- register a confirm listener on the channel to be notified when publisher acks/nacks arrive to perform the appropriate actions, like logging or re-publishing a nack-ed message. The sequence-number-to-message correlation mechanism may also require some cleaning during this step.
- track the publishing sequence number before publishing a message.

### Summary

- publishing messages individually, waiting for the confirmation synchronously: 

  simple, but very limited throughput.

- publishing messages in batch, waiting for the confirmation synchronously for a batch: 

  simple, reasonable throughput, but hard to reason about when something goes wrong.

- asynchronous handling: 

  best performance and use of resources, good control in case of error, but can be involved to implement correctly.

