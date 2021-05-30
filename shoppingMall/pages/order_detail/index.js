import { request } from "../../utils/request";
import { showModal, chooseAddress } from "../../utils/asyncWx";
import regeneratorRuntime from "../../utils/runtime";
// pages/order_detail/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    orderNum: "",
    orderDetail: [],
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
    let Pages = getCurrentPages();
    let currentPage = Pages[Pages.length - 1];
    const { orderNum } = currentPage.options;
    this.getOrder(orderNum);
  },

  async getOrder(orderNum) {
    const res = await request({
      url: "/getOrderDetail",
      data: {
        orderNum,
      },
    });
    console.log(res);
    this.setData({
      orderDetail: res.data.map((v) => {
        v.createTime = new Date(Number(v.createDate)).toLocaleString();
        return v;
      }),
      orderNum: res.data[0].orderNum,
    });
  },
  // 取消订单
  async handleCancelOrder() {
    const resConfirm = await showModal({
      content: "您确定要取消吗？",
    });
    if (resConfirm.confirm) {
      const { orderNum } = this.data;
      const res = await request({
        url: "/deleteOrder",
        method: "delete",
        data: {
          orderNum,
        },
      });
      console.log(res);
      wx.navigateBack({
        delta: 1,
      });
    }
  },
  // 付款
  async handlePay() {
    const resConfirm = await showModal({
      content: "您确定要付款吗？",
    });
    if (resConfirm.confirm) {
      const { orderNum } = this.data;
      const res = await request({
        url: "/pay",
        method: "put",
        data: {
          orderNum,
        },
      });
      wx.navigateBack({
        delta: 1,
      });
    }
  },
  // 确认收货
  async handleDelivered() {
    const resConfirm = await showModal({
      content: "您确定要收货吗？",
    });
    if (resConfirm.confirm) {
      const { orderNum } = this.data;
      const res = await request({
        url: "/confirmReceipt",
        method: "put",
        data: {
          orderNum,
        },
      });
      wx.navigateBack({
        delta: 1,
      });
    }
  },
  // 修改收货地址
  async handleChangeAddress() {
    const res = await chooseAddress();
    const { orderNum } = this.data;
    console.log(res);
    await request({
      url: "/changeAddress",
      method: "put",
      data: {
        consigneeAddress: res.all,
        orderNum,
      },
    });
    wx.showToast({
      title: "修改地址成功",
      icon: "success",
      duration: 1500,
      mask: true,
    });
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
