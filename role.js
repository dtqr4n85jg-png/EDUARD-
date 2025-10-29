const { EmbedBuilder } = require('discord.js');
const config = require('../config');

module.exports = {
    name: 'role',
    description: 'Gibt oder entfernt eine Rolle',
    async execute(message, args) {
        if (!message.member.roles.cache.has(config.MODERATOR_ROLE_ID)) {
            return message.reply('❌ Du hast keine Berechtigung für diesen Befehl!');
        }

        const user = message.mentions.users.first();
        const role = message.mentions.roles.first();

        if (!user || !role) {
            return message.reply('Bitte erwähne einen User und eine Rolle!');
        }

        try {
            const member = await message.guild.members.fetch(user.id);
            
            if (member.roles.cache.has(role.id)) {
                await member.roles.remove(role);
                const embed = new EmbedBuilder()
                    .setColor('#FF6347')
                    .setTitle('🎭 Rolle entfernt')
                    .setDescription(`Die Rolle ${role} wurde von **${user.tag}** entfernt.`)
                    .setTimestamp();
                message.channel.send({ embeds: [embed] });
            } else {
                await member.roles.add(role);
                const embed = new EmbedBuilder()
                    .setColor('#32CD32')
                    .setTitle('🎭 Rolle hinzugefügt')
                    .setDescription(`Die Rolle ${role} wurde **${user.tag}** gegeben.`)
                    .setTimestamp();
                message.channel.send({ embeds: [embed] });
            }
        } catch (error) {
            console.error(error);
            message.reply('Fehler beim Verwalten der Rolle!');
        }
    }
};
