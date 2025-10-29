const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'offline',
    description: 'Zeigt an, dass du offline bist',
    async execute(message, args) {
        const embed = new EmbedBuilder()
            .setColor('#FF0000')
            .setTitle('🔴 OFFLINE')
            .setDescription(`**${message.author.username}** ist jetzt offline!`)
            .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp();

        await message.channel.send({ embeds: [embed] });
        await message.delete().catch(() => {});
    }
};
