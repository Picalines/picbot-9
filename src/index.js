import { Client } from 'discord.js';
import { Bot } from 'picbot-engine';

import { prefixesState } from './states/prefixes.js';

const client = new Client();

const bot = new Bot(client, {
    fetchPrefixes: prefixesState,
    token: 'DISCORD_TOKEN',
    tokenType: 'env',
    fetchLocale: () => 'ru',
});

bot.load();
