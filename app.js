const dbName = require('./model/db');
console.log(dbName)
require('./model/account_model');
require('./model/article_model');
require('./model/articledetail_model');
require('./model/rest_model');

// const session = require('koa-generic-session')
const session = require('koa-session-minimal')  // 适配koa2, 用于取代 koa-generic-session
// const session = require("koa-session2")
// const MongoStore = require('koa-generic-session-mongo')
const MongooseStore = require('koa-session-mongoose')

const Koa = require('koa');
const app = new Koa();

const views = require('koa-views');
const cors = require('koa2-cors');

const json = require('koa-json');
const onerror = require('koa-onerror');
const bodyparser = require('koa-bodyparser')();
// const mount = require('koa-mount'); // passport认证
// const passport = require('./config/auth').passport;

const logger = require('koa-logger');

const jwt = require('koa-jwt');
const config = require('./config/config');
const tokenError = require('./middleware/token_error').test();

// const xauth = require('./routes/xauth');    // passport认证
const index = require('./routes/index');
const users = require('./routes/users');
const del = require('./routes/delete');
const restful = require('./routes/rest');
const upload = require('./routes/upload');  // 图片上传

// error handler
onerror(app);

// TODO:middlewares
app.proxy = true;   // 启动认证路由
app.use(tokenError);
app.use(bodyparser);

app.use(json());
// 允许跨域访问
app.use(cors());
// 可细化配置允许跨域访问的情景
// app.use(cors({
//     origin: function(ctx) {
//         if (ctx.url === '/test') {
//             return false;
//         }
//         return '*';
//     },
//     exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
//     maxAge: 5,
//     credentials: true,
//     allowMethods: ['GET', 'POST', 'DELETE'],
//     allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
// }));
app.use(logger());
app.use(require('koa-static')(__dirname + '/public'));

// TODO: init session-mongo
app.keys = ['some secret key']; // cookies签名
// 可将 session持久化至 缓存redis 或 数据库中, 此处存储至mongoose中
app.use(session({
    key: 'sessionID',
    maxAge: 6000,
    store: new MongooseStore({
        collection: 'koaSessions',  // 缓存至 mongoDB 的 koaSessions的集合里
        connection: dbName,
        expires: 60 * 60 * 24 * 14, // 2 weeks is the default
        model: 'KoaSession'
    }),
}));

// app.use(passport.initialize()); // 启动认证路由
// app.use(passport.session()); // 启动认证路由
// app.use(passport_strategy.authenticate('naive', {session: false}))
// app.use(mount('/', xauth.routes()) )    // 启动认证路由

app.use(jwt({
    secret: config.tokenSecret
}).unless({
    // 排除掉不需要校验的路由
    // path: [/^\/backapi\/admin\/login/, /^\/blogapi\//]
    path: [/^\/users\/login/, /^\/users\//]
}));

// app.use((ctx, next) => {
//     if (ctx.url.match(/^\/public/)) {
//         ctx.body = 'unprotected\n';
//     } else {
//         return next();
//     }
// });
// app.use(ctx => {
//     if (ctx.url.match(/^\/data/)) {
//         ctx.body = 'protected\n';
//     }
// });

app.use(async (ctx, next) => {
    if (ctx.session.views === undefined)
        ctx.session.views = 1;
    else
        ctx.session.views += 1;

    await next()
    console.log('views times: ' + ctx.session.views);
})

// // 匹配nunjuck 模板引擎
// app.use(views('views', {
//     root: __dirname + '/views',
//     default: 'nj',
//     map: {nj: 'nunjucks'}
// }));

// TODO: config nunjucks
const path = require('path');
const nunjucks = require('nunjucks');

var opts = {};
var noCache = opts.noCache || false,
    watch = opts.watch || false,
    autoescape = opts.autoescape === undefined ? true : opts.autoescape,
    throwOnUndefined = opts.throwOnUndefined || false;
const env = new nunjucks.Environment(
    new nunjucks.FileSystemLoader(path.join(__dirname, '/views'), {
        noCache: noCache,
        watch: watch,
    }), {
        autoescape: false,  // 该参数的配置会影响到, 加载数据内的html标签会不会被解析
        throwOnUndefined: throwOnUndefined
    });
env.addFilter('shorten', function (str, count) {
    return str.slice(0, count || 5)
})
app.use(views(path.join(__dirname, '/views'), {
    options: {
        nunjucksEnv: env
    },
    map: {html: 'nunjucks'}
}))

// logger
app.use(async (ctx, next) => {
    const start = new Date();
    await next();
    const ms = new Date() - start;
    console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

//  TODO: 接入路由定义
// app.use(xauth.routes())
//     .use(xauth.allowedMethods());
app.use(upload.routes())
    .use(upload.allowedMethods());
app.use(index.routes())
    .use(index.allowedMethods());
app.use(users.routes())
    .use(users.allowedMethods());
app.use(del.routes())
    .use(del.allowedMethods());
app.use(restful.routes())
    .use(restful.allowedMethods());

module.exports = app;
