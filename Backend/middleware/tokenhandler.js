const async_handler=require("express-async-handler")
const jwt=require("jsonwebtoken")

const validate_token=async_handler(async(req,res,next)=>{
   
     let token
     let auth_header=req.headers.Authorization || req.headers.authorization
     if(auth_header && auth_header.startsWith("Bearer")){
        token=auth_header.split(" ")[1]
        jwt.verify(token,process.env.ACCESS_TOKEN,(err,decoded)=>{
            if(err){
                res.status(401)
                throw new Error("User aint authorized")
            }
            req.user=decoded.user
            
            next();
        })
        if(!token){
            res.status(401)
            throw new Error("username or token missing")
        }
     }
})



module.exports=validate_token
