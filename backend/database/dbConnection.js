import mongoose from "mongoose";

export const dbConnection = ()=>{
    mongoose.connect(process.env.MONGO_URI,{
        dbName: "HEALTHX"
    }).then(()=>{
        console.log("Connected to DATABASE");
    }).catch((err) =>{
        console.log(`Connection failed: ${err}`);
    });
};