const { Command } = require("picbot-engine");
const { player } = require("../index");

module.exports = new Command({
    name: 'skip',

    description: 'Играет следующую песню в очереди',
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

        if (!executor.permissions.has('ADMINISTRATOR')) {
            const current = await player.nowPlaying(guildId);
            if (current.requestedBy.id != executor.user.id) {
                throw new Error(`Этот трек может пропустить только **${current.requestedBy.username}**!`);
            }
        }

        if (player.getQueue(guildId).repeatMode) {
            await player.setRepeatMode(guildId, false);
            await message.channel.send(`Повтор трека выключен`);
        }

        await player.skip(guildId);
        await message.reply('трек успешно пропущен');
    }
});
