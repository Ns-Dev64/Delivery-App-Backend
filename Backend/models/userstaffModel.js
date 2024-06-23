const mongoose=require("mongoose")
const user_schema=mongoose.Schema({
    Email:{
        type:"String",
        required:true,
        unique:true
    },
    Name:{
        type:"String",
        required:true,
    },
    Password:{
        type:"String",
        required:true
    },
    Proof:{
       type:"String",
       required:true, 
    },
    Phone_num:{
        type:"String",
        required:true,
        unique:true
    },
    Address:{
        type:"String",
        required:true,
    },
    License_num:{
        type:"String",
        required:true,
        unique:true
    },
    Photo:{
        type:"String",
        required:true,
    },
    otp: { type: "String" },
    otpExpires: { type: "Date" }
},
{
    timestamps:true,
}
)

module.exports=mongoose.model("userStaff",user_schema)
