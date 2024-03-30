const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        size: { type: String, required: true, uppercase: true },
        color: { type: String, required: true, uppercase: true },
      },
    ],
    itemsPrice: { type: Number, required: true },
    shippingPrice: { type: Number, required: true },
    discountedPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    paymentMethod: { type: String, required: true },
    orderStatus: {
      type: String,
      enum: ["PENDING", "PROCESSING", "SHIPPED", "COMPLETED", "CANCELLED"],
      default: "PENDING",
    },
  },
  {
    timestamps: { createdAt: "placedAt" },
  }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
