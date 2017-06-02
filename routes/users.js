var router = require('koa-router')();
var mongoose = require('mongoose');
var User_Model = mongoose.model('User');  // 使用User模型

router.prefix('/users');

router.get('/', async (ctx, next) => {
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

module.exports = router;