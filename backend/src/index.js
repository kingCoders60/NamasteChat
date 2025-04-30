import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { connectDB } from "./lib/db.js";
import cors from "cors";

dotenv.config();
const app = express();

const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(cookieParser());  // ✅ Fixed issue

app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);
app.use(
    cors({
        origin:"http://localhost:5173",
        credentials:true
    })
)

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running at port: ${PORT}`);
    });
}).catch((error) => {
    console.error("Database connection failed", error);
});
