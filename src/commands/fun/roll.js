import { Command, ArgumentSequence } from 'picbot-engine';
import { diceReader } from '../../readers/dice.js';

export default new Command({
    name: 'roll',
    aliases: ['dice'],

    description: 'Кидает кубик и пишет рандомное число',
    group: 'Фан',

    arguments: new ArgumentSequence(
        {
            description: 'Кубик (Пример - 2d20)',
            reader: diceReader,
        }
    ),

    tutorial: '`!roll 2d20` Кинет 22. Или не 22. 🎲',

    execute: async ({ message, args: [random] }) => {
        await message.reply(`🎲 ${random}`);
    },
});
