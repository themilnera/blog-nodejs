require("dotenv").config();
const mongoose = require("mongoose");
const DBPath = process.env.MONGO_URI;

const connectDB = async ()=>{
    try {
        await mongoose.connect(DBPath);
        console.log("Connection to DB successful")
    } catch (error) {
        console.log("Failed with error: "+error);
        process.exit(1);
    }
}

module.exports = connectDB;