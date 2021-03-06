import { MessageEmbed } from "discord.js";

/**
 * @param {Error} error
 */
export const errorEmbed = error => new MessageEmbed({
    color: 0xd61111,
    description: `:anger: ${error.message}`,
});
