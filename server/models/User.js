const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  // 用户的 openID
  userOpenId: {
    type: String,
    select: false,
    // set(val) {
    //   return require("bcrypt").hashSync(val, 10);
    // },
  },
  userName: { type: String }, // 用户登录名
  password: {
    type: String,
    select: false,
    // 对密码进行加密
    set(val) {
      return require("bcrypt").hashSync(val, 10);
    },
  },
  nickName: { type: String }, // 用户用名
  avatarUrl: { type: String }, // 头像
  mobile: { type: String }, // 手机号码
  email: { type: String }, // 邮箱
});

module.exports = mongoose.model("User", schema);
