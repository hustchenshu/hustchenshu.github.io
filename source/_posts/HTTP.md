---
title: HTTP协议
date: 2021-05-07 22:01:02
tags: [http, 浏览器]
categories: [http]
---

# HTTP

## http协议

![http-proto](https://booker-17dbbd-1252444055.tcloudbaseapp.com/cdn/fe-cdn/http-proto.jpg)

### method

|  method | 场景  |  异同 | 备注 |
|---|---| --- | --- |
| GET | 地址栏访问</br>ajax请求  |    |    |
| POST |  ajax请求</br>表单提交 |    |    |
| HEAD |  由js发起 | 与get类似，但只返回响应头   |    |
| PUT  |  添加资源 |    |    |
| DELETE | 删除资源  |    |    |
| CONNECT  |  用于https/websocket |    |    |
| OPTIONS  | 用于调试  |    |    |
| TRACE  |  用于调试 |    |    |

### status and text

|  status | 意义  |  备注|
|---|---|---|
| 1xx  |   |   |
| 200  |  网页请求成功 |   |
| 301  |   |   |
| 302  |   |   |
| 304  |   |   |
| 403  |   |   |
| 404  |   |   |
| 418  |   |   |
| 500  |   |   |
| 503  |   |   |


### header

**request header**

| request header  | 规定  |
|---|---|
| accept  |   |
| accept-encoding  |   |
| accept-language  |   |
| cache-control  |   |
| connection  |   |
| host  |   |
| if-modified-since  |   |
| if-none-match  |   |
| user-agent  |   |
| cookie  |   |


**response header**

| response header  | 规定  |
|---|---|
| cache-control  |   |
| connection  |   |
| content-type |   |
| content-length  |   |
| content-language  |   |
| date  |   |
| etag |   |
| expires  |   |
| keep-alive  |   |
| last-modified  |   |
| server  |   |
| set-cookie  |   |
| via  |   |

**Request Body**

+ application/json
+ application/x-www-form-urlencoded
+ multipart/form-data
+ text/xml

## HTTP1.1

+ 长连接
    
    默认开启长链接，在一个TCP连接上可以传送多个HTTP请求和响应，减少了建立和关闭连接的消耗和延迟

+ 宽带和网络连接优化
  
    支持只发送header信息（不带任何body信息），如果服务器认为客户端有权限请求服务器，则返回100，客户端接收到100才开始把请求body发送到服务器

+ 缓存策略
  
    在HTTP1.0中主要使用header里的If-Modified-Since,Expires来做为缓存判断的标准，HTTP1.1则引入了更多的缓存控制策略例如Entity tag，If-Unmodified-Since, If-Match, If-None-Match等更多可供选择的缓存头来控制缓存策略。

+ 错误状态响应码
  
    新增了24个错误状态响应码，如409（Conflict）表示请求的资源与资源的当前状态发生冲突；410（Gone）表示服务器上的某个资源被永久性的删除。

+ Host头处理
  
    http1.0中默认每台服务器都绑定唯一的一个IP地址,所以请求消息中url并没有传递主机名,也就是hostname.
    http1.1中请求消息和响应消息都支持Host头域,而且,如果我们不传这个字段还会报一个400(bad request)的状态码

## [HTTP 2](https://tools.ietf.org/html/rfc7540)

+ 多路复用
  
    HTTP/2 中每个请求都被拆分成多个 Frame 通过一条 TCP 连接同时被传输，这样即使一个请求被阻塞，也不会影响其他的请求。同一个连接并发处理多个请求，而且并发请求的数量比HTTP1.1大了好几个数量级。


+ 服务器推送

    允许服务端推送资源给浏览器，在浏览器明确地请求之前，免得客户端再次创建连接发送请求到服务器端获取。这样客户端可以直接从本地加载这些资源，不用再通过网络。
+ 头部压缩

    HTTP1.X时代，状态行和头部却没有经过任何压缩，直接以纯文本传输，导致消耗在头部的流量越来越多。HTTP2.0使用HPACK算法对header的数据进行压缩，这样数据体积小了，在网络上传输就会更快。

+ 二进制流

    将传输信息分割为跟小的信息帧，并对她们进行二进制编码。常见的有header帧、其会开启一个新的流，之后是Data帧，传输正文实体，多个Data帧属于一个流。


## [HTTP 3](https://zhuanlan.zhihu.com/p/143464334)

QUIC 是用来替代 TCP、SSL/TLS 的传输层协议，在传输层之上还有应用层，我们熟知的应用层协议有 HTTP、FTP、IMAP 等，这些协议理论上都可以运行在 QUIC 之上，其中运行在 QUIC 之上的 HTTP 协议被称为 HTTP/3，这就是”HTTP over QUIC 即 HTTP/3“的含义。

+ 零RRT建立链接

    DH 密钥交换算法，DH 算法的核心就是服务端生成 a、g、p 3 个随机数，a 自己持有，g 和 p 要传输给客户端，而客户端会生成 b 这 1 个随机数，通过 DH 算法客户端和服务端可以算出同样的密钥。在这过程中 a 和 b 并不参与网络传输，安全性大大提高。因为 p 和 g 是大数，所以即使在网络中传输的 p、g、A、B 都被劫持，那么靠现在的计算机算力也没法破解密钥。

    QUIC 从请求连接到正式接发 HTTP 数据一共花了 1 RTT，这 1 个 RTT 主要是为了获取 Server Config，后面的连接如果客户端缓存了 Server Config，那么就可以直接发送 HTTP 数据，实现 0 RTT 建立连接。

+ 连接迁移

    TCP 连接基于四元组（源 IP、源端口、目的 IP、目的端口），切换网络时至少会有一个因素发生变化，导致连接发生变化。

    QUIC 的连接不受四元组的影响，当这四个元素发生变化时，原连接依然维持。QUIC 连接不以四元组作为标识，而是使用一个 64 位的随机数，这个随机数被称为 Connection ID，即使 IP 或者端口发生变化，只要 Connection ID 没有变化，那么连接依然可以维持。

+ 队头阻塞/多路复用
  
    HTTP/1.1 和 HTTP/2 都存在队头阻塞问题（Head of line blocking）：一个 TCP 连接同时传输 10 个请求，其中第 1、2、3 个请求已被客户端接收，但第 4 个请求丢失，那么后面第 5 - 10 个请求都被阻塞，需要等第 4 个请求处理完毕才能被处理，这样就浪费了带宽资源。

    HTTP/2 的每个请求都会被拆分成多个 Frame，不同请求的 Frame 组合成 Stream，Stream 是 TCP 上的逻辑传输单元，在一条 TCP 连接上同时发送 4 个 Stream，其中 Stream1 已正确送达，Stream2 中的第 3 个 Frame 丢失，TCP 处理数据时有严格的前后顺序，先发送的 Frame 要先被处理，这样就会要求发送方重新发送第 3 个 Frame，Stream3 和 Stream4 虽然已到达但却不能被处理，那么这时整条连接都被阻塞。

    QUIC 的传输单元是 Packet，加密单元也是 Packet，整个加密、传输、解密都基于 Packet，这样就能避免 TLS 的队头阻塞问题；
    QUIC 基于 UDP，UDP 的数据包在接收端没有处理顺序，即使中间丢失一个包，也不会阻塞整条连接，其他的资源会被正常处理。





## [HTTPS](https://tools.ietf.org/html/rfc2818)

HTTPS 有两个作用，一是确定请求的目标服务端身份，二是保证传输的数据不会被网络中间节点窃听或者篡改。

+ 保密性--对称加密、非对称加密

    我们说http是明文传输，所以https首要解决的问题就是它的通信加密，达到保密性。首先客户端请求服务端，服务端将自己的公钥返回，客户端拿到公钥后就可以用它来加密要传输的数据data ，将加密数据secret data发送到服务端后通过服务端的私钥来解密，以此完成加密传输。
    
    有了非对称加密，只要我们将其中的data换成随机码key，这个key作为对称加密中密钥。密钥传输问题就解决了，同时很好地利用了对称加密的高效率。

+ 真实性、准确性--数字证书、签名
  
  所谓证书就是第三方（自签证书没有公证效应）颁发的认证，在HTTPS中存在一种认证机构即CA（Certification Authority），由它来证明你所连接的服务端就是你想要连接的server，即保证服务端真实性。


