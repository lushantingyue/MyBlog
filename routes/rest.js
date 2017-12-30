var router = require('koa-router')();
var mongoose = require('mongoose');

router.prefix('/data');

// TODO: 文章列表数据
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
    }).sort({"page": 1})

    // TODO:返回REST API 数据
    ctx.response.body = result_collections;
})

// TODO: 分页加载文章列表数据
router.post('/jianshu', async function(ctx, next) {
    // 解析post请求params参数
    var num = ctx.request.body.page;
// TODO:调用已注册的数据集合模型
    var articlesModel = mongoose.model("articles");
    var result_collections;
    await articlesModel.find({"page": num}, function (err, result) {
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

// TODO:文章详情数据
// router.prefix('/data');
router.get('/jianshuDetail/:href', async function(ctx, next) {

// TODO:调用已注册的数据集合模型
    var articlesdetailModel = mongoose.model("articleDetail");
    let href = ctx.params.href;
    var result_collections;
    await articlesdetailModel.findOne({'href': '/p/' + href}, function (err, result) {
        if (err) {
            console.log('load articles detail data failed...' + err);
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
