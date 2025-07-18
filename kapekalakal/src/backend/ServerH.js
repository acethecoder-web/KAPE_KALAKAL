import cors from 'cors';
import express from 'express';
import dotenv from 'dotenv';
import Accounts from './models/registeracc.model.js';
import bcrypt from 'bcrypt';

import {
    connectDB
} from './db.js';

import authRoutes from './routes/auth.js';

app.use(authRoutes);

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/docs", async (req, res) => {
    const {
        name,
        email,
        password
    } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({
            success: false,
            message: "Please provide all fields"
        });
    }

    try {
        const existingUser = await Accounts.findOne({
            email
        });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Email already registered"
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newAccount = new Accounts({
            name,
            email,
            password: hashedPassword,
        });

        await newAccount.save();

        res.status(201).json({
            success: true,
            data: newAccount
        });

    } catch (error) {
        console.error("Error in Create Account:", error.message);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
});

app.listen(5174, () => {
    connectDB();
    console.log("server started at http://localhost:5174");
});