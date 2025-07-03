import mongoose from "mongoose";
import dotenv from "dotenv"
dotenv.config();

const ConnectToDb=async()=>{
    try{
        const con=await mongoose.connect(process.env.MONGO_URI);
        console.log("Mongo DB Connection Success")

    }catch(err){
        console.log("MongoDB Connection Fail",err)
        process.exit(1)
    }
}
export default ConnectToDb;