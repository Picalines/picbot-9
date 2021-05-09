import { ArgumentSequence, Command, memberReader } from 'picbot-engine';
import { randomFrom } from '../../utils/array.js';

const gifs = [
    'https://media1.tenor.com/images/93d11bc59526ce49f60766f0045d819b/tenor.gif?itemid=11500735',
    'https://thumbs.gfycat.com/DigitalCriminalHornedtoad-size_restricted.gif',
    'https://media.giphy.com/media/kxevHLcRrMbtC1SXa8/giphy.gif',
];

export default new Command({
    name: 'fbi',

    description: 'Ты вызываешь ФБР на участника сервера',
    group: 'Фан',

    arguments: new ArgumentSequence(
        {
            description: 'Подозрительный участник сервера',
            reader: memberReader,
        }
    ),

    tutorial: '`!fbi @Test` вызывает ФБР на @Test',

    execute: async ({ message, executor, args: [target] }) => {
        if (executor == target) {
            await message.reply('Проблемы нужны?');
        }
        else if (executor == message.guild.me) {
            await message.reply('непон.');
        }
        else {
            await message.channel.send(`- Алло, ФБР? МЫ НАШЛИ **${target.displayName.toUpperCase()}**\n- ВЫЕЗЖАЕМ!`);
            await message.channel.send(randomFrom(gifs));
        }
    },
});
