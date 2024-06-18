const mongoose=require("mongoose")

const menuitems_schema=mongoose.Schema({
    Price:{
       type:"String",
       required:true 
    },
    Dish_name:{
        type:"String",
        required:true,
    },
    Dish_pic:{
        type:"String"
    }
})

const rest_owner=mongoose.Schema({
    Username:{
        type:"String",
        required:true,
    },
    Owner_id:{
        type:"String",
    }
})

const rest_model=mongoose.Schema({
    Rest_name:{
        type:"String",
        required:true
    },
    Rest_owner:{
        type:[rest_owner],
        required:true
    },
    Menu_items:{
        type:[menuitems_schema],
        required:true
    },
    Reviews:{
        type:"String"
    }
})


module.exports=mongoose.model("restauarnt",rest_model)
