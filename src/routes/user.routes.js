import { Router } from "express";
import {
  createUser,
  getAllUsers,
  loginUser,
  updateUser,
} from "../controllers/user.controllers.js";

const userRouter = Router();

userRouter.post("/createuser", createUser);
userRouter.post("/loginUser", loginUser);
userRouter.put("/updateUser", updateUser);
userRouter.get("/getAllUsers", getAllUsers);

export default userRouter;
