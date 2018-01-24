const passport = require('koa-passport');
const LocalStrategy = require('passport-local').Strategy;
const UserModel = require(__dirname + '/../model/account_model');

// 用户名密码验证策略
passport.use(new LocalStrategy({
    function (username, password, done) {
        // var condition = {
        //         $and: [{"username": username}, {"password": password}]
        //     }
        let where = {where: {username: username}}
        UserModel.findOne(where).then(function (result) {
            if (result != null) {
                if (result.password === password) {
                    return done(null, result)
                } else {
                    return done(null, false, '密码错误s')
                }
            } else {
                return done(null, false, '未知用户')
            }
        }).catch(function (err) {
            log.error(err.message)
            return done(null, false, {message: err.message})
        });
    }
}));

// 序列化策略：用户登陆验证成功后, 用户数据序列化存储至session中  ctx.login()触发
passport.serializeUser(function (user, done) {
    done(null, user)
});

// 反序列化策略：每次请求时, 从session中提取用户对象
passport.deserializeUser(function (user, done) {
    return done(null, user)
});

module.exports = passport;