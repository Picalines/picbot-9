import { Client } from 'discord.js';
import { Bot } from 'picbot-engine';
import { mongooseDatabaseHandler } from 'picbot-mongoose';

import { prefixesState } from './states/prefixes.js';

const client = new Client();

const bot = new Bot(client, {
    token: 'DISCORD_TOKEN',
    tokenType: 'env',

    fetchLocale: 'ru',
    fetchPrefixes: prefixesState,

    databaseHandler: mongooseDatabaseHandler({
        databaseUrl: 'mongodb://localhost/picbot-9',
        connectOptions: {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }
    }),
});

bot.load();
