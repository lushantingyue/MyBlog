const passport = require('../config/auth').passport;
const { isBearerAuthenticated, isLocalAuthenticated } = require('../config/auth');

var router = require('koa-router')();

var mongoose = require('mongoose');
var Account_Model = mongoose.model('account');  // 使用 account模型

// 认证登陆
router.post('/xauth/login', function (ctx, next) {
    return passport.authenticate('local', function (err, user, info, status) {
        if (user) {
            ctx.body = { success: true, message: info }
            return ctx.login(user)
        } else {
            ctx.status = 401
            ctx.body = { success: false, message: info }
        }
    }) (ctx, next);
});

// 认证登出
router.post('/xauth/logout', function (ctx, next) {
    ctx.logout()
    ctx.body = {auth: ctx.isAuthenticated(), user: ctx.state.user, message: 'logout success'}
});

// 自定义身份认证校验的路由
router.post('/xauth/test', function (ctx, next) {
    if (ctx.isAuthenticated()) {
        ctx.body = { message: '认证通过', status: 200}
    } else {
        // ctx.throw(401)
        ctx.status = 401
        ctx.body = { message: '非法访问', status: 401 }
    }
});

module.exports = router;