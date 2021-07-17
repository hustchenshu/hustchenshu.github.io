---
title: 前端缓存
date: 2021-01-17 22:01:02
tags: [浏览器, 缓存]
categories: [浏览器]
---

memory cache 是浏览器为了加快读取缓存速度而进行的自身的优化行为，不受开发者控制，也不受 HTTP 协议头的约束，算是一个黑盒。Service Worker 是由开发者编写的额外的脚本，且缓存位置独立，出现也较晚，使用还不算太广泛。所以我们平时最为熟悉的其实是 disk cache，也叫 HTTP cache (因为不像 memory cache，它遵守 HTTP 协议头中的字段)。平时所说的强制缓存，对比缓存，以及 Cache-Control 等，也都归于此类。

![http-cache](https://booker-17dbbd-1252444055.tcloudbaseapp.com/cdn/fe-cdn/http-cache.jpg)