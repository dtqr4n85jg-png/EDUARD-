const { EmbedBuilder } = require('discord.js');
const config = require('../config');

module.exports = {
    name: 'crime',
    description: 'Begehe ein Verbrechen (Bankraub)',
    async execute(message, args, client) {
        if (message.channel.id !== config.CASINO_CHANNEL_ID) {
            return message.reply(`❌ Dieser Befehl kann nur in <#${config.CASINO_CHANNEL_ID}> verwendet werden!`);
        }

        const userId = message.author.id;
        
        if (!client.userData.balances[userId]) {
            client.userData.balances[userId] = 1000;
        }

        if (!client.userData.cooldowns) {
            client.userData.cooldowns = {};
        }

        const now = Date.now();
        const cooldownAmount = 180 * 1000;

        if (client.userData.cooldowns[`crime_${userId}`]) {
            const expirationTime = client.userData.cooldowns[`crime_${userId}`] + cooldownAmount;

            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000;
                const minutes = Math.floor(timeLeft / 60);
                const seconds = Math.ceil(timeLeft % 60);
                return message.reply(`⏰ Du musst noch ${minutes}m ${seconds}s warten, bevor du ein weiteres Verbrechen begehen kannst!`);
            }
        }

        if (client.userData.balances[userId] < 300) {
            return message.reply('❌ Du brauchst mindestens 300 Münzen, um ein Verbrechen zu begehen!');
        }

        const crimes = [
            { name: 'Bankraub', emoji: '🏦', successChance: 0.35, reward: [800, 1500], penalty: [400, 600] },
            { name: 'Juwelendiebstahl', emoji: '💎', successChance: 0.4, reward: [600, 1200], penalty: [300, 500] },
            { name: 'Casino-Heist', emoji: '🎰', successChance: 0.3, reward: [1000, 2000], penalty: [500, 800] },
            { name: 'Geldtransporter-Raub', emoji: '🚛', successChance: 0.38, reward: [700, 1400], penalty: [350, 550] }
        ];

        const crime = crimes[Math.floor(Math.random() * crimes.length)];
        const success = Math.random() < crime.successChance;

        let embed;

        if (success) {
            const reward = Math.floor(Math.random() * (crime.reward[1] - crime.reward[0] + 1)) + crime.reward[0];
            client.userData.balances[userId] += reward;
            client.userData.cooldowns[`crime_${userId}`] = now;
            client.scheduleSave();

            embed = new EmbedBuilder()
                .setColor('#00FF00')
                .setTitle(`${crime.emoji} **VERBRECHEN ERFOLGREICH**`)
                .setDescription(`Du hast erfolgreich einen **${crime.name}** durchgeführt!`)
                .addFields(
                    { name: '💰 Beute', value: `**${reward} Münzen**`, inline: true },
                    { name: '💼 Neues Guthaben', value: `**${client.userData.balances[userId]} Münzen**`, inline: true },
                    { name: '⏰ Cooldown', value: '3 Minuten', inline: true }
                )
                .setFooter({ text: 'Du bist entkommen!' })
                .setTimestamp();
        } else {
            const penalty = Math.floor(Math.random() * (crime.penalty[1] - crime.penalty[0] + 1)) + crime.penalty[0];
            const actualPenalty = Math.min(penalty, client.userData.balances[userId]);
            client.userData.balances[userId] -= actualPenalty;
            client.userData.cooldowns[`crime_${userId}`] = now;
            client.scheduleSave();

            embed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('🚨 **VERHAFTET!**')
                .setDescription(`Du wurdest beim **${crime.name}** erwischt!`)
                .addFields(
                    { name: '💸 Strafe', value: `**${actualPenalty} Münzen**`, inline: true },
                    { name: '💰 Neues Guthaben', value: `**${client.userData.balances[userId]} Münzen**`, inline: true },
                    { name: '⏰ Cooldown', value: '3 Minuten', inline: true }
                )
                .setFooter({ text: 'Die Polizei hat dich geschnappt!' })
                .setTimestamp();
        }

        await message.channel.send({ embeds: [embed] });
    }
};
