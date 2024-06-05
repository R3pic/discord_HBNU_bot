import logger from "../logger/logger.js";
import getTodayHBNUMeals from "./getTodayHBNUMeals.js";
import {getMealEmbeds} from "../embed/MealEmbed.js";

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

        const meals = await getTodayHBNUMeals();
        if (meals === undefined){
            console.debug("Meals not found");
            throw new Error("Meal Is undefined");
        }
        const embed = getMealEmbeds(meals);
        await channel.send({ embeds: [embed] });
        logger.debug("Successfully sendTodayMeal");
}