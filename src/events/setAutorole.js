import { assert, BotEventListener } from 'picbot-engine';
import { autoroleState } from '../states/autorole.js';

export default new BotEventListener(
    bot => bot.clientEvents.guildMemberAdd,

    async ({ database }, member) => {
        member = await member.fetch();

        const { guild, guild: { me } } = member;

        if (!me?.permissions.has('MANAGE_ROLES')) return;

        const autorole = await database.accessState(guild, autoroleState).value();

        if (autorole && me.roles.highest.comparePositionTo(autorole) >= 0) {
            await member.roles.add(autorole, 'autorole');
        }
    },
);
