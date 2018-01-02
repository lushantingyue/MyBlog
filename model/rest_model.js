var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// TODO:定义一个数据的模板规格
// 为app提供 文章详情数据: 作者,标题,正文,日期,头像,字数
var ArticleDetail_App_Schema = new Schema({
    author: String,
    title: String,
    essay: String,
    date:String,
    avatar:String,
    wordage:String,
    href:String
});

// 根据模板定义模型
mongoose.model("essay", ArticleDetail_App_Schema);