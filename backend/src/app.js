import express from "express"
import authRoutes from "./routes/auth.route.js"
import cookieParser from "cookie-parser"
import messageRoutes from "./routes/message.route.js"

const app=express();
app.use(express.json())  // middleware
app.use(cookieParser())

app.use("/api/auth",authRoutes);
app.use("/api/message",messageRoutes)


export default app