const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    brand: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: ["Skincare", "Makeup", "Haircare", "Fragrance", "Bath & Body"],
    },
    description: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 },
    image: { type: String, default: "" },
    stock: { type: Number, required: true, min: 0, default: 0 },
    rating: { type: Number, min: 0, max: 5, default: 4 },
  },
  { timestamps: true }
);

productSchema.index({ name: "text", brand: "text", description: "text" });

module.exports = mongoose.model("Product", productSchema);
