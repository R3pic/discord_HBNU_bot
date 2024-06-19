// logger.config.js
import winston from 'winston';

const { combine, timestamp, printf, colorize } = winston.format;

const logFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} ${level}: ${message}`;
});

const LoggerConfig = {
    development: {
        level: 'debug',
        format: combine(
            colorize(),
            timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            logFormat
        )
    },
    production: {
        level: 'info',
        format: combine(
            timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            logFormat
        )
    }
};

export default LoggerConfig;
