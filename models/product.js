const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxlength: 32,
      trim: true,
      unique: true,
    },
    description: { type: String, required: true, maxlength: 32, trim: true },
    price: { type: Number, required: true, maxlength: 32, trim: true },
    category: { type: ObjectId, ref: "Category", required: true },
    photo: { data: Buffer, contentType: String },
    stock: { type: Number },
    sold: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);