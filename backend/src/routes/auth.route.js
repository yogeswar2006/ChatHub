import express from "express"
import authController from "../controllers/auth.controller.js"
import multer from "multer"
import validationMiddleware from "../middlewares/validation.middleware.js"


const router = express.Router()
const upload=multer({storage:multer.memoryStorage()})

router.post("/register",upload.single("profilePic"),validationMiddleware.UserValidationRules,authController.Register)
router.post("/login",validationMiddleware.UserValidationRules,authController.Login)
router.post("/logout",authController.Logout)

export default router