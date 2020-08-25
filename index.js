const { Bot, BuiltInDatabase: { getJsonBotDatabaseHandler } } = require('picbot-engine');
const { readdirSync } = require('fs');

const bot = new Bot({
    database: {
        ignoreBots: true,
        handler: getJsonBotDatabaseHandler({
            dirPath: 'database/',
            guildsPath: 'guilds/',
            jsonIndent: 1,
        }),
    },
    guild: {
        defaultPrefixes: ['picbot.'],
    }
});

bot.on('memberPlainMessage', async message => {
    const data = await bot.database.getMemberData(message.member);
    const xp = data.getProperty('xp', 0);
    data.setProperty('xp', xp + 1);
});

readdirSync('./commands/').filter(file => file.endsWith('.js')).forEach(commandFile => {
    /** @type {import('picbot-engine').Command} */
    const command = require(`./commands/${commandFile}`);
    bot.commands.register(command.name, command);
});

bot.loginFromFile('./token.txt');
