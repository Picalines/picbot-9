import { Command, ArgumentSequence, numberReader } from "picbot-engine";

export default new Command({
    name: 'clear',

    permissions: ['MANAGE_MESSAGES'],

    description: 'Удаляет N сообщений',
    group: 'Администрирование',

    arguments: new ArgumentSequence(
        {
            description: 'Количество сообщений для очистки',
            reader: numberReader('int', [1, Infinity]),
        },
    ),

    tutorial: '`clear 10` удалит 10 сообщений"',

    execute: async ({ message: { channel }, args: [count] }) => {
        await channel.bulkDelete(count + 1);
    },
});
