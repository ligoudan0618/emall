import {
  showModal
} from './utils/asyncWx'
import regeneratorRuntime from "./utils/runtime";
import {
  request
} from "./utils/request";

// app.js
App({
  onShow() {
    // this.getUserInfo()
  },
  // 获取用户信息
  async getUserInfo() {
    const userinfo = wx.getStorageSync('userinfo')
    if (!userinfo) {
      const {
        confirm
      } = await showModal({
        content: '您没有登陆，是否要登陆？'
      })
      if (confirm) {
        wx.navigateTo({
          url: '/pages/login/index',
        })
      }
      // console.log(confirm)
    }
  },
  onLaunch() {
    // 展示本地存储能力
    // const logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)

    // 登录
    // wx.login({
    //   success: async (res) => {
    //     console.log(res);
    //     // 发送 res.code 到后台换取 openId, sessionKey, unionId
    //     const {
    //       data
    //     } = await request({
    //       url: '/login',
    //       method: 'post',
    //       data: {
    //         code: res.code
    //       }
    //     })
    //     console.log(data.token);
    //     wx.setStorageSync('token', 'Bearer ' + data.token)
    //   }
    // })
  },
  globalData: {
    userInfo: null
  }
})