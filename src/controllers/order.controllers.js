import asyncHandler from "../utils/async_handler.utils.js";
import { Order } from "../model/order/order.model.js";
import { OrderItems } from "../model/order/order_items.model.js";

const createOrder = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, status, user } = req.body;
  if (orderItems && orderItems.length === 0) {
    res.status(400).json({ message: "No order items" });
  }
  const orderItemIds = Promise.all(
    orderItems.map(async (item) => {
      let newOrderItem = new OrderItems({
        quantity: item.quantity,
        product: item.product,
      });

      newOrderItem = await newOrderItem.save();
      return newOrderItem._id;
    })
  );
  const orderItemsIdsResolved = await orderItemIds;
  const totalPrices = await Promise.all(
    orderItemsIdsResolved.map(async (orderItem) => {
      const orderIt = await OrderItems.findById(orderItem).populate(
        "product",
        "price"
      );
      const totalPrice = orderIt.product.price * orderIt.quantity;
      return totalPrice;
    })
  );
  const totalPrice = totalPrices.reduce((a, b) => a + b, 0);
  const order = new Order({
    orderItems: orderItemsIdsResolved,
    shippingAddress,
    status,
    totalPrice,
    user,
  });
  const createdOrder = await order.save();
  if (!createdOrder) {
    return res.status(400).json({ message: "Order not created" });
  }
  res.status(201).json(createdOrder);
});

const getOrder = asyncHandler(async (req, res) => {
  const orders = await Order.find()
    .populate("user")
    .populate({
      path: "orderItems",
      populate: { path: "product", populate: "category" },
    })
    .sort({ createdAt: -1 });

  if (!orders || orders.length === 0) {
    return res.status(404).json([]);
  }

  return res.status(200).json(orders);
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const { id, status } = req.body;
  if (!id) {
    return res.status(400).json({ message: "Order id is required" });
  }
  const order = await Order.findByIdAndUpdate(id, {
    status: status,
  });
  if (!order) {
    return res.status(400).json({ message: "Order not found" });
  }
  return res.status(200).json({ message: "Order Updated Successfully" });
});

const totalSale = asyncHandler(async (req, res) => {
  const totalSale = await Order.aggregate([
    {
      $group: {
        _id: null,
        totalSale: { $sum: "$totalPrice" },
      },
    },
  ]);
  if (!totalSale) {
    return res.status(400).json({ message: "No sale found" });
  }
  return res.status(200).json({ totalSale: totalSale.pop().totalSale });
});

const getUserOrders = asyncHandler(async (req, res) => {
  const { userId } = req.user;
  if (!userId) {
    return res.status(400).json({ message: "User not found" });
  }
  const userOrders = await Order.find({ user: userId })
    .populate({
      path: "orderItems",
      populate: { path: "product", populate: "category" },
    })
    .populate("user")
    .sort({ createdAt: -1 });
  if (!userOrders || userOrders.length === 0) {
    return res.status(404).json({ message: "No orders found for the user" });
  }

  return res.status(200).json(userOrders);
});

export { createOrder, getOrder, updateOrderStatus, totalSale, getUserOrders };
