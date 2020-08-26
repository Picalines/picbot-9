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

/** @param {string} file */
const filterJsFiles = file => file.endsWith('.js');

/**
 * @param {import('fs').PathLike} path
 * @param {(value: string, index: number, array: string[]) => void} f
 */
const readJsFromSync = (path, f) => readdirSync(path).filter(filterJsFiles).forEach(f);

readJsFromSync('./arguments', argFile => {
    const argument = require(`./arguments/${argFile}`);
    bot.commandArguments.register(argument.name, argument.reader);
});

readJsFromSync('./commands/', commandFile => {
    const command = require(`./commands/${commandFile}`);
    bot.commands.register(command.name, command);
});

bot.loginFromFile('./token.txt');
