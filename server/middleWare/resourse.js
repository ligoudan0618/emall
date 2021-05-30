module.exports = (option) => {
  return async (req, res, next) => {
    const modelName = require("inflection").classify(req.params.resourse);
    req.Model = require(`../models/${modelName}`);
    next();
  };
};
