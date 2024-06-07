const async_handler=require("express-async-handler")
const userStaff=require("../models/userstaffModel")
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")

const registerStaff=async_handler(async(req,res)=>{
    const {Name,Email,Address,Phone_num,Password,License_num}=req.body
    
    const user_avail=await userStaff.findOne({Email})

    if(user_avail){
        res.status(401)
        throw new Error("user already exsists")
    }
    if (!req.files || !req.files.Proof || !req.files.Photo) {
        return res.status(400).json({ message: 'Both proof and photo are required!' });
    }
    proofPath=req.files.Proof[0].path
    photoPath=req.files.Photo[0].path
    const hashed_pass= await bcrypt.hash(Password,10)

    const new_user=new userStaff({
        Name:Name,
        Email:Email,
        Address:Address,
        Phone_num:Phone_num,
        License_num:License_num,
        Password:hashed_pass,
        Proof:proofPath,
        Photo:photoPath,
    })
    await new_user.save()
    return res.status(200).send("user saved sucessfully")


})

const signStaff=async_handler(async(req,res,next)=>{
    const {Email,Password}=req.body
    if(!Email||!Password){
        res.status(400)
        throw new Error("Please enter all the fields")
        
    }
    else{
        const user=await userStaff.findOne({Email})
        if(user&& await bcrypt.compare(Password,user.Password)){
             access_token=jwt.sign({
                user:{
                    Email:user.Email,
                    Name:user.Name,
                    id:user._id
                }
            },
        process.env.ACCESS_TOKEN,
    {expiresIn:"120m"})
    req.headers['authorization'] = `Bearer ${access_token}`;
    req.url = '/loginStaff';
    next();        }
        else{
            res.status(400)
            throw new Error("wrong email or password")
        }
    }  
})

const logged_in=async_handler(async(req,res)=>{
    res.status(200).json(req.user)
})

const getStaff=async_handler(async(req,res)=>{
    const data=await userStaff.find()
    if(!data){
        res.status(400)
        throw new Error("no data")
    }
    res.status(200).json(data)
})

module.exports={registerStaff,getStaff,logged_in,signStaff}