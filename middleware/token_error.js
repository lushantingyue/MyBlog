const jwt = require('jsonwebtoken');
const config = require('../config/config');
const util = require('util');
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
                try {
                    // 解密payload，获取用户名和ID
                    let payload = await verify(token.split(' ')[1], config.tokenSecret);
                    var usr = payload.username
                    await Account_Model.findOne({token: token}, function (err, user) {
                        if (err) {
                            return ;
                        }
                        if (!user) {
                            ctx.status = 401
                            ctx.body = {
                                success: 0,
                                message: '认证失败, token无效'
                            };
                            return ;
                        } else {
                            ctx.status = 200
                            ctx.body = {
                                message: '认证成功',
                                username: payload.username
                            };
                            next();
                        }
                        // return done(null, user, {scope: 'read'});
                    });

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
                    message: '认证失败'
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