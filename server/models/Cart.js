const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    // 用户openID
    uid: { type: mongoose.SchemaTypes.ObjectId, ref: "User" }, // 用户 id
    // 商品列表
    productList: [
      {
        productId: { type: mongoose.SchemaTypes.ObjectId, ref: "Product" }, // 商品ID
        name: { type: String },
        price: { type: Number }, // 商品价格
        image: { type: String }, // 商品图片
        num: { type: Number }, // 商品数量
        checked: { type: Boolean, default: false }, // 是否选中
      },
    ],
  },
  {
    timestamps: true, // 创建时间
  }
);

module.exports = mongoose.model("Cart", schema);
