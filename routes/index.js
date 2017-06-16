var router = require('koa-router')();
var mongoose = require('mongoose');
var Model_User = mongoose.model('User');

router.prefix('/');

router.get('/jianshu', async function (ctx, next) {
    // var result_collections = require('../model/ariticle_model');
    // var mongoose = require('mongoose');
    // var Schema = mongoose.Schema;
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
    var count = await articlesModel.count();

    await ctx.render('jianshu', {
        title: '从Mongoose获取简书文章',
        articles_list: result_collections,
        count: count
    })

})

router.get('/jianshu_detail/:href', async function (ctx, next) {
// TODO:调用已注册的数据集合模型
    var articleDetail = mongoose.model('articleDetail');
    let result_collections;
    let href = ctx.params.href;
    console.log(href);
    // const href = '/p/c0caf0dc7761';
    if (href == '')
        return;
    else {
        await articleDetail.findOne({'href': '/p/' + href}, function (err, result) {
            if (err) {
                console.log('load articles detail failed...' + err);
                return;
            } else {
                result_collections = result;
                console.log(result);
            }
        });

        // document.getElementById("content").innerHTML += s
        await ctx.render('detail', {
            title: result_collections.title,
            content: result_collections
        });
    }

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

// TODO:解析/:user参数
// 根据 username查询单条数据
router.get('/list/:user', async function (ctx, next) {
    const username = ctx.params.user;
    console.log(username);
    var user_list;
    await Model_User.find({'username': username}, function (err, userlist) {
        if (err)
            console.log(err)
        else {
            // 取出返回结果
            user_list = userlist
            console.log(user_list)
        }
    })

    await ctx.render('list-user', {
        title: '从Mongoose获取用户列表',
        user_list: user_list
    })

})

module.exports = router;
