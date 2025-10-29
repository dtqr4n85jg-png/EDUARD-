const { EmbedBuilder } = require('discord.js');
const config = require('../config');

module.exports = {
    name: 'rich',
    aliases: ['leaderboard', 'top'],
    description: 'Zeigt die reichsten Spieler',
    async execute(message, args, client) {
        if (message.channel.id !== config.CASINO_CHANNEL_ID) {
            return message.reply(`❌ Dieser Befehl kann nur in <#${config.CASINO_CHANNEL_ID}> verwendet werden!`);
        }

        if (!client.userData.balances || Object.keys(client.userData.balances).length === 0) {
            return message.reply('❌ Noch keine Spieler haben Münzen!');
        }

        const sortedUsers = Object.entries(client.userData.balances)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10);

        let leaderboard = '';
        const medals = ['🥇', '🥈', '🥉'];

        for (let i = 0; i < sortedUsers.length; i++) {
            const [userId, balance] = sortedUsers[i];
            
            try {
                const user = await message.client.users.fetch(userId);
                const medal = i < 3 ? medals[i] : `**${i + 1}.**`;
                const username = user.username;
                
                leaderboard += `${medal} **${username}**\n`;
                leaderboard += `   💰 ${balance.toLocaleString()} Münzen\n\n`;
            } catch (error) {
                console.error(`Fehler beim Abrufen des Users ${userId}:`, error);
            }
        }

        const userBalance = client.userData.balances[message.author.id] || 0;
        const userRank = Object.entries(client.userData.balances)
            .sort((a, b) => b[1] - a[1])
            .findIndex(([id]) => id === message.author.id) + 1;

        const embed = new EmbedBuilder()
            .setColor('#FFD700')
            .setTitle('💎 **REICHSTEN SPIELER**')
            .setDescription(leaderboard || 'Keine Daten verfügbar')
            .addFields(
                { name: '📊 Dein Rang', value: `#${userRank}`, inline: true },
                { name: '💰 Dein Guthaben', value: `${userBalance.toLocaleString()} Münzen`, inline: true }
            )
            .setFooter({ text: `Gesamt: ${Object.keys(client.userData.balances).length} Spieler` })
            .setTimestamp();

        await message.channel.send({ embeds: [embed] });
    }
};
