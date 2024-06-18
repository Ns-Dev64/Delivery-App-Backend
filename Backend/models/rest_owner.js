const mongoose=require("mongoose")

const rest_owner=mongoose.Schema({
    Username:{
        type:"String",
        required:true,
    },
    Password:{
        type:"String",
        required:true,
    },
    FullName:{
        type:"String",
        required:true
    },
    Address:{
        type:"String",
        required:true
    },
    GSTIN:{
        type:"String"
    },
    Rest_id:{
        type:"String",
    }
})

module.exports=mongoose.model("owner",rest_owner)