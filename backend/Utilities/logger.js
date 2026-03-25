import winston from 'winston';

const { combine, timestamp, printf, colorize, json, errors } = winston.format;

const terminalFormat = combine(
    colorize(),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    printf(({ timestamp, level, message, stack, ...metadata }) => {
        let msg = `${timestamp} [${level}]: ${message}`;
        
        if (Object.keys(metadata).length > 0) {
            msg += ` ${JSON.stringify(metadata)}`;
        }
        
        if (stack) {
            msg += `\n${stack}`;
        }
        
        return msg;
    })
);

const fileFormat = combine(
    timestamp(),
    json()
);

const logger = winston.createLogger({
    level: 'silly',
    levels: {
        error: 0,
        warn: 1,
        info: 2,
        http: 3,
        debug: 4,
        silly: 5
    },
    format: combine(
        errors({ stack: true }), 
        fileFormat 
    ),
    transports: [
        new winston.transports.Console({ format: terminalFormat }),
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/combined.log', level: 'silly' })               
    ]
});

export default logger;