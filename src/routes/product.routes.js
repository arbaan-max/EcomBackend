import { Router } from "express";
import {
  createProduct,
  getFeaturedProduct,
  getProducts,
  getProductsCount,
} from "../controllers/product.controllers.js";
import auth from "../utils/auth.utils.js";

const productRouter = Router();
productRouter.use(auth);
productRouter.post("/createProduct", createProduct);
productRouter.get("/getProducts", getProducts);
productRouter.get("/getProductsCount", getProductsCount);
productRouter.get("/getFeaturedProduct", getFeaturedProduct);

export default productRouter;
