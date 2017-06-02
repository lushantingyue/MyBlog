var router = require('koa-router')();
var mongoose = require('mongoose');
var Model_User = mongoose.model('User');

router.get('/', async function (ctx, next) {
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
        message:data,
        user_list: user_list
    })

    // await ctx.render('index', {message: data});
})

router.get('/foo', async function (ctx, next) {
    await ctx.render('index', {
        title: 'koa2 foo'
    });
});

module.exports = router;
