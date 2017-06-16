var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// TODO:定义一个数据的模板规格
// 账号: 用户名, 密码, 个性签名, 日期
var accountSchema = new Schema({
    username: String,
    password: String,
    signature: String,
    created: Date
});

// 根据模板定义模型
var accountModel = mongoose.model("account", accountSchema);