import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    countInStock: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
      max: 255,
    },
    rating: { type: Number, default: 0, max: 5, min: 0 },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    isFeatured: { type: Boolean, default: false },
  },
  { versionKey: false, timestamps: true }
);

export const Product = mongoose.model("Product", productSchema);
