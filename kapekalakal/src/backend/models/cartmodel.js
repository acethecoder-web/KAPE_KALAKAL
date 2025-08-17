// models/Cart.js
import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    image: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 1,
      min: 1,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields automatically
  }
);

// Index for faster queries
cartSchema.index({ productId: 1 });

// Virtual for total price of this cart item
cartSchema.virtual("totalPrice").get(function () {
  return this.price * this.quantity;
});

// Ensure virtual fields are serialized
cartSchema.set("toJSON", {
  virtuals: true,
});

export default mongoose.model("Cart", cartSchema);
