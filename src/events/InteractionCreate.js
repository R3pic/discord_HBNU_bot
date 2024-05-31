import { Events } from 'discord.js';
import logger from "../logger/logger.js";
import util from "node:util";
import Bot from "../bot/bot.js";

export default {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (!interaction.isChatInputCommand()) return;
        const { client, commandName } = interaction;
        const commands = Bot.client.commands;
        const command = client.commands.get(commandName);

        if (!command) {
            logger.error(`No Command Match ${commandName}`);
            await interaction.reply({ content: "올바르지 않은 명령어입니다.", ephemeral: true });
            return;
        }

        try {
            await command.execute(interaction);
        } catch (e) {
            console.error(e);
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
            } else {
                await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
            }
        }
    }
}