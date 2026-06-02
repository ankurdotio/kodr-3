import Redis from 'ioredis';

const redis = new Redis("redis://localhost:6379");

redis.once("ready", () => {
    console.log("Connected to Redis");
});

export default redis;