import { Router } from "express";
import {
  categoryController,
  deletecategory,
  getAllCategory,
  updatecategory,
} from "../controllers/category.controller.js";
import auth from "../utils/auth.utils.js";

const categoryRouter = Router();

categoryRouter.get("/getAllCategory", auth, getAllCategory);
categoryRouter.post("/createCategory", auth, categoryController);
categoryRouter.put("/updateCategory", auth, updatecategory);
categoryRouter.delete("/deleteCategory", auth, deletecategory);

export default categoryRouter;
