const { EmbedBuilder } = require('discord.js');
const config = require('../config');

module.exports = {
    name: 'rob',
    description: 'Raube einen anderen Spieler aus',
    async execute(message, args, client) {
        if (message.channel.id !== config.CASINO_CHANNEL_ID) {
            return message.reply(`❌ Dieser Befehl kann nur in <#${config.CASINO_CHANNEL_ID}> verwendet werden!`);
        }

        const userId = message.author.id;
        const target = message.mentions.users.first();

        if (!target) {
            return message.reply('❌ Du musst einen Spieler erwähnen, den du ausrauben möchtest! Beispiel: `!rob @User`');
        }

        if (target.id === userId) {
            return message.reply('❌ Du kannst dich nicht selbst ausrauben!');
        }

        if (target.bot) {
            return message.reply('❌ Du kannst keine Bots ausrauben!');
        }

        if (!client.userData.balances[userId]) {
            client.userData.balances[userId] = 1000;
        }

        if (!client.userData.balances[target.id]) {
            client.userData.balances[target.id] = 1000;
        }

        if (!client.userData.cooldowns) {
            client.userData.cooldowns = {};
        }

        const now = Date.now();
        const cooldownAmount = 120 * 1000;

        if (client.userData.cooldowns[`rob_${userId}`]) {
            const expirationTime = client.userData.cooldowns[`rob_${userId}`] + cooldownAmount;

            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000;
                return message.reply(`⏰ Du musst noch ${Math.ceil(timeLeft)} Sekunden warten, bevor du wieder jemanden ausrauben kannst!`);
            }
        }

        if (client.userData.balances[userId] < 200) {
            return message.reply('❌ Du brauchst mindestens 200 Münzen, um jemanden auszurauben!');
        }

        if (client.userData.balances[target.id] < 100) {
            return message.reply(`❌ ${target.username} hat nicht genug Münzen zum Ausrauben!`);
        }

        const successChance = 0.5;
        const success = Math.random() < successChance;

        let embed;

        if (success) {
            const stolenAmount = Math.floor(Math.random() * (client.userData.balances[target.id] * 0.3)) + 50;
            const actualStolen = Math.min(stolenAmount, client.userData.balances[target.id]);

            client.userData.balances[userId] += actualStolen;
            client.userData.balances[target.id] -= actualStolen;
            client.userData.cooldowns[`rob_${userId}`] = now;
            client.scheduleSave();

            embed = new EmbedBuilder()
                .setColor('#00FF00')
                .setTitle('💰 **RAUB ERFOLGREICH**')
                .setDescription(`Du hast **${target.username}** erfolgreich ausgeraubt!`)
                .addFields(
                    { name: '💵 Gestohlen', value: `**${actualStolen} Münzen**`, inline: true },
                    { name: '💰 Neues Guthaben', value: `**${client.userData.balances[userId]} Münzen**`, inline: true }
                )
                .setFooter({ text: `${message.author.username} vs ${target.username}` })
                .setTimestamp();
        } else {
            const fine = Math.floor(Math.random() * 150) + 100;
            const actualFine = Math.min(fine, client.userData.balances[userId]);

            client.userData.balances[userId] -= actualFine;
            client.userData.cooldowns[`rob_${userId}`] = now;
            client.scheduleSave();

            embed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('🚨 **RAUB FEHLGESCHLAGEN**')
                .setDescription(`Du wurdest beim Versuch erwischt, **${target.username}** auszurauben!`)
                .addFields(
                    { name: '💸 Strafe', value: `**${actualFine} Münzen**`, inline: true },
                    { name: '💰 Neues Guthaben', value: `**${client.userData.balances[userId]} Münzen**`, inline: true }
                )
                .setFooter({ text: 'Nächstes Mal vielleicht!' })
                .setTimestamp();
        }

        await message.channel.send({ embeds: [embed] });
    }
};
