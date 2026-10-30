// import { GoogleGenAI } from "@google/genai";

// const ai = new GoogleGenAI({
//     apiKey : 
// });

// const interaction = await ai.interactions.create({
//   model: "gemini-3.8-flash",
//   input: "Explain how AI works in a few words",
// });
// console.log(interaction.output_text);

import express from "express";
import "dotenv/config";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import chatRoutes from "./routes/chat.js";
import authRoutes from "./routes/auth.js";

const app = express();

// Trust reverse proxy (Render, Vercel, Heroku) for secure cookies
app.set("trust proxy", 1);

app.use(express.json());
app.use(cookieParser());

const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:3000",
    process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (e.g. mobile apps, curl) or if in development
        if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== "production") {
            return callback(null, true);
        }
        // Allow any Vercel deployment preview or custom frontend URL
        if (origin.endsWith(".vercel.app") || allowedOrigins.some(o => origin.startsWith(o))) {
            return callback(null, true);
        }
        return callback(new Error("Not allowed by CORS"));
    },
    credentials: true
}));

const PORT = process.env.PORT || 8000;
const api = process.env.API_KEY;

app.use("/api/auth", authRoutes);
app.use("/api", chatRoutes);

app.listen(PORT, () => {
    console.log(`app is listening on port ${PORT}`);
    connectDB();
});

const connectDB = async() => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("DB connected !!!");
    }
    catch(err) {
        console.log(err);
    }
}

// "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent"
//https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent
// app.post("/test", async (req, res) => {
//     const options = {
//         method : "POST",
//         headers : {
//             "Content-Type": "application/json",
//             // "X-goog-api-key": api
//         },
//         body : JSON.stringify({
//             contents: [{
//                     parts: [{
//                             text: req.body.message,
//                         }]
//                 }]
//         })
//     };
//     try {
//         const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${api}`, options);
//         const data = await response.json();
//         console.log(data);
//         res.send(data);
//     }
//     catch(err) {
//         console.log(err);
//     }
// })