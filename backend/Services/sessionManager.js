import redisClient from "../Configs/redis";

class SessionManager {
    async createSession(userId){
        await this.enforceDeviceLimit(userId, 2);
        const sessionId = crypto.randomUUID();
        const newSession = {
            id: sessionId,
            userId : userId
        }
        await redisClient.json.set(`session:${sessionId}`, "$", newSession);
        await redisClient.expire(`session:${sessionId}`, 7 * 24 * 60 * 60);
        return sessionId;
    }

    async deleteSession(sessionId){
        if(sessionId){
            await redisClient.del(`session:${sessionId}`);
        }
    }

    async enforceDeviceLimit(userId, limit){
        const allSessions = await redisClient.ft.search("session:userIdIdx", `@userId:{${userId}}`, {
            RETURN : []
        });
        if(allSessions.total >= limit){
            await redisClient.del(allSessions.documents[0].id);
        }
    }

    async deleteAllSessions(userId){
        const allSessions = await redisClient.ft.search("session:userIdIdx", `@userId:{${userId}}`, {
            RETURN : []
        });
        const sessions = allSessions.documents.map((doc) => doc.id);
        if(sessions.length > 0) await redisClient.del(sessions);
    }
}

export default new SessionManager();