const redis = require("redis");
const client = redis.createClient();

client.on("connect", () => console.log("Connected to Redis"));
client.on("error", (err) => console.error("Redis Error:", err));

module.exports = client;
