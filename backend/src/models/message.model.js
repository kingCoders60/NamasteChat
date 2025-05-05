import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  text: {
    type: String,
  },
  image: {
    type: String,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  createdAt: { type: Date, default: Date.now, expires: 172800 },
  read:{typr:Boolean,
    default:false
  }
});

const Message = mongoose.model("Message", messageSchema);
export default Message;
