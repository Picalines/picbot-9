import { BotEventListener } from "picbot-engine";
import { greetingState } from "../states/greeting.js";

export default new BotEventListener(
    bot => bot.clientEvents.guildMemberAdd,

    async ({ database }, member) => {
        member = await member.fetch();

        if (!member.guild.systemChannel) {
            return;
        }

        const greeting = await database.accessState(member.guild, greetingState).formatted(member);

        if (greeting) {
            await member.guild.systemChannel.send(greeting);
        }
    },
);
