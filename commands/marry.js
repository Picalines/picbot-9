/**
 * @param {import('discord.js').Message} message
 * @param {import('picbot-engine').GuildMemberData} memberData 
 * @param {boolean} isExecutor 
 */
const testAlreadyMarried = async (message, memberData, isExecutor) => {
    const partnerId = memberData.getProperty('partner', '');
    const alreadyMarried = partnerId != '';

    if (alreadyMarried) {
        const oldPartner = message.guild.member(partnerId);
        let firstPart = isExecutor ? 'ты' : `**${memberData.member.displayName}**`;
        if (oldPartner) {
            await message.reply(`${firstPart} уже в браке с **${oldPartner.displayName}**`);
            return false;
        }
        else {
            await message.reply(`${firstPart} уже в браке с... отсутствующим участником сервера. Думаю никто не обидется~`);
            memberData.deleteProperty('partner');
        }
    }

    return true;
}

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

    execute: async ({ executor, message, args: { target }, bot: { database } }) => {
        const executorData = await database.getMemberData(executor);
        if (!(await testAlreadyMarried(message, executorData, true)))
            return;

        const targetData = await database.getMemberData(target);
        if (!(await testAlreadyMarried(message, targetData, false)))
            return;

        await message.channel.send(`**${target.displayName}**, напиши **да**, чтобы пожениться с **${executor.displayName}**`);

        /**
         * @param {{ content: string; }} msg
         */
        const filter = msg => {
            const lower = msg.content.toLowerCase();
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
            executorData.setProperty('partner', target.id);
            targetData.setProperty('partner', executor.id);
            await message.reply('ура! Всё прошло успешно! 💘');
        }
        else {
            await message.reply('оу... Похоже твоё сердце только что разбили. На такие случаи у меня есть команда `f` 💔');
        }
    },
};

module.exports = marryCommand;
