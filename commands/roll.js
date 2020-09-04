const { Command } = require('picbot-engine');

const rollCommand = new Command({
    name: 'roll',
    aliases: ['dice'],

    description: 'кидает кубик и пишет рандомное число',

    syntax: '<dice:random>',

    execute: async ({ message, args: { random } }) => {
        await message.reply(`🎲 ${random}`);
    },
});

module.exports = rollCommand;
