// Promise 形式的 chooseAddress
export const chooseAddress = () => {
  return new Promise((resolve, reject) => {
    wx.chooseAddress({
      success: (result) => {
        result.all =
          result.provinceName +
          result.cityName +
          result.countyName +
          result.detailInfo;
        resolve(result);
      },
      fail: (err) => {
        reject(err);
      },
    });
  });
};

// Promise 形式的 showModal
export const showModal = ({ content }) => {
  return new Promise((resolve, reject) => {
    wx.showModal({
      title: "提示",
      content: content,
      success: (result) => {
        resolve(result);
      },
      fail: (err) => {
        reject(err);
      },
    });
  });
};

// Promise 形式的 showToast
// export const showToast = ({title}) => {
//   return new Promise((resolve, reject) => {
//     wx.showToast({
//       title: title,
//     })
//   })
// }

// Promise 形式的 login
export const login = () => {
  return new Promise((resolve, reject) => {
    wx.login({
      timeout: 10000,
      success: (result) => {
        resolve(result);
      },
      fail: (err) => {
        reject(err);
      },
    });
  });
};

// Promise 形式 getUserProfile
export const getUserProfile = () => {
  return new Promise((resolve, reject) => {
    wx.getUserProfile({
      desc: "展示用户信息",
      success: (res) => {
        resolve(res);
      },
    });
  });
};

// Promise 形式 authorize
// export const authorize = ({
//   scope
// }) => {
//   return new Promise((resolve, reject) => {
//     wx.authorize({
//       scope: scope,
//       success: (res) => {
//         resolve(res)
//       },
//       fail: (res) => {
//         reject(res)
//       },
//     })
//   })
// }
