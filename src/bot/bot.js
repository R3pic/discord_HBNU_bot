import { Routes, Client, Collection } from "discord.js";
import { REST } from "discord.js";
import path from "node:path";
import util from "node:util";
import { readdirSync } from "node:fs";
import { pathToFileURL } from "node:url";

import BotConfig from "./bot.config.js";
import logger from "../logger/logger.js";

const client = new Client(BotConfig);
const rest = new REST().setToken(process.env.BOT_TOKEN);

const init = async () => {
    await read_events();
    await register_command();
    if (process.env.API_UPDATE)
        await bot_api_update();
}

const bot_api_update = async () => {
    const commands = [];
    // Load commands from the collection
    client.commands.forEach(command => {
        commands.push(command.data.toJSON());
    });

    try {
        logger.debug('Started refreshing application (/) commands.');

        // Get all existing commands
        const currentCommands = await rest.get(
            Routes.applicationCommands(process.env.BOT_ID)
        );

        logger.debug(`CurrentCommands : ${util.inspect(currentCommands)}`);

        // Find commands to delete
        const commandsToDelete = currentCommands.filter(currentCommand => {
            return !commands.some(newCommand => newCommand.name === currentCommand.name);
        });

        // Delete commands that are not in the new commands list
        for (const command of commandsToDelete) {
            await rest.delete(
                `${Routes.applicationCommands(process.env.BOT_ID)}/${command.id}`
            );
            logger.debug(`Deleted command: ${command.name}`);
        }

        // Register all new commands
        await rest.put(
            Routes.applicationCommands(process.env.BOT_ID),
            { body: commands }
        );

        logger.debug('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
};

const register_command = async () => {
    logger.debug("Command Register Start");
    client.commands = new Collection();

    const foldersPath = path.join(process.cwd(), 'src/commands');
    const commandFolders = readdirSync(foldersPath);
    logger.debug(`Command Folders : ${commandFolders}`);
    for (const folder of commandFolders) {
        const commandsPath = path.join(foldersPath, folder);
        const commandFiles = readdirSync(commandsPath).filter(file => file.endsWith('.js'));
        for (const file of commandFiles) {
            const filePath = pathToFileURL(path.join(commandsPath, file));
            const { default: command } = await import(filePath);
            // Set a new item in the Collection with the key as the command name and the value as the exported module
            if ('data' in command && 'execute' in command) {
                client.commands.set(command.data.name, command);
                // logger.debug(`Successfully Registered Command : ${util.inspect(command)}`);
                logger.debug(`Successfully Registered Command : ${command.data.name}`);
            }
            else {
                logger.debug(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
            }
        }
    }
    logger.debug("Command Register End");
}

const read_events = async () => {
    logger.debug("Event Handler Register Start");
    const eventsPath = path.join(process.cwd(), 'src/events');
    const eventFiles = readdirSync(eventsPath).filter(file => file.endsWith('.js'));
    logger.debug(`detected eventFiles : ${eventFiles}`);
    for (const file of eventFiles) {
        const filePath = pathToFileURL(path.join(eventsPath, file));
        const { default: event } = await import(filePath);
        if (event.once) {
            client.once(event.name, async (...args) => await event.execute(...args));
            logger.debug(`Successfully Once Event Execute : ${event.name}`);
        } else {
            client.on(event.name, async (...args) => await event.execute(...args));
            logger.debug(`Successfully Registered Event :  ${event.name}`)
        }
    }
    logger.debug("Event Handler Register End");
}

const Bot = {
    init,
    client,
}
export default Bot;