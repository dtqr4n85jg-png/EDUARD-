const { PermissionFlagsBits } = require('discord.js');
const config = require('../config');

module.exports = {
    name: 'clear',
    description: 'Löscht bis zu 100 Nachrichten',
    async execute(message, args) {
        if (!message.member.roles.cache.has(config.MODERATOR_ROLE_ID) && 
            !message.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
            return message.reply('❌ Du hast keine Berechtigung für diesen Befehl!');
        }

        const amount = parseInt(args[0]);

        if (!amount || amount < 1 || amount > 100) {
            return message.reply('Bitte gib eine Zahl zwischen 1 und 100 an!');
        }

        try {
            await message.channel.bulkDelete(amount + 1, true);
            const reply = await message.channel.send(`✅ ${amount} Nachrichten wurden gelöscht!`);
            setTimeout(() => reply.delete().catch(() => {}), 3000);
        } catch (error) {
            console.error(error);
            message.reply('Fehler beim Löschen der Nachrichten!');
        }
    }
};
