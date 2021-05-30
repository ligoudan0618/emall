const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  uid: { type: mongoose.SchemaTypes.ObjectId, ref: "User" }, // 用户 id
  orderNum: { type: String }, // 订单编号
  orderPrice: { type: String }, // 订单总价格
  consigneeAddress: { type: String }, // 收货地址
  userName: { type: String }, // 收货人姓名
  telNumber: { type: String }, // 收件人电话
  createDate: { type: Number }, // 创建订单的时间戳
  delivery: { type: Boolean, default: false }, // 是否已经发货
  isPay: { type: Boolean, default: false }, // 是否已经支付
  isDelivered: { type: Boolean, default: false }, // 是否已经收获
  products: [
    {
      productId: { type: mongoose.SchemaTypes.ObjectId, ref: "Product" }, // 商品ID
      productNum: { type: Number }, // 商品数量
      productPrice: { type: String }, // 商品价格
      isReview: { type: Boolean, default: false }, // 是否评论
      reviewId: { type: mongoose.SchemaTypes.ObjectId, ref: "Review" }, // 评论ID
    },
  ],
});

module.exports = mongoose.model("Order", schema);
