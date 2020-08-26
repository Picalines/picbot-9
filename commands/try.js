const { MessageEmbed } = require('discord.js');
const { clamp } = require('../utils');

const borderChar = "|";
const progressChar = "⬜";
const emptyChar = "⬛";

/**
 * @param {number} length
 * @param {number} progress
 */
const makeProgressBar = (length, progress) => {
    progress = clamp(progress, 0, 1);
    let bar = borderChar;

    for (let i = 0; i < length; i++) {
        bar += i <= (progress * length) ? progressChar : emptyChar;
    }

    return bar + borderChar + ` ${Math.floor(progress * 100)}%`;
}

/**
 * @type {import('picbot-engine').Command}
 */
const tryCommand = {
    name: 'try',

    description: 'вы пробуете сделать *что-нибудь*',
    group: 'Фан',

    examples: [
        '`!try использовать try` - вы пробуете использовать try',
    ],

    execute: async ({ executor, message }) => {
        const action = /\S+\s+(.*)/g.exec(message.cleanContent)[1];

        const chance = Math.random();
        const progressBar = makeProgressBar(8, chance);

        const embed = new MessageEmbed()
            .setColor(3066993)
            .setTitle(`**${executor.displayName}** пробует ${action}`)
            .addField('Шанс', progressBar)
            .addField('Результат', Math.random() >= chance ? 'Успех!' : ':/');

        await message.reply({ embed: embed });
    },
};

module.exports = tryCommand;
