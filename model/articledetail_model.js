var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// TODO:定义一个数据的模板规格
// 文章: 作者,标题,正文,日期,头像,字数
var ArticleDetail_Schema = new Schema({
    author: String,
    title: String,
    text: String,
    date:String,
    avatar:String,
    wordage:String,
    href:String
});

// 根据模板定义模型
mongoose.model("articleDetail", ArticleDetail_Schema);