var router = require('koa-router')();

router.prefix('/upload');
// 路由守护中间件 不生效
// router.use('/upload/*', async (ctx, next) => {
//     if(ctx.isAuthenticated()) {
//         await next()
//     } else {
//         ctx.status = 401
//         ctx.body = { msg: 'auth fail' }
//     }
// });

// 图片上传
router.post('/pic', async function (ctx, next) {
    if(ctx.isAuthenticated()) {
        // next()
        ctx.response.body = 'upload pic...'
    } else {
        ctx.status = 401
        ctx.body = { msg: 'auth fail' }
    }
    // ctx.response.body = 'upload pic...'
});

module.exports = router;