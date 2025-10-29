const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'azul',
    description: 'Antwortet mit einem Spruch',
    async execute(message, args) {
        const embed = new EmbedBuilder()
            .setColor('#00CED1')
            .setTitle('💬 Azul')
            .setDescription('**Azul die piçes!** 😎')
            .setTimestamp();

        message.channel.send({ embeds: [embed] });
    }
};
