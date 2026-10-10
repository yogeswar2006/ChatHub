import aj from "../lib/arcjet.js"
import { isSpoofedBot } from "@arcjet/inspect";

const arcjetProtection = async (req,res,next)=>{

    try{
            const decision= await aj.protect(req);
            if(decision.isDenied()){
                if(decision.reason.isRateLimit()){
                    return res.status(409).json({message:"Rate limit exceeded . Please try again later"});
                }
                else if(decision.reason.isBot()){
                    return res.status(403).json({message:"Bot access denied"});
                }else{
                    return res.status(403).json({message:"Access denied due to security policy"})
                }
            }
            
            if(decision.results.some(isSpoofedBot)){
                return res.status(403).json({
                    error:"Spooped Bot detected",
                    message:"Malicious bot activity detected",

                })
            }

            next()

    }catch(error){
        console.log("Arcjet protection error",error);
        next()
    }

}

export default arcjetProtection
