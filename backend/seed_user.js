import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import "dotenv/config";
import User from "./models/user.js";

const seed = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            console.error("MONGODB_URI is not set in environment variables");
            process.exit(1);
        }
        
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB...");

        const testEmail = "test@example.com";
        const existingUser = await User.findOne({ email: testEmail });

        if (existingUser) {
            console.log("Test user already exists:", testEmail);
            process.exit(0);
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash("password123", salt);

        await User.create({
            username: "testuser",
            email: testEmail,
            password: hashedPassword
        });

        console.log("Test user created successfully!");
        console.log("Email: test@example.com");
        console.log("Password: password123");
        process.exit(0);
    } catch (err) {
        console.error("Seeding failed:", err);
        process.exit(1);
    }
};

seed();
