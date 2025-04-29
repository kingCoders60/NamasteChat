import {generateToken} from "../lib/utils.js"
import User from "../models/user.model.js"
import bcrypt from "bcryptjs"
import cloudinary from "../lib/cloudinary.js"

export const signup = async(req,res)=>{
    const {fullName,email,password}=req.body
    try {
        //hash password--Bcrypt js.
        if(!fullName || !email || !password){
            return res.status(400).json({message:"All filled needed to be filled up!"})
        }
        if(password.length<6){
            return res.status(400).json({message:"Password must be at least 6 characters"});
        }
        const user = await User.findOne({email})

        if(user) return  res.status(400).json({message:"Email Already Exists"});



        const salt = await bcrypt.genSalt(20);
        const hashedPassword = await bcrypt.hash(password,salt);

        const newUser = new User({
            fullName,
            email,
            password:hashedPassword
        })
        if(newUser){
            generateToken(newUser._id,res)  //._id it is the format of mongoDb
            await newUser.save();

            res.status(201).json({
                _id:newUser._id,
                fullName:newUser.fullName,
                email:newUser.email,
                profilePic:newUser.profilePic,
            })
        }
        
    } catch (error) {
        console.log("Error in signup controller",error.message);
        res.status(500).json({message:"Internal Server Error"})
    };
} 
export const login = async(req,res)=>{
    const{email,password}=req.body
    try {
        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({message:"Invalid credential"})
        }
        const isPasswordCorrect = await bcrypt.compare(password,user.password) //password is that stored in db and User.password is the psassword that the user enter.
        if(!isPasswordCorrect){
            return res.status(400).json({message:"Invalid credentials"});
        }

        generateToken(user._id,res)
        res.status(200).json({
            _id:user._id,
            fullName:user.fullName,
            email:user.email,
            profilePic:user.profilePic,
        })
    } catch (error) {
        console.log("Error in login controller",error.message);
        res.status(500).json({message:"Internal Server Error!"})
    }
}
export const logout = (req,res)=>{
    try{
        res.cookie("jwt",null,{maxAge:0,httpOnly:true});
        res.status(200).json({message:"Logged out Successfully!"})
    }catch(error){
        console.log("Error in Logout contoller",error.message);
        res.status(500).json({message:"Internal Server Error"});
    }
} 
export const updateProfile=async (req,res)=>{
    try {
        const {profilePic}=req.body;
        const userId = req.user._id;
        if(!profilePic){
            return res.status(400).json({message:"Profile pic is required"});
        }

        const uploadResponse = await cloudinary.uploader.upload(profilePic);
        const updatedUser = await User.findByIdAndUpdate(userId,{profilePic:uploadResponse.secure_url},{new:true})
        res.status(200).json(updatedUser);
    } catch (error) {
        console.log("error in update profile:",error);
        res.status(500).json({message:"Internal server error!"});
    }
}
export const checkAuth=async(req,res)=>{
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("Error in checkAuth.",error.message);
        res.status(500).json({message:"Internal Server Error!"});
    }
}