import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import interviewRoutes from "./routes/interviewRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import errorMiddleware from "./middleware/errorMiddleware.js";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const frontendPath = path.resolve(__dirname, "../Frontend/dist");

app.use(
    cors({
        origin: [
            "http://localhost:5173",
            "http://localhost:5174"
        ],
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"]
    })
);

app.use(express.json({ limit: "1mb" }));

app.use(express.static(frontendPath));

app.get("/", (req, res) => {
    res.status(200).json({
        message: "MockMind API is running"
    });
});

app.use("/api/auth", authRoutes);
app.use("/api/interviews", interviewRoutes);
app.use("/api/ai", aiRoutes);

app.use("/api", (req, res) => {
    res.status(404).json({
        message: "API endpoint not found"
    });
});

app.get("*path", (req, res, next) => {
    res.sendFile(path.join(frontendPath, "index.html"), (error) => {
        if (error) {
            next(error);
        }
    });
});

app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is missing from the .env file");
        }

        await connectDB();

        app.listen(PORT, () => {
            console.log(`MockMind backend running on port ${PORT}`);
            console.log(`API URL: http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error.message);
        process.exit(1);
    }
};

startServer();