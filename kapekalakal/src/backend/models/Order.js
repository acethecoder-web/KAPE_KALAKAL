import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  orderId: String,
  userId: String,
  items: Array,
  paymentMethod: String,
  paymentDetails: Object,
  pricing: {
    subtotal: Number,
    tax: Number,
    taxRate: Number,
    shippingFee: Number,
    total: Number,
  },
  status: String,
  paymentStatus: String,
  orderDate: Date,
  customerInfo: Object,
  deliveryInfo: Object,
  createdAt: Date,
  updatedAt: Date,
});

export default mongoose.model("Order", orderSchema);
