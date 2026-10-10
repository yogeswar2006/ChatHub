import mongoose, { mongo, Schema } from "mongoose";

const messageSchema = new mongoose.Schema({
    text:{
        type:String
    },
    image:{
        type:String,
        default:"",
    },
    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true,
    },
    receiverId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true,
    }
},{timestamps:true})


const messageModel= mongoose.model("message",messageSchema)

export default messageModel