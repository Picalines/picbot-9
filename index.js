// @ts-ignore
require('ytpl').do_warn_deprecate = false;

const { readdirSync } = require('fs');
const { join } = require('path');

const { Client } = require('discord.js');
const { Bot, BuiltInDatabase: { getJsonBotDatabaseHandler }, Command } = require('picbot-engine');
const { YouTube } = require('popyt');
const { Player } = require('discord-player');

require('dotenv').config();

const client = new Client();

const player = new Player(client);

const youtube = new YouTube(process.env.YOUTUBE_API_KEY);

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
    client, player, youtube, bot,
};

/** @param {string} file */
const filterJsFiles = file => file.endsWith('.js');

/**
 * @param {import('fs').PathLike} path
 * @param {(value: string, index: number, array: string[]) => void} f
 */
const readJsFromSync = (path, f) => readdirSync(path).filter(filterJsFiles).forEach(f);

/**
 * @param {string} folderPath
 * @param {(exported: any, file: string) => void} f
 */
const requireJsFilesSync = (folderPath, f) => readJsFromSync(folderPath, file => {
    const m = require('.\\' + join(folderPath, file));
    f(m, file.substr(0, file.length - 3));
});

requireJsFilesSync('./events', (listener, name) => {
    if (listener instanceof Function) {
        bot.on(name, (...args) => {
            listener(bot, ...args);
        });
    }
});

requireJsFilesSync('./arguments', argument => {
    bot.commandArguments.register(argument.name, argument.reader);
});

requireJsFilesSync('./commands/', command => {
    if (command instanceof Command) {
        bot.commands.register(command);
    }
});

bot.login(process.env.DISCORD_TOKEN);
