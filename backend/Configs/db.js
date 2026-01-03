import mongoose from "mongoose";

const url = "mongodb://admin:admin@localhost:27017/Webdrive?authSource=admin&replicaSet=myReplicaSet";

export async function connectDB(){
    try {
        await mongoose.connect(url);
        console.log(`Connected to ${mongoose.connection.name} database`);
    } catch(err){
        console.log(err);
        console.log("Unable to connect to the database");
        process.exit(1);
    }
}

process.on("SIGINT", async() => {
    await mongoose.disconnect();
    console.log("Database Disconnected!")
    process.exit(0);
})