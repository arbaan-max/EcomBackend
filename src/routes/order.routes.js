import { Router } from "express";
import auth from "../utils/auth.utils.js";
import {
  createOrder,
  getOrder,
  getUserOrders,
  totalSale,
  updateOrderStatus,
} from "../controllers/order.controllers.js";

const orderRouter = Router();

orderRouter.use(auth);
orderRouter.post("/createOrder", createOrder);
orderRouter.put("/updateOrderStatus", updateOrderStatus);
orderRouter.get("/getOrder", getOrder);
orderRouter.get("/getUserOrders", getUserOrders);
/// Total Sales Of the Store
orderRouter.get("/totalSale", totalSale);

export default orderRouter;
