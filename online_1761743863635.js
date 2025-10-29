const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'online',
    description: 'Zeigt an, dass du online bist',
    async execute(message, args) {
        const embed = new EmbedBuilder()
            .setColor('#00FF00')
            .setTitle('🟢 ONLINE')
            .setDescription(`**${message.author.username}** ist jetzt online!`)
            .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp();

        await message.channel.send({ embeds: [embed] });
        await message.delete().catch(() => {});
    }
};
