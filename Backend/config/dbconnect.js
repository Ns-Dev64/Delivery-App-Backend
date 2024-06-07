const mongo=require("mongoose")

const ConnectDb= async()=>{
    try{
        const connect=await mongo.connect(process.env.CONNECTION_STRING)
        console.log("database connectecd", connect.connection.host,connect.connection.name)
    }
    catch(e){
        console.log(e)
        process.exit(1)
    }
}

module.exports=ConnectDb