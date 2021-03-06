import { Command, ArgumentSequence, optionalReader, keywordReader, wordReader, unorderedList } from "picbot-engine";

import { prefixesState } from "../../states/prefixes.js";

export default new Command({
    name: 'prefix',

    group: 'Настройки',
    description: 'Команда управления префиксами на сервере',

    arguments: new ArgumentSequence(
        {
            description: 'Операция с префиксами (list | add | rm)',
            reader: optionalReader(keywordReader('list', 'add', 'rm'), 'list'),
        },
        {
            description: 'Префикс для добавления (add) / удаления (rm)',
            reader: optionalReader(wordReader, null),
        },
    ),

    tutorial: unorderedList(
        '`!prefix` даст список префиксов бота на сервере',
        '`!prefix add ~` добавит `~` в список префиксов бота',
        '`!prefix rm ~` удалит `~` из списка префиксов бота',
    ),

    execute: async ({ message, executor, bot, args: [operation, prefix] }) => {
        const prefixes = bot.database.accessState(message.guild, prefixesState);

        if (operation == 'list') {
            const list = (await prefixes.value()).map(p => `\`${p}\``).join(', ');
            await message.reply(`список моих префиксов на этом сервере: ${list}`);
            return;
        }

        if (!executor.permissions.has('MANAGE_GUILD')) {
            throw new Error('Для `add` и `rm` нужно право управления сервером');
        }

        if (!prefix) {
            throw new Error(`Для операции ${operation} необходимо указать префикс`);
        }

        switch (operation) {
            default:
                throw new Error(`Операция '${operation}' не поддерживается`);

            case 'add':
                if (await prefixes.add(prefix)) {
                    await message.reply(`новый префикс команд: \`${prefix}\``);
                }
                else {
                    await message.reply(`невозомжно добавить префикс \`${prefix}\``);
                }
                break;

            case 'rm':
                if (await prefixes.remove(prefix)) {
                    await message.reply(`префикс \`${prefix}\` успешно удалён из списка`);
                }
                else {
                    await message.reply(`невозомжно удалить префикс \`${prefix}\``);
                }
                break;
        }
    }
});
