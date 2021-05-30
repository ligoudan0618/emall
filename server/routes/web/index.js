module.exports = (app) => {
  const express = require("express");
  const router = express.Router({ mergeParams: true });
  const path = require("path");
  const jwt = require("jsonwebtoken");
  const assert = require("http-assert");
  const getOrderNum = require("../../plugins/createOrderNum");
  const miniProgramAuthMiddleWare = require("../../middleWare/miniProgramAuth");
  const getUserOpenId = require("../../plugins/getUserOpenId");

  // 数据库操作模型
  const Cart = require("../../models/Cart");
  const Swiper = require("../../models/Swiper");
  const Product = require("../../models/Product");
  const Recommendedation = require("../../models/Recommendedation");
  const Category = require("../../models/Category");
  const Review = require("../../models/Review");
  const User = require("../../models/User");
  const Order = require("../../models/Order");

  router.get("/swipers", async (req, res) => {
    const model = await Swiper.find();
    // console.log(model);
    res.send(model);
  });

  router.get("/products", async (req, res) => {
    const model = await Product.find().populate("categories");
    res.send(model);
  });
  router.get("/recommendedation", async (req, res) => {
    const model = await Recommendedation.find().populate(
      "recommendedation.items.productId"
    );
    res.send(model);
  });
  router.get("/product/:id", async (req, res) => {
    const model = await Product.findById(req.params.id).populate("categories");
    // console.log("success");
    res.send(model);
  });

  router.get("/categories", async (req, res) => {
    let model = await Category.find().populate("parent");
    res.send(model);
  });

  router.get("/reviews", async (req, res) => {
    let model = await Review.find().populate("product");
    res.send(model);
  });
  // 获取用户评论列表
  router.get("/userReviews", miniProgramAuthMiddleWare(), async (req, res) => {
    const reviews = await Review.find({
      uid: req.body.uid,
    }).populate("product");
    res.send(reviews);
  });
  // 保存用户购物车数据
  router.post(
    "/saveUserCart",
    miniProgramAuthMiddleWare(),
    async (req, res) => {
      let { uid, productList } = req.body;
      productList = productList.map((v) => {
        v.productId = v._id;
        return v;
      });
      console.log(req.body);
      const cart = await Cart.findOne({ uid });
      if (!cart) {
        await Cart.create({ uid, productList });
      } else {
        await Cart.findOneAndUpdate({ uid }, { $set: { productList } });
      }
      res.send({ message: "success" });
    }
  );
  // 获取用户购物车数据
  router.get("/getUserCart", miniProgramAuthMiddleWare(), async (req, res) => {
    const cart = await Cart.findOne({ uid: req.body.uid });
    res.send(cart);
  });
  // 提交评论
  router.post(
    "/submitReview",
    miniProgramAuthMiddleWare(),
    async (req, res) => {
      console.log(req.body);
      const reviewRes = await Review.create(req.body);
      console.log(reviewRes);
      // 设置订单中商品 已经评论
      await Order.findOneAndUpdate(
        {
          orderNum: req.body.orderNum,
          "products.productId": req.body.product,
        },
        {
          $set: {
            "products.$.isReview": true,
            "products.$.reviewId": reviewRes._id,
          },
        }
      );
      res.send({
        message: "success",
      });
    }
  );
  // 追加评论
  router.put("/addReview", miniProgramAuthMiddleWare(), async (req, res) => {
    console.log(req.body);
    await Review.findOneAndUpdate(
      { _id: req.body.reviewId },
      { $push: { addReview: req.body.addReview } }
    );
    res.send({ message: "success" });
  });
  // 前端注册时检测用户是否已存在
  router.post("/getUser", async (req, res) => {
    // console.log(req.body);
    const user = await User.find({ userName: req.body.userName });
    assert(user.length, 422, "用户不存在");
    res.send({ message: "用户已存在" });
  });
  // 用户注册
  router.post("/userRegister", async (req, res) => {
    console.log(req.body);
    const { code, formData, userInfo } = req.body;
    // 获取用户openId
    const userOpenId = await getUserOpenId(code);
    // 先根据用户openId查找
    const userByOpenId = await User.find({
      userOpenId,
    });
    // 在根据用户名查找
    const userByName = await User.find({
      userName: formData.userName,
    });
    if (userByOpenId.length === 0 && userByName.length === 0) {
      // 用户不存在
      await User.create({
        userOpenId,
        ...formData,
        ...userInfo,
      });
      // console.log(users);
      res.send({ message: "注册成功!" });
    } else if (userByOpenId.length !== 0 && userByName.length === 0) {
      // 以用微信账号登陆过
      await User.findOneAndUpdate(
        { userOpenId },
        { userOpenId, ...formData, ...userInfo }
      );
      res.send({ message: "已成功绑定微信号" });
    } else if (userByOpenId.length !== 0 && userByName.length !== 0) {
      res.status(422).send({ message: "该微信已绑定其他账号!" });
    } else {
      res.status(422).send({ message: "用户已存在!" });
    }
  });
  // 用户账号密码登录
  router.post("/userLogin", async (req, res) => {
    const { userName, password } = req.body;
    // 1、根据用户名查找用户 强制选择密码
    const user = await User.findOne({ userName }).select("+password");
    assert(user, 422, "用户不存在"); // 2、校验密码
    const isValid = require("bcrypt").compareSync(password, user.password);
    assert(isValid, 422, "密码错误！");
    // 3、返回 token  安装 jsonwebtoken 做 token 验证
    console.log("账号密码登录", user._id);
    const token = jwt.sign({ id: user._id }, app.get("secret"));
    res.send({ token, user });
  });
  // 用户微信登录 根据用户登录时的 临时 code 来换取 用户的 openid
  router.post("/weChatLogin", async (req, res) => {
    // 获取用户openId
    const userOpenId = await getUserOpenId(req.body.code);
    const { nickName, avatarUrl } = req.body;
    // console.log(typeof openId);
    let user = await User.findOne({ userOpenId });
    console.log(user);
    if (!user) {
      user = await User.create({
        userOpenId,
        nickName,
        avatarUrl,
      });
      console.log(user);
    } else {
      console.log("success");
    }
    // 登录成功返回token和用户信息
    console.log("微信登陆", user._id);
    const token = jwt.sign({ id: user._id }, app.get("secret"));
    res.send({ token, user });
  });
  // 用户修改密码
  router.post(
    "/changePassWord",
    miniProgramAuthMiddleWare(),
    async (req, res) => {
      console.log(req.body, req.body.uid);
      const { oldPassword, newPassword1, changeMethod, uid } = req.body;
      const user = await User.findById(uid).select("+password");
      console.log(user);
      if (changeMethod === "oldPassWord") {
        const isValid = require("bcrypt").compareSync(
          oldPassword,
          user.password
        );
        assert(isValid, 422, "密码错误！");
        console.log(1111, newPassword1);
        await User.findByIdAndUpdate(uid, { $set: { password: newPassword1 } });
        res.send({ message: "密码修改成功！" });
      } else if (changeMehod === "mobile") {
        const { mobile } = req.body;
        if (mobile === user.mobile) {
          await User.findByIdAndUpdate(uid, {
            $set: { password: newPassword1 },
          });
          res.send({ message: "密码修改成功！" });
        }
      } else {
        res.status(422).send({ message: "密码修改失败！" });
      }
    }
  );
  // 创建订单 响应订单号 并且 修改购物车中商品的数据
  router.post(
    "/orders/create",
    miniProgramAuthMiddleWare(),
    async (req, res) => {
      const { uid, newCart: productList } = req.body;
      req.body.orderNum = getOrderNum(req.body.createDate);
      // console.log(req.body.newCart);
      await Cart.findOneAndUpdate({ uid }, { $set: { productList } });
      await Order.create(req.body);
      res.send({ orderNum: req.body.orderNum });
    }
  );

  // 获取订单 根据类型获取订单
  router.get("/getOrders", miniProgramAuthMiddleWare(), async (req, res) => {
    // console.log(req.query.type); type为string类型
    let orders;
    if (req.query.type === "1") {
      // 获取用户全部订单
      orders = await Order.find({ uid: req.body.uid });
    } else if (req.query.type === "2") {
      // 待收货
      orders = await Order.find({
        uid: req.body.uid,
        isPay: true,
        isDelivered: false,
      });
    } else if (req.query.type === "4") {
      // 已收货
      orders = await Order.find({
        uid: req.body.uid,
        isDelivered: true,
      });
    } else {
      // 待付款
      orders = await Order.find({
        uid: req.body.uid,
        isPay: false,
      });
    }
    res.send(orders);
  });
  // 订单详情 根据订单号获取订单
  router.get("/getOrderDetail", async (req, res) => {
    // console.log(req.query);
    const order = await Order.find({ orderNum: req.query.orderNum }).populate(
      "products.productId"
    );
    res.send(order);
  });
  // 取消订单
  router.delete("/deleteOrder", async (req, res) => {
    // console.log(req.body);
    const order = await Order.findOneAndDelete(req.body);
    console.log(order);
    res.send({ message: "success" });
  });

  // 确定支付 支付成功后修改订单状态
  router.put("/pay", async (req, res) => {
    console.log(req.body);
    const model = await Order.findOneAndUpdate(req.body, {
      $set: { isPay: true },
    });
    res.send({ message: "success" });
  });

  // 确认收货
  router.put("/confirmReceipt", async (req, res) => {
    console.log(req.file);
    const model = await Order.findOneAndUpdate(req.body, {
      $set: { isDelivered: true },
    });
    res.send(file);
  });

  // 修改收货地址
  router.put("/changeAddress", async (req, res) => {
    await Order.findOneAndUpdate(
      { orderNum: req.body.orderNum },
      { $set: { consigneeAddress: req.body.consigneeAddress } }
    );
    res.send("yes");
    ca;
  });
  // 商品查询
  router.post("/searchProducts", async (req, res) => {
    let searchValue = req.body.value;
    assert(searchValue, 422, "请输入要搜索的内容");
    const reg = new RegExp(searchValue, "i");
    const _filter = {
      $or: [{ name: { $regex: reg } }, { description: { $regex: reg } }],
    };
    const products = await Product.find(_filter);
    // console.log(products);
    res.send(products);
  });

  // 图片上传
  const multer = require("multer");
  const upload = multer({
    dest: path.join(__dirname, "../../uploads/reviewsImg"),
  });
  app.post("/web/api/upload", upload.single("file"), async (req, res) => {
    // console.log(req.file);
    const file = req.file;
    file.url = `http://localhost:3000/uploads/reviewsImg/${file.filename}`;
    res.send(file);
  });
  app.use("/web/api", router);

  // 错误处理函数
  app.use(async (err, req, res, next) => {
    res.status(err.status || 500).send({
      message: err.message,
    });
  });
};
