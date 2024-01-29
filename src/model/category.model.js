import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    color: {
      type: String,
      trim: true,
    },
  },
  { versionKey: false, timestamps: true }
);

export const Category = mongoose.model("Category", categorySchema);
