import app from "./app.js"
import ConnectDB from "./db/db.js"
import dotenv from "dotenv"

dotenv.config()

const PORT = process.env.PORT


ConnectDB()  // creating connection with DB

app.listen(PORT,()=>{
    console.log("server is running on port "+PORT)  
})