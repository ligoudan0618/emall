import { chooseAddress, showModal } from "../../utils/asyncWx";
import { request } from "../../utils/request";
import regeneratorRuntime from "../../utils/runtime";

// pages/cart/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 用户收货地址
    address: {},
    // 购物车数据
    cart: [],
    // 是否全选
    allChecked: false,
    // 总价个
    totalPrice: 0,
    // 商品数量
    totalNum: 0,
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: async function () {
    const address = wx.getStorageSync("address");
    let cart = wx.getStorageSync("cart") || [];
    const token = wx.getStorageSync("token") || "";
    this.setData({
      address,
    });
    if (token) {
      // 获取用户在服务端的购物车数据并和本地数据进行合并去重
      let obj = {};
      const userCart = await this.getCart(token);
      cart = [...cart, ...userCart].reduce((cur, next) => {
        obj[next.name] ? "" : (obj[next.name] = true && cur.push(next));
        return cur;
      }, []);
      this.saveCart(cart, token);
      // console.log(cart, userCart);
    }
    this.setCart(cart);
  },
  // 将购物车数据保存至数据库
  async saveCart(cart, token) {
    await request({
      url: "/saveUserCart",
      method: "post",
      header: {
        Authorization: "Bearer " + token,
      },
      data: {
        productList: cart,
      },
    });
  },
  // 获取用户购物车数据
  async getCart(token) {
    const res = await request({
      url: "/getUserCart",
      header: {
        Authorization: "Bearer " + token,
      },
    });
    return res.data.productList;
  },
  // 获取收货地址
  async handleChooseAddress() {
    // 判断用户是否登录
    const token = wx.getStorageSync("token") || "";
    if (!token) {
      const res = await showModal({
        content: "您未登录，是否要登录？",
      });
      if (res.confirm) {
        wx.navigateTo({
          url: "/pages/login/index",
        });
      }
      return;
    }
    // 获取收货地址
    const address = await chooseAddress();
    console.log(address);
    // 存到本地存储中
    wx.setStorageSync("address", address);
    wx.showToast({
      title: "获取成功",
      icon: "success",
      mask: true,
    });
  },
  // 设置购物车状态同时 重新计算 底部工具栏的数据 全选 总价格 购买数量
  setCart(cart) {
    let allChecked = true;
    // 1、总价格和总数量
    let totalPrice = 0;
    let totalNum = 0;

    cart.forEach((v) => {
      if (v.checked) {
        totalPrice += v.price * v.num;
        totalNum += v.num;
      } else {
        allChecked = false;
      }
    });

    // 判断数组是否为空
    allChecked = cart.length ? allChecked : false;

    this.setData({
      totalPrice: totalPrice.toFixed(2),
      totalNum,
      cart,
      allChecked,
    });
    wx.setStorageSync("cart", cart);
  },
  // 商品选中
  handleItemChange(e) {
    // console.log(e);
    // 获取被修改的商品 id
    const productId = e.currentTarget.dataset.id;
    // 获取购物车数组
    const { cart } = this.data;
    // 找到该商品在购物车数组中的索引
    const index = cart.findIndex((v) => v._id === productId);
    // 对相应 checked 进行取反
    cart[index].checked = !cart[index].checked;
    this.setCart(cart);
  },
  // 商品的全选
  handleItemAllCheck() {
    let { cart, allChecked } = this.data;
    allChecked = !allChecked;
    console.log(allChecked);
    cart.forEach((v) => (v.checked = allChecked));
    this.setCart(cart);
  },
  // 商品数量编辑
  async handleItemNumEdit(e) {
    const { id, operation } = e.currentTarget.dataset;
    // console.log(e);
    let { cart } = this.data;
    const index = cart.findIndex((v) => v._id === id);
    // console.log(index);
    // 判断 自定义属性 operation 的值 是-1 还是 1  -1为该商品数量减一
    if (cart[index].num === 1 && operation === -1) {
      const res = await showModal({
        content: "您是否要该商品移除购物车?",
      });

      if (res.confirm) {
        cart;
        cart.splice(index, 1);
      }
    } else {
      cart[index].num += operation;
    }

    this.setCart(cart);
  },
  // 预支付
  handleReadyPay() {
    const address = wx.getStorageSync("address");
    const { cart } = this.data;
    let isChecked = cart.some((v) => v.checked);
    // console.log(isChecked)
    if (!address) {
      wx.showToast({
        title: "请先获取收货地址",
        icon: "error",
      });
    } else if (cart.length === 0) {
      wx.showToast({
        title: "请先添加商品",
        icon: "error",
      });
    } else if (!isChecked) {
      wx.showToast({
        title: "请先选择商品",
        icon: "error",
      });
    } else {
      wx.navigateTo({
        url: "/pages/pay/index",
      });
    }
  },
});
