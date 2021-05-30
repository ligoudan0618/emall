import { getUserProfile, login, showModal } from "../../utils/asyncWx";
import { request } from "../../utils/request";
import regeneratorRuntime from "../../utils/runtime";
// pages/login/index.js
Page({
  data: {
    // toptips的提示消息
    error: "",
    // 判断是登录还是注册
    isLogin: true,
    // 是否通过校验
    isCheckFail: true,
    // 注册表单数据
    formData: {},
    // 注册表单校验规则
    rules: [
      {
        name: "userName",
        rules: { required: true, message: "用户名必填" },
      },
      {
        name: "password",
        rules: { required: true, message: "密码必填" },
      },
      {
        name: "password2",
        rules: [
          { required: true, message: "密码必填" },
          { equalTo: "password", message: "两次密码输入不匹配" },
        ],
      },
      {
        name: "mobile",
        rules: [
          { required: true, message: "手机号码必填" },
          { mobile: true, message: "手机号码格式不对" },
        ],
      },
      {
        name: "email",
        rules: [
          { required: true, message: "邮箱必填" },
          { email: true, message: "邮箱格式不对" },
        ],
      },
    ],
    // 登录表单
    loginRules: [
      {
        name: "userName",
        rules: { required: true, message: "用户名必填" },
      },
      {
        name: "password",
        rules: { required: true, message: "密码必填" },
      },
    ],
  },
  // 用户登录的方法 账号 密码
  async toLogin() {
    // 先校验表单是否填写正确
    this.selectComponent("#loginForm").validate(async (valid, errors) => {
      console.log("valid", valid, errors);
      if (!valid) {
        const firstError = Object.keys(errors);
        console.log(firstError);
        if (firstError.length) {
          this.setData({
            error: errors[firstError[0]].message, // 提示信息
          });
        }
      } else {
        const { formData } = this.data;
        const res = await request({
          url: "/userLogin",
          method: "post",
          data: formData,
        });
        console.log(res);
        // 返回状态码不等200 则用户不存在
        if (res.statusCode !== 200) {
          this.setData({
            error: res.data.message,
          });
        } else {
          // 将用户信息和token 存到本地存储中
          wx.setStorageSync("userinfo", res.data.user);
          wx.setStorageSync("token", res.data.token);
          this.getAuthorize();
          wx.navigateBack({
            delta: 1,
          });
        }
      }
    });
  },
  // 微信登录
  async loginByWeChat() {
    // 获取用户信息
    const res = await getUserProfile();
    // console.log(res);
    // 获取用户登录时的临时 code 到后台换取 openId, sessionKey, unionId 后台返回token
    const { code } = await login();
    const { data } = await request({
      url: "/weChatLogin",
      method: "post",
      data: {
        code,
        nickName: res.userInfo.nickName,
        avatarUrl: res.userInfo.avatarUrl,
      },
    });
    wx.setStorageSync("token", data.token);
    wx.setStorageSync("userinfo", data.user);
    this.getAuthorize();
    wx.navigateBack({
      delta: 1,
    });
  },
  // 表单内容改变就会触发
  formInputChange(e) {
    const { field } = e.currentTarget.dataset;
    this.setData({
      [`formData.${field}`]: e.detail.value,
    });
  },
  // 校验注册表单
  checkRegisterForm() {
    // 注册表单验证
    this.selectComponent("#registerForm").validate(async (valid, errors) => {
      console.log("valid", valid, errors);
      if (!valid) {
        const firstError = Object.keys(errors);
        console.log(firstError);
        if (firstError.length) {
          this.setData({
            error: errors[firstError[0]].message,
          });
        }
      } else {
        // 检查用户是否存在
        const res = await request({
          url: "/getUser",
          method: "post",
          data: this.data.formData,
        });
        if (res.statusCode === 422) {
          wx.showToast({
            title: "校验通过",
            complete: () => {
              this.setData({
                isCheckFail: false,
              });
            },
          });
        } else {
          this.setData({
            error: "用户已存在",
          });
        }
      }
    });
  },
  // 点击注册
  async submitRegisterForm() {
    const resConfirm = await showModal({
      content: "注册需要绑定微信账号，是否继续？",
    });
    if (resConfirm.confirm) {
      const { formData } = this.data;
      const { userInfo } = await getUserProfile();
      // console.log(userInfo);
      // 获取用户登录时的临时 code 到后台换取 openId, sessionKey, unionId 后台返回token
      const { code } = await login();
      // console.log(code);
      // 发起请求注册;
      const res = await request({
        url: "/userRegister",
        method: "post",
        data: {
          code,
          formData,
          userInfo,
        },
      });
      // 判断是否注册成功
      if (res.statusCode !== 200) {
        this.setData({
          error: res.data.message,
        });
      } else {
        // 注册成功
        wx.showToast({
          title: res.data.message,
          icon: "success",
          mask: true,
        });
        // 显示登录模块
        this.setData({
          isLogin: true,
        });
      }
    }
  },
  // 已有账号去登陆
  toLoginPage() {
    this.setData({
      isLogin: true,
      formData: {},
    });
  },
  // 去注册
  toRegister() {
    this.setData({
      isLogin: false,
      formData: {},
    });
  },

  // 获取用户权限
  getAuthorize() {
    wx.authorize({
      scope: "scope.userLocation",
    });
    wx.authorize({
      scope: "scope.camera",
    });
    wx.authorize({
      scope: "scope.record",
    });
  },
});
