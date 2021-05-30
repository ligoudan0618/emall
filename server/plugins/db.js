module.exports = (app) => {
  const mongoose = require("mongoose");
  const path = require("path");

  mongoose.connect("mongodb://localhost:27017/emall", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  });

  // 获取 models 里的所有文件
  require("require-all")(path.join(__dirname, "../models"));
};
