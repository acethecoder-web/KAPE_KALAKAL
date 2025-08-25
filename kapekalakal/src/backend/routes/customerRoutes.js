// routes/customerOrderRoutes.js
import express from "express";
import Order from "../models/Order.js";

const router = express.Router();

// GET all orders (customer view)
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().sort({ orderDate: -1 }).lean();
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Error fetching orders" });
  }
});

export default router;
