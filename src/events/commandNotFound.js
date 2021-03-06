import { BotEventListener } from "picbot-engine";
import { errorEmbed } from "../utils/index.js";

export default new BotEventListener(
    bot => bot.events.commandNotFound,

    (_, message, wrongName) => {
        message.reply({ embed: errorEmbed(new Error(`команда не найдена: ${wrongName}`)) });
    }
);
