const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  name: { type: String }, // 分类名
  parent: { type: mongoose.SchemaTypes.ObjectId, ref: "Category" }, // 父类ID
});

module.exports = mongoose.model("Category", schema);
