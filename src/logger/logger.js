import { createLogger, transports} from "winston";
import config from './logger.config.js';

const { level, format } = config[process.env.NODE_ENV];

const logger = createLogger({
    level: level,
    format: format,
    transports: [
        new transports.Console()
    ]
});

export default logger;