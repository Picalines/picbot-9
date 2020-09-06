const { TextChannel } = require('discord.js');

/**
 * @param {import('discord.js').Client} _
 * @param {import('picbot-engine').Bot} bot
 * @param {import('discord.js').GuildMember} member
 */
const onGuildMemberAdd = async (_, bot, member) => {
    const guildData = await bot.database.getGuildData(member.guild);

    const channel = member.guild.channels.cache.get(member.guild.systemChannelID);
    if (!(channel instanceof TextChannel)) {
        return;
    }

    let message = guildData.getProperty('helloMemberMessage', '');
    if (!message) {
        return;
    }
    
    message = message.replace('@member', member.toString());

    await channel.send(message);
}

module.exports = onGuildMemberAdd;
