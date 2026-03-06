import { createClient } from "redis"

const redisClient = createClient();

redisClient.on("error", (err) => console.log("Error connecting to Redis", err));

await redisClient.connect();

export default redisClient;