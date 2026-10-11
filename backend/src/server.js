
import ConnectDB from "./db/db.js"
import dotenv from "dotenv"
import {server,app} from "./lib/socket.io.js"
import express from "express"
import authRoutes from "./routes/auth.route.js"
import cookieParser from "cookie-parser"
import messageRoutes from "./routes/message.route.js"
import cors from "cors"



dotenv.config()

const PORT = process.env.PORT


app.use(cors({origin:process.env.clientURL,credentials:true}))  // cors middleware
app.use(express.json({limit:"10mb"}))  // middleware

app.use(cookieParser())

app.use("/api/auth",authRoutes);
app.use("/api/message",messageRoutes)



ConnectDB()  // creating connection with DB
server.listen(PORT,()=>{
    console.log("server is running on port "+PORT)  
    
})