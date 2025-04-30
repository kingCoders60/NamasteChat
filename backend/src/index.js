import express from "express";//first web framwwork..
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.route.js"
import messageRoutes from "./routes/message.route.js"
import {connectDB} from "./lib/db.js"

dotenv.config();
const app = express();

const PORT = process.env.PORT||5000;

app.use(express.json())
app.use(cookieParser);

app.use("/api/auth",authRoutes);
app.use("/api/message",messageRoutes);
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running at port: ${PORT}`);
    });
}).catch((error) => {
    console.error("Database connection failed", error);
});
