import logger from "../Utilities/logger.js";
import { randomUUID } from 'crypto';

const httpLogger = (req, res, next) => {
    const startTime = Date.now();
    req.id = req.headers['x-request-id'] || randomUUID(); 
    res.setHeader('X-Request-ID', req.id);
    res.on('finish', () => {
        const duration = Date.now() - startTime;
        const logData = {
            requestId: req.id,
            method: req.method,
            originalUrl: req.originalUrl,
            status: res.statusCode,
            durationMs: duration,
            ip: req.ip || req.socket.remoteAddress,
            userAgent: req.get('user-agent') || 'unknown'
        }
        if (res.statusCode >= 500) {
            logger.error(`HTTP ${req.method} ${req.originalUrl} - ${res.statusCode} Server Error`, logData);
        } else if (res.statusCode >= 400) {
            logger.warn(`HTTP ${req.method} ${req.originalUrl} - ${res.statusCode} Client Error`, logData);
        } else {
            logger.http(`HTTP ${req.method} ${req.originalUrl} - Success`, logData);
        }
    });
    next();
}

export default httpLogger;