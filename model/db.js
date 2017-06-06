var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.set('debug', true);

var Schema = mongoose.Schema;

// 定义一个数据的模板规格
// 用户名, 特长, 创建日期
var User = new Schema({
    username: String,
    goodAt: String,
    created: Date
});

// 根据模板定义模型
mongoose.model("User", User);

// 创建数据库连接
var db = mongoose.connect('mongodb://localhost/MyBlog-User');
db.connection.on("error", function (error) {
    console.log("数据库连接失败：" + error);
});

db.connection.on("open", function () {
    console.log("数据库连接成功");
});

// var conn = mongoose.createConnection('localhost','MyBlog-User');
//
// conn.on('error', console.error.bind(console, '连接错误'));
// conn.once('open', function () {
//     console.log('连接成功...');
// });