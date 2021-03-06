import { Command } from 'picbot-engine';
import { randomFrom } from '../../utils/array.js';

const replies = [
    'https://media.giphy.com/media/npUpB306c3EStRK6qP/giphy.gif',
    'https://media.giphy.com/media/Gyb7Mrx7jlGF2/giphy.gif',
    'https://media.giphy.com/media/6tZsIBl8VMieveHImW/giphy.gif',
    'https://media.giphy.com/media/3o6gb6qrSpLhI0rGko/giphy.gif',
    'https://media1.tenor.com/images/733e542fcdd51bb3d4404d888e7101e9/tenor.gif',
    'https://media.tenor.co/videos/fbbf92b8b078f931b54a85f2483b9c32/mp4',
    'https://media.tenor.co/videos/8d6f63a74b335220748acdd6c8692482/mp4',
    [
        'FFFFFFFFFFFFF',
        'FFFFFFFFFFFFF',
        'FFFF',
        'FFFF',
        'FFFFFFFFF',
        'FFFFFFFFF',
        'FFFF',
        'FFFF',
        'FFFF',
    ].join('\n'),
];

export default new Command({
    name: 'f',

    description: 'press f to pay respects',
    group: 'Фан',

    tutorial: '`!f` - ты нажимаешь f',

    execute: async ({ message }) => {
        await message.channel.send(randomFrom(replies));
    },
});
