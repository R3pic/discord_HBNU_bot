import { SlashCommandBuilder } from "discord.js";
import { FoodHandler } from "../../commandHandlers/todayMeal.js";


export default {
    data: new SlashCommandBuilder()
        .setName('meal')
        .setDescription('오늘의 학식을 알려줍니다.')
    ,
    async execute(interaction) {
        await FoodHandler.handle(interaction);
    },
}