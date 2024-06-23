const crypto = require('crypto');
const nodemailer=require("nodemailer")
const async_handler=require("express-async-handler")
const owner=require("../models/rest_owner")
const customer=require("../models/customerModel")
const userStaff=require("../models/customerModel")
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
  });

function generateOtp(){
    return crypto.randomBytes(3).toString('hex')
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
    }
    if(find_customer){
      find_customer.otp=otp
      find_customer.otpExpires=otp_expires
      await find_customer.save()
    }
    if(find_staff){
      find_staff.otp=otp
      find_staff.otpExpires=otp_expires
      await find_staff.save()
    }
})

module.exports=request_otp