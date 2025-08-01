import express from "express";
import Product from "../models/productmodel.js";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({
            error: "Failed to fetch products"
        });
    }
});

// Add POST, PUT, DELETE as needed

export default router;