const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'events',
    description: 'Zeigt Event-Zeiten an',
    async execute(message, args) {
        const sommerEmbed = new EmbedBuilder()
            .setColor('#FFD700')
            .setTitle('☀️ **SOMMER EVENT-ZEITEN**')
            .setDescription('**HAFEN-SOMMER** ⚓\n`13 | 15 | 17 | 19 | 21 | 23 Uhr`\n\n**ARMY-SOMMER** 🪖\n`12 | 14 | 16 | 18 | 20 | 22 Uhr`')
            .setImage('https://i.imgur.com/summer-placeholder.png')
            .setFooter({ text: 'Sommer Event-Zeiten' })
            .setTimestamp();

        const winterEmbed = new EmbedBuilder()
            .setColor('#87CEEB')
            .setTitle('❄️ **WINTER EVENT-ZEITEN**')
            .setDescription('**HAFEN-WINTER** ⚓\n`12 | 14 | 16 | 18 | 20 | 22 Uhr`\n\n**ARMY-WINTER** 🪖\n`13 | 15 | 17 | 19 | 21 | 23 Uhr`')
            .setImage('https://i.imgur.com/winter-placeholder.png')
            .setFooter({ text: 'Winter Event-Zeiten' })
            .setTimestamp();

        await message.channel.send({ embeds: [sommerEmbed, winterEmbed] });
    }
};
