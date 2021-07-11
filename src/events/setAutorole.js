import { BotEventListener } from 'picbot-engine';
import { autoroleState } from '../states/autorole.js';

export default new BotEventListener(
    bot => bot.clientEvents.guildMemberAdd,

    async ({ database }, member) => {
        member = await member.fetch();

        let { guild, guild: { me } } = member;

        me = await me?.fetch() ?? null;

        if (member.user.bot || !me?.permissions.has('MANAGE_ROLES')) {
            return;
        }

        const autorole = await database.accessState(guild, autoroleState).value();

        if (autorole && me.roles.highest.comparePositionTo(autorole) >= 0) {
            await member.roles.add(autorole, 'autorole');
        }
    },
);
