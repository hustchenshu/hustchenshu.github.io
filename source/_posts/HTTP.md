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


## [HTTPS](https://tools.ietf.org/html/rfc2818)

HTTPS 有两个作用，一是确定请求的目标服务端身份，二是保证传输的数据不会被网络中间节点窃听或者篡改。


## [HTTP2](https://tools.ietf.org/html/rfc7540)

HTTP 2.0 最大的改进有两点，一是支持服务端推送，二是支持 TCP 连接复用。