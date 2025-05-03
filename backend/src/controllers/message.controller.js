import User from "../models/user.model.js"
import Message from "../models/message.model.js"
import cloudinary from "../lib/cloudinary.js";
import {getReciverSocketId,io} from "../lib/socket.js"

export const getUserForSidebar = async(req,res)=>{
    try {
        const loggedInUserId= req.user._id;
        const filteredUsers= await User.find({_id:{$ne:loggedInUserId}}).select("-password")
        res.status(200).json(filteredUsers);
    } catch (error) {
        console.log("Error in getUserForSidebar: ",error.message);
        res.status(500).json({error:"Internal server error"});
    }
};

export const getMessages = async(req,res) => {
    try {
        const {id:userToChatId}=req.params
        const myId = req.user._id;

        const messages = await Message.find({
            $or:[
                {senderId:myId,receiverId:userToChatId},
                {senderId:userToChatId,receiverId:myId}

            ]  
        })
        res.status(200).json(messages)
    } catch (error) {
        console.log("Error in getMessage contoller: ",error.message);
        res.status(500).json({message:"Internal server error!"})
    }
};

export const sendMessages=async(req,res)=>{
    try {
        const {text,image}=req.body;
        const {id:receiverId}=req.params;
        const senderId=req.user._id

        let imageUrl;
        if(image){
            const uploadResponse=await cloudinary.uploader.upload(image);
            imageUrl=uploadResponse.secure_url;
        }

        const newMessage=new Message({
            senderId,
            receiverId,
            text,
            image:imageUrl,
        });

        await newMessage.save();

        //todo: realtime funcitonality will be go here.->done.
        const receiverSocketId = getReciverSocketId(receiverId);
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage",newMessage); //for group chat omit to().. part.
        }

        res.status(200).json(newMessage);
    } catch (error) {
        console.log("Error in sendMessages controller:",error.message);
        res.status(500).json({error:"Internal server Error!"});
    }
}