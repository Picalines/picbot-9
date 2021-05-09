import { ArgumentSequence, Command, memberReader } from 'picbot-engine';
import { randomFrom } from '../../utils/array.js';

const gifs = [
    'https://media0.giphy.com/media/l1J3G5lf06vi58EIE/giphy.gif',
    'https://media0.giphy.com/media/l0IyouZhJkG0MG9Us/giphy.gif',
    'https://media1.tenor.com/images/5560767dc6b5d40a795a295ed4116698/tenor.gif?itemid=10363305',
    'https://media1.tenor.com/images/3c95ca85f89068660becde7a31f0f04d/tenor.gif?itemid=4973550',
]

export default new Command({
    name: 'punch',

    description: 'Ты ударяешь другого участника сервера!',
    group: 'Фан',

    arguments: new ArgumentSequence(
        {
            description: 'Цель',
            reader: memberReader,
        }
    ),

    tutorial: '`!punch @Test` удалит участника @Test',

    execute: async ({ message, executor, args: [target] }) => {
        if (target == executor) {
            await message.channel.send(`${executor.displayName} ударил сам себя. Помогите ему, кто-нибудь!`);
        }
        else if (target == message.guild.me) {
            await message.reply('А меня-то за что?..');
        }
        else {
            await message.channel.send(`${executor.displayName} ударил ${target.displayName}`);
            await message.channel.send(randomFrom(gifs));
        }
    },
});
