const { EmbedBuilder } = require('discord.js');
const config = require('../config');

module.exports = {
    name: 'army',
    description: 'Sendet eine Army-Event-Ankündigung',
    async execute(message, args) {
        if (!message.member.roles.cache.has(config.MODERATOR_ROLE_ID)) {
            return message.reply('❌ Du hast keine Berechtigung für diesen Befehl!');
        }

        const embed = new EmbedBuilder()
            .setColor('#8B0000')
            .setTitle('🪖 ARMY EVENT')
            .setDescription('**Es ist Zeit für das Army Event!**\n\nAlle Mitglieder werden gebeten, sich vorzubereiten und teilzunehmen.\n\n🔫 Ausrüstung checken\n👥 Team sammeln\n⚔️ Bereit für den Kampf!')
            .setImage('https://i.imgur.com/army-placeholder.png')
            .setTimestamp()
            .setFooter({ text: 'Viel Erfolg!' });

        await message.channel.send({ embeds: [embed] });
        await message.delete().catch(() => {});
    }
};
