const express = require("express");
const path = require("path");
const app = express();

// express 实例上设置 secret 属性
app.set("secret", "这是给token加密的字符串");
// 设置允许跨域中间件
app.use(require("cors")());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(
  "/uploads/reviewsImg",
  express.static(path.join(__dirname, "uploads/reviewsImg"))
);
require("./plugins/db")(app);
require("./routes/admin/index")(app);
require("./routes/web/index")(app);

app.listen(3000, () => {
  console.log("http://localhost:3000");
});
