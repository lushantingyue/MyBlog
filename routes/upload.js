var router = require('koa-router')();
const multer = require('koa-multer');

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

const upload = multer({ storage: storage });

// 图片上传
router.post('/pic', upload.single('file'), async function (ctx, next) {
    if(ctx.isAuthenticated()) {
        // next()
        // ctx.response.body = 'upload pic...'
        ctx.body = {
            filename: ctx.req.file.filename,
            message: 'success'
        }
    } else {
        ctx.status = 401
        ctx.body = { msg: 'auth fail' }
    }
    // ctx.response.body = 'upload pic...'
});

module.exports = router;