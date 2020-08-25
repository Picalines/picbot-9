/**
 * @typedef {import('discord.js')} Discord
 */

/**
 * @type {import('picbot-engine').Command}
 */
const marryCommand = {
    name: 'marry',

    description: 'Женит вас на участнике сервера `target`',
    group: 'Отношения',

    examples: [
        '`!marry @Test` поженит вас на участнике сервера @Test',
    ],

    syntax: '<member:target=_>',

    /**
     * @param {{ args: { target: Discord.GuildMember } } & import('picbot-engine').CommandContext} param0
     */
    execute: async ({ executor, message, args: { target }, bot: { database } }) => {
        const memberData = await database.getMemberData(target);

        const defaultId = '';
        const oldPartnerId = memberData.getProperty('partner', defaultId);
        const alreadyMarried = oldPartnerId != defaultId;

        if (alreadyMarried) {
            const oldPartner = message.guild.member(oldPartnerId);
            if (oldPartner) {
                await message.reply(`ты уже в браке с **${oldPartner.displayName}**!`);
                return;
            }
            else {
                await message.reply(`ты уже в браке с... отсутвующим участником сервера. Думаю никто не обидится~`);
                memberData.deleteProperty('partner');
            }
        }

        await message.channel.send(`**${target.displayName}**, напиши **да**, чтобы пожениться с **${executor.displayName}**`);

        /**
         * @param {{ content: string; }} m
         */
        const filter = m => {
            const lower = m.content.toLowerCase();
            return lower.startsWith('да') || lower.startsWith('нет');
        };

        const result = await message.channel.awaitMessages(filter, { time: 120000, max: 1 });
        const hadAnswer = result.size == 1;

        if (!hadAnswer) {
            await message.reply('ответа не последовало 💔');
            return;
        }

        const success = result.first().content.toLowerCase().startsWith('да');

        if (success) {
            memberData.setProperty('partner', target.id);
            await message.reply('ура! Всё прошло успешно! 💘');
        }
        else {
            await message.reply('оу... Похоже твоё сердце только что разбили. На такие случаи у меня есть команда `f` 💔');
        }
    },
};

module.exports = marryCommand;
