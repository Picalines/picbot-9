import { ArgumentSequence, Command, memberReader, optionalReader, unorderedList } from 'picbot-engine';
import { randomFrom } from '../../utils/array.js';

const gifs = [
    'https://media.giphy.com/media/E3L5goMMSoAAo/giphy.gif',
    'https://media.giphy.com/media/1BXa2alBjrCXC/giphy.gif',
    'https://media.giphy.com/media/xT1XGQHjEkRdsggVXi/giphy.gif',
    'https://media.giphy.com/media/TJckbZ9PTjkek/giphy.gif'
];

export default new Command({
    name: 'zapoi',

    description: 'Ты уходишь в *запой*...',
    group: 'Фан',

    arguments: new ArgumentSequence(
        {
            description: 'Собутыльник',
            reader: optionalReader(memberReader, null),
        }
    ),

    tutorial: unorderedList(
        '`!zapoi` *ты уходишь в запой*',
        '`!zapoi @Test` *ты и @Test уходите в запой*',
    ),

    execute: async ({ message, executor, args: [partner] }) => {
        if (partner) {
            await message.channel.send(`${executor.displayName} и ${partner.displayName} ушли в запой...`);
        }
        else {
            await message.channel.send(`${executor.displayName} ушёл в запой...`);
        }

        await message.channel.send(randomFrom(gifs));
    },
});
