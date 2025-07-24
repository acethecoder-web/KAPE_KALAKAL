import bcrypt from "bcryptjs";
import Accounts from "../models/registeracc.model.js"; // change this path if needed

const createSuperAdmin = async () => {
    const existing = await Accounts.findOne({
        email: "superadmin@example.com"
    });
    if (existing) {
        console.log("✅ Super Admin already exists.");
        return;
    }

    const hashedPassword = await bcrypt.hash("Probi2@2025", 10);

    const superAdmin = new Accounts({
        name: "Aces S Hapiz",
        email: "aceshapiz6@gmail.com",
        address: "123 Super Admin St, Admin City, Admin Country",
        password: hashedPassword,
        role: "superadmin",
    });
    await superAdmin.save();
    console.log("🎉 Super Admin account created.");
};

export default createSuperAdmin;