const config = require('../config');

module.exports = {
    name: 'closeticket',
    description: 'Schließt ein Ticket',
    async execute(message, args) {
        if (!message.member.roles.cache.has(config.MODERATOR_ROLE_ID)) {
            return message.reply('❌ Du hast keine Berechtigung für diesen Befehl!');
        }

        if (!message.channel.name.includes('beschwerde') && 
            !message.channel.name.includes('support') && 
            !message.channel.name.includes('bewerbung')) {
            return message.reply('❌ Dieser Befehl kann nur in Ticket-Channels verwendet werden!');
        }

        await message.channel.send('🗑️ Ticket wird in 3 Sekunden geschlossen...');
        setTimeout(() => {
            message.channel.delete().catch(console.error);
        }, 3000);
    }
};
