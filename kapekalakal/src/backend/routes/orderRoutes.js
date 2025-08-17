// routes/orderRoutes.js
import express from "express";
import Order from "../models/Order.js";
import mongoose from "mongoose";

const router = express.Router();

// GET all orders for specific user
router.get("/orders", async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const orders = await Order.find({ userId })
      .sort({ orderDate: -1 }) // Most recent first
      .lean();

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({
      message: "Error fetching orders",
      error: error.message,
    });
  }
});

// GET specific order by orderId
router.get("/orders/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const order = await Order.findOne({ orderId, userId }).lean();

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({
      message: "Error fetching order",
      error: error.message,
    });
  }
});

// POST create new order
router.post("/orders", async (req, res) => {
  try {
    console.log("Received order data:", req.body); // Debug log

    const {
      orderId,
      userId,
      items,
      paymentMethod,
      paymentDetails,
      pricing,
      status,
      paymentStatus,
      orderDate,
      customerInfo,
      deliveryInfo,
    } = req.body;

    // Validate required fields
    if (!userId || !items || !pricing?.total) {
      return res.status(400).json({
        message: "userId, items, and pricing.total are required",
      });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        message: "Items must be a non-empty array",
      });
    }

    // Create new order with all the data from frontend
    const newOrder = new Order({
      orderId: orderId || new mongoose.Types.ObjectId().toString(),
      userId,
      items,
      paymentMethod,
      paymentDetails,
      pricing,
      status: status || "pending",
      paymentStatus: paymentStatus || "pending",
      orderDate: orderDate || new Date(),
      customerInfo,
      deliveryInfo,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const savedOrder = await newOrder.save();
    console.log("Order saved successfully:", savedOrder.orderId); // Debug log
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error("Error creating order:", error);
    console.error("Error details:", error.stack); // More detailed error logging
    res.status(500).json({
      message: "Error creating order",
      error: error.message,
      details: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
});

// PUT update order status
router.put("/orders/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;
    const { userId } = req.query;
    const { status } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    if (!status) {
      return res.status(400).json({ message: "status is required" });
    }

    const updatedOrder = await Order.findOneAndUpdate(
      { orderId, userId },
      { status, updatedAt: new Date() },
      { new: true, lean: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({
      message: "Error updating order",
      error: error.message,
    });
  }
});

// DELETE order (admin only or within cancellation period)
router.delete("/orders/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const order = await Order.findOne({ orderId, userId });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check if order can be cancelled (e.g., only if status is "pending")
    if (order.status !== "pending") {
      return res.status(400).json({
        message:
          "Order cannot be cancelled. Only pending orders can be cancelled.",
      });
    }

    await Order.findOneAndDelete({ orderId, userId });

    res.status(200).json({ message: "Order cancelled successfully" });
  } catch (error) {
    console.error("Error cancelling order:", error);
    res.status(500).json({
      message: "Error cancelling order",
      error: error.message,
    });
  }
});

export default router;
