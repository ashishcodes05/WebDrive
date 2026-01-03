import mongoose from "mongoose";

const url = "mongodb://admin:admin@localhost:27017/Webdrive?authSource=admin"

await mongoose.connect(url);

console.log("mongoose connected")
