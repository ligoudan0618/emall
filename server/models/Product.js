const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  categories: { type: mongoose.SchemaTypes.ObjectId, ref: "Category" }, // 分类ID
  name: { type: String }, // 分类名
  price: { type: Number }, // 价格
  image: { type: String }, // 图片
  description: { type: String }, // 描述
  detail: { type: String }, // 商品详情
});

module.exports = mongoose.model("Product", schema);
