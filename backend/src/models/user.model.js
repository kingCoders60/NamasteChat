import mongoose from "mongoose"

const userSchema = new mongoose.Schema(
    {
        email:{
            type:String,
            require:true,
            unique:true
        },
        fullName:{
            type:String,
            required:true
        },
        password:{
            type:String,
            required:true,
            minlength:6,
        },
        profilePic:{
            type:String,
            default:"",
        },
    },
    {timestamp:true}
);
const User = mongoose.model("User",userSchema); //"User" its a rule that first letter should be in upper caps.
export default User;