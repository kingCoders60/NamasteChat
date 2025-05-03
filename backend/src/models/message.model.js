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
  image:{
    type:String
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  createdAt: { type: Date, default: Date.now, expires: 1036800 }
});

const Message = mongoose.model("Message", messageSchema);
export default Message;
