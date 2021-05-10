import { ArgumentSequence, Command, memberReader } from 'picbot-engine';
import partnerState from '../../states/partner.js';

export default new Command({
    name: 'marry',

    description: 'Женит вас на участнике сервера `target`',
    group: 'Отношения',

    tutorial: '`!marry @Test` поженит вас на участнике сервера @Test',

    arguments: new ArgumentSequence(
        {
            description: 'Возлюбленный участник сервера',
            reader: memberReader,
        }
    ),

    execute: async ({ executor, message, bot: { database }, args: [target] }) => {
        if (executor.user.bot || target.user.bot) {
            throw new Error('🤖?');
        }

        const executorPartnerAccess = database.accessState(executor, partnerState);
        const targetPartnerAccess = database.accessState(target, partnerState);

        if (await executorPartnerAccess.member()) {
            throw new Error('Ты уже состоишь в браке. Стоп...');
        }

        if (await targetPartnerAccess.member()) {
            throw new Error(`**${target.displayName}** уже состоит в браке. Понимаю, обидно.`);
        }

        await message.channel.send(`**${target.displayName}**, напиши **да**, чтобы пожениться с **${executor.displayName}**`);

        /**
         * @param {import('picbot-engine').GuildMessage} msg
         */
        const answerFilter = msg => {
            if (msg.member.id != target.id) {
                return false;
            }

            const lower = msg.cleanContent.toLowerCase();
            return lower.endsWith('да') || lower.endsWith('нет');
        };

        const result = await message.channel.awaitMessages(answerFilter, { time: 120000, max: 1 });
        const hadAnswer = result.size == 1;

        if (!hadAnswer) {
            await message.reply('ответа не последовало 💔');
            return;
        }

        const success = result.first()?.content.toLowerCase().startsWith('да');

        if (!success) {
            await message.reply('оу... Похоже твоё сердце только что разбили. На такие случаи у меня есть команда `f` 💔');
            return;
        }

        await Promise.all([
            executorPartnerAccess.set(target.id),
            targetPartnerAccess.set(executor.id),
        ]);

        await message.reply('ура! Всё прошло успешно! 💘');
    },
});
