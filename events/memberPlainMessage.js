/**
 * @param {import('picbot-engine').Bot} bot
 * @param {import('discord.js').Message} message 
 */
const onMemberPlainMessage = async (bot, message) => {
    const data = await bot.database.getMemberData(message.member);
    const xp = data.getProperty('xp', 0);
    data.setProperty('xp', xp + 1);
}

module.exports = onMemberPlainMessage;
