import {EmbedBuilder} from "discord.js";

/*
* @param {TodayMeal} TodayMeal 객체를 통해 Embed를 반환합니다.
 */
export const getMealEmbeds = (TodayMeal) => {
    return new EmbedBuilder()
        .setColor(0xBCE7D6)
        .setTitle(`HBNU 오늘의 학식 (${new Date().toDateString()})`)
        .addFields(
            {name: '**점심**', value: `\`\`\`${TodayMeal.lunch}\`\`\``, inline: true},
            {name: '**저녁**', value: `\`\`\`${TodayMeal.dinner}\`\`\``, inline: true},
        )
        .setTimestamp();
}