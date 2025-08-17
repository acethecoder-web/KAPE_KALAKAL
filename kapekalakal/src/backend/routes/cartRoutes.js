const router = express.Router(); // routes/cartRoutes.js
import express from "express";
import Cart from "../models/cartmodel.js"; // Note the .js extension
import mongoose from "mongoose";

// GET all cart items
router.get("/cart", async (req, res) => {
  try {
    const cartItems = await Cart.find().sort({ createdAt: -1 });
    res.status(200).json(cartItems);
  } catch (error) {
    console.error("Error fetching cart items:", error);
    res.status(500).json({
      message: "Error fetching cart items",
      error: error.message,
    });
  }
});

// GET cart item by ID
router.get("/cart/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid cart item ID format" });
    }

    const cartItem = await Cart.findById(id);

    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    res.status(200).json(cartItem);
  } catch (error) {
    console.error("Error fetching cart item:", error);
    res.status(500).json({
      message: "Error fetching cart item",
      error: error.message,
    });
  }
});

// POST - Add item to cart
router.post("/cart", async (req, res) => {
  try {
    const {
      productId,
      name,
      description,
      price,
      image,
      category,
      quantity = 1,
    } = req.body;

    // Validation
    if (!productId || !name || !description || !price || !image || !category) {
      return res.status(400).json({
        message:
          "Missing required fields: productId, name, description, price, image, category",
      });
    }

    if (price < 0) {
      return res.status(400).json({ message: "Price cannot be negative" });
    }

    if (quantity < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }

    // Validate ObjectId format for productId
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid product ID format" });
    }

    // Check if item already exists in cart
    const existingItem = await Cart.findOne({ productId });

    if (existingItem) {
      // If item exists, update quantity
      existingItem.quantity += parseInt(quantity);
      const updatedItem = await existingItem.save();

      return res.status(200).json({
        message: "Item quantity updated in cart",
        item: updatedItem,
      });
    } else {
      // Create new cart item
      const newCartItem = new Cart({
        productId,
        name,
        description,
        price: parseFloat(price),
        image,
        category,
        quantity: parseInt(quantity),
      });

      const savedItem = await newCartItem.save();
      res.status(201).json({
        message: "Item added to cart successfully",
        item: savedItem,
      });
    }
  } catch (error) {
    console.error("Error adding item to cart:", error);

    // Handle validation errors
    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Validation error",
        error: error.message,
      });
    }

    res.status(500).json({
      message: "Error adding item to cart",
      error: error.message,
    });
  }
});

// PUT - Update cart item quantity
router.put("/cart/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid cart item ID format" });
    }

    // Validate quantity
    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }

    const updatedItem = await Cart.findByIdAndUpdate(
      id,
      { quantity: parseInt(quantity) },
      { new: true, runValidators: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    res.status(200).json({
      message: "Cart item updated successfully",
      item: updatedItem,
    });
  } catch (error) {
    console.error("Error updating cart item:", error);

    // Handle validation errors
    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Validation error",
        error: error.message,
      });
    }

    res.status(500).json({
      message: "Error updating cart item",
      error: error.message,
    });
  }
});

// PATCH - Update multiple fields of cart item
router.patch("/cart/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updateFields = req.body;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid cart item ID format" });
    }

    // Remove fields that shouldn't be updated
    delete updateFields.productId;
    delete updateFields._id;
    delete updateFields.createdAt;
    delete updateFields.updatedAt;

    // Validate quantity if provided
    if (updateFields.quantity && updateFields.quantity < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }

    // Validate price if provided
    if (updateFields.price && updateFields.price < 0) {
      return res.status(400).json({ message: "Price cannot be negative" });
    }

    const updatedItem = await Cart.findByIdAndUpdate(id, updateFields, {
      new: true,
      runValidators: true,
    });

    if (!updatedItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    res.status(200).json({
      message: "Cart item updated successfully",
      item: updatedItem,
    });
  } catch (error) {
    console.error("Error updating cart item:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Validation error",
        error: error.message,
      });
    }

    res.status(500).json({
      message: "Error updating cart item",
      error: error.message,
    });
  }
});

// DELETE - Remove specific item from cart
router.delete("/cart/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid cart item ID format" });
    }

    const deletedItem = await Cart.findByIdAndDelete(id);

    if (!deletedItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    res.status(200).json({
      message: "Item removed from cart successfully",
      item: deletedItem,
    });
  } catch (error) {
    console.error("Error removing cart item:", error);
    res.status(500).json({
      message: "Error removing cart item",
      error: error.message,
    });
  }
});

// DELETE - Clear entire cart
router.delete("/cart", async (req, res) => {
  try {
    const result = await Cart.deleteMany({});

    res.status(200).json({
      message: "Cart cleared successfully",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Error clearing cart:", error);
    res.status(500).json({
      message: "Error clearing cart",
      error: error.message,
    });
  }
});

// GET - Get cart summary (total items, total price)
router.get("/cart/summary", async (req, res) => {
  try {
    const cartItems = await Cart.find();

    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    res.status(200).json({
      totalItems,
      totalPrice: parseFloat(totalPrice.toFixed(2)),
      itemCount: cartItems.length,
      items: cartItems.length,
    });
  } catch (error) {
    console.error("Error getting cart summary:", error);
    res.status(500).json({
      message: "Error getting cart summary",
      error: error.message,
    });
  }
});

// GET - Check if product exists in cart
router.get("/cart/check/:productId", async (req, res) => {
  try {
    const { productId } = req.params;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid product ID format" });
    }

    const existingItem = await Cart.findOne({ productId });

    res.status(200).json({
      exists: !!existingItem,
      item: existingItem || null,
    });
  } catch (error) {
    console.error("Error checking cart item:", error);
    res.status(500).json({
      message: "Error checking cart item",
      error: error.message,
    });
  }
});

export default router;
