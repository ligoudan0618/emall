module.exports = async (code) => {
  const axios = require("axios");
  const AppID = "wx0f78b753bbbedfbe";
  const AppSecret = "b37bc11f9b4f4bfd7e2f60e47ba982c3";
  let url = `https://api.weixin.qq.com/sns/jscode2session?appid=${AppID}&secret=${AppSecret}&js_code=${code}&grant_type=authorization_code`;
  const { data } = await axios.get(url);
  // console.log(data.openid);
  return data.openid;
};
