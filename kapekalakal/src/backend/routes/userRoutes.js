import express from "express";
import Accounts from "../models/registeracc.model.js";

const router = express.Router();

router.get("/users", async (req, res) => {
    try {
        const users = await Accounts.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({
            message: "Server error"
        });
    }
});

export default router;