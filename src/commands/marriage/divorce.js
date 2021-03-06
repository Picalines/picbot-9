import { Command } from 'picbot-engine';

import { partnerState } from '../../states/partner.js';

export default new Command({
    name: 'divorce',

    description: 'Расторгает ваш брак. Это может быть обидно',
    group: 'Отношения',

    tutorial: '`!divorce` растогнет ваш брак',

    execute: async ({ message, executor, bot: { database } }) => {
        const executorPartnerAccess = database.accessState(executor, partnerState);

        const partner = await executorPartnerAccess.member();

        if (!partner) {
            await message.reply('у тебя же нет второй половинки... это даже грустно');
            return;
        }

        const partnersPartnerAccess = database.accessState(partner, partnerState);

        await Promise.all([
            executorPartnerAccess.reset(),
            partnersPartnerAccess.reset()
        ]);

        await message.reply(`ты успешно развёлся с **${partner.displayName}**. *К этому всё и шло...*`);
    },
});
