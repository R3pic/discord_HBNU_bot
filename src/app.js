import 'dotenv/config';
import logger from './logger/logger.js';
import Bot from "./bot/bot.js";

try {
    await Bot.init().then(() => {
        logger.debug("Successfully Initialized Bot Events and commands");
    });
    await Bot.client.login(process.env.BOT_TOKEN)

    logger.debug("Bot login")
} catch (err){
    logger.error(err);
}
