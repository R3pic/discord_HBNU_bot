import logger from "../logger/logger.js";
import {getMealEmbeds} from "../embed/MealEmbed.js";
import getTodayMeal from "./getTodayMeal.js";

export const sendTodayMeal = async (client) => {
        const guild = (process.env.GUILD_ID && client.guilds.cache.get(process.env.GUILD_ID)) || client.guilds.cache.first();
        if (!guild) {
            logger.error('Guild not found.');
            return;
        }

        let channel = guild.channels.cache.find(channel => channel.name === 'cafeteria');

        if (!channel) {
            logger.debug('Cafeteria channel not found, creating one.');
            channel = await guild.channels.create({
                name: 'cafeteria',
                type: 0,
                reason: 'Needed a channel for cafeteria meals',
            });
        }

        const today = new Date();
        const day = today.getDay();
        if (day === 0 || day === 6) {
            await channel.send("주말에는 학식 정보가 제공되지 않습니다.");
            return;
        }

        const TodayMealData = await getTodayMeal();
        logger.debug(`TodayMealData : ${JSON.stringify(TodayMealData, null, 2)}`);

        if (TodayMealData === undefined){
            logger.debug("TodayMealData is undefined!");
            throw new Error("Meal Is undefined Something wrong.");
        }

        if (TodayMealData.lunch === "" && TodayMealData.dinner === "") { // 비어있으면 뭔가 운영을 하지 않는 것으로 판단. Embed보내지않음.
            logger.info("Todaymeal.lunch or .dinner is \"\"");
            return;
        }

        const embed = getMealEmbeds(TodayMealData);
        await channel.send({ embeds: [embed] });
        logger.debug("Successfully sendTodayMeal");
}