import bcrypt from "bcrypt";
import asyncHandler from "../utils/async_handler.utils.js";
import { User } from "../model/user/user.model.js";
import jwt from "jsonwebtoken";

const createUser = asyncHandler(async (req, res) => {
  const { username, password, isAdmin, phone } = req.body;
  const salt = await bcrypt.genSalt(10);
  if (!username || !password || !phone) {
    return res.status(400).json({
      message: "Missing required fields",
    });
  }
  const existingUser = await User.findOne({ phone });
  if (existingUser) {
    return res.status(400).json({
      message: "User already exists",
    });
  }
  const hashedPassword = await bcrypt.hash(password, salt);
  const user = new User({
    username,
    password: hashedPassword,
    isAdmin,
    phone,
  });
  await user.save();
  res.status(201).json(user);
});

const loginUser = asyncHandler(async (req, res) => {
  const { phone, password } = req.body;
  if (!phone || !password) {
    return res.status(400).json({
      message: "Missing required fields",
    });
  }
  const user = await User.findOne({ phone });
  if (!user) {
    return res.status(400).json({
      message: "User Not Found",
    });
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({
      message: "Invalid phone number or password",
    });
  }
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
  const userWithToken = {
    id: user._id,
    username: user.username,
    phone: user.phone,
    isAdmin: user.isAdmin,
    token: token,
  };
  return res.status(200).json(userWithToken);
});

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find();
  if (!users) {
    return res.status(400).json([]);
  }
  return res.status(200).json(users);
});

const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.body;
  if (!id)
    return res.status(400).json({
      message: "Id is Required",
    });
  const user = await User.findById(id);
  if (!user)
    return res.status(400).json({
      message: "User Not Found",
    });
  const updateUser = await User.findByIdAndUpdate(id, {
    $set: req.body,
  });
  if (!updateUser)
    return res.status(400).json({
      message: "User Not Found",
    });
  res.status(200).json({ message: "user Updated Successfully" });
});

export { createUser, loginUser, getAllUsers, updateUser };
