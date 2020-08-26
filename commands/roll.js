/**
 * @type {import('picbot-engine').Command}
 */
const rollCommand = {
    name: 'roll',
    aliases: ['dice'],

    description: 'кидает кубик и пишет рандомное число',

    syntax: '<dice:random>',

    execute: async ({ message, args: { random } }) => {
        await message.reply(`🎲 ${random}`);
    },
};

module.exports = rollCommand;
