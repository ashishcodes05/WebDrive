import { MongoClient } from "mongodb";

const url = "mongodb://127.0.0.1:27017/Webdrive";
export const client = new MongoClient(url);

export async function connectDB(){
    await client.connect();
    const db = client.db();
    console.log(`Connected to ${db.databaseName} database`);
    return db;
}

process.on("SIGINT", async() => {
    await client.close();
    console.log("Database Disconnected!")
    process.exit(0);
})