const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'commands',
    aliases: ['help', 'hilfe'],
    description: 'Zeigt alle verfügbaren Commands',
    async execute(message, args) {
        const embed = new EmbedBuilder()
            .setColor('#FFA500')
            .setTitle('📜 **FAMILIEN-MANAGER COMMANDS**')
            .setDescription('Hier ist eine Übersicht aller verfügbaren Befehle:\n')
            .addFields(
                {
                    name: '⚙️ **MODERATION**',
                    value: '`!clear <Anzahl>` - Nachrichten löschen\n`!ban <@User> [Grund]` - User bannen\n`!timeout <@User> <Minuten> [Grund]` - Timeout vergeben\n`!role <@User> <@Rolle>` - Rolle verwalten',
                    inline: false
                },
                {
                    name: '⚔️ **EVENTS**',
                    value: '`!army` - Army Event ankündigen 🪖\n`!hafen` - Hafenraub ankündigen ⚓',
                    inline: false
                },
                {
                    name: '🎭 **FUN**',
                    value: '`!cosanostra` - Mafia Geschichte 💀\n`!yaro` - Zufällige Zahl 📏\n`!azul` - Azul Spruch 💬\n`!casino` - Casino Slot Machine 🎰',
                    inline: false
                },
                {
                    name: '📊 **STATUS**',
                    value: '`!online` - Online Status 🟢\n`!offline` - Offline Status 🔴',
                    inline: false
                },
                {
                    name: '📑 **SERVER-SYSTEME**',
                    value: '`!setupticket` - Ticket-System erstellen 🎫\n`!closeticket` - Ticket schließen 🗑️\n`!embed` - Custom Embed erstellen 🧾\n`!familie` - Mitglieder anzeigen 🧬\n`!events` - Event-Zeiten anzeigen 🕓\n`!vorschlag` - Vorschlag einreichen 💡',
                    inline: false
                }
            )
            .setFooter({ text: 'Familien-Manager Bot | Erstellt von HXT 1' })
            .setTimestamp();

        await message.channel.send({ embeds: [embed] });
    }
};
