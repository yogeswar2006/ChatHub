import {body,validationResult}  from "express-validator"


const validate=(req,res,next)=>{
    
    const errors = validationResult(req);

    if(!errors.isEmpty()){
       return  res.status(400).json({
            message:"Please provide accurate details",
            errors
        })
    }

    next()

}

const UserValidationRules=[

   body("username")
     .isString()
     .withMessage("Username must be string type")
     .isLength({min:3 , max:20})
     .withMessage("Username must be atleast 3 and atmost 20 chars"),
     
    body("email")
     .isEmail()
     .withMessage("Invalid email address"),
     
     body("password")
      .isString()
      .withMessage("password must be string type")
      .isLength({min:6})
      .withMessage("password must be atleast 6"),

    validate

]

export default {UserValidationRules}