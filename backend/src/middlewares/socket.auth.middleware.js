import jwt from "jsonwebtoken"
import userModel from "../models/user.model.js"
import "dotenv/config"


export const sockectAuthMiddleware =async(socket,next)=>{

    try{
            // extract the jwt token form cookies
            const token= socket.handshake.headers.cookie
                  ?.split(", ")
                  .find((row)=>row.startsWith("jwt="))
                  ?.split("=")[1]
                
            if(!token){
                console.log("Socket connection rejected: No token provided")
                return next(new Error("Unauthoirized - No token provided"));
            }

            const decoded = jwt.verify(token,process.env.SECRET_KEY);
            if(!decoded){
                 console.log("Socket connection rejected: Invalid token")
                return next(new Error("Unauthoirized - Invalid token"));
            }

            const user = await userModel.findById(decoded.id).select("-password");
            if(!user){
                 console.log("Socket connection rejected: No user found")
                return next(new Error("No user found"));
            }

            socket.user=user;
            socket.userId=user._id.toString()
            console.log(`Socket authenticated for use ${user.username} (${user._id})`)

            next()


    }catch(err){
             console.log("Error at Socket authentication",err.message)
              next(new Error("Unauthorized - authentication failed"));
    }
}

