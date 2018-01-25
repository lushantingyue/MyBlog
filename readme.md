基于koa2 构建个人博客
========================

#### 此项目基于 i5ting 的脚手架koa-generator:
             $ koa2 MyBlog
             入口文件 www
             
#### 项目结构说明  
    app.js为入口
    bin/www为启动入口,初始化 port,server
    支持static server，即public目录
    支持routes路由目录
    支持views视图目录
    默认jade为模板引擎, 现已替换为nunjucks
             
[WebStorm添加jade(pug) watcher](http://blog.csdn.net/stSahana/article/details/52191517)
## 实现步骤(参考廖雪峰的JavaScript教程)[链接](http://www.liaoxuefeng.com/wiki/001434446689867b27157e896e74d51a89c25cc8b43bdb3000/001472286125147031e735933574ae099842afd31be80d1000):
```
1.实现基本路由, 路由封装
2.实现模板框架
3.实现数据库连接
4.编写mocha测试
5.进阶: 
    cookies保持   客户端
    session 保持和持久化  服务器 此处采用 koa-session-minimal + koa-session-mongoose方案
    https://chenshenhai.github.io/koa2-note/note/session/info.html
    http://i5ting.github.io/stuq-koa/koa-practice/session.html
    http://www.fkwebs.com/2333.html
    
    cache 静态资源缓存
    base-author验证
    csrf 安全
    图片/文件上传
    pdf文件下发    
```

#### koa2 和 koa 1.x 的区别
      Koa2 应用了ES7的 Async/Await来替代 Koa1中的生成器函数generator与yield。
#### 踩坑记录
    1. router如果有多个url get请求, 请使用router.prefix('/'), 以免除主路径外, 其余get请求无法定位
    2. 读取已有数据集合时, Model必须先定义好.
    仍存在的问题: 
        不能把 GET '/jianshu' 单独作为一个router文件, 否则解析不到
## 依赖的库
```
    "dependencies": {
    "koa-compose": "^2.3.0",  // 
    "koa": "^2.2.0",  // koa核心库
    "koa-views": "^5.2.1",  // 模板匹配模块
    "nunjucks": "3.0.1",  // 模板引擎
    "mongoose": "^4.10.2" // mongoDB数据库操作模块
  }
  ```

##### [配置koa-passport认证](http://blog.csdn.net/a1035434631/article/details/78752271)