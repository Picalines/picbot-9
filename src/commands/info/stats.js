import { MessageEmbed } from 'discord.js';
import { ArgumentSequence, Command, memberReader, optionalReader, unorderedList } from 'picbot-engine';
import { calculateLevel, xpState } from '../../states/xp.js';
import { partnerState } from '../../states/partner.js'

export default new Command({
    name: 'stats',
    aliases: ['profile', 'account'],

    description: 'Показывает статистику участника сервера',
    group: 'Информация',

    arguments: new ArgumentSequence(
        {
            description: 'Участник сервера',
            reader: optionalReader(memberReader, null),
        }
    ),

    tutorial: unorderedList(
        '`!stats` покажет вашу статистику на сервере',
        '`!stats @Test` покажет статистику участника @Test',
    ),

    execute: async ({ executor, message, database, args: [target] }) => {
        target = target ?? executor;

        const embed = new MessageEmbed()
            .setTitle(`Статистика **${target.displayName}**`)
            .setThumbnail(target.user.avatarURL() ?? '')
            .setColor(target.displayColor);

        const partner = await database.accessState(target, partnerState).value();
        if (partner) {
            embed.addField('Вторая половинка', partner.toString());
        }

        const xp = await database.accessState(target, xpState).value();

        embed.addFields([
            { name: 'Опыт', value: xp, inline: true },
            { name: 'Уровень', value: calculateLevel(xp), inline: true },
        ]);

        if (target != executor) {
            embed.setAuthor(`Запросил ${executor.displayName}`, executor.user.avatarURL() ?? '');
        }

        await message.channel.send({ embed });
    },
});
