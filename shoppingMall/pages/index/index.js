import { request } from "../../utils/request";
import regeneratorRuntime from "../../utils/runtime";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 轮播图数组
    swiperList: [],
    products: [],
    recommendedation: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function () {
    this.getSwiperList();
    this.getProducts();
    this.getRecommendedation();
  },
  // 获取轮播图列表
  async getSwiperList() {
    const res = await request({
      url: "/swipers",
    });
    // console.log(res);
    this.setData({
      swiperList: res.data[0].items,
    });
  },
  // 获取商品列表
  async getProducts() {
    const res = await request({
      url: "/products",
    });

    this.setData({
      products: res.data,
    });
  },
  // 获取推荐
  async getRecommendedation() {
    const res = await request({ url: "/recommendedation" });
    console.log(res);
    this.setData({
      recommendedation: res.data[0].recommendedation,
    });
  },
  // 添加商品
  async addProduct(e) {
    const { id } = e.currentTarget.dataset;
    const currentProduct = this.data.products.filter((v) => v._id === id)[0];
    // console.log(currentProduct);
    const cart = wx.getStorageSync("cart") || [];
    // console.log(cart, id);
    const index = cart.findIndex((v) => v._id === id);
    if (index === -1) {
      // 商品不存在第一次添加
      currentProduct.num = 1;
      currentProduct.checked = true;
      cart.push(currentProduct);
    } else {
      cart[index].num++;
    }
    console.log(cart);
    wx.setStorageSync("cart", cart);

    wx.showToast({
      title: "添加成功",
      icon: "success",
      mask: false,
    });
  },
});
