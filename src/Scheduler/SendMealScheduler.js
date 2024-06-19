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
            logger.info("Scheduler : SendMeal Ended");
        } catch (err) {
            logger.error(err);
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
    // 환경에 따라 스케줄 문자열 설정
    const ScheduleString = process.env.NODE_ENV === "production" ? "0 11 * * 1-5" : "* * * * *";
    logger.debug(`SchedulerString : ${ScheduleString}`);

    nodeCron.schedule(ScheduleString, async () => {
        await SendMeal();
    });

    logger.debug("SendMeal Scheduler set up");
}

export const SendMealScheduler = {
    set_up,
}
