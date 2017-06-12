var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// TODO:定义一个数据的模板规格
// 文章: 作者,标题,概要,日期,头像
var articlesSchema = new Schema({
    author: String,
    title: String,
    abstract: String,
    date: String,
    avatar: String,
    href:String
});

// 根据模板定义模型
var articlesModel = mongoose.model("articles", articlesSchema);

// articlesModel.find({}, function (err, result) {
//     if (err) {
//         console.log('load articles data failed...' + err);
//         return;
//     }
//     else {
//         // result_collections = result;
//         console.log(result);
//     }
// })

// module.exports = result_collections;