const { EmbedBuilder } = require('discord.js');
const config = require('../config');

module.exports = {
    name: 'work',
    description: 'Arbeite für Münzen',
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
        const cooldownAmount = 60 * 1000;

        if (client.userData.cooldowns[`work_${userId}`]) {
            const expirationTime = client.userData.cooldowns[`work_${userId}`] + cooldownAmount;

            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000;
                return message.reply(`⏰ Du musst noch ${Math.ceil(timeLeft)} Sekunden warten, bevor du wieder arbeiten kannst!`);
            }
        }

        const jobs = [
            { name: 'Pizza-Lieferant', emoji: '🍕', min: 150, max: 300 },
            { name: 'Taxifahrer', emoji: '🚕', min: 200, max: 400 },
            { name: 'Bauarbeiter', emoji: '🏗️', min: 250, max: 450 },
            { name: 'Mechatroniker', emoji: '🔧', min: 300, max: 500 },
            { name: 'Händler', emoji: '💼', min: 350, max: 550 }
        ];

        const job = jobs[Math.floor(Math.random() * jobs.length)];
        const earnings = Math.floor(Math.random() * (job.max - job.min + 1)) + job.min;

        client.userData.balances[userId] += earnings;
        client.userData.cooldowns[`work_${userId}`] = now;
        client.scheduleSave();

        const embed = new EmbedBuilder()
            .setColor('#32CD32')
            .setTitle('💼 **ARBEIT ERLEDIGT**')
            .setDescription(`Du hast als **${job.emoji} ${job.name}** gearbeitet und **${earnings} Münzen** verdient!`)
            .addFields(
                { name: '💰 Neues Guthaben', value: `**${client.userData.balances[userId]} Münzen**`, inline: true },
                { name: '⏰ Cooldown', value: '60 Sekunden', inline: true }
            )
            .setFooter({ text: `${message.author.username}` })
            .setTimestamp();

        await message.channel.send({ embeds: [embed] });
    }
};
