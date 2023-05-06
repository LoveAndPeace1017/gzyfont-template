更多的prop请参考antd的[Icon](https://ant.design/components/icon-cn/)文档



关于自定义图标的使用：

1. 登录[https://www.iconfont.cn/](https://www.iconfont.cn/)的图标管理，我的项目，项目中的图标一般为视觉设计师上传，上传后的图标名称一般为拼音，我们使用之前最好进行重新命名，

2. 然后点击查看在线链接，如果图标有变化它会提示你点击进行更新代码，点击后生成的代码为一个css文件，把连接贴在浏览器里面，同时把.css后缀改成.js，复制所有代码。

3. 把复制的所有代码粘贴覆盖/icon目录下的iconfont.js。

4. 然后你就可以正常使用自定义的图标啦啦啦，

注意，如果是我们自义定的图标使用时候如果的图标类型type是会有icon-前缀的


##### 自定义的图标
```js
<Icon type="icon-reload"/>
```

##### antd 自带的图标
```js
<Icon type="up"/>
```
