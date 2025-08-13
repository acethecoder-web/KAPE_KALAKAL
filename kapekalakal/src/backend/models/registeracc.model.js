import mongoose from "mongoose";

const accountSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    address: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin", "superadmin"],
      default: "user",
      required: true,
    },
    image: {
      type: String, // will store Cloudinary URL
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Accounts = mongoose.model("Accounts", accountSchema);

export default Accounts;
