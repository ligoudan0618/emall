const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    uid: { type: mongoose.SchemaTypes.ObjectId, ref: "User" }, // 用户 id
    product: { type: mongoose.SchemaTypes.ObjectId, ref: "Product" }, // 商品ID
    description: { type: String }, // 评论文字内容
    nickName: { type: String }, // 用户昵称
    avatarUrl: { type: String }, // 用户头像
    images: { type: Array }, // 评论图片
    addReview: { type: Array }, // 追评内容
  },
  {
    // 记录时间
    timestamps: true,
  }
);

module.exports = mongoose.model("Review", schema);
