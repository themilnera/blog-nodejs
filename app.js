require("dotenv").config();
const express = require("express");
const app = express();
const PORT = 4000;

const connectDB = require("./server/config/db");
connectDB();

app.get("/", (req, res) =>{
    res.send("Hello World and so on and all that");
})

app.listen(PORT, ()=>{
    console.log(`server is running on port: ${PORT}`);
})