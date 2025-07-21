import cors from 'cors';
import express from 'express';
import dotenv from 'dotenv';

import {
    connectDB
} from './db.js';

import authRoutes from './routes/auth.js';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api",
    authRoutes);

app.listen(5174, () => {
    connectDB();
    console.log("server started at http://localhost:5174");
});