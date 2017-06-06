require('./model/db');
require('./model/ariticle_model');
const Koa = require('koa');
const app = new Koa();

const views = require('koa-views');
// const Router = require('koa-router');
// const router = new Router();

const json = require('koa-json');
const onerror = require('koa-onerror');
const bodyparser = require('koa-bodyparser')();
const logger = require('koa-logger');

const index = require('./routes/index');
const users = require('./routes/users');
const del = require('./routes/delete');
const restful = require('./routes/rest');

// error handler
onerror(app);

// TODO:middlewares
app.use(bodyparser);

app.use(json());
app.use(logger());
app.use(require('koa-static')(__dirname + '/public'));

// // 匹配nunjuck 模板引擎
// app.use(views('views', {
//     root: __dirname + '/views',
//     default: 'nj',
//     map: {nj: 'nunjucks'}
// }));

// TODO: config nunjucks
const path = require('path');
const nunjucks = require('nunjucks');

const env = new nunjucks.Environment(
    new nunjucks.FileSystemLoader(path.join(__dirname, '/views')))
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
app.use( index.routes())
    .use(index.allowedMethods());
app.use(users.routes())
    .use(users.allowedMethods());
app.use(del.routes())
    .use(del.allowedMethods());
app.use(restful.routes())
    .use(restful.allowedMethods());

module.exports = app;
