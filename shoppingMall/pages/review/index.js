import { request } from "../../utils/request";
import regeneratorRuntime from "../../utils/runtime";
import dayjs from "dayjs";
// pages/review/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    product: {},
    // 商品评论列表
    reviews: [],
    reviewsLen: 0,
  },
  onShow: function () {
    let pages = getCurrentPages();
    let currentPage = pages[pages.length - 1];
    let { productId } = currentPage.options;
    this.getReviews(productId);
    this.getProduct(productId);
  },
  // 获取评论
  async getReviews(productId) {
    console.log(productId);
    const res = await request({
      url: "/reviews",
    });
    let reviews = res.data
      .filter((v) => v.product._id === productId)
      .map((v) => {
        v.updatedAt = dayjs(v.updatedAt).format("YYYY/MM/DD");
        return v;
      });
    this.setData({
      reviews,
      reviewsLen: reviews.length,
    });
  },
  // 获取该商品
  async getProduct(productId) {
    const res = await request({
      url: `/product/${productId}`,
    });
    this.setData({
      product: res.data,
    });
  },
  handlePreviewImage(e) {
    const urls = e.currentTarget.dataset.images.map((v) => v.url);
    const current = e.currentTarget.dataset.url;
    console.log(urls, current);
    wx.previewImage({
      current,
      urls,
    });
  },
});
