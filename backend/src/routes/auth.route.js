import express from "express"
import authController from "../controllers/auth.controller.js"
import multer from "multer"
import validationMiddleware from "../middlewares/validation.middleware.js"
import Protected from "../middlewares/auth.middleware.js"
import arcjetProtection from "../middlewares/arcjet.middleware.js"


const router = express.Router()
router.use(arcjetProtection)
const upload=multer({storage:multer.memoryStorage()})

// router.get("/test",(req,res)=>{
//     res.status(200).json({message:"Test success"})
// })
router.post("/register",upload.single("profilePic"),validationMiddleware.UserValidationRules,authController.Register)
router.post("/login",validationMiddleware.UserValidationRules,authController.Login)
router.post("/logout",authController.Logout)
router.put("/update/profile",Protected.ProtectedRoute,upload.single("profilePic"),authController.UpdateProfile)
// router.patch("/update/password",Protected.ProtectedRoute,authController.updatePassword);

router.get("/check",Protected.ProtectedRoute,(req,res)=>{res.json({message:"user details",user:req.user})});

export default router