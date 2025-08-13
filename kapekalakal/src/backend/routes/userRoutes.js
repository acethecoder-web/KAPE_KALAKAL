import express from "express";
import Accounts from "../models/registeracc.model.js";
import bcrypt from "bcryptjs";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const users = await Accounts.find().select("-password");
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
    const { image, name, email, address, role, password } = req.body;

    const existingUser = await Accounts.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email Already used" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new Accounts({
      image,
      name,
      email,
      address,
      role,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: `User created Successfully` });
  } catch (err) {
    res.status(400).json({
      error: "Failed to create user",
      details: err.message,
    });
  }
});

// UPDATE user
router.put("/:id", async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (updateData.password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(updateData.password, salt);
    }

    const updatedUser = await Accounts.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
      }
    );

    if (!updatedUser) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    res.json({
      message: "User update successfully",
      user: updatedUser,
    });
  } catch (err) {
    res.status(400).json({
      error: "Failed to update user",
      details: err.message,
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
