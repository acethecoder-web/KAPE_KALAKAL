import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  customerName: { type: String, required: true },
  product: { type: String, required: true },
  quantity: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  status: {
    type: String,
    required: true,
    enum: ["pending", "shipped", "delivered", "cancelled"],
  },
  orderDate: { type: Date, default: Date.now },
});

export default mongoose.model("Order", orderSchema);
