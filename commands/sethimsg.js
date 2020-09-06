const { Command } = require('picbot-engine');

module.exports = new Command({
    name: 'sethimsg',

    description: 'Ставит сообщение, которое пишет бот новому участнику сервера в системном канале',
    group: 'Настройки',

    permissions: ['MANAGE_GUILD'],

    syntax: '<remainingText:hiMessage=>',

    examples: [
        '`!sethimsg Здравствуй @member` - бот напишет: "Здравствуй, @Test!"'
    ],

    execute: async ({ message, executor: { guild }, bot: { database }, args: { hiMessage } }) => {
        const guildData = await database.getGuildData(guild);

        if (!(typeof hiMessage == 'string' && hiMessage)) {
            guildData.deleteProperty('helloMemberMessage');
            await message.reply('приветствие отключено');
            return;
        }

        if (!hiMessage.includes('@member')) {
            hiMessage += ', @member';
        }

        guildData.setProperty('helloMemberMessage', hiMessage);

        await message.reply('приветствие успешно установлено');
    },
});
