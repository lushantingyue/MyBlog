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
    默认jade为模板引擎
             
[WebStorm添加jade(pug) watcher](http://blog.csdn.net/stSahana/article/details/52191517)
## 实现步骤(参考廖雪峰的JavaScript教程)[链接](http://www.liaoxuefeng.com/wiki/001434446689867b27157e896e74d51a89c25cc8b43bdb3000/001472286125147031e735933574ae099842afd31be80d1000):
```
1.实现基本路由, 路由封装
2.实现模板框架
3.实现数据库连接
4.编写mocha测试
```

#### koa2 和 koa 1.x 的区别
      Koa2 应用了ES7的 Async/Await来替代 Koa1中的生成器函数generator与yield。
      
## 依赖的库
```
    "dependencies": {
    "koa-compose": "^2.3.0",  // 
    "koa": "^1.0.0",  // koa核心库
  }
  ```
