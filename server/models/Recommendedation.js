const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    recommendedation: [
      {
        // 推荐区块名
        name: { type: String },
        items: [
          {
            productId: { type: mongoose.SchemaTypes.ObjectId, ref: "Product" },
            image: { type: String },
            productName: { type: String },
          },
        ],
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Recommendedation", schema);
