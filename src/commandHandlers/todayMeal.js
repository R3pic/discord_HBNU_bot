import getTodayHBNUMeals from "../function/getTodayHBNUMeals.js";
import {getMealEmbeds} from "../embed/MealEmbed.js";

const handle = async (interaction) => {
    try {
        const today = new Date();
        const day = today.getDay();
        if (day === 0 || day === 6) {
            await interaction.reply("주말에는 학식 정보가 제공되지 않습니다.");
            return;
        }

        await interaction.deferReply();

        const meals = await getTodayHBNUMeals();

        const embed = getMealEmbeds(meals);

        await interaction.editReply({ embeds: [embed] });
    }
    catch (error){
        await interaction.editReply("오늘의 학식을 불러오는데 실패했습니다")
    }
}

export const FoodHandler = {
    handle,
}