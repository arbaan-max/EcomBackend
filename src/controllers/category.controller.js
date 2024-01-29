import { Category } from "../model/category.model.js";
import asyncHandler from "../utils/async_handler.utils.js";

const getAllCategory = asyncHandler(async (req, res) => {
  const category = await Category.find({});
  res.send(category);
});

const categoryController = asyncHandler(async (req, res) => {
  const { name, color } = req.body;
  if (!name || !color)
    return res.status(400).json({ message: "Category cannot be created" });
  const existingCategory = await Category.findOne({ name });
  if (existingCategory)
    return res.status(400).json({ message: "Category already exists" });
  const category = new Category({ name, color });
  await category.save();
  res.send(category);
});

const updatecategory = asyncHandler(async (req, res) => {
  const { id, name, color } = req.body;
  if (!id) return res.status(400).json({ message: "Enter the ID" });
  const category = await Category.findByIdAndUpdate(id, { name, color });
  if (!category)
    return res.status(400).json({ message: "Category does not exist" });
    res.status(200).json({ message: "Updated Successfully" });
});

const deletecategory = asyncHandler(async (req, res) => {
  const { id } = req.body;
  if (!id) return res.status(400).json({ message: "Enter the ID" });
  const category = await Category.findByIdAndDelete(id);
  if (!category)
    return res.status(400).json({ message: "Category does not exist" });
  res.status(200).json({ message: "Delete Successfully" });
});

export { categoryController, deletecategory, getAllCategory, updatecategory };
