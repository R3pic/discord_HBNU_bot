import { GatewayIntentBits } from "discord.js";

const BotConfig = {
    intents: (
        GatewayIntentBits.Guilds |
        GatewayIntentBits.GuildMessages |
        GatewayIntentBits.MessageContent
    )
}

export default BotConfig;