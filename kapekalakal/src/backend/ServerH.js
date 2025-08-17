import cors from "cors";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes.js";
import productsRoutes from "./routes/productsRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import cartRoutes from "./routes/cartRoutes.js"; // Add this line
// import createSuperAdmin from "./config/superAdminSeeder.js";
import { connectDB } from "./db.js";

import authRoutes from "./routes/auth.js";
dotenv.config();
const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productsRoutes);
app.use("/api", orderRoutes);
app.use("/api", cartRoutes); // Add this line

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    message: "Server is running!",
    timestamp: new Date().toISOString(),
  });
});

app.listen(5174, () => {
  connectDB();
  //   createSuperAdmin();
  console.log("server started at http://localhost:5174");
});
