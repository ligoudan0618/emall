module.exports = (app) => {
  const express = require("express");
  const path = require("path");
  const jwt = require("jsonwebtoken");
  const assert = require("http-assert");
  const AdminUser = require("../../models/AdminUser");
  const Order = require("../../models/Order");

  // 让子路由能继承父路由的参数 mergeParams: true
  const router = express.Router({ mergeParams: true });
  // const Category = require("../../models/Category");

  router.post("/", async (req, res) => {
    const model = await req.Model.create(req.body);
    res.send(model);
  });
  // 获取资源列表
  router.get("/", async (req, res) => {
    const queryOptions = {};
    if (req.Model.modelName === "Product") {
      queryOptions.populate = "categories";
    } else if (req.Model.modelName === "Category") {
      queryOptions.populate = "parent";
      // console.log(req.query.pageNum);
    } else if (req.Model.modelName === "Review") {
      queryOptions.populate = "product";
    } else if (req.Model.modelName === "Order") {
      queryOptions.populate = "products.productId";
    }
    const totalNum = await req.Model.countDocuments();
    // console.log(totalNum);
    const model = await req.Model.find()
      .setOptions(queryOptions)
      .skip((req.query.pageNum - 1) * req.query.pageSize)
      .limit(Number(req.query.pageSize));
    res.send({ model, totalNum });
  });
  // 根据 id 获取资源
  router.get("/:id", async (req, res) => {
    const queryOptions = {};
    if (req.Model.modelName !== "Review") {
      queryOptions.populate = "product";
    }
    const model = await req.Model.findById(req.params.id).setOptions(
      queryOptions
    );
    // console.log(model.product.categories);
    res.send(model);
  });
  // 修改资源
  router.put("/:id", async (req, res) => {
    const model = await req.Model.findByIdAndUpdate(req.params.id, req.body);
    res.send({
      success: true,
    });
  });
  // 删除操作
  router.delete("/:id", async (req, res) => {
    const model = await req.Model.findByIdAndDelete(req.params.id);
    res.send({
      success: true,
    });
  });
  // 登录校验中间件
  const authMiddleWare = require("../../middleWare/auth");
  // 获取模型中间件
  const resourseMiddleWare = require("../../middleWare/resourse");
  // 上传图片
  const multer = require("multer");
  const upload = multer({ dest: path.join(__dirname, "../../uploads") });
  app.post(
    "/admin/api/upload",
    authMiddleWare(),
    upload.single("file"),
    async (req, res) => {
      const file = req.file;
      file.url = `http://localhost:3000/uploads/${file.filename}`;
      res.send(file);
    }
  );
  app.use(
    "/admin/api/rest/:resourse",
    // 资源访问 校验是否登录中间件
    // async (req, res, next) => {
    //   const token = String(req.headers.authorization || "")
    //     .split(" ")
    //     .pop();
    //   assert(token, 401, "请先登录！");
    //   // console.log(token);
    //   const { id } = await jwt.verify(token, app.get("secret"));
    //   assert(id, 401, "请先登录！");
    //   req.user = await AdminUser.findById(id);
    //   assert(req.user, 401, "请先登录！");
    //   next();
    // },
    // async (req, res, next) => {
    //   const modelName = require("inflection").classify(req.params.resourse);
    //   req.Model = require(`../../models/${modelName}`);
    //   next();
    // },
    authMiddleWare(),
    resourseMiddleWare(),
    router
  );
  // 发货
  app.put("/admin/api/delivery", async (req, res) => {
    console.log(req.body);
    const order = await Order.findOneAndUpdate(req.body, {
      $set: { delivery: true },
    });
    res.send({ message: "success" });
  });
  // 登录接口
  app.post("/admin/api/login", async (req, res) => {
    const { username, password } = req.body;
    // 1、根据用户名查找用户 强制选择密码
    const user = await AdminUser.findOne({ username }).select("+password");
    // if (!user) {
    //   return res.status(422).send({
    //     message: "用户不存在",
    //   });
    // }
    assert(user, 422, "用户不存在");
    // 2、校验密码
    const isValid = require("bcrypt").compareSync(password, user.password);
    assert(isValid, 422, "密码错误！");
    // 3、返回 token  安装 jsonwebtoken 做 token 验证
    const token = jwt.sign({ id: user._id }, app.get("secret"));

    res.send({ token });
  });

  // 错误处理函数
  app.use(async (err, req, res, next) => {
    res.status(err.status || 500).send({
      message: err.message,
    });
  });
};
