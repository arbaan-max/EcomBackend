import asyncHandler from "../utils/async_handler.utils.js";
import { Product } from "../model/products/product.model.js";
import { Category } from "../model/category.model.js";

const createProduct = asyncHandler(async (req, res) => {
  const { name, price, description, image, category, countInStock } = req.body;
  if (!name || !price || !description || !image || !category || !countInStock) {
    res.status(400);
    throw new Error("Please fill all the fields");
  }
  const findCategory = await Category.findById(category);
  if (!findCategory) {
    res.status(400);
    throw new Error("Category not found");
  }
  const existingProduct = await Product.findOne({ name });
  if (existingProduct) {
    res.status(400);
    throw new Error("Product already exists");
  }
  const product = new Product({
    name,
    price,
    description,
    image,
    category,
    countInStock,
  });
  if (!product) {
    return res.status(500).json({ message: "Product not created" });
  }
  await product.save();
  res.status(201).json({
    message: "Product created successfully",
  });
});

const getProducts = asyncHandler(async (req, res) => {
  let { page = 0, limit = 40 } = req.query;
  const skip = page * limit;

  const product = await Product.find()
    .populate("category")
    .skip(skip)
    .limit(parseInt(limit))
    .lean();

  res.status(200).json(product);
});

const getProductsCount = asyncHandler(async (req, res) => {
  const count = await Product.countDocuments();
  if (!count || count === undefined) {
    return res.status(500).json({ message: "Product not found" });
  }
  return res.status(200).json({
    productCount: count,
  });
});

const getFeaturedProduct = asyncHandler(async (req, res) => {
  const products = await Product.find({ isFeatured: false }).populate(
    "category"
  );
  if (!products) {
    return res.status(500).json([]);
  }
  return res.status(200).json(products);
});

export { createProduct, getProducts, getProductsCount, getFeaturedProduct };
