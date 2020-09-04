const { Command } = require("picbot-engine");
const { player } = require("../index");

module.exports = new Command({
    name: 'loop',

    description: 'Зацикливает текущую песню',
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

        const repeatMode = !player.getQueue(guildId).repeatMode;
        
        await player.setRepeatMode(guildId, repeatMode);
        await message.reply(`повтор трека ${repeatMode ? 'включен' : 'выключен'}`)
    }
});
