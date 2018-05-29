var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

// TODO:定义一个数据的模板规格
// 账号: 用户名, 密码, 个性签名, 日期
const accountSchema = new Schema({
    username: {
        type: String ,
        unique: true,   //不可重复
        require: true  // 不可为空约束
    },
    password: String,
    signature: String,
    created: Date,
    token: String
});

// 添加用户保存时中间件对password进行bcrypt加密,这样保证用户密码只有用户本人知道
accountSchema.pre('save', function (next) {
    var user = this;
    if (this.isModified('password') || this.isNew) {
        // 对用户密码进行hash加密
        bcrypt.genSalt(10, function (err, salt) {
            if (err) {
                return next(err);
            }
            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) {
                    return next(err)
                }
                user.password = hash
                next()
            })

        });
    } else {
        return next;
    }
});

// 校验用户输入密码是否正确(异步callback方式)
accountSchema.methods.comparePassword = function(psw, cb) {
    bcrypt.compare(psw, this.password, (err, isMatch) => {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};

// 校验用户输入密码是否正确(同步方式)
accountSchema.methods.comparePasswordSync = function(psw) {
    return bcrypt.compareSync(psw, this.password);
};

// 根据模板定义模型
var accountModel = mongoose.model("account", accountSchema);