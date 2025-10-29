const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'yaro',
    description: 'Gibt eine zufällige Zahl zurück',
    async execute(message, args) {
        const randomNumber = Math.floor(Math.random() * 30) + 1;

        const embed = new EmbedBuilder()
            .setColor('#FF1493')
            .setTitle('📏 Yaro Messung')
            .setDescription(`**${message.author.username}** hat **${randomNumber} cm**! 😏`)
            .setTimestamp();

        message.channel.send({ embeds: [embed] });
    }
};
