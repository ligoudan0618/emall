let ajaxTiem = 0;
export const request = (params) => {

  ajaxTiem++
  // 显示加载中效果
  wx.showLoading({
    title: '加载中',
    mask: true
  })

  const baseURL = "http://localhost:3000/web/api";
  return new Promise((resolve, reject) => {
    wx.request({
      ...params,
      url: baseURL + params.url,
      success: (result) => {
        resolve(result)
      },
      fail: (err) => {
        reject(err)
      },
      complete: () => {
        ajaxTiem--;
        if (ajaxTiem === 0) {
          // 关闭正在的等待图标
          wx.hideLoading()
        }
      }
    })

  })
};