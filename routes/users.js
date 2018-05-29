var router = require('koa-router')();
var mongoose = require('mongoose');
var User_Model = mongoose.model('User');  // 使用User模型, 通讯录清单
var Account_Model = mongoose.model('account');  // 使用 account模型, 登陆账户管理

const jwt = require('jsonwebtoken');
const config = require('../config/passport_config');
let accessStatus = 200, accessData = null; // 全局暂存处理结果

router.prefix('/users');

router.get('/a', async (ctx, next) => {
    // ctx.body = 'this is a users response!';
    await ctx.render('nunjucks-filter', {message: 'this is a users response!'});
});

router.get('/bar', function (ctx, next) {
    ctx.body = 'this is a users/bar response';
});

router.post('/add', async function (ctx, next) {
    // TODO: params 字段非空验证
    if (!ctx.request.body.username) {
        ctx.throw(400, '.name required');
    }
    // 更具Model创建数据实体
    await new User_Model({
        username: ctx.request.body.username,
        goodAt: ctx.request.body.goodAt,
        created: Date.now()
    }).save(function (err, user, count) {
        // ctx.redirect('/');
        console.log('upgrade data success...')
    });

});

// 根据条件更新数据
router.post('/upgrade', async (ctx, next) => {
    var usr = ctx.request.body.username;
    var good = ctx.request.body.goodAt;
    var edt_goodAt = ctx.request.body.edt_goodAt;

    var condition = {
            $or: [{"username": usr}, {"goodAt": good}]
        },
        update = {$inc: {visits: 1}},
        options = {multi: true};

    User_Model.findOne(condition, function (err, user) {
        if (err) {
            console.log(err)
            return;
        } else {
            console.log(user);
            if (user != null) {
                user.goodAt = edt_goodAt;
                user.created = Date.now();
                var _id = user._id;
                User_Model.update({_id: _id}, user, function (err) {
                    if (err)
                        return;
                    ctx.body = '更新数据成功...';
                });
            } else {
                ctx.body = '不存在相关数据...';
            }
        }
    });

});

// TODO: session保持
router.post('/register', async function (ctx, next) {
    console.log(ctx.request.body)
    var session = ctx.session;
    let body = ctx.request.body;
    // body.password = await bcrypt.hash(body.password, 10)
    // if (!body.username) {
    //     ctx.throw(400, '.name required'); // 数据模型已经声明为必须
    // }
    let account = new Account_Model({
        username: body.username,
        password: body.password,
        signature: 'I am Super User...',
        created: Date.now(),
        token: 'token'
    });

    await Account_Model.findOne({"username": body.username}, (err, user) => {
        if (err) {
            console.log(err)
            return ;
        } else {
            if(null != user) {
                console.log('账号已存在...')
                ctx.response.body = { message: '账号已存在...'}
            } else {
                console.log('可注册...')

                // 保存用户账号
                account.save((err) => {
                    if (err) {
                        console.log(err);
                        return ctx.response.body = { success: false, message: '注册失败! '};
                    }
                    console.log('register success...')
                    // session.current_user = { username: body.username }
                    // ctx.response.body = { success: true, message: '成功创建新用户! ' } // 在这里不会被调用
                });
                ctx.response.body = { success: true, message: '成功创建新用户! ' }
            }
        }
    });

    // console.log(session)
    // ctx.redirect('/list')
});

// TODO: login 检查用户名、密码，验证通过后返回一个access token
router.post('/login', async function (ctx, next) {
    var session = ctx.session;
    let body = ctx.request.body;
    console.log(body)

    var condition = {
        $and: [{"username": body.username}, {"password": body.password}]
    };

    const account = await Account_Model.findOne({"username": body.username});
    if (!account) {
        ctx.response.status = 401
        ctx.response.body = { success: false, message: '认证失败，用户不存在! '}
    } else {
        account.comparePassword(body.password, (err, isMatch) => {
            if (isMatch && !err) {
                // 生成 token签名
                var token = jwt.sign({username: account.username}, config.secret, {
                    expiresIn: 1800 // 30分钟有效时间
                });
                account.token = token;
                Account_Model.update({_id: account._id}, account, function (err) {
                    if (err) {
                        ctx.response.status = 401;
                        ctx.response.body = {message: err}
                        return;
                    }
                    console.log('更新数据成功...');
                });
                console.log('login success...' + 'token: ' + token);

                accessData = {
                    success: true,
                    message: '验证成功!',
                    token: 'Bearer ' + token,
                    username: account.username
                }
            } else {
                accessStatus = 401
                accessData = {success: false, message: '认证失败, 密码错误! '};
            }
        })

        ctx.response.status = accessStatus;
        ctx.response.body = accessData;

        // 注: koa2中 ctx.response.body 和 ctx.body 是等效的
    }

})

module.exports = router;