import cors from "cors";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url"; // Needed to get __dirname in ES modules
import userRoutes from "./routes/userRoutes.js";
import productsRoutes from "./routes/productsRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import customerOrderRoutes from "./routes/customerRoutes.js";
import cartRoutes from "./routes/cartRoutes.js"; // Add this line
// import createSuperAdmin from "./config/superAdminSeeder.js";
import { connectDB } from "./db.js";
import authRoutes from "./routes/auth.js";

dotenv.config();

// Get __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// FRONTEND_SRC path pointing to kapekalakal/src
const FRONTEND_SRC = path.join(__dirname, "..");
console.log("Frontend source folder:", FRONTEND_SRC);

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
app.use("/api/orders", orderRoutes);
app.use("/api/customer-orders", customerOrderRoutes);
app.use("/api", cartRoutes); // Add this line

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    message: "Server is running!",
    timestamp: new Date().toISOString(),
  });
});

const PORT = process.env.PORT || 5174;

import path from "path";

// Serve React build
app.use(express.static(path.join(__dirname, "client", "dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

app.listen(PORT, () => {
  connectDB();
  //   createSuperAdmin();
  console.log("server started at http://localhost:5174");
});
