## 前言
浏览器拿到服务器的响应文本HTML后，如何渲染页面？这是本文所要讨论的问题！

## 一、浏览器渲染机制
浏览器不同，渲染机制就不同。其中两种典型的代表就是IE、chrome浏览器和firefox浏览器，主要原因是由于渲染引擎不同。接下来我们看看他们渲染过程有何差异？
**1.chrome浏览器的渲染过程：**
```
    解析HTML，构建DOM树
    解析CSS，构建CSSOM树
    把DOM和CSSOM组合成渲染树(render tree)
    在渲染器的基础上进行布局，计算每个节点的几何结构
    把每个节点绘制到屏幕上(painting)
```
**2.firefox浏览的渲染过程：**
```
    解析HTML，构建DOM树
    绘制HTML内容
    解析CSS，构建CSSOM树
    把DOM和CSSOM组合成渲染树(render tree)
    在渲染器的基础上进行布局，计算每个节点的几何结构
    给所有的HTML内容添加样式
```
## 二、CSS和JS部分在网页中的位置
>**CSS部分一般放在HTML的头部，也就是`<head>`标签里面。**

先不谈JS文件，以chrome浏览器为例，当浏览器拿到服务器的响应文本HTML后，会从上往下开始构建DOM树，但如果中途遇到`<link>`或者`<style>`引入的CSS部分，浏览器就会同步构建 CSSOM树。由于CSSOM树的构建比DOM树来得慢，所以将CSS部分放在HTML的头部，比较合理！
>**JS脚本一般放在HTML的尾部，也就是</body>前面。**

网页中的某些JavaScript脚本代码往往需要在文档加载完成后才能够去执行，否则可能导致无法获取对象的情况，为了避免类似情况的发生，可以使用以下两种方式:第一种就是JS文件放在HTML的尾部，这是因为JS 是可以修改 DOM 节点和 DOM 样式的，JS 既阻塞 DOM、CSSOM 的构建，也会阻塞渲染树的生成。在解析 HTML过程 中发现 JS文件 ，等到下载并执行完 JS 后，才会继续解析、构建DOM和CSSOM。因此我们常常把`<script>`部分放到`</body>`前面，防止屏幕白屏；**另外一种可以通过window.onload来执行脚本代码。**

## 三、白屏问题和FOUS
**由于浏览器的渲染机制不同，在渲染页面的时会出现两种常见的不良现象，白屏问题和FOUS（无样式内容闪烁）**

**FOUC**：由于浏览器渲染机制（比如firefox），再CSS加载之前，先呈现了HTML，就会导致展示出无样式内容，然后样式突然呈现的现象；

**白屏**：有些浏览器渲染机制（比如chrome）要先构建DOM树和CSSOM树，构建完成后再进行渲染，如果CSS部分放在HTML尾部，由于CSS未加载完成，浏览器迟迟未渲染，从而导致白屏；或如果使用 @import标签,即使 CSS 放入 link, 并且放在头部,也可能出现白屏。也可能是把js文件放在头部，脚本会阻塞后面内容的呈现，脚本会阻塞其后组件的下载，出现白屏问题。


## 四、async和defer的作用是什么？有什么区别?
>情况1.`<script src="script.js"></script>`

  没有 defer 或 async，浏览器会立即加载并执行指定的脚本，“立即”指的是在渲染该 script 标签之下的文档元素之前，也就是说不等待后续载入的文档元素，读到就加载并执行。

   >情况2. `<script async src="script.js"></script>`  (**异步下载**)

   有async，加载和渲染后续文档元素的过程将和 script.js 的加载与执行并行进行（异步）。

   >情况3. `<script defer src="script.js"></script>`(**延迟执行**)

  有 defer，加载后续文档元素的过程将和 script.js 的加载并行进行（异步），但是 script.js 的执行要在所有元素解析完成之后，DOMContentLoaded 事件触发之前完成。
**在加载多个JS脚本的时候，async是无顺序的加载，而defer是有顺序的加载。**

![async和defer](https://user-gold-cdn.xitu.io/2018/6/16/1640656e70765ac7?w=689&h=112&f=jpeg&s=16895)
其中蓝色线代表网络读取，红色线代表执行时间，这俩都是针对脚本的；绿色线代表 HTML 解析。

参考：[async 和 defer 的区别 | SegmentFault](https://segmentfault.com/q/1010000000640869)
