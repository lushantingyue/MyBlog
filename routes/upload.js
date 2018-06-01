var router = require('koa-router')();
const multer = require('koa-multer');

// 路由守护中间件: 拦截校验passport-local权限
// router.use('/*', async (ctx, next) => {
//     if (ctx.isAuthenticated()) {
//         console.log('success...' + ctx.body);
//         await next()
//     } else {
//         ctx.status = 401
//         ctx.body = {msg: 'auth fail'}
//         console.log('auth failed...' + ctx.status);
//         await next()
//     }
// });

router.prefix('/upload');

var storage = multer.diskStorage({
    // 文件保存路径
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/pic')
    },
    // 修改文件名称
    filename: function (req, file, cb) {
        var fileFormat = (file.originalname).split(".");
        cb(null, Date.now() + "." + fileFormat[fileFormat.length - 1]);
    }
});

const upload = multer({storage: storage});

// 图片上传
router.post('/pic', upload.single('file'), async function (ctx, next) {
    ctx.body = {
        filename: ctx.req.file.filename,
        message: 'upload success'
    }
});

module.exports = router;