import nodeCron from "node-cron";
import logger from "../logger/logger.js";
import {sendTodayMeal} from "../function/sendTodayMeal.js";

const set_up = (client) => {
    const maxRetries = 5;
    let retries = 0;

    const SendMeal = async () => {
        try {
            await sendTodayMeal(client);
            retries = 0;
            logger.info("Meal sent successfully.");
        } catch (err) {
            console.log(err);
            retries += 1;
            logger.error(`Error sending meal Schedule, retry (${retries}/${maxRetries})`);
            if (retries < maxRetries) {
                setTimeout(SendMeal, 60000);
            } else {
                logger.error("Max retries reached. Failed to send meal.");
                retries = 0;
            }
        }
    };

    nodeCron.schedule('0 11 * * 1-5', async () => { // 평일 오전 11시에 전송
    // nodeCron.schedule('* * * * *', async () => {
        await SendMeal();
    });

    logger.debug("SendMeal Scheduler set up");
}

export const SendMealScheduler = {
    set_up,
}
