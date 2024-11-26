const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwtSecret= process.env.JWT_SECRET;
const adminLayout = "../views/layouts/admin";

const authMiddleware = (req, res, next) =>{
    const token = req.cookies.token;

    if(!token){
        return res.status(401).json({ message: "Unauthorized" });
    }

    try{
        const decoded = jwt.verify(token, jwtSecret);
        req.userId = decoded.userId;
        next();
    }
    catch(error){
        return res.status(401).json({ message: "Unauthorized" });
    }
}



router.get("/admin", async (req, res) => {
    try{
        const locals = {
            title: "Admin",
            description: "A blog template made with NodeJS and ExpressJS",
        };
        res.render("admin/index", { locals, layout: adminLayout });
    }
    catch(error){
        console.log(error);
    }
});

router.post("/admin", async (req, res) => {
    try{
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if(!user){
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(!isPasswordValid){
            return res.status(401).json({ message: "Invalid Credentials "});
        }

        const token = jwt.sign({ userId: user._id }, jwtSecret);
        res.cookie("token", token, { httpOnly: true });
        res.redirect("/dashboard");
    }
    catch(error){
        console.log(error);
    }
});

router.get("/dashboard", authMiddleware, async (req, res) => {
    try{
        const locals = {
            title: "Dashboard",
            description: "A blog template made with NodeJS and ExpressJS",
        };

        const data = await Post.find();
        res.render("admin/dashboard", { locals, data, layout: adminLayout });
    }
    catch(error) {}
});

router.post("/register", async(req, res) => {
    try{
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        try{
            const user = await User.create({
                username,
                password: hashedPassword,
            });
            res.status(201).json({ message: "User created successfully", user});
        }
        catch(error){
            if(error === 11000){
                return res.status(500).json({ message: "User already exists!" });
            }
            else{
                return res.status(500).json({ message: "Something went wrong with the server!" });
            }
        }
    }
    catch(error){
        console.log(error);
    }
});

router.get("/logout", authMiddleware, async(req, res) => {
    try{
        res.clearCookie("token");
        res.redirect("/");
    }
    catch(error){
        console.log(error);
    }
});

module.exports = router;