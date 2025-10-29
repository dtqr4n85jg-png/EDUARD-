const { EmbedBuilder } = require('discord.js');
const config = require('../config');

module.exports = {
    name: 'timeout',
    description: 'Gibt einem User einen Timeout',
    async execute(message, args) {
        if (!message.member.roles.cache.has(config.MODERATOR_ROLE_ID)) {
            return message.reply('❌ Du hast keine Berechtigung für diesen Befehl!');
        }

        const user = message.mentions.users.first();
        if (!user) {
            return message.reply('Bitte erwähne einen User!');
        }

        const minutes = parseInt(args[1]);
        if (!minutes || minutes < 1) {
            return message.reply('Bitte gib eine gültige Anzahl von Minuten an!');
        }

        const reason = args.slice(2).join(' ') || 'Kein Grund angegeben';

        try {
            const member = await message.guild.members.fetch(user.id);
            await member.timeout(minutes * 60 * 1000, reason);

            const embed = new EmbedBuilder()
                .setColor('#FFA500')
                .setTitle('⏳ Timeout vergeben')
                .setDescription(`**${user.tag}** wurde für ${minutes} Minuten stummgeschaltet.`)
                .addFields({ name: 'Grund', value: reason })
                .setTimestamp();

            message.channel.send({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            message.reply('Fehler beim Timeout!');
        }
    }
};
