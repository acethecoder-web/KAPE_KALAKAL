import express from "express";
import bcrypt from "bcryptjs";
import Accounts from "../models/registeracc.model.js";
const router = express.Router();
import jwt from 'jsonwebtoken'
import dotenv from "dotenv"
dotenv.config();

const generateToken = (user) => {
    return jwt.sign({
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        },
        process.env.JWT_SECRET, {
            expiresIn: "1h"
        }
    );
};

router.post("/login", async (req, res) => {
    const {
        email,
        password
    } = req.body;

    try {
        const user = await Accounts.findOne({
            email
        });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Incorrect password"
            });
        }
        const token = generateToken(user._id);

        res.status(200).json({
            success: true,
            message: "Login successful",
            ///JWT====================================
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error("Login error:", error.message);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
});

router.post("/register", async (req, res) => {
    const {
        name,
        email,
        password,
        address,
    } = req.body;

    if (!name || !email || !password || !address) {
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
            address,
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


export default router;