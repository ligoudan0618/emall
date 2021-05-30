module.exports = (option) => {
  const jwt = require("jsonwebtoken");
  const assert = require("http-assert");
  const User = require("../models/User");

  return async (req, res, next) => {
    const token = String(req.headers.authorization || "")
      .split(" ")
      .pop();
    console.log(token);
    assert(token, 401, "请先登录！");
    const { id } = await jwt.verify(token, req.app.get("secret"));
    // console.log(id, req.app.get("secret"));
    req.body.uid = id;
    assert(id, 401, "请先登录！");
    req.user = await User.findById(id);
    // console.log(req.user);
    assert(req.user, 401, "请先登录！");
    next();
  };
};
