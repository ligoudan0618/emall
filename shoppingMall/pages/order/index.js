import { request } from "../../utils/request";
import regeneratorRuntime from "../../utils/runtime";
// pages/order/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    token: "",
    orders: [],
    // type: 1,
    tabs: [
      {
        id: 0,
        value: "全部",
        isActive: true,
      },
      {
        id: 1,
        value: "待收货",
        isActive: false,
      },
      {
        id: 2,
        value: "待付款",
        isActive: false,
      },
      {
        id: 3,
        value: "已收货",
        isActive: false,
      },
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const token = wx.getStorageSync("token");
    let type = 1;
    const { tabs } = this.data;
    tabs.forEach((item, index) => {
      if (item.isActive) type = index + 1;
    });
    console.log(type);
    if (!token) {
      wx.navigateTo({
        url: "/pages/login/index",
      });
      return;
    }
    this.setData({
      token,
    });
    this.getOrders(type);
  },
  // 获取订单列表的方法
  async getOrders(type) {
    const res = await request({
      url: "/getOrders",
      data: { type },
      header: { Authorization: this.data.token },
    });
    // const { tabs } = this.data;
    // console.log(res);
    this.setData({
      orders: res.data.map((v) => {
        v.createTime = new Date(Number(v.createDate)).toLocaleString();
        return v;
      }),
    });
  },
  // 根据标题索引来激活选中 标题数组
  changeTitleByIndex(index) {
    let { tabs } = this.data;
    tabs.forEach((v, i) => {
      i === index ? (v.isActive = true) : (v.isActive = false);
    });
    this.setData({
      tabs,
    });
  },
  handleTabsItemChange(e) {
    // console.log(e);
    const { index } = e.detail;
    this.changeTitleByIndex(index);
    this.getOrders(index + 1);
  },
});
