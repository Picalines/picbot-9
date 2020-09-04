const { Command } = require("picbot-engine");
const { player } = require("../index");

module.exports = new Command({
    name: 'stop',

    description: 'Бот прекращает играть музыку',
    group: 'Музыка',

    execute: async ({ message, executor }) => {
        if (!executor.voice.channel) {
            throw new Error('Ты не находишься в голосовом канале!');
        }

        const { me, id: guildId } = executor.guild;

        if (!player.isPlaying(guildId)) {
            throw new Error('Я не играю музыку!')
        }

        if (me.voice.channel.id != executor.voice.channel.id) {
            throw new Error('Ты находишься в другом голосовом канале!');
        }

        const { channel: voiceChannel } = executor.voice;

        if (executor.permissions.has('ADMINISTRATOR') || voiceChannel.members.size == 2) {
            await player.stop(guildId);
            await message.reply('музыка успешно остановлена');
            return;
        }

        const thumbsup = '👍';
        await message.react(thumbsup);

        const filter = (r, u) => r.emoji == thumbsup && u != message.author;
        const collected = await message.awaitReactions(filter, { time: 10000 });

        if (collected.size + 1 < voiceChannel.members.size / 2) {
            await message.reply('недостаточно голосов');
            return;
        }

        await player.stop(guildId);
        await message.reply('музыка успешно остановлена');
    }
});
