const { MessageEmbed } = require('discord.js');
const { player } = require('../index');
const { Command } = require('picbot-engine');

const queueCommand = new Command({
    name: 'queue',

    description: 'пишет очередь музыкальных треков',
    group: 'Музыка',

    syntax: '<remainingText:clear=>',

    execute: async ({ message, executor, bot, args: { clear } }) => {
        const { id: guildId } = executor.guild;

        if (!player.isPlaying(guildId)) {
            throw new Error('Я не играю музыку!');
        }

        const queue = player.getQueue(executor.guild.id);

        const tracks = queue ? queue.tracks : [];

        if (!(queue && tracks.length)) {
            await message.reply('очередь пуста');
            return;
        }

        if (clear === 'clear') {
            await player.clearQueue(guildId);
            await message.reply('очередь очищена');
            return;
        }

        const sep = ' • ';
        const embedDesc = sep + tracks.map(t => `[${t.name}](${t.url})`).join('\n' + sep);

        const embed = new MessageEmbed()
            .setColor(0x00d95e)
            .setTitle('Очередь треков')
            .setDescription(embedDesc);
        
        await message.reply({ embed });
    },
});

module.exports = queueCommand;
