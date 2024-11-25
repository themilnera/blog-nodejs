require("dotenv").config();

const expressLayouts = require("express-ejs-layouts");
const express = require("express");
const app = express();
const PORT = 4000;

const connectDB = require("./server/config/db");
connectDB();

//app.use sets up middleware functions 
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use(expressLayouts);
app.use(express.static("public"));
app.set("layout", "./layouts/main");
app.set("view engine", "ejs");

app.use("/", require("./server/routes/main"))
//middleware functions run for all HTTP requests (GET, POST, etc)
//they run in the order they are defined
//app.use([path,] middleware)

//not middleware
app.listen(PORT, ()=>{
    console.log(`server is running on port: ${PORT}`);
});