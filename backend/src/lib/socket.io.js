import {Server} from "socket.io"
import http from "http"
import express from "express"
import "dotenv/config"
import { sockectAuthMiddleware } from "../middlewares/socket.auth.middleware.js"



const app = express();
const server= http.createServer(app)


const io= new Server(server,{
    cors:{
        origin:process.env.clientURL,
        credentials:true,
    }
})



io.use(sockectAuthMiddleware);

export const getReceiverSocketId=(receiverId)=>{
    return userSocketMap[receiverId]
}

const userSocketMap={} //{userId:socketId}

io.on("connection",(socket)=>{
    console.log("A user connected",socket.user.username);
    const userId=socket.userId;
    userSocketMap[userId]=socket.id;

    io.emit("getOnlineUsers",Object.keys(userSocketMap));

    socket.on("disconnect",(reason)=>{
        console.log("A user Disconnected",socket.user.username);
           console.log("Disconnect reason:", reason);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers",Object.keys(userSocketMap));

    })
})

export  {app,io,server}



