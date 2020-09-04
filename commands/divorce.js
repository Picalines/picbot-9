const { Command } = require("picbot-engine");

const divorceCommand = new Command({
    name: 'divorce',

    description: 'Расторгает ваш брак. Это может быть обидно',
    group: 'Отношения',

    execute: async ({ message, executor, bot: { database } }) => {
        const executorData = await database.getMemberData(executor);

        const partnerId = executorData.getProperty('partner', '');

        if (partnerId == '') {
            await message.reply('у тебя же нет второй половинки... это даже грустно');
            return;
        }

        const partner = message.guild.member(partnerId);
        if (!partner) {
            executorData.deleteProperty('partner');
            await message.reply('ты был в браке с отсутствующим участником сервера. Спасибо за помощь в очистке моей базы данных!');
            return;
        }

        const partnerData = await database.getMemberData(partner);

        executorData.deleteProperty('partner');
        partnerData.deleteProperty('partner');
        await message.reply(`ты успешно развёлся с **${partner.displayName}**. *К этому всё и шло...*`);
    },
});

module.exports = divorceCommand;
