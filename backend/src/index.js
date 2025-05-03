import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";

import { connectDB } from "./lib/db.js";
import cors from "cors";
import bodyParser from "body-parser";
import {app,server,io} from "./lib/socket.js"
dotenv.config();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);


app.use(bodyParser.json({ limit: "1000mb" }));  // Supports larger JSON payloads
app.use(bodyParser.urlencoded({ limit: "1000mb", extended: true }));  // Supports larger form data
connectDB()
    .then(() => {
        server.listen(PORT,"0.0.0.0", () => {
            console.log(`Server is running at port: ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("Database connection failed", error);
        process.exit(1);
    });
