import { ArgumentSequence, assert, Command, keywordReader, optionalReader, remainingTextReader, unorderedList } from 'picbot-engine';

import { greetingState, GREETING_MEMBER_TEMPLATE } from '../../states/greeting.js';

export default new Command({
    name: 'greeting',

    group: 'Настройки',
    description: 'Настраивает приветствующее сообщение на сервере',

    arguments: new ArgumentSequence(
        {
            description: 'Операция',
            reader: optionalReader(keywordReader('get', 'set', 'disable'), 'get'),
        },
        {
            description: 'Приветствующее сообщение',
            reader: optionalReader(remainingTextReader, null),
        }
    ),

    tutorial: unorderedList(
        '`!greeting` покажет текущее приветствующее сообщение для пользователя @Test',
        `\`!greeting set Привет, $member!\` ставит приветствующее сообщение (${GREETING_MEMBER_TEMPLATE} заменяется на упоминание)`,
        '`!greeting disable` выключит приветствующее сообщение',
    ),

    execute: async ({ message, database, args: [operation, newGreeting] }) => {
        const greeting = database.accessState(message.guild, greetingState);

        if (operation == 'get') {
            await message.reply(await greeting.formatted('`@Test`') ?? '`[отсутствует]`');
            return;
        }

        if (operation == 'disable') {
            await greeting.set(greetingState.defaultValue);
            await message.reply('приветствующее сообщение выключено');
            return;
        }

        assert(newGreeting, 'для `set` нужно указать новое приветствующее сообщение');

        await greeting.set(newGreeting);

        await message.reply('приветствующее сообщение установлено');
    },
});
