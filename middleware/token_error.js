const jwt = require('jsonwebtoken');
const util = require('util');
const config = require('../config/config');
const verify = util.promisify(jwt.verify);

var mongoose = require('mongoose');
var Account_Model = mongoose.model('account');  // 使用 account模型

/**
 * 判断token是否可用
 */
module.exports = function () {
    return async function (ctx, next) {
        try {
            // 获取jwt
            const token = ctx.header.authorization;
            if (token) {
                // 解密payload，获取用户名和ID
                let payload = await verify(token.split(' ')[1], config.tokenSecret);
                var usr = payload.username
                ctx.user = {
                    name: payload.name
                };
                // await Account_Model.findOne({username: usr}, function (err, user) {
                //     if (err) {
                //     }
                //     else {
                //         if (!user) {
                //             ctx.status = 401;
                //             ctx.body = {
                //                 success: false,
                //                 message: '认证失败, token无效'
                //             };
                //         }
                //     }
                // })
                await next();
            }
            // else {
                // ctx.status = 401;
                // ctx.body = {
                //     success: false,
                //     message: '认证失败, 未检测到token'
                // };
            // }
        } catch (err) {
            console.log('token verify fail: ', err)
            ctx.redirect('/users/login')
            // ctx.status = 401;
            // ctx.body = {
            //     success: false,
            //     message: '认证失败'
            // };
        }
    }

}


/**
 * 判断token是否可用
 */
module.exports.test = function () {
    return async function (ctx, next) {
        try {
            // 获取jwt
            const token = ctx.header.authorization;
            if (token) {
                try {
                    // 解密payload，获取用户名和ID
                    let payload = await verify(token.split(' ')[1], config.tokenSecret);
                    ctx.user = {
                        username: payload.username
                    };
                } catch (err) {
                    console.log('token verify fail: ', err)
                }
            }
            await next();
        } catch (err) {
            if (err.status === 401) {
                ctx.status = 401;
                ctx.body = {
                    success: 0,
                    message: '认证失败,token无效'
                };
            } else {
                err.status = 404;
                ctx.body = {
                    success: 0,
                    message: '404'
                };
            }
        }
    }
}