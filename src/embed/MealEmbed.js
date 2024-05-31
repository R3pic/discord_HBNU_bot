import {EmbedBuilder} from "discord.js";

export const getMealEmbeds = (mealData) => {
    const formatMenu = (menu) => menu.split('\r\n').filter(item => item.trim() !== '').join('\n');

    const launchMenu = formatMenu(mealData.launch);
    const dinnerMenu = formatMenu(mealData.dinner);

    return new EmbedBuilder()
        .setColor(0xBCE7D6)
        .setTitle(`HBNU 오늘의 학식 (${new Date().toDateString()})`)
        .addFields(
            {name: '**점심**', value: `\`\`\`${launchMenu}\`\`\``, inline: true},
            {name: '**저녁**', value: `\`\`\`${dinnerMenu}\`\`\``, inline: true},
        )
        .setTimestamp();
}