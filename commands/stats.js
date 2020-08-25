const { MessageEmbed } = require('discord.js');
const { calculateLevel } = require('../utils');

/**
 * @type {import('picbot-engine').Command}
 */
const statsCommand = {
    name: 'stats',
    aliases: ['profile', 'account'],

    description: 'Показывает статистику участника сервера',
    group: 'Статистика',

    syntax: '<member:target=_>',

    examples: [
        '`!stats` покажет вашу статистику на сервере',
        '`!stats @Test` покажет статистику участника @Test',
    ],

    execute: async ({ executor, message, bot: { database }, args: { target } }) => {
        target = target || executor;

        const memberData = await database.getMemberData(target);
        const { member } = memberData;

        const xp = memberData.getProperty('xp', 0);

        const embed = new MessageEmbed()
            .setTitle(`Статистика **${member.displayName}**`)
            .setThumbnail(member.user.avatarURL())
            .setColor(member.displayColor);

        let warns;
        if ((warns = memberData.getProperty('warns', 0))) {
            embed.addField('Предупреждения', warns);
        }

        embed.addFields([
            { name: 'Опыт', value: xp, inline: true },
            { name: 'Уровень', value: calculateLevel(xp), inline: true },
        ]);

        if (target != executor) {
            embed.setAuthor(`Запросил ${executor.displayName}`, executor.user.avatarURL());
        }

        await message.channel.send({ embed });
    },
};

module.exports = statsCommand;
