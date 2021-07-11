import { BotEventListener } from "picbot-engine";
import { greetingState } from "../states/greeting.js";

export default new BotEventListener(
    bot => bot.clientEvents.guildMemberAdd,

    async ({ database }, member) => {
        member = await member.fetch();
        const guild = await member.guild.fetch();

        if (member.user.bot || !guild.systemChannel) {
            return;
        }

        const greeting = await database.accessState(guild, greetingState).formatted(member);

        if (greeting) {
            await guild.systemChannel.send(greeting);
        }
    },
);
