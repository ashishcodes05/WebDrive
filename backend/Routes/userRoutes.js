import express from "express";
import crypto from "crypto";
import { writeFile } from "fs/promises";
import usersData from "../usersDB.json" with {type: "json"};
import directoriesData from "../directoriesDB.json" with {type: "json"};
import checkAuth from "../auth.js";
import { Db } from "mongodb";
const router = express.Router();

router.get("/", checkAuth, (req, res) => {
    const user = req.user;
    return res.status(200).json({success: true, message: "User Data Fetched Successfully", user: {name: user.name, email: user.email} });
})

router.post("/register", async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        if(!name || !email || !password){
            return res.status(400).json({success: false, message: "All fields are required"});
        }
        const db = req.db;
        const found = await db.collection("users").findOne({email});
        if(found){
            return res.status(409).json({success: false, message: "User already exists"});
        }
        const { insertedId : userId } = await db.collection("users").insertOne({
            name,
            email,
            password
        })
        const { insertedId : directoryId } = await db.collection("directories").insertOne({
            name: `root-${email}`,
            parentDir: null,
            userId,
        })
        await db.collection("users").updateOne({_id: userId}, {$set: {rootDirectory: directoryId}});
        return res.status(201).json({success: true, message: "User Registered Successfully"});
    } catch (err) {
        next(err);
    }
})

router.post("/login", async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if(!email || !password){
            return res.status(400).json({success: false, message: "All fields are required"});
        }
        const db = req.db;
        const user = await db.collection("users").findOne({email, password});
        if(!user){
            return res.status(401).json({success: false, message: "Invalid credentials"});
        }
        res.cookie("userId", user._id.toString(), {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000 * 7// 7 day
        });
        return res.status(200).json({success: true, message: "Login Successful"});
    } catch (err) {
        next(err);
    }
})

router.post("/logout", checkAuth, (req, res) => {
    res.clearCookie("userId");
    return  res.status(200).json({success: true, message: "Logout Successful"});
});

export default router;