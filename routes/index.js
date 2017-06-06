var router = require('koa-router')();
var mongoose = require('mongoose');
var Model_User = mongoose.model('User');

router.prefix('/');

router.get('/jianshu', async function(ctx, next) {
    // var result_collections = require('../model/ariticle_model');
    // var mongoose = require('mongoose');
    // var Schema = mongoose.Schema;
//
// // TODO:定义一个数据的模板规格
// // 文章: 作者,标题,概要,日期,头像
//     var articlesSchema = new Schema({
//         author: String,
//         title: String,
//         abstract: String,
//         date: String,
//         avatar: String
//     });
//
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

    await ctx.render('jianshu', {
        title: '从Mongoose获取简书文章',
        articles_list: result_collections
    })

})

router.get('/list', async function (ctx, next) {
    // require('../model/ariticle_model');
    // ctx.state = {
    //     title: 'koa2 展示列表数据'
    // };
    // PersonModel.find(function(err,persons){
    //     //查询到的所有person
    // });
    var user_list;
    await Model_User.find(function (err, userlist) {
        if (err)
            console.log(err)
        else {
            // 取出返回结果
            user_list = userlist
            console.log(user_list)
        }
    })

    var data = `[ { _id: 59280d6e531c0d16141be57c,
        username: 'Steve Rogers',
        goodAt: 'Fighting',
        created: 2017-05-26T11:11:42.788Z,
        __v: 0 },
    { _id: 592811ae9d9b343a5c359ffa,
        username: 'Steve Rogers',
        goodAt: 'Fighting',
        created: 2017-05-26T11:29:50.430Z,
        __v: 0 } ]`

    // var data = `['Steve Rogers','Ken Masters']`
    await ctx.render('list-user', {
        title: '从Mongoose获取用户列表',
        // user_list: ['Apple', 'Pear', 'Banana']
        message: data,
        user_list: user_list
    })

})

// TODO:router 解析id参数ko
router.get('/:id', (ctx, next) => {
    console.log(ctx.param);
});

router.url('/foo', async function (ctx, next) {
    await ctx.render('index', {
        title: 'koa2 foo'
    });
});



module.exports = router;
