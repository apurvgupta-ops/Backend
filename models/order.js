const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const productInCartSchema = new mongoose.Schema({
  product: {
    type: ObjectId,
    ref: "Product",
  },
  name: String,
  count: Number,
  price: Number,
});

const ProductCart = mongoose.model("ProductCart", productInCartSchema);

const orderSchema = new mongoose.Schema(
  {
    products: [productInCartSchema],
    transaction_id: {},
    address: String,
    amount: Number,
    address: String,
    status: {
      type: String,
      default: "Recieved",
      enum: ["Received", "Pending", "Shipped", "Cencelled"],
    },
    update: Date,
    user: {
      type: ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);
const Order = mongoose.model("Order", orderSchema);

module.exports = { Order, ProductCart };
