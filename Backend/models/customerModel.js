const mongoose=require("mongoose")
const customer_schema=mongoose.Schema({
    Email:{
        type:"String",
        required:true,
        unique:true
    },
    Password:{
        type:"String",
        required:true
    },
    Name:{
        type:"String",
        required:true,
    },
    Phone_num:{
        type:"String",
        required:true,
        unique:true
    },
},
{
    timestamps:true,
})

module.exports=mongoose.model("customer",customer_schema)