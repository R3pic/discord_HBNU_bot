import nodeCron from "node-cron";
import logger from "../logger/logger.js";
import {sendTodayMeal} from "../function/sendTodayMeal.js";



const set_up = (client) => {
    nodeCron.schedule('0 11 * * 1-5', async () => { // 평일 오전 11시에 전송
        await sendTodayMeal(client);
    });

    logger.debug("SendMeal Scheduler set up");
}

export const SendMealScheduler = {
    set_up,
}