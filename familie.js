const { EmbedBuilder } = require('discord.js');
const config = require('../config');

module.exports = {
    name: 'familie',
    description: 'Zeigt alle Familienmitglieder sortiert nach Rang',
    async execute(message, args) {
        if (!message.member.roles.cache.has(config.MODERATOR_ROLE_ID)) {
            return message.reply('❌ Du hast keine Berechtigung für diesen Befehl!');
        }

        try {
            const members = await message.guild.members.fetch();
            
            const memberData = members
                .filter(member => !member.user.bot)
                .map(member => {
                    const roles = member.roles.cache
                        .filter(role => role.id !== message.guild.id)
                        .sort((a, b) => b.position - a.position);
                    
                    const highestRole = roles.first();
                    const rolePosition = highestRole ? highestRole.position : 0;
                    const roleName = highestRole ? highestRole.name : 'Keine Rolle';
                    
                    return {
                        name: member.displayName,
                        role: roleName,
                        position: rolePosition,
                        member: member
                    };
                })
                .sort((a, b) => b.position - a.position);

            let memberList = '';
            let currentRole = null;

            memberData.forEach((data, index) => {
                if (currentRole !== data.role) {
                    currentRole = data.role;
                    if (index > 0) {
                        memberList += '\n';
                    }
                    memberList += `**━━━ ${currentRole} ━━━**\n`;
                }
                memberList += `• **${data.name}**\n`;
            });

            const embed = new EmbedBuilder()
                .setColor('#FF6347')
                .setTitle('🧬 **FAMILIEN-MITGLIEDER**')
                .setDescription(memberList || 'Keine Mitglieder gefunden')
                .setThumbnail(message.guild.iconURL({ dynamic: true }))
                .setFooter({ text: `Gesamt: ${members.filter(m => !m.user.bot).size} Mitglieder` })
                .setTimestamp();

            await message.channel.send({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            message.reply('❌ Fehler beim Abrufen der Mitglieder!');
        }
    }
};
