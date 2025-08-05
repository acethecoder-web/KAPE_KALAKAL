import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  id: Number,
  customerName: String,
  product: String,
  quantity: Number,
  totalPrice: Number,
  status: String,
  orderDate: Date,
});

export default mongoose.model("Order", orderSchema);
