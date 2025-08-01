import express from "express";
import Accounts from "../models/registeracc.model.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const users = await Accounts.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
});

// GET single user
router.get("/:id", async (req, res) => {
  try {
    const user = await Accounts.findById(req.params.id);
    if (!user)
      return res.status(404).json({
        error: "User not found",
      });
    res.json(user);
  } catch (err) {
    res.status(500).json({
      error: "Failed to fetch user",
    });
  }
});

// CREATE user
router.post("/", async (req, res) => {
  try {
    const newUser = new Accounts(req.body);
    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({
      error: "Failed to create user",
    });
  }
});

// UPDATE user
router.put("/:id", async (req, res) => {
  try {
    const updatedUser = await Accounts.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    if (!updatedUser)
      return res.status(404).json({
        error: "User not found",
      });
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({
      error: "Failed to update user",
    });
  }
});

// DELETE user
router.delete("/:id", async (req, res) => {
  try {
    const deletedUser = await Accounts.findByIdAndDelete(req.params.id);
    if (!deletedUser)
      return res.status(404).json({
        error: "User not found",
      });
    res.json({
      message: "User deleted",
    });
  } catch (err) {
    res.status(500).json({
      error: "Failed to delete user",
    });
  }
});

export default router;
