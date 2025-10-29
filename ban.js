const { PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const config = require('../config');

module.exports = {
    name: 'ban',
    description: 'Bannt einen User vom Server',
    async execute(message, args) {
        if (!message.member.roles.cache.has(config.MODERATOR_ROLE_ID)) {
            return message.reply('❌ Du hast keine Berechtigung für diesen Befehl!');
        }

        const user = message.mentions.users.first();
        if (!user) {
            return message.reply('Bitte erwähne einen User, den du bannen möchtest!');
        }

        const reason = args.slice(1).join(' ') || 'Kein Grund angegeben';

        try {
            const member = await message.guild.members.fetch(user.id);
            await member.ban({ reason });

            const embed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('🔨 User gebannt')
                .setDescription(`**${user.tag}** wurde vom Server gebannt.`)
                .addFields({ name: 'Grund', value: reason })
                .setTimestamp();

            message.channel.send({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            message.reply('Fehler beim Bannen des Users!');
        }
    }
};
