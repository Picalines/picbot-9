const { Command } = require('picbot-engine');
const { player } = require('../index');
const { inRange } = require('../utils');
const { MessageEmbed } = require('discord.js');

const searchMaxResults = 5;

/**
 * @param {any} track
 * @param {string} embedTitle
 */
const makeTrackEmbed = (track, embedTitle) => new MessageEmbed()
    .setColor(0xcc301f)
    .setTitle(embedTitle)
    .setThumbnail(track.thumbnail)
    .setFooter(`Запросил ${track.requestedBy.username}`, track.requestedBy.avatarURL())
    .addFields([
        { name: 'Название', value: `[${track.name}](${track.url})` },
        { name: 'Автор', value: track.author },
        { name: 'Продолжительность', value: track.duration },
    ])

module.exports = new Command({
    name: 'music',
    aliases: ['play'],

    description: 'Играет музыку / добавляет её в очередь',
    group: 'Музыка',

    examples: [
        '`!music https://www.youtube.com/watch?v=dQw4w9WgXcQ` включит *never gonna give you up*',
        '`!music never gonna give you up` найдёт на YouTube видео по *этому* запросу',
    ],

    syntax: '<remainingText:request>',

    execute: async ({ message, executor, args: { request } }) => {
        if (!executor.voice.channel) {
            throw new Error('Ты не находишься в голосовом канале!');
        }

        const { guild, guild: { me } } = executor;

        if (me.voice.channel && executor.voice.channel.id != me.voice.channelID) {
            throw new Error('Я играю музыку в другом голосовом канале!');
        }

        const isLink = /^https?:\/\//.test(request);

        let track;

        if (isLink) {
            track = request;
        }
        else {
            const tracks = (await player.searchTracks(request, true)).slice(0, searchMaxResults);

            if (!tracks.length) {
                throw new Error('Ничего не найдено!');
            }

            if (tracks.length == 1) {
                track = tracks[0];
            }
            else {
                const embed = new MessageEmbed()
                    .setColor(0x30b9db)
                    .setTitle('Результаты поиска');
                
                tracks.forEach(({ name, author, duration }, index) => {
                    embed.addField(`[${index + 1}] ${name}`, `Автор: ${author}\nПродолжительность: ${duration}`);
                });
        
                await message.reply({ embed });
        
                /** @param {import('discord.js').Message} m */
                const filter = m => m.member.id == executor.id && inRange(Number(m.cleanContent), 1, tracks.length + 1);
                const awaited = await message.channel.awaitMessages(filter, {
                    max: 1, time: 60000,
                });
        
                const selected = awaited.first();
                const selectedIndex = Number(selected.cleanContent);
                if (!selected && !isNaN(selectedIndex)) {
                    throw new Error('Ничего не выбрано');
                }
        
                track = tracks[selectedIndex - 1];
            }
        }

        if (player.isPlaying(guild.id)) {
            const result = await player.addToQueue(guild.id, track, executor.user);
            if (result.type == 'playlist') {
                await message.reply(`треки (${result.tracks.length}) из плейлиста добавлены в очередь`);
            }
            else {
                await message.reply({ embed: makeTrackEmbed(result, 'Новый трек добавлен в очередь!') });
            }
        }
        else {
            const playing = await player.play(executor.voice.channel, track, executor.user);

            player.getQueue(guild.id)
            .on('trackChanged', (_, newTrack) => {
                message.channel.send({ embed: makeTrackEmbed(newTrack, 'Играет новый трек!') });
            })
            .on('channelEmpty', () => {
                message.channel.send('Ну и куда вы все ушли?..');
            });

            await message.channel.send({ embed: makeTrackEmbed(playing, 'Играет новый трек!') });
        }
    },
});
