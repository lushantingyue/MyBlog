const passport = require('koa-passport');
const LocalStrategy = require('passport-local').Strategy;
const BearerStrategy = require('passport-http-bearer').Strategy;

var mongoose = require('mongoose');
var Account_Model = mongoose.model('account');  // 使用 account模型

// 用户名密码验证策略
passport.use(new LocalStrategy(
    async (username, password, done) => {
        await Account_Model.findOne({"username": username}, (err, user) => {
            if (err) {
                console.log(err)
                return done(null, false, '未知用户')
            } else {
                if(user != null) {
                    if (user.comparePasswordSync(password)) {
                        return done(null, user, '登陆成功')
                    } else {
                        return done(null, false, '密码错误')
                    }
                } else {
                    return done(null, false, '未知用户')
                }
            }
        });
    }
));

// passport.use(new BearerStrategy(
//     async (token, done) => {
//         await Account_Model.findOne({token: token}, (err, user) => {
//             if (err) {
//                 return done(null, false, '未知用户')
//             } else if (user != null) {
//                 return done(null, user, '登陆成功');
//             } else {
//                 return done(null, false, '未找到用户');
//             }
//         });
//     }
// ));

passport.use(new BearerStrategy(
    async (token, done) => {
        console.log(token)
        await Account_Model.findOne({token: token}, function (err, user) {
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false);
            }
            return done(null, user, {scope: 'read'});
        });
    }
));


// 序列化策略：用户登陆验证成功后, 用户数据序列化存储至session中  ctx.login()触发
passport.serializeUser(function (user, done) {
    done(null, user.username)
});

// 反序列化策略：每次请求时, 从session中提取用户对象
passport.deserializeUser(function (user, done) {
    return done(null, user)
});

exports.isBearerAuthenticated = function() {
    return passport.authenticate('bearer', { session: false });
}

exports.isLocalAuthenticated = function() {
    return passport.authenticate('local', { session: false });
}

// module.exports.passportStrategy = passport;
// module.exports = passport;
exports.passport = passport;

// module.exports.secret = 'learnRestApi'; // json web token 加密密钥设置
// module.exports =