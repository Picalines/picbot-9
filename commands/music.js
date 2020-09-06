const { Command } = require('picbot-engine');
const { player, youtube } = require('../index');
const { inRange, timestamp } = require('../utils');
const { MessageEmbed } = require('discord.js');

const searchMaxResults = 5;

/**
 * @typedef Track
 * @property {string} name
 * @property {string} url
 * @property {string} thumbnail
 * @property {string} author
 * @property {string} duration
 */

/**
 * @typedef PlayerTrackType
 * @property {import('discord.js').User} requestedBy
 * 
 * @typedef {Track & PlayerTrackType} PlayerTrack
 */

/**
 * @param {PlayerTrack} track
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

/**
 * 
 * @param {import('popyt').Video} video 
 * @returns {Promise<Track>}
 */
const videoToTrack = async (video) => {
    if (!video.full)
        await video.fetch();

    const author = (await youtube.getChannel(video.channelId)).name;
    const duration = timestamp(video.minutes * 60 + video.seconds)
    return {
        name: video.title,
        url: video.url,
        thumbnail: video.thumbnails.default.url,
        author,
        duration,
    };
}

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

        /** @type {Track} */
        let track;

        if (isLink) {
            track = await videoToTrack(await youtube.getVideo(request));
        }
        else {
            message.channel.startTyping();

            const { results } = await youtube.searchVideos(request, searchMaxResults);

            message.channel.stopTyping();

            if (!results.length) {
                throw new Error('Ничего не найдено!');
            }

            if (results.length == 1) {
                track = await videoToTrack(results[0]);
            }
            else {
                /**
                 * @param {import("popyt").Video} result
                 * @param {number} index
                 */
                const mapResult = async (result, index) => ({
                    track: await videoToTrack(result),
                    index,
                });

                /** @type {Track[]} */
                const tracks = [];
                for await (const { track, index } of results.map(mapResult)) {
                    tracks[index] = track;
                }

                /**
                 * @param {Track} track
                 * @param {number} index
                 */
                const trackToEmbedField = ({ name, author, duration }, index) => {
                    return {
                        name: `[${index + 1}] ${name}`,
                        value: `Автор: ${author}\nПродолжительность: ${duration}`,
                    };
                };

                await message.reply({
                    embed: new MessageEmbed({
                        color: 0x30b9db,
                        title: 'Результаты поиска',
                        fields: tracks.map(trackToEmbedField)
                    }),
                });

                /**
                 * @param {import('discord.js').Message} msg
                 * @returns {boolean}
                 */
                const selectionFilter = msg => msg.member.id == executor.id && inRange(Number(msg.cleanContent), 1, results.length + 1);

                const awaitedMessages = await message.channel.awaitMessages(selectionFilter, {
                    max: 1, time: 60000,
                });

                const selected = awaitedMessages.first();
                const selectedIndex = selected ? Number(selected.cleanContent) - 1 : NaN;

                if (isNaN(selectedIndex)) {
                    throw new Error('Ничего не выбрано');
                }

                track = tracks[selectedIndex];
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
