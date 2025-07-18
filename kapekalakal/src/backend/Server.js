import express from 'express';
import dotenv from 'dotenv';
import Accounts from './models/registeracc.model.js';

import {
    connectDB
} from './db.js';

dotenv.config();

const app = express();

app.use(express.json());

app.post("/api/docs", async (req, res) => {
    const account = req.body

    if (!account.name || !account.email || !account.password) {
        return res.status(400).json({
            success: false,
            message: "Please provide all fields"
        });
    }

    const newAccount = new Accounts(account);

    try {
        await newAccount.save();
        res.status(201).json({
            success: true,
            data: newAccount
        });
    } catch (error) {
        console.error("error in Create Product:", error.message);
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