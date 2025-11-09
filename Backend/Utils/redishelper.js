import redisClient from "../Config/redis.js";

export const clearUserCache = async (userId) => {
  try {
    await Promise.all([
      redisClient.del(`user:${userId}`),
      redisClient.del(`followers:${userId}`),
      redisClient.del(`search:${userId}`),
    ]);
    console.log(`🧹 Cleared Redis cache for user ${userId}`);
  } catch (error) {
    console.error("Error clearing Redis cache:", error);
  }
};
