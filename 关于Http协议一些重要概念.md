## 一、Http状态码
状态码的职责是当客户端向服务器端发送请求时，描述返回的请求结果。借助状态码，用户可以知道服务器端是正常处理了请求，还是出现了错误。

![](https://user-gold-cdn.xitu.io/2018/6/2/163c07c9b337c0b7?w=643&h=344&f=png&s=120378)

#### 1.状态码的分类
![](https://user-gold-cdn.xitu.io/2018/6/2/163c07ca6d8f250c?w=540&h=234&f=png&s=24610)

#### 2.常见的状态码
仅记录在 RFC2616 上的 HTTP 状态码就达 40 种，若再加上 WebDAV（RFC4918、5842）和附加 HTTP 状态码 （RFC6585）等扩展，数量就达 60 余种。别看种类繁多，实际上经常使用的大概只有 14 种。接下来，我们就介绍一下这些具有代表性的 14 个状态码。

- 200 表示从客户端发来的请求在服务器端被正常处理了。
- 204 表示请求处理成功，但没有资源返回。
- 206 表示客户端进行了范围请求，而服务器成功执行了这部分的GET请求。
这种情况经常发生在客户端继续请求一个未完成的下载的时候(比如当客户端加载一个体积较大的嵌入文件,比如视频或PDF文件),或者是客户端尝试实现带宽遏流的时候。
- 301 表示永久性重定向。该状态码表示请求的资源已被分配了新的URI，以后应使用资源现在所指的URI。
- 302 表示临时性重定向。该状态码表示请求的资源已被分配了新的URI，希望用户（本次）能使用新的URI访问。和301相似，但302表示的资源不是永久移动，只是临时性的。换句话说，已移动的资源对应的URI将来还有可能发生变化，比如，用户把URI保存为书签，但不会像301状态码出现时那样更新书签，而是仍旧保留返回302状态码的页面对应的URI。
- 303 表示由于请求对应的资源存在着另一个URI，应使用GET方法定向获取请求的资源。
303和302状态码有着相同的功能，但是303明确表示客户端应当采用get方法获取资源，这点与302状态码有区别。 比如，当使用POST方法访问CGl程序，其执行后的处理结果是希望客户端能以GET方法重定向到另一个URI上去时，返回303状态码。
**当301、302、303响应状态码返回时，几乎所有浏览器都会把post改成get，并删除请求报文内的主体，之后请求会自动再次发送。 
301、302标准是禁止将post方法改变成get方法的，但实际使用时大家都会这么做**。
- 304 表示客户端发送附带条件的请求时（指采用GET方法的请求报文中包含if-matched,if-modified-since,if-none-match,if-range,if-unmodified-since任一个首部）服务器端允许请求访问资源，但因发生请求未满足条件的情况后，直接返回304Modified（服务器端资源未改变，可直接使用客户端未过期的缓存）
- 307 表示临时重定向。该状态码与302有相同的含义。尽管302标准禁止post变化get，但实际使用时大家不遵守。 307会遵照浏览器标准，不会从post变为get。但是对于处理响应时的行为，各种浏览器有可能出现不同的情况。**303和307是HTTP1.1新加的服务器响应文档的状态码，它们是对HTTP1.0中的302状态码的细化，主要用在对非GET、HEAD方法的响应上。**
- 400 表示请求报文中存在语法错误。当错误发生时，需修改请求的内容后再次发送请求。
- 401 表示未授权（Unauthorized)，当前请求需要用户验证
- 403 表示对请求资源的访问被服务器拒绝了
- 404 表示服务器上无法找到请求的资源。除此之外，也可以在服务器端拒绝请求且不想说明理由时使
用。
- 500 表示服务器端在执行请求时发生了错误。也有可能是Web应用存在的bug或某些临时的故障。
- 503 表示服务器暂时处于超负载或正在进行停机维护，现在无法处理请求。


状态码和状况的不一致，不少返回的状态码响应都是错误的，但是用户可能察觉不到这点。比如Web应用程序内部发生错误，
状态码依然返回200 OK，这种情况也经常遇到。

## 二、TCP连接

![](https://user-gold-cdn.xitu.io/2018/6/4/163cae1305bd4b0d?w=807&h=655&f=png&s=129478)

TCP建立一个连接，首先需要进行三次握手。
#### 1.三次握手
首先Client端发送连接请求报文，Server段接受连接后回复ACK报文，并为这次连接分配资源Client端接收到ACK报文后也向Server段发生ACK报文，并分配资源，这样TCP连接就建立了。

**1.客户端发送一个带SYN=1，Seq=X的数据包到服务器端口**

**2.服务器发回一个带SYN=1， ACK=X+1， Seq=Y的响应包以示传达确认信息**

**3.客户端再回传一个带ACK=Y+1， Seq=Z的数据包，代表“握手结束”**

#### 2.为啥需要三次握手
谢希仁著《计算机网络》第四版中讲“三次握手”的目的是“**为了防止已失效的连接请求报文段突然又传送到了服务端，因而产生错误**”。

client发出的第一个连接请求报文段并没有丢失，而是在某个网络结点长时间的滞留了，以致延误到连接释放以后的某个时间才到达server。本来这是一个早已失效的报文段。但server收到此失效的连接请求报文段后，就误认为是client再次发出的一个新的连接请求。于是就向client发出确认报文段，同意建立连接。假设不采用“三次握手”，那么只要server发出确认，新的连接就建立了。由于现在client并没有发出建立连接的请求，因此不会理睬server的确认，也不会向server发送数据。但server却以为新的运输连接已经建立，并一直等待client发来数据。这样，server的很多资源就白白浪费掉了。采用“三次握手”的办法可以防止上述现象发生。例如刚才那种情况，client不会向server的确认发出确认。server由于收不到确认，就知道client并没有要求建立连接。

## 三、长连接

在HTTP/1.0中，默认使用的是短连接。也就是说，浏览器和服务器每进行一次HTTP操作，就建立一次连接，但任务结束就中断连接。

从 HTTP/1.1起，默认使用长连接，用以保持连接特性。使用长连接的HTTP协议，会在响应头有加入这行代码：Connection:keep-alive，可以设置关闭时间。
**由于浏览器的限制，同一个域下最多只能建立6个TCP连接（可以复用）。我们通常使用子域名来减少所有资源在只有一个连接时的产生的排队延迟**。
![](https://user-gold-cdn.xitu.io/2018/6/4/163caebdc6a45652?w=1118&h=413&f=png&s=137418)

**HTTP/2.0 时代拥有了“多路复用”功能，意思是:在一条连接上，可以同时发起无数个请求，并且响应可以同时返回**。HTTP2.0通信都在一个连接上完成，这个连接可以承载任意数量的双向数据流。
对一个域名，只需要开启一条 TCP 连接，请求都在这条 TCP 连接上干活。

**长连接的意义在于可以减少TCP三次握手的开销，即减少了TCP连接的重复建立和断开所造成的额外开销，使 HTTP 请求和响应能够更早地结束，这样 Web 页面的显示速度也就相应提高了**。然而在 HTTP/1.1 协议中客户端在同一时间，针对同一域名下的请求有一定数量限制。超过限制数目的请求会被阻塞。HTTP/2 通过让所有数据流共用同一个连接，可以更有效地使用 TCP 连接，让高带宽也能真正的服务于 HTTP 的性能提升。所以说HTTP/2时未来发展的趋势。

## 四、重定向
URL 重定向，也称为 URL 转发，是一种当实际资源，如单个页面、表单或者整个 Web 应用被迁移到新的 URL 下的时候，保持（原有）链接可用的技术。

进行URL重定向时，服务器只在响应信息的HTTP头信息中设置了HTTP状态码和Location头信息。
当状态码为301或302时（301－永久重定向、302－临时重定向），表示资源位置发生了改变，需要进行重定向。
Location头信息表示了资源的改变的位置，即：要跳重定向的URL。

```
const http = require('http')
http.createServer(function (request, response) {
  console.log('request come', request.url)
  if (request.url === '/') {
    response.writeHead(302, {  // or 301   如果写成状态码200,页面将无内容
      'Location': '/new'
    })
    response.end("")
  }
  if (request.url === '/new') {
    response.writeHead(200, {
      'Content-Type': 'text/html',
    })
    response.end('<div>this is content</div>')
  }
}).listen(8888)
console.log('server listening on 8888')
```
当我们在地址栏输入localhost:8888后，直接跳转到localhost:8888/new,并展示出内容

![](https://user-gold-cdn.xitu.io/2018/6/10/163e96ac496b87df?w=1391&h=456&f=png&s=103926)

## 五、CORS跨域请求资源
#### 1.跨域资源共享CORS简介
CORS是一个W3C标准，全称是"跨域资源共享"（Cross-origin resource sharing）。
它允许浏览器向跨源服务器，发出XMLHttpRequest请求，从而克服了AJAX只能同源使用的限制。
CORS需要浏览器和服务器同时支持。目前，所有浏览器都支持该功能，IE浏览器不能低于IE10。

整个CORS通信过程，都是浏览器自动完成，不需要用户参与。对于开发者来说，CORS通信与同源的AJAX通信没有差别，代码完全一样。浏览器一旦发现AJAX请求跨源，就会自动添加一些附加的头信息，有时还会多出一次附加的请求，但用户不会有感觉。

**因此，实现CORS通信的关键是服务器。只要服务器实现了CORS接口，就可以跨源通信。**
#### 2.如何实现
浏览器将CORS请求分成两类：简单请求和非简单请求。

接下来我们举一个简单请求的例子，来说明CORS如何实现跨域请求：

`http://127.0.0.1:8888`向`http://127.0.0.1:8887`请求资源
```
//server.js文件  http://127.0.0.1:8888           node server.js 启动服务器
const http = require('http')
const fs = require('fs')

http.createServer(function (request, response) {
  console.log('request come', request.url)
  const html = fs.readFileSync('test.html', 'utf8')
  response.writeHead(200, {
    'Content-Type': 'text/html'
  })
  response.end(html)
}).listen(8888)

console.log('server listening on 8888')
```
```
//test.html 文件  向http://127.0.0.1:8887请求数据
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Document</title>
</head>
<body>  
</body>
<script>
  var xhr = new XMLHttpRequest()
  xhr.open('GET', 'http://127.0.0.1:8887/')
  xhr.send()
</script>
</html>
```
```
//server.js文件  http://127.0.0.1:8887                node server2.js 启动服务器
const http = require('http')
http.createServer(function (request, response) {
  console.log('request come', request.url)
  response.writeHead(200, {
    'Access-Control-Allow-Origin': 'http://127.0.0.1:8888'//表示接受8888端口的请求
  })
  response.end('123')
}).listen(8887)
console.log('server listening on 8887')
```
最后得到如下结果：

![](https://user-gold-cdn.xitu.io/2018/6/10/163e9cd2b87deb2a?w=1722&h=509&f=png&s=242765)

## 六、Content Security Policy（CSP）
#### 1.CSP简介
**跨域脚本攻击 XSS 是最常见、危害最大的网页安全漏洞**。为了防止它们，要采取很多编程措施，非常麻烦。很多人提出，能不能根本上解决问题，浏览器自动禁止外部注入恶意脚本？
CSP 的实质就是白名单制度，开发者明确告诉客户端，哪些外部资源可以加载和执行，等同于提供白名单。它的实现和执行全部由浏览器完成，开发者只需提供配置。

**CSP 大大增强了网页的安全性。攻击者即使发现了漏洞，也没法注入脚本，除非还控制了一台列入了白名单的可信主机。**
#### 2.如何实现
如何启用CSP，可以通过 HTTP 头信息的`Content-Security-Policy`的字段

![](https://user-gold-cdn.xitu.io/2018/6/10/163e9eb380efdcb6?w=802&h=493&f=png&s=314893)

接下来我们看一个例子：如何限制加载内嵌的script
```
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Document</title>
</head>
<body>
  <div>This is content</div>
  <script>
    console.log('inline js')//禁止这段script代码执行
  </script>
</body>
</html>
```
```
const http = require('http')
const fs = require('fs')
http.createServer(function (request, response) {
  console.log('request come', request.url)
    const html = fs.readFileSync('test.html', 'utf8')
    response.writeHead(200, {
      'Content-Type': 'text/html',
      'Content-Security-Policy': "default-src http:https:"//限制所有的外部资源，都只能从http/https加载。
    })
    response.end(html)
}).listen(8888)
console.log('server listening on 8888')
```
最后控制台提示如下错误：
![](https://user-gold-cdn.xitu.io/2018/6/10/163e9e2c6602ca46?w=1432&h=304&f=png&s=295964)
## 参考文章
《图解HTTP》[日] 上野宣 著

《计算机网络》谢希仁著

[Content Security Policy 入门教程](http://www.ruanyifeng.com/blog/2016/09/csp.html)

[跨域资源共享 CORS 详解](http://www.ruanyifeng.com/blog/2016/04/cors.html)
