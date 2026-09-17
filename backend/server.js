import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import chatbotRoutes from "./routes/chatbotRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/chatbot", chatbotRoutes);

app.get("/", (req, res) => {
    res.json({
        message: "Job Portal API is running"
    });
});

// Default Port 7860 aur Host '0.0.0.0' zaroori hai
const PORT = process.env.PORT || 7860;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});