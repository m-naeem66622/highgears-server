const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    images: { type: [String], required: true },
    name: { type: String, trim: true, required: true, index: true },
    description: { type: String, trim: true, required: true },
    sku: { type: String, trim: true, required: true },
    selling_price: { type: Number, required: true },
    original_price: { type: Number, required: true },
    brand: { type: String, trim: true, required: true },
    available_colors: {
      type: [{ type: String, uppercase: true }],
      required: true,
    },
    available_sizes: {
      type: [{ type: String, uppercase: true }],
      required: true,
    },
    shipping_price: { type: Number, required: true },
    avg_rating: { type: Number, default: 0 },
    reviews_count: { type: Number, default: 0 },
    in_stock: { type: Boolean, default: false },
    admin: { type: mongoose.ObjectId, ref: "User", required: true },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
