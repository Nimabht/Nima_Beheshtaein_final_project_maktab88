import { User } from "../models/user.js";
import bcrypt from "bcrypt";

export default async () => {
  try {
    const adminUser = await User.findOne({ role: "admin" });

    if (!adminUser) {
      const newAdminUser = new User({
        firstname: "Admin",
        lastname: "Admin",
        username: process.env.ADMIN_USERNAME,
        password: process.env.ADMIN_PASSWORD,
        phoneNumber: "09350000000",
        role: "admin",
      });

      const salt = await bcrypt.genSalt(10);
      newAdminUser.password = await bcrypt.hash(newAdminUser.password, salt);

      await newAdminUser.save();
      console.log("[✅]Admin created successfully!");
    }
  } catch (error) {
    console.error("Error checking or creating admin user:", error);
  }
};
