import { Events } from 'discord.js';
import logger from "../logger/logger.js";
import {SendMealScheduler} from "../Scheduler/SendMealScheduler.js";

export default {
    name: Events.ClientReady,
    once: true,
    execute(client){
        logger.info(`${client.user.tag} Is Ready!`);
        SendMealScheduler.set_up(client);
    }
}