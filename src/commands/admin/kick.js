import { Command, ArgumentSequence, memberReader, optionalReader, remainingTextReader, unorderedList } from "picbot-engine";

export default new Command({
    name: 'kick',

    permissions: ['KICK_MEMBERS'],

    description: 'Кикает участника сервера',
    group: 'Администрирование',

    arguments: new ArgumentSequence(
        {
            description: 'Участник сервера, которого нужно кикнуть',
            reader: memberReader,
        },
        {
            description: 'Причина кика',
            reader: optionalReader(remainingTextReader, 'Злобные админы :/'),
        },
    ),

    tutorial: unorderedList(
        '`kick @Test` кикнет участника @Test по причине ',
        '`kick @Test спам` кикнет @Test по причине "спам"',
    ),

    execute: async ({ message, executor, args: [target, reason] }) => {
        if (executor.id == target.id) {
            throw new Error('Нельзя кикнуть самого себя!');
        }
        if (!target.kickable) {
            throw new Error('Я не могу кикнуть этого участника сервера :/');
        }

        await target.kick(reason);
        await message.reply(`**${target.displayName}** успешно сослан в Сибирь`);
    }
});
