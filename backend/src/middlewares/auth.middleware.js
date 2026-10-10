import jwt from "jsonwebtoken"
import "dotenv/config"
import userModel from "../models/user.model.js";

 const ProtectedRoute=async(req,res,next)=>{

   try{
         const token=req.cookies.jwt
            if(!token){
                return res.status(400).json({message:"Invalid request"});
            }
        
        const decoded=  jwt.verify(token,process.env.SECRET_KEY)

        if(!decoded){
            return res.status(401).json({message:"unauthorized"})
        }

        const user= await userModel.findById(decoded.id);

        if(!user){
            return res.status(400).json({message:"user not found"})
        }

            req.user=user
            next();

   }catch(err){
     return res.status(400).json({message:"Invalid credentials",err})
   }

}

export default {ProtectedRoute}