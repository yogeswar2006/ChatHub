import mongoose from "mongoose"
import dotenv from "dotenv"

dotenv.config();

const ConnectDB = async()=>{
    
   try{
      await  mongoose.connect(process.env.MONGO_URI)
      console.log("Connected to DB");
   }catch(err){
      console.log("Error at connecting DB",err);
   }
}

export default ConnectDB