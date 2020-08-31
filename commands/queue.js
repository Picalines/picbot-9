const { MessageEmbed } = require('discord.js');
const { youtube } = require('../index');

/**
 * @type {import('picbot-engine').Command}
 */
const queueCommand = {
    name: 'queue',

    description: 'пишет очередь музыкальных треков',

    execute: async ({ message, bot: { database } }) => {
        const guildData = await database.getGuildData(message.guild);

        /** @type {string[]} */
        const links = guildData.getProperty('musicQueue', []);

        if (!links.length) {
            await message.reply('очередь пуста');
            return;
        }
        
        const titles = new Map();
        for await (const { title, url } of links.map(l => youtube.getVideo(l))) {
            titles.set(url, title);
        }

        const sep = ' • ';
        const embedDesc = sep + links.map(l => `[${titles.get(l)}](${l})`).join('\n' + sep);

        const embed = new MessageEmbed()
            .setColor(0x00d95e)
            .setTitle('Очередь видео')
            .setDescription(embedDesc);
        
        await message.reply({ embed });
    },
};

module.exports = queueCommand;
