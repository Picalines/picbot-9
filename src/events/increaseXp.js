import { BotEventListener } from 'picbot-engine';
import { xpState } from '../states/xp.js';

export default new BotEventListener(
    bot => bot.events.guildMemberMessage,

    ({ database }, { member }) => {
        database.accessState(member, xpState).increase(1);
    },
);
