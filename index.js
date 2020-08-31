const { Bot, BuiltInDatabase: { getJsonBotDatabaseHandler } } = require('picbot-engine');
const { readdirSync } = require('fs');
const { join } = require('path');

require('dotenv').config();

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
        defaultPrefixes: [
            'picbot.',
            'p9.',
        ],
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

const ignoreModuleKey = '__ignoreBotModule';

/**
 * @param {string} folderPath
 * @param {(arg0: any) => void} f
 */
const requireJsFilesSync = (folderPath, f) => readJsFromSync(folderPath, file => {
    const m = require('.\\' + join(folderPath, file));
    if (m[ignoreModuleKey] !== true) {
        f(m);
    }
});

requireJsFilesSync('./arguments', argument => {
    bot.commandArguments.register(argument.name, argument.reader);
});

requireJsFilesSync('./commands/', command => {
    bot.commands.register(command.name, command);
});

bot.login(process.env.DISCORD_TOKEN);
