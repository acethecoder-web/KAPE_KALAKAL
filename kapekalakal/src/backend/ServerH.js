import cors from "cors";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes.js";
import productsRoutes from "./routes/productsRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
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
app.use("/api", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/orders", orderRoutes);
app.listen(5174, () => {
  connectDB();
  //   createSuperAdmin();
  console.log("server started at http://localhost:5174");
});
