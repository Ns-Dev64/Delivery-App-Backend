const crypto = require('crypto');
const nodemailer=require("nodemailer")
const async_handler=require("express-async-handler")
const owner=require("../models/rest_owner")
const customer=require("../models/customerModel")
const userStaff=require("../models/customerModel")
const bcrypt=require("bcrypt")
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
  });
const success_message={"message":"success"}
const error_message={"message":"error"}
function generateOtp(){
    return crypto.randomBytes(3).toString('hex')
  }

function send_otp(Email,otp){
  const mailOptions = {
    to: Email,
    subject: 'Password Reset OTP',
    text: `Your OTP is ${otp}. It expires in 1 hour.`
};
transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return new Error("Error while sending the otp")
    }
    return "Otp sent successfully"
});
}

const request_otp=async_handler(async(req,res,next)=>{
    const {Email}=req.body
    const find_owner=await owner.findOne({Email})
    const find_customer=await customer.findOne({Email})
    const find_staff=await userStaff.findOne({Email})

    if(!find_owner&&!find_customer&&!find_staff){
        res.status(400)
        throw new Error("Email aint associated wid any typa account")
    }
    const otp=generateOtp()
    const otp_expires=Date.now()+600000
    if(find_owner){
      find_owner.otp=otp
      find_owner.otpExpires=otp_expires
      await find_owner.save()
     try{
      send_otp(Email,otp)
      res.status(200).json(success_message)
     }catch(err){
      res.status(500).send(err)
     }
    }
    if(find_customer){
      find_customer.otp=otp
      find_customer.otpExpires=otp_expires
      await find_customer.save()
      try{
        send_otp(Email,otp)
        res.status(200).json(success_message)
       }catch(err){
        res.status(500).send(err)
       }
    }
    if(find_staff){
      find_staff.otp=otp
      find_staff.otpExpires=otp_expires
      await find_staff.save()
      try{
        send_otp(Email,otp)
        res.status(200).json(success_message)
       }catch(err){
        res.status(500).send(err)
       }
    }
})

const verif_otp=async_handler(async(req,res,next)=>{
  const {Email,otp}=req.body
  const verif_owner=await owner.findOne({Email})
  const verif_customer=await customer.findOne({Email})
  const verif_staff=await userStaff.findOne({Email})
  if(!verif_customer&&!verif_owner&&!verif_staff){
    res.status(400).json(error_message)
  }
 if(verif_owner){
  if(verif_owner.otp !== otp || verif_owner.otpExpires < Date.now())
    res.status(400).json(error_message)
 }
 if(verif_customer){
  if(verif_customer.otp !== otp || verif_customer.otpExpires < Date.now())
    res.status(400).json(error_message)
 }
 if(verif_staff){
  if(verif_staff.otp !== otp || verif_staff.otpExpires < Date.now())
    res.status(400).json(error_message)
 }
 
res.status(200).json(success_message)
})

const reset_pass=async_handler(async(req,res,next)=>{
  const {Email,newPassword}=req.body
  if(!Email||!newPassword){
    res.status(400).json(error_message)
  }
  const reset_owner_pass=await owner.findOne({Email})
  const reset_cust_pass=await customer.findOne({Email})
  const reset_staff_pass=await userStaff.findOne({Email})
  if(!reset_owner_pass&&!reset_cust_pass&&!reset_staff_pass){
    res.status(400).json(error_message)
  }
  if(reset_owner_pass){
    try{const new_hashed_pass=await bcrypt.hash(newPassword,10)
    reset_owner_pass.Password=new_hashed_pass
    reset_owner_pass.save()
    res.status(200).json(success_message)}catch(err){
      res.status(400).json(err)
    }
  }
  if(reset_cust_pass){
    try{const new_hashed_pass=await bcrypt.hash(newPassword,10)
    reset_cust_pass.Password=new_hashed_pass
    reset_cust_pass.save()
    res.status(200).json(success_message)}catch(err){
      res.status(400).json(err)
    }
  }
  if(reset_staff_pass){
    try{const new_hashed_pass=await bcrypt.hash(newPassword,10)
    reset_staff_pass.Password=new_hashed_pass
    reset_staff_pass.save()
    res.status(200).json(success_message)}catch(err){
      res.status(400).json(err)
    }
  }
})

module.exports={request_otp,verif_otp,reset_pass}