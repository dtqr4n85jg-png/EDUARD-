const { EmbedBuilder } = require('discord.js');
const config = require('../config');

module.exports = {
    name: 'hafen',
    description: 'Sendet eine Hafenraub-Ankündigung',
    async execute(message, args) {
        if (!message.member.roles.cache.has(config.MODERATOR_ROLE_ID)) {
            return message.reply('❌ Du hast keine Berechtigung für diesen Befehl!');
        }

        const embed = new EmbedBuilder()
            .setColor('#1E90FF')
            .setTitle('⚓ HAFENRAUB EVENT')
            .setDescription('**Der Hafen wartet auf uns!**\n\nAlle Mann an Bord! Es ist Zeit für den Hafenraub.\n\n💰 Reichtümer warten\n⚓ Zum Hafen bewegen\n🏴‍☠️ Bereit zum Plündern!')
            .setImage('https://i.imgur.com/hafen-placeholder.png')
            .setTimestamp()
            .setFooter({ text: 'Viel Erfolg beim Raid!' });

        await message.channel.send({ embeds: [embed] });
        await message.delete().catch(() => {});
    }
};
