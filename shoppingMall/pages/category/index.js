import {
  request
} from "../../utils/request";
import regeneratorRuntime from "../../utils/runtime";
// pages/category/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 左侧菜单数据
    leftMenuList: [],
    // 右侧的商品数据
    rightContent: [],
    // 商品
    products: [],
    // 被点击的左侧的菜单
    currentIndex: 0,
    // 右侧内容滚动条距离顶部距离
    scrollTop: 0,
  },
  // 返回接口数据
  Cates: [],

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCats();
    this.getProducts();
    // this.setData({
    //   rightContent: this.Cates[0],
    // });
  },
  // 获取商品分类
  async getCats() {
    const res = await request({
      url: "/categories",
    });
    const catsChildren = res.data.filter((item) => item.parent);
    let leftMenuList = res.data
      .filter((item) => !item.parent)
      .map((item) => {
        catsChildren.forEach((item2) => {
          if (item.name === item2.parent.name) {
            if (!item.children) {
              item.children = [];
              item.children.push({
                name: item2.name,
              });
            } else {
              item.children.push({
                name: item2.name,
              });
            }
          }
        });
        return item;
      });
    this.setData({
      leftMenuList,
      scrollTop: 0,
    });
    this.Cates = leftMenuList;
  },

  async getProducts() {
    const res = await request({
      url: "/products",
    });
    // console.log(this.Cates);
    this.Cates.map((item) => {
      if (item.children) {
        item.children.map((item2) => {
          res.data.forEach((item3) => {
            if (item2.name === item3.categories.name) {
              if (!item2.products) {
                item2.products = [];
                item2.products.push(item3);
              } else {
                item2.products.push(item3);
              }
            }
          });
          return item2;
        });
      }
      return item;
    });
    this.setData({
      products: res.data,
      rightContent: this.Cates[0],
      scrollTop: 0,
    });
    // console.log(this.Cates);
  },
  // 左侧菜单点击事件
  handleItemTap(e) {
    /* 
      1 获取被点击的标题身上的索引
      2 给data中的currentIndex赋值
      3 根据不同的索引来渲染右侧的商品内容
    */
    // console.log(e.currentTarget.dataset.index);
    const {
      index
    } = e.currentTarget.dataset;
    let rightContent = this.Cates[index];
    // console.log(rightContent);
    this.setData({
      currentIndex: index,
      rightContent,
      scrollTop: 0,
    });
  },
});