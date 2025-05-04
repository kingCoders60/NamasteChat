import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getMessages, getUserForSidebar, sendMessages } from "../controllers/message.controller.js";

const router = express.Router();

router.get("/users", protectRoute, getUserForSidebar);
router.get("/messages/:messageId", protectRoute, getMessages);


router.post("/send/:id", protectRoute, sendMessages);

export default router;