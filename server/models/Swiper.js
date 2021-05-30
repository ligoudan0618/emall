const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  name: { type: String },
  items: [
    {
      product: { type: mongoose.SchemaTypes.ObjectId, ref: "Product" }, // 商品ID
      img: { type: String }, // 商品图片
    },
  ],
});

module.exports = mongoose.model("Swiper", schema);
