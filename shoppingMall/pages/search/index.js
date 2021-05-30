import { request } from "../../utils/request";
import regeneratorRuntime from "../../utils/runtime";
// pages/search/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    inputShowed: false,
    inputVal: "",
    search: [],
    error: "",
  },
  // 定时器名字
  Timer: null,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      search: this.search.bind(this),
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},
  // value 为搜索框的值
  search: function (value) {
    // 先清除定时器
    clearTimeout(this.Timer);
    return new Promise((resolve, reject) => {
      this.Timer = setTimeout(async () => {
        if (value.trim()) {
          const res = await request({
            url: "/searchProducts",
            method: "post",
            data: {
              value: value.trim(),
            },
          });
          // 构造处理的结果 [{ text: xxx, value: xxx }]
          let products = res.data.map((v) => {
            v = {
              text: v.name + `(${v.description})`,
              value: v._id,
            };
            return v;
          });

          resolve(products);
        } else {
          wx.showToast({
            title: "请输入合法的内容",
            icon: "error",
            duration: 1500,
            mask: true,
          });
        }
      }, 1000);
    });
  },
  selectResult: function (e) {
    // console.log(e);
    const productId = e.detail.item.value;
    console.log(productId);
    wx.navigateTo({
      url: `/pages/goods_detail/index?productId=${productId}`,
    });
  },
});
