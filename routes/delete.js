var router = require('koa-router')();
var mongoose = require('mongoose');
var User_Model = mongoose.model('User');  // 使用User模型

router.prefix('/del');

router.get('/all', async (ctx, next) => {

    // TODO:删除整组数据
    await User_Model.remove();
    await ctx.redirect('/');
});

router.post('/by', async (ctx, next) => {
    // 请求体 params
    var usr = ctx.request.body.username;
    var good = ctx.request.body.goodAt;
    console.log(usr + " " + good);
    var condition = {
        $or: [{"username": usr}, {"goodAt": good}]  // 条件满足其一
        // $and: [{"username": usr}, {"goodAt": good}]  // 同时满足条件
    }
    // TODO:根据查询条件删除数据
    // {"username": usr,"goodAt":good}
    await User_Model.findOne(condition, function (err, doc) {
        if (err) {
            console.log(err)
            return;
        }
        console.log(doc);
        if(doc != null) {
            doc.remove();
            ctx.body = 'delete success...';
        } else {
            ctx.body = 'query data is null...';
        }
    })
});

module.exports = router;