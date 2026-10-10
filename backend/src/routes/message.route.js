import express from "express"
import Protected from "../middlewares/auth.middleware.js"
import messageController from "../controllers/message.controller.js"
import arcjetProtection from "../middlewares/arcjet.middleware.js"

const router=express.Router()

router.use(arcjetProtection,Protected.ProtectedRoute) // middlware 

router.get("/contacts",messageController.getAllContacts);
router.get("/chats",messageController.getAllChats);     
// good practice to put normal routes of same http method first than routes including dynamic values
router.get("/:id",messageController.getMessagesByUserId);
router.post("/send/:id",messageController.sendMessage);




export default router;