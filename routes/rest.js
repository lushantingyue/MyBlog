var router = require('koa-router')();
var mongoose = require('mongoose');

router.prefix('/data');

router.get('/jianshu', async function(ctx, next) {

// TODO:调用已注册的数据集合模型
    var articlesModel = mongoose.model("articles");
    var result_collections;
    await articlesModel.find({}, function (err, result) {
        if (err) {
            console.log('load articles data failed...' + err);
            return;
        }
        else {
            result_collections = result;
            console.log(result);
        }
    })

    // TODO:返回REST API 数据
    ctx.response.body = result_collections;
})

module.exports = router;
