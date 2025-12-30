import { MongoClient } from "mongodb";

const url = "mongodb://ashish:ashish123@localhost:27017/Webdrive?replicaSet=myReplicaSet";
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