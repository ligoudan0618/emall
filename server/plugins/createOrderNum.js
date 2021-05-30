module.exports = (date) => {
  const dayjs = require("dayjs");

  let dateNum = dayjs(date).format("YYYYMMDDhhmmss");
  let randomNum = "";
  for (let i = 0; i < 6; i++) {
    randomNum += Math.floor(Math.random() * 10);
  }

  let orderCode = dateNum + randomNum;

  return orderCode;
};
