import { request } from "../../utils/request";
import regeneratorRuntime from "../../utils/runtime"; // pages/change_password/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    error: "",
    changeMethod: "oldPassWord",
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
    const token = wx.getStorageSync("token") || "";
    if (!token) {
      wx.navigateTo({
        url: "/pages/login/index",
      });
    }
  },
  async changePassWordForm(e) {
    console.log(e);
    const { oldPassword, newPassword1, newPassword2 } = e.detail.value;
    if (!oldPassword) {
      this.setData({
        error: "请先输入旧密码",
      });
      return;
    } else if (newPassword1 !== newPassword2) {
      this.setData({
        error: "两次密码输入不一致",
      });
      return;
    } else {
      const token = wx.getStorageSync("token") || "";
      const { changeMethod } = this.data;
      console.log(changeMethod);
      const res = await request({
        url: "/changePassWord",
        method: "post",
        header: {
          Authorization: "Bearer " + token,
        },
        data: {
          oldPassword,
          newPassword1,
          changeMethod,
        },
      });
      if (res.statusCode === 200) {
        wx.showToast({
          title: "修改密码成功",
          icon: "success",
          duration: 1500,
          mask: true,
          complete: () => {
            wx.navigateBack({
              delta: 1,
            });
          },
        });
      } else {
        this.setData({
          error: res.data.message,
        });
      }
    }
  },

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
