import { BotEventListener } from "picbot-engine";
import { errorEmbed } from "../utils/index.js";

export default new BotEventListener(
    bot => bot.events.commandError,

    (_, message, error) => {
        message.reply({ embed: errorEmbed(error) });
    }
);
