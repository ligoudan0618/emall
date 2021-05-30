import { request } from "../../utils/request";
import regeneratorRuntime from "../../utils/runtime";
// pages/review_list/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    reviewsList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const token = wx.getStorageSync("token");
    if (!token) {
      wx.navigateTo({
        url: "/pages/login/index",
      });
    } else {
      this.getReviewList();
    }
  },

  async getReviewList() {
    const token = wx.getStorageSync("token");
    const res = await request({
      url: "/userReviews",
      header: {
        Authorization: "Bearer " + token,
      },
    });
    this.setData({
      reviewsList: res.data,
    });
  },
  showReview(e) {
    wx.showModal({
      title: "我的评论",
      content: e.currentTarget.dataset.review,
    });
  },
});
