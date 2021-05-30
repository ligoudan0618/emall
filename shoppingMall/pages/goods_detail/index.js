import { request } from "../../utils/request";
import regeneratorRuntime from "../../utils/runtime";
// pages/goods_detail/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    product: {},
  },
  ProductInfo: [],
  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function () {
    let page = getCurrentPages();
    let currentPage = page[page.length - 1];
    let { productId } = currentPage.options;
    // console.log(currentPage);
    console.log(productId);
    this.getProductById(productId);
  },

  async getProductById(id) {
    const res = await request({
      url: `/product/${id}`,
    });
    // 给detail里的图片加上样式
    if (res.data.detail) {
      res.data.detail = res.data.detail
        .replace(/\<img/gi, '<img style="width:100%;height:auto;"')
        .replace(/\<p>/gi, '<p class="p_class">');
    }
    this.setData({
      product: res.data,
    });
    this.ProductInfo = res.data;
  },
  // 点击图片 放大预览
  handlePreviewImage(e) {
    // console.log("放大了图片啦");
    // 1.先构造要预览的图片数组
    const urls = [this.ProductInfo.image];
    // 2.接收传递过来的图片url
    const current = e.currentTarget.dataset.url;
    // console.log(current);
    // console.log(this.ProductInfo);
    wx.previewImage({
      current,
      urls,
    });
  },
  // 点击 加入购物车
  handleCartAdd() {
    // 1 获取缓存中的购物车数据 数组
    let cart = wx.getStorageSync("cart") || [];
    // console.log(cart);
    // 2 判断 当前商品是否存在与 购物车
    let index = cart.findIndex((v) => v._id === this.ProductInfo._id);
    // console.log(this.ProductInfo);
    // console.log(index);
    if (index === -1) {
      // 商品不存在 第一次添加
      this.ProductInfo.num = 1;
      this.ProductInfo.checked = true;
      cart.push(this.ProductInfo);
    } else {
      cart[index].num++;
    }
    console.log(cart);

    wx.setStorageSync("cart", cart);
    wx.showToast({
      title: "加入成功",
      icon: "success",
      duration: 1500,
      mask: true,
    });
  },
});
