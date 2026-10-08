import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()


const generateToken =(userId , res)=>{

     const token = jwt.sign({userId},process.env.SECRET_KEY,{expiresIn:"7d"})
     res.cookie("jwt",token,{
        maxAge: 7*24*60*60*1000,// millisecinds
        httpOnly:true,// prevent XSS attacks // cross site scripting
        sameSite:"strict",
        secure: process.env.NODE_ENV=="production"? true :false,

     });

     return token
}

export default generateToken