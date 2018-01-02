var router = require('koa-router')();
var mongoose = require('mongoose');
var cheerio = require('cheerio');
var htmlparser = require("htmlparser2");

var he = require('he');

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
router.post('/jianshuList', async function(ctx, next) {
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

    var essay  = mongoose.model('essay');

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
            var processText = he.decode(result.text);
            var $ = cheerio.load(processText);
            var essayText = '';
            var content = $('.show-content');

            // 1.cheerio选择器方案
            // content.find('p').each(function (item) {
            //     var content = $(this);
            //     essayText = essayText + '    ' + content.text().trim() + '\n';
            //     essayText = essayText + '    '+ content.find('b').text().trim() + '\n';
            //     if(content.next().has('h1')) {
            //         essayText = essayText + '\n' + content.next().text().trim() + '\n';
            //     }
            // });

            // 2. htmlParser方案
            var parseContent = '';
            var parser = new htmlparser.Parser({
                onopentag: function (name, attribs) {   //  开始标签
                    if (name === "p") {
                        console.log("p tag!");
                        parseContent = parseContent + '    ';
                    } else if (name == 'i') {
                        parseContent = parseContent + '  ';
                    } else if (name == 'div') {
                        // parseContent = parseContent + '<div>';
                    } else if (name == 'img') {
                        parseContent = parseContent + '<img>';
                    } else if (name == 'h1') {
                        parseContent = parseContent + '    ';
                    } else if (name == 'b') {
                        parseContent = parseContent + '  ';
                    } else if (name == 'br') {
                        parseContent = parseContent + '  ';
                    }
                },
                ontext: function (text) {   // 内容部分
                    console.log("-->", text);
                    parseContent = parseContent + text;
                },
                onclosetag: function (tagname) {    // 结束标签
                    if (tagname === "p") {
                        console.log("p tag end!");
                        parseContent = parseContent + '\n';
                    } else if (name == 'i') {
                        parseContent = parseContent + '\n';
                    } else if (name == 'h1') {
                        parseContent = parseContent + '\n';
                    } else if (name == 'b') {
                        parseContent = parseContent + '\n';
                    } else if (name == 'br') {
                        parseContent = parseContent + '\n';
                    }
                }
            }, {decodeEntities: true});
            parser.write(content.text());
            parser.end();
            console.log('>>>>>> ESSAY ' + parseContent + '\n\n');

            // console.log('>>>>>> ESSAY ' + essayText + '\n\n');

            result.text = parseContent + "";
            result_collections = result;
            console.log(result);
        }
    })


    // TODO:返回REST API 数据
    ctx.response.body = result_collections;
})

module.exports = router;
