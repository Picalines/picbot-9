import { MessageEmbed } from 'discord.js';
import { ArgumentSequence, Command, remainingTextReader } from 'picbot-engine';
import { clamp } from '../../utils/index.js';

export default new Command({
    name: 'try',

    description: 'вы пробуете сделать *что-нибудь*',
    group: 'Фан',

    arguments: new ArgumentSequence(
        {
            description: 'Действие',
            reader: remainingTextReader,
        }
    ),

    tutorial: '`!try использовать try` - вы пробуете использовать try',

    execute: async ({ executor, message, args: [action] }) => {
        const chance = Math.random();
        const bar = progressBar(8, chance);

        const embed = new MessageEmbed()
            .setColor(3066993)
            .setTitle(`**${executor.displayName}** пробует ${action}`)
            .addField('Шанс', bar)
            .addField('Результат', Math.random() >= chance ? 'Успех!' : ':/');

        await message.reply({ embed });
    },
});

/**
 * @param {number} length
 * @param {number} progress
 */
function progressBar(length, progress) {
    const borderChar = '|';
    const progressChar = '⬜';
    const emptyChar = '⬛';

    progress = clamp(progress, 0, 1);
    let bar = borderChar;

    for (let i = 0; i < length; i++) {
        bar += i <= (progress * length) ? progressChar : emptyChar;
    }

    return bar + borderChar + ` ${Math.floor(progress * 100)}%`;
}
