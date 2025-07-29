import express from "express";
import bcrypt from "bcryptjs";
import Accounts from "../models/registeracc.model.js";
const router = express.Router();
import jwt from 'jsonwebtoken'
import dotenv from "dotenv"
dotenv.config();
// import CheckRole from "../middleware/CheckRole.js";

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


function authenticateToken(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Not authorized, token missing"
        });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({
                success: false,
                message: "Token is invalid or expired"
            });
        }

        req.user = user;
        next();
    });
}

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

        const token = generateToken(user);

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            maxAge: 3600000,
        });

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

//==================================================================

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

        const savedAccount = await newAccount.save();
        console.log("Saved user:", savedAccount);
        res.status(201).json({
            success: true,
            data: savedAccount
        });

    } catch (error) {
        console.error("Error in Create Account:", error.message);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
});
//==================================================================

function authorizeRoles(...allowedRoles) {
    return (req, res, next) => {
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                message: "Access denied: insufficient role"
            });
        }
        next();
    };
}

//==================================================================

router.get("/me", authenticateToken, async (req, res) => {
    try {
        const user = await Accounts.findById(req.user.id).select("-password");
        res.json({
            success: true,
            data: user
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
});

//==================================================================
router.get(
    "/admin",
    authenticateToken,
    authorizeRoles("admin", "superadmin"),
    async (req, res) => {
        try {
            const user = await Accounts.findById(req.user.id).select("-password");
            res.json({
                success: true,
                data: user
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                message: "Server Error"
            });
        }
    }
);



export default router;