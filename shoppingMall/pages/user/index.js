import { request } from "../../utils/request";
import regeneratorRuntime from "../../utils/runtime";
import { login, showModal } from "../../utils/asyncWx.js";
// pages/user/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userinfo: {},
    token: "",
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const token = wx.getStorageSync("token") || "";

    const userinfo = wx.getStorageSync("userinfo");
    this.setData({
      userinfo,
      token,
    });
  },

  async handletap() {
    await showModal({
      content: "Hello World!",
    });
  },
  handleOpenSetting() {
    wx.openSetting({
      success(res) {
        console.log(res.authSetting);
        res.authSetting = {
          "scope.userInfo": true,
          "scope.userLocation": true,
        };
      },
    });
  },
  // 注销
  async handleLogout() {
    const res = await showModal({
      content: "您确定要退出登陆吗?",
    });
    if (res.confirm) {
      wx.clearStorageSync();
      wx.switchTab({
        url: "/pages/index/index",
      });
    }
  },
});
