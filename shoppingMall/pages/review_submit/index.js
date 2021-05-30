import { request } from "../../utils/request";
import regeneratorRuntime from "../../utils/runtime";
// pages/review_submit/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 上传图片后的 url 连接
    files: [],
    product: {},
    productId: "",
    // 是评论还是追评
    isReview: false,
    // 评论的 id
    reviewId: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      selectFile: this.selectFile.bind(this),
      uplaodFile: this.uplaodFile.bind(this),
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 登录检测
    const token = wx.getStorageSync("token") || "";
    if (!token) {
      wx.navigateTo({
        url: "pages/login/index",
      });
    }
    let Pages = getCurrentPages();
    const currenPage = Pages[Pages.length - 1];
    console.log(currenPage);
    const { productId, orderNum, isReview, reviewId } = currenPage.options;
    this.getProduct(productId, orderNum, isReview, reviewId);
  },
  // 获取根据id获取商品
  async getProduct(productId, orderNum, isReview, reviewId) {
    const res = await request({
      url: `/product/${productId}`,
    });
    // console.log(res.data);
    this.setData({
      product: res.data,
      productId,
      orderNum,
      isReview,
      reviewId,
    });
  },
  // 提交评论
  async reviewForm(e) {
    const { reviewValue } = e.detail.value;
    console.log(reviewValue);
    // 内容是否有效
    if (!reviewValue.trim()) {
      wx.showToast({
        title: "请输入有效内容",
        icon: "error",
        duration: 1500,
        mask: true,
      });
    } else {
      // 内容有效
      const { nickName, avatarUrl } = wx.getStorageSync("userinfo");
      const token = wx.getStorageSync("token");
      const {
        files: images, // 重命名为 images
        productId,
        orderNum,
        reviewId,
        isReview,
      } = this.data;
      // 判断是评论还是追评
      if (!isReview) {
        const res = await request({
          url: "/submitReview",
          method: "post",
          header: {
            Authorization: "Bearer " + token,
          },
          data: {
            description: reviewValue,
            nickName,
            avatarUrl,
            images,
            product: productId,
            orderNum,
          },
        });
      } else {
        await request({
          url: "/addReview",
          method: "put",
          header: {
            Authorization: "Bearer " + token,
          },
          data: {
            addReview: reviewValue,
            reviewId,
          },
        });
      }
      wx.navigateBack({
        delta: 1,
      });
    }
  },
  chooseImage: function (e) {
    console.log(e);
    var that = this;
    wx.chooseImage({
      sizeType: ["original", "compressed"], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ["album", "camera"], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          files: that.data.files.concat(res.tempFilePaths),
        });
      },
    });
  },
  previewImage: function (e) {
    console.log(e);
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.files, // 需要预览的图片http链接列表
    });
  },
  selectFile(files) {
    console.log("files", files);
    // 返回false可以阻止某次文件上传
  },
  // 上传图片
  uplaodFile(files) {
    console.log("upload files", files);
    const token = wx.getStorageSync("token");
    const tempFilePaths = files.tempFilePaths; // 图片上传临时路径
    // console.log(tempFilePaths[0]);
    // 文件上传的函数，返回一个promise
    return new Promise((resolve, reject) => {
      wx.uploadFile({
        url: "http://localhost:3000/web/api/upload",
        filePath: tempFilePaths[0],
        name: "file",
        header: {
          "content-type": "multipart/form-data",
          Authorization: "Bearer " + token,
        },
        success: (res) => {
          // res.data 是后端返回的相关数据
          // console.log(res.data);
          const data = JSON.parse(res.data);
          // console.log(data);
          let urls = [data.url];
          console.log(urls);
          // 格式： {urls: ["后端返回的图片地址"]}
          resolve({
            urls: urls,
          });
        },
        fial: () => {
          reject("error");
        },
      });
    });
  },
  deleteFile(e) {
    console.log(e);
    let { files } = this.data;
    files.splice(e.detail.index, 1);
    this.setData({
      files,
    });
  },
  uploadError(e) {
    console.log("upload error", e.detail);
  },
  // 上传图片成功
  uploadSuccess(e) {
    console.log("upload success", e.detail.urls);
    let { files } = this.data;
    files.push({
      url: e.detail.urls[0],
    });
    console.log(files);
    this.setData({
      files,
    });
  },
});
