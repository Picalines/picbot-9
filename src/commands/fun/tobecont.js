import { Command } from 'picbot-engine';

export default new Command({
    name: 'tobecont',

    description: '*Продолжение следует*',
    group: 'Фан',

    tutorial: '`!tobecont` - *продолжение следует...*',

    execute: async ({ message }) => {
        await message.channel.send('*Продолжение следует...*');
        await message.channel.send('https://steamuserimages-a.akamaihd.net/ugc/242458830522658785/AC845A7A289C48F9497620E45379001CC50CF398/');
    },
});
