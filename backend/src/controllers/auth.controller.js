import userModel from "../models/user.model.js"
import bcryptjs from "bcryptjs"
import dotenv from "dotenv"
import imagekit from "../services/storage.service.js"
import generateToken from "../utils/generateJwtToken.js"
import { sendWelcomeEmail } from "../emails/emailHandlers.js"

dotenv.config()

const Register =async(req,res)=>{
    // registration logic
   

    const {username , email , password }=req.body;

    const file = req.file

     const result= await imagekit.UploadFile(file.buffer.toString('base64'));

    const isUserAlreadyExists=await userModel.findOne({
        email
    })

    if(isUserAlreadyExists) {
      return   res.status(409).json("user already exists");
    }

    const hash = await bcryptjs.hash(password,10);
    const user=await userModel.create({username , email , password:hash , profilePic:result.url});
   
    generateToken(user._id ,res);

    res.status(201).json({
        message:"user created success",
        user:{
            id:user._id,
            username:user.username,
            email:user.email,
            profilePic:user.profilePic
        }
    })

    try{
         await sendWelcomeEmail(user.email,user.username ,process.env.clientURL )
    }catch(err){
        return res.status(400).json({messgae:"ERROR at sending welcome email"})
    }

}

const Login =async (req,res)=>{
    const {username,email,password}=req.body;

    const user = await userModel.findOne({
       email
    })
    if(!user){
        return res.status(401).json({
            message:"user not found"
        })
    }

    const isValidPassword = await bcryptjs.compare(password,user.password);

    if(!isValidPassword){
        return res.status(401).json({message:"Unauthorized"})
    }

    generateToken(user._id,res);

    res.status(200).json({
        message:"Login success",
        user:{
            id:user._id,
            username:user.username,
            email:user.email,
            profilePic:user.profilePic
        }
    })


}

const Logout =(req,res)=>{

    res.clearCookie("token");

    res.status(200).json({
        message:"Loggedout Success"
    })

}


export default {Register,Login,Logout}