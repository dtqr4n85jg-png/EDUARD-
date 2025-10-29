const { EmbedBuilder } = require('discord.js');
const config = require('../config');

module.exports = {
    name: 'familie',
    description: 'Zeigt alle Familienmitglieder',
    async execute(message, args) {
        if (!message.member.roles.cache.has(config.MODERATOR_ROLE_ID)) {
            return message.reply('❌ Du hast keine Berechtigung für diesen Befehl!');
        }

        try {
            const members = await message.guild.members.fetch();
            const memberList = members
                .filter(member => !member.user.bot)
                .map(member => {
                    const roles = member.roles.cache
                        .filter(role => role.id !== message.guild.id)
                        .map(role => role.name)
                        .join(', ') || 'Keine Rollen';
                    return `**${member.displayName}** - ${roles}`;
                })
                .join('\n');

            const embed = new EmbedBuilder()
                .setColor('#FF6347')
                .setTitle('🧬 FAMILIEN-MITGLIEDER')
                .setDescription(memberList || 'Keine Mitglieder gefunden')
                .setThumbnail(message.guild.iconURL({ dynamic: true }))
                .setImage('https://i.imgur.com/familie-placeholder.png')
                .setFooter({ text: `Gesamt: ${members.filter(m => !m.user.bot).size} Mitglieder` })
                .setTimestamp();

            await message.channel.send({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            message.reply('❌ Fehler beim Abrufen der Mitglieder!');
        }
    }
};
