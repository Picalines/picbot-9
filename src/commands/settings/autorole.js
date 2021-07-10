import { ArgumentSequence, assert, Command, keywordReader, optionalReader, roleReader, unorderedList } from 'picbot-engine';

import { autoroleState } from '../../states/autorole.js';

export default new Command({
    name: 'autorole',

    group: 'Настройки',
    description: 'Устанавливает роль, которую бот будет автоматически ставить новым участникам сервера (когда бот включен!)',

    permissions: 'MANAGE_ROLES',

    arguments: new ArgumentSequence(
        {
            description: 'Операция',
            reader: optionalReader(keywordReader('get', 'set', 'disable'), 'get'),
        },
        {
            description: 'Роль',
            reader: optionalReader(roleReader, null),
        },
    ),

    tutorial: unorderedList(
        '`!autorole get` напишет текущую авто-роль',
        '`!autorole set @Test` установит авто-роль @Test',
        '`!autorole disable` выключит авто-роль на сервере',
    ),

    execute: async ({ message, database, args: [operation, newAutoRole] }) => {
        const autorole = database.accessState(message.guild, autoroleState);

        if (operation == 'get') {
            await message.reply(String(await autorole.value() ?? '[отсутствует]'));
            return;
        }

        if (operation == 'disable') {
            await autorole.set(null);
            await message.reply('авто-роль выключена');
            return;
        }

        assert(newAutoRole, 'для `set` нужно упомянуть роль');
        assert(message.guild.me.hasPermission('MANAGE_ROLES'), 'бот не может управлять ролями (недостаточно прав)');
        assert(message.guild.me.roles.highest.comparePositionTo(newAutoRole) >= 0, 'у бота недостаточно прав на эту роль');

        await autorole.set(newAutoRole);

        await message.reply('новая авто-роль установлена');
    },
});
