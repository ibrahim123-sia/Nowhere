const mongoose=require("mongoose");

const connectDB=async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MangoDB connected successfully")
    }
    catch(error){

        console.log("MangoDB connection failed",error)
        process.exit(1);
    }
}

module.exports=connectDB