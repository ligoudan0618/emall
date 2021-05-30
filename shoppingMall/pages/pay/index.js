import { request } from "../../utils/request";
import { showModal } from "../../utils/asyncWx";
import regeneratorRuntime from "../../utils/runtime";

// pages/pay/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    address: {},
    cart: [],
    totalPrice: 0,
    totalNum: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 1、获取缓存中的收货地址
    const address = wx.getStorageSync("address");
    // 2、获取购物车数组
    let cart = wx.getStorageSync("cart") || [];
    cart = cart
      .filter((v) => v.checked)
      .map((v) => {
        v.price = v.price.toFixed(2);
        return v;
      });
    // 3、总价格和总数量
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach((v) => {
      totalPrice += v.price * v.num;
      totalNum += v.num;
    });
    this.setData({
      address,
      cart,
      totalPrice: totalPrice.toFixed(2),
      totalNum,
    });
  },
  // 点击支付
  async handlePay() {
    // console.log('Pay')
    // 1、判断缓存中是否有token
    const token = wx.getStorageSync("token") || "";
    // 过滤出购物车中未选中的商品
    let newCart = wx.getStorageSync("cart").filter((v) => !v.checked);
    if (!token) {
      const res = await showModal({
        content: "您未登录，是否要登录？",
      });
      if (res.confirm) {
        wx.navigateTo({
          url: "../login/index",
        });
      }
      return;
    }
    // 2、创建订单
    // 2.1 准备 请求头参数
    const header = {
      Authorization: "Bearer " + token,
    };
    // 2.2 准备 请求体参数
    const orderPrice = this.data.totalPrice;
    const consigneeAddress = this.data.address.all;
    const { telNumber, userName } = this.data.address;
    const createDate = +new Date();
    const cart = this.data.cart;
    let products = [];
    cart.forEach((v) => {
      products.push({
        productId: v._id,
        productNum: v.num,
        productPrice: v.price,
      });
    });
    // 获取订单的请求体数据
    const orderParams = {
      orderPrice,
      telNumber,
      consigneeAddress,
      userName,
      createDate,
      products,
      newCart,
    };
    // 3.发起请求 获取订单编号 并修改用户在服务端的购物车数据
    const res = await request({
      url: "/orders/create",
      method: "post",
      header,
      data: orderParams,
    });
    const orderNum = res.data;
    // console.log(orderNum);
    // 模态框 模拟支付效果
    const modalRes = await showModal({ content: "是否确定支付？" });
    wx.setStorageSync("cart", newCart);
    if (modalRes.confirm) {
      await request({
        url: "/pay",
        method: "put",
        header,
        data: orderNum,
      });
      // console.log(newCart);
    }
    wx.switchTab({
      url: "/pages/cart/index",
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
});
