import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getMessages, getUserForSidebar, sendMessages } from "../controllers/message.controller.js";
import Message from "../models/message.model.js"; 


const router = express.Router();

router.get("/users", protectRoute, getUserForSidebar);
router.get("/:id", protectRoute, getMessages);

router.post("/send/:id", protectRoute, sendMessages);

router.put("/read/:messageId", async (req, res) => {
  try {
    await Message.findByIdAndUpdate(req.params.messageId, { read: true });
    res.json({ message: "Message marked as read" });
  } catch (error) {
    console.error("Error updating message:", error);
    res.status(500).json({ message: "Failed to update message" });
  }
});

export default router;