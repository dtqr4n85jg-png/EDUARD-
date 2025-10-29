const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const config = require('../config');

module.exports = {
    name: 'casino',
    description: 'Spiele im Casino',
    async execute(message, args, client) {
        if (message.channel.id !== config.CASINO_CHANNEL_ID) {
            return message.reply(`❌ Dieser Befehl kann nur in <#${config.CASINO_CHANNEL_ID}> verwendet werden!`);
        }

        if (!client.userBalances.has(message.author.id)) {
            client.userBalances.set(message.author.id, 1000);
        }

        const balance = client.userBalances.get(message.author.id);

        const embed = new EmbedBuilder()
            .setColor('#FFD700')
            .setTitle('🎰 CASINO')
            .setDescription('Willkommen im Casino!\n\nDrücke auf **SPIN**, um dein Glück zu versuchen!')
            .addFields(
                { name: '💰 Dein Guthaben', value: `${balance} Chips`, inline: true },
                { name: '💵 Einsatz', value: '100 Chips', inline: true }
            )
            .setFooter({ text: 'Viel Glück!' })
            .setTimestamp();

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`casino_spin_${message.author.id}`)
                    .setLabel('🎰 SPIN')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId(`casino_work_${message.author.id}`)
                    .setLabel('💼 ARBEITEN')
                    .setStyle(ButtonStyle.Primary)
            );

        await message.channel.send({ embeds: [embed], components: [row] });
    },

    async handleButton(interaction, client) {
        const userId = interaction.customId.split('_').pop();
        
        if (interaction.user.id !== userId) {
            return interaction.reply({ content: '❌ Das ist nicht dein Spiel!', ephemeral: true });
        }

        if (interaction.customId.startsWith('casino_work')) {
            if (!client.userBalances.has(interaction.user.id)) {
                client.userBalances.set(interaction.user.id, 1000);
            }

            const earnings = Math.floor(Math.random() * 200) + 50;
            client.userBalances.set(interaction.user.id, client.userBalances.get(interaction.user.id) + earnings);

            const workEmbed = new EmbedBuilder()
                .setColor('#32CD32')
                .setTitle('💼 Arbeit erledigt!')
                .setDescription(`Du hast **${earnings} Chips** verdient!`)
                .addFields({ name: '💰 Neues Guthaben', value: `${client.userBalances.get(interaction.user.id)} Chips` })
                .setTimestamp();

            return interaction.reply({ embeds: [workEmbed], ephemeral: true });
        }

        if (interaction.customId.startsWith('casino_spin')) {
            if (!client.userBalances.has(interaction.user.id)) {
                client.userBalances.set(interaction.user.id, 1000);
            }

            const balance = client.userBalances.get(interaction.user.id);
            const bet = 100;

            if (balance < bet) {
                return interaction.reply({ content: '❌ Du hast nicht genug Chips! Benutze **ARBEITEN**, um mehr zu verdienen.', ephemeral: true });
            }

            const symbols = ['🍒', '🍋', '7️⃣', '💎', '⭐', '🍇'];
            const slot1 = symbols[Math.floor(Math.random() * symbols.length)];
            const slot2 = symbols[Math.floor(Math.random() * symbols.length)];
            const slot3 = symbols[Math.floor(Math.random() * symbols.length)];

            let winnings = 0;
            let resultText = '';

            if (slot1 === slot2 && slot2 === slot3) {
                winnings = bet * 10;
                resultText = '🎉 **JACKPOT!** 🎉\nDu hast gewonnen!';
            } else if (slot1 === slot2 || slot2 === slot3 || slot1 === slot3) {
                winnings = bet * 2;
                resultText = '✨ **Zwei gleiche!**\nKleiner Gewinn!';
            } else {
                winnings = -bet;
                resultText = '❌ **Verloren!**\nVersuch es nochmal!';
            }

            const newBalance = balance + winnings;
            client.userBalances.set(interaction.user.id, newBalance);

            const resultEmbed = new EmbedBuilder()
                .setColor(winnings > 0 ? '#00FF00' : '#FF0000')
                .setTitle('🎰 SLOT MACHINE')
                .setDescription(`${slot1} | ${slot2} | ${slot3}\n\n${resultText}`)
                .addFields(
                    { name: '💵 Einsatz', value: `${bet} Chips`, inline: true },
                    { name: winnings > 0 ? '💰 Gewinn' : '📉 Verlust', value: `${Math.abs(winnings)} Chips`, inline: true },
                    { name: '💼 Neues Guthaben', value: `${newBalance} Chips`, inline: true }
                )
                .setTimestamp();

            await interaction.update({ embeds: [resultEmbed], components: [] });
        }
    }
};
