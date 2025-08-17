import express from "express";
import Order from "../models/ordersmodel.js";

const router = express.Router();

// GET all orders with pagination
router.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const orders = await Order.find()
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Order.countDocuments();
    res.json({
      orders,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// POST a new order
router.post("/", async (req, res) => {
  try {
    const newOrder = new Order({
      ...req.body,
      status: "Pending", // default status
    });
    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (err) {
    res.status(400).json({ error: "Invalid order data" });
  }
});

// PUT update order (including status)
router.put("/:id", async (req, res) => {
  try {
    const updated = await Order.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ error: "Order not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: "Failed to update" });
  }
});

// DELETE order
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Order.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Order not found" });
    res.json({ message: "Order deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete" });
  }
});

export default router;
