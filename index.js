// @ts-ignore
require('ytpl').do_warn_deprecate = false;

const { Client } = require('discord.js');
const { Bot, BuiltInDatabase: { getJsonBotDatabaseHandler } } = require('picbot-engine');
const { readdirSync } = require('fs');
const { join } = require('path');
const { Player } = require('discord-player');

require('dotenv').config();

const client = new Client();

const player = new Player(client);

const bot = new Bot(client, {
    database: {
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

module.exports = {
    client, player, bot,
};

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
 * @param {(exported: any, file: string) => void} f
 */
const requireJsFilesSync = (folderPath, f) => readJsFromSync(folderPath, file => {
    const m = require('.\\' + join(folderPath, file));
    if (m[ignoreModuleKey] !== true) {
        f(m, file.substr(0, file.length - 3));
    }
});

requireJsFilesSync('./events', (listener, name) => {
    bot.on(name, (...args) => {
        listener(bot, ...args);
    });
});

requireJsFilesSync('./arguments', argument => {
    bot.commandArguments.register(argument.name, argument.reader);
});

requireJsFilesSync('./commands/', command => {
    bot.commands.register(command);
});

bot.login(process.env.DISCORD_TOKEN);
