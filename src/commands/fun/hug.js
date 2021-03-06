import { ArgumentSequence, Command, memberReader, optionalReader } from 'picbot-engine';
import { randomFrom } from '../../utils/array.js';

const normalGigs = [
    'https://cdn.dribbble.com/users/90216/screenshots/1410933/3-drib-cindysuen-hugs.gif',
    'https://thumbs.gfycat.com/ExaltedHeftyLark-size_restricted.gif',
    'https://media.giphy.com/media/3oEdv4hwWTzBhWvaU0/giphy.gif',
    'https://media.giphy.com/media/42YlR8u9gV5Cw/giphy.gif',
    'https://media.giphy.com/media/JzsG0EmHY9eKc/giphy.gif',
    'https://media.giphy.com/media/KL7xA3fLx7bna/giphy.gif',
    'https://media.tenor.co/videos/7620a53f4a6b344dd6b0e67542176a2d/mp4',
    'https://media.tenor.co/videos/dfac2b9f0c04a5913ad616585a9273b5/mp4',
    'https://media.tenor.co/videos/924a63182e49fcb13792d95c4cf25f25/mp4',
];

const botGifs = [
    'https://media.giphy.com/media/QMkPpxPDYY0fu/giphy.gif',
    'https://media.giphy.com/media/KL7xA3fLx7bna/giphy.gif',
];

export default new Command({
    name: 'hug',

    description: 'Ты обнимаешь участника сервера :3',
    group: 'Фан',

    arguments: new ArgumentSequence(
        {
            description: 'Жертва обнимашек',
            reader: optionalReader(memberReader, null),
        }
    ),

    tutorial: '`!hug @Test` обнимет @Test',

    execute: async ({ message, executor, args: [target] }) => {
        if (!target) {
            await message.channel.send(`${executor.displayName} обнимает свою любимую пустоту...`);
        }
        else if (target == executor) {
            await message.channel.send(`${executor.displayName} страдает от одиночества...`);
        }
        else if (target == message.guild.me) {
            await message.reply('Спасибо <3');
            await message.channel.send(randomFrom(botGifs));
        }
        else {
            await message.channel.send(`${executor.displayName} обнимает ${target.displayName}`);
            await message.channel.send(randomFrom(normalGigs));
        }
    },
});
